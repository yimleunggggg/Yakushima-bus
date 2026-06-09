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
