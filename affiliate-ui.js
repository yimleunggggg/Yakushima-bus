/** 联盟链渲染 — 依赖 partner-data.js */
(function () {
  const D = () => window.AFFILIATE_DATA;


  function pick(o, lang) {
    if (o == null) return "";
    if (typeof o === "string" || typeof o === "number") return String(o);
    return o[lang] || o.ja || o.en || o.zh || "";
  }

  function item(key) {
    const data = D();
    return data && data.items ? data.items[key] : null;
  }

  function experiencesForPage(pageId) {
    return (D()?.experiences || []).filter((ex) => {
      if (!(ex.pages || []).includes(pageId)) return false;
      if (!ex.requiresRouteId) return true;
      const alerts = window.TransportStatus?.alerts?.() || [];
      return !alerts.some((a) => a.status === "suspended" && a.routeIds?.includes(ex.requiresRouteId));
    });
  }

  function localizedUrl(it, lang) {
    if (it.partner !== "klook") return it.url;
    const url = new URL(it.url);
    const target = new URL(url.searchParams.get("k_site"));
    const locale = { ja: "ja", zh: "zh-CN", en: "en-US" }[lang] || "ja";
    target.pathname = target.pathname.replace(/^\/(zh-CN|en-US|ja)\//, `/${locale}/`);
    url.searchParams.set("k_site", target.href);
    return url.href;
  }

  function affAttrs(it, lang) {
    const partner = it.partner || "klook";
    const id = it.adid || it.productCode || it.id || "";
    const placement = it.placement || "";
    return `href="${localizedUrl(it, lang)}" target="_blank" rel="sponsored noopener" data-affiliate-partner="${partner}" data-affiliate-id="${id}" data-affiliate-placement="${placement}"`;
  }

  function partnerBadge(partner) {
    const label = partner === "viator" ? "Viator" : partner === "klook" ? "Klook" : partner || "";
    return label ? `<span class="affiliate-partner-badge">${label}</span>` : "";
  }

  function ratingHtml(ex, lang) {
    if (!ex.rating) return "";
    const score = Number(ex.rating).toFixed(1);
    const full = Math.floor(ex.rating);
    const half = ex.rating - full >= 0.25 && ex.rating - full < 0.75 ? 1 : 0;
    const empty = 5 - full - half;
    const stars =
      "★".repeat(full) + (half ? "½" : "") + `<span class="affiliate-trust-dim">${"★".repeat(empty)}</span>`;
    const reviews = {
      ja: "{n}件",
      zh: "{n} 条评价",
      en: "{n} reviews",
    };
    const count =
      ex.reviewCount > 0
        ? `<span class="affiliate-trust-count">${pick(reviews, lang).replace("{n}", String(ex.reviewCount))}</span>`
        : "";
    return `<div class="affiliate-card-rating"><span class="affiliate-trust" aria-label="${score} / 5"><span class="affiliate-trust-stars" aria-hidden="true">${stars}</span><span class="affiliate-trust-score">${score}</span>${count}</span></div>`;
  }

  function statsDateHtml(ex, lang) {
    const statsNote = D().blocks?.experiencesStatsNote;
    if (!ex.statsUpdated || !statsNote) return "";
    return `<span class="affiliate-card-stats-date">${pick(statsNote, lang).replace("{date}", window.TransportStatus?.month(ex.statsUpdated, lang) || ex.statsUpdated.slice(0,7))}</span>`;
  }

  function socialProofHtml(it, lang, showPartner = true) {
    const proof = it.socialProof;
    if (!proof || !proof.checkedAt || !proof.reviews || !proof.rating) return "";
    const count = proof.participants || proof.booked;
    const booked = count ? `${pick(count, lang)} · ` : "";
    const reviews = pick({ ja: `${proof.reviews}件の評価`, zh: `${proof.reviews} 条评价`, en: `${proof.reviews} reviews` }, lang);
    const checked = pick({ ja: `${(window.TransportStatus?.month(proof.checkedAt, lang) || proof.checkedAt.slice(0,7))}時点`, zh: `截至 ${(window.TransportStatus?.month(proof.checkedAt, lang) || proof.checkedAt.slice(0,7))}`, en: `as of ${(window.TransportStatus?.month(proof.checkedAt, lang) || proof.checkedAt.slice(0,7))}` }, lang);
    const score = lang === "en" ? `${proof.rating}/5 (${reviews})` : `${proof.rating}/5（${reviews}）`;
    return `<span class="affiliate-social-proof">${showPartner ? (it.partner === "viator" ? "Viator · " : "Klook · ") : ""}${booked}${score}<span class="affiliate-proof-date" title="${checked}">${checked}</span></span>`;
  }

  function operatorReviewsHtml(it, lang) {
    const proof = it.operatorReviews;
    if (!proof?.count || !proof.checkedAt) return "";
    const count = Number(proof.count).toLocaleString("en-US");
    const label = pick({ja:`Tripadvisor 事業者の口コミ ${count}件`,zh:`Tripadvisor 运营商评价 · ${count} 条`,en:`${count} operator reviews on Tripadvisor`}, lang);
    const score = proof.rating ? `<strong>${proof.rating}/5</strong> · ` : "";
    return `<div class="affiliate-operator-reviews" title="${proof.name.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"><span>${score}${label}</span></div>`;
  }

  const ICON_PATHS = {
    compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
    forest:'<path d="m12 3-7 10h4l-5 6h16l-5-6h4Z"/><path d="M12 19v3"/>',
    stay:'<path d="M3 19V7m0 9h18v3m0-3V9H3m3 0V6h5v3m2 0V6h5v3"/>',
    city:'<path d="M3 21V9h7v12m0-16h8v16m0-10h3v10M6 12v1m0 3v1m8-9v1m0 3v1m0 3v1M2 21h20"/>',
    mountain:'<path d="m2 20 7-12 4 6 3-10 6 16Z"/><path d="m7 12 2 2 2-2m3-2 2 2 2-2"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    people:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m0-16a3 3 0 0 1 0 6m3 4a6 6 0 0 1 3 5"/>',
    language:'<path d="M3 5h12M9 2v3m-4 0c1 5 4 8 9 10m-2-10c-1 5-4 8-9 10m11 6 4-10 4 10m-7-3h6"/>',
    pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>'
  };
  function icon(name) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.compass}</svg>`; }
  function featureChips(it, lang) {
    return pick(it.features,lang).split(' · ').filter(Boolean).map((t,i)=>`<span>${icon(i===0?'clock':/英|English|Japanese|日语|日本語/.test(t)?'language':/接送|送迎|pickup/i.test(t)?'pin':'people')}${t}</span>`).join('');
  }
  const TRAVEL_COPY = {
    ja: { islandTitle: "島内観光", forestTitle: "森歩き・ガイド付き登山", stayTitle: "屋久島の宿", gatewayTitle: "鹿児島発・鹿児島での滞在", extrasLabel: "食事体験・指宿の温泉宿", hikeJump: "登山ルートへ ↓", otherForest: "白谷雲水峡のほかのプラン", otherGateway: "鹿児島発のほかのプラン" },
    zh: { islandTitle: "屋久岛观光", forestTitle: "森林体验与向导徒步", stayTitle: "屋久岛住宿", gatewayTitle: "鹿儿岛出发与停留", extrasLabel: "餐食体验与指宿温泉住宿", hikeJump: "查看登山路线 ↓", otherForest: "其他白谷云水峡套餐", otherGateway: "其他鹿儿岛出发套餐" },
    en: { islandTitle: "Around Yakushima", forestTitle: "Forest walks & guided hikes", stayTitle: "Yakushima stays", gatewayTitle: "From Kagoshima & city stopovers", extrasLabel: "Local dining & Ibusuki stays", hikeJump: "Hiking routes ↓", otherForest: "More Shiratani options", otherGateway: "More trips from Kagoshima" },
  };

  function travelGuideHtml(lang) {
    const c = TRAVEL_COPY[lang] || TRAVEL_COPY.ja;
    const statusReady = typeof window.TransportStatus?.alerts === "function";
    const blocked = (it) => (it.requiresRouteId || it.affectedRouteId) && (!statusReady || window.TransportStatus.alerts().some(a => a.status === "suspended" && a.routeIds?.includes(it.requiresRouteId || it.affectedRouteId)));
    const ex = (id) => (D()?.experiences || []).find(it => it.id === id);
    const viator = (code) => (D()?.experiences || []).find(it => it.productCode === code);
    const cards = (items) => items.filter(it => it && !blocked(it)).map(it => productCard(it, lang, false)).join("");
    const section = (id, title, items, extra = "") => `<section class="travel-section" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2><div class="travel-card-grid">${cards(items)}</div>${extra}</section>`;
    const mini = (key) => {
      const it = item(key);
      return it && !blocked(it) ? `<a class="travel-mini-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span>${socialProofHtml(it, lang)}</a>${routeAdvisoryHtml(it, lang) ? `<details class="trip-access-details"><summary>${pick({ja:"道路・歩道の情報",zh:"道路与步道提示",en:"Road & trail notice"},lang)}</summary>${routeAdvisoryHtml(it,lang)}</details>` : ""}` : "";
    };
    const forestExtra = mini("shirataniWalking");
    const gatewayExtra = mini("kagoshimaYakushimaDay");
    const categories = [
      ['all','compass',pick({ja:'すべて',zh:'全部体验',en:'All experiences'},lang)],
      ['island-picks','compass',pick({ja:'島内観光',zh:'环岛观光',en:'Island tours'},lang)],
      ['forest-picks','forest',pick({ja:'森歩き',zh:'森林徒步',en:'Forest walks'},lang)],
      ['island-stays','stay',pick({ja:'宿泊',zh:'温泉住宿',en:'Stays'},lang)],
      ['kagoshima-stop','city',pick({ja:'鹿児島',zh:'鹿儿岛',en:'Kagoshima'},lang)],
      ['hiking-routes','mountain',pick({ja:'登山ルート',zh:'登山路线参考',en:'Hiking trail guide'},lang)]
    ];
    return `<nav class="travel-local-nav" aria-label="${pick({ja:'体験のカテゴリー',zh:'体验分类',en:'Experience categories'},lang)}">${categories.map(([id,type,label])=>id==='all'?`<button type="button" class="is-active" data-travel-filter="all" aria-pressed="true">${icon(type)}${label}</button>`:`<a href="#${id}" data-travel-filter="${id}">${icon(type)}${label}</a>`).join('')}</nav>`
      + section("island-picks", c.islandTitle, [viator("43454P373"), ex("klook_yakuzaru_day")])
      + section("forest-picks", c.forestTitle, [viator("43454P391"), viator("13441P80"), viator("13441P81"), item("hiking")], forestExtra ? `<div class="travel-alternatives">${forestExtra}</div>` : "")
      + section("island-stays", c.stayTitle, [item("samanaHotel"), item("iwasakiHotel")])
      + section("kagoshima-stop", c.gatewayTitle, [viator("43454P739"), viator("424579P1"), item("senganEn"), item("senganSpecial")], `<div class="travel-alternatives">${gatewayExtra}${mini("kagoshimaKitchen")}${mini("ibusukiHotel")}</div>`);
  }

  function bookingNotesHtml(lang) {
    const c = {
      ja: { title: "予約について", proof: "評価・口コミ数・参加人数は各サービスの過去の表示です。最新情報は予約ページでご確認ください。" },
      zh: { title: "预订说明", proof: "评分、评价数、预订量和参与人数来自相应平台，截至卡片标注日期；不同地区的显示可能有差异。" },
      en: { title: "About booking links", proof: "Ratings, reviews and participation figures are platform snapshots. Check the booking page for the latest information." },
    }[lang] || { title: "予約について", proof: "" };
    return `<details class="booking-notes"><summary>${c.title}</summary><p>${c.proof}</p><p>${pick(D()?.blocks?.bookingReminder, lang)}</p></details>`;
  }

  /** 统一产品卡：标题 · 平台标 · 可选图 · 描述 · 评分 · CTA */
  function routeAdvisoryHtml(it, lang) {
    const routeId = it.affectedRouteId || it.requiresRouteId;
    if (!routeId) return '';
    const notice = window.TransportStatus?.alerts?.().find(a => a.status === 'notice' && a.routeIds?.includes(routeId));
    if (!notice) return '';
    const escape = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    const label = pick({ja:'公式情報・予約条件を確認',zh:'核对官方公告及预订条件',en:'Check the official notice and booking terms'}, lang);
    return `<p class="affiliate-card-body affiliate-route-note">${escape(pick(notice.courseMessage || notice.message, lang))} <a href="${escape(notice.sourceUrl)}" target="_blank" rel="noopener">${label}</a></p>`;
  }

  function productCard(it, lang, linkTitle = true) {
    const partner = it.partner || "klook";
    const title = pick(it.title || it.label, lang);
    const body = pick(it.body || it.note, lang);
    const cta = pick(it.cta || it.label, lang);
    const media = it.image
      ? `<div class="affiliate-card-media"><img class="affiliate-card-img" src="${it.image}" alt="" width="320" height="120" loading="lazy" decoding="async"></div>`
      : "";
    const rating = ratingHtml(it, lang);
    const stats = statsDateHtml(it, lang);
    return `<article class="affiliate-card affiliate-card--${partner}${it.image ? " affiliate-card--with-image" : ""}">
      ${media}
      <div class="affiliate-card-main">
        <div class="affiliate-card-head">
          <h3 class="affiliate-card-title">${linkTitle ? `<a class="affiliate-card-link" ${affAttrs(it, lang)}>${title}</a>` : title}</h3>
          ${partnerBadge(partner)}
        </div>
        ${rating}
        ${it.features ? `<div class="affiliate-card-features">${featureChips(it,lang)}</div>` : ""}
        ${body ? `<p class="affiliate-card-body">${body}</p>` : ""}
        ${routeAdvisoryHtml(it, lang) ? `<details class="trip-access-details"><summary>${pick({ja:"道路・歩道の情報",zh:"道路与步道提示",en:"Road & trail notice"},lang)}</summary>${routeAdvisoryHtml(it,lang)}</details>` : ""}
        ${socialProofHtml(it, lang, false)}
        ${operatorReviewsHtml(it, lang)}
        <div class="affiliate-card-foot">
          <a class="affiliate-offer-btn affiliate-card-cta" ${affAttrs(it, lang)}>${cta}</a>
          ${stats}
        </div>
      </div>
    </article>`;
  }

  function experienceCard(ex, lang) {
    return productCard(ex, lang);
  }

  function browseDestinationsHtml(lang) {
    return `<p class="affiliate-destination-links">
      ${["destYakushima", "destKagoshima"]
        .map((key) => {
          const it = item(key);
          return it ? `<a ${affAttrs(it, lang)}>${pick(it.label, lang)} ↗</a>` : "";
        }).join("")}
    </p>`;
  }

  function experiencesSectionHtml(lang, pageId) {
    const list = experiencesForPage(pageId).sort((a,b) => Number(b.partner === "viator") - Number(a.partner === "viator"));
    if (!list.length) return "";
    const b = D().blocks;
    const cards = list.filter((ex) => !ex.compact).map((ex) => experienceCard(ex, lang)).join("");
    const more = list.filter((ex) => ex.compact).map((ex) =>
      `<a class="affiliate-browse-link" ${affAttrs(ex, lang)}><strong>${pick(ex.title, lang)}</strong><span>${pick(ex.body, lang)}</span></a>${routeAdvisoryHtml(ex, lang)}`).join("");
    return `<section class="panel affiliate-experiences" aria-labelledby="affiliateExpTitle">
      <h2 class="affiliate-section-title" id="affiliateExpTitle">${pick(b.experiencesTitle, lang)}</h2>
      <p class="affiliate-block-lead">${pick(b.experiencesLead, lang)}</p>
      <div class="affiliate-card-grid">${cards}</div>
      ${more ? `<details class="affiliate-more"><summary>${pick(b.moreExperiences, lang)}</summary><div class="affiliate-browse-links">${more}</div></details>` : ""}
      ${browseDestinationsHtml(lang)}
    </section>`;
  }

  function lodgingSectionHtml(lang) {
    const b = D().blocks;
    const links = ["samanaHotel", "iwasakiHotel"].map((key) => {
      const it = item(key);
      return it ? `<a class="affiliate-browse-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span>${socialProofHtml(it, lang)}</a>${routeAdvisoryHtml(it, lang)}` : "";
    }).join("");
    if (!links) return "";
    return `<section class="panel affiliate-lodging"><details class="affiliate-more">
      <summary>${pick(b.lodgingSummary, lang)}</summary>
      <p class="affiliate-block-lead">${pick(b.lodgingLead, lang)}</p>
      <div class="affiliate-browse-links">${links}</div>
    </details></section>`;
  }

  function jetfoilPrimaryHtml(lang) {
    const it = item("jetfoil");
    if (!it) return "";
    return `<a class="access-booking-btn access-booking-btn-primary access-booking-btn-klook" ${affAttrs(it, lang)}><span>${pick(it.cta, lang)}</span> <span class="access-booking-offer-badge">${pick(it.offerBadge, lang)}</span></a>`;
  }

  function ferryBottomHtml(lang) {
    const b = D().blocks;
    const links = (keys) => keys
      .map((key) => {
        const it = item(key);
        if (!it) return "";
        const label = pick(it.label || it.cta, lang);
        const note = it.note ? `<span class="link-sub">${pick(it.note, lang)}</span>` : "";
        return `<a ${affAttrs(it, lang)}>${label}${note}${socialProofHtml(it, lang)}</a>`;
      })
      .join("");
    return `<details class="aux-block aux-block--affiliate">
      <summary class="aux-summary"><span>${pick(b.ferryBottomSummary, lang)}</span><span class="aux-chevron" aria-hidden="true"></span></summary>
      <div class="aux-body">
        <p class="affiliate-block-lead">${pick(b.ferryBottomLead, lang)}</p>
        <h3 class="affiliate-link-group-title">${pick(b.islandBookingTitle, lang)}</h3>
        <div class="links source-links">${links(["jetfoil", "destYakushima"])}</div>
        <h3 class="affiliate-link-group-title">${pick(b.gatewayBookingTitle, lang)}</h3>
        <div class="links source-links">${links(["destKagoshima", "senganEn", "jrKyushu"])}</div>
      </div>
    </details>`;
  }

  function restoreTravelFilter(scroll = false) {
    const guide = document.getElementById('travelGuide');
    if (!guide) return;
    const requested = new URL(location.href).searchParams.get('category') || 'all';
    const options = [...guide.querySelectorAll('[data-travel-filter]')];
    const key = options.some(el => el.dataset.travelFilter === requested) ? requested : 'all';
    options.forEach(el => {
      const active = el.dataset.travelFilter === key;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-current', String(active));
      if (el.tagName === 'BUTTON') el.setAttribute('aria-pressed', String(active));
    });
    guide.querySelectorAll('.travel-section').forEach(el => { el.hidden = key !== 'all' && el.id !== key; });
    if (scroll) {
      const target = key === 'hiking-routes' ? document.getElementById(key) : guide.querySelector('.travel-local-nav');
      target?.scrollIntoView({block:'start', behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    }
  }
  if (typeof document !== 'undefined') {
    document.addEventListener('click', event => {
      const target = event.target.closest?.('[data-travel-filter]');
      if (!target) return;
      event.preventDefault();
      const url = new URL(location.href);
      const key = target.dataset.travelFilter;
      if (key === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', key);
      url.hash = '';
      if (url.href !== location.href) history.pushState(null, '', url);
      restoreTravelFilter(true);
    });
    window.addEventListener('popstate', () => restoreTravelFilter(true));
  }
  window.AffiliateUI = {
    restoreTravelFilter,
    localizedUrl,
    pick,
    jetfoilPrimaryHtml,
    ferryBottomHtml,
    experiencesSectionHtml,
    lodgingSectionHtml,
    travelGuideHtml,
    bookingNotesHtml,
  };
})();
