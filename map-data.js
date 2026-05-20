/** 路线图 — scripts/build_all.py 生成 */
const MAP_DATA = {
  "meta": {
    "mapPdf": "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf",
    "mapPdfEn": "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf",
    "fareRevision": "2024-03-01",
    "mapRevision": "2024-10",
    "fareSource": "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf"
  },
  "stopGroups": {
    "miyanoura": {
      "ja": "宮之浦方面",
      "zh": "宫之浦方向",
      "en": "Miyanoura area"
    },
    "airport": {
      "ja": "空港方面",
      "zh": "机场方向",
      "en": "Airport area"
    },
    "anbo": {
      "ja": "安房・自然館",
      "zh": "安房/自然馆",
      "en": "Anbo / Museum"
    },
    "east": {
      "ja": "安房以東",
      "zh": "安房以东",
      "en": "East of Anbo"
    },
    "west": {
      "ja": "西部（栗生・大川）",
      "zh": "西部（栗生/大川）",
      "en": "West (Kurio / Okawa)"
    },
    "nagata": {
      "ja": "永田方面",
      "zh": "永田方向",
      "en": "Nagata area"
    },
    "shiratani": {
      "ja": "白谷雲水峡",
      "zh": "白谷云水峡",
      "en": "Shiratani Unsuikyo"
    },
    "arakawa": {
      "ja": "荒川・紀元杉",
      "zh": "荒川/纪元杉",
      "en": "Arakawa / Kigen Sugi"
    }
  },
  "stops": {
    "nagata": {
      "no": "1",
      "ja": "永田",
      "zh": "永田",
      "en": "Nagata",
      "group": "nagata",
      "x": 40.0,
      "y": 210,
      "fareAnchor": "nagata"
    },
    "inakahama": {
      "no": "5",
      "ja": "いなか浜",
      "zh": "稻叶滨",
      "en": "Inakahama",
      "group": "nagata",
      "x": 97.3,
      "y": 290,
      "fareAnchor": "nagata"
    },
    "yoshida": {
      "no": "8",
      "ja": "吉田",
      "zh": "吉田",
      "en": "Yoshida",
      "group": "nagata",
      "x": 154.5,
      "y": 210,
      "fareAnchor": "nagata"
    },
    "hitomaru": {
      "no": "11",
      "ja": "一湊",
      "zh": "一凑",
      "en": "Isso",
      "group": "nagata",
      "x": 211.8,
      "y": 290,
      "fareAnchor": "hitomaru"
    },
    "shitoko": {
      "no": "14",
      "ja": "志戸子",
      "zh": "志户子",
      "en": "Shitoko",
      "group": "nagata",
      "x": 269.1,
      "y": 210,
      "fareAnchor": "hitomaru"
    },
    "fukagawa": {
      "no": "17",
      "ja": "深川",
      "zh": "深川",
      "en": "Fukagawa",
      "group": "nagata",
      "x": 326.4,
      "y": 290,
      "fareAnchor": "hitomaru"
    },
    "miyanoura_port": {
      "no": "20",
      "ja": "宮之浦港",
      "zh": "宫之浦港",
      "en": "Miyanoura Port",
      "group": "miyanoura",
      "x": 383.6,
      "y": 210,
      "tags": [
        "ferry",
        "tourist"
      ],
      "fareAnchor": "miyanoura_port"
    },
    "miyanoura_port_entrance": {
      "no": "21",
      "ja": "宮之浦港入口",
      "zh": "宫之浦港入口",
      "en": "Miyanoura Port Ent.",
      "group": "miyanoura",
      "x": 440.9,
      "y": 290,
      "fareAnchor": "miyanoura_port"
    },
    "miyanoura": {
      "no": "23",
      "ja": "宮之浦",
      "zh": "宫之浦",
      "en": "Miyanoura",
      "group": "miyanoura",
      "x": 498.2,
      "y": 210,
      "tags": [
        "tourist"
      ],
      "fareAnchor": "miyanoura"
    },
    "a_coop": {
      "no": "30",
      "ja": "Ａコープ前",
      "zh": "A-Coop前",
      "en": "A-Coop",
      "group": "miyanoura",
      "x": 555.5,
      "y": 290,
      "fareAnchor": "kobara"
    },
    "miyaura_elem": {
      "no": "31",
      "ja": "宮浦小前",
      "zh": "宫浦小学前",
      "en": "Miyaura Elem.",
      "group": "miyanoura",
      "x": 612.7,
      "y": 210,
      "fareAnchor": "kobara"
    },
    "koko_mae": {
      "no": "32",
      "ja": "高校前",
      "zh": "高中前",
      "en": "High School",
      "group": "miyanoura",
      "x": 670.0,
      "y": 290,
      "fareAnchor": "kobara"
    },
    "asahi": {
      "no": "34",
      "ja": "旭町",
      "zh": "旭町",
      "en": "Asahi-machi",
      "group": "miyanoura",
      "x": 727.3,
      "y": 210,
      "fareAnchor": "kobara"
    },
    "kobara": {
      "no": "25",
      "ja": "小原町",
      "zh": "小原町",
      "en": "Oharamachi",
      "group": "miyanoura",
      "x": 784.5,
      "y": 290,
      "tags": [
        "transfer"
      ],
      "fareAnchor": "kobara"
    },
    "kusugawa": {
      "no": "37",
      "ja": "楠川",
      "zh": "楠川",
      "en": "Kusugawa",
      "group": "miyanoura",
      "x": 841.8,
      "y": 210,
      "fareAnchor": "kobara"
    },
    "kunugawa": {
      "no": "41",
      "ja": "椨川",
      "zh": "椨川",
      "en": "Kunugawa",
      "group": "miyanoura",
      "x": 899.1,
      "y": 290,
      "fareAnchor": "kobara"
    },
    "kozeta": {
      "no": "44",
      "ja": "小瀬田",
      "zh": "小濑田",
      "en": "Koseda",
      "group": "airport",
      "x": 956.4,
      "y": 210,
      "fareAnchor": "airport"
    },
    "shionomichi": {
      "no": "48",
      "ja": "塩ノ道",
      "zh": "盐之道",
      "en": "Shionomichi",
      "group": "airport",
      "x": 1013.6,
      "y": 290,
      "fareAnchor": "airport"
    },
    "airport": {
      "no": "49",
      "ja": "空港",
      "zh": "机场",
      "en": "Airport",
      "group": "airport",
      "x": 1070.9,
      "y": 210,
      "tags": [
        "airport",
        "tourist"
      ],
      "fareAnchor": "airport"
    },
    "hayasaki": {
      "no": "52",
      "ja": "早崎",
      "zh": "早崎",
      "en": "Hayasaki",
      "group": "airport",
      "x": 1128.2,
      "y": 290,
      "fareAnchor": "airport"
    },
    "takamibashi": {
      "no": "53",
      "ja": "高見橋",
      "zh": "高见桥",
      "en": "Takamibashi",
      "group": "airport",
      "x": 1185.5,
      "y": 210,
      "fareAnchor": "airport"
    },
    "towaho": {
      "no": "56",
      "ja": "永久保",
      "zh": "永久保",
      "en": "Towaho",
      "group": "airport",
      "x": 1242.7,
      "y": 290,
      "fareAnchor": "airport"
    },
    "funayuki": {
      "no": "59",
      "ja": "船行",
      "zh": "船行",
      "en": "Funayuki",
      "group": "anbo",
      "x": 1300.0,
      "y": 210,
      "fareAnchor": "gocho_mae"
    },
    "chuo": {
      "no": "61",
      "ja": "中央",
      "zh": "中央",
      "en": "Chuo",
      "group": "anbo",
      "x": 1357.3,
      "y": 290,
      "fareAnchor": "gocho_mae"
    },
    "gocho_mae": {
      "no": "62",
      "ja": "合庁前",
      "zh": "县厅前",
      "en": "Govt Office",
      "group": "anbo",
      "x": 1414.5,
      "y": 210,
      "tags": [
        "transfer"
      ],
      "fareAnchor": "gocho_mae"
    },
    "police_mae": {
      "no": "63",
      "ja": "警察署前",
      "zh": "警察署前",
      "en": "Police Sta.",
      "group": "anbo",
      "x": 1471.8,
      "y": 290,
      "fareAnchor": "gocho_mae"
    },
    "anbo_port": {
      "no": "64",
      "ja": "安房港",
      "zh": "安房港",
      "en": "Anbo Port",
      "group": "anbo",
      "x": 1529.1,
      "y": 210,
      "tags": [
        "ferry",
        "tourist"
      ],
      "fareAnchor": "anbo_port"
    },
    "naka_iin_mae": {
      "no": "65",
      "ja": "仲医院前",
      "zh": "仲医院前",
      "en": "Naka Clinic",
      "group": "anbo",
      "x": 1586.4,
      "y": 290,
      "fareAnchor": "anbo"
    },
    "anbo": {
      "no": "66",
      "ja": "安房",
      "zh": "安房",
      "en": "Anbo",
      "group": "anbo",
      "x": 1643.6,
      "y": 210,
      "tags": [
        "tourist"
      ],
      "fareAnchor": "anbo"
    },
    "makino": {
      "no": "67",
      "ja": "牧野",
      "zh": "牧野",
      "en": "Makino",
      "group": "anbo",
      "x": 1700.9,
      "y": 290,
      "fareAnchor": "anbo"
    },
    "yakusugi_museum": {
      "no": "68",
      "ja": "屋久杉自然館",
      "zh": "屋久杉自然馆",
      "en": "Yakusugi Museum",
      "group": "anbo",
      "x": 1758.2,
      "y": 210,
      "tags": [
        "tourist",
        "transfer"
      ],
      "fareAnchor": "yakusugi_museum"
    },
    "morihisa_jinja": {
      "no": "73",
      "ja": "盛久神社",
      "zh": "盛久神社",
      "en": "Morihisa Shrine",
      "group": "east",
      "x": 1815.5,
      "y": 290,
      "fareAnchor": "botanical_park"
    },
    "hirano": {
      "no": "78",
      "ja": "平野",
      "zh": "平野",
      "en": "Hirano",
      "group": "east",
      "x": 1872.7,
      "y": 210,
      "fareAnchor": "botanical_park"
    },
    "mugi": {
      "no": "85",
      "ja": "麦生",
      "zh": "麦生",
      "en": "Mugi",
      "group": "east",
      "x": 1930.0,
      "y": 290,
      "fareAnchor": "botanical_park"
    },
    "botanical_park": {
      "no": "86",
      "ja": "ボタニカルリサーチパーク",
      "zh": "植物研究公园",
      "en": "Botanical Park",
      "group": "east",
      "x": 1987.3,
      "y": 210,
      "tags": [
        "tourist"
      ],
      "fareAnchor": "botanical_park"
    },
    "hara": {
      "no": "89",
      "ja": "原",
      "zh": "原",
      "en": "Hara",
      "group": "east",
      "x": 2044.5,
      "y": 290,
      "fareAnchor": "onokaido"
    },
    "onokaido": {
      "no": "94",
      "ja": "尾之間",
      "zh": "尾之间",
      "en": "Onoaida",
      "group": "east",
      "x": 2101.8,
      "y": 210,
      "fareAnchor": "onokaido"
    },
    "saman_hotel": {
      "no": "97",
      "ja": "サマナホテルヤクシマ",
      "zh": "Samana Hotel Yakushima",
      "en": "Samana Hotel",
      "group": "east",
      "x": 2159.1,
      "y": 290,
      "tags": [
        "hotel"
      ],
      "fareAnchor": "saman_hotel"
    },
    "hotel_yakushima": {
      "no": "99",
      "ja": "ザホテルヤクシマ",
      "zh": "The Hotel Yakushima",
      "en": "The Hotel Yakushima",
      "group": "east",
      "x": 2216.4,
      "y": 210,
      "tags": [
        "hotel"
      ],
      "fareAnchor": "hotel_yakushima"
    },
    "kojima": {
      "no": "102",
      "ja": "小島",
      "zh": "小岛",
      "en": "Kojima",
      "group": "west",
      "x": 2273.6,
      "y": 290,
      "fareAnchor": "hirauchi_onsen"
    },
    "hirauchi_onsen": {
      "no": "112",
      "ja": "平内海中温泉",
      "zh": "平内海中温泉",
      "en": "Hirauchi Onsen",
      "group": "west",
      "x": 2330.9,
      "y": 210,
      "tags": [
        "tourist"
      ],
      "fareAnchor": "hirauchi_onsen"
    },
    "yunuma": {
      "no": "114",
      "ja": "湯泊",
      "zh": "汤泊",
      "en": "Yunuma",
      "group": "west",
      "x": 2388.2,
      "y": 290,
      "fareAnchor": "kurio_bashi"
    },
    "naka": {
      "no": "123",
      "ja": "中間",
      "zh": "中间",
      "en": "Naka",
      "group": "west",
      "x": 2445.5,
      "y": 210,
      "fareAnchor": "kurio_bashi"
    },
    "kurio_bashi": {
      "no": "127",
      "ja": "栗生橋",
      "zh": "栗生桥",
      "en": "Kurio Bridge",
      "group": "west",
      "x": 2502.7,
      "y": 290,
      "fareAnchor": "kurio_bashi"
    },
    "okawa_falls": {
      "no": "129",
      "ja": "大川の滝",
      "zh": "大川瀑布",
      "en": "Okawa Falls",
      "group": "west",
      "x": 2560.0,
      "y": 210,
      "tags": [
        "tourist"
      ],
      "fareAnchor": "okawa_falls"
    },
    "ushiroka_park": {
      "no": "26",
      "ja": "牛床公園",
      "zh": "牛床公园",
      "en": "Ushiroka Park",
      "group": "shiratani",
      "x": 784.5,
      "y": 345,
      "fareAnchor": "shiratani"
    },
    "shiratani": {
      "no": "29",
      "ja": "白谷雲水峡",
      "zh": "白谷云水峡",
      "en": "Shiratani Unsuikyo",
      "group": "shiratani",
      "x": 784.5,
      "y": 385,
      "fareAnchor": "shiratani",
      "tags": [
        "tourist"
      ]
    },
    "arakawa_sancho": {
      "no": "69",
      "ja": "荒川三叉路",
      "zh": "荒川三岔路",
      "en": "Arakawa Junction",
      "group": "arakawa",
      "x": 1758.2,
      "y": 265,
      "fareAnchor": "yakusugiland"
    },
    "arakawa_trailhead": {
      "no": "70",
      "ja": "荒川登山口",
      "zh": "荒川登山口",
      "en": "Arakawa Trailhead",
      "group": "arakawa",
      "x": 1758.2,
      "y": 295,
      "fareAnchor": "yakusugi_museum",
      "tags": [
        "tourist"
      ]
    },
    "yakusugiland": {
      "no": "71",
      "ja": "ヤクスギランド",
      "zh": "屋久杉Land",
      "en": "Yakusugiland",
      "group": "arakawa",
      "x": 1758.2,
      "y": 325,
      "fareAnchor": "yakusugi_museum",
      "tags": [
        "tourist"
      ]
    },
    "kigen_sugi": {
      "no": "72",
      "ja": "紀元杉",
      "zh": "纪元杉",
      "en": "Kigen Sugi",
      "group": "arakawa",
      "x": 1758.2,
      "y": 355,
      "fareAnchor": "yakusugi_museum",
      "tags": [
        "tourist"
      ]
    },
    "miyanoura_port_early": {
      "no": "19",
      "ja": "宮之浦港（早朝）",
      "zh": "宫之浦港（早班）",
      "en": "Miyanoura Port (early)",
      "group": "miyanoura",
      "x": 358.6,
      "y": 210,
      "fareAnchor": "miyanoura_port",
      "tags": [
        "ferry"
      ]
    }
  },
  "routes": [
    {
      "id": "central",
      "color": "#2d6a4f",
      "width": 4,
      "stops": [
        "nagata",
        "inakahama",
        "yoshida",
        "hitomaru",
        "shitoko",
        "fukagawa",
        "miyanoura_port",
        "miyanoura_port_entrance",
        "miyanoura",
        "a_coop",
        "miyaura_elem",
        "koko_mae",
        "asahi",
        "kobara",
        "kusugawa",
        "kunugawa",
        "kozeta",
        "shionomichi",
        "airport",
        "hayasaki",
        "takamibashi",
        "towaho",
        "funayuki",
        "chuo",
        "gocho_mae",
        "police_mae",
        "anbo_port",
        "naka_iin_mae",
        "anbo",
        "makino",
        "yakusugi_museum",
        "morihisa_jinja",
        "hirano",
        "mugi",
        "botanical_park",
        "hara",
        "onokaido",
        "saman_hotel",
        "hotel_yakushima",
        "kojima",
        "hirauchi_onsen",
        "yunuma",
        "naka",
        "kurio_bashi",
        "okawa_falls"
      ]
    },
    {
      "id": "shiratani",
      "color": "#40916c",
      "width": 2.5,
      "dash": "5 4",
      "stops": [
        "kobara",
        "ushiroka_park",
        "shiratani"
      ]
    },
    {
      "id": "arakawa",
      "color": "#bc6c25",
      "width": 2.5,
      "dash": "5 4",
      "stops": [
        "yakusugi_museum",
        "arakawa_sancho",
        "arakawa_trailhead",
        "yakusugiland",
        "kigen_sugi"
      ]
    },
    {
      "id": "airport_spur",
      "color": "#7aa88a",
      "width": 2,
      "dash": "4 3",
      "stops": [
        "kozeta",
        "shionomichi",
        "airport"
      ]
    }
  ],
  "fareStops": [
    "nagata",
    "inakahama",
    "yoshida",
    "hitomaru",
    "shitoko",
    "fukagawa",
    "miyanoura_port_early",
    "miyanoura_port",
    "miyanoura_port_entrance",
    "miyanoura",
    "kobara",
    "ushiroka_park",
    "shiratani",
    "a_coop",
    "miyaura_elem",
    "koko_mae",
    "asahi",
    "kusugawa",
    "kunugawa",
    "kozeta",
    "shionomichi",
    "airport",
    "hayasaki",
    "takamibashi",
    "towaho",
    "funayuki",
    "chuo",
    "gocho_mae",
    "police_mae",
    "anbo_port",
    "naka_iin_mae",
    "anbo",
    "makino",
    "yakusugi_museum",
    "arakawa_sancho",
    "arakawa_trailhead",
    "yakusugiland",
    "kigen_sugi",
    "morihisa_jinja",
    "hirano",
    "mugi",
    "botanical_park",
    "hara",
    "onokaido",
    "saman_hotel",
    "hotel_yakushima",
    "kojima",
    "hirauchi_onsen",
    "yunuma",
    "naka",
    "kurio_bashi",
    "okawa_falls"
  ],
  "farePairs": {
    "nagata|yakusugi_museum": 570,
    "yakusugi_museum|nagata": 570,
    "hitomaru|yakusugi_museum": 490,
    "yakusugi_museum|hitomaru": 490,
    "miyanoura|yakusugi_museum": 590,
    "yakusugi_museum|miyanoura": 590,
    "kobara|yakusugi_museum": 880,
    "yakusugi_museum|kobara": 880,
    "airport|yakusugi_museum": 1250,
    "yakusugi_museum|airport": 1250,
    "gocho_mae|yakusugi_museum": 580,
    "yakusugi_museum|gocho_mae": 580,
    "anbo_port|yakusugi_museum": 280,
    "yakusugi_museum|anbo_port": 280,
    "anbo|yakusugi_museum": 240,
    "yakusugi_museum|anbo": 240,
    "nagata|botanical_park": 270,
    "botanical_park|nagata": 270,
    "hitomaru|botanical_park": 720,
    "botanical_park|hitomaru": 720,
    "miyanoura|botanical_park": 660,
    "botanical_park|miyanoura": 660,
    "kobara|botanical_park": 750,
    "botanical_park|kobara": 750,
    "airport|botanical_park": 1030,
    "botanical_park|airport": 1030,
    "gocho_mae|botanical_park": 1400,
    "botanical_park|gocho_mae": 1400,
    "anbo_port|botanical_park": 1410,
    "botanical_park|anbo_port": 1410,
    "anbo|botanical_park": 1720,
    "botanical_park|anbo": 1720,
    "yakusugi_museum|botanical_park": 570,
    "botanical_park|yakusugi_museum": 570,
    "nagata|onokaido": 210,
    "onokaido|nagata": 210,
    "hitomaru|onokaido": 380,
    "onokaido|hitomaru": 380,
    "miyanoura|onokaido": 830,
    "onokaido|miyanoura": 830,
    "kobara|onokaido": 800,
    "onokaido|kobara": 800,
    "airport|onokaido": 860,
    "onokaido|airport": 860,
    "gocho_mae|onokaido": 1470,
    "onokaido|gocho_mae": 1470,
    "anbo_port|onokaido": 1470,
    "onokaido|anbo_port": 1470,
    "anbo|onokaido": 1490,
    "onokaido|anbo": 1490,
    "yakusugi_museum|onokaido": 490,
    "onokaido|yakusugi_museum": 490,
    "botanical_park|onokaido": 2130,
    "onokaido|botanical_park": 2130,
    "nagata|saman_hotel": 350,
    "saman_hotel|nagata": 350,
    "hitomaru|saman_hotel": 500,
    "saman_hotel|hitomaru": 500,
    "miyanoura|saman_hotel": 670,
    "saman_hotel|miyanoura": 670,
    "kobara|saman_hotel": 1020,
    "saman_hotel|kobara": 1020,
    "airport|saman_hotel": 1110,
    "saman_hotel|airport": 1110,
    "gocho_mae|saman_hotel": 1690,
    "saman_hotel|gocho_mae": 1690,
    "anbo_port|saman_hotel": 1690,
    "saman_hotel|anbo_port": 1690,
    "anbo|saman_hotel": 1710,
    "saman_hotel|anbo": 1710,
    "yakusugi_museum|saman_hotel": 590,
    "saman_hotel|yakusugi_museum": 590,
    "botanical_park|saman_hotel": 2330,
    "saman_hotel|botanical_park": 2330,
    "nagata|hotel_yakushima": 500,
    "hotel_yakushima|nagata": 500,
    "hitomaru|hotel_yakushima": 740,
    "hotel_yakushima|hitomaru": 740,
    "miyanoura|hotel_yakushima": 880,
    "hotel_yakushima|miyanoura": 880,
    "kobara|hotel_yakushima": 1030,
    "hotel_yakushima|kobara": 1030,
    "airport|hotel_yakushima": 1340,
    "hotel_yakushima|airport": 1340,
    "gocho_mae|hotel_yakushima": 1650,
    "hotel_yakushima|gocho_mae": 1650,
    "anbo_port|hotel_yakushima": 1980,
    "hotel_yakushima|anbo_port": 1980,
    "anbo|hotel_yakushima": 1980,
    "hotel_yakushima|anbo": 1980,
    "yakusugi_museum|hotel_yakushima": 880,
    "hotel_yakushima|yakusugi_museum": 880,
    "botanical_park|hotel_yakushima": 2310,
    "hotel_yakushima|botanical_park": 2310,
    "onokaido|hotel_yakushima": 2590,
    "hotel_yakushima|onokaido": 2590,
    "nagata|hirauchi_onsen": 280,
    "hirauchi_onsen|nagata": 280,
    "hitomaru|hirauchi_onsen": 630,
    "hirauchi_onsen|hitomaru": 630,
    "miyanoura|hirauchi_onsen": 870,
    "hirauchi_onsen|miyanoura": 870,
    "kobara|hirauchi_onsen": 1000,
    "hirauchi_onsen|kobara": 1000,
    "airport|hirauchi_onsen": 1140,
    "hirauchi_onsen|airport": 1140,
    "gocho_mae|hirauchi_onsen": 1510,
    "hirauchi_onsen|gocho_mae": 1510,
    "anbo_port|hirauchi_onsen": 1740,
    "hirauchi_onsen|anbo_port": 1740,
    "anbo|hirauchi_onsen": 2090,
    "hirauchi_onsen|anbo": 2090,
    "yakusugi_museum|hirauchi_onsen": 1250,
    "hirauchi_onsen|yakusugi_museum": 1250,
    "botanical_park|hirauchi_onsen": 2100,
    "hirauchi_onsen|botanical_park": 2100,
    "nagata|kurio_bashi": 280,
    "kurio_bashi|nagata": 280,
    "hitomaru|kurio_bashi": 630,
    "kurio_bashi|hitomaru": 630,
    "miyanoura|kurio_bashi": 870,
    "kurio_bashi|miyanoura": 870,
    "kobara|kurio_bashi": 1000,
    "kurio_bashi|kobara": 1000,
    "airport|kurio_bashi": 1140,
    "kurio_bashi|airport": 1140,
    "gocho_mae|kurio_bashi": 1510,
    "kurio_bashi|gocho_mae": 1510,
    "anbo_port|kurio_bashi": 1740,
    "kurio_bashi|anbo_port": 1740,
    "anbo|kurio_bashi": 2090,
    "kurio_bashi|anbo": 2090,
    "yakusugi_museum|kurio_bashi": 1250,
    "kurio_bashi|yakusugi_museum": 1250,
    "botanical_park|kurio_bashi": 2100,
    "kurio_bashi|botanical_park": 2100,
    "nagata|okawa_falls": 280,
    "okawa_falls|nagata": 280,
    "hitomaru|okawa_falls": 630,
    "okawa_falls|hitomaru": 630,
    "miyanoura|okawa_falls": 870,
    "okawa_falls|miyanoura": 870,
    "kobara|okawa_falls": 1000,
    "okawa_falls|kobara": 1000,
    "airport|okawa_falls": 1140,
    "okawa_falls|airport": 1140,
    "gocho_mae|okawa_falls": 1510,
    "okawa_falls|gocho_mae": 1510,
    "anbo_port|okawa_falls": 1740,
    "okawa_falls|anbo_port": 1740,
    "anbo|okawa_falls": 2090,
    "okawa_falls|anbo": 2090,
    "yakusugi_museum|okawa_falls": 1270,
    "okawa_falls|yakusugi_museum": 1270,
    "botanical_park|okawa_falls": 2100,
    "okawa_falls|botanical_park": 2100,
    "miyanoura_port|nagata": 530,
    "nagata|miyanoura_port": 530,
    "miyanoura_port|hitomaru": 940,
    "hitomaru|miyanoura_port": 940,
    "miyanoura_port_entrance|nagata": 530,
    "nagata|miyanoura_port_entrance": 530,
    "miyanoura_port_entrance|hitomaru": 940,
    "hitomaru|miyanoura_port_entrance": 940,
    "kobara|nagata": 500,
    "nagata|kobara": 500,
    "kobara|hitomaru": 530,
    "hitomaru|kobara": 530,
    "kobara|miyanoura": 560,
    "miyanoura|kobara": 560,
    "shiratani|miyanoura": 140,
    "miyanoura|shiratani": 140,
    "shiratani|kobara": 500,
    "kobara|shiratani": 500,
    "shiratani|miyanoura_port": 530,
    "miyanoura_port|shiratani": 530,
    "airport|miyanoura": 570,
    "miyanoura|airport": 570,
    "airport|kobara": 550,
    "kobara|airport": 550,
    "yakusugiland|gocho_mae": 620,
    "gocho_mae|yakusugiland": 620,
    "yakusugiland|anbo_port": 1140,
    "anbo_port|yakusugiland": 1140,
    "yakusugiland|anbo": 1260,
    "anbo|yakusugiland": 1260,
    "yakusugiland|yakusugi_museum": 1290,
    "yakusugi_museum|yakusugiland": 1290,
    "kigen_sugi|gocho_mae": 620,
    "gocho_mae|kigen_sugi": 620,
    "kigen_sugi|anbo_port": 1140,
    "anbo_port|kigen_sugi": 1140,
    "kigen_sugi|anbo": 1260,
    "anbo|kigen_sugi": 1260,
    "kigen_sugi|yakusugi_museum": 1290,
    "yakusugi_museum|kigen_sugi": 1290,
    "arakawa_trailhead|yakusugi_museum": 1000,
    "yakusugi_museum|arakawa_trailhead": 1000,
    "miyanoura_port|kobara": 140,
    "kobara|miyanoura_port": 140,
    "miyanoura_port|airport": 590,
    "airport|miyanoura_port": 590,
    "miyanoura_port|anbo_port": 870,
    "anbo_port|miyanoura_port": 870,
    "miyanoura_port|anbo": 870,
    "anbo|miyanoura_port": 870,
    "miyanoura_port|yakusugi_museum": 1020,
    "yakusugi_museum|miyanoura_port": 1020,
    "airport|anbo_port": 400,
    "anbo_port|airport": 400,
    "miyanoura_port|arakawa_trailhead": 1790,
    "arakawa_trailhead|miyanoura_port": 1790
  },
  "fareDisclaimer": {
    "ja": "表示運賃は種子島・屋久島交通「バス運賃表（2024年3月改定）」に基づく目安です。乗車方向・経路・改定により異なる場合があります。実際の運賃は車内整理券・運転士に従ってください。",
    "zh": "所示票价依据种子岛·屋久岛交通《巴士运价表（2024年3月改定）》估算，因乘车方向、路线或改定可能不同，请以车内整理券及司机收费为准。",
    "en": "Fares shown are estimates from the Tanegashima Yakushima Kotsu fare table (Mar 2024). Actual fares may differ by direction, route, or revision—follow the numbered ticket and driver on board."
  },
  "fareNotes": {
    "payment": {
      "ja": "運賃は後払い。乗車時に整理券を取ってください。",
      "zh": "下车付车费，上车取整理券。",
      "en": "Pay when alighting. Take a numbered ticket on boarding."
    },
    "change": {
      "ja": "2千円・5千円・1万円札は車内で両替できません。",
      "zh": "车内无法找零大额纸币。",
      "en": "No change for large notes on board."
    },
    "child": {
      "ja": "小児（小学生）・障害者手帳所持者は半額。",
      "zh": "小学生及持残疾手册者半价。",
      "en": "Half fare for children & disability pass holders."
    },
    "infant": {
      "ja": "幼児（1歳以上6歳未満）は同伴者1人につき1人無賃。",
      "zh": "1–6岁幼儿每位陪同者可免费带1名。",
      "en": "One infant (1–6) free per paying adult."
    },
    "shirataniTransfer": {
      "ja": "白谷雲水峡（安房方面）は小原町で乗換",
      "zh": "往白谷（从安房方向）需在小原町换乘",
      "en": "To Shiratani from Anbo: transfer at Kobara"
    },
    "yakusugiTransfer": {
      "ja": "ヤクスギランド（宮之浦方面）は合庁前で乗換",
      "zh": "往屋久杉Land需在县厅前换乘",
      "en": "To Yakusugiland: transfer at Govt Office"
    },
    "arakawaTransfer": {
      "ja": "荒川登山バスは自然館で乗換（3～11月）",
      "zh": "荒川登山巴士在自然馆换乘（3–11月）",
      "en": "Arakawa bus: transfer at museum (Mar–Nov)"
    }
  },
  "passOffices": [
    {
      "ja": "宮之浦港（高速船窓口）",
      "zh": "宫之浦港（高速船窗口）",
      "en": "Miyanoura Port ferry counter",
      "stop": "miyanoura_port",
      "mapQuery": "宮之浦港 高速船 屋久島"
    },
    {
      "ja": "屋久島観光センター",
      "zh": "屋久岛观光中心",
      "en": "Tourism Center",
      "stop": "miyanoura",
      "mapQuery": "屋久島観光協会 宮之浦"
    },
    {
      "ja": "安房港（高速船窓口）",
      "zh": "安房港（高速船窗口）",
      "en": "Anbo Port ferry counter",
      "stop": "anbo_port",
      "mapQuery": "安房港 高速船 屋久島"
    },
    {
      "ja": "屋久島空港",
      "zh": "屋久岛机场",
      "en": "Airport",
      "stop": "airport",
      "mapQuery": "屋久島空港"
    },
    {
      "ja": "いわさきホテル",
      "zh": "Iwasaki Hotel",
      "en": "Iwasaki Hotel",
      "stop": "hotel_yakushima",
      "mapQuery": "いわさきホテル 屋久島"
    }
  ],
  "tagLabels": {
    "ferry": {
      "ja": "フェリー",
      "zh": "渡轮",
      "en": "Ferry"
    },
    "airport": {
      "ja": "空港",
      "zh": "机场",
      "en": "Airport"
    },
    "transfer": {
      "ja": "乗換",
      "zh": "换乘",
      "en": "Transfer"
    },
    "tourist": {
      "ja": "観光",
      "zh": "观光",
      "en": "Sightseeing"
    },
    "pass": {
      "ja": "乗車券",
      "zh": "乘车券",
      "en": "Pass sales"
    },
    "hotel": {
      "ja": "ホテル",
      "zh": "酒店",
      "en": "Hotel"
    }
  }
};
