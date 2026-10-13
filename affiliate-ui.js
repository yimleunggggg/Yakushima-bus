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
    const booked = proof.booked ? `${pick(proof.booked, lang)} · ` : "";
    const reviews = pick({ ja: `${proof.reviews}件の評価`, zh: `${proof.reviews} 条评价`, en: `${proof.reviews} reviews` }, lang);
    const checked = pick({ ja: `${proof.checkedAt}確認`, zh: `${proof.checkedAt} 核对`, en: `checked ${proof.checkedAt}` }, lang);
    const score = lang === "en" ? `${proof.rating}/5 (${reviews})` : `${proof.rating}/5（${reviews}）`;
    return `<span class="affiliate-social-proof">${showPartner ? "Klook · " : ""}${booked}${score}<span class="affiliate-proof-date">${checked}</span></span>`;
  }

  const TRAVEL_COPY = {
    ja: {
      eyebrow: "YAKUSHIMA FIELD NOTES", title: "森だけではない、屋久島の旅。",
      lead: "滝と海岸を巡る一日、南部の温泉宿、鹿児島で過ごす半日。まず旅の形を選び、登山ルートはその下で詳しく確認できます。",
      official: "島の自然・観光情報は屋久島観光協会へ", islandJump: "島内で過ごす", stayJump: "島に泊まる", gatewayJump: "鹿児島に寄る", hikeJump: "登山ルートへ",
      islandKicker: "01 / 島内で過ごす", islandTitle: "一日で島の風景をたどる", islandLead: "大川の滝、西部林道、ヤクスギランド。初めての屋久島で行き先を絞れないなら、周遊バスが一つの選択肢です。",
      busTag: "初めての島内周遊", localTitle: "自分のペースで巡るなら", localBody: "港・空港から路線バスで行ける場所と乗り継ぎを先に確認。周遊バスは路線バスの乗り放題券ではありません。", localLink: "島内の移動ガイド",
      stayKicker: "02 / 島に泊まる", stayTitle: "南部・尾之間の二つの宿", stayLead: "どちらも路線バスの停留所を時刻表で確認できます。宿の予約画面で日付を選び、到着便との接続も確認してください。",
      gatewayKicker: "03 / 鹿児島に寄る", gatewayTitle: "船の前後に、鹿児島で半日", gatewayLead: "仙巌園は桜島を望む庭園。通常入場券と食事付き特別プランを比べられます。港への移動時間は別に見込んでください。",
      specialLabel: "食事付きの別プラン", extrasLabel: "鹿児島で一泊・寄り道するなら", gatewayAll: "鹿児島の体験をもっと見る", ferryLink: "高速船と港を確認",
      pauseKicker: "予約前に確認", pauseTitle: "白谷を通るツアーは現在見送り", pauseLead: "予約実績や評価があっても、白谷への道路は通行止めです。再開が公式に確認できるまで予約リンクは表示しません。",
      pauseOpenTitle: "白谷へ行くなら", pauseOpenLead: "通行状況とツアーの行程を確認してから予約してください。",
      pauseUnknownTitle: "白谷の通行状況を確認", pauseUnknownLead: "道路情報を読み込めないため、予約リンクを一時的に表示していません。公式情報を確認してください。",
      officialClosure: "通行止めの公式情報", hikeIntro: "登山だけを探している方はここから。季節の目安と各コースの交通接続を続けて確認できます。",
      disclosure: "予約件数・評価は Klook の表示を記載日の時点で確認したものです。宿の評価は地域設定で異なる場合があります。日付・空室・料金は予約画面で確認してください。リンク経由の予約で当サイトに紹介料が入る場合があります。",
    },
    zh: {
      eyebrow: "YAKUSHIMA FIELD NOTES", title: "先认识这座岛，再决定怎么玩。",
      lead: "瀑布与海岸的一日环游、南部温泉住宿，或在鹿儿岛多留半天。先按行程挑选，登山路线和交通接驳在下方仍可直接查看。",
      official: "屋久岛观光协会的自然与景点介绍", islandJump: "岛上体验", stayJump: "岛上住宿", gatewayJump: "鹿儿岛中转", hikeJump: "直达登山路线",
      islandKicker: "01 / 岛上体验", islandTitle: "一天看见屋久岛的不同风景", islandLead: "大川瀑布、西部林道和屋久杉 Land。第一次上岛、不想逐段换车，可以看看日语导览的环岛巴士。",
      busTag: "初访屋久岛", localTitle: "想自己安排节奏？", localBody: "先查港口、机场到景点的公交与换乘。观光巴士是单独行程，不是普通公交的通票。", localLink: "查看岛内出行指南",
      stayKicker: "02 / 岛上住宿", stayTitle: "住在南部尾之间，按公交站选酒店", stayLead: "这两家酒店都能在本站时刻表找到对应站点。预订时重新选择入住日，也核对抵岛时间与末班车。",
      gatewayKicker: "03 / 鹿儿岛中转", gatewayTitle: "船前船后，给鹿儿岛留半天", gatewayLead: "仙巖園可看庭园与樱岛；普通门票适合自由逛，特别导览还包含餐食。记得另算前往码头的时间。",
      specialLabel: "想多待一会儿", extrasLabel: "在鹿儿岛过夜或顺路延住", gatewayAll: "查看更多鹿儿岛活动", ferryLink: "核对高速船与码头",
      pauseKicker: "预订前先看", pauseTitle: "白谷相关行程目前暂缓推荐", pauseLead: "这些商品有预订量和评价，但白谷道路目前封闭。官方确认恢复前，不展示直接预订按钮。",
      pauseOpenTitle: "想去白谷云水峡？", pauseOpenLead: "预订前核对官方道路状态和商品实际行程。",
      pauseUnknownTitle: "先核对白谷道路状态", pauseUnknownLead: "暂时无法读取道路状态，因此先隐藏预订入口；请查看官方公告。",
      officialClosure: "查看官方封路公告", hikeIntro: "只想查登山路线？从这里直接看季节、路线难度和登山口交通。",
      disclosure: "预订量和评分是 Klook 在标注日期的页面快照；酒店评价可能随地区设置变化。日期、房态、价格以预订页为准。通过分销链接预订，本站可能获得佣金。",
    },
    en: {
      eyebrow: "YAKUSHIMA FIELD NOTES", title: "Explore the island beyond the trail.",
      lead: "Waterfalls and coast in a day, a hot-spring stay in the south, or a little more time in Kagoshima. Choose your trip first; trail details and transport remain below.",
      official: "Island sights and nature from the Yakushima Tourism Association", islandJump: "Island experiences", stayJump: "Island stays", gatewayJump: "Kagoshima stopover", hikeJump: "Jump to trails",
      islandKicker: "01 / On the island", islandTitle: "See more of Yakushima in one day", islandLead: "Ohko Falls, Seibu Rindo and Yakusugi Land. A Japanese-guided loop suits first-time visitors who would rather avoid multiple bus changes.",
      busTag: "First island visit", localTitle: "Prefer your own pace?", localBody: "Check local buses from the port or airport before setting out. The sightseeing tour is separate from the public bus service.", localLink: "Plan island transport",
      stayKicker: "02 / Stay on Yakushima", stayTitle: "Two stays in southern Onoaida", stayLead: "Both have named stops in our bus timetable. Choose your own hotel dates and check the last bus after your arrival.",
      gatewayKicker: "03 / Kagoshima stopover", gatewayTitle: "Use a spare half-day in Kagoshima", gatewayLead: "Sengan-en pairs a garden with Sakurajima views. Compare simple admission with a meal-inclusive tour, and allow extra time to reach the ferry port.",
      specialLabel: "For a longer visit", extrasLabel: "If staying longer in Kagoshima", gatewayAll: "Browse more Kagoshima activities", ferryLink: "Check jetfoil and ports",
      pauseKicker: "Before booking", pauseTitle: "Shiratani tours are on hold", pauseLead: "These tours have booking and review history, but the road to Shiratani remains closed. Booking buttons stay hidden until official access is restored.",
      pauseOpenTitle: "Considering Shiratani?", pauseOpenLead: "Check official road access and the tour itinerary before booking.",
      pauseUnknownTitle: "Check Shiratani access first", pauseUnknownLead: "Road status could not be loaded, so booking links are temporarily hidden. Please check the official notice.",
      officialClosure: "Official closure notice", hikeIntro: "Here for the trails? Continue to seasons, route difficulty and trailhead transport.",
      disclosure: "Booking counts and ratings are dated Klook snapshots; hotel review totals may vary by region. Check current dates, rooms and prices on the booking page. We may earn a commission from bookings through these links.",
    },
  };

  function travelGuideHtml(lang) {
    const c = TRAVEL_COPY[lang] || TRAVEL_COPY.ja;
    const bus = (D()?.experiences || []).find((it) => it.id === "klook_yakuzaru_day");
    const statusReady = typeof window.TransportStatus?.alerts === "function";
    const shirataniAlert = statusReady ? window.TransportStatus.alerts().find((a) => a.status === "suspended" && a.routeIds?.includes("shiratani")) : null;
    const routeBlocked = !statusReady || !!shirataniAlert;
    const cards = (keys) => keys.map((key) => item(key)).filter(Boolean).map((it) => productCard(it, lang)).join("");
    const mini = (key) => {
      const it = item(key);
      return it ? `<a class="travel-mini-link" ${affAttrs(it, lang)}><strong>${pick(it.label, lang)}</strong><span>${pick(it.note, lang)}</span>${socialProofHtml(it, lang)}</a>` : "";
    };
    const routeCard = (key) => {
      const it = item(key);
      if (!it) return "";
      if (!routeBlocked) return productCard(it, lang);
      return `<article class="travel-hold-card"><h3>${pick(it.label, lang)}</h3><p>${pick(it.note, lang)}</p>${socialProofHtml(it, lang)}<a href="${shirataniAlert?.sourceUrl || "https://yakukan.jp/topics/19316.html"}" target="_blank" rel="noopener">${c.officialClosure}</a></article>`;
    };
    return `<section class="travel-hero" aria-labelledby="travelHeroTitle">
      <div><span class="travel-kicker">${c.eyebrow}</span><h2 id="travelHeroTitle">${c.title}</h2><p>${c.lead}</p></div>
      <a href="https://yakukan.jp/" target="_blank" rel="noopener">${c.official} ↗</a>
    </section>
    <nav class="travel-jumps" aria-label="${c.title}">
      <a href="#island-picks">${c.islandJump}</a><a href="#island-stays">${c.stayJump}</a><a href="#kagoshima-stop">${c.gatewayJump}</a><a href="#hiking-routes">${c.hikeJump}</a>
    </nav>
    <section class="panel travel-panel" id="island-picks" aria-labelledby="travelIslandTitle">
      <div class="travel-section-head"><span class="travel-kicker">${c.islandKicker}</span><h2 id="travelIslandTitle">${c.islandTitle}</h2><p>${c.islandLead}</p></div>
      <div class="travel-picks-grid"><div class="travel-feature">${bus ? productCard(bus, lang) : ""}</div>
      <aside class="travel-editorial"><span>${c.busTag}</span><h3>${c.localTitle}</h3><p>${c.localBody}</p><a href="/without-car/?lang=${lang}">${c.localLink} →</a></aside></div>
    </section>
    <section class="panel travel-panel" id="island-stays" aria-labelledby="travelStayTitle">
      <div class="travel-section-head"><span class="travel-kicker">${c.stayKicker}</span><h2 id="travelStayTitle">${c.stayTitle}</h2><p>${c.stayLead}</p></div>
      <div class="travel-card-grid">${cards(["samanaHotel", "iwasakiHotel"])}</div>
    </section>
    <section class="panel travel-panel" id="kagoshima-stop" aria-labelledby="travelGatewayTitle">
      <div class="travel-section-head"><span class="travel-kicker">${c.gatewayKicker}</span><h2 id="travelGatewayTitle">${c.gatewayTitle}</h2><p>${c.gatewayLead}</p></div>
      <div class="travel-card-grid">${cards(["senganEn", "senganSpecial"])}</div>
      <details class="travel-extras"><summary>${c.extrasLabel}</summary><div class="travel-mini-grid">${mini("kagoshimaKitchen")}${mini("ibusukiHotel")}</div></details>
      <div class="travel-section-links"><a href="/ferry/?lang=${lang}">${c.ferryLink} →</a>${mini("destKagoshima")}</div>
    </section>
    <section class="panel travel-panel travel-paused" aria-labelledby="travelPausedTitle">
      <div class="travel-section-head"><span class="travel-kicker">${c.pauseKicker}</span><h2 id="travelPausedTitle">${!statusReady ? c.pauseUnknownTitle : routeBlocked ? c.pauseTitle : c.pauseOpenTitle}</h2><p>${!statusReady ? c.pauseUnknownLead : routeBlocked ? c.pauseLead : c.pauseOpenLead}</p></div>
      <div class="travel-hold-grid">${routeCard("shirataniWalking")}${routeCard("kagoshimaYakushimaDay")}</div>
    </section>
    <p class="travel-disclosure">${c.disclosure}</p>`;
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
        ${socialProofHtml(it, lang, false)}
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
      <p class="page-section-note trek-partner-note">${statsNote}</p>`;
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
    trekkingSectionHtml,
    travelGuideHtml,
  };
})();
