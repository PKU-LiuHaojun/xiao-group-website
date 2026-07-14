/* 网站的中英文文字、首页动态和图片路径集中维护在这里。 */
const verifiedNews = [
  {date:'2026.07.01',zh:'祝贺柳淏君同学本科毕业论文获评2026年北京大学工学院优秀本科毕业论文，肖勋老师为优秀论文指导教师。',en:'Congratulations to Chunjun Liu: his undergraduate thesis was recognized as an Outstanding Undergraduate Thesis of the College of Engineering, Peking University, with Prof. Xun Xiao honored as the thesis supervisor.'},
  {date:'2025.12.28',zh:'应兰州大学稀有同位素前沿科学中心邀请，肖勋老师作题为“可持续钙钛矿光伏的铅管理策略”的报告并进行学术交流。',en:'Invited by the Frontiers Science Center for Rare Isotopes at Lanzhou University, Prof. Xun Xiao presented a seminar on lead-management strategies for sustainable perovskite photovoltaics.'},
  {date:'2025.10.25',zh:'肖勋老师在第四届北京大学“博雅材思”国际博士生学术论坛上作学术报告。',en:'Prof. Xun Xiao delivered an academic presentation at the 4th PKU Boya Materials International Doctoral Forum.'},
  {date:'2025.06.17',zh:'肖勋老师获评2025年浙江大学硅及先进半导体材料全国重点实验室客座研究人员。',en:'Prof. Xun Xiao was appointed a visiting researcher at the State Key Laboratory of Silicon and Advanced Semiconductor Materials, Zhejiang University.'}
];

window.siteContent = {
  zh: {
    nav: [['首页','index.html'],['近期动态','news.html'],['研究方向','research.html'],['团队成员','team.html'],['发表论文','publications.html'],['活动图集','gallery.html'],['加入我们','join.html']],
    heroTitle:'光电材料与智能器件<br>面向未来的探测与感知',
    heroCopy:'从材料和器件到智能系统，我们探索光与物质的相互作用，推动高性能探测与智能感知技术走向真实世界。',
    researchHeading:'研究方向',
    research:[
      {title:'光电探测器',text:'面向弱光、宽谱和高速应用的新型材料、器件结构与机理。',image:'assets/research-photodetector-v2.png'},
      {title:'射线探测器',text:'探索高灵敏、低剂量射线探测与成像技术。',image:'assets/research-radiation-v2.png'},
      {title:'智能光电器件与机器人',text:'融合感知、计算与行动，构建面向机器智能的新型光电系统。',image:'assets/research-intelligent-v2.png'}
    ],
    publicationHeading:'精选成果',
    papers:[
      {citation:'Xiao et al., Nature, 2025',image:'assets/paper1.png'},
      {citation:'Xiao et al., Nature, 2024',image:'assets/paper2.png'},
      {citation:'Xiao et al., Sci. Adv., 2024',image:'assets/paper3.jpg'}
    ],
    newsHeading:'近期动态',
    newsIntro:'研究进展、团队荣誉与学术交流。',
    news:verifiedNews.slice(0,3).map(item=>({date:item.date,title:item.zh})),
    joinHeading:'和我们一起，探索未知。',
    joinCopy:'<span class="join-copy-line">我们欢迎对光电材料、探测器件和智能机器人充满好奇心的学生与研究人员加入。</span><span class="join-copy-line">这里重视严谨、开放与真正有影响力的研究。</span>',
    joinLink:'加入我们',footerTagline:'',contactHeading:'',address:''
  },
  en: {
    nav: [['Home','index.html'],['News','news.html'],['Research','research.html'],['Team','team.html'],['Publications','publications.html'],['Gallery','gallery.html'],['Join Us','join.html']],
    heroTitle:'Optoelectronic Materials & Devices<br>Detection & Sensing for the Future',
    heroCopy:'From materials and devices to intelligent systems, we explore light–matter interactions and advance high-performance detection and intelligent sensing for the real world.',
    researchHeading:'Research',
    research:[
      {title:'Photodetectors',text:'New materials, device architectures and mechanisms for low-light, broadband and high-speed applications.',image:'assets/research-photodetector-v2.png'},
      {title:'Radiation Detectors',text:'Highly sensitive, low-dose radiation detection and imaging technologies.',image:'assets/research-radiation-v2.png'},
      {title:'Intelligent Optoelectronics & Robotics',text:'Integrating perception, computation and action for next-generation machine intelligence.',image:'assets/research-intelligent-v2.png'}
    ],
    publicationHeading:'Featured discoveries',
    papers:[
      {citation:'Xiao et al., Nature, 2025',image:'assets/paper1.png'},
      {citation:'Xiao et al., Nature, 2024',image:'assets/paper2.png'},
      {citation:'Xiao et al., Sci. Adv., 2024',image:'assets/paper3.jpg'}
    ],
    newsHeading:'Latest news',
    newsIntro:'Research updates, group highlights and academic exchange.',
    news:verifiedNews.slice(0,3).map(item=>({date:item.date,title:item.en})),
    joinHeading:'Explore the unknown with us.',
    joinCopy:'<span class="join-copy-line">We welcome students and researchers curious about optoelectronic materials, detector devices and intelligent robotics.</span><span class="join-copy-line">We value rigor, openness and research with real impact.</span>',
    joinLink:'Join Us',footerTagline:'',contactHeading:'',address:''
  }
};
window.verifiedNews = verifiedNews;

window.siteLanguageFromUrl=()=>{const lang=new URLSearchParams(location.search).get('lang');return lang==='en'||lang==='zh'?lang:null};
window.withSiteLanguage=(href,lang)=>{if(!href||href.startsWith('#')||/^(?:https?:|mailto:|tel:)/i.test(href))return href;const url=new URL(href,location.href);url.searchParams.set('lang',lang);return `${url.pathname.split('/').pop()}${url.search}${url.hash}`};
window.applySiteLanguageToLinks=lang=>document.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(href&&/\.html(?:[?#]|$)/i.test(href))link.setAttribute('href',withSiteLanguage(href,lang))});
window.readStoredSiteLanguage=()=>{try{return localStorage.getItem('xiao-language')}catch(_){return null}};
window.persistSiteLanguage=lang=>{try{localStorage.setItem('xiao-language',lang)}catch(_){}try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url.href)}catch(_){}};
window.initialSiteLanguage=()=>readStoredSiteLanguage()||siteLanguageFromUrl()||'zh';

window.renderSiteFooter=function(lang){
  const footer=document.querySelector('footer');if(!footer)return;const zh=lang==='zh';
  footer.className='site-footer';footer.id='contact';
  footer.innerHTML=`<div class="wrap site-footer-main"><div class="footer-brand"><strong>Xiao Group</strong><small>${zh?'北京大学材料科学与工程学院':'School of Materials Science and Engineering'}</small></div><div class="footer-contact"><span>EMAIL</span><a href="mailto:xunxiao@pku.edu.cn">xunxiao@pku.edu.cn</a></div><div class="footer-address"><span>${zh?'地址':'ADDRESS'}</span><p>${zh?'颐和园路5号 · 北京大学':'No. 5 Yiheyuan Road · Peking University'}<br>${zh?'邮编 100871':'Postal code 100871'}</p></div></div><div class="wrap footer-motto"><strong>真材实料</strong><i></i><strong>立地顶天</strong></div><div class="wrap footer-legal"><span>© 2026 Xiao Group</span></div>`;
};
