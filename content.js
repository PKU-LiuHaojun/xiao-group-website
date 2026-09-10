/* 网站的中英文文字、首页动态和图片路径集中维护在这里。 */
const verifiedNews = [
  {date:'2026.09.03',zh:'祝贺柳淏君作为博士研究生代表在北京大学材料科学与工程学院2026级开学典礼上发言！',en:'Congratulations to Haojun Liu on speaking as a doctoral student representative at the 2026 Opening Ceremony of the School of Materials Science and Engineering, Peking University!'},
  {date:'2026.09.01',zh:'欢迎张怡然、柳淏君两位同学加入课题组！',en:'Welcome Yiran Zhang and Haojun Liu to the group!'},
  {date:'2026.08.14',zh:'祝贺张广悦在国际知名期刊 Journal of Materials Chemistry A 上发表文章！',en:'Congratulations to Guangyue Zhang on publishing an article in the internationally renowned Journal of Materials Chemistry A!'},
  {date:'2026.07.01',zh:'祝贺柳淏君本科毕业论文获评2026年北京大学工学院优秀本科毕业论文，肖勋老师为优秀论文指导教师。',en:'Congratulations to Haojun Liu: his undergraduate thesis was recognized as an Outstanding Undergraduate Thesis of the College of Engineering, Peking University, with Prof. Xun Xiao honored as the thesis supervisor.'},
  {date:'2025.12.28',zh:'应兰州大学稀有同位素前沿科学中心邀请，肖勋老师作题为“可持续钙钛矿光伏的铅管理策略”的报告并进行学术交流。',en:'Invited by the Frontiers Science Center for Rare Isotopes at Lanzhou University, Prof. Xun Xiao presented a seminar on lead-management strategies for sustainable perovskite photovoltaics.'},
  {date:'2025.10.25',zh:'肖勋老师在第四届北京大学“博雅材思”国际博士生学术论坛上作学术报告。',en:'Prof. Xun Xiao delivered an academic presentation at the 4th PKU Boya Materials International Doctoral Forum.'},
  {date:'2025.06.17',zh:'肖勋老师获评2025年浙江大学硅及先进半导体材料全国重点实验室客座研究人员。',en:'Prof. Xun Xiao was appointed a visiting researcher at the State Key Laboratory of Silicon and Advanced Semiconductor Materials, Zhejiang University.'}
];

window.siteContent = {
  zh: {
    nav: [['首页','index.html'],['近期动态','news.html'],['研究方向','research.html'],['团队成员','team.html'],['发表论文','publications.html'],['实验室设备','facilities.html'],['活动图集','gallery.html'],['加入我们','join.html']],
    heroTitle:'光电材料与智能器件<br>面向未来的探测与感知',
    heroCopy:'从材料和器件到智能系统，我们探索光与物质的相互作用，推动高性能探测与智能感知技术走向真实世界。',
    researchHeading:'研究方向',
    researchMore:'查看更多 +',
    research:[
      {title:'光电探测器',text:'围绕钙钛矿及相关半导体材料，研究缺陷调控、界面物理与载流子输运，发展兼具高灵敏度、低噪声、快速响应和光谱选择性的光电探测器。',image:'assets/paper46-tunable-photodetectors.png'},
      {title:'射线探测器',text:'面向低剂量 X 射线探测与成像，通过材料、器件结构和读出方式的协同优化，提升探测灵敏度、信噪比、空间分辨率与长期稳定性。',image:'assets/research-xray-imaging.jpg'},
      {title:'智能光电器件',text:'集成微型光源、光电探测器、柔性器件、无线电子学与信号处理，构建面向健康监测、环境感知和智能交互的一体化光电器件。',image:'assets/research-wireless-probe-fig1.png'},
      {title:'功能高分子材料',text:'围绕高韧弹性体与功能离子凝胶，研究高分子网络设计和力学性能调控，并拓展其在光电器件封装防护与环境安全中的应用。',image:'assets/research-polymer-elastomer-fig3.png'}
    ],
    publicationHeading:'精选成果',
    papers:[
      {citation:'<a href="https://www.nature.com/articles/s41586-024-08408-7" target="_blank" rel="noopener"><em>Nature</em></a> <strong>638</strong>, 670-675 (2025)',image:'assets/featured-aqueous-recycling.png',url:'https://www.nature.com/articles/s41586-024-08408-7'},
      {citation:'<a href="https://www.nature.com/articles/s41586-024-07564-0" target="_blank" rel="noopener"><em>Nature</em></a> <strong>631</strong>, 313-318 (2024)',image:'assets/paper2-toc.png',url:'https://www.nature.com/articles/s41586-024-07564-0'},
      {citation:'<a href="https://www.science.org/doi/10.1126/sciadv.abi8249" target="_blank" rel="noopener"><em>Science Advances</em></a> <strong>7</strong>, eabi8249 (2021)',image:'assets/featured-ionogel.png',url:'https://www.science.org/doi/10.1126/sciadv.abi8249'},
      {citation:'<a href="https://www.nature.com/articles/s41467-020-16075-1" target="_blank" rel="noopener"><em>Nature Communications</em></a> <strong>11</strong>, 2215 (2020)',image:'assets/paper5-toc.png',url:'https://www.nature.com/articles/s41467-020-16075-1'},
      {citation:'<a href="https://doi.org/10.1039/D6TA04580D" target="_blank" rel="noopener"><em>Journal of Materials Chemistry A</em></a> <strong>14</strong> (2026)',image:'assets/paper41-toc.png',url:'https://doi.org/10.1039/D6TA04580D'}
    ],
    newsHeading:'近期动态',
    newsMore:'查看更多 +',
    recruitFeatureTitle:'北京大学材料科学与工程学院肖勋课题组博士后招聘启事',
    newsIntro:'研究进展、团队荣誉与学术交流。',
    news:verifiedNews.map(item=>({date:item.date,title:item.zh})),
    joinHeading:'和我们一起，探索未知。',
    joinCopy:'<span class="join-copy-line">我们欢迎对光电材料、探测器件和智能机器人充满好奇心的学生与研究人员加入。</span><span class="join-copy-line">这里重视严谨、开放与真正有影响力的研究。</span>',
    joinLink:'加入我们',footerTagline:'',contactHeading:'',address:''
  },
  en: {
    nav: [['Home','index.html'],['News','news.html'],['Research','research.html'],['Group Members','team.html'],['Publications','publications.html'],['Facilities and Equipment','facilities.html'],['Gallery','gallery.html'],['Join Us','join.html']],
    heroTitle:'Optoelectronic Materials & Devices<br>Detection & Sensing for the Future',
    heroCopy:'From materials and devices to intelligent systems, we explore light–matter interactions and advance high-performance detection and intelligent sensing for the real world.',
    researchHeading:'Research',
    researchMore:'More +',
    research:[
      {title:'Photodetectors',text:'We investigate defect control, interface physics and charge transport in perovskites and related semiconductors to develop photodetectors with high sensitivity, low noise, fast response and tunable spectral selectivity.',image:'assets/paper46-tunable-photodetectors.png'},
      {title:'Radiation Detectors',text:'Materials, device architectures and readout strategies are jointly optimized for low-dose X-ray detection and imaging with high sensitivity, signal-to-noise ratio, spatial resolution and operational stability.',image:'assets/research-xray-imaging.jpg'},
      {title:'Smart Optoelectronic Devices',text:'Microscale light sources, photodetectors, flexible devices, wireless electronics and signal processing are integrated for health monitoring, environmental sensing and intelligent interaction.',image:'assets/research-wireless-probe-fig1.png'},
      {title:'Functional Polymer Materials',text:'We study polymer-network design and mechanical regulation in tough elastomers and functional ionogels, extending these materials to optoelectronic encapsulation, protection and environmental safety.',image:'assets/research-polymer-elastomer-fig3.png'}
    ],
    publicationHeading:'Featured discoveries',
    papers:[
      {citation:'<a href="https://www.nature.com/articles/s41586-024-08408-7" target="_blank" rel="noopener"><em>Nature</em></a> <strong>638</strong>, 670-675 (2025)',image:'assets/featured-aqueous-recycling.png',url:'https://www.nature.com/articles/s41586-024-08408-7'},
      {citation:'<a href="https://www.nature.com/articles/s41586-024-07564-0" target="_blank" rel="noopener"><em>Nature</em></a> <strong>631</strong>, 313-318 (2024)',image:'assets/paper2-toc.png',url:'https://www.nature.com/articles/s41586-024-07564-0'},
      {citation:'<a href="https://www.science.org/doi/10.1126/sciadv.abi8249" target="_blank" rel="noopener"><em>Science Advances</em></a> <strong>7</strong>, eabi8249 (2021)',image:'assets/featured-ionogel.png',url:'https://www.science.org/doi/10.1126/sciadv.abi8249'},
      {citation:'<a href="https://www.nature.com/articles/s41467-020-16075-1" target="_blank" rel="noopener"><em>Nature Communications</em></a> <strong>11</strong>, 2215 (2020)',image:'assets/paper5-toc.png',url:'https://www.nature.com/articles/s41467-020-16075-1'},
      {citation:'<a href="https://doi.org/10.1039/D6TA04580D" target="_blank" rel="noopener"><em>Journal of Materials Chemistry A</em></a> <strong>14</strong> (2026)',image:'assets/paper41-toc.png',url:'https://doi.org/10.1039/D6TA04580D'}
    ],
    newsHeading:'Latest news',
    newsMore:'More +',
    recruitFeatureTitle:'Postdoctoral Positions in the Xiao Group, Peking University',
    newsIntro:'Research updates, group highlights and academic exchange.',
    news:verifiedNews.map(item=>({date:item.dateEn||item.date,title:item.en})),
    joinHeading:'Explore the unknown with us.',
    joinCopy:'<span class="join-copy-line">We welcome students and researchers curious about optoelectronic materials, detector devices and intelligent robotics.</span><span class="join-copy-line">We value rigor, openness and research with real impact.</span>',
    joinLink:'Join Us',footerTagline:'',contactHeading:'',address:''
  }
};
window.verifiedNews = verifiedNews;

window.siteLanguageFromUrl=()=>{const lang=new URLSearchParams(location.search).get('lang');return lang==='en'||lang==='zh'?lang:null};
window.withSiteLanguage=(href,lang)=>{if(!href||href.startsWith('#')||/^(?:https?:|mailto:|tel:)/i.test(href))return href;const url=new URL(href,location.href);url.searchParams.set('lang',lang);return `${url.pathname.split('/').pop()}${url.search}${url.hash}`};
window.applySiteLanguageToLinks=lang=>document.querySelectorAll('a[href]').forEach(link=>{const href=link.getAttribute('href');if(href&&/\.html(?:[?#]|$)/i.test(href))link.setAttribute('href',withSiteLanguage(href,lang))});
window.markActiveNavigation=()=>{let current=location.pathname.split('/').pop()||'index.html';if(current==='member-detail.html')current='team.html';if(current==='recruitment.html')current='news.html';document.querySelectorAll('header nav a').forEach(link=>{const target=(link.getAttribute('href')||'').split(/[?#]/)[0];const active=target===current;link.classList.toggle('current',active);if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')})};
window.readStoredSiteLanguage=()=>{try{return localStorage.getItem('xiao-language')}catch(_){return null}};
window.persistSiteLanguage=lang=>{try{localStorage.setItem('xiao-language',lang)}catch(_){}try{const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url.href)}catch(_){}};
window.initialSiteLanguage=()=>readStoredSiteLanguage()||siteLanguageFromUrl()||'zh';

window.renderSiteFooter=function(lang){
  const footer=document.querySelector('footer');if(!footer)return;const zh=lang==='zh';
  footer.className='site-footer';footer.id='contact';
  footer.innerHTML=`<div class="wrap site-footer-main"><div class="footer-brand"><strong>Xiao Group</strong><small>${zh?'北京大学材料科学与工程学院':'School of Materials Science and Engineering'}</small></div><div class="footer-contact"><span>EMAIL</span><a href="mailto:xunxiao@pku.edu.cn">xunxiao@pku.edu.cn</a></div><div class="footer-address"><span>${zh?'地址':'ADDRESS'}</span><p>${zh?'颐和园路5号 · 北京大学':'No. 5 Yiheyuan Road · Peking University'}<br>${zh?'邮编 100871':'Postal code 100871'}</p></div></div><div class="wrap footer-motto"><strong>真材实料</strong><i></i><strong>立地顶天</strong></div><div class="wrap footer-legal"><span>© 2026 Xiao Group</span></div>`;
};
