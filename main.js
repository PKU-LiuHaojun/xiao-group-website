const $ = id => document.getElementById(id);
const fields = ["heroTitle","heroCopy","researchHeading","publicationHeading","newsHeading","newsIntro","joinHeading","joinCopy","joinLink","footerTagline","contactHeading","address"];

function render(lang) {
  const c = window.siteContent[lang];
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  fields.forEach(id => { const element = $(id); if (element) element.innerHTML = c[id]; });
  $("nav").innerHTML = c.nav.map(([label,href]) => `<a href="${withSiteLanguage(href,lang)}">${label}</a>`).join("");
  $("researchGrid").innerHTML = c.research.map((item,i) => `<article class="research-card"><img src="${item.image}" alt=""><div><span>0${i+1}</span><h3>${item.title}</h3><p>${item.text}</p></div></article>`).join("");
  $("paperGrid").innerHTML = c.papers.map(item => `<article class="paper" tabindex="0"><img src="${item.image}" alt=""><p>${item.citation}</p></article>`).join("");
  $("newsList").innerHTML = c.news.map(item => `<article class="news-item"><time>${item.date}</time><div><h3>${item.title}</h3></div></article>`).join("");
  document.querySelectorAll("[data-language]").forEach(button => { const active = button.dataset.language === lang; button.classList.toggle("active", active); button.setAttribute("aria-pressed", active); });
  renderSiteFooter(lang);
  applySiteLanguageToLinks(lang);
  persistSiteLanguage(lang);
  document.documentElement.classList.add("lang-ready");
}
document.querySelectorAll("[data-language]").forEach(button => button.addEventListener("click",() => render(button.dataset.language)));
render(initialSiteLanguage());
