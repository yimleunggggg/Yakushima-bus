/** 全站页脚精简 + 「是否有帮助」星级反馈 */
(function () {
  const LANG_KEY = "yakushima-bus-lang";
  const STORE_KEY = "yakushima-bus-feedback-v1";
  const SKIP_FEEDBACK = /^\/(intro|about|privacy|newsletter)\/?$/i.test(location.pathname);

  const MAIN_NAV = [
    { href: "/map/", key: "navGuide", active: /^\/map\/?$/i },
    { href: "/", key: "navTime", active: /^\/$/ },
    { href: "/fare/", key: "navMap", active: /^\/fare\/?$/i },
    { href: "/ferry/", key: "navAccess", active: /^\/ferry\/?$/i },
    { href: "/trekking/", key: "navTrek", active: /^\/trekking\/?$/i },
    { href: "/guides/", key: "navTravelGuides", active: /^\/(?:guides(?:\/|$)|without-car\/?$)/i },
  ];

  const PAGE_HEAD = {
    map: {
      titleKey: "navGuideTitle",
      lead: {
        ja: "史跡・温泉・スーパー等と、確認済みバス停。ナビ・時刻表リンク付き。",
        zh: "名胜古迹、温泉、超市等地点；地图标注已核实公交站，可导航并查时刻表。",
        en: "Historic sites, hot springs, shops, and verified bus stops. Navigate or check timetables.",
      },
      crossHtml: {
        ja: '<a href="/">時刻表</a> · <a href="/fare/?lang=ja">運賃計算</a>',
        zh: '<a href="/?lang=zh">查班次</a> · <a href="/fare/?lang=zh">查票价</a>',
        en: '<a href="/?lang=en">Timetable</a> · <a href="/fare/?lang=en">Fares</a>',
      },
    },
    time: {
      titleKey: "navTimeTitle",
      lead: {
        ja: "公式PDFに基づく屋久島バスの計画時刻。運行状況と次の便を確認。",
        zh: "依据官方PDF整理屋久岛公交计划时刻，结合运营公告查下一班车。",
        en: "Yakushima bus schedules from official PDFs. Find your next departure.",
      },
      crossHtml: {
        ja: '<a href="/fare/?lang=ja">運賃計算</a> · <a href="/map/?lang=ja">スポット地図</a> · <a href="/ferry/?lang=ja">フェリー</a> · <a href="/without-car/?lang=ja">島内の移動</a>',
        zh: '<a href="/fare/?lang=zh">查票价</a> · <a href="/map/?lang=zh">便利设施地图</a> · <a href="/ferry/?lang=zh">船运上岛</a> · <a href="/without-car/?lang=zh">岛内出行</a>',
        en: '<a href="/fare/?lang=en">Fares</a> · <a href="/map/?lang=en">POI map</a> · <a href="/ferry/?lang=en">Ferry</a> · <a href="/without-car/?lang=en">Getting around</a>',
      },
    },
    fare: {
      titleKey: "navMapTitle",
      lead: {
        ja: "公式路線図と区間運賃の目安。運賃表の改定日は出典参照。停留所タップで時刻表へ。",
        zh: "屋久岛公交官方路线图与区间票价参考；运价表改订日期见来源。",
        en: "Official route map and section fare estimates. Tap a stop for timetables.",
      },
      crossHtml: {
        ja: '<a href="/">時刻表</a> · <a href="/map/?lang=ja">スポット地図</a> · <a href="/without-car/?lang=ja">島内の移動</a>',
        zh: '<a href="/?lang=zh">查班次</a> · <a href="/map/?lang=zh">便利设施地图</a> · <a href="/without-car/?lang=zh">岛内出行</a>',
        en: '<a href="/?lang=en">Timetable</a> · <a href="/map/?lang=en">POI map</a> · <a href="/without-car/?lang=en">Getting around</a>',
      },
    },
    ferry: {
      titleKey: "navAccessTitle",
      lead: {
        ja: "鹿児島↔屋久島の船券をオンライン予約。トッピー・ロケットの公式時刻・運賃資料と、到着後のバス接続を確認。",
        zh: "鹿儿岛↔屋久岛船票在线预订，查看优惠、官方时刻与票价资料；抵达宫之浦或安房后可查公交接驳。",
        en: "Book Kagoshima ↔ Yakushima tickets online. Compare offers, official timetable and fare references, and buses from Miyanoura or Anbo.",
      },
      crossHtml: {
        ja: '<a href="/">上島後は時刻表で接続便を検索</a>',
        zh: '<a href="/?lang=zh">上岛后查公交时刻表</a>',
        en: '<a href="/?lang=en">Bus timetable after you land</a>',
      },
    },
    trek: {
      titleKey: "navTrekTitle",
      lead: {
        ja: "島内周遊、ガイド付き登山、温泉の宿。鹿児島での寄り道も一緒に。",
        zh: "环岛观光、向导徒步、温泉住宿，也可以在鹿儿岛多留半天。",
        en: "Island tours, guided hikes and hot-spring stays, with time for Kagoshima along the way.",
      },
      crossHtml: {
        ja: '',
        zh: '',
        en: '',
      },
    },
    intro: {
      titleKey: "navIntroTitle",
      lead: {
        ja: "屋久島バス時刻表・運賃・フェリー・観光マップを三語で。公式情報をもとにした独立ツール。",
        zh: "屋久岛公交时刻表、票价、船运与观光地图三语网站；基于官方信息整理。",
        en: "Trilingual bus timetables, fares, ferry access, and POI map — built from official sources.",
      },
      crossHtml: {
        ja: '<a href="/">時刻表</a> · <a href="/fare/?lang=ja">運賃</a> · <a href="/map/?lang=ja">スポット地図</a> · <a href="/ferry/?lang=ja">フェリー</a> · <a href="/without-car/?lang=ja">島内の移動</a>',
        zh: '<a href="/?lang=zh">时刻表</a> · <a href="/fare/?lang=zh">票价</a> · <a href="/map/?lang=zh">便利设施地图</a> · <a href="/ferry/?lang=zh">船运上岛</a> · <a href="/without-car/?lang=zh">岛内出行</a>',
        en: '<a href="/?lang=en">Timetable</a> · <a href="/fare/?lang=en">Fares</a> · <a href="/map/?lang=en">POI map</a> · <a href="/ferry/?lang=en">Ferry</a> · <a href="/without-car/?lang=en">Getting around</a>',
      },
    },
  };

  const UI = {
    ja: {
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
      navTrek: "ツアー・体験",
      navTrekTitle: "屋久島の旅と体験",
      navIntro: "紹介",
      navIntroTitle: "サイト紹介",
      navAbout: "このサイトについて",
      footerNavAria: "サイト内リンク",
      supportKofi: "コーヒーをおごる",
      supportTitle: "この情報をまた使えるように",
      supportBody: "バス・船・登山口の情報を個人で確認・更新しています。役に立ったら継続の応援をお願いします。",
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
      navTrek: "行程与体验",
      navTrekTitle: "屋久岛旅行与体验",
      navIntro: "介绍",
      navIntroTitle: "网站介绍",
      navAbout: "关于本站",
      footerNavAria: "站内导航",
      supportKofi: "支持本站",
      supportTitle: "让这些信息持续可用",
      supportBody: "公交、船班和登山口信息由个人持续核查与更新。如果帮到了你，欢迎请我喝杯咖啡。",
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
      navTrek: "Tours & Activities",
      navTrekTitle: "Yakushima travel & experiences",
      navIntro: "Intro",
      navIntroTitle: "About this site",
      navAbout: "About",
      footerNavAria: "Site links",
      supportKofi: "Buy me a coffee",
      supportTitle: "Help keep this guide current",
      supportBody: "I independently check and update bus, ferry and trail access information. If this helped, you can support the upkeep.",
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
    const withLang = href === "/" && lang === "ja" ? href : `${href}${sep}lang=${lang}`;
    return typeof window.appendBusGaQs === "function" ? window.appendBusGaQs(withLang) : withLang;
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

  function renderMainNav(forcedLang) {
    const L = forcedLang || readLang();
    lang = L;
    if (typeof window.__renderSiteChromeNav === "function") {
      window.__renderSiteChromeNav(L);
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

  const FOOTER = {
    zh: { brand: '屋久岛的独立交通与旅行工具。', explore: '探索屋久岛', trust: '关于与来源', touch: '保持联系', times: '公交时刻表', fares: '票价与乘车券', map: '岛内地图', ferry: '船票与上岛交通', guides: '旅行攻略', activities: '徒步与体验', about: '关于 YakuBus', sources: '来源与信息核查', contact: '联系运营者', privacy: '隐私政策', affiliate: '分销关系说明', newsletter: '订阅旅行邮件', notes: '不定期的屋久岛旅行来信，目前以英文发送。', support: '支持本站的日常维护 ↗', independent: '独立运营，非当地交通运营商官方网站。出行前请以官方公告为准。' },
    en: { brand: 'Independent transport and travel tools for Yakushima.', explore: 'Explore', trust: 'About & trust', touch: 'Stay in touch', times: 'Bus timetables', fares: 'Fares & passes', map: 'Island map', ferry: 'Ferries & access', guides: 'Travel guides', activities: 'Hikes & experiences', about: 'About YakuBus', sources: 'Sources & updates', contact: 'Contact', privacy: 'Privacy policy', affiliate: 'Affiliate disclosure', newsletter: 'Get travel emails', notes: 'Occasional Yakushima travel notes. Currently sent in English.', support: 'Support the upkeep ↗', independent: 'Independently run. Not affiliated with local transport operators. Check official notices before you travel.' },
    ja: { brand: '屋久島の交通と旅を調べる、独立したツール。', explore: '屋久島を探す', trust: 'サイトと出典', touch: 'つながる', times: 'バス時刻表', fares: '運賃・乗車券', map: '島内マップ', ferry: 'フェリー・アクセス', guides: '旅行ガイド', activities: '登山・体験', about: 'YakuBusについて', sources: '出典・情報の確認', contact: 'お問い合わせ', privacy: 'プライバシーポリシー', affiliate: 'アフィリエイトについて', newsletter: 'メールを購読する', notes: '屋久島の旅の情報を不定期に。現在、配信は英語です。', support: 'サイトの維持を応援する ↗', independent: '個人運営の非公式サイトです。交通事業者とは関係ありません。出発前に公式情報をご確認ください。' },
  };

  function renderFooter() {
    const footer = document.querySelector('.app-footer');
    if (!footer) return;
    footer.id = 'site-footer';
    lang = readLang();
    const copy = FOOTER[lang] || FOOTER.en;
    const page = location.pathname.split('/')[1] || 'bus';
    const newsletterHref = langQs('/newsletter/') + '&from=' + encodeURIComponent(page);
    footer.querySelectorAll('#footerMetaLinks, .app-footer-support, .app-footer-affiliate').forEach(el => el.remove());
    footer.querySelectorAll(':scope > .app-footer-links').forEach(el => el.remove());
    let grid = footer.querySelector('.footer-grid');
    if (!grid) { grid = document.createElement('div'); grid.className = 'footer-grid'; footer.appendChild(grid); }
    const source = document.querySelector(`[data-guide-lang="${lang}"] .guide-sources`) || document.querySelector('.seo-evidence');
    document.querySelectorAll('#sources-and-updates').forEach(el => { if (el !== source) el.removeAttribute('id'); });
    if (source) source.id = 'sources-and-updates';
    const sourceHref = source ? '#sources-and-updates' : langQs('/about/') + '#sources-and-updates';
    const footerFoldOpen = matchMedia('(min-width:701px)').matches ? ' open' : '';
    grid.innerHTML = `<div class="footer-brand"><a class="footer-wordmark" href="${langQs('/')}">YakuBus<span aria-hidden="true">.</span></a><p>${copy.brand}</p></div>
      <nav class="footer-group" aria-labelledby="footer-explore"><details${footerFoldOpen}><summary id="footer-explore">${copy.explore}</summary><div class="v4-nav-links app-footer-links"><a href="${langQs('/')}">${copy.times}</a><a href="${langQs('/fare/')}">${copy.fares}</a><a href="${langQs('/map/')}">${copy.map}</a><a href="${langQs('/ferry/')}">${copy.ferry}</a><a href="${langQs('/guides/')}">${copy.guides}</a><a href="${langQs('/trekking/')}">${copy.activities}</a></div></details></nav>
      <nav class="footer-group" aria-labelledby="footer-trust"><details${footerFoldOpen}><summary id="footer-trust">${copy.trust}</summary><div class="v4-nav-links"><a href="${langQs('/about/')}">${copy.about}</a><a class="footer-source-link" href="${sourceHref}">${copy.sources}</a><a href="mailto:yimleung.ly@gmail.com">${copy.contact}</a><a href="${langQs('/privacy/')}">${copy.privacy}</a><a class="footer-support-link" href="https://ko-fi.com/yimleung" target="_blank" rel="noopener noreferrer">${copy.support}</a></div></details></nav>
      <div class="footer-group footer-touch"></div>`;
    let bottom = footer.querySelector('.footer-bottom');
    if (!bottom) {
      bottom = document.createElement('div'); bottom.className = 'footer-bottom';
      bottom.innerHTML = '<p class="footer-independent"></p><div class="footer-feedback-slot"></div><small class="footer-copyright"></small>';
      footer.appendChild(bottom);
    }
    bottom.querySelector('.footer-independent').textContent = copy.independent;
    bottom.querySelector('.footer-copyright').textContent = `© ${new Date().getFullYear()} YakuBus`;
    const openSource = () => {
      if (!source) return;
      source.open = true;
      source.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      source.querySelector('summary')?.focus({ preventScroll: true });
    };
    grid.querySelector('.footer-source-link').addEventListener('click', event => {
      if (source) { event.preventDefault(); history.replaceState(null, '', '#sources-and-updates'); openSource(); }
    });
    if (location.hash === '#sources-and-updates') requestAnimationFrame(openSource);
    if (location.hash === '#site-footer') requestAnimationFrame(() => footer.scrollIntoView({ block: 'start' }));
    document.querySelectorAll('.app-footer-booking').forEach(el => el.remove());
    if (window.AffiliateUI?.bookingNotesHtml) {
      const notes = document.createElement('div'); notes.className = 'app-footer-booking';
      notes.innerHTML = window.AffiliateUI.bookingNotesHtml(lang);
      const sources = document.querySelector('.journey-end');
      if (sources) sources.appendChild(notes);
    }
  }

  function mountFeedback(footer) {
    if (!feedbackEl) {
      feedbackEl = document.createElement("section");
      feedbackEl.className = "site-feedback";
      feedbackEl.id = "siteFeedback";
      const slot = footer.querySelector(".footer-feedback-slot") || footer;
      slot.appendChild(feedbackEl);
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
    if (window.AppCore && typeof AppCore.getLang === "function") {
      return AppCore.getLang();
    }
    if (window.SiteLang) return window.SiteLang.current;
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
      crossEl.innerHTML = html ? `<span class="meta-links">${html}</span>` : "";
      crossEl.hidden = !html;
    }
  }

  function refresh() {
    lang = readLang();
    window.TransportStatus?.render();
    renderMainNav(lang);
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
    renderMainNav(lang);
    renderFooter();
    renderFeedback();
    window.addEventListener("yakushima-bus-lang", (e) => {
      const next = e.detail?.lang;
      if (next) lang = next;
      refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SiteChrome = { refresh, t, getLang, readLang, langQs, applyPageHead, PAGE_HEAD };
  const referenceHub = document.createElement('script'); referenceHub.src='/reference-hub.js'; document.head.appendChild(referenceHub);
  const footerStyle = document.createElement('link');
  footerStyle.rel = 'stylesheet'; footerStyle.href = '/site-footer.css?v=20261123b';
  document.head.appendChild(footerStyle);
  // Shared newsletter loads once, after the existing page chrome.
  const newsletterStyle = document.createElement('link');
  newsletterStyle.rel = 'stylesheet'; newsletterStyle.href = '/newsletter-v4.css?v=20261124-footer2';
  document.head.appendChild(newsletterStyle);
  const newsletterConfig = document.createElement('script');
  newsletterConfig.src = '/newsletter-config.js?v=20261123';
  newsletterConfig.onload = () => {
    const script = document.createElement('script'); script.src = '/newsletter-v4.js?v=20261124';
    document.head.appendChild(script);
  };
  document.head.appendChild(newsletterConfig);
})();
