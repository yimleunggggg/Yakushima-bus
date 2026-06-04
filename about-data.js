/** 关于页 — 手工维护 */
const ABOUT_DATA = {
  meta: { updatedAt: "2026-05-26" },
  lead: {
    zh: "Gap year 第一次来日本，首站选了屋久岛。岛很美，但岛内公交真的把我整懵了：时刻表密、换乘规则不统一、同一条路多个运营商……完全迷路。所以做了这个页面，希望帮在岛上的旅人更快找到下一班车。",
    ja: "ギャップイヤーで初めて日本を訪れ、最初の目的地に屋久島を選びました。美しい島ですが、島内のバスには正直、面食らいました。時刻表は細かく、乗り換えルールはバラバラ、同じ路線に複数の運行会社があって——完全に迷子になりました。それでこのページを作りました。ここを旅する人が、次のバスをもう少し早く見つけられれば嬉しいです。",
    en: "During my gap year, I came to Japan for the first time and chose Yakushima as my first stop. Beautiful island — but the local buses genuinely threw me off. Dense timetables, inconsistent transfer rules, multiple operators on the same routes. I was completely lost. So I built this page, hoping to help fellow travelers on the island find their next bus a little faster.",
  },
  sections: [
    {
      id: "trust",
      tone: "trust",
      title: { ja: "このサイトについて", zh: "本站说明", en: "What this site is" },
      showContact: true,
      body: {
        zh: "YakuBus（yakushimabus.com）是独立的屋久岛公交查询工具，帮助在岛旅客查下一班车、路线与运价。数据整理自屋久岛观光协会等官方 PDF，本站非巴士公司或观光协会运营。\n\n更新频率：随官方 PDF 更新而同步；页脚日期为最近一次数据核对。\n\n仅供参考，请以站牌与官方最新公告为准。发现错误或有好建议，欢迎邮件联系。",
        ja: "YakuBus（yakushimabus.com）は、島内の旅人向けに次のバス・路線・運賃を調べる独立ツールです。データは屋久島観光協会などの公式 PDF をもとに整理しています。バス会社・観光協会の公式サイトではありません。\n\n更新：公式 PDF の更新に合わせて同期。フッターの日付は最終確認日です。\n\n参考情報です。バス停掲示と公式の最新情報を優先してください。誤りやご提案はメールでどうぞ。",
        en: "YakuBus (yakushimabus.com) is an independent tool to find the next bus, routes, and fares on Yakushima. Data is compiled from official PDFs (e.g. the tourism association). This is not run by the bus operators or the tourism board.\n\nUpdates: synced when official PDFs change; the footer date is the last data check.\n\nReference only — confirm at the bus stop and official notices. Email me if you spot errors or have suggestions.",
      },
    },
    {
      id: "sources",
      title: {
        ja: "データ出典・参考リンク",
        zh: "数据来源与参考链接",
        en: "Data sources & references",
      },
      intro: {
        ja: "本サイトの時刻・運賃・上島情報は、次の公式資料・各社サイトを参照しています（2026年5月時点）。最新情報は必ず各リンク先でご確認ください。",
        zh: "本站时刻、运价与上岛信息均参考下列官方 PDF 与各运营商页面（截至 2026 年 5 月）。出行前请以链接中的最新公告为准。",
        en: "Timetables, fares, and access info on this site are compiled from the official sources below (as of May 2026). Always confirm the latest schedules on each operator’s site before you travel.",
      },
      sourceGroups: [
        {
          title: { ja: "バス時刻表", zh: "公交时刻表", en: "Bus timetables" },
          items: [
            {
              label: {
                ja: "種子島・屋久島交通 時刻表 PDF（日本語）",
                zh: "种子岛·屋久岛交通 时刻表 PDF（日文）",
                en: "Tanegashima Yakushima Kotsu timetable PDF (Japanese)",
              },
              url: "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301.pdf",
              note: { ja: "2026/3/1 改定", zh: "2026/3/1 改订", en: "Revised 2026-03-01" },
            },
            {
              label: {
                ja: "種子島・屋久島交通 時刻表 PDF（英語）",
                zh: "种子岛·屋久岛交通 时刻表 PDF（英文）",
                en: "Tanegashima Yakushima Kotsu timetable PDF (English)",
              },
              url: "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301-en.pdf",
              note: { ja: "2026/3/1 改定", zh: "2026/3/1 改订", en: "Revised 2026-03-01" },
            },
            {
              label: {
                ja: "まつばんだ交通 時刻表 PDF",
                zh: "松ばんだ交通 时刻表 PDF",
                en: "Matsubanda Kotsu timetable PDF",
              },
              url: "https://yakukan.jp/wp-content/uploads/2026/03/matsubanda-timetable-20260301.pdf",
              note: { ja: "2026/3/1 改定", zh: "2026/3/1 改订", en: "Revised 2026-03-01" },
            },
          ],
        },
        {
          title: { ja: "路線図・運賃", zh: "路线图与运价", en: "Route maps & fares" },
          items: [
            {
              label: {
                ja: "屋久島バス路線図・運賃表 PDF（日本語）",
                zh: "屋久岛公交路线图·运价表 PDF（日文）",
                en: "Yakushima bus route map & fares PDF (Japanese)",
              },
              url: "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf",
              note: { ja: "2024/3 運賃改定", zh: "2024/3 运价改订", en: "Fares revised 2024-03" },
            },
            {
              label: {
                ja: "屋久島バス路線図・運賃表 PDF（英語）",
                zh: "屋久岛公交路线图·运价表 PDF（英文）",
                en: "Yakushima bus route map & fares PDF (English)",
              },
              url: "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf",
              note: { ja: "2024/3 運賃改定", zh: "2024/3 运价改订", en: "Fares revised 2024-03" },
            },
          ],
        },
        {
          title: { ja: "上島交通（鹿児島↔屋久島）", zh: "上岛交通（鹿儿岛↔屋久岛）", en: "Kagoshima ↔ Yakushima access" },
          items: [
            {
              label: {
                ja: "種子屋久高速船（トッピー・ロケット）— 時刻・運賃",
                zh: "种子屋久高速船（Toppy / Rocket）— 时刻与运价",
                en: "TaneYaku Jetfoil (Toppy / Rocket) — times & fares",
              },
              url: "https://www.tykousoku.jp/fare_time/",
            },
            {
              label: {
                ja: "高速船 オンライン予約",
                zh: "高速船 在线预约",
                en: "Jetfoil online booking",
              },
              url: "https://www.tykousoku.jp/reserve/",
            },
            {
              label: {
                ja: "フェリー屋久島2（折田汽船）— 時刻表",
                zh: "屋久岛2号渡轮（折田汽船）— 时刻表",
                en: "Ferry Yakushima 2 (Orita) — timetable",
              },
              url: "https://ferryyakusima2.com/timetable",
            },
            {
              label: {
                ja: "南国交通 鹿児島空港連絡バス",
                zh: "南国交通 鹿儿岛机场联络巴士",
                en: "Nangoku Kotsu Kagoshima airport shuttle",
              },
              url: "https://nangoku-kotsu.com/ashuttle/kagoshima/",
            },
          ],
        },
        {
          title: { ja: "乗車券・パス", zh: "乘车券与通票", en: "Passes & tickets" },
          items: [
            {
              label: {
                ja: "屋久島ゆったり満喫乗車券（観光協会）",
                zh: "屋久岛悠享乘车券（观光协会）",
                en: "Yakushima day pass (tourism association)",
              },
              url: "https://yakushima.co.jp/yuttari/",
            },
            {
              label: {
                ja: "屋久島ゆったり満喫乗車券 — 発売・路線（岩崎自動車）",
                zh: "悠享乘车券 — 发售与适用线路（岩崎自动车）",
                en: "Day pass — sales & routes (Iwasaki)",
              },
              url: "https://www.iwasaki-corp.com/kagoshima_kotsu/route-bus/yakushima-free-pass/",
            },
          ],
        },
        {
          title: { ja: "運行状況・登山バス", zh: "运行状况与登山巴士", en: "Service status & trail buses" },
          items: [
            {
              label: {
                ja: "屋久島内路線バス 当日運行状況",
                zh: "屋久岛内公交线路 当日运行状况",
                en: "Yakushima route buses — today’s service",
              },
              url: "https://yakushima.co.jp/route_bus/",
            },
            {
              label: {
                ja: "荒川登山バス運行状況（公式 X @yakusansharyou）",
                zh: "荒川登山巴士运行状况（官方 X @yakusansharyou）",
                en: "Arakawa trail bus status (official X @yakusansharyou)",
              },
              url: "https://x.com/yakusansharyou",
              note: { ja: "3～11月", zh: "3–11 月", en: "Mar–Nov" },
            },
            {
              label: {
                ja: "屋久島登山協会（荒川登山バス等）",
                zh: "屋久岛登山协会（荒川登山巴士等）",
                en: "Yakushima mountaineering association (Arakawa bus)",
              },
              url: "http://yakushima-tozan.com/",
            },
          ],
        },
        {
          title: { ja: "屋久島観光協会", zh: "屋久岛观光协会", en: "Yakushima tourism association" },
          items: [
            {
              label: {
                ja: "交通・時刻表一覧ページ",
                zh: "交通与时刻表索引页",
                en: "Transport & timetable index",
              },
              url: "https://yakukan.jp/trans/",
            },
            {
              label: {
                ja: "屋久島観光協会 公式サイト",
                zh: "屋久岛观光协会 官网",
                en: "Yakushima tourism association — home",
              },
              url: "https://yakukan.jp/about/",
            },
          ],
        },
        {
          title: { ja: "バス会社（電話）", zh: "公交公司（电话）", en: "Bus operators (phone)" },
          items: [
            {
              label: {
                ja: "種子島・屋久島交通",
                zh: "种子岛·屋久岛交通",
                en: "Tanegashima Yakushima Kotsu",
              },
              url: "tel:0997-46-2221",
              note: { ja: "0997-46-2221", zh: "0997-46-2221", en: "0997-46-2221" },
            },
            {
              label: {
                ja: "まつばんだ交通",
                zh: "松ばんだ交通",
                en: "Matsubanda Kotsu",
              },
              url: "tel:0997-43-5000",
              note: { ja: "0997-43-5000", zh: "0997-43-5000", en: "0997-43-5000" },
            },
          ],
        },
      ],
    },
  ],
  contact: {
    email: "yimleung.ly@gmail.com",
    instagram: "https://www.instagram.com/yiiimleung/",
    instagramLabel: {
      ja: "Instagram @yiiimleung",
      zh: "Instagram @yiiimleung",
      en: "Instagram @yiiimleung",
    },
  },
};
