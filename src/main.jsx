import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Work from './Work.jsx';
import Gallery from './Gallery.jsx';
import { copy } from './copy.js';
import './style.css';

const linkedin = 'https://www.linkedin.com/in/zikai-pan-376a5329b/';
const email = 'panzikai7@163.com';
const navigation = ['education', 'work', 'gallery'];
function Arrow({direction='out'}) {
  return <svg className="arrow" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round">
    {direction==='down' ? <path d="M12 3v17m-7-7 7 7 7-7"/> : direction==='download' ? <><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/></> : <path d="M5 19 19 5M7 5h12v12"/>}
  </svg>;
}
function LinkedInLink({className=''}){
  return <a className={'linkedin-link '+className} href={linkedin} rel="noopener noreferrer" target="_blank"><img src="./images/linkedin.svg" width="21" height="21" alt=""/><span>LinkedIn</span><Arrow/></a>;
}
function Header({language, setLanguage, text}) {
  const [open,setOpen]=useState(false);
  const toggle=useRef(null);
  useEffect(()=>{
    const closeOnEscape=e=>{if(e.key==='Escape'&&open){setOpen(false);toggle.current?.focus();}};
    window.addEventListener('keydown',closeOnEscape);
    return ()=>window.removeEventListener('keydown',closeOnEscape);
  },[open]);
  return <header className="mast"><div className="wrap nav-inner">
    <a href="#home" className="wordmark" aria-label={text.home} onClick={()=>setOpen(false)}><b>zp<span>.</span></b><span>ZIKAI PAN</span></a>
    <nav id="main-nav" className={open?'nav-links expanded':'nav-links'} aria-label={text.nav}>
      {navigation.map((id,index)=><a key={id} href={'#'+id} onClick={()=>setOpen(false)}>{text.navItems[index]}</a>)}
    </nav>
    <a href="#contact" className="nav-contact" onClick={()=>setOpen(false)}>{text.contact} <Arrow/></a>
    <div className="language-toggle" role="group" aria-label="Language / 语言">
      <button type="button" lang="zh-CN" aria-pressed={language==='zh'} onClick={()=>setLanguage('zh')}>中</button><span aria-hidden="true">/</span>
      <button type="button" lang="en" aria-pressed={language==='en'} onClick={()=>setLanguage('en')}>EN</button>
    </div>
    <button type="button" ref={toggle} className="menu-toggle" aria-controls="main-nav" aria-expanded={open} aria-label={open?text.menuClose:text.menuOpen} onClick={()=>setOpen(!open)}>{open?'×':'☰'}</button>
  </div></header>;
}
function Hero({language,text}){
  const video=useRef(null);const [playing,setPlaying]=useState(false);const [canPlay,setCanPlay]=useState(true);
  useEffect(()=>{
    const q=matchMedia('(prefers-reduced-motion: reduce)');
    function sync(){if(q.matches) video.current?.pause();else video.current?.play().catch(()=>{});}
    sync();q.addEventListener('change',sync);return ()=>q.removeEventListener('change',sync);
  },[]);
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <div className="hero-motion" aria-hidden="true"><video ref={video} src="./media/lens-motion.webm" poster="./media/lens.jpg" muted loop playsInline preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setCanPlay(false)}/></div>
    <div className="wrap hero-layout">
      <div className="hero-copy"><p className="eyebrow"><i/>MARKETING &amp; CONSUMER RESEARCH</p>
        <h1 id="hero-title">{text.name}<span>.</span></h1><p className="roman-name" lang={language==='zh'?'en':'zh-CN'}>{text.subtitle}</p>
        <div className="incoming"><p lang="en">Incoming MSc in Marketing<br/><span>@ The University of Hong Kong</span></p><span className="intake">2027 FALL <i/> {text.intake}</span></div>
        <p className="hero-bio">{text.bio}</p>
        <div className="hero-links"><LinkedInLink/><a className="download-link" href="./downloads/zikai-pan-resume.pdf" download="Zikai-Pan-Resume.pdf"><Arrow direction="download"/>{text.download} <small>PDF</small></a></div>
      </div>
      <figure className="portrait-wrap"><div className="portrait-frame">
        <img className="portrait" src="./images/zikai-pan-portrait.webp" alt={text.portrait} fetchPriority="high"/>
        <img className="portrait-sign" src="./images/signature-white.png" alt="" aria-hidden="true"/>
      </div></figure>
    </div>
    <div className="wrap hero-foot"><a className="explore-cue" href="#education"><span>{text.explore}</span><Arrow direction="down"/></a>
      {canPlay&&<button type="button" onClick={()=>playing?video.current.pause():video.current.play().catch(()=>setCanPlay(false))}><span aria-hidden="true">{playing?'Ⅱ':'▷'}</span>{playing?text.pause:text.play}</button>}
    </div>
  </section>;
}
function Education({text}){
  return <section id="education" className="education band"><div className="wrap">
    <div className="section-heading"><p className="eyebrow">EDUCATION</p><h2>{text.education}</h2></div>
    <ol className="timeline">
      <li className="school-row high-school"><div className="time-mark"><span>2020.08 – 2023.06</span></div>
        <article className="high-school-card">
          <div className="high-school-header"><img src="./images/hefei-thomas-school-logo.webp" alt={text.highLogo} loading="lazy"/><div><h3>{text.highName}</h3><p>{text.highEnglish}</p></div></div>
          <div className="high-school-body"><div className="honor-groups">{text.highGroups.map(group=><section key={group.title}><h4>{group.title}</h4><ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul></section>)}</div>
          <figure><img src="./images/ansheng-business-school.webp" alt={text.highPhoto} loading="lazy"/><figcaption>{text.highCaption}</figcaption></figure></div>
        </article>
      </li>
      <li className="school-row"><div className="time-mark"><span>2023.09 — 2026.12</span><small>{text.expected}</small></div>
        <article className="school-card"><div className="school-copy"><img className="school-wordmark neu" src="./images/northeastern-wordmark.png" alt="Northeastern University" loading="lazy"/>
        <h3>{text.neu}</h3><p className="degree">{text.degree}</p><p>{text.neuText}</p>
        <div className="school-facts"><span>{text.dean}</span><span>{text.team}</span></div></div>
        <figure><img src="./images/northeastern-campus.webp" loading="lazy" alt={text.neuPhoto}/><figcaption>{text.boston} · Northeastern University</figcaption></figure></article>
      </li>
      <li className="school-row upcoming"><div className="time-mark"><span>2027.08</span><small>{text.incoming}</small></div>
        <article className="school-card"><div className="school-copy"><img className="school-wordmark hku" src="./images/hku-business-school.png" alt={text.hkuLogo} loading="lazy"/>
        <h3>{text.hku}</h3><p className="degree">{text.master}</p><p>{text.hkuText}</p>
        <div className="school-facts"><span>HKU Business School</span><span>{text.fall}</span></div></div>
        <figure><img src="./images/hku-campus.webp" loading="lazy" alt={text.hkuPhoto}/><figcaption>{text.hongkong} · The University of Hong Kong</figcaption></figure></article>
      </li>
    </ol>
  </div></section>;
}
function Skills({text}) {
  return <section className="skills band" id="skills"><div className="wrap skills-layout">
    <div className="section-heading"><p className="eyebrow">CAPABILITIES</p><h2>{text.capabilities}</h2></div>
    <div className="skill-list">{text.skills.map(s=><article key={s.title}><div><h3>{s.title}</h3><p>{s.description}</p></div><span>{s.tools}</span></article>)}
    <p className="skills-note">{text.languageNote}</p></div>
  </div></section>;
}
function Contact({text}){
  return <footer id="contact" className="contact"><div className="contact-art" aria-hidden="true"/><div className="wrap contact-inner">
    <div><p className="eyebrow">GET IN TOUCH</p><h2>{text.contact}<span>.</span></h2><p className="contact-intro">{text.contactIntro}</p>
    <a className="mail" href={'mailto:'+email}>{email}<Arrow/></a><div className="contact-social"><LinkedInLink/></div></div>
    <div className="closing"><span>潘子恺 · Zikai Pan</span><a href="#home">{text.back}</a></div>
  </div></footer>;
}
function initialLanguage() {
  const requested = new URLSearchParams(window.location.search).get('lang');
  if (requested === 'en' || requested === 'zh') return requested;
  try { return localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'zh'; }
  catch { return 'zh'; }
}
function App(){
  const [language,setLanguage]=useState(initialLanguage);
  const text=copy[language];
  useEffect(()=>{
    document.documentElement.lang=language==='zh'?'zh-CN':'en';
    document.title=text.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',text.description);
    try {localStorage.setItem('portfolio-language',language);} catch {}
    const url=new URL(window.location.href);
    url.searchParams.set('lang',language);
    window.history.replaceState(null,'',url);
  },[language,text]);
  return <><a className="skip" href="#education">{text.skip}</a><Header language={language} setLanguage={setLanguage} text={text}/>
    <main><Hero language={language} text={text}/><Education text={text}/><Work language={language}/><Skills text={text}/><Gallery language={language}/></main><Contact text={text}/></>;
}
createRoot(document.getElementById('root')).render(<App/>);
