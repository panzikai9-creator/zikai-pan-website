import React, { useEffect, useRef, useState } from 'react';
import './gallery.css';

const photographs = [
  { image: 'behind-the-lens.webp', subject: 'camera', tag: '摄影', title: '镜头之后', alt: '穿黑色外套、戴眼镜的潘子恺，低头调整手中的相机。', position: '50% 46%' },
  { image: 'portrait-in-light.webp', subject: 'portrait', tag: '日常', title: '光里的侧影', alt: '树影下的侧面肖像，身穿白色上衣、戴着眼镜。', position: '50% 45%' },
  { image: 'coastal-afternoon.webp', subject: 'coast', tag: '旅行', title: '海边的午后', alt: '潘子恺戴墨镜身穿白色上衣站在海滩上，身后是棕榈树。', position: '50% 45%' },
  {
    image: 'street-portrait.webp',
    subject: 'photograph',
    tag: '摄影',
    title: '红砖墙前',
    alt: '戴墨镜、穿黑色外套的街头人像，背景是红砖墙。',
    position: '50% 47%',
  },
  {
    image: 'badminton-team.webp',
    subject: 'teammates',
    tag: '运动',
    title: '和球友们',
    alt: '球友们手持羽毛球拍，在室内球场并肩合影。',
    position: '50% 47%',
  },
  {
    image: 'northeastern-atrium.webp',
    subject: 'atrium',
    tag: '校园观察',
    title: '中庭里的光',
    alt: '阳光穿过层层楼廊，落在校园建筑的中庭里。',
    position: '50% 50%',
  },
  {
    image: 'northeastern-welcome.webp',
    subject: 'welcome',
    tag: '探索',
    title: '开学的校园',
    alt: '美国东北大学楼宇前挂着迎新横幅，楼顶旗帜迎风飘扬。',
    position: '50% 54%',
  },
  {
    image: 'badminton-tournament.webp',
    subject: 'tournament',
    tag: '运动',
    title: '赛场留影',
    alt: '羽毛球赛场上，几位球友在球网前举着赛事横幅合照。',
    position: '50% 69%',
  },
  {
    image: 'student-portrait.webp',
    subject: 'school',
    tag: '校园生活',
    title: '红色校服',
    alt: '身穿红色校服外套和领带的学生肖像。',
    position: '50% 30%',
  },
];

const englishPhotos = [
  { tag: 'Photography', title: 'Behind the lens', alt: 'Zikai Pan in a black jacket and glasses, adjusting the camera in his hands.' },
  { tag: 'Everyday', title: 'A portrait in the light', alt: 'A side profile in glasses and a white shirt beneath the trees.' },
  { tag: 'Travel', title: 'A coastal afternoon', alt: 'Zikai Pan wearing sunglasses and a white shirt on a beach lined with palm trees.' },
  { tag: 'Photography', title: 'By the brick wall', alt: 'A street portrait wearing sunglasses and a black jacket, in front of a red brick wall.' },
  { tag: 'Sport', title: 'With teammates', alt: 'Badminton players holding rackets together on an indoor court.' },
  { tag: 'Campus', title: 'Light in the atrium', alt: 'Daylight shines through layered walkways into a university atrium.' },
  { tag: 'Exploring', title: 'A new semester', alt: 'A welcome banner on a Northeastern University building with flags overhead.' },
  { tag: 'Sport', title: 'At the tournament', alt: 'Badminton teammates pose in front of the net holding an event banner.' },
  { tag: 'School days', title: 'The red blazer', alt: 'A student portrait wearing a red school blazer and tie.' }
];
const galleryLabels = {
  zh: { title: '工作之外', intro: '在球场相聚，沿校园漫步，也偶尔站到镜头前。', close: '关闭照片', previous: '上一张照片', next: '下一张照片', enlarge: '放大照片：' },
  en: { title: 'Beyond Work', intro: 'Time with teammates, walks around campus and an occasional moment in front of the camera.', close: 'Close photo', previous: 'Previous photo', next: 'Next photo', enlarge: 'Enlarge photo: ' }
};
const localizePhotos = language => photographs.map((photo, index) => ({ ...photo, ...(language === 'en' ? englishPhotos[index] : {}) }));

const imageUrl = photo => `${import.meta.env.BASE_URL}images/${photo.image}`;

function Glyph({ type }) {
  const paths = {
    expand: 'M4 10V4h6m10 10v6h-6m-5-5 5 5m1-11-5-5',
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
  return (
    <section id="gallery" className="gallery-section" aria-labelledby="gallery-heading">
      <div className="wrap">
        <header className="gallery-heading-row">
          <div>
            <div className="eyebrow gallery-eyebrow">BEYOND WORK</div>
            <h2 id="gallery-heading">{labels.title}</h2>
          </div>
          <p>{labels.intro}</p>
        </header>
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <button type="button" key={photo.image} className={'gallery-tile gallery-' + photo.subject}
              aria-label={labels.enlarge + photo.title} aria-haspopup="dialog"
              onClick={event => setOpen({ index, opener: event.currentTarget })}>
              <img loading="lazy" decoding="async" src={imageUrl(photo)} alt={photo.alt} style={{ objectPosition: photo.position }} />
              <span className="gallery-tile-caption"><span>{photo.tag}</span><strong>{photo.title}</strong></span>
              <span className="gallery-expand"><Glyph type="expand" /></span>
            </button>
          ))}
        </div>
      </div>
      {open && <Lightbox language={language} startIndex={open.index} opener={open.opener} onDismiss={() => setOpen(null)} />}
    </section>
  );
}
