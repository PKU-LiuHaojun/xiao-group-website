const langButtons=[...document.querySelectorAll('[data-language]')];
function renderShared(lang){
  const c=siteContent[lang];document.documentElement.dataset.lang=lang;document.documentElement.lang=lang==='zh'?'zh-CN':'en';
  document.querySelectorAll('.archive-list time[datetime]').forEach(time=>{time.textContent=time.getAttribute('datetime').replaceAll('-','.')});
  const archive=document.querySelector('.archive-list');if(archive&&window.verifiedNews)archive.innerHTML=verifiedNews.map(item=>`<article><time datetime="${item.date.replaceAll('.','-')}">${item.date}</time><div><h2>${lang==='zh'?item.zh:item.en}</h2></div></article>`).join('');
  document.querySelectorAll('.shared-nav').forEach(n=>n.innerHTML=c.nav.map(([x,h])=>`<a href="${withSiteLanguage(h,lang)}">${x}</a>`).join(''));
  langButtons.forEach(b=>{const on=b.dataset.language===lang;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on)});
  const memberGrid=document.getElementById('phdMembers');
  if(memberGrid&&window.memberProfiles)memberGrid.innerHTML=memberProfiles.filter(member=>member.group==='phd').map(member=>`<a class="member-card" href="member-detail.html?id=${member.id}"><div class="portrait-placeholder">${member.enName.split(' ').map(part=>part[0]).join('').slice(0,2)}</div><h3><span>${member.zhName}</span><small>${member.enName}</small></h3><p>${lang==='zh'?member.zhRole:member.enRole}</p><span class="profile-link">${lang==='zh'?'查看详情 →':'View profile →'}</span></a>`).join('');
  renderProfile(lang);
  renderSiteFooter(lang);
  applySiteLanguageToLinks(lang);
  persistSiteLanguage(lang);
  document.documentElement.classList.add('lang-ready');
}
langButtons.forEach(b=>b.addEventListener('click',()=>renderShared(b.dataset.language)));
renderShared(initialSiteLanguage());

function renderProfile(lang){
  const box=document.getElementById('profile');if(!box||!window.memberProfiles)return;
  const id=new URLSearchParams(location.search).get('id');const m=memberProfiles.find(x=>x.id===id)||memberProfiles[0];
  const initial=m.enName.split(' ').map(x=>x[0]).join('').slice(0,2);const portrait=m.photo?`<img src="${m.photo}" alt="${lang==='zh'?m.zhName:m.enName}">`:`<div class="profile-placeholder">${initial}</div>`;
  const sections=[['Education & experience','教育与经历',m.education],['Research interests','研究方向',m.research],['Selected honors','代表性荣誉',m.awards],['Beyond research','兴趣爱好',m.interests]].filter(x=>x[2]&&x[2][lang]);
  box.innerHTML=`<div class="profile-lead"><div>${portrait}</div><div><p class="kicker">${m.group==='pi'?'Principal Investigator':'Group Member'}</p><h1>${lang==='zh'?m.zhName:m.enName}</h1><p class="profile-en">${lang==='zh'?m.enName:m.zhName}</p><p class="profile-role">${lang==='zh'?m.zhRole:m.enRole}</p>${m.email?`<a href="mailto:${m.email}">${m.email}</a>`:''}</div></div><div class="profile-sections">${sections.map((s,i)=>`<article><span>0${i+1}</span><h2>${lang==='zh'?s[1]:s[0]}</h2><div>${s[2][lang]}</div></article>`).join('')}</div>`;
  const nameHeading=box.querySelector('h1');
  if(nameHeading){nameHeading.className='profile-name';nameHeading.innerHTML=`<span>${m.zhName}</span><small>${m.enName}</small>`;}
  const oldSecondaryName=box.querySelector('.profile-en');if(oldSecondaryName)oldSecondaryName.remove();
  document.title=`${m.zhName} · ${m.enName} | Xiao Group`;
}

if(document.getElementById('publicationList')){
  const years=[...new Set(papersData.map(p=>p.year))].sort((a,b)=>b-a);
  document.getElementById('yearFilters').innerHTML=years.map(y=>`<a href="#year-${y}">${y}</a>`).join('');
  document.getElementById('publicationList').innerHTML=years.map(year=>{
    const rows=papersData.filter(p=>p.year===year).map(p=>`<a class="publication-row" href="${p.url}" target="_blank" rel="noopener"><div class="publication-image"><img src="${p.image.replace('images/','assets/')}" alt=""></div><div class="publication-copy"><h2>${p.title}</h2><p class="pub-authors">${p.authors}</p><p class="pub-journal">${p.citation}</p></div></a>`).join('');
    return `<section class="publication-year" id="year-${year}"><header><h2>${year}</h2></header>${rows}</section>`;
  }).join('');
}
