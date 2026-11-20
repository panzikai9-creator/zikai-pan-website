import React from 'react'
import { ChapterOpener } from './Chapter'
import { emails, linkedin } from './contact'

type Language = 'zh' | 'en'

const copy = {
  zh: {
    title: '下一站 · 香港', label: '下一站',
    eyebrow: '2027 年 8 月 · 入读', heading: '香港大学 · 市场营销理学硕士',
    body: '从波士顿到香港，继续探索人们如何理解品牌，以及数据能告诉我们什么。',
    email: '发邮件给我', top: '回到顶部', alt: '香港大学建筑之间的草坪及 HKU 标志',
  },
  en: {
    title: 'Next chapter · Hong Kong', label: 'Next chapter',
    eyebrow: 'Incoming · August 2027', heading: 'MSc in Marketing, The University of Hong Kong',
    body: 'From Boston to Hong Kong, I keep exploring how people understand brands and what data can tell us.',
    email: 'Email me', top: 'Back to top', alt: 'The HKU sign on a lawn between university buildings',
  },
}

export default function NextChapter({ language }: { language: Language }) {
  const t = copy[language]
  return <ChapterOpener
    className="chapter--closing"
    lang={language === 'zh' ? 'zh-CN' : 'en'}
    label={t.label}
    title={t.title}
    eyebrow={t.eyebrow}
    heading={t.heading}
    headingTag="h2"
    body={t.body}
    media={{ src: './images/hku-campus.webp', alt: t.alt, position: '50% 55%' }}
  >
    <div className="chapter-actions">
      <a className="cv-primary" href={`mailto:${emails[0]}`}>{t.email}</a>
      <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="#home">{t.top}</a>
    </div>
  </ChapterOpener>
}
