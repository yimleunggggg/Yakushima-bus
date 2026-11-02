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
    return `<span class="affiliate-social-proof">${showPartner ? (it.partner === "viator" ? "Viator · " : "Klook · ") : ""}${booked}${score}<span class="affiliate-proof-date">${checked}</span></span>`;
  }

  function operatorReviewsHtml(it, lang) {
    const proof = it.operatorReviews;
    if (!proof?.count || !proof.checkedAt) return "";
    const count = Number(proof.count).toLocaleString("en-US");
    const label = pick({ja:`Tripadvisor 事業者の口コミ ${count}件`,zh:`Tripadvisor 运营商评价 · ${count} 条`,en:`${count} operator reviews on Tripadvisor`}, lang);
    const score = proof.rating ? `<strong>${proof.rating}/5</strong> · ` : "";
    return `<p class="affiliate-operator-reviews">${score}${label}<span class="affiliate-proof-date">${proof.name} · ${pick({ja:"確認",zh:"核查",en:"Checked"},lang)} ${proof.checkedAt.slice(0,7)}</span></p>`;
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
    const section = (id, title, items) => `<section class="travel-section" id="${id}" aria-labelledby="${id}-title"><h2 id="${id}-title">${title}</h2><div class="travel-card-grid">${cards(items)}</div></section>`;
    const mini = (key) => {
      const it = item(key);
      return it && !blocked(it) ? `<a class="travel-mini-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span>${socialProofHtml(it, lang)}</a>${routeAdvisoryHtml(it, lang)}` : "";
    };
    const forestExtra = mini("shirataniWalking");
    const gatewayExtra = mini("kagoshimaYakushimaDay");
    return `<p class="travel-shortcut"><a href="#hiking-routes">${c.hikeJump}</a></p>`
      + section("island-picks", c.islandTitle, [viator("43454P373"), ex("klook_yakuzaru_day")])
      + section("forest-picks", c.forestTitle, [viator("43454P391"), viator("13441P80"), viator("13441P81"), item("hiking")])
      + (forestExtra ? `<details class="travel-extras travel-secondary"><summary>${c.otherForest}</summary><div class="travel-mini-grid">${forestExtra}</div></details>` : "")
      + section("island-stays", c.stayTitle, [item("samanaHotel"), item("iwasakiHotel")])
      + section("kagoshima-stop", c.gatewayTitle, [viator("43454P739"), viator("424579P1"), item("senganEn"), item("senganSpecial")])
      + (gatewayExtra ? `<details class="travel-extras travel-secondary"><summary>${c.otherGateway}</summary><div class="travel-mini-grid">${gatewayExtra}</div></details>` : "")
      + `<details class="travel-extras travel-secondary"><summary>${c.extrasLabel}</summary><div class="travel-mini-grid">${mini("kagoshimaKitchen")}${mini("ibusukiHotel")}</div></details>`;
  }

  function bookingNotesHtml(lang) {
    const c = {
      ja: { title: "予約について", proof: "評価・口コミ数・予約件数・参加人数は各サービスの表示を、記載日の時点で確認したものです。地域設定により異なる場合があります。" },
      zh: { title: "预订说明", proof: "评分、评价数、预订量和参与人数来自相应平台，截至卡片标注日期；不同地区的显示可能有差异。" },
      en: { title: "About booking links", proof: "Ratings, review totals, booking counts and participant numbers come from the named platforms as of the dates shown. Figures may vary by region." },
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
        ${it.features ? `<p class="affiliate-card-features">${pick(it.features,lang)}</p>` : ""}
        ${body ? `<p class="affiliate-card-body">${body}</p>` : ""}
        ${routeAdvisoryHtml(it, lang)}
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

  window.AffiliateUI = {
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
