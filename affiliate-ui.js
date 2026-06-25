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

  function trustHtml(ex, lang) {
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
    const via = `<span class="affiliate-trust-via">${ex.partner === "viator" ? "Viator" : ex.partner}</span>`;
    return `<span class="affiliate-trust" aria-label="${score} / 5"><span class="affiliate-trust-stars" aria-hidden="true">${stars}</span><span class="affiliate-trust-score">${score}</span>${count}${via}</span>`;
  }

  function experienceCard(ex, lang) {
    const statsNote = D().blocks?.experiencesStatsNote;
    const dateNote =
      ex.statsUpdated && statsNote
        ? `<span class="affiliate-card-stats-date">${pick(statsNote, lang).replace("{date}", ex.statsUpdated)}</span>`
        : "";
    return `<article class="affiliate-card">
      <div class="affiliate-card-head">
        <h3 class="affiliate-card-title"><a class="affiliate-card-link" ${affAttrs(ex)}>${pick(ex.title, lang)}</a></h3>
        ${trustHtml(ex, lang)}
      </div>
      <p class="affiliate-card-body">${pick(ex.body, lang)}</p>
      <a class="affiliate-offer-btn affiliate-card-cta" ${affAttrs(ex)}>${pick(ex.cta, lang)}</a>
      ${dateNote}
    </article>`;
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
    const hint = pick(it.hint, lang);
    return `<a class="access-booking-btn access-booking-btn-affiliate" ${affAttrs(it)}>${pick(it.cta, lang)}</a>${hint ? `<p class="access-booking-affiliate-hint">${hint}</p>` : ""}`;
  }

  function ferryBottomHtml(lang) {
    const b = D().blocks;
    const rows = ["jrKyushu", "jrJapan7", "jetfoil", "destKagoshima", "destYakushima"]
      .map((key) => {
        const it = item(key);
        if (!it) return "";
        const label = pick(it.label || it.cta, lang);
        const note = it.note ? `<span class="affiliate-inline-note">${pick(it.note, lang)}</span>` : "";
        return `<li><a class="affiliate-link" ${affAttrs(it)}>${label}</a>${note}</li>`;
      })
      .join("");
    const experiences = experiencesSectionHtml(lang, "ferry");
    return `${experiences}<details class="panel affiliate-foot panel-aux">
      <summary class="affiliate-foot-summary">${pick(b.ferryBottomSummary, lang)}<span class="aux-chevron" aria-hidden="true"></span></summary>
      <div class="aux-body">
        <p class="affiliate-block-lead">${pick(b.ferryBottomLead, lang)}</p>
        <ul class="affiliate-link-list">${rows}</ul>
      </div>
    </details>`;
  }

  function trekkingOffersHtml(lang, courseId) {
    const parts = [];
    if (courseId === "jomon_sugi") {
      const it = item("hiking");
      if (it) {
        const img = it.image
          ? `<img class="affiliate-offer-img" src="${it.image}" alt="" width="120" height="80" loading="lazy" decoding="async">`
          : "";
        parts.push(`<div class="affiliate-offer trek-affiliate-offer">
          ${img}
          <div class="affiliate-offer-body">
            <p class="affiliate-offer-title">${pick(it.title, lang)}</p>
            <p class="affiliate-offer-text">${pick(it.body, lang)}</p>
            <a class="affiliate-offer-btn" ${affAttrs(it)}>${pick(it.cta, lang)}</a>
          </div>
        </div>`);
      }
    }
    if (courseId === "jomon_sugi" || courseId === "taikoiwa") {
      const viator = experiencesForPage("trekking").find(
        (ex) => ex.tags && (ex.tags.includes("trekking") || ex.tags.includes("shiratani"))
      );
      if (viator) {
        parts.push(`<div class="affiliate-offer trek-affiliate-offer trek-affiliate-offer--viator">${experienceCard(viator, lang)}</div>`);
      }
    }
    return parts.join("");
  }

  function disclosureText(lang) {
    return pick(D()?.disclosure, lang);
  }

  window.AffiliateUI = {
    pick,
    jetfoilSecondaryHtml,
    ferryBottomHtml,
    experiencesSectionHtml,
    trekkingOffersHtml,
    disclosureText,
    trekkingOfferHtml: (lang, courseId) => trekkingOffersHtml(lang, courseId),
  };
})();
