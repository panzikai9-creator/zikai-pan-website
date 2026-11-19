import { projects } from './content.js';

const studyDetails = {
  airwalk: {
    title: 'Airwalk 品牌重塑', org: '美国东北大学 · 消费者行为咨询项目',
    metric: '3 个竞品', metricNote: 'Vans / Adidas / Converse', tags: ['品牌策略', '消费者洞察'],
  },
  netflix: {
    title: 'Netflix 促销效果研究', org: '美国东北大学 · MKTG 2602 期末项目',
    metric: '2 种估计方法', metricNote: 'OLS / IPW', tags: ['定量营销', '因果推断'],
    logo: 'netflix-wordmark.webp',
  }
};
export const studies = projects.map(p => ({
  ...studyDetails[p.id], id:p.id, category:'研究项目', summary:p.blurb,
  role:'项目核心成员', details:[['研究问题',p.question], ...p.paragraphs, ['项目成果',p.result]]
}));
export const experiences = [
  {
    id:'conch', category:'职业经历', title:'市场营销实习生', org:'海创（上海）私募基金管理有限公司',
    date:'2026.05 — 2026.07', location:'上海', tags:['市场调研','营销策划'],
    summary:'参与市场调研、消费者分析与营销项目支持，为市场策略、内容传播及项目策划提供信息与分析支持。',
    details:[['行业与市场研究','分析行业报告、企业动态与市场趋势，为市场策略制定和项目规划提供数据支持。'],['媒体与内容运营','协助维护微信公众号等官方媒体平台，撰写市场资讯与企业宣传内容。'],['竞品与案例分析','研究竞争对手及行业案例中的品牌营销活动、内容策略与传播渠道，为市场推广方案提供参考。'],['营销项目支持','参与方案策划、创意构思、内容规划及汇报材料整理，支持客户沟通与项目推进。']]
  },
  {
    id:'domino-operations', category:'职业经历', title:'运营与品牌合伙人', org:'多米诺（合肥）国际教育科技有限公司',
    date:'2024.03 — 2026.04', location:'合肥', tags:['品牌推广','教育运营'],
    summary:'作为股权合伙人参与教育机构的日常运营与品牌推广。',
    details:[['运营与推广','以合伙人身份参与机构日常运营，推动教育服务的品牌推广。'],['与教学的联系','在参与运营期间，我也承担雅思阅读和大学英语四六级教学，从学生的学习需求出发理解课程服务。']]
  },
  {
    id:'domino-teaching', category:'职业经历', title:'雅思阅读与四六级讲师', org:'多米诺（合肥）国际教育科技有限公司',
    date:'2025.06 — 2026.02', location:'合肥', tags:['英语教学','备考指导'],
    summary:'教授雅思阅读及大学英语四六级课程，针对学员的备考需求开展阅读训练。',
    details:[['教学内容','承担雅思阅读以及大学英语四、六级教学。'],['备考指导','围绕学员的阅读难点与考试目标，开展有针对性的练习和备考指导。']]
  },
  {
    id:'orient', category:'职业经历', title:'市场营销实习生', org:'东方证券 · 南京证券营业部',
    date:'2024.06 — 2024.08',location:'南京', tags:['客户研究','金融传播'],
    metric:'30+ 家',metricNote:'调研覆盖的机构客户',
    summary:'通过问卷与访谈了解机构客户需求，用市场简报和投教内容支持客户沟通。',
    details:[['机构客户调研','访谈及问卷覆盖 30 余家机构客户，归纳出金融信息表达、行业洞察和市场更新速度方面的需求，撰写分析报告供季度营销策略调整参考。'],['市场与数据分析','使用 Wind 和 Bloomberg 跟踪 A 股交易、板块表现以及新能源和科技行业的投资趋势。通过 Excel 清洗和可视化数据，完成 10 余份市场周报，并协助准备面向重要客户的定制报告。'],['投资者教育','为微信公众号撰写市场评论和投资者教育文章，解释市盈率、净资产收益率及板块趋势，累计获得 8,000 余次阅读。']]
  },
  {
    id:'photography', category:'专业实践', title:'签约摄影师',org:'视觉中国 · Visual China Group',tags:['摄影','视觉表达'],
    summary:'在消费者研究之外，摄影是我长期使用的另一种观察方式。',
    details:[['摄影实践','视觉中国签约摄影师。我的个人画廊收录校园、球场与街头的生活片段。']]
  },
  {
    id:'forage', category:'专业实践', title:'战略咨询入门模拟项目',org:'BCG · Forage',date:'2026.04',tags:['职业模拟','战略咨询'],
    summary:'通过 Forage 完成 BCG 战略咨询入门模拟项目，取得项目完成证书。',
    details:[['项目形式','BCG 通过 Forage 提供的线上战略咨询入门模拟项目。'],['完成记录','于 2026 年 4 月取得该模拟项目的完成证书。']]
  },
];

export const categoryIds = {
  '研究项目': 'research',
  '职业经历': 'experience',
  '专业实践': 'practice'
};
