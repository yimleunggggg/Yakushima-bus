/** 同步渲染主导航，避免 defer 的 site-chrome.js 替换文案时闪烁 */
(function () {
  const LANG_KEY = "yakushima-bus-lang";

  // GA4: timetable, fares and the POI map are the recurring on-island tasks.
  const PRIMARY_NAV = [
    { href: "/", key: "navTime", active: /^\/$/i },
    { href: "/fare/", key: "navMap", active: /^\/fare\/?$/i },
    { href: "/map/", key: "navGuide", active: /^\/map\/?$/i },
  ];
  const TRAVEL_NAV = [
    { href: "/ferry/", key: "navAccess", active: /^\/ferry\/?$/i },
    { href: "/trekking/", key: "navTrek", active: /^\/trekking\/?$/i },
    { href: "/guides/", key: "navTravelGuides", active: /^\/(?:guides(?:\/|$)|without-car\/?$)/i },
  ];
  const INFO_NAV = [
    { href: "/intro/", key: "navIntro", active: /^\/intro\/?$/i },
    { href: "/about/", key: "navAbout", active: /^\/about\/?$/i },
  ];

  const NAV_UI = {
    ja: {
      navMore: "その他", navAbout: "このサイトについて", navAboutTitle: "このサイトについて",
      navAria: "メインメニュー",
      navTravelGuides: "旅行ガイド",
      navTravelGuidesTitle: "旅行ガイド",
      navGuide: "マップ",
      navGuideTitle: "スポット地図",
      navTime: "時刻表",
      navTimeTitle: "バス時刻表",
      navMap: "運賃",
      navMapTitle: "運賃計算",
      navAccess: "フェリー",
      navAccessTitle: "フェリー・上島",
      navTrek: "旅と体験",
      navTrekTitle: "屋久島の旅と体験",
      navIntro: "紹介",
      navIntroTitle: "サイト紹介",
    },
    zh: {
      navMore: "更多", navAbout: "关于本站", navAboutTitle: "关于本站",
      navAria: "主菜单",
      navTravelGuides: "旅行攻略",
      navTravelGuidesTitle: "旅行攻略",
      navGuide: "地图",
      navGuideTitle: "便利设施地图",
      navTime: "时刻表",
      navTimeTitle: "公交时刻表",
      navMap: "票价",
      navMapTitle: "公交票价查询",
      navAccess: "船运",
      navAccessTitle: "船运·上岛",
      navTrek: "旅行体验",
      navTrekTitle: "屋久岛旅行与体验",
      navIntro: "介绍",
      navIntroTitle: "网站介绍",
    },
    en: {
      navMore: "More", navAbout: "About", navAboutTitle: "About this site",
      navAria: "Main menu",
      navTravelGuides: "Guides",
      navTravelGuidesTitle: "Guides",
      navGuide: "Map",
      navGuideTitle: "Island POI map",
      navTime: "Times",
      navTimeTitle: "Bus timetable",
      navMap: "Fares",
      navMapTitle: "Fare calculator",
      navAccess: "Ferry",
      navAccessTitle: "Ferry & access",
      navTrek: "Explore",
      navTrekTitle: "Yakushima travel & experiences",
      navIntro: "Intro",
      navIntroTitle: "About this site",
    },
  };

  function getLang() {
    if (window.SiteLang) return window.SiteLang.current;
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ja" || q === "zh" || q === "en") return q;
    const stored = localStorage.getItem(LANG_KEY);
    if (stored === "ja" || stored === "zh" || stored === "en") return stored;
    return "ja";
  }

  function t(lang, key) {
    return (NAV_UI[lang] && NAV_UI[lang][key]) || NAV_UI.ja[key] || key;
  }

  function langQs(lang, href) {
    const sep = href.includes("?") ? "&" : "?";
    const withLang = `${href}${sep}lang=${lang}`;
    return typeof window.appendBusGaQs === "function" ? window.appendBusGaQs(withLang) : withLang;
  }

  function syncPageTitle(lang) {
    const path = location.pathname;
    const titleEl = document.getElementById("appTitle");
    if (!titleEl) return;
    if (/^\/$/i.test(path)) {
      titleEl.textContent = t(lang, "navTimeTitle");
    } else if (/^\/fare\/?$/i.test(path)) {
      titleEl.textContent = t(lang, "navMapTitle");
    } else if (/^\/map\/?$/i.test(path)) {
      titleEl.textContent = t(lang, "navGuideTitle");
    } else if (/^\/ferry\/?$/i.test(path)) {
      titleEl.textContent = t(lang, "navAccessTitle");
    } else if (/^\/trekking\/?$/i.test(path)) {
      titleEl.textContent = t(lang, "navTrekTitle");
    } else if (/^\/intro\/?$/i.test(path)) {
      titleEl.textContent = t(lang, "navIntroTitle");
    }
  }

  function navLink(item, L, placement) {
    const on = item.active.test(location.pathname);
    const title = t(L, `${item.key}Title`).replace(/"/g, "&quot;");
    return `<a href="${langQs(L, item.href)}" data-nav-placement="${placement}"${on ? ' class="active" aria-current="page"' : ''} title="${title}">${t(L, item.key)}</a>`;
  }

  function setMoreOpen(open, returnFocus = false) {
    const button = document.getElementById("siteNavMore");
    const panel = document.getElementById("siteNavMorePanel");
    if (!button || !panel) return;
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    if (returnFocus) button.focus();
  }

  function renderMainNav(forcedLang) {
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    const L = forcedLang || getLang();
    if (!forcedLang && nav.dataset.chromeNav === L) return;
    const open = nav.querySelector("#siteNavMore")?.getAttribute("aria-expanded") === "true";
    const secondary = [...TRAVEL_NAV, ...INFO_NAV];
    const current = secondary.find(item => item.active.test(location.pathname));
    const moreLabel = t(L, "navMore");
    const moreAria = current ? `${moreLabel} · ${t(L, current.key)}` : moreLabel;
    nav.className = "nav nav-main nav-main--compact";
    nav.setAttribute("aria-label", t(L, "navAria"));
    nav.innerHTML = PRIMARY_NAV.map(item => navLink(item, L, "primary")).join("") +
      `<button type="button" id="siteNavMore" class="site-nav-more${current ? ' has-current' : ''}" aria-label="${moreAria}" aria-expanded="${open}" aria-controls="siteNavMorePanel"><span>${moreLabel}</span><span class="site-nav-chevron" aria-hidden="true"></span></button>` +
      `<div id="siteNavMorePanel" class="site-nav-panel"${open ? '' : ' hidden'}><div class="site-nav-travel">${TRAVEL_NAV.map(item => navLink(item, L, "more")).join("")}</div><div class="site-nav-info">${INFO_NAV.map(item => navLink(item, L, "more")).join("")}</div></div>`;
    nav.dataset.chromeNav = L;
    syncPageTitle(L);
  }

  // Ordinary disclosure navigation: links keep normal Tab behaviour, without menu roles.
  document.addEventListener("click", event => {
    const button = event.target.closest("#siteNavMore");
    if (button) {
      const open = button.getAttribute("aria-expanded") !== "true";
      setMoreOpen(open);
      if (open) window.BusAnalytics?.event("nav_more_open", { lang: getLang(), page_path: location.pathname });
      return;
    }
    if (!event.target.closest("#mainNav") || event.target.closest("#siteNavMorePanel a")) setMoreOpen(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && document.getElementById("siteNavMore")?.getAttribute("aria-expanded") === "true") {
      event.preventDefault();
      setMoreOpen(false, true);
    }
  });
  document.addEventListener("focusin", event => {
    if (!event.target.closest("#mainNav")) setMoreOpen(false);
  });

  const bootLang = getLang();
  document.documentElement.lang = bootLang === "zh" ? "zh-CN" : bootLang;
  renderMainNav(bootLang);
  window.__renderSiteChromeNav = renderMainNav;
  window.__syncPageTitle = syncPageTitle;

  function syncLangSwitchUi(forcedLang) {
    const L = forcedLang || getLang();
    document.querySelectorAll("#langSwitch [data-lang]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === L);
    });
  }

  function onDomReady() {
    const L = getLang();
    syncPageTitle(L);
    syncLangSwitchUi(L);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onDomReady);
  } else {
    onDomReady();
  }
})();
