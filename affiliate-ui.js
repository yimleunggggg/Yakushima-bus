/** 联盟链渲染 — 依赖 affiliate-data.js */
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
    return (D()?.experiences || []).filter((ex) => (ex.pages || []).includes(pageId));
  }

  function affAttrs(it) {
    const partner = it.partner || "klook";
    const id = it.adid || it.productCode || it.id || "";
    const placement = it.placement || "";
    return `href="${it.url}" target="_blank" rel="sponsored noopener" data-affiliate-partner="${partner}" data-affiliate-id="${id}" data-affiliate-placement="${placement}"`;
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

  /** 统一产品卡：标题 · 平台标 · 可选图 · 描述 · 评分 · CTA */
  function productCard(it, lang) {
    const partner = it.partner || "klook";
    const title = pick(it.title || it.label, lang);
    const body = pick(it.body || it.note, lang);
    const cta = pick(it.cta || it.label, lang);
    const media = it.image
      ? `<div class="affiliate-card-media"><img class="affiliate-card-img" src="${it.image}" alt="" width="320" height="120" loading="lazy" decoding="async"></div>`
      : "";
    const rating = ratingHtml(it, lang) || `<div class="affiliate-card-rating affiliate-card-rating--empty" aria-hidden="true"></div>`;
    const stats =
      statsDateHtml(it, lang) ||
      `<span class="affiliate-card-stats-date affiliate-card-stats-date--empty" aria-hidden="true"></span>`;
    return `<article class="affiliate-card affiliate-card--${partner}">
      ${media}
      <div class="affiliate-card-main">
        <div class="affiliate-card-head">
          <h3 class="affiliate-card-title"><a class="affiliate-card-link" ${affAttrs(it)}>${title}</a></h3>
          ${partnerBadge(partner)}
        </div>
        ${rating}
        ${body ? `<p class="affiliate-card-body">${body}</p>` : ""}
        <div class="affiliate-card-foot">
          <a class="affiliate-offer-btn affiliate-card-cta" ${affAttrs(it)}>${cta}</a>
          ${stats}
        </div>
      </div>
    </article>`;
  }

  function experienceCard(ex, lang) {
    return productCard(ex, lang);
  }

  function experiencesSectionHtml(lang, pageId) {
    const list = experiencesForPage(pageId);
    if (!list.length) return "";
    const b = D().blocks;
    const cards = list.map((ex) => experienceCard(ex, lang)).join("");
    return `<section class="panel affiliate-experiences" aria-labelledby="affiliateExpTitle">
      <h2 class="affiliate-section-title" id="affiliateExpTitle">${pick(b.experiencesTitle, lang)}</h2>
      <p class="affiliate-block-lead">${pick(b.experiencesLead, lang)}</p>
      <div class="affiliate-card-grid">${cards}</div>
    </section>`;
  }

  function jetfoilSecondaryHtml(lang) {
    const it = item("jetfoil");
    if (!it) return "";
    return `<a class="access-booking-btn access-booking-btn-affiliate" ${affAttrs(it)}>${pick(it.cta, lang)}</a>`;
  }

  function jetfoilAffiliateHintHtml(lang) {
    const it = item("jetfoil");
    if (!it) return "";
    const hint = pick(it.hint, lang);
    return hint ? `<p class="access-booking-affiliate-hint">${hint}</p>` : "";
  }

  function trekkingSectionHtml(lang) {
    const b = D().blocks;
    const cards = [];
    const hiking = item("hiking");
    if (hiking) cards.push(productCard(hiking, lang));
    experiencesForPage("trekking").forEach((ex) => cards.push(productCard(ex, lang)));
    if (!cards.length) return "";
    return `<details class="aux-block aux-block--affiliate aux-block--desktop-open" aria-labelledby="trekAffiliateTitle">
      <summary class="aux-summary"><span id="trekAffiliateTitle">${pick(b.experiencesTitle, lang)}</span><span class="aux-chevron" aria-hidden="true"></span></summary>
      <div class="aux-body">
        <p class="affiliate-block-lead">${pick(b.trekkingExperiencesLead || b.experiencesLead, lang)}</p>
        <div class="affiliate-card-grid">${cards.join("")}</div>
      </div>
    </details>`;
  }

  function ferryBottomHtml(lang) {
    const b = D().blocks;
    const rows = ["jrKyushu", "jrJapan7", "jetfoil", "destKagoshima", "destYakushima"]
      .map((key) => {
        const it = item(key);
        if (!it) return "";
        const label = pick(it.label || it.cta, lang);
        const note = it.note ? `<span class="link-sub">${pick(it.note, lang)}</span>` : "";
        return `<a ${affAttrs(it)}>${label}${note}</a>`;
      })
      .join("");
    return `<details class="aux-block aux-block--affiliate">
      <summary class="aux-summary"><span>${pick(b.ferryBottomSummary, lang)}</span><span class="aux-chevron" aria-hidden="true"></span></summary>
      <div class="aux-body">
        <p class="affiliate-block-lead">${pick(b.ferryBottomLead, lang)}</p>
        <div class="links source-links">${rows}</div>
      </div>
    </details>`;
  }

  window.AffiliateUI = {
    pick,
    jetfoilSecondaryHtml,
    jetfoilAffiliateHintHtml,
    ferryBottomHtml,
    experiencesSectionHtml,
    trekkingSectionHtml,
  };
})();
