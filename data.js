/** 屋久岛公交 — scripts/build_all.py 生成 */
const BUS_DATA = {
  "meta": {
    "version": "2026-03-01",
    "validFrom": "2026-03-01",
    "validTo": "2026-11-30",
    "updatedAt": "2026-05-20",
    "sources": {
      "taneyaku": "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301.pdf",
      "taneyakuEn": "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301-en.pdf",
      "matsubanda": "https://yakukan.jp/wp-content/uploads/2026/03/matsubanda-timetable-20260301.pdf",
      "fare": "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf",
      "fareEn": "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf",
      "notice": "https://yakukan.jp/trans/",
      "serviceStatus": "https://yakushima.co.jp/route_bus/",
      "arakawaX": "https://x.com/yakusansharyou",
      "pass": "https://yakushima.co.jp/yuttari/"
    },
    "phone": {
      "taneyaku": "0997-46-2221",
      "matsubanda": "0997-43-5000"
    }
  },
  "operators": {
    "taneyaku": {
      "ja": "種子島・屋久島交通",
      "zh": "种子岛·屋久岛交通",
      "en": "Tanegashima Yakushima Kotsu",
      "short": {
        "ja": "種屋交通",
        "zh": "种屋交通",
        "en": "Taneyaku"
      },
      "color": "#2d6a4f",
      "acceptsPass": true,
      "acceptsIc": true,
      "paymentTags": [
        {
          "positive": true,
          "ja": "満喫券可",
          "zh": "可用乘车券",
          "en": "Day pass OK"
        },
        {
          "positive": true,
          "ja": "IC可",
          "zh": "可用IC",
          "en": "IC OK"
        }
      ]
    },
    "matsubanda": {
      "ja": "まつばんだ交通",
      "zh": "松叶交通",
      "en": "Matsubanda Kotsu",
      "short": {
        "ja": "まつばんだ",
        "zh": "松叶",
        "en": "Matsubanda"
      },
      "color": "#5c4d7a",
      "acceptsPass": false,
      "acceptsIc": false,
      "paymentTags": [
        {
          "positive": false,
          "ja": "満喫券不可",
          "zh": "不可用乘车券",
          "en": "No day pass"
        },
        {
          "positive": false,
          "ja": "現金のみ",
          "zh": "仅现金",
          "en": "Cash only"
        }
      ]
    }
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
      "group": "nagata"
    },
    "inakahama": {
      "no": "5",
      "ja": "いなか浜",
      "zh": "稻叶滨",
      "en": "Inakahama",
      "group": "nagata"
    },
    "yoshida": {
      "no": "8",
      "ja": "吉田",
      "zh": "吉田",
      "en": "Yoshida",
      "group": "nagata"
    },
    "hitomaru": {
      "no": "11",
      "ja": "一湊",
      "zh": "一凑",
      "en": "Isso",
      "group": "nagata"
    },
    "shitoko": {
      "no": "14",
      "ja": "志戸子",
      "zh": "志户子",
      "en": "Shitoko",
      "group": "nagata"
    },
    "fukagawa": {
      "no": "17",
      "ja": "深川",
      "zh": "深川",
      "en": "Fukagawa",
      "group": "nagata"
    },
    "miyanoura_port_early": {
      "no": "19",
      "ja": "宮之浦港（早朝）",
      "zh": "宫之浦港（早班）",
      "en": "Miyanoura Port (early)",
      "group": "miyanoura",
      "tags": [
        "ferry"
      ]
    },
    "miyanoura_port": {
      "no": "20",
      "ja": "宮之浦港",
      "zh": "宫之浦港",
      "en": "Miyanoura Port",
      "group": "miyanoura",
      "tags": [
        "ferry",
        "tourist"
      ]
    },
    "miyanoura_port_entrance": {
      "no": "21",
      "ja": "宮之浦港入口",
      "zh": "宫之浦港入口",
      "en": "Miyanoura Port Ent.",
      "group": "miyanoura"
    },
    "miyanoura": {
      "no": "23",
      "ja": "宮之浦",
      "zh": "宫之浦",
      "en": "Miyanoura",
      "group": "miyanoura",
      "tags": [
        "tourist"
      ]
    },
    "kobara": {
      "no": "25",
      "ja": "小原町",
      "zh": "小原町",
      "en": "Oharamachi",
      "group": "miyanoura",
      "tags": [
        "transfer"
      ]
    },
    "ushiroka_park": {
      "no": "26",
      "ja": "牛床公園",
      "zh": "牛床公园",
      "en": "Ushiroka Park",
      "group": "shiratani"
    },
    "shiratani": {
      "no": "29",
      "ja": "白谷雲水峡",
      "zh": "白谷云水峡",
      "en": "Shiratani Unsuikyo",
      "group": "shiratani",
      "tags": [
        "tourist"
      ]
    },
    "a_coop": {
      "no": "30",
      "ja": "Ａコープ前",
      "zh": "A-Coop前",
      "en": "A-Coop",
      "group": "miyanoura"
    },
    "miyaura_elem": {
      "no": "31",
      "ja": "宮浦小前",
      "zh": "宫浦小学前",
      "en": "Miyaura Elem.",
      "group": "miyanoura"
    },
    "koko_mae": {
      "no": "32",
      "ja": "高校前",
      "zh": "高中前",
      "en": "High School",
      "group": "miyanoura",
      "matsubandaOnly": true
    },
    "asahi": {
      "no": "34",
      "ja": "旭町",
      "zh": "旭町",
      "en": "Asahi-machi",
      "group": "miyanoura"
    },
    "kusugawa": {
      "no": "37",
      "ja": "楠川",
      "zh": "楠川",
      "en": "Kusugawa",
      "group": "miyanoura"
    },
    "kunugawa": {
      "no": "41",
      "ja": "椨川",
      "zh": "椨川",
      "en": "Kunugawa",
      "group": "miyanoura"
    },
    "kozeta": {
      "no": "44",
      "ja": "小瀬田",
      "zh": "小濑田",
      "en": "Koseda",
      "group": "airport"
    },
    "shionomichi": {
      "no": "48",
      "ja": "塩ノ道",
      "zh": "盐之道",
      "en": "Shionomichi",
      "group": "airport"
    },
    "airport": {
      "no": "49",
      "ja": "空港",
      "zh": "机场",
      "en": "Airport",
      "group": "airport",
      "tags": [
        "airport",
        "tourist"
      ]
    },
    "hayasaki": {
      "no": "52",
      "ja": "早崎",
      "zh": "早崎",
      "en": "Hayasaki",
      "group": "airport"
    },
    "takamibashi": {
      "no": "53",
      "ja": "高見橋",
      "zh": "高见桥",
      "en": "Takamibashi",
      "group": "airport",
      "matsubandaOnly": true
    },
    "towaho": {
      "no": "56",
      "ja": "永久保",
      "zh": "永久保",
      "en": "Towaho",
      "group": "airport"
    },
    "funayuki": {
      "no": "59",
      "ja": "船行",
      "zh": "船行",
      "en": "Funayuki",
      "group": "anbo"
    },
    "chuo": {
      "no": "61",
      "ja": "中央",
      "zh": "中央",
      "en": "Chuo",
      "group": "anbo",
      "matsubandaOnly": true
    },
    "gocho_mae": {
      "no": "62",
      "ja": "合庁前",
      "zh": "县厅前",
      "en": "Govt Office",
      "group": "anbo",
      "tags": [
        "transfer"
      ]
    },
    "police_mae": {
      "no": "63",
      "ja": "警察署前",
      "zh": "警察署前",
      "en": "Police Sta.",
      "group": "anbo"
    },
    "anbo_port": {
      "no": "64",
      "ja": "安房港",
      "zh": "安房港",
      "en": "Anbo Port",
      "group": "anbo",
      "tags": [
        "ferry",
        "tourist"
      ]
    },
    "naka_iin_mae": {
      "no": "65",
      "ja": "仲医院前",
      "zh": "仲医院前",
      "en": "Naka Clinic",
      "group": "anbo",
      "matsubandaOnly": true
    },
    "anbo": {
      "no": "66",
      "ja": "安房",
      "zh": "安房",
      "en": "Anbo",
      "group": "anbo",
      "tags": [
        "tourist"
      ]
    },
    "makino": {
      "no": "67",
      "ja": "牧野",
      "zh": "牧野",
      "en": "Makino",
      "group": "anbo"
    },
    "yakusugi_museum": {
      "no": "68",
      "ja": "屋久杉自然館",
      "zh": "屋久杉自然馆",
      "en": "Yakusugi Museum",
      "group": "anbo",
      "tags": [
        "tourist",
        "transfer"
      ]
    },
    "arakawa_sancho": {
      "no": "69",
      "ja": "荒川三叉路",
      "zh": "荒川三岔路",
      "en": "Arakawa Junction",
      "group": "arakawa"
    },
    "arakawa_trailhead": {
      "no": "70",
      "ja": "荒川登山口",
      "zh": "荒川登山口",
      "en": "Arakawa Trailhead",
      "group": "arakawa",
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
      "tags": [
        "tourist"
      ]
    },
    "morihisa_jinja": {
      "no": "73",
      "ja": "盛久神社",
      "zh": "盛久神社",
      "en": "Morihisa Shrine",
      "group": "east"
    },
    "hirano": {
      "no": "78",
      "ja": "平野",
      "zh": "平野",
      "en": "Hirano",
      "group": "east"
    },
    "mugi": {
      "no": "85",
      "ja": "麦生",
      "zh": "麦生",
      "en": "Mugi",
      "group": "east"
    },
    "botanical_park": {
      "no": "86",
      "ja": "ボタニカルリサーチパーク",
      "zh": "植物研究公园",
      "en": "Botanical Park",
      "group": "east",
      "tags": [
        "tourist"
      ]
    },
    "hara": {
      "no": "89",
      "ja": "原",
      "zh": "原",
      "en": "Hara",
      "group": "east"
    },
    "onokaido": {
      "no": "94",
      "ja": "尾之間",
      "zh": "尾之间",
      "en": "Onoaida",
      "group": "east"
    },
    "saman_hotel": {
      "no": "97",
      "ja": "サマナホテルヤクシマ",
      "zh": "Samana Hotel Yakushima",
      "en": "Samana Hotel",
      "group": "east",
      "tags": [
        "hotel"
      ]
    },
    "hotel_yakushima": {
      "no": "99",
      "ja": "ザホテルヤクシマ",
      "zh": "The Hotel Yakushima",
      "en": "The Hotel Yakushima",
      "group": "east",
      "tags": [
        "hotel"
      ]
    },
    "kojima": {
      "no": "102",
      "ja": "小島",
      "zh": "小岛",
      "en": "Kojima",
      "group": "west"
    },
    "hirauchi_onsen": {
      "no": "112",
      "ja": "平内海中温泉",
      "zh": "平内海中温泉",
      "en": "Hirauchi Onsen",
      "group": "west",
      "tags": [
        "tourist"
      ]
    },
    "yunuma": {
      "no": "114",
      "ja": "湯泊",
      "zh": "汤泊",
      "en": "Yunuma",
      "group": "west"
    },
    "naka": {
      "no": "123",
      "ja": "中間",
      "zh": "中间",
      "en": "Naka",
      "group": "west"
    },
    "kurio_bashi": {
      "no": "127",
      "ja": "栗生橋",
      "zh": "栗生桥",
      "en": "Kurio Bridge",
      "group": "west"
    },
    "okawa_falls": {
      "no": "129",
      "ja": "大川の滝",
      "zh": "大川瀑布",
      "en": "Okawa Falls",
      "group": "west",
      "tags": [
        "tourist"
      ]
    }
  },
  "info": {
    "payment": {
      "ja": "運賃は後払い。乗車時に整理券を取ってください。",
      "zh": "下车付车费，上车时请取整理券。",
      "en": "Pay when you get off. Take a numbered ticket when boarding."
    },
    "change": {
      "ja": "車内で両替不可（新千円札・新500円硬貨含む）。",
      "zh": "车内无法找零（含新版1000日元纸币和500日元硬币）。",
      "en": "No change given on board (incl. new ¥1000 notes & ¥500 coins)."
    },
    "ic": {
      "ja": "「いわさきICカード」「ラピカ」のみ利用可（種子島・屋久島交通）。Suica/PASMO等は不可。",
      "zh": "仅种子岛·屋久岛交通班次支持 Iwasaki IC / Rapica，不可用 Suica/PASMO。",
      "en": "Iwasaki IC & Rapica on Tanegashima Yakushima Kotsu only—not Suica/PASMO."
    },
    "pass": {
      "ja": "「屋久島ゆったり満喫乗車券」1日¥2,500 / 3日¥4,000 / 4日¥5,000（小人半額）。詳細は路線・運賃タブ。",
      "zh": "「屋久岛悠享乘车券」1日2500 / 3日4000 / 4日5000日元（儿童半价）。详见路线及价格页。",
      "en": "Yakushima day pass: ¥2,500/1d, ¥4,000/3d, ¥5,000/4d (child half). See Routes & fares tab."
    },
    "transfer": {
      "ja": "白谷雲水峡行きは小原町で乗換。紀元杉行きは合庁前で接続。荒川登山は自然館で乗換。",
      "zh": "往白谷在小原町换乘；纪元杉在县厅前接续；荒川登山在自然馆换乘。",
      "en": "Shiratani: transfer at Kobara. Kigen Sugi: connect at Govt Office. Arakawa: transfer at museum."
    },
    "weather": {
      "ja": "台風・積雪・大雨で運休の場合あり。出発前に運行状況を確認してください。",
      "zh": "台风、积雪、大雨可能停运，出发前请确认运行状况。",
      "en": "Service may stop for typhoons, snow, or heavy rain. Check before travel."
    },
    "arakawaSeason": {
      "ja": "荒川登山バスは3～11月のみ運行。",
      "zh": "荒川登山巴士仅 3–11 月运行。",
      "en": "Arakawa trail bus runs Mar–Nov only."
    },
    "matsubandaPass": {
      "ja": "まつばんだ便では「ゆったり満喫乗車券」は利用できません。",
      "zh": "松叶班次不可使用悠享乘车券。",
      "en": "Matsubanda buses do not accept the Yakushima day pass."
    },
    "matsubandaIc": {
      "ja": "まつばんだ便では IC カードは利用できません。",
      "zh": "松叶班次不可使用 IC 卡。",
      "en": "IC cards are not accepted on Matsubanda buses."
    }
  },
  "routes": [
    {
      "id": "central",
      "operator": "taneyaku",
      "name": {
        "ja": "中央線",
        "zh": "中央线",
        "en": "Central Line"
      },
      "directions": [
        {
          "id": "west",
          "label": {
            "ja": "永田・大川方面",
            "zh": "永田/大川方向",
            "en": "Toward Nagata / Okawa"
          },
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
            "kobara",
            "a_coop",
            "miyaura_elem",
            "asahi",
            "kusugawa",
            "kunugawa",
            "kozeta",
            "shionomichi",
            "airport",
            "hayasaki",
            "towaho",
            "funayuki",
            "gocho_mae",
            "police_mae",
            "anbo_port",
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
            "kojima",
            "hirauchi_onsen",
            "yunuma",
            "naka",
            "kurio_bashi",
            "okawa_falls"
          ],
          "trips": [
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "nagata": "7:26",
                "inakahama": "7:29",
                "yoshida": "7:36",
                "hitomaru": "7:42"
              },
              "dest": "hitomaru"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "shitoko": "6:53",
                "fukagawa": "7:54"
              },
              "dest": "fukagawa"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "miyanoura_port_entrance": "4:46",
                "miyanoura": "4:48",
                "kobara": "5:14"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "a_coop": "4:51",
                "miyaura_elem": "4:52",
                "asahi": "4:54",
                "kusugawa": "5:32"
              },
              "dest": "kusugawa"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "kunugawa": "5:00",
                "kozeta": "5:03",
                "shionomichi": "5:07",
                "hayasaki": "5:09",
                "towaho": "5:12",
                "funayuki": "5:16",
                "gocho_mae": "5:19",
                "police_mae": "5:21",
                "anbo": "5:23",
                "makino": "5:24"
              },
              "dest": "makino"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "morihisa_jinja": "8:41",
                "hirano": "8:45",
                "mugi": "8:53",
                "hara": "8:56"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "屋久杉自然館"
              },
              "times": {
                "onokaido": "6:28",
                "saman_hotel": "7:22",
                "kojima": "7:33",
                "yunuma": "7:41",
                "naka": "7:49",
                "kurio_bashi": "7:54",
                "okawa_falls": "10:22"
              },
              "dest": "okawa_falls"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "安房港"
              },
              "times": {
                "nagata": "9:26",
                "inakahama": "9:29",
                "yoshida": "9:36",
                "hitomaru": "9:42"
              },
              "dest": "hitomaru"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "安房港"
              },
              "times": {
                "miyanoura_port": "8:00",
                "anbo": "8:39"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "安房港"
              },
              "times": {
                "miyanoura_port_entrance": "5:52",
                "miyanoura": "5:54",
                "kobara": "7:19"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "安房港"
              },
              "times": {
                "a_coop": "5:57",
                "miyaura_elem": "5:58",
                "asahi": "6:00",
                "kunugawa": "6:06",
                "kozeta": "6:09",
                "shionomichi": "6:13",
                "airport": "6:14",
                "hayasaki": "6:16",
                "towaho": "6:19",
                "funayuki": "6:23",
                "gocho_mae": "6:26",
                "police_mae": "6:28",
                "anbo_port": "6:32"
              },
              "dest": "anbo_port"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "安房港"
              },
              "times": {
                "makino": "8:40",
                "morihisa_jinja": "9:25",
                "hirano": "9:29",
                "mugi": "9:37",
                "hara": "9:40"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "安房港"
              },
              "times": {
                "onokaido": "8:12",
                "saman_hotel": "9:02",
                "kojima": "9:13",
                "yunuma": "9:21",
                "naka": "9:29",
                "kurio_bashi": "9:34",
                "okawa_falls": "14:32"
              },
              "dest": "okawa_falls"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "nagata": "10:01",
                "inakahama": "10:04",
                "yoshida": "10:11",
                "hitomaru": "10:17"
              },
              "dest": "hitomaru"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "8:40",
                "anbo": "9:23"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "8:01",
                "miyanoura": "8:03",
                "kobara": "8:44"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "8:06",
                "miyaura_elem": "8:07",
                "asahi": "8:09",
                "kunugawa": "8:15",
                "kozeta": "8:18",
                "shionomichi": "8:22",
                "airport": "8:23",
                "hayasaki": "8:25",
                "towaho": "8:28",
                "funayuki": "8:32",
                "gocho_mae": "8:35",
                "police_mae": "8:37",
                "makino": "9:24"
              },
              "dest": "makino"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "fukagawa": "10:29",
                "morihisa_jinja": "10:45",
                "hirano": "10:49",
                "mugi": "10:57",
                "hara": "11:00"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "onokaido": "9:41",
                "saman_hotel": "9:46",
                "kojima": "9:57",
                "yunuma": "10:05",
                "naka": "10:13",
                "kurio_bashi": "10:18",
                "okawa_falls": "17:02"
              },
              "dest": "okawa_falls"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "nagata": "11:36",
                "inakahama": "11:39",
                "yoshida": "11:46",
                "hitomaru": "11:52"
              },
              "dest": "hitomaru"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "10:00",
                "anbo": "10:43"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "8:41",
                "miyanoura": "8:43",
                "kobara": "9:09"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "8:46",
                "miyaura_elem": "8:47",
                "asahi": "8:49",
                "kunugawa": "8:55",
                "kozeta": "8:58",
                "shionomichi": "9:02",
                "airport": "9:03",
                "hayasaki": "9:05",
                "towaho": "9:08",
                "funayuki": "9:12",
                "gocho_mae": "9:15",
                "police_mae": "9:17",
                "anbo_port": "9:21"
              },
              "dest": "anbo_port"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "makino": "10:44",
                "morihisa_jinja": "11:16",
                "hirano": "11:20",
                "mugi": "11:28",
                "hara": "11:31"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "onokaido": "10:06",
                "saman_hotel": "11:06",
                "kojima": "11:17",
                "yunuma": "11:25",
                "naka": "11:33",
                "kurio_bashi": "11:38"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "nagata": "15:06",
                "inakahama": "15:09",
                "yoshida": "15:16",
                "hitomaru": "15:22"
              },
              "dest": "hitomaru"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "10:35",
                "gocho_mae": "10:35",
                "police_mae": "10:37",
                "anbo_port": "10:41",
                "anbo": "11:14"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "10:01",
                "miyanoura": "10:03",
                "kobara": "10:34"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "10:06",
                "miyaura_elem": "10:07",
                "asahi": "10:09",
                "kunugawa": "10:15",
                "kozeta": "10:18",
                "shionomichi": "10:22",
                "airport": "10:23",
                "hayasaki": "10:25",
                "towaho": "10:28",
                "funayuki": "10:32",
                "makino": "11:15",
                "morihisa_jinja": "12:00",
                "hirano": "12:04",
                "mugi": "12:12",
                "hara": "12:15"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "onokaido": "11:31",
                "saman_hotel": "11:37",
                "kojima": "12:32",
                "yunuma": "12:40",
                "naka": "12:48",
                "kurio_bashi": "12:53"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "nagata": "17:51",
                "inakahama": "17:54",
                "yoshida": "18:01",
                "hitomaru": "18:07"
              },
              "dest": "hitomaru"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "11:15",
                "anbo": "11:58"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "10:36",
                "miyanoura": "10:38",
                "kobara": "11:44"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "10:41",
                "miyaura_elem": "10:42",
                "asahi": "10:44",
                "kunugawa": "10:50",
                "kozeta": "10:53",
                "shionomichi": "10:57",
                "airport": "10:58",
                "hayasaki": "11:00",
                "towaho": "11:03",
                "funayuki": "11:07",
                "gocho_mae": "11:10",
                "police_mae": "11:12",
                "makino": "11:59",
                "morihisa_jinja": "12:55",
                "hirano": "12:59",
                "mugi": "13:07",
                "hara": "13:10"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "onokaido": "12:41",
                "kojima": "14:07",
                "yunuma": "14:15",
                "naka": "14:23",
                "kurio_bashi": "14:28"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "12:10",
                "anbo": "12:53"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "11:16",
                "miyanoura": "11:18",
                "kobara": "12:54"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "11:21",
                "miyaura_elem": "11:22",
                "asahi": "11:24",
                "kunugawa": "11:30",
                "kozeta": "11:33",
                "shionomichi": "11:37",
                "airport": "11:38",
                "hayasaki": "11:40",
                "towaho": "11:43",
                "funayuki": "11:47",
                "gocho_mae": "11:50",
                "police_mae": "11:52",
                "anbo_port": "11:56",
                "makino": "12:54",
                "morihisa_jinja": "13:35",
                "hirano": "13:39",
                "mugi": "13:47",
                "hara": "13:50",
                "onokaido": "13:51"
              },
              "dest": "onokaido"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "shitoko": "13:58",
                "kojima": "15:27",
                "yunuma": "15:35",
                "naka": "15:43",
                "kurio_bashi": "15:48"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "12:50",
                "anbo_port": "12:51",
                "anbo": "13:33"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "12:11",
                "miyanoura": "12:13",
                "kobara": "13:54"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "12:16",
                "miyaura_elem": "12:17",
                "asahi": "12:19",
                "kunugawa": "12:25",
                "kozeta": "12:28",
                "shionomichi": "12:32",
                "airport": "12:33",
                "hayasaki": "12:35",
                "towaho": "12:38",
                "funayuki": "12:42",
                "gocho_mae": "12:45",
                "police_mae": "12:47",
                "makino": "13:34"
              },
              "dest": "makino"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "morihisa_jinja": "14:55",
                "hirano": "14:59",
                "mugi": "15:07",
                "hara": "15:10"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "shitoko": "15:43",
                "kojima": "16:37",
                "yunuma": "16:45",
                "naka": "16:53",
                "kurio_bashi": "16:58"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port": "14:10",
                "anbo": "14:53"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "miyanoura_port_entrance": "12:51",
                "miyanoura": "12:53",
                "kobara": "14:24"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "a_coop": "12:56",
                "miyaura_elem": "12:57",
                "asahi": "12:59",
                "kunugawa": "13:05",
                "kozeta": "13:08",
                "shionomichi": "13:12",
                "airport": "13:13",
                "hayasaki": "13:15",
                "towaho": "13:18",
                "funayuki": "13:22",
                "gocho_mae": "13:25",
                "police_mae": "13:27",
                "anbo_port": "13:31"
              },
              "dest": "anbo_port"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "makino": "14:54",
                "morihisa_jinja": "16:05",
                "hirano": "16:09",
                "mugi": "16:17",
                "hara": "16:20"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "栗生橋"
              },
              "times": {
                "shitoko": "16:43",
                "kojima": "18:09",
                "yunuma": "18:17",
                "naka": "18:25",
                "kurio_bashi": "18:30"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "miyanoura_port": "15:20",
                "anbo": "16:03"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "miyanoura_port_entrance": "14:11",
                "miyanoura": "14:13",
                "kobara": "15:14"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "a_coop": "14:16",
                "miyaura_elem": "14:17",
                "asahi": "14:19",
                "kunugawa": "14:25",
                "kozeta": "14:28",
                "shionomichi": "14:32",
                "airport": "14:33",
                "hayasaki": "14:35",
                "towaho": "14:38",
                "funayuki": "14:42",
                "gocho_mae": "14:45",
                "police_mae": "14:47",
                "anbo_port": "14:51",
                "makino": "16:04",
                "morihisa_jinja": "16:23",
                "hirano": "16:27",
                "mugi": "16:35",
                "hara": "16:38"
              },
              "dest": "hara"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "onokaido": "16:07",
                "saman_hotel": "16:26"
              },
              "dest": "saman_hotel"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "shitoko": "18:03",
                "kojima": "18:44",
                "yunuma": "18:52",
                "naka": "19:00",
                "kurio_bashi": "19:05"
              },
              "dest": "kurio_bashi"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "miyanoura_port": "15:40",
                "shionomichi": "15:42",
                "airport": "15:43",
                "hayasaki": "15:45",
                "towaho": "15:48",
                "funayuki": "15:52",
                "gocho_mae": "15:55",
                "police_mae": "15:57",
                "anbo_port": "16:01",
                "anbo": "16:21"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "miyanoura_port_entrance": "15:21",
                "miyanoura": "15:23",
                "kobara": "16:09"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "a_coop": "15:26",
                "miyaura_elem": "15:27",
                "asahi": "15:29",
                "kunugawa": "15:35",
                "kozeta": "15:38",
                "makino": "16:22",
                "morihisa_jinja": "17:37",
                "hirano": "17:41",
                "mugi": "17:49",
                "hara": "17:52"
              },
              "dest": "hara"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "miyanoura_port": "16:50",
                "anbo": "17:35"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "miyanoura_port_entrance": "15:41",
                "miyanoura": "15:43",
                "kobara": "17:09"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "a_coop": "15:46",
                "miyaura_elem": "15:47",
                "asahi": "15:49",
                "kusugawa": "17:10"
              },
              "dest": "kusugawa"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "kunugawa": "15:55",
                "kozeta": "15:58",
                "shionomichi": "16:02",
                "airport": "16:03",
                "hayasaki": "16:05",
                "towaho": "16:08",
                "funayuki": "16:12",
                "gocho_mae": "16:17",
                "police_mae": "16:19"
              },
              "dest": "police_mae"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "makino": "17:36",
                "morihisa_jinja": "17:45",
                "hirano": "17:49",
                "mugi": "17:57",
                "hara": "18:00"
              },
              "dest": "hara"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "いわさきH"
              },
              "times": {
                "onokaido": "17:54",
                "saman_hotel": "17:58"
              },
              "dest": "saman_hotel"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "miyanoura_port": "17:25",
                "gocho_mae": "17:27",
                "police_mae": "17:29",
                "anbo_port": "17:33",
                "anbo": "18:10"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "miyanoura_port_entrance": "16:51",
                "miyanoura": "16:53",
                "kobara": "18:29"
              },
              "dest": "kobara"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "a_coop": "16:56",
                "miyaura_elem": "16:57",
                "asahi": "16:59",
                "kunugawa": "17:05",
                "kozeta": "17:08",
                "shionomichi": "17:12",
                "airport": "17:13",
                "hayasaki": "17:15",
                "towaho": "17:18",
                "funayuki": "17:22",
                "makino": "18:11",
                "morihisa_jinja": "18:12",
                "hirano": "18:16",
                "mugi": "18:24",
                "hara": "18:27"
              },
              "dest": "hara"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "miyanoura_port": "18:25",
                "anbo": "19:10"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "大川の滝"
              },
              "times": {
                "miyanoura_port_entrance": "17:26",
                "miyanoura": "17:28",
                "a_coop": "17:31",
                "miyaura_elem": "17:32",
                "asahi": "17:34",
                "kunugawa": "17:40",
                "kozeta": "17:43",
                "shionomichi": "17:47",
                "airport": "17:48",
                "hayasaki": "17:50",
                "towaho": "17:53",
                "funayuki": "17:57",
                "gocho_mae": "18:02",
                "police_mae": "18:04",
                "anbo_port": "18:08",
                "makino": "19:11",
                "morihisa_jinja": "19:12",
                "hirano": "19:16",
                "mugi": "19:24",
                "hara": "19:27",
                "onokaido": "19:28"
              },
              "dest": "onokaido"
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "miyanoura_port_entrance": "18:26",
                "miyanoura": "18:28",
                "a_coop": "18:31",
                "miyaura_elem": "18:32",
                "asahi": "18:34",
                "kunugawa": "18:40",
                "kozeta": "18:43",
                "shionomichi": "18:47",
                "airport": "18:48",
                "hayasaki": "18:50",
                "towaho": "18:53",
                "funayuki": "18:57",
                "gocho_mae": "19:02",
                "police_mae": "19:04",
                "anbo_port": "19:08",
                "saman_hotel": "19:33",
                "hotel_yakushima": "19:39"
              },
              "dest": "saman_hotel"
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday"
              ],
              "times": {
                "nagata": "7:26",
                "inakahama": "7:29",
                "yoshida": "7:36",
                "hitomaru": "7:42",
                "shitoko": "6:53",
                "fukagawa": "7:54",
                "miyanoura_port": "5:50",
                "miyanoura_port_early": "4:45",
                "miyanoura_port_entrance": "4:46",
                "miyanoura": "4:48",
                "kobara": "5:14",
                "a_coop": "4:51",
                "miyaura_elem": "4:52",
                "asahi": "4:54",
                "kusugawa": "5:32",
                "kunugawa": "5:00",
                "kozeta": "5:03",
                "shionomichi": "5:07",
                "hayasaki": "5:09",
                "towaho": "5:12",
                "funayuki": "5:16",
                "gocho_mae": "5:19",
                "police_mae": "5:21",
                "anbo": "5:23",
                "makino": "5:24",
                "morihisa_jinja": "8:41",
                "hirano": "8:45",
                "mugi": "8:53",
                "hara": "8:56",
                "onokaido": "6:28",
                "saman_hotel": "7:22",
                "hotel_yakushima": "7:28",
                "kojima": "7:33",
                "yunuma": "7:41",
                "naka": "7:49",
                "kurio_bashi": "7:54",
                "okawa_falls": "10:22",
                "ushiroka_park": "9:23",
                "shiratani": "8:55"
              },
              "dest": "okawa_falls",
              "destNote": {
                "ja": "屋久杉自然館"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "nagata": "9:26",
                "inakahama": "9:29",
                "yoshida": "9:36",
                "hitomaru": "9:42",
                "shitoko": "8:18",
                "fukagawa": "9:54",
                "miyanoura_port": "8:00",
                "miyanoura_port_early": "5:51",
                "miyanoura_port_entrance": "5:52",
                "miyanoura": "5:54",
                "kobara": "7:19",
                "a_coop": "5:57",
                "miyaura_elem": "5:58",
                "asahi": "6:00",
                "kunugawa": "6:06",
                "kozeta": "6:09",
                "shionomichi": "6:13",
                "airport": "6:14",
                "hayasaki": "6:16",
                "towaho": "6:19",
                "funayuki": "6:23",
                "gocho_mae": "6:26",
                "police_mae": "6:28",
                "anbo_port": "6:32",
                "anbo": "8:39",
                "makino": "8:40",
                "morihisa_jinja": "9:25",
                "hirano": "9:29",
                "mugi": "9:37",
                "hara": "9:40",
                "onokaido": "8:12",
                "saman_hotel": "9:02",
                "hotel_yakushima": "9:08",
                "kojima": "9:13",
                "yunuma": "9:21",
                "naka": "9:29",
                "kurio_bashi": "9:34",
                "okawa_falls": "14:32",
                "ushiroka_park": "11:03",
                "shiratani": "10:40"
              },
              "dest": "okawa_falls",
              "destNote": {
                "ja": "安房港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "nagata": "10:01",
                "inakahama": "10:04",
                "yoshida": "10:11",
                "hitomaru": "10:17",
                "shitoko": "8:43",
                "fukagawa": "10:29",
                "miyanoura_port": "8:40",
                "miyanoura_port_entrance": "8:01",
                "miyanoura": "8:03",
                "kobara": "8:44",
                "a_coop": "8:06",
                "miyaura_elem": "8:07",
                "asahi": "8:09",
                "kunugawa": "8:15",
                "kozeta": "8:18",
                "shionomichi": "8:22",
                "airport": "8:23",
                "hayasaki": "8:25",
                "towaho": "8:28",
                "funayuki": "8:32",
                "gocho_mae": "8:35",
                "police_mae": "8:37",
                "anbo": "9:23",
                "makino": "9:24",
                "morihisa_jinja": "10:45",
                "hirano": "10:49",
                "mugi": "10:57",
                "hara": "11:00",
                "onokaido": "9:41",
                "saman_hotel": "9:46",
                "hotel_yakushima": "9:52",
                "kojima": "9:57",
                "yunuma": "10:05",
                "naka": "10:13",
                "kurio_bashi": "10:18",
                "okawa_falls": "17:02",
                "ushiroka_park": "14:08",
                "shiratani": "13:45"
              },
              "dest": "okawa_falls",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "nagata": "11:36",
                "inakahama": "11:39",
                "yoshida": "11:46",
                "hitomaru": "11:52",
                "shitoko": "10:08",
                "fukagawa": "12:04",
                "miyanoura_port": "10:00",
                "miyanoura_port_entrance": "8:41",
                "miyanoura": "8:43",
                "kobara": "9:09",
                "a_coop": "8:46",
                "miyaura_elem": "8:47",
                "asahi": "8:49",
                "kunugawa": "8:55",
                "kozeta": "8:58",
                "shionomichi": "9:02",
                "airport": "9:03",
                "hayasaki": "9:05",
                "towaho": "9:08",
                "funayuki": "9:12",
                "gocho_mae": "9:15",
                "police_mae": "9:17",
                "anbo_port": "9:21",
                "anbo": "10:43",
                "makino": "10:44",
                "morihisa_jinja": "11:16",
                "hirano": "11:20",
                "mugi": "11:28",
                "hara": "11:31",
                "onokaido": "10:06",
                "saman_hotel": "11:06",
                "hotel_yakushima": "11:12",
                "kojima": "11:17",
                "yunuma": "11:25",
                "naka": "11:33",
                "kurio_bashi": "11:38",
                "ushiroka_park": "16:33",
                "shiratani": "16:05"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "nagata": "15:06",
                "inakahama": "15:09",
                "yoshida": "15:16",
                "hitomaru": "15:22",
                "shitoko": "11:18",
                "fukagawa": "15:34",
                "miyanoura_port": "10:35",
                "miyanoura_port_entrance": "10:01",
                "miyanoura": "10:03",
                "kobara": "10:34",
                "a_coop": "10:06",
                "miyaura_elem": "10:07",
                "asahi": "10:09",
                "kunugawa": "10:15",
                "kozeta": "10:18",
                "shionomichi": "10:22",
                "airport": "10:23",
                "hayasaki": "10:25",
                "towaho": "10:28",
                "funayuki": "10:32",
                "gocho_mae": "10:35",
                "police_mae": "10:37",
                "anbo_port": "10:41",
                "anbo": "11:14",
                "makino": "11:15",
                "morihisa_jinja": "12:00",
                "hirano": "12:04",
                "mugi": "12:12",
                "hara": "12:15",
                "onokaido": "11:31",
                "saman_hotel": "11:37",
                "hotel_yakushima": "11:43",
                "kojima": "12:32",
                "yunuma": "12:40",
                "naka": "12:48",
                "kurio_bashi": "12:53"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "nagata": "17:51",
                "inakahama": "17:54",
                "yoshida": "18:01",
                "hitomaru": "18:07",
                "shitoko": "13:28",
                "fukagawa": "18:19",
                "miyanoura_port": "11:15",
                "miyanoura_port_entrance": "10:36",
                "miyanoura": "10:38",
                "kobara": "11:44",
                "a_coop": "10:41",
                "miyaura_elem": "10:42",
                "asahi": "10:44",
                "kunugawa": "10:50",
                "kozeta": "10:53",
                "shionomichi": "10:57",
                "airport": "10:58",
                "hayasaki": "11:00",
                "towaho": "11:03",
                "funayuki": "11:07",
                "gocho_mae": "11:10",
                "police_mae": "11:12",
                "anbo": "11:58",
                "makino": "11:59",
                "morihisa_jinja": "12:55",
                "hirano": "12:59",
                "mugi": "13:07",
                "hara": "13:10",
                "onokaido": "12:41",
                "saman_hotel": "12:21",
                "hotel_yakushima": "12:27",
                "kojima": "14:07",
                "yunuma": "14:15",
                "naka": "14:23",
                "kurio_bashi": "14:28"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "shitoko": "13:58",
                "miyanoura_port": "12:10",
                "miyanoura_port_entrance": "11:16",
                "miyanoura": "11:18",
                "kobara": "12:54",
                "a_coop": "11:21",
                "miyaura_elem": "11:22",
                "asahi": "11:24",
                "kunugawa": "11:30",
                "kozeta": "11:33",
                "shionomichi": "11:37",
                "airport": "11:38",
                "hayasaki": "11:40",
                "towaho": "11:43",
                "funayuki": "11:47",
                "gocho_mae": "11:50",
                "police_mae": "11:52",
                "anbo_port": "11:56",
                "anbo": "12:53",
                "makino": "12:54",
                "morihisa_jinja": "13:35",
                "hirano": "13:39",
                "mugi": "13:47",
                "hara": "13:50",
                "onokaido": "13:51",
                "saman_hotel": "13:16",
                "hotel_yakushima": "13:22",
                "kojima": "15:27",
                "yunuma": "15:35",
                "naka": "15:43",
                "kurio_bashi": "15:48"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "shitoko": "15:43",
                "miyanoura_port": "12:50",
                "miyanoura_port_entrance": "12:11",
                "miyanoura": "12:13",
                "kobara": "13:54",
                "a_coop": "12:16",
                "miyaura_elem": "12:17",
                "asahi": "12:19",
                "kunugawa": "12:25",
                "kozeta": "12:28",
                "shionomichi": "12:32",
                "airport": "12:33",
                "hayasaki": "12:35",
                "towaho": "12:38",
                "funayuki": "12:42",
                "gocho_mae": "12:45",
                "police_mae": "12:47",
                "anbo_port": "12:51",
                "anbo": "13:33",
                "makino": "13:34",
                "morihisa_jinja": "14:55",
                "hirano": "14:59",
                "mugi": "15:07",
                "hara": "15:10",
                "onokaido": "14:51",
                "saman_hotel": "13:56",
                "hotel_yakushima": "14:02",
                "kojima": "16:37",
                "yunuma": "16:45",
                "naka": "16:53",
                "kurio_bashi": "16:58"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "shitoko": "16:43",
                "miyanoura_port": "14:10",
                "miyanoura_port_entrance": "12:51",
                "miyanoura": "12:53",
                "kobara": "14:24",
                "a_coop": "12:56",
                "miyaura_elem": "12:57",
                "asahi": "12:59",
                "kunugawa": "13:05",
                "kozeta": "13:08",
                "shionomichi": "13:12",
                "airport": "13:13",
                "hayasaki": "13:15",
                "towaho": "13:18",
                "funayuki": "13:22",
                "gocho_mae": "13:25",
                "police_mae": "13:27",
                "anbo_port": "13:31",
                "anbo": "14:53",
                "makino": "14:54",
                "morihisa_jinja": "16:05",
                "hirano": "16:09",
                "mugi": "16:17",
                "hara": "16:20",
                "onokaido": "15:21",
                "saman_hotel": "15:16",
                "hotel_yakushima": "15:22",
                "kojima": "18:09",
                "yunuma": "18:17",
                "naka": "18:25",
                "kurio_bashi": "18:30"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "栗生橋"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "shitoko": "18:03",
                "miyanoura_port": "15:20",
                "miyanoura_port_entrance": "14:11",
                "miyanoura": "14:13",
                "kobara": "15:14",
                "a_coop": "14:16",
                "miyaura_elem": "14:17",
                "asahi": "14:19",
                "kunugawa": "14:25",
                "kozeta": "14:28",
                "shionomichi": "14:32",
                "airport": "14:33",
                "hayasaki": "14:35",
                "towaho": "14:38",
                "funayuki": "14:42",
                "gocho_mae": "14:45",
                "police_mae": "14:47",
                "anbo_port": "14:51",
                "anbo": "16:03",
                "makino": "16:04",
                "morihisa_jinja": "16:23",
                "hirano": "16:27",
                "mugi": "16:35",
                "hara": "16:38",
                "onokaido": "16:07",
                "saman_hotel": "16:26",
                "hotel_yakushima": "16:32",
                "kojima": "18:44",
                "yunuma": "18:52",
                "naka": "19:00",
                "kurio_bashi": "19:05"
              },
              "dest": "kurio_bashi",
              "destNote": {
                "ja": "大川の滝"
              }
            },
            {
              "days": [
                "saturday"
              ],
              "times": {
                "miyanoura_port": "15:40",
                "miyanoura_port_entrance": "15:21",
                "miyanoura": "15:23",
                "kobara": "16:09",
                "a_coop": "15:26",
                "miyaura_elem": "15:27",
                "asahi": "15:29",
                "kunugawa": "15:35",
                "kozeta": "15:38",
                "shionomichi": "15:42",
                "airport": "15:43",
                "hayasaki": "15:45",
                "towaho": "15:48",
                "funayuki": "15:52",
                "gocho_mae": "15:55",
                "police_mae": "15:57",
                "anbo_port": "16:01",
                "anbo": "16:21",
                "makino": "16:22",
                "morihisa_jinja": "17:37",
                "hirano": "17:41",
                "mugi": "17:49",
                "hara": "17:52",
                "onokaido": "17:06",
                "saman_hotel": "16:44",
                "hotel_yakushima": "16:50"
              },
              "dest": "saman_hotel",
              "destNote": {
                "ja": "いわさきH"
              }
            },
            {
              "days": [
                "saturday"
              ],
              "times": {
                "miyanoura_port": "16:50",
                "miyanoura_port_entrance": "15:41",
                "miyanoura": "15:43",
                "kobara": "17:09",
                "a_coop": "15:46",
                "miyaura_elem": "15:47",
                "asahi": "15:49",
                "kusugawa": "17:10",
                "kunugawa": "15:55",
                "kozeta": "15:58",
                "shionomichi": "16:02",
                "airport": "16:03",
                "hayasaki": "16:05",
                "towaho": "16:08",
                "funayuki": "16:12",
                "gocho_mae": "16:17",
                "police_mae": "16:19",
                "anbo": "17:35",
                "makino": "17:36",
                "morihisa_jinja": "17:45",
                "hirano": "17:49",
                "mugi": "17:57",
                "hara": "18:00",
                "onokaido": "17:54",
                "saman_hotel": "17:58",
                "hotel_yakushima": "18:04"
              },
              "dest": "saman_hotel",
              "destNote": {
                "ja": "いわさきH"
              }
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "17:25",
                "miyanoura_port_entrance": "16:51",
                "miyanoura": "16:53",
                "kobara": "18:29",
                "a_coop": "16:56",
                "miyaura_elem": "16:57",
                "asahi": "16:59",
                "kunugawa": "17:05",
                "kozeta": "17:08",
                "shionomichi": "17:12",
                "airport": "17:13",
                "hayasaki": "17:15",
                "towaho": "17:18",
                "funayuki": "17:22",
                "gocho_mae": "17:27",
                "police_mae": "17:29",
                "anbo_port": "17:33",
                "anbo": "18:10",
                "makino": "18:11",
                "morihisa_jinja": "18:12",
                "hirano": "18:16",
                "mugi": "18:24",
                "hara": "18:27",
                "onokaido": "18:08",
                "saman_hotel": "18:06",
                "hotel_yakushima": "18:12"
              },
              "dest": "saman_hotel",
              "destNote": {
                "ja": "大川の滝"
              }
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "18:25",
                "miyanoura_port_entrance": "17:26",
                "miyanoura": "17:28",
                "a_coop": "17:31",
                "miyaura_elem": "17:32",
                "asahi": "17:34",
                "kunugawa": "17:40",
                "kozeta": "17:43",
                "shionomichi": "17:47",
                "airport": "17:48",
                "hayasaki": "17:50",
                "towaho": "17:53",
                "funayuki": "17:57",
                "gocho_mae": "18:02",
                "police_mae": "18:04",
                "anbo_port": "18:08",
                "anbo": "19:10",
                "makino": "19:11",
                "morihisa_jinja": "19:12",
                "hirano": "19:16",
                "mugi": "19:24",
                "hara": "19:27",
                "onokaido": "19:28",
                "saman_hotel": "18:33",
                "hotel_yakushima": "18:39"
              },
              "dest": "saman_hotel",
              "destNote": {
                "ja": "大川の滝"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "miyanoura_port_entrance": "18:26",
                "miyanoura": "18:28",
                "a_coop": "18:31",
                "miyaura_elem": "18:32",
                "asahi": "18:34",
                "kunugawa": "18:40",
                "kozeta": "18:43",
                "shionomichi": "18:47",
                "airport": "18:48",
                "hayasaki": "18:50",
                "towaho": "18:53",
                "funayuki": "18:57",
                "gocho_mae": "19:02",
                "police_mae": "19:04",
                "anbo_port": "19:08",
                "saman_hotel": "19:33",
                "hotel_yakushima": "19:39"
              },
              "dest": "saman_hotel"
            }
          ]
        },
        {
          "id": "east",
          "label": {
            "ja": "宮之浦港方面",
            "zh": "宫之浦港方向",
            "en": "Toward Miyanoura Port"
          },
          "stops": [
            "okawa_falls",
            "kurio_bashi",
            "naka",
            "yunuma",
            "hirauchi_onsen",
            "kojima",
            "saman_hotel",
            "onokaido",
            "hara",
            "botanical_park",
            "mugi",
            "hirano",
            "morihisa_jinja",
            "yakusugi_museum",
            "makino",
            "anbo",
            "anbo_port",
            "police_mae",
            "gocho_mae",
            "funayuki",
            "towaho",
            "hayasaki",
            "airport",
            "shionomichi",
            "kozeta",
            "kunugawa",
            "kusugawa",
            "asahi",
            "miyaura_elem",
            "a_coop",
            "kobara",
            "miyanoura",
            "miyanoura_port_entrance",
            "miyanoura_port",
            "fukagawa",
            "shitoko",
            "hitomaru",
            "yoshida",
            "inakahama",
            "nagata"
          ],
          "trips": [
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "kurio_bashi": "6:39",
                "naka": "6:44",
                "yunuma": "6:52",
                "kojima": "7:00"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "5:06",
                "onokaido": "5:07",
                "hara": "5:12",
                "mugi": "5:15",
                "hirano": "5:23",
                "morihisa_jinja": "5:27",
                "yakusugi_museum": "5:35",
                "makino": "5:38",
                "anbo": "5:39",
                "anbo_port": "5:43",
                "police_mae": "5:52",
                "gocho_mae": "5:54",
                "funayuki": "5:57",
                "towaho": "6:01",
                "hayasaki": "6:04",
                "airport": "6:06",
                "shionomichi": "6:07",
                "kozeta": "6:11",
                "kunugawa": "6:14",
                "kusugawa": "6:18",
                "asahi": "6:20",
                "miyaura_elem": "6:22",
                "a_coop": "6:23",
                "kobara": "6:24",
                "miyanoura": "6:26",
                "miyanoura_port": "6:31"
              },
              "dest": "miyanoura_port"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "fukagawa": "8:19",
                "shitoko": "8:26",
                "hitomaru": "8:31",
                "yoshida": "8:37",
                "inakahama": "8:44",
                "nagata": "8:47"
              },
              "dest": "nagata"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "kurio_bashi": "8:04",
                "naka": "8:09",
                "yunuma": "8:17",
                "kojima": "8:25"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "saman_hotel": "7:11",
                "onokaido": "7:12",
                "hara": "7:17",
                "mugi": "7:20",
                "hirano": "7:28",
                "morihisa_jinja": "7:32"
              },
              "dest": "morihisa_jinja"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "makino": "7:33",
                "anbo": "7:34"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "police_mae": "7:36",
                "gocho_mae": "7:38",
                "funayuki": "7:41",
                "towaho": "7:45",
                "hayasaki": "7:48",
                "airport": "7:50",
                "shionomichi": "7:51",
                "kozeta": "7:55",
                "kunugawa": "7:58",
                "kusugawa": "8:02",
                "asahi": "8:04",
                "miyaura_elem": "8:06",
                "a_coop": "8:07",
                "kobara": "8:08",
                "miyanoura": "8:10",
                "miyanoura_port": "8:15",
                "fukagawa": "9:19",
                "shitoko": "9:26",
                "hitomaru": "9:31",
                "yoshida": "9:37",
                "inakahama": "9:44",
                "nagata": "9:47"
              },
              "dest": "nagata"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "kurio_bashi": "8:29",
                "naka": "8:34",
                "yunuma": "8:42",
                "kojima": "8:50"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "saman_hotel": "8:36",
                "onokaido": "8:37",
                "hara": "8:42",
                "mugi": "8:45",
                "hirano": "8:53",
                "morihisa_jinja": "8:57"
              },
              "dest": "morihisa_jinja"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "makino": "8:58",
                "anbo": "8:59",
                "police_mae": "9:05",
                "gocho_mae": "9:07",
                "funayuki": "9:10",
                "towaho": "9:14",
                "hayasaki": "9:17",
                "airport": "9:19",
                "shionomichi": "9:20",
                "kozeta": "9:24",
                "kunugawa": "9:27",
                "kusugawa": "9:31",
                "asahi": "9:33",
                "miyaura_elem": "9:35",
                "a_coop": "9:36",
                "kobara": "9:37",
                "miyanoura": "9:39"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "fukagawa": "10:44",
                "shitoko": "10:51",
                "hitomaru": "10:56",
                "yoshida": "11:02",
                "inakahama": "11:09",
                "nagata": "11:12"
              },
              "dest": "nagata"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "kurio_bashi": "9:54",
                "naka": "9:59",
                "yunuma": "10:07",
                "kojima": "10:15"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "9:01",
                "onokaido": "9:02",
                "hara": "9:07",
                "mugi": "9:10",
                "hirano": "9:18",
                "morihisa_jinja": "9:22",
                "yakusugi_museum": "14:35"
              },
              "dest": "yakusugi_museum"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "makino": "9:23",
                "anbo": "9:24"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "anbo_port": "9:03",
                "police_mae": "9:30",
                "gocho_mae": "9:32",
                "funayuki": "9:35",
                "towaho": "9:39",
                "hayasaki": "9:42",
                "airport": "9:44",
                "shionomichi": "9:45",
                "kozeta": "9:49",
                "kunugawa": "9:52",
                "kusugawa": "9:56",
                "asahi": "9:58",
                "miyaura_elem": "10:00",
                "a_coop": "10:01",
                "kobara": "10:02",
                "miyanoura": "10:04"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "fukagawa": "13:58",
                "shitoko": "14:05",
                "hitomaru": "14:10",
                "yoshida": "14:16",
                "inakahama": "14:23",
                "nagata": "14:26"
              },
              "dest": "nagata"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "kurio_bashi": "11:04",
                "naka": "11:09",
                "yunuma": "11:17",
                "kojima": "11:25"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "10:26",
                "onokaido": "10:27",
                "hara": "10:32",
                "mugi": "10:35",
                "hirano": "10:43",
                "morihisa_jinja": "10:47",
                "makino": "10:48",
                "anbo": "10:49"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "police_mae": "10:55",
                "gocho_mae": "10:57",
                "funayuki": "11:00",
                "towaho": "11:04",
                "hayasaki": "11:07",
                "airport": "11:09",
                "shionomichi": "11:10",
                "kozeta": "11:14",
                "kunugawa": "11:17",
                "kusugawa": "11:21",
                "asahi": "11:23",
                "miyaura_elem": "11:25",
                "a_coop": "11:26",
                "kobara": "11:27",
                "miyanoura": "11:29"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "fukagawa": "16:14",
                "shitoko": "16:21",
                "hitomaru": "16:26",
                "yoshida": "16:32",
                "inakahama": "16:39",
                "nagata": "16:42"
              },
              "dest": "nagata"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "kurio_bashi": "13:14",
                "naka": "13:19",
                "yunuma": "13:27",
                "kojima": "13:35"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "saman_hotel": "11:36",
                "onokaido": "11:37",
                "hara": "11:42",
                "mugi": "11:45",
                "hirano": "11:53",
                "morihisa_jinja": "11:57",
                "makino": "11:58",
                "anbo": "11:59"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "anbo_port": "10:53",
                "police_mae": "12:05",
                "gocho_mae": "12:07",
                "funayuki": "12:10",
                "towaho": "12:14",
                "hayasaki": "12:17",
                "airport": "12:19",
                "shionomichi": "12:20",
                "kozeta": "12:24",
                "kunugawa": "12:27",
                "kusugawa": "12:31",
                "asahi": "12:33",
                "miyaura_elem": "12:35",
                "a_coop": "12:36",
                "kobara": "12:37",
                "miyanoura": "12:39"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "fukagawa": "18:15",
                "shitoko": "18:22",
                "hitomaru": "18:27",
                "yoshida": "18:33",
                "inakahama": "18:40",
                "nagata": "18:43"
              },
              "dest": "nagata"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "kurio_bashi": "13:44",
                "naka": "13:49",
                "yunuma": "13:57",
                "kojima": "14:05"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "12:46",
                "onokaido": "12:47",
                "hara": "12:52",
                "mugi": "12:55",
                "hirano": "13:03",
                "morihisa_jinja": "13:07",
                "makino": "13:08",
                "anbo": "13:09"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "anbo_port": "12:03",
                "police_mae": "13:15",
                "gocho_mae": "13:17",
                "funayuki": "13:20",
                "towaho": "13:24",
                "hayasaki": "13:27",
                "airport": "13:29",
                "shionomichi": "13:30",
                "kozeta": "13:34",
                "kunugawa": "13:37",
                "kusugawa": "13:41",
                "asahi": "13:43",
                "miyaura_elem": "13:45",
                "a_coop": "13:46",
                "kobara": "13:47",
                "miyanoura": "13:49"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "kurio_bashi": "15:29",
                "naka": "15:34",
                "yunuma": "15:42",
                "kojima": "15:50"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "13:46",
                "onokaido": "13:47",
                "hara": "13:52",
                "mugi": "13:55",
                "hirano": "14:03",
                "morihisa_jinja": "14:07",
                "makino": "14:08",
                "anbo": "14:09"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "anbo_port": "13:13",
                "police_mae": "14:15",
                "gocho_mae": "14:17",
                "funayuki": "14:20",
                "towaho": "14:24",
                "hayasaki": "14:27",
                "airport": "14:29",
                "shionomichi": "14:30",
                "kozeta": "14:34",
                "kunugawa": "14:37",
                "kusugawa": "14:41",
                "asahi": "14:43",
                "miyaura_elem": "14:45",
                "a_coop": "14:46",
                "kobara": "14:47",
                "miyanoura": "14:49"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "kurio_bashi": "16:29",
                "naka": "16:34",
                "yunuma": "16:42",
                "kojima": "16:50"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "saman_hotel": "14:16",
                "onokaido": "14:17",
                "hara": "14:22",
                "mugi": "14:25",
                "hirano": "14:33",
                "morihisa_jinja": "14:37",
                "makino": "14:38",
                "anbo": "14:39"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "anbo_port": "14:13",
                "police_mae": "14:45",
                "gocho_mae": "14:47",
                "funayuki": "14:50",
                "towaho": "14:54",
                "hayasaki": "14:57",
                "airport": "14:59",
                "shionomichi": "15:00",
                "kozeta": "15:04",
                "kunugawa": "15:07",
                "kusugawa": "15:11",
                "asahi": "15:13",
                "miyaura_elem": "15:15",
                "a_coop": "15:16",
                "kobara": "15:17",
                "miyanoura": "15:19"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "kurio_bashi": "17:49",
                "naka": "17:54",
                "yunuma": "18:02",
                "kojima": "18:10"
              },
              "dest": "kojima"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "15:06",
                "onokaido": "15:07",
                "hara": "15:12",
                "mugi": "15:15",
                "hirano": "15:23",
                "morihisa_jinja": "15:27",
                "makino": "15:28",
                "anbo": "15:29"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "anbo_port": "14:43",
                "police_mae": "15:31",
                "gocho_mae": "15:33",
                "funayuki": "15:36",
                "towaho": "15:40",
                "hayasaki": "15:43",
                "airport": "15:45",
                "shionomichi": "15:46",
                "kozeta": "15:50",
                "kunugawa": "15:53",
                "kusugawa": "15:57",
                "asahi": "15:59",
                "miyaura_elem": "16:01",
                "a_coop": "16:02",
                "kobara": "16:03",
                "miyanoura": "16:05"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "saturday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "16:01",
                "onokaido": "16:02",
                "hara": "16:07",
                "mugi": "16:10",
                "hirano": "16:18",
                "morihisa_jinja": "16:22",
                "makino": "16:23",
                "anbo": "16:24",
                "police_mae": "16:30",
                "gocho_mae": "16:32",
                "funayuki": "16:35",
                "towaho": "16:39",
                "hayasaki": "16:42",
                "airport": "16:44",
                "shionomichi": "16:45",
                "kozeta": "16:49",
                "kunugawa": "16:52",
                "kusugawa": "16:56",
                "asahi": "16:58",
                "miyaura_elem": "17:00",
                "a_coop": "17:01",
                "kobara": "17:02",
                "miyanoura": "17:04"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "saman_hotel": "17:01",
                "onokaido": "17:02",
                "hara": "17:07",
                "mugi": "17:10",
                "hirano": "17:18",
                "morihisa_jinja": "17:22"
              },
              "dest": "morihisa_jinja"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "makino": "17:15",
                "anbo": "17:16"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "anbo_port": "16:28",
                "police_mae": "17:18",
                "gocho_mae": "17:20",
                "funayuki": "17:23",
                "towaho": "17:27",
                "hayasaki": "17:30",
                "airport": "17:32",
                "shionomichi": "17:33",
                "kozeta": "17:37",
                "kunugawa": "17:40",
                "kusugawa": "17:44",
                "asahi": "17:46",
                "miyaura_elem": "17:48",
                "a_coop": "17:49",
                "kobara": "17:50",
                "miyanoura": "17:52"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "saman_hotel": "18:21",
                "onokaido": "18:22",
                "hara": "18:27",
                "mugi": "18:30",
                "hirano": "18:38",
                "morihisa_jinja": "18:42"
              },
              "dest": "morihisa_jinja"
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "destNote": {
                "ja": "宮之浦港"
              },
              "times": {
                "makino": "17:23",
                "anbo": "17:24",
                "police_mae": "17:30",
                "gocho_mae": "17:34",
                "funayuki": "17:37",
                "towaho": "17:41",
                "hayasaki": "17:44",
                "airport": "17:46",
                "shionomichi": "17:47",
                "kozeta": "17:51",
                "kunugawa": "17:54",
                "kusugawa": "17:58",
                "asahi": "18:00",
                "miyaura_elem": "18:02",
                "a_coop": "18:03",
                "kobara": "18:04",
                "miyanoura": "18:06"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "makino": "18:43",
                "anbo": "18:44"
              },
              "dest": "anbo"
            },
            {
              "days": [
                "weekday"
              ],
              "destNote": {
                "ja": "永田"
              },
              "times": {
                "police_mae": "18:50",
                "gocho_mae": "18:54",
                "funayuki": "18:57",
                "towaho": "19:01",
                "hayasaki": "19:04",
                "airport": "19:06",
                "shionomichi": "19:07",
                "kozeta": "19:11",
                "kunugawa": "19:14",
                "kusugawa": "19:18",
                "asahi": "19:20",
                "miyaura_elem": "19:22",
                "a_coop": "19:23",
                "kobara": "19:24",
                "miyanoura": "19:26"
              },
              "dest": "miyanoura"
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "anbo_port": "18:48",
                "miyanoura_port": "19:31"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday"
              ],
              "times": {
                "okawa_falls": "11:00",
                "kurio_bashi": "6:39",
                "naka": "6:44",
                "yunuma": "6:52",
                "kojima": "7:00",
                "hotel_yakushima": "5:00",
                "saman_hotel": "5:06",
                "onokaido": "5:07",
                "hara": "5:12",
                "mugi": "5:15",
                "hirano": "5:23",
                "morihisa_jinja": "5:27",
                "makino": "5:38",
                "anbo": "5:39",
                "anbo_port": "5:43",
                "police_mae": "5:52",
                "gocho_mae": "5:54",
                "funayuki": "5:57",
                "towaho": "6:01",
                "hayasaki": "6:04",
                "airport": "6:06",
                "shionomichi": "6:07",
                "kozeta": "6:11",
                "kunugawa": "6:14",
                "kusugawa": "6:18",
                "asahi": "6:20",
                "miyaura_elem": "6:22",
                "a_coop": "6:23",
                "kobara": "6:24",
                "miyanoura": "6:26",
                "miyanoura_port": "6:31",
                "fukagawa": "8:19",
                "shitoko": "8:26",
                "hitomaru": "8:31",
                "yoshida": "8:37",
                "inakahama": "8:44",
                "nagata": "8:47",
                "yakusugi_museum": "5:35",
                "arakawa_trailhead": "6:20",
                "arakawa_sancho": "11:11"
              },
              "dest": "nagata",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "okawa_falls": "15:25",
                "kurio_bashi": "8:04",
                "naka": "8:09",
                "yunuma": "8:17",
                "kojima": "8:25",
                "hotel_yakushima": "7:05",
                "saman_hotel": "7:11",
                "onokaido": "7:12",
                "hara": "7:17",
                "mugi": "7:20",
                "hirano": "7:28",
                "morihisa_jinja": "7:32",
                "makino": "7:33",
                "anbo": "7:34",
                "anbo_port": "5:50",
                "police_mae": "7:36",
                "gocho_mae": "7:38",
                "funayuki": "7:41",
                "towaho": "7:45",
                "hayasaki": "7:48",
                "airport": "7:50",
                "shionomichi": "7:51",
                "kozeta": "7:55",
                "kunugawa": "7:58",
                "kusugawa": "8:02",
                "asahi": "8:04",
                "miyaura_elem": "8:06",
                "a_coop": "8:07",
                "kobara": "8:08",
                "miyanoura": "8:10",
                "miyanoura_port": "8:15",
                "fukagawa": "9:19",
                "shitoko": "9:26",
                "hitomaru": "9:31",
                "yoshida": "9:37",
                "inakahama": "9:44",
                "nagata": "9:47",
                "yakusugi_museum": "5:55",
                "arakawa_trailhead": "15:00",
                "arakawa_sancho": "15:21"
              },
              "dest": "nagata",
              "destNote": {
                "ja": "永田"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "okawa_falls": "17:45",
                "kurio_bashi": "8:29",
                "naka": "8:34",
                "yunuma": "8:42",
                "kojima": "8:50",
                "hotel_yakushima": "8:30",
                "saman_hotel": "8:36",
                "onokaido": "8:37",
                "hara": "8:42",
                "mugi": "8:45",
                "hirano": "8:53",
                "morihisa_jinja": "8:57",
                "makino": "8:58",
                "anbo": "8:59",
                "police_mae": "9:05",
                "gocho_mae": "9:07",
                "funayuki": "9:10",
                "towaho": "9:14",
                "hayasaki": "9:17",
                "airport": "9:19",
                "shionomichi": "9:20",
                "kozeta": "9:24",
                "kunugawa": "9:27",
                "kusugawa": "9:31",
                "asahi": "9:33",
                "miyaura_elem": "9:35",
                "a_coop": "9:36",
                "kobara": "9:37",
                "miyanoura": "9:39",
                "miyanoura_port": "9:15",
                "fukagawa": "10:44",
                "shitoko": "10:51",
                "hitomaru": "10:56",
                "yoshida": "11:02",
                "inakahama": "11:09",
                "nagata": "11:12",
                "yakusugi_museum": "6:15",
                "arakawa_trailhead": "16:00"
              },
              "dest": "nagata",
              "destNote": {
                "ja": "永田"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "kurio_bashi": "9:54",
                "naka": "9:59",
                "yunuma": "10:07",
                "kojima": "10:15",
                "hotel_yakushima": "8:55",
                "saman_hotel": "9:01",
                "onokaido": "9:02",
                "hara": "9:07",
                "mugi": "9:10",
                "hirano": "9:18",
                "morihisa_jinja": "9:22",
                "makino": "9:23",
                "anbo": "9:24",
                "anbo_port": "9:03",
                "police_mae": "9:30",
                "gocho_mae": "9:32",
                "funayuki": "9:35",
                "towaho": "9:39",
                "hayasaki": "9:42",
                "airport": "9:44",
                "shionomichi": "9:45",
                "kozeta": "9:49",
                "kunugawa": "9:52",
                "kusugawa": "9:56",
                "asahi": "9:58",
                "miyaura_elem": "10:00",
                "a_coop": "10:01",
                "kobara": "10:02",
                "miyanoura": "10:04",
                "miyanoura_port": "9:44",
                "fukagawa": "13:58",
                "shitoko": "14:05",
                "hitomaru": "14:10",
                "yoshida": "14:16",
                "inakahama": "14:23",
                "nagata": "14:26",
                "yakusugi_museum": "14:35",
                "arakawa_trailhead": "16:30"
              },
              "dest": "nagata",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "kurio_bashi": "11:04",
                "naka": "11:09",
                "yunuma": "11:17",
                "kojima": "11:25",
                "hotel_yakushima": "10:20",
                "saman_hotel": "10:26",
                "onokaido": "10:27",
                "hara": "10:32",
                "mugi": "10:35",
                "hirano": "10:43",
                "morihisa_jinja": "10:47",
                "makino": "10:48",
                "anbo": "10:49",
                "anbo_port": "9:28",
                "police_mae": "10:55",
                "gocho_mae": "10:57",
                "funayuki": "11:00",
                "towaho": "11:04",
                "hayasaki": "11:07",
                "airport": "11:09",
                "shionomichi": "11:10",
                "kozeta": "11:14",
                "kunugawa": "11:17",
                "kusugawa": "11:21",
                "asahi": "11:23",
                "miyaura_elem": "11:25",
                "a_coop": "11:26",
                "kobara": "11:27",
                "miyanoura": "11:29",
                "miyanoura_port": "10:09",
                "fukagawa": "16:14",
                "shitoko": "16:21",
                "hitomaru": "16:26",
                "yoshida": "16:32",
                "inakahama": "16:39",
                "nagata": "16:42",
                "arakawa_trailhead": "17:00"
              },
              "dest": "nagata",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "kurio_bashi": "13:14",
                "naka": "13:19",
                "yunuma": "13:27",
                "kojima": "13:35",
                "hotel_yakushima": "11:30",
                "saman_hotel": "11:36",
                "onokaido": "11:37",
                "hara": "11:42",
                "mugi": "11:45",
                "hirano": "11:53",
                "morihisa_jinja": "11:57",
                "makino": "11:58",
                "anbo": "11:59",
                "anbo_port": "10:53",
                "police_mae": "12:05",
                "gocho_mae": "12:07",
                "funayuki": "12:10",
                "towaho": "12:14",
                "hayasaki": "12:17",
                "airport": "12:19",
                "shionomichi": "12:20",
                "kozeta": "12:24",
                "kunugawa": "12:27",
                "kusugawa": "12:31",
                "asahi": "12:33",
                "miyaura_elem": "12:35",
                "a_coop": "12:36",
                "kobara": "12:37",
                "miyanoura": "12:39",
                "miyanoura_port": "10:40",
                "fukagawa": "18:15",
                "shitoko": "18:22",
                "hitomaru": "18:27",
                "yoshida": "18:33",
                "inakahama": "18:40",
                "nagata": "18:43",
                "arakawa_trailhead": "17:45"
              },
              "dest": "nagata",
              "destNote": {
                "ja": "永田"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "kurio_bashi": "13:44",
                "naka": "13:49",
                "yunuma": "13:57",
                "kojima": "14:05",
                "hotel_yakushima": "12:40",
                "saman_hotel": "12:46",
                "onokaido": "12:47",
                "hara": "12:52",
                "mugi": "12:55",
                "hirano": "13:03",
                "morihisa_jinja": "13:07",
                "makino": "13:08",
                "anbo": "13:09",
                "anbo_port": "12:03",
                "police_mae": "13:15",
                "gocho_mae": "13:17",
                "funayuki": "13:20",
                "towaho": "13:24",
                "hayasaki": "13:27",
                "airport": "13:29",
                "shionomichi": "13:30",
                "kozeta": "13:34",
                "kunugawa": "13:37",
                "kusugawa": "13:41",
                "asahi": "13:43",
                "miyaura_elem": "13:45",
                "a_coop": "13:46",
                "kobara": "13:47",
                "miyanoura": "13:49",
                "miyanoura_port": "11:34"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "kurio_bashi": "15:29",
                "naka": "15:34",
                "yunuma": "15:42",
                "kojima": "15:50",
                "hotel_yakushima": "13:40",
                "saman_hotel": "13:46",
                "onokaido": "13:47",
                "hara": "13:52",
                "mugi": "13:55",
                "hirano": "14:03",
                "morihisa_jinja": "14:07",
                "makino": "14:08",
                "anbo": "14:09",
                "anbo_port": "13:13",
                "police_mae": "14:15",
                "gocho_mae": "14:17",
                "funayuki": "14:20",
                "towaho": "14:24",
                "hayasaki": "14:27",
                "airport": "14:29",
                "shionomichi": "14:30",
                "kozeta": "14:34",
                "kunugawa": "14:37",
                "kusugawa": "14:41",
                "asahi": "14:43",
                "miyaura_elem": "14:45",
                "a_coop": "14:46",
                "kobara": "14:47",
                "miyanoura": "14:49",
                "miyanoura_port": "12:44"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "kurio_bashi": "16:29",
                "naka": "16:34",
                "yunuma": "16:42",
                "kojima": "16:50",
                "hotel_yakushima": "14:10",
                "saman_hotel": "14:16",
                "onokaido": "14:17",
                "hara": "14:22",
                "mugi": "14:25",
                "hirano": "14:33",
                "morihisa_jinja": "14:37",
                "makino": "14:38",
                "anbo": "14:39",
                "anbo_port": "14:13",
                "police_mae": "14:45",
                "gocho_mae": "14:47",
                "funayuki": "14:50",
                "towaho": "14:54",
                "hayasaki": "14:57",
                "airport": "14:59",
                "shionomichi": "15:00",
                "kozeta": "15:04",
                "kunugawa": "15:07",
                "kusugawa": "15:11",
                "asahi": "15:13",
                "miyaura_elem": "15:15",
                "a_coop": "15:16",
                "kobara": "15:17",
                "miyanoura": "15:19",
                "miyanoura_port": "13:54"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "永田"
              }
            },
            {
              "days": [
                "saturday"
              ],
              "times": {
                "kurio_bashi": "17:49",
                "naka": "17:54",
                "yunuma": "18:02",
                "kojima": "18:10",
                "hotel_yakushima": "15:00",
                "saman_hotel": "15:06",
                "onokaido": "15:07",
                "hara": "15:12",
                "mugi": "15:15",
                "hirano": "15:23",
                "morihisa_jinja": "15:27",
                "makino": "15:28",
                "anbo": "15:29",
                "anbo_port": "14:43",
                "police_mae": "15:31",
                "gocho_mae": "15:33",
                "funayuki": "15:36",
                "towaho": "15:40",
                "hayasaki": "15:43",
                "airport": "15:45",
                "shionomichi": "15:46",
                "kozeta": "15:50",
                "kunugawa": "15:53",
                "kusugawa": "15:57",
                "asahi": "15:59",
                "miyaura_elem": "16:01",
                "a_coop": "16:02",
                "kobara": "16:03",
                "miyanoura": "16:05",
                "miyanoura_port": "14:54"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "saturday"
              ],
              "times": {
                "hotel_yakushima": "15:55",
                "saman_hotel": "16:01",
                "onokaido": "16:02",
                "hara": "16:07",
                "mugi": "16:10",
                "hirano": "16:18",
                "morihisa_jinja": "16:22",
                "makino": "16:23",
                "anbo": "16:24",
                "police_mae": "16:30",
                "gocho_mae": "16:32",
                "funayuki": "16:35",
                "towaho": "16:39",
                "hayasaki": "16:42",
                "airport": "16:44",
                "shionomichi": "16:45",
                "kozeta": "16:49",
                "kunugawa": "16:52",
                "kusugawa": "16:56",
                "asahi": "16:58",
                "miyaura_elem": "17:00",
                "a_coop": "17:01",
                "kobara": "17:02",
                "miyanoura": "17:04",
                "miyanoura_port": "15:24"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "times": {
                "hotel_yakushima": "16:55",
                "saman_hotel": "17:01",
                "onokaido": "17:02",
                "hara": "17:07",
                "mugi": "17:10",
                "hirano": "17:18",
                "morihisa_jinja": "17:22",
                "makino": "17:15",
                "anbo": "17:16",
                "anbo_port": "16:28",
                "police_mae": "17:18",
                "gocho_mae": "17:20",
                "funayuki": "17:23",
                "towaho": "17:27",
                "hayasaki": "17:30",
                "airport": "17:32",
                "shionomichi": "17:33",
                "kozeta": "17:37",
                "kunugawa": "17:40",
                "kusugawa": "17:44",
                "asahi": "17:46",
                "miyaura_elem": "17:48",
                "a_coop": "17:49",
                "kobara": "17:50",
                "miyanoura": "17:52",
                "miyanoura_port_early": "17:55",
                "miyanoura_port": "16:10"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "永田"
              }
            },
            {
              "days": [
                "sunday_holiday"
              ],
              "times": {
                "hotel_yakushima": "18:15",
                "saman_hotel": "18:21",
                "onokaido": "18:22",
                "hara": "18:27",
                "mugi": "18:30",
                "hirano": "18:38",
                "morihisa_jinja": "18:42",
                "makino": "17:23",
                "anbo": "17:24",
                "police_mae": "17:30",
                "gocho_mae": "17:34",
                "funayuki": "17:37",
                "towaho": "17:41",
                "hayasaki": "17:44",
                "airport": "17:46",
                "shionomichi": "17:47",
                "kozeta": "17:51",
                "kunugawa": "17:54",
                "kusugawa": "17:58",
                "asahi": "18:00",
                "miyaura_elem": "18:02",
                "a_coop": "18:03",
                "kobara": "18:04",
                "miyanoura": "18:06",
                "miyanoura_port": "17:09"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "makino": "18:43",
                "anbo": "18:44",
                "anbo_port": "17:28",
                "police_mae": "18:50",
                "gocho_mae": "18:54",
                "funayuki": "18:57",
                "towaho": "19:01",
                "hayasaki": "19:04",
                "airport": "19:06",
                "shionomichi": "19:07",
                "kozeta": "19:11",
                "kunugawa": "19:14",
                "kusugawa": "19:18",
                "asahi": "19:20",
                "miyaura_elem": "19:22",
                "a_coop": "19:23",
                "kobara": "19:24",
                "miyanoura": "19:26",
                "miyanoura_port": "18:11"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "永田"
              }
            },
            {
              "days": [
                "weekday"
              ],
              "times": {
                "anbo_port": "18:48",
                "miyanoura_port": "19:31"
              },
              "dest": "miyanoura_port",
              "destNote": {
                "ja": "宮之浦港"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "shiratani",
      "operator": "taneyaku",
      "name": {
        "ja": "白谷雲水峡線",
        "zh": "白谷云水峡线",
        "en": "Shiratani Unsuikyo"
      },
      "directions": [
        {
          "id": "to",
          "label": {
            "ja": "白谷雲水峡行",
            "zh": "往白谷",
            "en": "To Shiratani"
          },
          "stops": [
            "miyanoura_port",
            "miyanoura_port_entrance",
            "miyanoura",
            "kobara",
            "ushiroka_park",
            "shiratani"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "8:20",
                "miyanoura_port_entrance": "8:21",
                "miyanoura": "8:23",
                "kobara": "8:25",
                "ushiroka_park": "8:27",
                "shiratani": "8:55"
              },
              "note": {
                "ja": "小原町で安房方面行きに乗換",
                "zh": "在小原町换乘往安房方向",
                "en": "Transfer at Kobara for Anbo-bound buses"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "10:05",
                "miyanoura_port_entrance": "10:06",
                "miyanoura": "10:08",
                "kobara": "10:10",
                "ushiroka_park": "10:12",
                "shiratani": "10:40"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "13:10",
                "miyanoura_port_entrance": "13:11",
                "miyanoura": "13:13",
                "kobara": "13:15",
                "ushiroka_park": "13:17",
                "shiratani": "13:45"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "15:30",
                "miyanoura_port_entrance": "15:31",
                "miyanoura": "15:33",
                "kobara": "15:35",
                "ushiroka_park": "15:37",
                "shiratani": "16:05"
              }
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "8:20",
                "miyanoura_port_entrance": "8:21",
                "miyanoura": "8:23",
                "kobara": "8:25",
                "ushiroka_park": "8:27",
                "shiratani": "8:55"
              },
              "note": {
                "ja": "小原町で安房方面行きに乗換",
                "zh": "在小原町换乘往安房方向",
                "en": "Transfer at Kobara for Anbo-bound buses"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "10:05",
                "miyanoura_port_entrance": "10:06",
                "miyanoura": "10:08",
                "kobara": "10:10",
                "ushiroka_park": "10:12",
                "shiratani": "10:40"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "13:10",
                "miyanoura_port_entrance": "13:11",
                "miyanoura": "13:13",
                "kobara": "13:15",
                "ushiroka_park": "13:17",
                "shiratani": "13:45"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "15:30",
                "miyanoura_port_entrance": "15:31",
                "miyanoura": "15:33",
                "kobara": "15:35",
                "ushiroka_park": "15:37",
                "shiratani": "16:05"
              }
            }
          ]
        },
        {
          "id": "from",
          "label": {
            "ja": "宮之浦港行",
            "zh": "往宫之浦港",
            "en": "To Miyanoura Port"
          },
          "stops": [
            "shiratani",
            "ushiroka_park",
            "kobara",
            "miyanoura",
            "miyanoura_port_entrance",
            "miyanoura_port"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "9:00",
                "ushiroka_park": "9:23",
                "kobara": "9:25",
                "miyanoura": "9:27",
                "miyanoura_port_entrance": "9:29",
                "miyanoura_port": "9:35"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "10:40",
                "ushiroka_park": "11:03",
                "kobara": "11:05",
                "miyanoura": "11:07",
                "miyanoura_port_entrance": "11:09",
                "miyanoura_port": "11:15"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "13:45",
                "ushiroka_park": "14:08",
                "kobara": "14:10",
                "miyanoura": "14:12",
                "miyanoura_port_entrance": "14:14",
                "miyanoura_port": "14:20"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "16:10",
                "ushiroka_park": "16:33",
                "kobara": "16:35",
                "miyanoura": "16:37",
                "miyanoura_port_entrance": "16:39",
                "miyanoura_port": "16:45"
              }
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "9:00",
                "ushiroka_park": "9:23",
                "kobara": "9:25",
                "miyanoura": "9:27",
                "miyanoura_port_entrance": "9:29",
                "miyanoura_port": "9:35"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "10:40",
                "ushiroka_park": "11:03",
                "kobara": "11:05",
                "miyanoura": "11:07",
                "miyanoura_port_entrance": "11:09",
                "miyanoura_port": "11:15"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "13:45",
                "ushiroka_park": "14:08",
                "kobara": "14:10",
                "miyanoura": "14:12",
                "miyanoura_port_entrance": "14:14",
                "miyanoura_port": "14:20"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "shiratani": "16:10",
                "ushiroka_park": "16:33",
                "kobara": "16:35",
                "miyanoura": "16:37",
                "miyanoura_port_entrance": "16:39",
                "miyanoura_port": "16:45"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "arakawa",
      "operator": "taneyaku",
      "name": {
        "ja": "荒川登山バス",
        "zh": "荒川登山巴士",
        "en": "Arakawa Trail Bus"
      },
      "season": "3-11",
      "directions": [
        {
          "id": "up",
          "label": {
            "ja": "登山口行",
            "zh": "往登山口",
            "en": "To trailhead"
          },
          "stops": [
            "yakusugi_museum",
            "arakawa_trailhead"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "5:00",
                "arakawa_trailhead": "5:35"
              },
              "season": "3-11",
              "note": {
                "ja": "3～11月運行。自然館で荒川登山バスに乗換",
                "zh": "3–11月运行，在自然馆换乘登山巴士",
                "en": "Mar–Nov. Transfer at Yakusugi Museum"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "5:20",
                "arakawa_trailhead": "5:55"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "5:40",
                "arakawa_trailhead": "6:15"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "14:00",
                "arakawa_trailhead": "14:35"
              },
              "season": "3-11"
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "5:00",
                "arakawa_trailhead": "5:35"
              },
              "season": "3-11",
              "note": {
                "ja": "3～11月運行。自然館で荒川登山バスに乗換",
                "zh": "3–11月运行，在自然馆换乘登山巴士",
                "en": "Mar–Nov. Transfer at Yakusugi Museum"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "5:20",
                "arakawa_trailhead": "5:55"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "5:40",
                "arakawa_trailhead": "6:15"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "14:00",
                "arakawa_trailhead": "14:35"
              },
              "season": "3-11"
            }
          ]
        },
        {
          "id": "down",
          "label": {
            "ja": "自然館行",
            "zh": "往自然馆",
            "en": "To museum"
          },
          "stops": [
            "arakawa_trailhead",
            "yakusugi_museum"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "6:20",
                "yakusugi_museum": "6:55"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "15:00",
                "yakusugi_museum": "15:35"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "16:00",
                "yakusugi_museum": "16:35"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "16:30",
                "yakusugi_museum": "17:05"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "17:00",
                "yakusugi_museum": "17:35"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "17:45",
                "yakusugi_museum": "18:20"
              },
              "season": "3-11"
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "6:20",
                "yakusugi_museum": "6:55"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "15:00",
                "yakusugi_museum": "15:35"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "16:00",
                "yakusugi_museum": "16:35"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "16:30",
                "yakusugi_museum": "17:05"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "17:00",
                "yakusugi_museum": "17:35"
              },
              "season": "3-11"
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "arakawa_trailhead": "17:45",
                "yakusugi_museum": "18:20"
              },
              "season": "3-11"
            }
          ]
        }
      ]
    },
    {
      "id": "kigen",
      "operator": "taneyaku",
      "name": {
        "ja": "紀元杉線",
        "zh": "纪元杉线",
        "en": "Kigen Sugi"
      },
      "directions": [
        {
          "id": "to",
          "label": {
            "ja": "紀元杉行",
            "zh": "往纪元杉",
            "en": "To Kigen Sugi"
          },
          "stops": [
            "gocho_mae",
            "anbo_port",
            "anbo",
            "makino",
            "yakusugi_museum",
            "arakawa_sancho",
            "yakusugiland",
            "kigen_sugi"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "gocho_mae": "9:20",
                "anbo_port": "9:26",
                "anbo": "9:28",
                "makino": "9:29",
                "yakusugi_museum": "9:34",
                "arakawa_sancho": "10:01",
                "yakusugiland": "10:07",
                "kigen_sugi": "10:27"
              },
              "note": {
                "ja": "合庁前で紀元杉行きに接続",
                "zh": "在县厅前换乘往纪元杉",
                "en": "Connect at Govt Office for Kigen Sugi"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "gocho_mae": "13:30",
                "anbo_port": "13:36",
                "anbo": "13:38",
                "makino": "13:39",
                "yakusugi_museum": "13:44",
                "arakawa_sancho": "14:11",
                "yakusugiland": "14:17",
                "kigen_sugi": "14:37"
              }
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "gocho_mae": "9:20",
                "anbo_port": "9:26",
                "anbo": "9:28",
                "makino": "9:29",
                "yakusugi_museum": "9:34",
                "arakawa_sancho": "10:01",
                "yakusugiland": "10:07",
                "kigen_sugi": "10:27"
              },
              "note": {
                "ja": "合庁前で紀元杉行きに接続",
                "zh": "在县厅前换乘往纪元杉",
                "en": "Connect at Govt Office for Kigen Sugi"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "gocho_mae": "13:30",
                "anbo_port": "13:36",
                "anbo": "13:38",
                "makino": "13:39",
                "yakusugi_museum": "13:44",
                "arakawa_sancho": "14:11",
                "yakusugiland": "14:17",
                "kigen_sugi": "14:37"
              }
            }
          ]
        },
        {
          "id": "from",
          "label": {
            "ja": "安房方面",
            "zh": "往安房",
            "en": "Toward Anbo"
          },
          "stops": [
            "kigen_sugi",
            "yakusugiland",
            "arakawa_sancho",
            "yakusugi_museum",
            "makino",
            "anbo",
            "gocho_mae"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "kigen_sugi": "10:45",
                "yakusugiland": "11:05",
                "arakawa_sancho": "11:11",
                "yakusugi_museum": "11:38",
                "makino": "11:43",
                "anbo": "11:44",
                "gocho_mae": "11:48"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "kigen_sugi": "14:55",
                "yakusugiland": "15:15",
                "arakawa_sancho": "15:21",
                "yakusugi_museum": "15:48",
                "makino": "15:53",
                "anbo": "15:54",
                "gocho_mae": "15:58"
              }
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "kigen_sugi": "10:45",
                "yakusugiland": "11:05",
                "arakawa_sancho": "11:11",
                "yakusugi_museum": "11:38",
                "makino": "11:43",
                "anbo": "11:44",
                "gocho_mae": "11:48"
              }
            },
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "kigen_sugi": "14:55",
                "yakusugiland": "15:15",
                "arakawa_sancho": "15:21",
                "yakusugi_museum": "15:48",
                "makino": "15:53",
                "anbo": "15:54",
                "gocho_mae": "15:58"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "matsubanda_core",
      "operator": "matsubanda",
      "name": {
        "ja": "早朝・夕方便",
        "zh": "早晚班次",
        "en": "Early / evening service"
      },
      "season": "12-2",
      "directions": [
        {
          "id": "out",
          "label": {
            "ja": "自然館行（早朝）",
            "zh": "往自然馆（早班）",
            "en": "To museum (early)"
          },
          "stops": [
            "miyanoura_port",
            "miyanoura_port_entrance",
            "miyanoura",
            "kobara",
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
            "yakusugi_museum"
          ],
          "trips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "4:00",
                "miyanoura_port_entrance": "4:01",
                "miyanoura": "4:04",
                "kobara": "4:05",
                "a_coop": "4:07",
                "miyaura_elem": "4:08",
                "koko_mae": "4:09",
                "asahi": "4:10",
                "kusugawa": "4:12",
                "kunugawa": "4:16",
                "kozeta": "4:19",
                "shionomichi": "4:23",
                "airport": "4:24",
                "hayasaki": "4:26",
                "takamibashi": "4:27",
                "towaho": "4:30",
                "funayuki": "4:33",
                "chuo": "4:36",
                "gocho_mae": "4:36",
                "police_mae": "4:37",
                "anbo_port": "4:40",
                "naka_iin_mae": "4:41",
                "anbo": "4:42",
                "makino": "4:43",
                "yakusugi_museum": "4:48"
              },
              "dest": "yakusugi_museum",
              "note": {
                "ja": "冬季（12/1–2/28）運行。ゆったり満喫券・IC不可。",
                "zh": "冬季运行，无券/IC。",
                "en": "Winter (Dec 1–Feb 28). No day pass or IC."
              }
            }
          ],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "miyanoura_port": "4:00",
                "miyanoura_port_entrance": "4:01",
                "miyanoura": "4:04",
                "kobara": "4:05",
                "a_coop": "4:07",
                "miyaura_elem": "4:08",
                "koko_mae": "4:09",
                "asahi": "4:10",
                "kusugawa": "4:12",
                "kunugawa": "4:16",
                "kozeta": "4:19",
                "shionomichi": "4:23",
                "airport": "4:24",
                "hayasaki": "4:26",
                "takamibashi": "4:27",
                "towaho": "4:30",
                "funayuki": "4:33",
                "chuo": "4:36",
                "gocho_mae": "4:36",
                "police_mae": "4:37",
                "anbo_port": "4:40",
                "naka_iin_mae": "4:41",
                "anbo": "4:42",
                "makino": "4:43",
                "yakusugi_museum": "4:48"
              },
              "dest": "yakusugi_museum",
              "note": {
                "ja": "冬季（12/1–2/28）運行。ゆったり満喫券・IC不可。",
                "zh": "冬季运行，无券/IC。",
                "en": "Winter (Dec 1–Feb 28). No day pass or IC."
              }
            }
          ]
        },
        {
          "id": "in",
          "label": {
            "ja": "宮之浦港行（夕方）",
            "zh": "往宫之浦港（傍晚）",
            "en": "To Miyanoura Port (evening)"
          },
          "stops": [
            "yakusugi_museum",
            "makino",
            "anbo",
            "anbo_port",
            "naka_iin_mae",
            "police_mae",
            "gocho_mae",
            "chuo",
            "funayuki",
            "towaho",
            "takamibashi",
            "hayasaki",
            "airport",
            "shionomichi",
            "kozeta",
            "kunugawa",
            "kusugawa",
            "asahi",
            "koko_mae",
            "miyaura_elem",
            "a_coop",
            "kobara",
            "miyanoura",
            "miyanoura_port_entrance",
            "miyanoura_port"
          ],
          "trips": [],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {
                "yakusugi_museum": "16:45",
                "makino": "↓",
                "anbo": "↓",
                "anbo_port": "↓",
                "naka_iin_mae": "↓",
                "police_mae": "↓",
                "gocho_mae": "↓",
                "chuo": "↓",
                "funayuki": "↓",
                "towaho": "↓",
                "takamibashi": "↓",
                "hayasaki": "↓",
                "airport": "↓",
                "shionomichi": "↓",
                "kozeta": "↓",
                "kunugawa": "↓",
                "kusugawa": "↓",
                "asahi": "↓",
                "koko_mae": "↓",
                "miyaura_elem": "↓",
                "a_coop": "↓",
                "kobara": "↓",
                "miyanoura": "↓",
                "miyanoura_port_entrance": "↓",
                "miyanoura_port": "↓"
              },
              "dest": "miyanoura_port",
              "note": {
                "ja": "下山時間の都合により出発が遅れる場合あり",
                "zh": "因下山时间关系，发车可能延迟",
                "en": "Departure may be delayed due to descent schedule"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "matsubanda_shiratani",
      "operator": "matsubanda",
      "name": {
        "ja": "白谷雲水峡線",
        "zh": "白谷云水峡线",
        "en": "Shiratani Unsuikyo"
      },
      "directions": [
        {
          "id": "to",
          "label": {
            "ja": "白谷雲水峡行",
            "zh": "往白谷",
            "en": "To Shiratani"
          },
          "stops": [
            "miyanoura_port",
            "miyanoura_port_entrance",
            "miyanoura",
            "kobara",
            "ushiroka_park",
            "shiratani"
          ],
          "trips": [],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {},
              "suspended": true,
              "note": {
                "ja": "2026/3/1–11/30 運休（まつばんだ便）",
                "zh": "2026/3/1–11/30 停运（松叶班次）",
                "en": "Suspended Mar 1–Nov 30, 2026 (Matsubanda)"
              }
            }
          ]
        },
        {
          "id": "from",
          "label": {
            "ja": "宮之浦港行",
            "zh": "往宫之浦港",
            "en": "To Miyanoura Port"
          },
          "stops": [
            "shiratani",
            "ushiroka_park",
            "kobara",
            "miyanoura",
            "miyanoura_port_entrance",
            "miyanoura_port"
          ],
          "trips": [],
          "columnTrips": [
            {
              "days": [
                "weekday",
                "saturday",
                "sunday_holiday"
              ],
              "times": {},
              "suspended": true,
              "note": {
                "ja": "2026/3/1–11/30 運休（まつばんだ便）",
                "zh": "2026/3/1–11/30 停运（松叶班次）",
                "en": "Suspended Mar 1–Nov 30, 2026 (Matsubanda)"
              }
            }
          ]
        }
      ]
    }
  ],
  "presets": [
    {
      "from": "yakusugi_museum",
      "to": "arakawa_trailhead",
      "tag": "tourist"
    },
    {
      "from": "miyanoura_port",
      "to": "anbo",
      "tag": "core"
    },
    {
      "from": "miyanoura_port",
      "to": "airport",
      "tag": "core"
    },
    {
      "from": "miyanoura_port",
      "to": "yakusugi_museum",
      "tag": "core"
    },
    {
      "from": "miyanoura_port",
      "to": "shiratani",
      "tag": "tourist"
    },
    {
      "from": "anbo_port",
      "to": "miyanoura_port",
      "tag": "core"
    },
    {
      "from": "airport",
      "to": "miyanoura_port",
      "tag": "core"
    },
    {
      "from": "miyanoura_port",
      "to": "okawa_falls",
      "tag": "tourist"
    },
    {
      "from": "gocho_mae",
      "to": "kigen_sugi",
      "tag": "tourist"
    }
  ]
};
