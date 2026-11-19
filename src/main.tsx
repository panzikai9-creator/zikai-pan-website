import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { X, Menu } from 'lucide-react'
import ResumeBody from './ResumeBody'
import './cover.css'

type Language = 'zh' | 'en'
const pdf = './downloads/zikai-pan-resume.pdf'
const labels = {
  zh: { title: '潘子恺 Zikai Pan · 商科在线简历', links: ['教育背景','职业经历','研究项目'], home: '回到封面', jump: '跳至简历正文', nav: '网站目录', open: '打开目录', close: '关闭目录', intro: '市场营销 · 消费者洞察', profile: '商业视角，保持好奇。', bio: '从数据到故事，从观察到洞察。', read: '浏览我的履历', resume: '下载英文简历', next: '下一站 · 香港', degree: '市场营销理学硕士', date: '2027 年 8 月入学', portrait: '潘子恺在屋顶上的黑白照片' },
  en: { title: 'Zikai Pan · Business Résumé', links: ['Education','Experience','Research'], home: 'Back to cover', jump: 'Skip to résumé', nav: 'Site navigation', open: 'Open navigation', close: 'Close navigation', intro: 'Marketing · Consumer insight', profile: 'A business mind. An open perspective.', bio: 'From data to stories. From observation to insight.', read: 'Explore my résumé', resume: 'Download résumé', next: 'NEXT CHAPTER · HONG KONG', degree: 'Master of Science in Marketing', date: 'Incoming · August 2027', portrait: 'Black-and-white rooftop photograph of Zikai Pan' }
}
function initialLanguage(): Language {
  const value = new URLSearchParams(location.search).get('lang')
  if (value === 'zh' || value === 'en') return value
  try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'zh' } catch { return 'zh' }
}
function Cover({lang,onLang}:{lang:Language;onLang:(l:Language)=>void}) {
  const t=labels[lang]
  const [menu,setMenu]=useState(false)
  const trigger=useRef<HTMLButtonElement>(null)
  const panel=useRef<HTMLDivElement>(null)
  const pendingAnchor=useRef<string|null>(null)
  useEffect(()=>{
    if(!menu)return
    const original=document.body.style.overflow
    document.body.style.overflow='hidden'
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus()
    const keydown=(e:KeyboardEvent)=>{
      if(e.key==='Escape')setMenu(false)
      if(e.key!=='Tab')return
      const nodes=panel.current?.querySelectorAll<HTMLElement>('a[href],button')
      if(!nodes?.length)return
      const first=nodes[0],last=nodes[nodes.length-1]
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
    const desktop=matchMedia('(min-width:901px)')
    const resize=()=>{if(desktop.matches)setMenu(false)}
    desktop.addEventListener('change',resize)
    document.addEventListener('keydown',keydown)
    return ()=>{
      document.body.style.overflow=original
      document.removeEventListener('keydown',keydown)
      desktop.removeEventListener('change',resize)
      const target=pendingAnchor.current&&document.getElementById(pendingAnchor.current)
      if(target){target.tabIndex=-1;target.focus({preventScroll:true});target.scrollIntoView()}
      else trigger.current?.focus({preventScroll:true})
      pendingAnchor.current=null
    }
  },[menu])
  const ids=['education','experience','projects']
  const links=(drawer=false)=>ids.map((id,i)=><a href={'#'+id} key={id} onClick={()=>{if(drawer){pendingAnchor.current=id;setMenu(false)}}}>{t.links[i]}</a>)
  return <section className="cv-cover" id="home" aria-labelledby="cover-title">
    <a className="cv-skip" href="#resume">{t.jump}</a>
    <div className="cv-rooftop-hero">
    <div className="cv-rooftop-scene" aria-hidden="true"><img src="./images/rooftop-background-v9.webp" alt=""/></div>
    <div className="cv-person"><img src="./images/portrait-original-v9.webp" fetchPriority="high" alt={t.portrait}/></div>
    <div className="cv-rooftop-shade" aria-hidden="true" />
    <header className="cv-top">
      <a className="cv-brand" href="#home" aria-label={t.home}>ZIKAI PAN<span>潘子恺</span></a>
      <nav className="cv-top-index" aria-label={t.nav}>{links()}</nav>
      <div className="cv-top-right"><div className="cv-langs" role="group" aria-label="语言 / Language"><button lang="zh-CN" aria-pressed={lang==='zh'} onClick={()=>onLang('zh')}>中</button><span>/</span><button lang="en" aria-pressed={lang==='en'} onClick={()=>onLang('en')}>EN</button></div><a className="cv-contact-link" href="#contact">{lang==='zh'?'联系我':'Get in touch'}</a><button className="cv-menu-trigger" ref={trigger} aria-label={t.open} aria-expanded={menu} aria-controls="cv-drawer" onClick={()=>setMenu(true)}><Menu size={25}/></button></div>
    </header>
    <div className="cv-hero-stage">
      <div className="cv-cover-copy"><p className="cv-eyebrow">{t.intro}</p><h1 className="cv-name" id="cover-title"><span>ZIKAI</span><span>PAN<span className="cv-name-period">.</span></span><span className="cv-sr"> · 潘子恺</span></h1><p className="cv-profile">{t.profile}</p><p className="cv-bio">{t.bio}</p><div className="cv-hero-actions"><a className="cv-primary" href="#resume">{t.read}</a><a className="cv-download" href={pdf} download="Zikai-Pan-Resume.pdf"><img src="./images/pdf.svg" width="27" height="32" alt=""/>{t.resume}</a><a className="cv-linkedin-hero" href="https://www.linkedin.com/in/zikai-pan-376a5329b/" target="_blank" rel="noopener noreferrer"><img src="./images/linkedin.svg" width="23" height="23" alt=""/>LinkedIn</a></div></div>
    </div>
    </div>
    <div className="cv-cover-footer"><div><span className="cv-footer-label">{lang==='zh'?'现在 · 波士顿':'CURRENTLY · BOSTON'}</span><p>Northeastern University</p><span>{lang==='zh'?'工商管理理学学士 · 市场营销方向':'BSBA · Concentration in Marketing'}</span></div><div><span className="cv-footer-label">{t.next}</span><p>HKU Business School</p><span>{t.degree} · {t.date}</span></div><a href="https://www.linkedin.com/in/zikai-pan-376a5329b/" target="_blank" rel="noreferrer" className="cv-linkedin"><img src="./images/linkedin.svg" width="23" height="23" alt=""/>LinkedIn</a></div>
    {menu&&<div id="cv-drawer" className="cv-drawer"><div className="cv-scrim" onClick={()=>setMenu(false)}/><div className="cv-sheet" ref={panel} role="dialog" aria-modal="true" aria-label={t.nav}><button className="cv-close" aria-label={t.close} onClick={()=>setMenu(false)}><X/></button><p>{t.nav}</p><nav>{links(true)}</nav><a href="#contact" onClick={()=>{pendingAnchor.current='contact';setMenu(false)}}>{lang==='zh'?'联系方式':'Contact'}</a></div></div>}
  </section>
}
function App(){
  const [lang,setLang]=useState<Language>(initialLanguage)
  useEffect(()=>{
    document.documentElement.lang=lang==='zh'?'zh-CN':'en'
    document.title=labels[lang].title
    document.querySelector('meta[name="description"]')?.setAttribute('content',lang==='zh'?'潘子恺的中英双语个人网站。美国东北大学市场营销本科生，2027年8月入读香港大学市场营销理学硕士。教育、职业经历、消费者研究与摄影。':'Zikai Pan: marketing, consumer research and photography. Northeastern University BSBA; incoming MSc in Marketing at The University of Hong Kong, August 2027.')
    try{localStorage.setItem('portfolio-language',lang)}catch{}
    const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url)
  },[lang])
  return <><Cover lang={lang} onLang={setLang}/><main><ResumeBody language={lang}/></main></>
}
createRoot(document.getElementById('root')!).render(<App/>);
