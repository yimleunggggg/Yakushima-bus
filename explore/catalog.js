/* Curated, source-backed records. Commercial links are resolved from partner-data.js. */
(function (root, factory) {
  const catalog = factory();
  if (typeof module === 'object' && module.exports) module.exports = catalog;
  root.ExploreCatalog = catalog;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  return [
    {
      id: 'jr-basics', region: 'japan', intents: ['rail', 'first'], terms: ['jr', 'train', 'rail', '列車', '電車', '新幹線', '乗り方', '改札', '指定席', '列车', '火车', '乘车', '车票'],
      title: { ja: 'JRの乗り方と切符の確認', en: 'How to ride JR trains', zh: 'JR 列车怎么坐' },
      summary: { ja: '乗る区間と列車を先に決め、切符・指定席・改札の順に確認。パスの対象外列車や会社の違いに注意。', en: 'Choose the route and train first, then check tickets, seat reservations and gates. Pass coverage differs by operator.', zh: '先确认区间和车次，再核对车票、指定席与检票口；不同铁路公司和通票适用范围不同。' },
      next: { ja: '経路を確認 → 対象パスと指定席を確認 → 当日の運行情報を確認', en: 'Check route → pass and seat rules → day-of-service status', zh: '查路线 → 核对通票与指定席 → 出发当天复核运行状态' },
      sources: [
        { label: 'Japan Rail Pass · How to use', url: 'https://japanrailpass.net/en/use/', checkedAt: '2026-10-12' },
        { label: 'JNTO · Train and bus travel', url: 'https://www.japan.travel/en/guide/how-to-travel-by-train-and-bus-in-japan/', checkedAt: '2026-10-12' }
      ], map: 'https://www.google.com/maps/search/?api=1&query=Japan+Railway+Station'
    },
    {
      id: 'jr-kyushu', region: 'kyushu', eligibility: 'temporary-visitor', intents: ['rail', 'pass'], terms: ['jr', 'rail', 'pass', 'kyushu', '九州', '熊本', '博多', '鹿児島', '福岡', '火车', '周游券', '通票', '鉄道'],
      title: { ja: '九州を鉄道で巡る', en: 'Rail travel across Kyushu', zh: '九州铁路旅行' },
      summary: { ja: '複数都市を鉄道で回る場合は、区間ごとの運賃とJR九州のパス対象範囲を比較。JR九州パスは外国籍の短期滞在者向け。購入前に在留資格と列車条件を確認。', en: 'For multiple cities, compare individual fares with JR Kyushu pass coverage. This pass is for foreign temporary visitors; check eligibility and train rules before buying.', zh: '跨城市旅行时，把单段票价与 JR 九州通票覆盖范围比较；该通票面向符合条件的外籍短期访客；购票前核对资格和车次限制。' },
      next: { ja: '行程の駅を並べる → 公式の対象エリアを照合 → 予約条件を確認', en: 'List stations → compare official coverage → check reservation rules', zh: '列出车站 → 对照官方适用区域 → 核对预约规则' },
      sources: [{ label: 'JR Kyushu · Rail Pass', url: 'https://www.jrkyushu.co.jp/english/railpass/index.html', checkedAt: '2026-10-12' }],
      affiliateRef: 'items.jrKyushu', map: 'https://www.google.com/maps/search/?api=1&query=JR+Kyushu+Hakata+Station'
    },
    {
      id: 'yakushima-access', region: 'yakushima', intents: ['ferry', 'transport'], terms: ['屋久島', '屋久岛', 'yakushima', '鹿児島', '鹿儿岛', 'ferry', 'jetfoil', '船', '高速船', '港', '交通', 'バス', 'bus'],
      title: { ja: '屋久島への船と島内移動', en: 'Ferry to Yakushima and onward travel', zh: '前往屋久岛与岛内交通' },
      summary: { ja: '鹿児島発の船は便ごとに到着港を確認。宮之浦・安房からの島内移動は、接続するバスの時刻まで調べる。', en: 'Check the arrival port for each ferry sailing, then match Miyanoura or Anbo with the onward bus schedule.', zh: '逐班确认船抵达宫之浦还是安房，并接上岛内公交班次。' },
      next: { ja: '船便・港を確認 → 島内のバス時刻を検索', en: 'Confirm sailing and port → search local bus departures', zh: '核对航次和港口 → 查询岛内公交' },
      sources: [{ label: 'Yakushima Bus · Ferry guide', url: '/ferry/', checkedAt: '2026-10-12' }, { label: 'Yakushima Bus · Timetable', url: '/', checkedAt: '2026-10-12' }],
      affiliateRef: 'items.jetfoil', map: 'https://www.google.com/maps/search/?api=1&query=Miyanoura+Port+Yakushima'
    },
    {
      id: 'shiratani', region: 'yakushima', intents: ['hiking'], terms: ['白谷', '白谷雲水峡', '白谷云水峡', 'shiratani', '太鼓岩', 'taiko', 'hike', '登山', '徒步'],
      title: { ja: '白谷雲水峡・太鼓岩', en: 'Shiratani and Taiko-iwa', zh: '白谷云水峡与太鼓岩' },
      summary: { ja: '現地の通行・入山情報を優先。道路閉鎖中は旧時刻表や予約商品だけを見て訪問を決めない。', en: 'Prioritize access notices. An old timetable or bookable tour does not prove the road is open.', zh: '以现场道路和入山公告为准；旧时刻表或可预订商品不代表道路已开放。' },
      next: { ja: '公式の通行止め情報を確認', en: 'Check the official closure notice', zh: '查看官方封闭公告' },
      sources: [{ label: '屋久島観光協会 · 通行情報', url: 'https://yakukan.jp/topics/19316.html', checkedAt: '2026-10-10' }],
      courseId: 'taikoiwa', map: 'https://www.google.com/maps/search/?api=1&query=Shiratani+Unsuikyo'
    },
    {
      id: 'janokuchi', region: 'yakushima', alternativeFor: 'shiratani', intents: ['hiking'], terms: ['蛇之口', 'janokuchi', '蛇之口瀑布', '蛇之口滝'],
      title: { ja: '代案：蛇之口滝トレッキング', en: 'Alternative: Janokuchi Falls hike', zh: '替代路线：蛇之口瀑布徒步' },
      summary: { ja: '観光協会の10月8日発表では入山可能エリアに掲載。約7km・3〜4時間。道路・登山道の当日状況は再確認してください。', en: 'Listed accessible in the tourism association’s Oct 8 notice. Around 7 km and 3–4 hours; recheck trail and road conditions for your day.', zh: '观光协会 10 月 8 日公告列为可进入区域。约 7 公里、3–4 小时；出发前再核对路况和步道。' },
      next: { ja: '公式公告と現地の道路状況を再確認', en: 'Recheck official notice and local road status', zh: '再次核对官方公告和当地道路状态' },
      sources: [{ label: '屋久島観光協会 · 通行情報', url: 'https://yakukan.jp/topics/19316.html', checkedAt: '2026-10-13' }, { label: '屋久島観光協会 · 蛇之口滝', url: 'https://yakukan.jp/feature/janokuchitaki-course.html', checkedAt: '2026-10-13' }],
      map: 'https://www.google.com/maps/search/?api=1&query=Janokuchi+Falls+Yakushima'
    },
    {
      id: 'tachudake', region: 'yakushima', alternativeFor: 'shiratani', intents: ['hiking'], terms: ['太忠岳', 'tachudake', 'ヤクスギランド', '屋久杉Land'],
      title: { ja: '代案：ヤクスギランド・太忠岳', en: 'Alternative: Yakusugi Land / Tachudake', zh: '替代路线：屋久杉 Land／太忠岳' },
      summary: { ja: '10月8日の公式公告ではヤクスギランド全コースと太忠岳が入山可能。ただし出口側通行不可。太忠岳は約7km・6〜7時間の本格登山です。', en: 'The Oct 8 notice lists Yakusugi Land and Tachudake as accessible, with an exit-side restriction. Tachudake is a demanding ~7 km, 6–7 hour hike.', zh: '10 月 8 日公告列屋久杉 Land 全线和太忠岳可进入，但出口侧有限制。太忠岳约 7 公里、6–7 小时，需较强体力。' },
      next: { ja: '入口・出口制限とバス往復便を確認', en: 'Check entrance/exit restriction and return bus', zh: '核对出入口限制与返程公交' },
      sources: [{ label: '屋久島観光協会 · 通行情報', url: 'https://yakukan.jp/topics/19316.html', checkedAt: '2026-10-13' }, { label: '屋久島観光協会 · 太忠岳', url: 'https://yakukan.jp/spot/9652.html', checkedAt: '2026-10-13' }],
      map: 'https://www.google.com/maps/search/?api=1&query=Yakusugi+Land'
    },
    {
      id: 'yakuzaru', region: 'yakushima', intents: ['sightseeing', 'transport'], terms: ['屋久島', '屋久岛', 'yakushima', '観光', '观光', 'sightseeing', 'bus', 'バス', '巴士', '滝', '瀑布'],
      title: { ja: '島内を一日で巡る観光バス', en: 'One-day Yakushima sightseeing bus', zh: '屋久岛一日观光巴士' },
      summary: { ja: '複数の観光地を一日で巡りたい方向け。催行日・集合場所・案内言語は予約先で再確認。', en: 'For a day of several sights. Recheck operating dates, meeting point and guide language before booking.', zh: '适合一天串联多个景点；出发日期、集合点及导览语言请在预订页复核。' },
      next: { ja: '行程と催行日を確認', en: 'Check itinerary and operating date', zh: '核对行程和出发日期' },
      sources: [{ label: 'Yakushima Bus · Island guide', url: '/without-car/', checkedAt: '2026-10-12' }],
      affiliateRef: 'experiences.klook_yakuzaru_day', map: 'https://www.google.com/maps/search/?api=1&query=Miyanoura+Port+Yakushima'
    },
    {
      id: 'kagoshima-senganen', region: 'kyushu', intents: ['sightseeing', 'culture'], terms: ['鹿児島', '鹿儿岛', 'kagoshima', '仙巌園', '仙岩园', 'sengan', 'garden', '庭園', '文化'],
      title: { ja: '鹿児島・仙巌園', en: 'Sengan-en in Kagoshima', zh: '鹿儿岛仙岩园' },
      summary: { ja: '鹿児島市内で歴史と景色を楽しむ候補。営業時間と現地までの交通は訪問前に確認。', en: 'A history and scenery stop in Kagoshima. Verify hours and local access before visiting.', zh: '鹿儿岛市内的历史景观选择；出发前核对开放时间与交通。' },
      next: { ja: '公式の営業時間を確認', en: 'Check official opening hours', zh: '核对官方开放时间' },
      sources: [{ label: 'Sengan-en · Official', url: 'https://www.senganen.jp/en/', checkedAt: '2026-10-12' }],
      affiliateRef: 'items.senganEn', map: 'https://www.google.com/maps/search/?api=1&query=Sengan-en+Kagoshima'
    }
  ];
});
