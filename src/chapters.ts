import type { ChapterMedia } from './Chapter'

export type ChapterKey = 'education' | 'experience' | 'projects' | 'skills'
type ChapterCopy = { eyebrow: string; heading: string; body?: string; facts?: string[][] }

export const chapterNumbers: Record<ChapterKey, string> = { education: '01', experience: '02', projects: '03', skills: '04' }

export const chapterMedia: Record<ChapterKey, { media: Omit<ChapterMedia, 'alt'>; alt: { zh: string; en: string }; className?: string }> = {
  education: {
    media: { src: './images/northeastern-campus.webp', position: '38% 60%' },
    alt: { zh: '美国东北大学的红砖校名墙与校园建筑', en: 'The Northeastern University sign in front of campus buildings' },
  },
  experience: {
    media: { src: './media/sky-clouds.mp4', type: 'video', poster: './images/sky-poster.webp' },
    alt: { zh: '', en: '' },
    className: 'chapter--top',
  },
  projects: {
    media: { src: './images/film.webp', position: '50% 50%' },
    alt: { zh: '红色胶片概念配图', en: 'Red photographic film concept image' },
  },
  skills: {
    media: { src: './images/lens.webp', position: '72% 50%' },
    alt: { zh: '相机镜头概念配图', en: 'Camera lens concept image' },
  },
}

export const chapterCopy: Record<'zh' | 'en', Record<ChapterKey, ChapterCopy>> = {
  zh: {
    education: {
      eyebrow: '01 · 教育背景', heading: '美国东北大学 → 香港大学',
      body: 'D’Amore-McKim 商学院市场营销方向，GPA 3.78，四次入选院长名单；2027 年 8 月入读港大市场营销理学硕士。',
    },
    experience: {
      eyebrow: '02 · 职业经历', heading: '金融、教育与营销',
      body: '海创（上海）私募基金 · 多米诺国际教育 · 东方证券',
      facts: [['30+', '机构客户调研'], ['30–45', '名常年在读学员'], ['8,000+', '次文章阅读']],
    },
    projects: {
      eyebrow: '03 · 研究项目', heading: '从品牌故事到因果推断',
      body: 'Airwalk 品牌重塑，提出 “Dare to Comeback” 传播主题；Netflix 促销研究，用 OLS 与 IPW 检验优惠效果。',
    },
    skills: {
      eyebrow: '04 · 技能与实践', heading: '镜头之后',
      body: '视觉中国签约摄影师；研究工具包括 R、SPSS、Excel、Wind 与 Bloomberg。',
    },
  },
  en: {
    education: {
      eyebrow: '01 · Education', heading: 'Northeastern → HKU',
      body: 'Marketing at the D’Amore-McKim School of Business, GPA 3.78, Dean’s List four times. MSc in Marketing at HKU from August 2027.',
    },
    experience: {
      eyebrow: '02 · Experience', heading: 'Finance, education and marketing',
      body: 'Haichuang (Shanghai) PE Fund · Domino International Education · Orient Securities',
      facts: [['30+', 'institutional clients surveyed'], ['30–45', 'students year-round'], ['8,000+', 'article views']],
    },
    projects: {
      eyebrow: '03 · Research projects', heading: 'From brand stories to causal inference',
      body: 'Revitalizing Airwalk around “Dare to Comeback”, and testing Netflix promotions with OLS and IPW.',
    },
    skills: {
      eyebrow: '04 · Skills & practice', heading: 'Behind the lens',
      body: 'Contracted photographer for Visual China Group; research tools include R, SPSS, Excel, Wind and Bloomberg.',
    },
  },
}
