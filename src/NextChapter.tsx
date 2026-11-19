import React, { useEffect, useState } from 'react'
import ScrollExpand from './ScrollExpand.jsx'
import { emails, linkedin } from './contact'
import './next-chapter.css'

type Language = 'zh' | 'en'

const copy = {
  zh: {
    title: '下一站 · 香港', hint: '向下滚动', label: '下一站',
    eyebrow: '2027 年 8 月 · 入读', heading: '香港大学 · 市场营销理学硕士',
    body: '从波士顿到香港，继续探索人们如何理解品牌，以及数据能告诉我们什么。',
    email: '发邮件给我', top: '回到顶部', alt: '香港大学建筑之间的草坪及 HKU 标志',
  },
  en: {
    title: 'Next chapter · Hong Kong', hint: 'Scroll', label: 'Next chapter',
    eyebrow: 'Incoming · August 2027', heading: 'MSc in Marketing, The University of Hong Kong',
    body: 'From Boston to Hong Kong, I keep exploring how people understand brands and what data can tell us.',
    email: 'Email me', top: 'Back to top', alt: 'The HKU sign on a lawn between university buildings',
  },
}

const narrowQuery = '(max-width: 599px)'
function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(narrowQuery).matches)
  useEffect(() => {
    const media = window.matchMedia(narrowQuery)
    const update = () => setNarrow(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return narrow
}

export default function NextChapter({ language }: { language: Language }) {
  const t = copy[language]
  const narrow = useNarrow()
  return <section className="next-chapter" aria-label={t.label} lang={language === 'zh' ? 'zh-CN' : 'en'}>
    <ScrollExpand
      useWindowScroll
      src="./images/hku-campus.webp"
      alt={t.alt}
      title={t.title}
      scrollHint={t.hint}
      startWidth={narrow ? 76 : 44}
      startHeight={narrow ? 48 : 58}
      startRadius={4}
      endRadius={0}
      mediaZoom={1.3}
      scrollDistance={1.1}
      holdDistance={0.25}
      overlayScrim={1}
    >
      <div className="next-chapter-copy">
        <p className="next-chapter-eyebrow">{t.eyebrow}</p>
        <h2>{t.heading}</h2>
        <p className="next-chapter-body">{t.body}</p>
        <div className="next-chapter-actions">
          <a className="cv-primary" href={`mailto:${emails[0]}`}>{t.email}</a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="#home">{t.top}</a>
        </div>
      </div>
    </ScrollExpand>
  </section>
}
