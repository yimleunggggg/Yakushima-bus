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

  function socialProofHtml(it, lang, showPartner = true) {
    const proof = it.socialProof;
    if (!proof || !proof.checkedAt || !proof.reviews || !proof.rating) return "";
    const count = proof.participants || proof.booked;
    const booked = count ? `${pick(count, lang)} · ` : "";
    const reviews = pick({ ja: `${proof.reviews}件の評価`, zh: `${proof.reviews} 条评价`, en: `${proof.reviews} reviews` }, lang);
    const checked = pick({ ja: `${proof.checkedAt}時点`, zh: `截至 ${proof.checkedAt}`, en: `as of ${proof.checkedAt}` }, lang);
    const score = lang === "en" ? `${proof.rating}/5 (${reviews})` : `${proof.rating}/5（${reviews}）`;
    return `<span class="affiliate-social-proof">${showPartner ? "Klook · " : ""}${booked}${score}<span class="affiliate-proof-date">${checked}</span></span>`;
  }

  const TRAVEL_COPY = {
    ja: {
      nav: "旅行の項目", islandJump: "島内の体験", stayJump: "屋久島の宿", gatewayJump: "鹿児島の寄り道", hikeJump: "登山ルート",
      islandTitle: "屋久島の体験", islandLead: "島を巡るなら周遊バス、森を歩くならガイド付き登山。",
      localLink: "島内のバス・移動ガイド", official: "屋久島観光協会の観光情報",
      stayTitle: "屋久島南部の宿", stayLead: "尾之間の温泉と海・山の景色。港や空港からのバス接続も確認できます。",
      gatewayTitle: "鹿児島での寄り道", gatewayLead: "桜島を望む仙巌園。通常入場券と食事付きプランを選べます。",
      extrasLabel: "食事体験・指宿の温泉宿", ferryLink: "高速船・港の案内",
      pauseTitle: "白谷雲水峡：道路通行止め", pauseLead: "現在は白谷へ入れません。白谷を含むツアーは、道路の再開後に検討してください。",
      openTitle: "白谷雲水峡のガイドツアー", openLead: "英語ガイド付き登山と、鹿児島発の高速船付きプラン。",
      unknownTitle: "白谷のツアー：通行状況を確認", unknownLead: "白谷へ行く前に、観光協会の最新の道路情報をご確認ください。",
      officialClosure: "観光協会の道路情報",
    },
    zh: {
      nav: "旅行分类", islandJump: "岛上体验", stayJump: "屋久岛住宿", gatewayJump: "鹿儿岛停留", hikeJump: "登山路线",
      islandTitle: "屋久岛体验", islandLead: "想环岛看风景，选观光巴士；想走进森林，可选向导徒步。",
      localLink: "岛内公交与出行指南", official: "屋久岛观光协会 · 景点介绍",
      stayTitle: "屋久岛南部住宿", stayLead: "尾之间的温泉、海景与山景住宿，可搭配港口或机场的公交行程。",
      gatewayTitle: "在鹿儿岛多留半天", gatewayLead: "仙巖園可看庭园与樱岛；自由游览选普通门票，慢慢逛也可选含餐食的特别导览。",
      extrasLabel: "当地餐食体验 · 指宿温泉住宿", ferryLink: "高速船与码头指南",
      pauseTitle: "白谷云水峡：道路封闭", pauseLead: "目前无法进入白谷云水峡，含白谷的徒步和一日游需等道路恢复后再安排。",
      openTitle: "白谷云水峡向导行程", openLead: "可选英文向导徒步，或从鹿儿岛出发、含高速船的行程。",
      unknownTitle: "白谷行程：先查通行情况", unknownLead: "前往白谷前，请查看观光协会的最新道路信息。",
      officialClosure: "观光协会道路公告",
    },
    en: {
      nav: "Trip sections", islandJump: "Island experiences", stayJump: "Yakushima stays", gatewayJump: "Kagoshima stopover", hikeJump: "Hiking routes",
      islandTitle: "Experiences on Yakushima", islandLead: "Tour the island by sightseeing bus, or head into the forest with a hiking guide.",
      localLink: "Island buses & transport", official: "Sights from the Yakushima Tourism Association",
      stayTitle: "Stays in southern Yakushima", stayLead: "Hot springs, sea views and mountain scenery in Onoaida, with bus connections from the ports and airport.",
      gatewayTitle: "A little more time in Kagoshima", gatewayLead: "Sengan-en offers gardens and Sakurajima views. Choose simple admission or a meal-inclusive tour.",
      extrasLabel: "Local dining & Ibusuki hot-spring stays", ferryLink: "Jetfoil & port guide",
      pauseTitle: "Shiratani: access road closed", pauseLead: "Shiratani is currently inaccessible. Plan tours that include it after the road reopens.",
      openTitle: "Guided Shiratani trips", openLead: "Choose an English-guided hike or a jetfoil-inclusive trip from Kagoshima.",
      unknownTitle: "Shiratani trips: check road access", unknownLead: "Check the tourism association’s latest road information before visiting Shiratani.",
      officialClosure: "Tourism association road notice",
    },
  };

  function travelGuideHtml(lang) {
    const c = TRAVEL_COPY[lang] || TRAVEL_COPY.ja;
    const bus = (D()?.experiences || []).find((it) => it.id === "klook_yakuzaru_day");
    const statusReady = typeof window.TransportStatus?.alerts === "function";
    const alert = statusReady ? window.TransportStatus.alerts().find((a) => a.status === "suspended" && a.routeIds?.includes("shiratani")) : null;
    const routeBlocked = !statusReady || !!alert;
    const cards = (keys) => keys.map((key) => item(key)).filter(Boolean).map((it) => productCard(it, lang)).join("");
    const mini = (key) => {
      const it = item(key);
      return it ? `<a class="travel-mini-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span>${socialProofHtml(it, lang)}</a>` : "";
    };
    const routeCard = (key) => {
      const it = item(key);
      if (!it) return "";
      if (!routeBlocked) return productCard(it, lang);
      return `<article class="travel-hold-card"><h3>${pick(it.label, lang)}</h3><p>${pick(it.note, lang)}</p>${socialProofHtml(it, lang)}</article>`;
    };
    return `<nav class="travel-jumps" aria-label="${c.nav}">
      <a href="#island-picks">${c.islandJump}</a><a href="#island-stays">${c.stayJump}</a><a href="#kagoshima-stop">${c.gatewayJump}</a><a href="#hiking-routes">${c.hikeJump}</a>
    </nav>
    <section class="panel travel-panel" id="island-picks" aria-labelledby="travelIslandTitle">
      <div class="travel-section-head"><h2 id="travelIslandTitle">${c.islandTitle}</h2><p>${c.islandLead}</p></div>
      <div class="travel-card-grid">${bus ? productCard(bus, lang) : ""}${cards(["hiking"])}</div>
      <details class="travel-extras travel-access"><summary>${!statusReady ? c.unknownTitle : routeBlocked ? c.pauseTitle : c.openTitle}</summary>
        <p>${!statusReady ? c.unknownLead : routeBlocked ? c.pauseLead : c.openLead} <a href="${alert?.sourceUrl || "https://yakukan.jp/topics/19316.html"}" target="_blank" rel="noopener">${c.officialClosure} ↗</a></p>
        <div class="travel-hold-grid">${routeCard("shirataniWalking")}${routeCard("kagoshimaYakushimaDay")}</div>
      </details>
      <div class="travel-section-links"><a href="/without-car/?lang=${lang}">${c.localLink} →</a><a href="https://yakukan.jp/" target="_blank" rel="noopener">${c.official} ↗</a></div>
    </section>
    <section class="panel travel-panel" id="island-stays" aria-labelledby="travelStayTitle">
      <div class="travel-section-head"><h2 id="travelStayTitle">${c.stayTitle}</h2><p>${c.stayLead}</p></div>
      <div class="travel-card-grid">${cards(["samanaHotel", "iwasakiHotel"])}</div>
    </section>
    <section class="panel travel-panel" id="kagoshima-stop" aria-labelledby="travelGatewayTitle">
      <div class="travel-section-head"><h2 id="travelGatewayTitle">${c.gatewayTitle}</h2><p>${c.gatewayLead}</p></div>
      <div class="travel-card-grid">${cards(["senganEn", "senganSpecial"])}</div>
      <details class="travel-extras"><summary>${c.extrasLabel}</summary><div class="travel-mini-grid">${mini("kagoshimaKitchen")}${mini("ibusukiHotel")}</div></details>
      <div class="travel-section-links"><a href="/ferry/?lang=${lang}">${c.ferryLink} →</a>${mini("destKagoshima")}</div>
    </section>`;
  }

  function bookingNotesHtml(lang) {
    const c = {
      ja: { title: "予約について", proof: "評価・口コミ数・予約件数・参加人数は各サービスの表示を、記載日の時点で確認したものです。地域設定により異なる場合があります。" },
      zh: { title: "预订说明", proof: "评分、评价数、预订量和参与人数来自相应平台，截至卡片标注日期；不同地区的显示可能有差异。" },
      en: { title: "About booking links", proof: "Ratings, review totals, booking counts and participant numbers come from the named platforms as of the dates shown. Figures may vary by region." },
    }[lang] || { title: "予約について", proof: "" };
    return `<details class="booking-notes"><summary>${c.title}</summary><p>${c.proof}</p><p>${pick(D()?.blocks?.affiliateDisclosure, lang)}</p></details>`;
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
        ${socialProofHtml(it, lang, false)}
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
      ${browseDestinationsHtml(lang)}
    </section>`;
  }

  function lodgingSectionHtml(lang) {
    const b = D().blocks;
    const links = ["samanaHotel", "iwasakiHotel"].map((key) => {
      const it = item(key);
      return it ? `<a class="affiliate-browse-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span>${socialProofHtml(it, lang)}</a>` : "";
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
    jetfoilSecondaryHtml,
    jetfoilAffiliateHintHtml,
    ferryBottomHtml,
    experiencesSectionHtml,
    lodgingSectionHtml,
    travelGuideHtml,
    bookingNotesHtml,
  };
})();
