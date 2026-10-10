/** 联盟链 — Klook + Viator；官方预约/时刻仍为主链 */
window.AFFILIATE_DATA = {
  /** Viator 等 — 按 pages 出现在对应页面 */
  experiences: [
    {
      id: "viator_jetfoil_day",
      requiresRouteId: "shiratani",
      partner: "viator",
      productCode: "43454P739",
      placement: "viator_jetfoil_day",
      pages: ["trekking", "without-car"],
      tags: ["day_trip", "jetfoil", "trekking", "shiratani"],
      url: "https://www.viator.com/tours/Kagoshima-Prefecture/Day-trip-to-Yakushima-by-high-speed-Jetfoil-Toppy-from-Kagoshima/d50190-43454P739?pid=P00307180&mcid=42383&medium=link&medium_version=selector",
      title: {
        ja: "鹿児島発・高速船屋久島日帰り（白谷雲水峡ハイキング）",
        zh: "鹿儿岛出发 · 高速船屋久岛一日游（白谷徒步）",
        en: "Yakushima day trip by jetfoil from Kagoshima (Shiratani hike)",
      },
      body: {
        ja: "トッピー往復＋英語ガイド付き森林ハイキング。時間がない方向けの定番コース。",
        zh: "含 Toppy 往返高速船与英文向导森林徒步，适合时间紧的屋久岛一日游。",
        en: "Round-trip Toppy jetfoil plus guided Shiratani forest hike — classic day tour.",
      },
      cta: { ja: "Viator で見る", zh: "在 Viator 查看", en: "View on Viator" },
    },
    {
      id: "viator_private_sights",
      partner: "viator",
      productCode: "43454P373",
      placement: "viator_private_sights",
      pages: ["trekking", "without-car"],
      tags: ["day_trip", "sightseeing", "private"],
      url: "https://www.viator.com/tours/Kagoshima-Prefecture/Yakushima-Private-Island-Sights-Tour-with-ENGLISH-Speaking-Guide/d50190-43454P373?pid=P00307180&mcid=42383&medium=link&medium_version=selector",
      title: {
        ja: "屋久島プライベート島内観光（英語ガイド）",
        zh: "屋久岛私人环岛观光（英文向导）",
        en: "Private Yakushima sights tour (English guide)",
      },
      body: {
        ja: "永田いなか浜・大川の滝など。貸切で柔軟な島内体験。",
        zh: "永田海滩、大川瀑布等景点，私人团灵活安排当地体验。",
        en: "Nagata beach, Ohko Falls & more — flexible private island tour.",
      },
      cta: { ja: "Viator で見る", zh: "在 Viator 查看", en: "View on Viator" },
    },
    {
      id: "viator_snorkel_turtle",
      partner: "viator",
      productCode: "306889P1",
      placement: "viator_snorkel_turtle",
      pages: ["without-car"],
      tags: ["snorkeling", "marine", "turtle", "family", "day_trip"],
      url: "https://www.viator.com/tours/Kagoshima-Prefecture/%E5%B1%8B%E4%B9%85%E5%B3%B6-%E3%82%B7%E3%83%A5%E3%83%8E%E3%82%B1%E3%83%AA%E3%83%B3%E3%82%AF-%E6%86%A7%E3%82%8C%E3%81%AE%E3%82%A6%E3%83%9F%E3%82%AB%E3%83%A1%E3%81%AB%E4%BC%9A%E3%81%84%E3%81%9F%E3%81%84-%E3%82%A6%E3%83%9F%E3%82%AB%E3%83%A1%E3%81%A8%E6%B3%B3%E3%81%8E%E3%82%B7%E3%83%A5%E3%83%8E%E3%82%B1%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%84%E3%82%A2-3%E6%99%82%E9%96%93/d50190-306889P1?pid=P00307180&mcid=42383&medium=link&medium_version=selector",
      title: {
        ja: "ウミガメシュノーケリング（約3時間）",
        zh: "与海龟同游浮潜体验（约 3 小时）",
        en: "Sea turtle snorkeling tour (~3 hr)",
      },
      body: {
        ja: "初心者向け。水中動画付き。遭遇は海況次第（保証なし）。",
        zh: "适合初学者，含水下视频；能否遇到海龟视海况而定。",
        en: "Beginner-friendly with underwater video; turtle sightings depend on conditions.",
      },
      cta: { ja: "Viator で見る", zh: "在 Viator 查看", en: "View on Viator" },
    },
  ],
  items: {
    jetfoil: {
      partner: "klook",
      adid: "1316221",
      placement: "ferry_jetfoil",
      hint: {
        ja: "バウチャーは事前に印刷。往復は往路・復路を別々に選び、宮之浦／安房の港と確認書の便をご確認ください。リンク経由の予約で当サイトに紹介料が入る場合があります。",
        zh: "请提前打印凭证。往返需分别选择去程和返程套餐，注意宫之浦／安房港；班次以确认单为准。通过链接预订，本站可能获得佣金。",
        en: "Print your voucher in advance. For a return trip, select both outbound and inbound packages; check Miyanoura/Anbo port and confirmed sailings. We may earn a commission from bookings through this link.",
      },
      url: "https://affiliate.klook.com/redirect?aid=125410&aff_adid=1316221&k_site=https%3A%2F%2Fwww.klook.com%2Fzh-CN%2Factivity%2F161058-round-trip-ticket-for-high-speed-jetfoil-toppy-or-rocket-to-yakushima",
      image: "/images/affiliate/jetfoil-klook.png",
      cta: {
        ja: "Klook で船券を見る",
        zh: "在 Klook 查看船票",
        en: "View tickets on Klook",
      },
    },
    hiking: {
      partner: "klook",
      adid: "1316225",
      placement: "trekking_jomon",
      affectedRouteId: "shiratani",
      closedHint: {
        ja: "白谷雲水峡コースは現在通行止めです。縄文杉・ヤクスギランドなど他のプランも、予約前に催行日と行程を確認してください。",
        zh: "白谷云水峡路线目前封闭。选择绳文杉、屋久杉 Land 等其他套餐前，也请在预订页核对日期和具体路线。",
        en: "The Shiratani route is currently closed. Check dates and itineraries before choosing another package, such as Jomon Sugi or Yakusugi Land.",
      },
      image: "/images/affiliate/hiking-klook.png",
      url: "https://affiliate.klook.com/redirect?aid=125410&aff_adid=1316225&k_site=https%3A%2F%2Fwww.klook.com%2Fzh-CN%2Factivity%2F150846-yakushima-hiking-tour",
      title: {
        ja: "屋久島ガイド付きハイキング（コース選択）",
        zh: "屋久岛向导徒步（多路线套餐）",
        en: "Guided Yakushima hike (choose a route)",
      },
      body: {
        ja: "最大6名の少人数ツアー。登山用品は事前リクエストで無料レンタル可。コース・送迎条件は予約ページで確認。",
        zh: "最多 6 人的小团；可提前申请免费租用徒步装备。请在预订页核对所选路线和接送条件。",
        en: "Groups of up to 6; hiking gear is free to rent on request. Check your selected route and pickup terms on the booking page.",
      },
      cta: {
        ja: "Klook で見る",
        zh: "在 Klook 查看",
        en: "View on Klook",
      },
    },
    destYakushima: {
      partner: "klook",
      adid: "1316230",
      placement: "dest_yakushima",
      pages: ["trekking", "without-car"],
      url: "https://affiliate.klook.com/redirect?aid=125410&aff_adid=1316230&k_site=https%3A%2F%2Fwww.klook.com%2Fzh-CN%2Fdestination%2Fp60271491-yakushima%2F",
      label: {
        ja: "Klook 屋久島ページを見る",
        zh: "查看 Klook 屋久岛专区",
        en: "Browse Yakushima on Klook",
      },
    },
    destKagoshima: {
      partner: "klook",
      adid: "1316233",
      placement: "dest_kagoshima",
      url: "https://affiliate.klook.com/redirect?aid=125410&aff_adid=1316233&k_site=https%3A%2F%2Fwww.klook.com%2Fzh-CN%2Fdestination%2Fc21043%2F",
      label: {
        ja: "Klook 鹿児島ページを見る",
        zh: "查看 Klook 鹿儿岛专区",
        en: "Browse Kagoshima on Klook",
      },
    },
    jrKyushu: {
      partner: "klook",
      adid: "1316236",
      placement: "jr_kyushu",
      url: "https://affiliate.klook.com/redirect?aid=125410&aff_adid=1316236&k_site=https%3A%2F%2Fwww.klook.com%2Fzh-CN%2Factivity%2F2371-jr-kyushu-jr-pass",
      label: {
        ja: "JR 九州パス（鹿児島まで）",
        zh: "九州 JR Pass（到鹿儿岛）",
        en: "JR Kyushu Pass (to Kagoshima)",
      },
      note: {
        ja: "九州各地を鉄道で回る場合",
        zh: "经九州多地火车到鹿儿岛时",
        en: "If touring Kyushu by train before the island",
      },
    },
    jrJapan7: {
      partner: "klook",
      adid: "1316237",
      placement: "jr_japan_7",
      url: "https://affiliate.klook.com/redirect?aid=125410&aff_adid=1316237&k_site=https%3A%2F%2Fwww.klook.com%2Fzh-CN%2Factivity%2F1420-7-day-whole-japan-rail-pass-jr-pass",
      label: {
        ja: "JR 全日本パス（7日）",
        zh: "日本全境 JR Pass（7 日）",
        en: "Japan Rail Pass (7 days)",
      },
      note: {
        ja: "全国周遊の長期行程向け",
        zh: "适合跨多地区的长行程",
        en: "For multi-region trips across Japan",
      },
    },
  },
  blocks: {
    affiliateDisclosure: {
      ja: "日付・空席・料金は各予約ページで確認してください。リンク経由の予約で当サイトに紹介料が入る場合があります。",
      zh: "请在预订页确认日期、余位和价格。通过链接预订，本站可能获得佣金。",
      en: "Check dates, availability and prices on the booking page. We may earn a commission from bookings through these links.",
    },
    experiencesTitle: {
      ja: "屋久島の現地体験・日帰りツアー",
      zh: "屋久岛当地体验 · 一日游",
      en: "Yakushima tours & local experiences",
    },
    experiencesLead: {
      ja: "Klook / Viator の現地体験（日帰り・ガイド付き等）。バス時刻は本サイト、予約・取消は各プラットフォームの規約に従います。",
      zh: "以下为 Klook / Viator 精选当地体验：徒步跟团、一日游、潜水等。岛上公交时刻见本站；预订与退改以各平台规则为准。",
      en: "Selected Klook & Viator tours — guided hikes, day trips & more. Bus times on this site; booking rules on each platform.",
    },
    trekkingExperiencesLead: {
      ja: "Klook / Viator のガイド付き日帰り・徒步体験。バス接続は上の路線表・運賃ページで確認。",
      zh: "Klook / Viator 精选徒步跟团与一日游；公交衔接请查本站时刻表与票价。",
      en: "Guided hikes & day tours on Klook & Viator — pair with our bus timetable for connections.",
    },
    islandBookingTitle: {
      ja: "屋久島での体験・船券",
      zh: "屋久岛活动与船票",
      en: "On Yakushima: activities & ferry tickets",
    },
    gatewayBookingTitle: {
      ja: "鹿児島発着・九州の移動",
      zh: "鹿儿岛出发与九州接驳",
      en: "Via Kagoshima: activities & Kyushu rail",
    },
    experiencesStatsNote: {
      ja: "評価・件数は Viator 表示（{date} 時点）",
      zh: "评分与评价数来自 Viator（截至 {date}）",
      en: "Rating & review count from Viator (as of {date})",
    },
    ferryBottomSummary: {
      ja: "屋久島・鹿児島の予約サイト",
      zh: "屋久岛与鹿儿岛预订入口",
      en: "Yakushima & Kagoshima booking links",
    },
    ferryBottomLead: {
      ja: "第三者の予約サイトです。島内に JR はありません。時刻・運賃は上記公式情報を優先し、リンク経由の予約で当サイトに紹介料が入る場合があります。",
      zh: "以下为第三方预订链接；岛上无 JR。船班时刻与票价请以上方官方信息为准。通过链接预订，本站可能获得佣金。",
      en: "Third-party booking links. No JR on the island; use official timetables above. We may earn a commission from bookings through these links.",
    },
  },
};
