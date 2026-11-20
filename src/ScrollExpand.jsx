// Adapted from React Bits <ScrollExpand /> (JS + CSS variant).
// Changes for this site:
// - steady stage height on phones (the collapsing browser toolbar no longer resizes the section mid-scroll)
// - prefers-reduced-motion or enabled={false}: show the finished state with no pinned scroll
// - overlay links are only clickable once the overlay is visible
// - exposes the eased progress (0–1) as the CSS variable --se-progress for extra styling
// - images lazy-load; videos load and play only near the viewport (never under reduced motion)
// - title accepts any React node; idle instances skip work while the page scrolls elsewhere
import React, { useCallback, useEffect, useRef } from 'react';

import './ScrollExpand.css';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * @typedef {Object} ScrollExpandProps
 * @property {string} [src] Image or video URL shown inside the frame.
 * @property {'image' | 'video'} [mediaType]
 * @property {string} [poster] Poster frame used while a video loads.
 * @property {string} [alt]
 * @property {import('react').ReactNode} [title] Headline held over the frame that lifts away as the media takes over.
 * @property {string} [scrollHint] Small cue under the resting frame.
 * @property {number} [startWidth] Resting frame width, % of the stage.
 * @property {number} [startHeight] Resting frame height, % of the stage.
 * @property {number} [startRadius] Resting corner radius, px.
 * @property {number} [endRadius] Expanded corner radius, px.
 * @property {number} [mediaZoom] Zoom at rest; eases back to 1.
 * @property {number} [scrollDistance] Expansion length, in stage heights.
 * @property {number} [holdDistance] Extra pinned scroll at full bleed, in stage heights.
 * @property {number} [smoothing] Follow time in seconds; 0 locks to the scrollbar.
 * @property {number} [overlayScrim] Strength of the scrim behind overlay content.
 * @property {boolean} [useWindowScroll] Drive from the page scroll instead of an inner scroller.
 * @property {boolean} [enabled]
 * @property {'lazy' | 'eager'} [loading] Loading strategy for image media.
 * @property {import('react').ReactNode} [children] Content that fades in at full bleed.
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 */

/** @type {(props: ScrollExpandProps & Omit<import('react').HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'className' | 'style'>) => import('react').ReactElement} */
const ScrollExpand = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = false,
  enabled = true,
  loading = 'lazy',
  children,
  className = '',
  style,
  ...rest
}) => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled
  };

  const applyProgress = useCallback(p => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);
    rootRef.current?.style.setProperty('--se-progress', `${e}`);

    const w = c.startWidth + (100 - c.startWidth) * e;
    const h = c.startHeight + (100 - c.startHeight) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy}% ${ix}% ${iy}% ${ix}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
      overlayRef.current.style.pointerEvents = inn > 0.6 ? 'auto' : 'none';
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isStatic = () => !propsRef.current.enabled || reduceMotion;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    // documentElement.clientHeight stays put while mobile browser toolbars collapse,
    // unlike window.innerHeight, so the section does not resize during a scroll.
    const viewportHeight = () => document.documentElement.clientHeight || window.innerHeight;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? viewportHeight() : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      const extra = isStatic() ? 0 : Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance);
      track.style.height = `${stageH * (1 + extra)}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (isStatic()) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (!running && Math.abs(target - current) < 0.0004) return;
      if (propsRef.current.smoothing <= 0 || isStatic()) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll, enabled]);

  // Videos stay unloaded until the section is near the viewport, and pause when it leaves.
  useEffect(() => {
    const root = rootRef.current;
    const video = mediaRef.current;
    if (mediaType !== 'video' || !root || !video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const played = video.play();
          if (played && typeof played.catch === 'function') played.catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(root);
    return () => io.disconnect();
  }, [mediaType, src]);

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef}
        className="scroll-expand__media"
        src={src}
        poster={poster}
        preload="none"
        muted
        loop
        playsInline
        aria-hidden="true"
      />
    ) : (
      <img ref={mediaRef} className="scroll-expand__media" src={src} alt={alt} loading={loading} decoding="async" draggable={false} />
    );

  return (
    <div
      ref={rootRef}
      className={`scroll-expand ${useWindowScroll ? '' : 'scroll-expand--scroller'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="scroll-expand__track">
        <div ref={stageRef} className="scroll-expand__stage">
          <div ref={frameRef} className="scroll-expand__frame">
            {media}
            <div ref={scrimRef} className="scroll-expand__scrim" />
            {children ? (
              <div ref={overlayRef} className="scroll-expand__overlay">
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div ref={titleRef} className="scroll-expand__title">
              {title}
            </div>
          ) : null}
          {scrollHint ? (
            <div ref={hintRef} className="scroll-expand__hint">
              {scrollHint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
