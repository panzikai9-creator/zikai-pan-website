import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { copy } from './copy.js';
import { experiences, studies } from './experience.js';
import { englishEntries } from './experience.en.js';
import Gallery from './Gallery.jsx';
import { emails, phone, linkedin } from './contact';
import { ChapterOpener } from './Chapter';
import { chapterCopy, chapterMedia, chapterNumbers, type ChapterKey } from './chapters';
import './resume-body.css';

type Language = 'zh' | 'en';
type ResumeEntry = {
  id: string;
  title: string;
  org: string;
  summary: string;
  details: string[][];
  date?: string;
  location?: string;
  role?: string;
  facts?: string[][];
};
const sectionIds = ['education', 'experience', 'projects', 'skills', 'contact'] as const;
type SectionId = typeof sectionIds[number];
const labels = {
  zh: {
    title: '个人履历', index: '履历目录', links: ['教育背景', '职业经历', '研究项目', '技能与实践', '联系方式'],
    resume: '下载英文简历', print: '打印履历', honors: '荣誉与领导力', coursework: '主要课程',
    courses: '消费者数据定量分析、新产品开发、市场营销与社会、战略实践、营销管理',
    hongKong: '香港大学经管学院', boston: 'D’Amore-McKim 商学院 · 辅修传播学',
    experienceDetails: '工作内容', projectDetails: '研究方法与个人贡献', gallery: '校园与生活影像',
    skills: [
      ['研究方法', '消费者访谈、问卷设计、竞品定位、倾向得分分析与逆概率加权'],
      ['分析工具', 'R、SPSS、Excel（数据透视表、查找函数与可视化）、Wind、Bloomberg'],
      ['商业沟通', '市场简报、投资者教育内容、PowerPoint 商业演示'],
      ['语言', '普通话（母语）、英语（熟练）'],
      ['考试成绩', '托福 iBT 101（阅读 27、听力 25、口语 23、写作 26）；AP 微观经济学 5 分、AP 宏观经济学 5 分'],
      ['资质', '国家二级羽毛球裁判员（国家体育总局）'],
    ],
    contact: '欢迎交流市场营销、品牌策略与消费者研究。', email: '邮箱', phone: '电话',
  },
  en: {
    title: 'Curriculum vitae', index: 'Contents', links: ['Education', 'Experience', 'Research projects', 'Skills & practice', 'Contact'],
    resume: 'Download résumé', print: 'Print CV', honors: 'Honors and leadership', coursework: 'Selected coursework',
    courses: 'Quantitative Analysis of Consumer Data, New Product Development, Marketing and Society, Strategy in Action, Marketing Management',
    hongKong: 'HKU Business School', boston: 'D’Amore-McKim School of Business · Minor in Communication Studies',
    experienceDetails: 'Responsibilities', projectDetails: 'Methods and contribution', gallery: 'Campus and personal photographs',
    skills: [
      ['Research', 'Consumer interviews, survey design, competitor positioning, propensity scores and inverse probability weighting'],
      ['Analytics', 'R, SPSS, Excel (PivotTables, lookup functions and visualization), Wind, Bloomberg'],
      ['Communication', 'Market briefings, investor education and PowerPoint business presentations'],
      ['Languages', 'Mandarin (native), English (proficient)'],
      ['Test scores', 'TOEFL iBT 101 (Reading 27, Listening 25, Speaking 23, Writing 26); AP Microeconomics 5, AP Macroeconomics 5'],
      ['Certification', 'National Level II Badminton Referee, General Administration of Sport of China'],
    ],
    contact: 'Get in touch about marketing, brand strategy or consumer research.', email: 'Email', phone: 'Phone',
  },
};
const pdf = './downloads/zikai-pan-resume.pdf';

function Disclosure({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <details className={`cv-disclosure ${className}`}>
    <summary><span aria-hidden="true" className="cv-plus" />{title}</summary>
    <div className="cv-disclosed">{children}</div>
  </details>;
}

function Notes({ rows }: { rows: string[][] }) {
  return <dl className="cv-notes">{rows.map(([term, definition]) => <div key={term}>
    <dt>{term}</dt><dd>{definition}</dd>
  </div>)}</dl>;
}

type BrandImage = { file: string; alt: string };
type ResumePhoto = { file: string; caption: string; alt: string; position?: string };

function PhotoStrip({ photos, className = '' }: { photos: ResumePhoto[]; className?: string }) {
  return <div className={`cv-photo-strip ${className}`}>
    {photos.map(photo => <figure key={photo.file}>
      <a href={`./images/${photo.file}`} target="_blank" rel="noopener noreferrer" aria-label={photo.caption}>
        <img src={`./images/${photo.file}`} alt={photo.alt} loading="lazy" decoding="async" style={{objectPosition: photo.position || 'center'}} />
      </a><figcaption>{photo.caption}</figcaption>
    </figure>)}
  </div>;
}

function Entry({ meta, title, subtitle, logos, children }: {
  meta?: ReactNode; title: string; subtitle?: string; logos?: BrandImage[]; children?: ReactNode;
}) {
  return <article className="cv-entry">
    <div className="cv-entry-top"><div className="cv-entry-identity">{logos && <div className="cv-entry-logos">{logos.map(logo => <img key={logo.file} src={`./images/${logo.file}`} alt={logo.alt} loading="lazy" decoding="async" />)}</div>}<div><h4>{title}</h4>{subtitle && <p className="cv-entry-subtitle">{subtitle}</p>}</div></div>
      {meta && <div className="cv-meta">{meta}</div>}</div>
    {children}
  </article>;
}

function Degree({ language, chinese, english }: { language: Language; chinese: string; english: string }) {
  return <div className="cv-degree">
    <p lang={language === 'zh' ? 'zh-CN' : 'en'}>{language === 'zh' ? chinese : english}</p>
    <p className="cv-degree-translation" lang={language === 'zh' ? 'en' : 'zh-CN'}>{language === 'zh' ? english : chinese}</p>
  </div>;
}

function NortheasternHonors({ language }: { language: Language }) {
  const zh = language === 'zh';
  return <div className="cv-university-honors">
    <p className="cv-detail-heading">{zh ? '荣誉与校园参与' : 'Honors & campus involvement'}</p>
    <dl className="cv-award-grid">
      <div className="cv-award-deans">
        <dt>{zh ? '院长荣誉名单' : 'Dean’s List'}<span>{zh ? 'Dean’s List · 四学期' : 'Four semesters'}</span></dt>
        <dd><ul className="cv-semesters">
          {['Spring 2026', 'Fall 2025', 'Spring 2025', 'Fall 2024'].map(semester => <li key={semester} lang="en">{semester}</li>)}
        </ul></dd>
      </div>
      <div>
        <dt>{zh ? '学术成就奖学金 · 32,000 美元' : 'Academic Achievement Scholarship · $32,000'}<span>Fall 2025</span></dt>
        <dd lang="en">Academic Achievement Award, Northeastern University</dd>
      </div>
      <div>
        <dt>{zh ? '国际学生大使提名' : 'Global Student Ambassador nomination'}<span>2023–2024</span></dt>
        <dd>{zh ? '获 Global Student Ambassador（GSA）提名' : 'Nominated for Global Student Ambassador (GSA)'}</dd>
      </div>
      <div>
        <dt>{zh ? '校羽毛球队 · 团体铜牌' : 'University badminton team · Bronze'}<span>2026 · Northern Conference D2</span></dt>
        <dd lang="en">AEROPLANE Eastern Collegiate Team Badminton Championships</dd>
      </div>
    </dl>
  </div>;
}

export default function ResumeBody({ language }: { language: Language }) {
  const t = labels[language];
  const c = copy[language];
  const sectionName = (id: SectionId) => t.links[sectionIds.indexOf(id)];
  const [current, setCurrent] = useState<SectionId>('education');
  const root = useRef<HTMLDivElement>(null);
  const header = (id: SectionId) => <header className="cv-section-heading"><h3>{sectionName(id)}</h3></header>;

  useEffect(() => {
    const blocks = Array.from(root.current?.querySelectorAll<HTMLElement>('section[data-cv-section]') ?? []);
    let pending: number | null = null;
    const sync = () => {
      pending = null;
      let active: SectionId = 'education';
      for (const block of blocks) {
        if (block.getBoundingClientRect().top <= window.innerHeight * .32) active = block.id as SectionId;
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) active = 'contact';
      setCurrent(active);
    };
    const schedule = () => { if (pending === null) pending = requestAnimationFrame(sync); };
    const initiallyClosed = new Set<HTMLDetailsElement>();
    const beforePrint = () => {
      root.current?.querySelectorAll<HTMLDetailsElement>('details.cv-print-detail:not([open])').forEach(detail => {
        initiallyClosed.add(detail);
        detail.open = true;
      });
    };
    const afterPrint = () => {
      initiallyClosed.forEach(detail => { detail.open = false; });
      initiallyClosed.clear();
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    return () => {
      if (pending !== null) cancelAnimationFrame(pending);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const localize = (entry: ResumeEntry): ResumeEntry => language === 'en'
    ? { ...entry, ...englishEntries[entry.id as keyof typeof englishEntries] }
    : entry;
  const jobs = experiences.filter(entry => entry.category === '职业经历').map(localize);
  const practices = experiences.filter(entry => entry.category === '专业实践').map(localize);
  const opener = (key: ChapterKey) => <ChapterOpener
    lang={language === 'zh' ? 'zh-CN' : 'en'}
    label={sectionName(key)}
    number={chapterNumbers[key]}
    title={sectionName(key)}
    hint={key === 'education' ? (language === 'zh' ? '向下滚动' : 'Scroll') : undefined}
    {...chapterCopy[language][key]}
    media={{ ...chapterMedia[key].media, alt: chapterMedia[key].alt[language] }}
    className={chapterMedia[key].className}
  />;
  return <div className="cv-paper cv-paper--chapters" id="resume" ref={root}>
    {/* The sidebar sits on its own layer so it can stay sticky across chapters; chapter openers slide over it. */}
    <div className="cv-aside-rail"><div className="cv-aside-rail-grid">
      <aside className="cv-aside"><img className="cv-signature" src="./images/signature-black.webp" alt="Zikai Pan" loading="lazy" />
        <nav className="cv-nav" aria-label={t.index}>
          <p className="cv-index-label">{t.index}</p>
          {sectionIds.map(id => <a key={id} href={`#${id}`} aria-current={current === id ? 'location' : undefined}>{sectionName(id)}</a>)}
        </nav>
        <div className="cv-aside-tools">
          <a href={pdf} download="Zikai-Pan-Resume.pdf">{t.resume} <span lang="en">PDF</span></a>
          <button type="button" onClick={() => window.print()}>{t.print}</button>
        </div>
      </aside>
    </div></div>
    <div className="cv-layout cv-layout--intro"><div className="cv-text">
        <header className="cv-intro"><h2>{t.title}</h2><p>{c.bio}</p>
          <div className="cv-print-contact">{c.name} · {emails[0]} · {phone.display} · linkedin.com/in/zikai-pan-376a5329b</div>
        </header>
    </div></div>
    {opener('education')}
    <div className="cv-layout"><div className="cv-text">
        <section id="education" data-cv-section="">
          {header('education')}
          <Entry title={language === 'zh' ? '香港大学' : 'The University of Hong Kong'} subtitle={language === 'zh' ? 'The University of Hong Kong' : '香港大学'} logos={[{file:"hku-business-school.webp",alt:c.hkuLogo}]} meta={<><span>2027.08</span><span>{c.incoming}</span></>}>
            <p className="cv-school-faculty">{language === 'zh' ? '港大经管学院 · HKU Business School' : 'HKU Business School · 港大经管学院'}</p>
            <Degree language={language} chinese="市场营销理学硕士" english="Master of Science in Marketing" />
            <PhotoStrip className="cv-photo-hku" photos={[
              {file:"hku-campus.webp",caption:language === "zh" ? "香港大学 · 下一站" : "HKU · The next chapter",alt:c.hkuPhoto,position:"50% 55%"},
              {file:"hku-main-building.webp",caption:language === "zh" ? "香港大学本部大楼" : "Main Building, The University of Hong Kong",alt:language === "zh" ? "蓝天下的香港大学本部大楼及钟楼" : "The University of Hong Kong Main Building and its clock tower under a blue sky",position:"50% 50%"}
            ]} />
          </Entry>
          <Entry title={language === 'zh' ? '美国东北大学' : 'Northeastern University'} subtitle={language === 'zh' ? 'Northeastern University' : '美国东北大学'} logos={[{file:"northeastern-wordmark.webp",alt:"Northeastern University"}]} meta={<><span>2023.09 – 2026.12</span><span>{c.expected}</span></>}>
            <p className="cv-school-faculty">{language === 'zh' ? 'D’Amore-McKim 商学院 · D’Amore-McKim School of Business' : 'D’Amore-McKim School of Business'}</p>
            <Degree language={language} chinese="工商管理理学学士 · 市场营销方向" english="Bachelor of Science in Business Administration · Concentration in Marketing" />
            <Degree language={language} chinese="辅修传播学" english="Minor in Communication Studies" />
            <p className="cv-academic-facts"><strong>GPA 3.78 / 4.0</strong><span>{language === 'zh' ? '预计以 magna cum laude（极优等）荣誉毕业' : 'Expected magna cum laude'}</span></p>
            <NortheasternHonors language={language} />
            <Disclosure title={t.coursework} className="cv-print-detail"><p>{t.courses}</p></Disclosure>
            <PhotoStrip className="cv-photo-neu" photos={[
              {file:"northeastern-campus.webp",caption:language === "zh" ? "美国东北大学 · 波士顿" : "Northeastern University · Boston",alt:c.neuPhoto},
              {file:"northeastern-sunset.webp",caption:language === "zh" ? "校园日落" : "Sunset on campus",alt:language === "zh" ? "暮色中的美国东北大学校园" : "The Northeastern University campus at sunset"}
            ]} />
          </Entry>
          <Entry title={language === 'zh' ? '合肥安生学校' : 'Hefei Thomas School'} subtitle={language === 'zh' ? 'Hefei Thomas School' : '合肥安生学校'} logos={[{file:"hefei-thomas-lockup-v7.webp",alt:c.highLogo}]} meta="2020.08 – 2023.06">
            <div className="cv-honors-visible"><p className="cv-detail-heading">{t.honors}</p>
              <div className="cv-honors">{c.highGroups.map(group => <div key={group.title}>
                <strong>{group.title}</strong><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
              </div>)}</div>
            </div>
            <PhotoStrip className="cv-photo-school" photos={[
              {file:"ansheng-business-school.webp",caption:language === "zh" ? "合肥安生商学院" : "Ansheng Business School",alt:c.highPhoto},
              {file:"asdan-business-simulation.webp",caption:language === "zh" ? "ASDAN 商业模拟" : "ASDAN Business Simulation",alt:language === "zh" ? "ASDAN 商业模拟比赛的团队合影" : "Team photograph at an ASDAN Business Simulation competition",position:"50% 70%"},
              {file:"ansheng-awards-team.webp",caption:language === "zh" ? "团队领奖时刻" : "A team award moment",alt:language === "zh" ? "合肥安生学校团队在颁奖现场合影" : "The Hefei Thomas School team at an awards ceremony",position:"50% 55%"}
            ]} />
          </Entry>
        </section>
    </div></div>
    {opener('experience')}
    <div className="cv-layout"><div className="cv-text">
        <section id="experience" data-cv-section="">
          {header('experience')}
          {jobs.map(entry => <Entry key={entry.id} title={entry.org} subtitle={entry.title}
            logos={entry.id === 'orient' ? [{file:'orient-securities-v7.webp',alt:language === 'zh' ? '东方证券标志' : 'Orient Securities logo'}]
              : entry.id === 'conch' ? [{file:'conch-fund.webp',alt:language === 'zh' ? '海创基金标志' : 'Conch Fund logo'}]
              : entry.id === 'domino' ? [{file:'domino-education-v7.webp',alt:language === 'zh' ? '多米诺国际教育标志' : 'Domino International Education logo'}] : undefined}
            meta={<><span>{entry.date}</span><span>{entry.location}</span></>}>
            <p>{entry.summary}</p>
            {entry.facts && <dl className="cv-numbers">{entry.facts.map(([n, label]) =>
              <div key={n}><dt>{n}</dt><dd>{label}</dd></div>)}</dl>}
            <Disclosure title={t.experienceDetails} className="cv-print-detail"><Notes rows={entry.details} /></Disclosure>
          </Entry>)}
        </section>
    </div></div>
    {opener('projects')}
    <div className="cv-layout"><div className="cv-text">
        <section id="projects" data-cv-section="">
          {header('projects')}
          {studies.map(localize).map(entry => <Entry key={entry.id} title={entry.title} subtitle={entry.org} meta={entry.role}
            logos={entry.id === 'netflix' ? [{file:'netflix-wordmark.webp',alt:'Netflix'}] : undefined}>
            <p>{entry.details[entry.details.length - 1][1]}</p>
            <Disclosure title={t.projectDetails} className="cv-print-detail"><Notes rows={entry.details.slice(0, -1)} /></Disclosure>
          </Entry>)}
        </section>
    </div></div>
    {opener('skills')}
    <div className="cv-layout"><div className="cv-text">
        <section id="skills" data-cv-section="">
          {header('skills')}
          <dl className="cv-skill-rows">{t.skills.map(([title, value]) => <div key={title}><dt>{title}</dt><dd>{value}</dd></div>)}</dl>
          {practices.map(entry => <Entry key={entry.id} title={entry.title} subtitle={entry.org} meta={entry.date}
            logos={entry.id === 'photography' ? [{file:'visual-china-group.webp',alt:language === 'zh' ? '视觉中国标志' : 'Visual China Group logo'}] : undefined}>
            {entry.id === 'photography'
              ? <div className="cv-gallery"><p className="cv-gallery-intro">{entry.summary}</p><Gallery language={language}/></div>
              : <p>{entry.summary}</p>}
          </Entry>)}
        </section>
        <section id="contact" data-cv-section="">
          {header('contact')}
          <p className="cv-contact-note">{t.contact}</p>
          <dl className="cv-contact-rows">
            <div><dt>{t.email}</dt><dd>{emails.map((e, i) => <React.Fragment key={e}>{i > 0 && <br />}<a href={`mailto:${e}`}>{e}</a></React.Fragment>)}</dd></div>
            <div><dt>{t.phone}</dt><dd><a href={phone.href}>{phone.display}</a></dd></div>
            <div><dt>LinkedIn</dt><dd><a href={linkedin} target="_blank" rel="noopener noreferrer">Zikai Pan</a></dd></div>
          </dl>
        </section>
        <footer className="cv-footer"><span>潘子恺 · Zikai Pan</span><a href="#home">{language === 'zh' ? '回到顶部' : 'Back to top'}</a></footer>
      </div>
    </div>
  </div>;
}
