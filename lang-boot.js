/** 全站语言：手动选择后 localStorage 优先；中文搜索来源/爬虫优先 zh；否则 URL > storage > 浏览器 > ja */
(function () {
  const LANG_KEY = "yakushima-bus-lang";
  const PICKED_KEY = "yakushima-bus-lang-picked";
  const SUPPORTED = ["ja", "zh", "en"];

  const CN_BOT = /Baiduspider|Sogou|360Spider|YisouSpider|Bytespider/i;
  const CN_REF = /(^|\.)baidu\.com|sogou\.com|sm\.cn|so\.com|quark\.sm\.cn/i;

  function detectBrowserLang() {
    const list = navigator.languages?.length ? navigator.languages : [navigator.language || ""];
    for (const raw of list) {
      const tag = String(raw).toLowerCase();
      if (tag.startsWith("ja")) return "ja";
      if (tag.startsWith("zh")) return "zh";
      if (tag.startsWith("en")) return "en";
    }
    return "ja";
  }

  function isUserPicked() {
    return localStorage.getItem(PICKED_KEY) === "1";
  }

  function markUserPicked() {
    localStorage.setItem(PICKED_KEY, "1");
  }

  function isChineseSearchContext() {
    try {
      if (CN_BOT.test(navigator.userAgent || "")) return true;
      const ref = document.referrer || "";
      if (ref && CN_REF.test(ref)) return true;
    } catch (_) { /* ignore */ }
    return false;
  }

  function resolveLang() {
    const q = new URLSearchParams(location.search).get("lang");
    const stored = localStorage.getItem(LANG_KEY);
    if (isUserPicked() && SUPPORTED.includes(stored)) return stored;
    if (SUPPORTED.includes(q)) return q;
    if (!isUserPicked() && isChineseSearchContext()) return "zh";
    if (SUPPORTED.includes(stored)) return stored;
    return detectBrowserLang();
  }

  function syncLangUrl(lang) {
    try {
      if (location.protocol !== "http:" && location.protocol !== "https:") return;
      const url = new URL(location.href);
      if (url.searchParams.get("lang") === lang) return;
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    } catch (_) { /* ignore */ }
  }

  function bootstrapLang() {
    const q = new URLSearchParams(location.search).get("lang");
    const stored = localStorage.getItem(LANG_KEY);
    let lang;

    if (isUserPicked() && SUPPORTED.includes(stored)) {
      lang = stored;
      if (q !== lang) syncLangUrl(lang);
    } else if (SUPPORTED.includes(q)) {
      lang = q;
      localStorage.setItem(LANG_KEY, lang);
    } else if (isChineseSearchContext()) {
      lang = "zh";
      localStorage.setItem(LANG_KEY, lang);
      syncLangUrl(lang);
    } else if (SUPPORTED.includes(stored)) {
      lang = stored;
      syncLangUrl(lang);
    } else {
      lang = detectBrowserLang();
      localStorage.setItem(LANG_KEY, lang);
      syncLangUrl(lang);
    }
    return lang;
  }

  let current = bootstrapLang();
  document.documentElement.lang = current === "zh" ? "zh-CN" : current;

  window.SiteLang = {
    LANG_KEY,
    PICKED_KEY,
    SUPPORTED,
    detectBrowserLang,
    isChineseSearchContext,
    resolveLang,
    bootstrapLang,
    syncLangUrl,
    isUserPicked,
    markUserPicked,
    get current() {
      return current;
    },
    set current(v) {
      if (SUPPORTED.includes(v)) current = v;
    },
  };
})();
