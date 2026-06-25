/** 全站页脚精简 + 「是否有帮助」星级反馈 */
(function () {
  const LANG_KEY = "yakushima-bus-lang";
  const STORE_KEY = "yakushima-bus-feedback-v1";
  const SKIP_FEEDBACK = /^\/(intro|about)\/?$/i.test(location.pathname);

  const MAIN_NAV = [
    { href: "/guide/", key: "navGuide", active: /^\/guide\/?$/i },
    { href: "/", key: "navTime", active: /^\/$/ },
    { href: "/map/", key: "navMap", active: /^\/map\/?$/i },
    { href: "/access/", key: "navAccess", active: /^\/access\/?$/i },
    { href: "/trekking/", key: "navTrek", active: /^\/trekking\/?$/i },
    { href: "/intro/", key: "navIntro", active: /^\/intro\/?$/i },
  ];

  const PAGE_HEAD = {
    guide: {
      titleKey: "navGuideTitle",
      lead: {
        ja: "史跡・温泉・スーパー等と、確認済みバス停。ナビ・時刻表リンク付き。",
        zh: "名胜古迹、温泉、超市等地点；地图标注已核实公交站，可导航并查时刻表。",
        en: "Historic sites, hot springs, shops, and verified bus stops. Navigate or check timetables.",
      },
      crossHtml: {
        ja: '<a href="/?lang=ja">時刻表</a> · <a href="/map/?lang=ja">運賃計算</a>',
        zh: '<a href="/?lang=zh">查班次</a> · <a href="/map/?lang=zh">算运价</a>',
        en: '<a href="/?lang=en">Timetable</a> · <a href="/map/?lang=en">Fares</a>',
      },
    },
    time: {
      titleKey: "navTimeTitle",
      lead: {
        ja: "屋久島交通の公式バス時刻（2026年3月改定）。次の便を検索。",
        zh: "屋久岛公交官方时刻表（2026年3月改订），查下一班车。",
        en: "Official Yakushima bus timetables (Mar 2026). Find your next departure.",
      },
      crossHtml: {
        ja: '<a href="/map/?lang=ja">運賃計算</a> · <a href="/guide/?lang=ja">スポット地図</a> · <a href="/access/?lang=ja">フェリー</a> · <a href="/without-car/?lang=ja">レンタカーなし</a>',
        zh: '<a href="/map/?lang=zh">算运价</a> · <a href="/guide/?lang=zh">便利设施地图</a> · <a href="/access/?lang=zh">船运上岛</a> · <a href="/without-car/?lang=zh">不租车攻略</a>',
        en: '<a href="/map/?lang=en">Fares</a> · <a href="/guide/?lang=en">POI map</a> · <a href="/access/?lang=en">Ferry</a> · <a href="/without-car/?lang=en">Without a car</a>',
      },
    },
    map: {
      titleKey: "navMapTitle",
      lead: {
        ja: "公式路線図と区間運賃（2026年3月改定）。停留所タップで時刻表へ。",
        zh: "屋久岛巴士官方路线图与区间票价（2026年3月改订），选站点可查时刻表、算成人单程票价。",
        en: "Official route map and section fares (Mar 2026). Tap a stop for timetables.",
      },
      crossHtml: {
        ja: '<a href="/?lang=ja">時刻表</a> · <a href="/guide/?lang=ja">スポット地図</a> · <a href="/without-car/?lang=ja">レンタカーなし</a>',
        zh: '<a href="/?lang=zh">查班次</a> · <a href="/guide/?lang=zh">便利设施地图</a> · <a href="/without-car/?lang=zh">不租车攻略</a>',
        en: '<a href="/?lang=en">Timetable</a> · <a href="/guide/?lang=en">POI map</a> · <a href="/without-car/?lang=en">Without a car</a>',
      },
    },
    access: {
      titleKey: "navAccessTitle",
      lead: {
        ja: "鹿児島・指宿からの高速船・フェリー時刻と運賃。上島後のバス接続は時刻表へ。",
        zh: "鹿儿岛·指宿出发的高速船与渡轮时刻、票价；上岛后查公交时刻表。",
        en: "Jetfoil and ferry times and fares from Kagoshima and Ibusuki. Bus connections after you land.",
      },
      crossHtml: {
        ja: '<a href="/?lang=ja">上島後は時刻表で接続便を検索</a>',
        zh: '<a href="/?lang=zh">上岛后查公交时刻表</a>',
        en: '<a href="/?lang=en">Bus timetable after you land</a>',
      },
    },
    trek: {
      titleKey: "navTrekTitle",
      lead: {
        ja: "縄文杉・太鼓岩・宮之浦岳などコース参考。バスは時刻表で確認。",
        zh: "绳文杉、太鼓岩、宫之浦岳等徒步路线参考；班次请查时刻表。",
        en: "Reference for Jomon Sugi, Taikoiwa, Miyanoura-dake and more. Check bus times separately.",
      },
      crossHtml: {
        ja: '<a href="/?from=yakusugi_museum&lang=ja">自然館→荒川登山口のバス便</a>',
        zh: '<a href="/?from=yakusugi_museum&lang=zh">自然馆→荒川登山口班次</a>',
        en: '<a href="/?from=yakusugi_museum&lang=en">Museum → Arakawa trailhead buses</a>',
      },
    },
    intro: {
      titleKey: "navIntroTitle",
      lead: {
        ja: "屋久島バス時刻表・運賃・フェリー・観光マップを三語で。公式 PDF をもとに港やバス停でサッと調べられる独立ツール。",
        zh: "屋久岛公交时刻表、运价、船运与观光地图三语网站；基于官方 PDF，适合港口与公交站路边查询。",
        en: "Trilingual bus timetables, fares, ferry access, and POI map — built from official PDFs for travelers on the island.",
      },
      crossHtml: {
        ja: '<a href="/?lang=ja">時刻表</a> · <a href="/map/?lang=ja">運賃</a> · <a href="/guide/?lang=ja">スポット地図</a> · <a href="/access/?lang=ja">フェリー</a> · <a href="/without-car/?lang=ja">レンタカーなし</a>',
        zh: '<a href="/?lang=zh">时刻表</a> · <a href="/map/?lang=zh">运价</a> · <a href="/guide/?lang=zh">便利设施地图</a> · <a href="/access/?lang=zh">船运上岛</a> · <a href="/without-car/?lang=zh">不租车攻略</a>',
        en: '<a href="/?lang=en">Timetable</a> · <a href="/map/?lang=en">Fares</a> · <a href="/guide/?lang=en">POI map</a> · <a href="/access/?lang=en">Ferry</a> · <a href="/without-car/?lang=en">Without a car</a>',
      },
    },
  };

  const UI = {
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
      navAbout: "このサイトについて",
      supportKofi: "コーヒーをおごる",
      feedbackQ: "このサイトの情報は役に立ちましたか？",
      starLabel: "{n} / 5",
      starsAria: "満足度（1〜5）",
      lowHint:
        'ご意見をお聞かせください。より多くの旅行者の助けになります。ほかのご連絡は<a href="/about/?lang=ja">このサイトについて</a>から。',
      lowPlaceholder: "足りなかった点や欲しい情報（任意）",
      lowSubmit: "送信",
      thanks: "ありがとうございます！",
      thanksHigh: "うれしいです。ありがとうございます！",
    },
    zh: {
      navAria: "主菜单",
      navGuide: "地图",
      navGuideTitle: "便利设施地图",
      navTime: "时刻表",
      navTimeTitle: "公交时刻表",
      navMap: "运价",
      navMapTitle: "公交票价查询",
      navAccess: "船运",
      navAccessTitle: "船运·上岛",
      navTrek: "登山",
      navTrekTitle: "登山路线",
      navIntro: "介绍",
      navIntroTitle: "网站介绍",
      navAbout: "关于本站",
      supportKofi: "支持本站",
      feedbackQ: "本站信息对你有帮助吗？",
      starLabel: "{n} 星",
      starsAria: "满意度（1–5 星）",
      lowHint:
        '希望听到你的建议，帮助到更多人。也可通过<a href="/about/?lang=zh">关于本站</a>联系我。',
      lowPlaceholder: "缺少什么信息、哪里不好用（选填）",
      lowSubmit: "提交反馈",
      thanks: "感谢你的反馈！",
      thanksHigh: "很高兴能帮到你，谢谢！",
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
      navAbout: "About",
      supportKofi: "Buy me a coffee",
      feedbackQ: "Was this site helpful for your trip?",
      starLabel: "{n} of 5",
      starsAria: "Rating 1 to 5",
      lowHint:
        'We’d love your suggestions to help more travelers. You can also reach us via <a href="/about/?lang=en">About</a>.',
      lowPlaceholder: "What was missing or confusing? (optional)",
      lowSubmit: "Send feedback",
      thanks: "Thanks for your feedback!",
      thanksHigh: "Glad it helped — thank you!",
    },
  };

  let lang = localStorage.getItem(LANG_KEY) || "ja";
  let feedbackEl;

  function t(key) {
    return (UI[lang] && UI[lang][key]) || UI.ja[key] || key;
  }

  function langQs(href) {
    const sep = href.includes("?") ? "&" : "?";
    return `${href}${sep}lang=${lang}`;
  }

  function readStore() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    } catch {
      return null;
    }
  }

  function writeStore(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  }

  function track(name, params) {
    if (window.BusAnalytics && typeof window.BusAnalytics.event === "function") {
      window.BusAnalytics.event(name, params);
    }
  }

  function renderMainNav() {
    if (typeof window.__renderSiteChromeNav === "function") {
      window.__renderSiteChromeNav(lang);
      return;
    }
    const nav = document.getElementById("mainNav");
    if (!nav) return;
    nav.className = "nav nav-main nav-main--6";
    nav.setAttribute("aria-label", t("navAria"));
    const path = location.pathname;
    nav.innerHTML = MAIN_NAV.map((item) => {
      const on = item.active.test(path);
      const cls = on ? ' class="active"' : "";
      const aria = on ? ' aria-current="page"' : "";
      const titleKey = `${item.key}Title`;
      const title = t(titleKey) !== titleKey ? ` title="${t(titleKey).replace(/"/g, "&quot;")}"` : "";
      return `<a href="${langQs(item.href)}"${cls}${aria}${title}>${t(item.key)}</a>`;
    }).join("");
  }

  function renderFooter() {
    const footer = document.querySelector(".app-footer");
    if (!footer) return;
    footer.querySelector("#footerMetaLinks")?.remove();
    footer.querySelector(".app-footer-support")?.remove();
    let nav = footer.querySelector(".app-footer-links");
    if (!nav) {
      nav = document.createElement("nav");
      nav.className = "app-footer-links";
      nav.setAttribute("aria-label", "Site pages");
      footer.appendChild(nav);
    }
    nav.innerHTML = `<a href="${langQs("/")}">${t("navTime")}</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="${langQs("/map/")}">${t("navMap")}</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="${langQs("/guide/")}">${t("navGuide")}</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="${langQs("/access/")}">${t("navAccess")}</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="${langQs("/about/")}">${t("navAbout")}</a>
      <span class="footer-sep" aria-hidden="true">·</span>
      <a href="https://ko-fi.com/yimleung" target="_blank" rel="noopener noreferrer">${t("supportKofi")}</a>`;
  }

  function mountFeedback(footer) {
    if (!feedbackEl) {
      feedbackEl = document.createElement("section");
      feedbackEl.className = "site-feedback";
      feedbackEl.id = "siteFeedback";
      const nav = footer.querySelector(".app-footer-links");
      footer.insertBefore(feedbackEl, nav || null);
    }
    return feedbackEl;
  }

  function isFeedbackDone(stored) {
    return Boolean(stored?.submitted || (stored?.rating && stored.rating >= 3));
  }

  function dismissFeedback() {
    if (!feedbackEl) return;
    feedbackEl.remove();
    feedbackEl = null;
  }

  function bindFeedback() {
    if (!feedbackEl || feedbackEl.dataset.bound === "1") return;
    feedbackEl.dataset.bound = "1";

    const starsWrap = feedbackEl.querySelector(".site-feedback-stars");
    const lowWrap = feedbackEl.querySelector(".site-feedback-low");
    const textarea = feedbackEl.querySelector(".site-feedback-text");
    const submitBtn = feedbackEl.querySelector(".site-feedback-submit");

    starsWrap?.querySelectorAll("[data-rating]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rating = Number(btn.dataset.rating);
        if (!rating) return;
        starsWrap.querySelectorAll("[data-rating]").forEach((b) => {
          b.classList.toggle("is-on", Number(b.dataset.rating) <= rating);
          b.setAttribute("aria-pressed", Number(b.dataset.rating) <= rating ? "true" : "false");
        });
        track("site_feedback", { rating, page_path: location.pathname });
        if (rating <= 2) {
          lowWrap?.removeAttribute("hidden");
          textarea?.focus();
          writeStore({ rating, ts: Date.now(), page: location.pathname });
          return;
        }
        writeStore({ rating, submitted: true, ts: Date.now(), page: location.pathname });
        dismissFeedback();
      });
    });

    submitBtn?.addEventListener("click", () => {
      const stored = readStore() || {};
      const rating = stored.rating || 1;
      const text = (textarea?.value || "").trim();
      writeStore({ ...stored, rating, text, submitted: true, ts: Date.now() });
      track("site_feedback_comment", {
        rating,
        comment_length: text.length,
        page_path: location.pathname,
      });
      if (text) {
        const subject = encodeURIComponent(`Yakushima Bus feedback (${rating}/5)`);
        const body = encodeURIComponent(
          `Page: ${location.href}\nRating: ${rating}/5\n\n${text}`
        );
        window.location.href = `mailto:yimleung.ly@gmail.com?subject=${subject}&body=${body}`;
      }
      dismissFeedback();
    });
  }

  function renderFeedback() {
    if (SKIP_FEEDBACK) return;
    const footer = document.querySelector(".app-footer");
    if (!footer) return;

    const stored = readStore();
    if (isFeedbackDone(stored)) {
      dismissFeedback();
      return;
    }

    const el = mountFeedback(footer);
    el.className = "site-feedback";

    const stars = [1, 2, 3, 4, 5]
      .map(
        (n) =>
          `<button type="button" class="site-feedback-star" data-rating="${n}" aria-label="${t("starLabel").replace("{n}", String(n))}" aria-pressed="false">★</button>`
      )
      .join("");

    feedbackEl.innerHTML = `
      <p class="site-feedback-q">${t("feedbackQ")}</p>
      <div class="site-feedback-stars" role="group" aria-label="${t("starsAria")}">${stars}</div>
      <div class="site-feedback-low" hidden>
        <textarea class="site-feedback-text" rows="3" maxlength="800" placeholder="${t("lowPlaceholder")}"></textarea>
        <p class="site-feedback-hint">${t("lowHint")}</p>
        <button type="button" class="site-feedback-submit">${t("lowSubmit")}</button>
      </div>
      <p class="site-feedback-thanks" hidden></p>`;

    bindFeedback();
  }

  function readLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ja" || q === "zh" || q === "en") return q;
    return localStorage.getItem(LANG_KEY) || lang || "ja";
  }

  function tr(key, L) {
    const code = L || readLang();
    return (UI[code] && UI[code][key]) || UI.ja[key] || key;
  }

  function getLang() {
    return readLang();
  }

  function applyPageHead(pageId, { titleEl, leadEl, crossEl, lang: pageLang } = {}) {
    const L = pageLang || readLang();
    lang = L;
    const head = PAGE_HEAD[pageId];
    if (!head) return;
    if (titleEl) titleEl.textContent = tr(head.titleKey, L);
    if (leadEl && head.lead) {
      leadEl.innerHTML = head.lead[L] || head.lead.ja;
    }
    if (crossEl && head.crossHtml) {
      const html = head.crossHtml[L] || head.crossHtml.ja;
      crossEl.innerHTML = `<span class="meta-links">${html}</span>`;
    }
  }

  function refresh() {
    lang = localStorage.getItem(LANG_KEY) || "ja";
    renderMainNav();
    renderFooter();
    const stored = readStore();
    if (feedbackEl && isFeedbackDone(stored)) {
      dismissFeedback();
      return;
    }
    if (feedbackEl) {
      feedbackEl.dataset.bound = "";
      feedbackEl.remove();
      feedbackEl = null;
    }
    renderFeedback();
  }

  function init() {
    lang = readLang();
    renderMainNav();
    renderFooter();
    renderFeedback();
    document.addEventListener("yakushima-bus-lang", (e) => {
      if (e.detail && e.detail.lang) lang = e.detail.lang;
      refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SiteChrome = { refresh, t, getLang, readLang, langQs, applyPageHead, PAGE_HEAD };
})();
