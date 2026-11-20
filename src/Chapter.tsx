import React, { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import ScrollExpand from './ScrollExpand.jsx'
import './chapter.css'

export type ChapterMedia = {
  src: string
  type?: 'image' | 'video'
  poster?: string
  alt?: string
  /** CSS object-position for the media, e.g. "35% 55%". */
  position?: string
}

export type ChapterProps = {
  lang: 'zh-CN' | 'en'
  label: string
  number?: string
  title: string
  hint?: string
  eyebrow: string
  heading: string
  /** Use h2 for a real section (the closing); chapter openers repeat the section's own heading, so they use a paragraph. */
  headingTag?: 'h2' | 'p'
  body?: string
  facts?: string[][]
  media: ChapterMedia
  className?: string
  children?: ReactNode
}

const narrowQuery = '(max-width: 599px)'
export function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(narrowQuery).matches)
  useEffect(() => {
    const media = window.matchMedia(narrowQuery)
    const update = () => setNarrow(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return narrow
}

/** Full-bleed chapter card: a framed photo that opens to the whole screen as you scroll. */
export function ChapterOpener({ lang, label, number, title, hint, eyebrow, heading, headingTag = 'p', body, facts, media, className = '', children }: ChapterProps) {
  const narrow = useNarrow()
  const Heading = headingTag
  return <section className={`chapter ${className}`.trim()} aria-label={label} lang={lang}>
    <ScrollExpand
      useWindowScroll
      src={media.src}
      mediaType={media.type ?? 'image'}
      poster={media.poster ?? ''}
      alt={media.alt ?? ''}
      title={<span className="chapter-title">{number && <span className="chapter-title-num">{number}</span>}<span className="chapter-title-name">{title}</span></span>}
      scrollHint={hint ?? ''}
      startWidth={narrow ? 76 : 44}
      startHeight={narrow ? 48 : 58}
      startRadius={4}
      endRadius={0}
      mediaZoom={1.3}
      scrollDistance={1}
      holdDistance={0.2}
      overlayScrim={1}
      style={media.position ? { '--chapter-media-position': media.position } as React.CSSProperties : undefined}
    >
      <div className="chapter-copy">
        <p className="chapter-eyebrow">{eyebrow}</p>
        <Heading className="chapter-heading">{heading}</Heading>
        {body && <p className="chapter-body">{body}</p>}
        {facts && <dl className="chapter-facts">{facts.map(([value, note]) => <div key={value}><dt>{value}</dt><dd>{note}</dd></div>)}</dl>}
        {children}
      </div>
    </ScrollExpand>
  </section>
}
