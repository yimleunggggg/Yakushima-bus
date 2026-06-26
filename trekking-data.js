/** 登山コース参考 — 出典: 屋久島観光協会 https://yakukan.jp/trekking/ */
window.TREKKING_DATA = {
  updated: "2026-05-29",
  sourceUrl: "https://yakukan.jp/trekking/",
  intro: {
    ja: "屋久島観光協会の代表的トレッキングコースを参考値として掲載。",
    zh: "摘自屋久岛观光协会代表性徒步路线，难度与用时仅供参考。",
    en: "Reference trekking courses from the Yakushima tourism association.",
  },
  seasonTitle: {
    ja: "登山シーズン",
    zh: "登山季节",
    en: "Trekking season",
  },
  seasonLead: {
    ja: "春〜秋がベスト。梅雨は雨量多め。12〜2月の山岳は積雪で危険 — 初心者は避けてください。",
    zh: "春秋最佳；梅雨降雨多。12–2 月山区有积雪，新手勿入。",
    en: "Spring–autumn is best; rainy season is wet. Dec–Feb snow in the mountains — not for beginners.",
  },
  seasons: [
    {
      title: { ja: "春", zh: "春", en: "Spring" },
      items: [
        { ja: "太鼓岩からの山桜", zh: "太鼓岩一带山樱", en: "Cherry blossoms near Taiko-iwa" },
        { ja: "ヤクシマシャクナゲなど固有種", zh: "屋久杜鹃等特有植物", en: "Endemic rhododendron & violets" },
      ],
    },
    {
      title: { ja: "夏", zh: "夏", en: "Summer" },
      items: [
        { ja: "梅雨（5月下旬〜7月中旬）", zh: "梅雨（5 月下旬–7 月中旬）", en: "Rainy season (late May–mid Jul)" },
        { ja: "高海拔林带凉爽", zh: "高海拔林带较凉爽", en: "Cooler forest belts at altitude" },
      ],
    },
    {
      title: { ja: "秋", zh: "秋", en: "Autumn" },
      items: [
        { ja: "高山植物（イッスンキンカ等）", zh: "高山植物", en: "Alpine plants" },
        { ja: "绿与红叶对比", zh: "绿意与红叶", en: "Green vs autumn foliage" },
      ],
    },
    {
      title: { ja: "冬", zh: "冬", en: "Winter" },
      items: [
        { ja: "奥岳は雪山", zh: "内山积雪", en: "Inner peaks under snow" },
        { ja: "「日本の縮図」を体感", zh: "可体会「日本缩影」", en: "Microcosm of Japan’s climates" },
      ],
    },
  ],
  coursesTitle: {
    ja: "トレッキングコース",
    zh: "徒步路线推荐",
    en: "Trekking courses",
  },
  labels: {
    difficulty: { ja: "難易度", zh: "难度", en: "Difficulty" },
    fitness: { ja: "体力度", zh: "体能", en: "Fitness" },
    distance: { ja: "距離", zh: "距离", en: "Distance" },
    duration: { ja: "所要時間", zh: "用时", en: "Time" },
    elevation: { ja: "標高差", zh: "爬升", en: "Elevation" },
    yakukan: { ja: "観光協会", zh: "观光协会", en: "Tourism assoc." },
    yamap: { ja: "YAMAP", zh: "YAMAP", en: "YAMAP" },
    allTrails: { ja: "AllTrails", zh: "AllTrails", en: "AllTrails" },
    busAccess: { ja: "バス接続", zh: "公交接驳", en: "Bus access" },
    checkShuttle: { ja: "接驳查询", zh: "查接驳", en: "Bus times" },
    busTimetableNote: {
      ja: "時刻・運休は公式時刻表で確認してください。",
      zh: "班次与停运以官方时刻表为准。",
      en: "Confirm times and suspensions on the official timetable.",
    },
  },
  courses: [
    {
      id: "jomon_sugi",
      title: { ja: "縄文杉トレッキング", zh: "绳文杉徒步", en: "Jomon Sugi trek" },
      summary: {
        ja: "樹齢数千の縄文杉を目指す屋久島の定番コース。荒川登山口からトロッコ道と登山道で往復し、ウィルソン株や大王杉も見どころ。",
        zh: "目标为树龄数千年的绳文杉，屋久岛标志路线。自荒川登山口经轨道与山道往返，途经威尔逊树桩、大王杉等名木。",
        en: "Yakushima's signature trek to ancient Jomon Sugi — tram road and mountain trail from Arakawa, with Wilson Stump and Daio Sugi en route.",
      },
      difficulty: 4,
      fitness: 4,
      distance: { ja: "約22km", zh: "约 22 km", en: "~22 km" },
      duration: { ja: "9〜10時間", zh: "9–10 小时", en: "9–10 hr" },
      elevation: { ja: "610m", zh: "610 m", en: "610 m" },
      yakukanUrl: "https://yakukan.jp/feature/jomonsugi-course.html",
      yamapUrl: "https://yamap.com/model-courses/25891",
      presetRoute: { from: "miyanoura_port", to: "yakusugi_museum" },
      accessStops: [
        {
          stopId: "yakusugi_museum",
          note: {
            ja: "路線バス。ここから荒川登山バス（3–11月・別料金）",
            zh: "路线公交；在此换乘荒川登山巴士（3–11 月，另收费）",
            en: "Route bus; Arakawa shuttle from here (Mar–Nov, separate fare)",
          },
        },
        {
          stopId: "arakawa_trailhead",
          note: {
            ja: "登山口・登山バス終点",
            zh: "登山口；登山巴士终点",
            en: "Trailhead; shuttle terminus",
          },
        },
      ],
    },
    {
      id: "taikoiwa",
      title: { ja: "太鼓岩トレッキング", zh: "太鼓岩徒步", en: "Taiko-iwa trek" },
      summary: {
        ja: "白谷雲水峡の苔むす森を経て太鼓岩へ。半日4〜5時間で、屋久島を代表する絶景を楽しめるコース。",
        zh: "经白谷云水峡苔地毯森林至太鼓岩，约半天 4–5 小时，可一览屋久岛代表景致。",
        en: "Through Shiratani's mossy forest to Taiko-iwa — a half-day (~4–5 hr) classic Yakushima viewpoint.",
      },
      difficulty: 3,
      fitness: 3,
      distance: { ja: "約5.5km", zh: "约 5.5 km", en: "~5.5 km" },
      duration: { ja: "4〜5時間", zh: "4–5 小时", en: "4–5 hr" },
      elevation: { ja: "430m", zh: "430 m", en: "430 m" },
      yakukanUrl: "https://yakukan.jp/feature/taikoiwa-course.html",
      yamapUrl: "https://yamap.com/model-courses/26038",
      presetRoute: { from: "miyanoura_port", to: "shiratani" },
      accessStops: [
        {
          stopId: "kobara",
          note: {
            ja: "宮之浦方面は安房行きに乗換",
            zh: "从宫之浦方向在此换乘往安房",
            en: "Transfer here for Anbo-bound from Miyanoura side",
          },
        },
        {
          stopId: "shiratani",
          note: {
            ja: "白谷雲水峡線終点",
            zh: "白谷云水峡线终点",
            en: "Shiratani branch terminus",
          },
        },
      ],
    },
    {
      id: "tachudake",
      title: { ja: "太忠岳トレッキング", zh: "太忠岳徒步", en: "Mt. Tachu trek" },
      summary: {
        ja: "ヤクスギランドから蛇紋杉付近に入り、美しい森と急登を経て頂上の奇岩へ。晴れれば安房の眺めも。",
        zh: "从屋久杉 Land 蛇纹杉附近入山，穿越林海与急坡，顶上有奇特岩景；晴日可眺安房。",
        en: "From Yakusugiland via Jamon sugi — forest and steep climb to sculptural summit rocks; Anbo views in clear weather.",
      },
      difficulty: 3,
      fitness: 2,
      distance: { ja: "約7km", zh: "约 7 km", en: "~7 km" },
      duration: { ja: "6〜7時間", zh: "6–7 小时", en: "6–7 hr" },
      elevation: { ja: "497m", zh: "497 m", en: "497 m" },
      yakukanUrl: "https://yakukan.jp/feature/tachudake-course.html",
      allTrailsUrl: "https://www.alltrails.com/trail/japan/kagoshima--2/mount-tachu",
      presetRoute: { from: "gocho_mae", to: "kigen_sugi" },
      accessStops: [
        {
          stopId: "gocho_mae",
          note: {
            ja: "宮之浦方面は合庁前で乗換",
            zh: "从宫之浦方向在县厅前换乘",
            en: "Transfer at Govt Office from Miyanoura",
          },
        },
        {
          stopId: "yakusugiland",
          note: {
            ja: "ヤクスギランド入口付近",
            zh: "屋久杉 Land 入口附近",
            en: "Near Yakusugiland entrance",
          },
        },
      ],
    },
    {
      id: "kuromidake",
      title: { ja: "黒味岳トレッキング", zh: "黑味岳徒步", en: "Mt. Kuromi trek" },
      summary: {
        ja: "九州第6高峰（1,831m）。花之江河の湿原や奇岩、高山植物が魅力の百名山コース。",
        zh: "九州第六高峰（1,831 m），花之江河湿地、奇岩与高山植物是看点。",
        en: "Kyushu's 6th peak (1,831 m) — Hananoego marsh, rock formations and alpine flora on a famous summit route.",
      },
      difficulty: 3,
      fitness: 3,
      distance: { ja: "約9km", zh: "约 9 km", en: "~9 km" },
      duration: { ja: "6〜7時間", zh: "6–7 小时", en: "6–7 hr" },
      elevation: { ja: "466m", zh: "466 m", en: "466 m" },
      yakukanUrl: "https://yakukan.jp/feature/kuromidake-course.html",
      yamapUrl: "https://yamap.com/model-courses/20298",
      presetRoute: { from: "miyanoura_port", to: "shiratani" },
      accessStops: [
        {
          stopId: "shiratani",
          note: {
            ja: "バス可达区域；花之江河・山顶需长距离纵走",
            zh: "公交可达白谷一带；花之江河与山顶需长距离纵走",
            en: "Bus reaches Shiratani area; Hananoego & summit need long traverse",
          },
        },
      ],
    },
    {
      id: "janokuchi",
      title: { ja: "蛇之口滝トレッキング", zh: "蛇之口瀑布徒步", en: "Janokuchi Falls trek" },
      summary: {
        ja: "大岩を滑り落ちる蛇之口滝を目指す比較的易しめのコース。植生と地質の変化も楽しめる。大雨時は渡渉に注意。",
        zh: "目标为沿巨岩而下的蛇之口瀑，难度相对较低；可感受植被与地质变化，大雨时涉水需注意。",
        en: "To Janokuchi Falls down a rock face — relatively easier; enjoy vegetation and geology shifts; mind stream crossings after rain.",
      },
      difficulty: 3,
      fitness: 2,
      distance: { ja: "約7km", zh: "约 7 km", en: "~7 km" },
      duration: { ja: "3〜4時間", zh: "3–4 小时", en: "3–4 hr" },
      elevation: { ja: "410m", zh: "410 m", en: "410 m" },
      yakukanUrl: "https://yakukan.jp/feature/janokuchitaki-course.html",
      yamapUrl: "https://yamap.com/model-courses/43825",
      presetRoute: { from: "miyanoura_port", to: "onokaido" },
      accessStops: [
        {
          stopId: "onokaido",
          note: {
            ja: "尾之間付近から徒歩。西部路線は本数少",
            zh: "从尾之间附近徒步；西部班次较少",
            en: "Walk from Onoaida area; limited west-bound buses",
          },
        },
      ],
    },
    {
      id: "miyanouradake",
      title: { ja: "宮之浦岳トレッキング", zh: "宫之浦岳徒步", en: "Mt. Miyanoura trek" },
      summary: {
        ja: "日本百名山・屋久島最高峰。巨木と高山植物のルートから、頂上360°の大パノラマが待つ上級コース。",
        zh: "日本百名山、屋久岛最高峰；沿途巨杉与高山植物，山顶 360° 全景，属高难路线。",
        en: "Japan's 100 Famous Peaks — Yakushima's highest; giant cedars en route and a 360° summit panorama. Advanced.",
      },
      difficulty: 5,
      fitness: 5,
      distance: { ja: "約14km", zh: "约 14 km", en: "~14 km" },
      duration: { ja: "10〜11時間", zh: "10–11 小时", en: "10–11 hr" },
      elevation: { ja: "571m", zh: "571 m", en: "571 m" },
      yakukanUrl: "https://yakukan.jp/feature/miyanouradake-course.html",
      yamapUrl: "https://yamap.com/model-courses/1613",
      presetRoute: { from: "miyanoura_port", to: "shiratani" },
      accessStops: [
        {
          stopId: "shiratani",
          note: {
            ja: "代表登山口の一つ（縦走前提）",
            zh: "主要登山口之一（纵走行程）",
            en: "One main trailhead (multi-day traverse)",
          },
        },
        {
          stopId: "arakawa_trailhead",
          note: {
            ja: "荒川ルートからも入山可",
            zh: "亦可从荒川线入山",
            en: "Also accessible via Arakawa route",
          },
        },
      ],
    },
    {
      id: "mocchomudake",
      title: { ja: "モッチョム岳トレッキング", zh: "本富岳（モッチョム岳）徒步", en: "Mt. Mocchomu trek" },
      summary: {
        ja: "「東洋のマッターホルン」とも呼ばれる名峰。急勾配が続くハードコースだが、頂上から平野と海の絶景。",
        zh: "「东洋马特洪峰」本富岳，陡坡多、难度高；山顶可俯瞰平野与太平洋，冬季少有积雪。",
        en: "The \"Oriental Matterhorn\" — steep and demanding; plains and ocean views from the top; rarely snowbound in winter.",
      },
      difficulty: 4,
      fitness: 3,
      distance: { ja: "約5.5km", zh: "约 5.5 km", en: "~5.5 km" },
      duration: { ja: "7〜9時間", zh: "7–9 小时", en: "7–9 hr" },
      elevation: { ja: "667m", zh: "667 m", en: "667 m" },
      yakukanUrl: "https://yakukan.jp/feature/mocchomudake-course.html",
      allTrailsUrl: "https://www.alltrails.com/trail/japan/kagoshima--2/mount-mocchomu-dake",
      presetRoute: { from: "anbo_port", to: "anbo" },
      accessStops: [
        {
          stopId: "anbo_port",
          note: {
            ja: "安房港・安房方面から入山",
            zh: "从安房港/安房方向进山",
            en: "Access from Anbo port / town side",
          },
        },
      ],
    },
    {
      id: "aikodake",
      title: { ja: "愛子岳トレッキング", zh: "爱子岳徒步", en: "Mt. Aiko trek" },
      summary: {
        ja: "空港から望むピラミッド型の名峰。標高差1,000m超のハードコース、頂上はロープの岩場から絶景。",
        zh: "金字塔形名峰，从机场方向可见；爬升逾 1,000 m，顶段需攀绳岩壁，难度高。",
        en: "Pyramid peak visible from the airport — over 1,000 m gain with roped granite near the top; a hard route.",
      },
      difficulty: 4,
      fitness: 2,
      distance: { ja: "約8km", zh: "约 8 km", en: "~8 km" },
      duration: { ja: "6〜7時間", zh: "6–7 小时", en: "6–7 hr" },
      elevation: { ja: "1,058m", zh: "1,058 m", en: "1,058 m" },
      yakukanUrl: "https://yakukan.jp/feature/aikodake-course.html",
      allTrailsUrl: "https://www.alltrails.com/trail/japan/kagoshima--2/mount-aiko-trail",
      presetRoute: { from: "miyanoura_port", to: "airport" },
      accessStops: [
        {
          stopId: "airport",
          note: {
            ja: "空港近くから入山。急勾配・要装備",
            zh: "从机场附近入山；陡坡、需装备",
            en: "Trail from near airport; steep, full gear required",
          },
        },
      ],
    },
  ],
  resourcesTitle: {
    ja: "公式資料",
    zh: "官方资料",
    en: "Official resources",
  },
  resources: [
    {
      label: {
        ja: "屋久島登山マップ・コース情報",
        zh: "屋久岛登山地图·路线补充",
        en: "Yakushima trekking map & courses",
      },
      url: "https://yakukan.jp/wp-content/uploads/2025/06/20250609084458.pdf",
      note: { ja: "2025/6 更新", zh: "2025/6 更新", en: "Updated 2025-06" },
    },
    {
      label: {
        ja: "登山エチケット",
        zh: "登山礼仪",
        en: "Hiking etiquette",
      },
      url: "https://www.town.yakushima.kagoshima.jp/kanko/English/1/2391.html",
      note: { ja: "屋久島町", zh: "屋久岛町", en: "Yakushima Town" },
    },
    {
      label: {
        ja: "山のトイレ・野営トイレ",
        zh: "山上厕所设施",
        en: "Mountain restrooms & outhouses",
      },
      url: "https://www.town.yakushima.kagoshima.jp/kanko/English/1/2396.html",
      note: { ja: "屋久島町", zh: "屋久岛町", en: "Yakushima Town" },
    },
    {
      label: {
        ja: "著名な屋久杉",
        zh: "著名屋久杉",
        en: "Famous Yakusugi cedars",
      },
      url: "https://www.town.yakushima.kagoshima.jp/kanko/English/1/2390.html",
      note: { ja: "屋久島町", zh: "屋久岛町", en: "Yakushima Town" },
    },
  ],
  disclaimer: {
    ja: "難易度・所要時間は観光協会の参考値です。装備・登山届・天候は必ず公式情報で確認してください。バス時刻・運休は公式時刻表を参照 — 当サイトは交通時刻の補助であり、登山ガイドではありません。",
    zh: "难度与用时摘自观光协会，装备、登山登记与天气请以官方为准。公交班次与停运以官方时刻表为准 — 本站仅辅助查交通，非登山攻略。",
    en: "Difficulty and times are tourism-association references only. Check official sources for gear, permits, and weather. Bus times and suspensions follow the official timetable — this site helps with transport, not trekking guidance.",
  },
};
