/** 同步渲染主导航，避免 defer 的 site-chrome.js 替换文案时闪烁 */
(function () {
  const LANG_KEY = "yakushima-bus-lang";

  const MAIN_NAV = [
    { href: "/map/", key: "navGuide", active: /^\/map\/?$/i },
    { href: "/", key: "navTime", active: /^\/$/ },
    { href: "/fare/", key: "navMap", active: /^\/fare\/?$/i },
    { href: "/ferry/", key: "navAccess", active: /^\/ferry\/?$/i },
    { href: "/trekking/", key: "navTrek", active: /^\/trekking\/?$/i },
    { href: "/intro/", key: "navIntro", active: /^\/intro\/?$/i },
  ];

  const NAV_UI = {
    ja: {
      navAria: "メインメニュー",
      navGuide: "マップ",
      navGuideTitle: "スポット地図",
      navTime: "時刻表",
      navTimeTitle: "バス時刻表",
      navMap: "運賃",
      navMapTitle: "運賃計算",
      navAccess: "フェリー",
      navAccessTitle: "フェリー・上島",
      navTrek: "登山",
      navTrekTitle: "登山ルート",
      navIntro: "紹介",
      navIntroTitle: "サイト紹介",
    },
    zh: {
      navAria: "主菜单",
      navGuide: "地图",
      navGuideTitle: "便利设施地图",
      navTime: "时刻表",
      navTimeTitle: "公交时刻表",
      navMap: "票价",
      navMapTitle: "公交票价查询",
      navAccess: "船运",
      navAccessTitle: "船运·上岛",
      navTrek: "登山",
      navTrekTitle: "登山路线",
      navIntro: "介绍",
      navIntroTitle: "网站介绍",
    },
    en: {
      navAria: "Main menu",
      navGuide: "Map",
      navGuideTitle: "Island POI map",
      navTime: "Times",
      navTimeTitle: "Bus timetable",
      navMap: "Fares",
      navMapTitle: "Fare calculator",
      navAccess: "Ferry",
      navAccessTitle: "Ferry & access",
      navTrek: "Trails",
      navTrekTitle: "Hiking routes",
      navIntro: "Intro",
      navIntroTitle: "About this site",
    },
  };

  function getLang() {
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

  function renderMainNav(forcedLang) {
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    const L = forcedLang || getLang();
    if (!forcedLang && nav.dataset.chromeNav === L) return;

    nav.className = "nav nav-main nav-main--6";
    nav.setAttribute("aria-label", t(L, "navAria"));
    const path = location.pathname;
    nav.innerHTML = MAIN_NAV.map((item) => {
      const on = item.active.test(path);
      const cls = on ? ' class="active"' : "";
      const aria = on ? ' aria-current="page"' : "";
      const titleKey = `${item.key}Title`;
      const titleVal = t(L, titleKey);
      const title = titleVal !== titleKey ? ` title="${titleVal.replace(/"/g, "&quot;")}"` : "";
      return `<a href="${langQs(L, item.href)}"${cls}${aria}${title}>${t(L, item.key)}</a>`;
    }).join("");
    nav.dataset.chromeNav = L;
    syncPageTitle(L);
  }

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
