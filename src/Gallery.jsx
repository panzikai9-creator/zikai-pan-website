import React, { useEffect, useRef, useState } from 'react';
import './gallery.css';

const photographs = [
  { image: 'behind-the-lens.webp', tag: '摄影', title: '镜头之后', caption: '用相机记录日常光影。', alt: '穿黑色外套、戴眼镜的潘子恺，低头调整手中的相机。', position: '50% 42%' },
  { image: 'portrait-in-light.webp', tag: '日常', title: '光里的侧影', caption: '树影下的一帧侧脸。', alt: '树影下的侧面肖像，身穿白色上衣、戴着眼镜。', position: '50% 36%' },
  { image: 'coastal-afternoon.webp', tag: '旅行', title: '海边片刻', caption: '在棕榈树与云影之间。', alt: '潘子恺戴墨镜身穿白色上衣站在海滩上，身后是棕榈树。', position: '52% 45%' },
  {
    image: 'street-portrait.webp',
    tag: '摄影',
    title: '红砖墙前',
    caption: '红砖映衬下的街头人像。',
    alt: '戴墨镜、穿黑色外套的街头人像，背景是红砖墙。',
    position: '50% 47%',
  },
  {
    image: 'badminton-team.webp',
    tag: '运动',
    title: '和球友们',
    caption: '在羽毛球场并肩合影。',
    alt: '羽毛球队员在室内球场合影，部分队员手持球拍。',
    position: '50% 47%',
  },
  {
    image: 'northeastern-atrium.webp',
    tag: '校园观察',
    title: '中庭里的光',
    caption: '日光穿过校园的层层楼廊。',
    alt: '阳光穿过层层楼廊，落在校园建筑的中庭里。',
    position: '50% 50%',
  },
  {
    image: 'northeastern-welcome.webp',
    tag: '探索',
    title: '校园迎新',
    caption: '东北大学楼前的迎新横幅。',
    alt: '美国东北大学楼宇前挂着迎新横幅，楼顶旗帜迎风飘扬。',
    position: '50% 62%',
  },
  {
    image: 'badminton-tournament.webp',
    tag: '运动',
    title: '赛场留影',
    caption: '和队友在球网前举起赛事横幅。',
    alt: '羽毛球赛场上，几位球友在球网前举着赛事横幅合照。',
    position: '50% 69%',
  },
  {
    image: 'student-portrait.webp',
    tag: '校园生活',
    title: '红色校服',
    caption: '一张学生时代的肖像。',
    alt: '身穿红色校服外套和领带的学生肖像。',
    position: '50% 30%',
  },
];

const englishPhotos = [
  { tag: 'Photography', title: 'Behind the lens', caption: 'Finding light in the everyday.', alt: 'Zikai Pan in a black jacket and glasses, adjusting the camera in his hands.' },
  { tag: 'Everyday', title: 'A profile in the light', caption: 'A quiet moment beneath the trees.', alt: 'A side profile in glasses and a white shirt beneath the trees.' },
  { tag: 'Travel', title: 'By the sea', caption: 'A moment among palms and clouds.', alt: 'Zikai Pan wearing sunglasses and a white shirt on a beach lined with palm trees.' },
  { tag: 'Photography', title: 'By the brick wall', caption: 'A street portrait against red brick.', alt: 'A street portrait wearing sunglasses and a black jacket, in front of a red brick wall.' },
  { tag: 'Sport', title: 'With teammates', caption: 'Together on the badminton court.', alt: 'Badminton players posing on an indoor court, some holding rackets.' },
  { tag: 'Campus', title: 'Light in the atrium', caption: 'Daylight falls through the campus walkways.', alt: 'Daylight shines through layered walkways into a university atrium.' },
  { tag: 'Exploring', title: 'Welcome to campus', caption: 'A welcome banner at Northeastern.', alt: 'A welcome banner on a Northeastern University building with flags overhead.' },
  { tag: 'Sport', title: 'At the tournament', caption: 'Teammates lift the banner at the net.', alt: 'Badminton teammates pose in front of the net holding an event banner.' },
  { tag: 'School days', title: 'The red blazer', caption: 'A portrait from my school days.', alt: 'A student portrait wearing a red school blazer and tie.' }
];
const galleryLabels = {
  zh: { title: '工作之外。', intro: '在球场、校园与镜头之间。', period: '。', close: '关闭照片', previous: '上一张照片', next: '下一张照片', enlarge: '放大照片：' },
  en: { title: 'Beyond Work.', intro: 'On court, on campus, behind the lens.', period: '. ', close: 'Close photo', previous: 'Previous photo', next: 'Next photo', enlarge: 'Enlarge photo: ' }
};
const localizePhotos = language => photographs.map((photo, index) => ({ ...photo, ...(language === 'en' ? englishPhotos[index] : {}) }));

const imageUrl = photo => `${import.meta.env.BASE_URL}images/${photo.image}`;

function Glyph({ type }) {
  const paths = {
    close: 'm6 6 12 12M18 6 6 18',
    left: 'm13.5 5.5-6.5 6.5 6.5 6.5',
    right: 'm10.5 5.5 6.5 6.5-6.5 6.5',
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}

function Lightbox({ startIndex, onDismiss, opener, language }) {
  const [index, setIndex] = useState(startIndex);
  const dialog = useRef(null);
  const photos = localizePhotos(language);
  const labels = galleryLabels[language] || galleryLabels.zh;
  const photo = photos[index];

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [opener]);

  const move = step => {
    setIndex(current => (current + step + photographs.length) % photographs.length);
  };

  function handleKey(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <dialog className="gallery-lightbox" ref={dialog} aria-labelledby="gallery-lightbox-caption"
      onCancel={event => { event.preventDefault(); onDismiss(); }}
      onKeyDown={handleKey}
      onClick={event => { if (event.target === dialog.current) onDismiss(); }}>
      <div className="gallery-viewer">
        <div className="gallery-image-stage">
          <img src={imageUrl(photo)} alt={photo.alt} />
          <button type="button" className="gallery-close" onClick={onDismiss} autoFocus aria-label={labels.close}><Glyph type="close" /></button>
        </div>
        <div className="gallery-viewer-nav">
          <div className="gallery-viewer-info" aria-live="polite" aria-atomic="true">
            <span>{photo.tag} <i aria-hidden="true">/</i> {index + 1} <i aria-hidden="true">/</i> {photographs.length}</span>
            <strong id="gallery-lightbox-caption">{photo.title}</strong>
          </div>
          <button type="button" onClick={() => move(-1)} aria-label={labels.previous}><Glyph type="left" /></button>
          <button type="button" onClick={() => move(1)} aria-label={labels.next}><Glyph type="right" /></button>
        </div>
      </div>
    </dialog>
  );
}

export default function Gallery({ language = 'zh' }) {
  const labels = galleryLabels[language] || galleryLabels.zh;
  const photos = localizePhotos(language);
  const [open, setOpen] = useState(null);
  const track = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const rail = track.current;
    function syncEdges() {
      const start = rail.scrollLeft <= 1;
      const end = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 1;
      setEdge(current => current.start === start && current.end === end ? current : { start, end });
    }

    const observer = new ResizeObserver(syncEdges);
    observer.observe(rail);
    rail.addEventListener('scroll', syncEdges, { passive: true });
    syncEdges();
    let anchorFrame;
    const jumpToGallery = () => {
      anchorFrame = requestAnimationFrame(() => {
        if (window.location.hash === '#gallery') {
          rail.closest('.gallery-section').scrollIntoView({ behavior: 'instant' });
        }
      });
    };
    if (window.location.hash === '#gallery') {
      if (document.readyState === 'complete') jumpToGallery();
      else window.addEventListener('load', jumpToGallery, { once: true });
    }
    return () => {
      observer.disconnect();
      rail.removeEventListener('scroll', syncEdges);
      window.removeEventListener('load', jumpToGallery);
      cancelAnimationFrame(anchorFrame);
    };
  }, []);

  function scrollPhotos(direction) {
    const rail = track.current;
    const max = rail.scrollWidth - rail.clientWidth;
    const origin = rail.firstElementChild.offsetLeft;
    const stops = Array.from(rail.children, card => Math.min(max, card.offsetLeft - origin));
    const left = direction > 0
      ? stops.find(stop => stop > rail.scrollLeft + 1) ?? max
      : stops.reverse().find(stop => stop < rail.scrollLeft - 1) ?? 0;
    rail.scrollTo({ left });
  }

  return (
    <section id="gallery" className="gallery-section" data-cv-section="" aria-labelledby="gallery-heading">
      <div className="gallery-frame">
        <header className="gallery-heading">
          <h2 id="gallery-heading">{labels.title}<span>{labels.intro}</span></h2>
        </header>
        <ul className="gallery-track" id="gallery-photos" role="list" ref={track}>
          {photos.map((photo, index) => (
            <li className="gallery-card" key={photo.image}>
              <figure>
                <button type="button" className="gallery-tile" aria-label={labels.enlarge + photo.title} aria-haspopup="dialog"
                  onClick={event => setOpen({ index, opener: event.currentTarget })}>
                  <img loading="lazy" decoding="async" src={imageUrl(photo)} alt={photo.alt} style={{ objectPosition: photo.position }} />
                </button>
                <figcaption><strong>{photo.title}{labels.period}</strong>{photo.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="gallery-controls">
          <button type="button" aria-label={labels.previous} aria-controls="gallery-photos" disabled={edge.start} onClick={() => scrollPhotos(-1)}><Glyph type="left" /></button>
          <button type="button" aria-label={labels.next} aria-controls="gallery-photos" disabled={edge.end} onClick={() => scrollPhotos(1)}><Glyph type="right" /></button>
        </div>
      </div>
      {open && <Lightbox language={language} startIndex={open.index} opener={open.opener} onDismiss={() => setOpen(null)} />}
    </section>
  );
}
