/** Product intro page — /intro/ */
window.INTRO_DATA = {
  updated: "2026-05-26",
  video: {
    src: "/assets/video/yakushima-bus-demo.mp4",
    poster: "/assets/video/yakushima-bus-demo-poster.jpg",
    type: "video/mp4",
  },
  content: {
    ja: {
      navIntro: "紹介",
      title: "Yakushima Bus とは",
      lead: "屋久島の公式バス・フェリー情報を、路边でサッと調べられる独立ツール。",
      videoTitle: "デモ動画",
      videoHintBase: "再生時間 {duration} · 英語ナレーション",
      features: [
        {
          icon: "🚌",
          title: "次の便をすぐ検索",
          body: "区間選択・次発ハイライト・日種切替。48停留所を日本語中心に検索。",
          href: "/",
        },
        {
          icon: "🗺",
          title: "路線図・運賃",
          body: "公式 PDF／モバイル画像プレビュー。区間運賃の目安も表示。",
          href: "/map/",
        },
        {
          icon: "⛴",
          title: "上島交通",
          body: "高速船・フェリー・空港バス。鹿児島↔屋久島の時刻を一覧。",
          href: "/access/",
        },
        {
          icon: "🌐",
          title: "データ出典",
          body: "公式資料・各社サイト・運行状況など、参考リンクを下に一覧。",
          href: "#sources",
        },
      ],
    },
    zh: {
      navIntro: "介绍",
      title: "产品介绍",
      lead: "面向屋久岛旅客的独立公交查询：路边查下一班、看运价与上岛船班。",
      videoTitle: "产品演示",
      videoHintBase: "时长 {duration} · 英文旁白",
      features: [
        {
          icon: "🚌",
          title: "下一班查询",
          body: "选区间、高亮最近一班、按工作日/周末筛选；站名以日文为主、中英对照。",
          href: "/",
        },
        {
          icon: "🗺",
          title: "路线图与运价",
          body: "官方 PDF / 手机高清图预览；区间票价参考与乘车券说明。",
          href: "/map/",
        },
        {
          icon: "⛴",
          title: "上岛交通",
          body: "鹿儿岛↔屋久岛 高速船、渡轮、机场巴士时刻一览。",
          href: "/access/",
        },
        {
          icon: "🌐",
          title: "数据来源",
          body: "官方资料、船班、运行状况等参考链接，见下方完整列表。",
          href: "#sources",
        },
      ],
    },
    en: {
      navIntro: "Intro",
      title: "Product tour",
      lead:
        "An independent tool for Yakushima bus timetables, fares, and ferry access—built for travelers on the island.",
      videoTitle: "Demo video",
      videoHintBase: "Length {duration} · English narration",
      features: [
        {
          icon: "🚌",
          title: "Next bus search",
          body: "Route picker, next-departure highlight, weekday/weekend tabs, 48 stops with JA-first names.",
          href: "/",
        },
        {
          icon: "🗺",
          title: "Routes & fares",
          body: "Official PDFs and mobile-friendly map previews; section fare estimates.",
          href: "/map/",
        },
        {
          icon: "⛴",
          title: "Island access",
          body: "Jetfoil, ferry, and airport bus times between Kagoshima and Yakushima.",
          href: "/access/",
        },
        {
          icon: "🌐",
          title: "Data sources",
          body: "Official timetables, ferry operators, and status links — full list below.",
          href: "#sources",
        },
      ],
    },
  },
};
