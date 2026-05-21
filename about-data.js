/** 关于页 — 手工维护 */
const ABOUT_DATA = {
  meta: { updatedAt: "2026-05-21" },
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
      id: "why",
      title: { ja: "屋久島とこのページ", zh: "屋久岛与这一页", en: "Yakushima & this page" },
      body: {
        zh: "Gap year 第一次来日本，首站选了屋久岛。岛很美，但岛内公交真的把我整懵了：时刻表密、换乘规则不统一、同一条路多个运营商……完全迷路。所以做了这个页面，希望帮在岛上的旅人更快找到下一班车。",
        ja: "ギャップイヤーで初めて日本を訪れ、最初の目的地に屋久島を選びました。美しい島ですが、島内のバスには正直、面食らいました。時刻表は細かく、乗り換えルールはバラバラ、同じ路線に複数の運行会社があって——完全に迷子になりました。それでこのページを作りました。ここを旅する人が、次のバスをもう少し早く見つけられれば嬉しいです。",
        en: "During my gap year, I came to Japan for the first time and chose Yakushima as my first stop. Beautiful island — but the local buses genuinely threw me off. Dense timetables, inconsistent transfer rules, multiple operators on the same routes. I was completely lost. So I built this page, hoping to help fellow travelers on the island find their next bus a little faster.",
      },
    },
    {
      id: "hello",
      tone: "personal",
      title: { ja: "はじめまして", zh: "你好", en: "Hello" },
      body: {
        zh: "你好，我是 Yim Leung。\n\n独自旅行十多年了。潜水、冲浪、越野跑、马拉松、露营、徒步——只要是户外、自然、阳光下的活动，基本都喜欢。室内也行，但是优先级低一点。\n\n夏天 wild ale 和西海岸 IPA，冬天 Whisky，春秋都要。",
        ja: "Yim Leung です。\n\nひとり旅を続けて十数年。ダイビング、サーフィン、トレイルラン、マラソン、キャンプ、ハイキング——屋外で、自然の中で、太陽の下でやることなら、だいたい好きです。屋内でもいいですが、優先度は低め。\n\n夏は wild ale と west coast IPA、冬は Whisky、春と秋も。",
        en: "I'm Yim Leung.\n\nI've been traveling solo for over a decade. Diving, surfing, trail running, marathons, camping, hiking — basically anything outdoors, in nature, under the sun. Indoor activities are fine too, just lower priority.\n\nWild ales and west coast IPAs in summer, Whisky in winter — spring and fall, all of the above.",
      },
    },
    {
      id: "collab",
      tone: "personal",
      title: { ja: "その他", zh: "还有这些", en: "A bit more" },
      body: {
        zh: "运营背景出身，也开放项目合作——有想法可以聊。有时候也帮人做中国的旅行规划和行程，有需要可以找我。之后会陆续分享旅行和数字游民相关的内容（清迈、斯里兰卡、国内各地……），照片和视频会上社交媒体，欢迎来打招呼。",
        ja: "運営・オペレーション出身で、プロジェクトのコラボも歓迎しています——アイデアがあればぜひ。中国での旅行プランニングや行程づくりのお手伝いも、たまにやっています。旅と digital nomad 的な暮らし（チェンマイ、スリランカ、中国各地など）に関するコンテンツも、これから少しずつ発信していく予定です。写真や動画は SNS でも——気軽に声をかけてください。",
        en: "I come from an operations background and I'm open to collaborations — if you have any ideas, let's talk. I sometimes help people plan trips and itineraries in China; feel free to reach out if you need that. I'll be sharing travel and digital nomad content over time (Chiang Mai, Sri Lanka, various parts of China…). Photos and videos will go up on social media — come say hi.",
      },
    },
    {
      id: "contact",
      tone: "personal",
      title: { ja: "乾杯", zh: "干杯", en: "Cheers" },
      body: {
        zh: "最后——酒大概是世界上最小的游乐园。愿你在酒里找到自己的快乐。干杯！🍻",
        ja: "最後に——お酒は世界一小さな遊園地だと思っています。みなさんがお酒の中に楽しさを見つけられますように。乾杯！🍻",
        en: "Last but not least — alcohol is probably the world's smallest amusement park. Hope you find your joy in it. Cheers! 🍻",
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
