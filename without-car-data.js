/** レンタカーなし — /without-car/ */
window.WITHOUT_CAR_DATA = {
  updated: "2026-10-10",
  intro: {
    ja: "宮之浦港・安房港・空港から路線バスで各地へ。山間部は運休や乗換を確認して計画してください。",
    zh: "从宫之浦港、安房港和机场可乘公交前往岛上各地；山区线路需先核查停运与换乘。",
    en: "Route buses connect the ports, airport and towns. Check mountain-route suspensions and transfers before planning.",
  },
  evidence: {
    title: {
      ja: "主要区間（現在の時刻表・平日）",
      zh: "常用区间（当前时刻表·工作日）",
      en: "Common routes (current timetable · weekday)",
    },
    lead: {
      ja: "下表は共通の時刻表データと運行状況から自動表示します。運休中の区間に旧便を表示しません。",
      zh: "下表直接读取全站共用的时刻与停运状态；停运区间不会显示旧班次。",
      en: "This table reads the same timetable and service status as route search. Suspended legs do not show old departures.",
    },
    cols: {
      route: { ja: "区間", zh: "区间", en: "Route" },
      buses: { ja: "平日計画便", zh: "工作日计划班次", en: "Planned weekday buses" },
      hours: { ja: "始发–末班（出発）", zh: "首班–末班（发车）", en: "First–last departure" },
      fare: { ja: "大人片道", zh: "成人单程", en: "Adult one-way" },
    },
    rows: [
      { from: "miyanoura_port", to: "airport" },
      { from: "airport", to: "miyanoura_port" },
      { from: "miyanoura_port", to: "shiratani" },
      { from: "shiratani", to: "miyanoura_port" },
      { from: "miyanoura_port", to: "anbo" },
      { from: "anbo", to: "yakusugi_museum" },
    ],
    conditionNote: {
      ja: "＊印は登校日・荒川登山バス・高速船接続などの運行条件を含む計画便数です。実際に乗れる便は時刻表の各便注記で確認してください。",
      zh: "＊ 表示含小学上课日、荒川登山巴士或高速船衔接等条件班次；实际可乘班次请在时刻表逐班核对。",
      en: "＊ includes runs conditional on school days, Arakawa shuttle service or jetfoil connections. Check each timetable note for the actual travel day.",
    },
    passTitle: {
      ja: "乗り放題パス（目安）",
      zh: "乘车通票（参考）",
      en: "Day passes (reference)",
    },
    passText: {
      ja: "ゆったり満喫乗車券：1日 ¥2,500／3日 ¥4,000／4日 ¥5,000（小人半額）。移動回数が多い場合のみ検討。",
      zh: "屋久岛乘车通票：1 日 ¥2,500／3 日 ¥4,000／4 日 ¥5,000（儿童半价）。仅适合乘车次数较多时。",
      en: "Yakushima day pass: ¥2,500 (1 day), ¥4,000 (3 days), ¥5,000 (4 days); child half fare. Worth it only with many bus rides.",
    },
    trailTitle: {
      ja: "縄文杉・荒川登山口",
      zh: "绳文杉·荒川登山口",
      en: "Jomon Sugi · Arakawa trailhead",
    },
    trailText: {
      ja: "路線バスで屋久杉自然館まで行き、3–11月は別料金の荒川登山バスに乗り換え（登山口終点）。詳細は<a href=\"/trekking/?lang=ja\">登山参考</a>と<a href=\"/\">時刻表</a>で確認。",
      zh: "先乘环岛公交至自然馆，3–11 月换乘另收费的荒川登山巴士（登山口终点）。详见<a href=\"/trekking/?lang=zh\">登山参考</a>与<a href=\"/\">时刻表</a>。",
      en: "Take a route bus to Yakusugi Museum, then the seasonal Arakawa shuttle (Mar–Nov, separate fare) to the trailhead. See <a href=\"/trekking/?lang=en\">trekking</a> and the <a href=\"/\">timetable</a>.",
    },
    note: {
      ja: "運賃は2024年3月改定の公式運賃表に基づく目安。土日祝・季節運行は<a href=\"/\">時刻表</a>で確認。非公式サイトです。",
      zh: "票价依据 2024 年 3 月官方运价表估算；周末假日与季节班次请在<a href=\"/\">时刻表</a>核对。非官方网站。",
      en: "Fares estimated from the official fare table (Mar 2024). Check Sat/Sun/holiday and seasonal service on the <a href=\"/\">timetable</a>. Independent site — not the operator.",
    },
    sources: {
      ja: "出典：共通の公式時刻表（2026年10月改定）・運賃表（2024年3月改定）",
      zh: "来源：全站共用官方时刻表（2026 年 10 月改定）·运价表（2024 年 3 月改定）",
      en: "Sources: shared official timetable (Oct 2026 rev.) and fare table (Mar 2024 rev.)",
    },
  },
  sections: [
    {
      title: { ja: "まず押さえる3点", zh: "先记住三点", en: "Three basics" },
      items: [
        {
          ja: "港・空港・宿エリアからバス網で回れる（時刻表で次の便を確認）",
          zh: "港口、机场、住宿区有公交网（用时刻表查下一班）",
          en: "Ports, airport, and lodging areas are on the bus network — check the next bus.",
        },
        {
          ja: "路線図・運賃は別ページ。区間料金と公式路線図を参照",
          zh: "路线图与票价见专页，可查区间票价与官方路线图",
          en: "Route map and fares live on a dedicated page with section prices and official route maps.",
        },
        {
          ja: "縄文杉・登山は登山バス＋路線バスの組み合わせ（季節運行に注意）",
          zh: "绳文杉/登山需登山巴士+环岛公交（注意季节运营）",
          en: "Jomon Sugi treks need trail buses plus route buses — mind seasonal service.",
        },
      ],
    },
    {
      title: { ja: "よく使う区間", zh: "常用区间", en: "Common legs" },
      items: [
        {
          ja: "宮之浦港 ↔ 屋久島空港・安房・屋久杉自然館",
          zh: "宫之浦港 ↔ 机场、安房、屋久杉自然馆",
          en: "Miyanoura Port ↔ airport, Anbo, Yakusugi Museum",
        },
        {
          ja: "屋久杉自然館 → 荒川登山口（登山バス・季節限定）",
          zh: "自然馆 → 荒川登山口（登山巴士，季节性）",
          en: "Museum → Arakawa trailhead (seasonal trail bus)",
        },
      ],
    },
    {
      title: { ja: "このサイトでできること", zh: "本站能帮你什么", en: "Use this site" },
      links: [
        {
          label: { ja: "屋久島バス時刻表 2026", zh: "屋久岛公交时刻表 2026", en: "Yakushima bus timetable 2026" },
          href: "/",
          note: { ja: "次の便検索", zh: "查下一班", en: "Next bus" },
        },
        {
          label: { ja: "屋久島バス路線図・料金", zh: "路线图·票价", en: "Bus map & fares" },
          href: "/fare/",
          note: { ja: "運賃検索", zh: "运价查询", en: "Fare lookup" },
        },
        {
          label: { ja: "鹿児島↔屋久島 上島交通", zh: "鹿儿岛↔屋久岛 上岛", en: "Kagoshima ↔ Yakushima access" },
          href: "/ferry/",
          note: { ja: "船・飛行機", zh: "船班", en: "Ferry" },
        },
        {
          label: { ja: "観光・温泉・店舗マップ", zh: "景点·温泉·店铺地图", en: "Sights & shops map" },
          href: "/map/",
          note: { ja: "便利ガイド", zh: "便利指南", en: "Island guide" },
        },
        {
          label: { ja: "登山ルート参考", zh: "登山路线参考", en: "Trekking routes" },
          href: "/trekking/",
          note: { ja: "縄文杉など", zh: "绳文杉等", en: "Jomon Sugi etc." },
        },
      ],
    },
  ],
  passNote: {
    ja: "乗り放題パス（ゆったり満喫乗車券等）がお得かは滞在日数と移動回数次第。運賃ページで区間を確認してから検討してください。",
    zh: "是否划算购买乘车通票，取决于停留天数与乘车次数；请先在运价页查区间票价。",
    en: "Day passes pay off depending on stay length and trips — check section fares on the map page first.",
  },
};
