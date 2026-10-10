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
    return `<span class="affiliate-card-stats-date">${pick(statsNote, lang).replace("{date}", ex.statsUpdated)}</span>`;
  }

  function routeNoticeHtml(it, lang) {
    if (!it.affectedRouteId || !it.closedHint) return "";
    const alert = (window.TransportStatus?.alerts?.() || []).find((a) =>
      a.status === "suspended" && a.routeIds?.includes(it.affectedRouteId));
    if (!alert) return "";
    return `<p class="affiliate-card-route-notice">${pick(it.closedHint, lang)} <a href="${alert.sourceUrl}" target="_blank" rel="noopener">${pick({ ja: "公式情報", zh: "官方公告", en: "Official notice" }, lang)}</a></p>`;
  }

  /** 统一产品卡：标题 · 平台标 · 可选图 · 描述 · 评分 · CTA */
  function productCard(it, lang) {
    const partner = it.partner || "klook";
    const title = pick(it.title || it.label, lang);
    const body = pick(it.body || it.note, lang);
    const cta = pick(it.cta || it.label, lang);
    const media = it.image
      ? `<div class="affiliate-card-media"><img class="affiliate-card-img" src="${it.image}" alt="" width="320" height="120" loading="lazy" decoding="async"></div>`
      : "";
    const rating = ratingHtml(it, lang);
    const stats = statsDateHtml(it, lang);
    return `<article class="affiliate-card affiliate-card--${partner}">
      ${media}
      <div class="affiliate-card-main">
        <div class="affiliate-card-head">
          <h3 class="affiliate-card-title"><a class="affiliate-card-link" ${affAttrs(it, lang)}>${title}</a></h3>
          ${partnerBadge(partner)}
        </div>
        ${rating}
        ${body ? `<p class="affiliate-card-body">${body}</p>` : ""}
        ${routeNoticeHtml(it, lang)}
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
    const b = D().blocks;
    return `<div class="affiliate-browse-links">
      ${[["destYakushima", b.islandBookingTitle], ["destKagoshima", b.gatewayBookingTitle]]
        .map(([key, title]) => {
          const it = item(key);
          return it ? `<a class="affiliate-browse-link" ${affAttrs(it, lang)}><strong>${pick(title, lang)}</strong><span>${pick(it.label, lang)}</span></a>` : "";
        }).join("")}
    </div>`;
  }

  function experiencesSectionHtml(lang, pageId) {
    const list = experiencesForPage(pageId);
    if (!list.length) return "";
    const b = D().blocks;
    const cards = list.filter((ex) => !ex.compact).map((ex) => experienceCard(ex, lang)).join("");
    const more = list.filter((ex) => ex.compact).map((ex) =>
      `<a class="affiliate-browse-link" ${affAttrs(ex, lang)}><strong>${pick(ex.title, lang)}</strong><span>${pick(ex.body, lang)}</span></a>`).join("");
    return `<section class="panel affiliate-experiences" aria-labelledby="affiliateExpTitle">
      <h2 class="affiliate-section-title" id="affiliateExpTitle">${pick(b.experiencesTitle, lang)}</h2>
      <p class="affiliate-block-lead">${pick(b.experiencesLead, lang)}</p>
      <div class="affiliate-card-grid">${cards}</div>
      ${more ? `<details class="affiliate-more"><summary>${pick(b.moreExperiences, lang)}</summary><div class="affiliate-browse-links">${more}</div></details>` : ""}
      <p class="page-section-note">${pick(b.affiliateDisclosure, lang)}</p>
      ${browseDestinationsHtml(lang)}
    </section>`;
  }

  function lodgingSectionHtml(lang) {
    const b = D().blocks;
    const links = ["samanaHotel", "iwasakiHotel"].map((key) => {
      const it = item(key);
      return it ? `<a class="affiliate-browse-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span></a>` : "";
    }).join("");
    if (!links) return "";
    return `<section class="panel affiliate-lodging"><details class="affiliate-more">
      <summary>${pick(b.lodgingSummary, lang)}</summary>
      <p class="affiliate-block-lead">${pick(b.lodgingLead, lang)}</p>
      <div class="affiliate-browse-links">${links}</div>
    </details></section>`;
  }

  function jetfoilSecondaryHtml(lang) {
    const it = item("jetfoil");
    if (!it) return "";
    return `<a class="access-booking-btn access-booking-btn-affiliate" ${affAttrs(it, lang)}>${pick(it.cta, lang)}</a>`;
  }

  function jetfoilAffiliateHintHtml(lang) {
    const it = item("jetfoil");
    if (!it) return "";
    const hint = pick(it.hint, lang);
    return hint ? `<p class="access-booking-affiliate-hint">${hint}</p>` : "";
  }

  /** 登山页紧凑产品卡：无头图、等高、与 trek-card 层级一致 */
  function trekProductCard(it, lang) {
    const partner = it.partner || "klook";
    const title = pick(it.title || it.label, lang);
    const body = pick(it.body || it.note, lang);
    const cta = pick(it.cta || it.label, lang);
    const rating = it.rating ? ratingHtml(it, lang) : "";
    const badge = partner === "viator" ? "Viator" : partner === "klook" ? "Klook" : partner;
    return `<article class="trek-partner-card trek-partner-card--${partner}">
      <header class="trek-partner-card-head">
        <span class="trek-partner-badge">${badge}</span>
        ${rating}
      </header>
      <h3 class="trek-partner-card-title"><a class="trek-partner-card-link" ${affAttrs(it, lang)}>${title}</a></h3>
      ${body ? `<p class="trek-partner-card-body">${body}</p>` : ""}
      ${routeNoticeHtml(it, lang)}
      <footer class="trek-partner-card-foot">
        <a class="trek-partner-card-cta" ${affAttrs(it, lang)}>${cta}</a>
      </footer>
    </article>`;
  }

  function trekkingSectionHtml(lang) {
    const b = D().blocks;
    const cards = [];
    const hiking = item("hiking");
    if (hiking) cards.push(trekProductCard(hiking, lang));
    experiencesForPage("trekking").forEach((ex) => cards.push(trekProductCard(ex, lang)));
    if (!cards.length) return "";
    const statsNote = pick(b.affiliateDisclosure, lang);
    return `<h2 class="page-section-title" id="trekAffiliateTitle">${pick(b.experiencesTitle, lang)}</h2>
      <p class="page-section-lead">${pick(b.trekkingExperiencesLead || b.experiencesLead, lang)}</p>
      <div class="trek-partner-grid">${cards.join("")}</div>
      <p class="page-section-note trek-partner-note">${statsNote}</p>
      ${browseDestinationsHtml(lang)}`;
  }

  function ferryBottomHtml(lang) {
    const b = D().blocks;
    const links = (keys) => keys
      .map((key) => {
        const it = item(key);
        if (!it) return "";
        const label = pick(it.label || it.cta, lang);
        const note = it.note ? `<span class="link-sub">${pick(it.note, lang)}</span>` : "";
        return `<a ${affAttrs(it, lang)}>${label}${note}</a>`;
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
    jetfoilSecondaryHtml,
    jetfoilAffiliateHintHtml,
    ferryBottomHtml,
    experiencesSectionHtml,
    lodgingSectionHtml,
    trekkingSectionHtml,
  };
})();
