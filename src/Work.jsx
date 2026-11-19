import React, { useEffect, useRef, useState } from 'react';
import { studies, experiences, categoryIds } from './experience.js';
import { englishEntries } from './experience.en.js';

const allEntries = [...studies, ...experiences];
const copy = {
  zh: {
    filters: [['all', '全部'], ['research', '研究项目'], ['experience', '职业经历'], ['practice', '专业实践']],
    title: '经历与项目', filterLabel: '筛选经历与项目', close: '关闭项目或经历详情',
    open: entry => '查看' + entry.org + '，' + entry.title + '详情'
  },
  en: {
    filters: [['all', 'All'], ['research', 'Research'], ['experience', 'Experience'], ['practice', 'Professional Practice']],
    title: 'Experience & Projects', filterLabel: 'Filter experience and projects', close: 'Close project or experience details',
    open: entry => 'View ' + entry.title + ' at ' + entry.org
  }
};

function Detail({ entry, onClose, labels }) {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog ref={ref} className="work-dialog" aria-labelledby="detail-title" onCancel={onClose}
    onClick={event => { if (event.target === ref.current) onClose(); }}>
    <div className="detail-body">
      <div className="detail-top">
        <span className="eyebrow">{entry.category}</span>
        <button autoFocus className="icon-button" onClick={onClose} aria-label={labels.close}>×</button>
      </div>
      {entry.logo && <img className="detail-logo" alt={entry.org} src={'./images/' + entry.logo}/>}
      <h2 id="detail-title">{entry.title}</h2>
      <p className="detail-meta">{[entry.org, entry.role, entry.date, entry.location].filter(Boolean).join(' · ')}</p>
      <div className="tag-row">{entry.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      {entry.details.map(([heading, body]) => <div key={heading} className="detail-paragraph"><h3>{heading}</h3><p>{body}</p></div>)}
    </div>
  </dialog>;
}
function WorkCard({ entry, open, labels }) {
  return <button className={'work-card ' + (entry.image ? 'feature-card' : 'role-card')} type="button"
    onClick={() => open(entry.id)} aria-label={labels.open(entry)}>
    {entry.image && <div className="work-image"><img loading="lazy" src={'./' + entry.image} alt={entry.imageAlt}/><span>{entry.imageLabel}</span></div>}
    <div className="work-body">
      <div className="work-meta"><span>{entry.category}</span><span>{entry.date || entry.role || ''}</span></div>
      <div className="work-org">{entry.org}</div><h3>{entry.title}</h3>
      <p className="work-summary">{entry.summary}</p>
      {entry.metric && <div className="work-metric"><strong>{entry.metric}</strong><span>{entry.metricNote}</span></div>}
      <div className="work-baseline"><span>{entry.tags.join(' / ')}</span><span className="open-arrow" aria-hidden="true">↗</span></div>
    </div>
  </button>;
}
export default function Work({ language = 'zh' }) {
  const [filter, setFilter] = useState('all');
  const [activeId, setActiveId] = useState(null);
  const labels = copy[language] || copy.zh;
  const localized = allEntries.map(entry => ({
    ...entry,
    ...(language === 'en' ? englishEntries[entry.id] : {}),
    categoryId: categoryIds[entry.category]
  }));
  const visible = localized.filter(entry => filter === 'all' || entry.categoryId === filter);
  const active = localized.find(entry => entry.id === activeId);
  return <section id="work" className="work-section band"><div className="wrap">
    <div className="section-heading"><p className="eyebrow">EXPERIENCE &amp; PROJECTS</p><h2>{labels.title}</h2></div>
    <div className="filter-bar" role="group" aria-label={labels.filterLabel}>
      {labels.filters.map(([id, label]) => <button key={id} aria-pressed={id === filter} onClick={() => setFilter(id)}>{label}</button>)}
    </div>
    <div className="work-grid">{visible.map(entry => <WorkCard key={entry.id} entry={entry} open={setActiveId} labels={labels}/>)}</div>
    {active && <Detail entry={active} onClose={() => setActiveId(null)} labels={labels}/>}
  </div></section>;
}
