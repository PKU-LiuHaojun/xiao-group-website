const langButtons=[...document.querySelectorAll('[data-language]')];
function renderShared(lang){
  const c=siteContent[lang];document.documentElement.dataset.lang=lang;document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.querySelectorAll('.archive-list time[datetime]').forEach(time=>{time.textContent=time.getAttribute('datetime').replaceAll('-','.')});
  const archive=document.querySelector('.archive-list');if(archive&&window.verifiedNews)archive.innerHTML=verifiedNews.map(item=>{const date=lang==='zh'?item.date:(item.dateEn||item.date);const datetime=/^\d{4}\.\d{2}\.\d{2}$/.test(item.date)?` datetime="${item.date.replaceAll('.','-')}"`:'';return `<article><time${datetime}>${date}</time><div><h2>${lang==='zh'?item.zh:item.en}</h2></div></article>`}).join('');
  document.querySelectorAll('.shared-nav').forEach(n=>n.innerHTML=c.nav.map(([x,h])=>`<a href="${withSiteLanguage(h,lang)}">${x}</a>`).join(''));
  langButtons.forEach(b=>{const on=b.dataset.language===lang;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});
  const renderMemberGrid=(id,group)=>{const grid=document.getElementById(id);if(grid&&window.memberProfiles)grid.innerHTML=memberProfiles.filter(member=>member.group===group).map(member=>{const initials=member.enName.split(' ').map(part=>part[0]).join('').slice(0,2);const portrait=member.photo?`<span class="member-photo-frame"><img class="member-photo" src="${member.photo}" alt="${member.zhName} / ${member.enName}" decoding="sync" style="object-position:${member.photoPosition||'50% 50%'};object-fit:${member.photoFit||'cover'};background:${member.photoBackground||'#f3edef'};transform:${member.photoTransform||'none'}"></span>`:`<div class="portrait-placeholder">${initials}</div>`;return `<a class="member-card" href="member-detail.html?id=${member.id}">${portrait}<h3><span>${member.zhName}</span><small>${member.enName}</small></h3><p class="member-role">${lang==='zh'?member.zhRole:member.enRole}</p></a>`;}).join('');};
  renderMemberGrid('phdMembers','phd');
  renderMemberGrid('undergraduateMembers','undergraduate');
  renderProfile(lang);
  renderSiteFooter(lang);
  applySiteLanguageToLinks(lang);
  markActiveNavigation();
  persistSiteLanguage(lang);
  document.documentElement.classList.add('lang-ready');
}
langButtons.forEach(b=>b.addEventListener('click',()=>renderShared(b.dataset.language)));
renderShared(initialSiteLanguage());

document.querySelectorAll('[data-profile-href]').forEach(card=>{
  const openProfile=()=>location.href=withSiteLanguage(card.dataset.profileHref,document.documentElement.dataset.lang||'zh');
  card.addEventListener('click',event=>{if(!event.target.closest('a'))openProfile()});
  card.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target===card){event.preventDefault();openProfile()}});
});

function renderProfile(lang){
  const box=document.getElementById('profile');if(!box||!window.memberProfiles)return;
  const id=new URLSearchParams(location.search).get('id');const m=memberProfiles.find(x=>x.id===id)||memberProfiles[0];
  const initial=m.enName.split(' ').map(x=>x[0]).join('').slice(0,2);const portrait=m.photo?`<img src="${m.photo}" alt="${lang==='zh'?m.zhName:m.enName}" style="object-position:${m.detailPhotoPosition||m.photoPosition||'50% 50%'};object-fit:${m.detailPhotoFit||m.photoFit||'cover'};background:${m.photoBackground||'#f3edef'};transform:${m.detailPhotoTransform||'none'}">`:`<div class="profile-placeholder">${initial}</div>`;
  const sections=(m.group==='pi'
    ? [['Education & experience','教育与经历',m.education],['Research interests','研究方向',m.research],['Selected honors','代表性荣誉',m.awards],['Contact','联系方式',{zh:`<a href="mailto:${m.email}">${m.email}</a>`,en:`<a href="mailto:${m.email}">${m.email}</a>`}]]
    : [['Research interests','研究方向',m.research],['Contact','联系方式',m.contact]]
  ).filter(x=>x[2]&&x[2][lang]);
  box.classList.toggle('student-profile',m.group!=='pi');
  const sectionMarkup=sections.map((s,i)=>m.group==='pi'
    ? `<article><span>0${i+1}</span><h2>${lang==='zh'?s[1]:s[0]}</h2><div>${s[2][lang]}</div></article>`
    : `<article class="student-info-row"><span>0${i+1}</span><div><strong>${lang==='zh'?s[1]:s[0]}${lang==='zh'?'：':': '}</strong>${s[2][lang]}</div></article>`
  ).join('');
  const profileGroupLabel=m.group==='pi'?'Principal Investigator':m.group==='phd'?'Graduate Students':'Undergraduate Students';
  box.innerHTML=`<div class="profile-lead"><div>${portrait}</div><div><p class="kicker">${profileGroupLabel}</p><h1>${lang==='zh'?m.zhName:m.enName}</h1><p class="profile-en">${lang==='zh'?m.enName:m.zhName}</p><p class="profile-role">${lang==='zh'?m.zhRole:m.enRole}</p></div></div><div class="profile-sections">${sectionMarkup}</div>`;
  const nameHeading=box.querySelector('h1');
  if(nameHeading){nameHeading.className='profile-name';nameHeading.innerHTML=`<span>${m.zhName}</span><small>${m.enName}</small>`;}
  const oldSecondaryName=box.querySelector('.profile-en');if(oldSecondaryName)oldSecondaryName.remove();
  document.title=`${m.zhName} · ${m.enName} | Xiao Group`;
}

if(document.getElementById('publicationList')){
  const years=[...new Set(papersData.map(p=>p.year))].sort((a,b)=>b-a);
  const formatCitation=p=>{
    const volume=p.volume?` ${p.volume}`:'';
    const locator=p.pages?`, ${p.pages}`:'';
    return `${p.journal}${volume}${locator} (${p.year})`;
  };
  document.getElementById('yearFilters').innerHTML=years.map(y=>`<a href="#year-${y}">${y}</a>`).join('');
  document.getElementById('publicationList').innerHTML=years.map(year=>{
    const rows=papersData.filter(p=>p.year===year).map(p=>`<a class="publication-row" href="${p.url}" target="_blank" rel="noopener"><div class="publication-image"><img src="${p.image.replace('images/','assets/')}" alt=""></div><div class="publication-copy"><h2>${p.title}</h2><p class="pub-authors">${p.authors}</p><p class="pub-journal">${formatCitation(p)}</p></div></a>`).join('');
    return `<section class="publication-year" id="year-${year}"><header><h2>${year}</h2></header>${rows}</section>`;
  }).join('');
  const yearNav=document.getElementById('yearFilters');
  const yearSentinel=document.createElement('span');
  yearSentinel.className='year-jump-sentinel';
  yearNav.before(yearSentinel);
  const updateFloatingYearNav=()=>{
    const sentinelTop=yearSentinel.getBoundingClientRect().top;
    const listBottom=document.getElementById('publicationList').getBoundingClientRect().bottom;
    const shouldFloat=sentinelTop<92&&listBottom>window.innerHeight*.35;
    const isFloating=yearNav.classList.contains('is-floating');
    if(shouldFloat&&!isFloating){
      yearSentinel.style.height=`${yearNav.offsetHeight+55}px`;
      yearNav.classList.add('is-floating');
    }else if(!shouldFloat&&isFloating){
      yearNav.classList.remove('is-floating');
      yearSentinel.style.height='1px';
    }
  };
  window.addEventListener('scroll',updateFloatingYearNav,{passive:true});
  window.addEventListener('resize',updateFloatingYearNav);
  updateFloatingYearNav();
}
