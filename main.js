const $ = id => document.getElementById(id);
const fields = ["heroTitle","researchHeading","researchMore","publicationHeading","newsHeading","newsMore","recruitFeatureTitle","joinHeading","joinLink","footerTagline","contactHeading","address"];
let newsTickerTimer;

function initNewsTicker() {
  clearInterval(newsTickerTimer);
  const list = $("newsList");
  const track = list?.querySelector(".news-track");
  const items = track ? [...track.children] : [];
  if (!track || items.length <= 3 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  items.slice(0,3).forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden","true");
    track.appendChild(clone);
  });
  let index = 0;
  const advance = () => {
    index += 1;
    track.style.transition = "transform .65s cubic-bezier(.22,.7,.25,1)";
    track.style.transform = `translateY(-${index * items[0].offsetHeight}px)`;
  };
  const start = () => { clearInterval(newsTickerTimer); newsTickerTimer = setInterval(advance,3000); };
  track.addEventListener("transitionend",() => {
    if (index < items.length) return;
    track.style.transition = "none";
    index = 0;
    track.style.transform = "translateY(0)";
  });
  list.addEventListener("mouseenter",() => clearInterval(newsTickerTimer));
  list.addEventListener("mouseleave",start);
  list.addEventListener("focusin",() => clearInterval(newsTickerTimer));
  list.addEventListener("focusout",start);
  document.addEventListener("visibilitychange",() => document.hidden ? clearInterval(newsTickerTimer) : start(),{once:true});
  start();
}

function initResearchCarousel(lang) {
  const carousel = $("researchGrid");
  const viewport = carousel?.querySelector(".research-carousel-viewport");
  const track = viewport?.querySelector(".research-carousel-track");
  const originalSlides = track ? [...track.querySelectorAll(".research-slide")] : [];
  const dots = carousel ? [...carousel.querySelectorAll(".research-dot")] : [];
  if (!viewport || !track || !originalSlides.length) return;
  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalSlides.length-1].cloneNode(true);
  firstClone.setAttribute("aria-hidden","true");
  lastClone.setAttribute("aria-hidden","true");
  track.prepend(lastClone);
  track.append(firstClone);
  const count = originalSlides.length;
  let activeIndex = 0;
  let physicalIndex = 1;
  let settleTimer;
  const paintDots = () => {
    dots.forEach((dot,i)=>{dot.classList.toggle("active",i===activeIndex);dot.setAttribute("aria-current",i===activeIndex?"true":"false")});
  };
  const moveTo = (index,smooth=true) => {
    physicalIndex = index;
    viewport.classList.toggle("is-jumping",!smooth);
    viewport.scrollTo({left:index*viewport.clientWidth,behavior:smooth?"smooth":"auto"});
    if (!smooth) requestAnimationFrame(()=>viewport.classList.remove("is-jumping"));
  };
  const settleLoop = () => {
    physicalIndex = Math.round(viewport.scrollLeft/Math.max(1,viewport.clientWidth));
    if (physicalIndex === 0) { physicalIndex=count; moveTo(physicalIndex,false); }
    else if (physicalIndex === count+1) { physicalIndex=1; moveTo(physicalIndex,false); }
    activeIndex = physicalIndex-1;
    paintDots();
  };
  moveTo(1,false);
  carousel.querySelector(".research-prev")?.addEventListener("click",()=>{activeIndex=(activeIndex-1+count)%count;paintDots();moveTo(physicalIndex-1,true)});
  carousel.querySelector(".research-next")?.addEventListener("click",()=>{activeIndex=(activeIndex+1)%count;paintDots();moveTo(physicalIndex+1,true)});
  dots.forEach((dot,i)=>dot.addEventListener("click",()=>{
    const previous = activeIndex;
    const distance = Math.abs(i-previous);
    activeIndex=i;
    paintDots();
    if (previous===0 && i===count-1) moveTo(0,true);
    else if (previous===count-1 && i===0) moveTo(count+1,true);
    else moveTo(i+1,distance===1);
  }));
  viewport.addEventListener("scroll",()=>{clearTimeout(settleTimer);settleTimer=setTimeout(settleLoop,90)},{passive:true});
  window.addEventListener("resize",()=>moveTo(physicalIndex,false),{passive:true});
}

function initFeaturedCarousel() {
  const carousel = $("paperGrid");
  const viewport = carousel?.querySelector(".featured-carousel-viewport");
  const track = viewport?.querySelector(".featured-carousel-track");
  const originals = track ? [...track.querySelectorAll(".featured-paper")] : [];
  const dots = carousel ? [...carousel.querySelectorAll(".featured-dot")] : [];
  if (!viewport || !track || originals.length < 2) return;
  originals.slice(-2).reverse().forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute("aria-hidden","true");track.prepend(clone)});
  originals.slice(0,2).forEach(card=>{const clone=card.cloneNode(true);clone.setAttribute("aria-hidden","true");track.append(clone)});
  const count=originals.length;
  let activeIndex=0;
  let physicalIndex=2;
  let settleTimer;
  const step=()=>originals[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(track).gap)||0);
  const paintDots=()=>dots.forEach((dot,i)=>{dot.classList.toggle("active",i===activeIndex);dot.setAttribute("aria-current",i===activeIndex?"true":"false")});
  const moveTo=(index,smooth=true)=>{physicalIndex=index;viewport.classList.toggle("is-jumping",!smooth);viewport.scrollTo({left:index*step(),behavior:smooth?"smooth":"auto"});if(!smooth)requestAnimationFrame(()=>viewport.classList.remove("is-jumping"))};
  const settle=()=>{physicalIndex=Math.round(viewport.scrollLeft/Math.max(1,step()));if(physicalIndex<2){physicalIndex+=count;moveTo(physicalIndex,false)}else if(physicalIndex>=count+2){physicalIndex-=count;moveTo(physicalIndex,false)}activeIndex=(physicalIndex-2+count)%count;paintDots()};
  moveTo(2,false);
  carousel.querySelector(".featured-prev")?.addEventListener("click",()=>{activeIndex=(activeIndex-1+count)%count;paintDots();moveTo(physicalIndex-1,true)});
  carousel.querySelector(".featured-next")?.addEventListener("click",()=>{activeIndex=(activeIndex+1)%count;paintDots();moveTo(physicalIndex+1,true)});
  dots.forEach((dot,i)=>dot.addEventListener("click",()=>{const previous=activeIndex;activeIndex=i;paintDots();if(previous===0&&i===count-1)moveTo(1,true);else if(previous===count-1&&i===0)moveTo(count+2,true);else moveTo(i+2,Math.abs(i-previous)===1)}));
  viewport.addEventListener("scroll",()=>{clearTimeout(settleTimer);settleTimer=setTimeout(settle,90)},{passive:true});
  window.addEventListener("resize",()=>moveTo(physicalIndex,false),{passive:true});
}

function render(lang) {
  const c = window.siteContent[lang];
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  fields.forEach(id => { const element = $(id); if (element) element.innerHTML = c[id]; });
  $("nav").innerHTML = c.nav.map(([label,href]) => `<a href="${withSiteLanguage(href,lang)}">${label}</a>`).join("");
  $("researchGrid").innerHTML = `<button class="research-arrow research-prev" type="button" aria-label="${lang==='zh'?'上一个研究方向':'Previous research area'}">‹</button><div class="research-carousel-viewport"><div class="research-carousel-track">${c.research.map((item,i) => `<article class="research-slide"><div class="research-slide-image"><img src="${item.image}" alt="${item.title}"></div><div class="research-slide-copy"><span>0${i+1}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join("")}</div></div><button class="research-arrow research-next" type="button" aria-label="${lang==='zh'?'下一个研究方向':'Next research area'}">›</button><div class="research-dots">${c.research.map((_,i)=>`<button class="research-dot${i===0?' active':''}" type="button" aria-label="${lang==='zh'?`查看第 ${i+1} 个研究方向`:`View research area ${i+1}`}" aria-current="${i===0?'true':'false'}"></button>`).join("")}</div>`;
  $("paperGrid").innerHTML = `<button class="featured-arrow featured-prev" type="button" aria-label="${lang==='zh'?'上一篇精选成果':'Previous featured paper'}">‹</button><div class="featured-carousel-viewport"><div class="featured-carousel-track">${c.papers.map(item=>`<article class="featured-paper"><a class="featured-paper-image" href="${item.url}" target="_blank" rel="noopener"><img src="${item.image}" alt=""></a><p>${item.citation}</p></article>`).join("")}</div></div><button class="featured-arrow featured-next" type="button" aria-label="${lang==='zh'?'下一篇精选成果':'Next featured paper'}">›</button><div class="featured-dots">${c.papers.map((_,i)=>`<button class="featured-dot${i===0?' active':''}" type="button" aria-label="${lang==='zh'?`查看第 ${i+1} 篇精选成果`:`View featured paper ${i+1}`}" aria-current="${i===0?'true':'false'}"></button>`).join("")}</div>`;
  $("newsList").innerHTML = `<div class="news-track">${c.news.map(item => `<article class="news-item"><time>${item.date}</time><div><h3>${item.title}</h3></div></article>`).join("")}</div>`;
  document.querySelectorAll("[data-language]").forEach(button => { const active = button.dataset.language === lang; button.classList.toggle("active", active); button.setAttribute("aria-pressed", active); });
  renderSiteFooter(lang);
  applySiteLanguageToLinks(lang);
  markActiveNavigation();
  persistSiteLanguage(lang);
  document.documentElement.classList.add("lang-ready");
  initResearchCarousel(lang);
  initFeaturedCarousel();
  initNewsTicker();
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click",() => render(button.dataset.language)));
render(initialSiteLanguage());
