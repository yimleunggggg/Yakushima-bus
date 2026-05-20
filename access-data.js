/** 上岛交通 — scripts/build_access_data.py 生成；数据 sources/access/ */
const ACCESS_DATA = {
  "meta": {
    "revision": "2026-04-01",
    "updatedAt": "2026-05-20",
    "activeSeason": "summer_2026",
    "seasonRange": {
      "from": "2026-04-01",
      "to": "2026-06-30"
    },
    "sources": {
      "jetfoil": "https://www.tykousoku.jp/fare_time/",
      "ferry": "https://ferryyakusima2.com/timetable",
      "airportShuttle": "https://nangoku-kotsu.com/ashuttle/kagoshima/",
      "pass": "https://www.iwasaki-corp.com/kagoshima_kotsu/route-bus/yakushima-free-pass/",
      "yakukan": "https://yakukan.jp/trans/",
      "yakukanAbout": "https://yakukan.jp/about/"
    },
    "sourceLabels": {
      "jetfoil": {
        "ja": "種子屋久高速船（トッピー・ロケット）",
        "zh": "种子屋久高速船（Toppy/Rocket）",
        "en": "TaneYaku Jetfoil (Toppy/Rocket)"
      },
      "ferry": {
        "ja": "フェリー屋久島2（折田汽船）",
        "zh": "屋久岛2号渡轮（折田汽船）",
        "en": "Ferry Yakushima 2 (Orita Steamship)"
      },
      "airportShuttle": {
        "ja": "南国交通 空港連絡バス",
        "zh": "南国交通 机场联络巴士",
        "en": "Nangoku Kotsu Airport Shuttle"
      },
      "pass": {
        "ja": "屋久島ゆったり満喫乗車券",
        "zh": "屋久岛悠享乘车券",
        "en": "Yakushima day pass"
      },
      "yakukan": {
        "ja": "屋久島観光協会 交通",
        "zh": "屋久岛观光协会 交通",
        "en": "Yakushima tourism — transport"
      },
      "yakukanAbout": {
        "ja": "屋久島観光協会",
        "zh": "屋久岛观光协会",
        "en": "Yakushima tourism association"
      }
    }
  },
  "intro": {
    "ja": "鹿児島から屋久島へは高速船（約2–3時間）かフェリー（約4時間）が一般的です。島内は路線バス（時刻表タブ）が中心。最新ダイヤ・運休は各社公式を確認してください。",
    "zh": "从鹿儿岛到屋久岛通常乘高速船（约2–3小时）或渡轮（约4小时）。岛上以公交为主（见时刻表页）。请以各运营商最新公告为准。",
    "en": "Reach Yakushima from Kagoshima by jetfoil (~2–3h) or ferry (~4h). On-island travel is mostly by route bus (Timetable tab). Check each operator for latest schedules."
  },
  "sections": [
    {
      "id": "jetfoil_out",
      "sourceKey": "jetfoil",
      "title": {
        "ja": "高速船：鹿児島 → 屋久島",
        "zh": "高速船：鹿儿岛 → 屋久岛",
        "en": "Jetfoil: Kagoshima → Yakushima"
      },
      "note": {
        "ja": "夏ダイヤ（2026-04-01–2026-06-30）。2026/4/1–6/30 夏ダイヤ（公式）。出発：鹿児島本港新港ふ頭。",
        "zh": "夏季班次（2026-04-01–2026-06-30）。2026/4/1–6/30 夏季时刻（官网）。出发：鹿儿岛本港新港码头。",
        "en": "Summer schedule (2026-04-01–2026-06-30). Summer 2026 (1 Apr–30 Jun, official). Departs Kagoshima Shin-ko."
      },
      "columns": [
        {
          "key": "no",
          "label": {
            "ja": "便",
            "zh": "班次",
            "en": "No."
          }
        },
        {
          "key": "dep",
          "label": {
            "ja": "鹿児島発",
            "zh": "鹿儿岛发",
            "en": "Dep. Kagoshima"
          }
        },
        {
          "key": "arr",
          "label": {
            "ja": "着",
            "zh": "到",
            "en": "Arr."
          }
        },
        {
          "key": "port",
          "label": {
            "ja": "着港",
            "zh": "到达港",
            "en": "Port"
          }
        },
        {
          "key": "via",
          "label": {
            "ja": "経路",
            "zh": "路线",
            "en": "Route"
          }
        }
      ],
      "rows": [
        {
          "no": "111",
          "dep": "07:30",
          "arr": "10:20",
          "port": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "種子島・西之表経由",
            "zh": "经种子岛·西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "112",
          "dep": "07:45",
          "arr": "09:35",
          "port": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "直航",
            "zh": "直航",
            "en": "Direct"
          }
        },
        {
          "no": "114",
          "dep": "10:10",
          "arr": "12:55",
          "port": {
            "ja": "安房",
            "zh": "安房",
            "en": "Anbo"
          },
          "via": {
            "ja": "種子島・西之表経由",
            "zh": "经种子岛·西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "127",
          "dep": "13:00",
          "arr": "15:35",
          "port": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "種子島・西之表経由",
            "zh": "经种子岛·西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "117",
          "dep": "13:35",
          "arr": "15:25",
          "port": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "直航",
            "zh": "直航",
            "en": "Direct"
          }
        },
        {
          "no": "118",
          "dep": "15:45",
          "arr": "18:20",
          "port": {
            "ja": "安房",
            "zh": "安房",
            "en": "Anbo"
          },
          "via": {
            "ja": "種子島・西之表経由",
            "zh": "经种子岛·西之表",
            "en": "Via Nishinoomote"
          }
        }
      ]
    },
    {
      "id": "jetfoil_in",
      "sourceKey": "jetfoil",
      "title": {
        "ja": "高速船：屋久島 → 鹿児島",
        "zh": "高速船：屋久岛 → 鹿儿岛",
        "en": "Jetfoil: Yakushima → Kagoshima"
      },
      "note": {
        "ja": "夏ダイヤ（2026-04-01–2026-06-30）。2026/4/1–6/30 夏ダイヤ（公式）。出発：鹿児島本港新港ふ頭。",
        "zh": "夏季班次（2026-04-01–2026-06-30）。2026/4/1–6/30 夏季时刻（官网）。出发：鹿儿岛本港新港码头。",
        "en": "Summer schedule (2026-04-01–2026-06-30). Summer 2026 (1 Apr–30 Jun, official). Departs Kagoshima Shin-ko."
      },
      "columns": [
        {
          "key": "no",
          "label": {
            "ja": "便",
            "zh": "班次",
            "en": "No."
          }
        },
        {
          "key": "from",
          "label": {
            "ja": "発港",
            "zh": "出发港",
            "en": "From"
          }
        },
        {
          "key": "dep",
          "label": {
            "ja": "発",
            "zh": "发",
            "en": "Dep."
          }
        },
        {
          "key": "arr",
          "label": {
            "ja": "鹿児島着",
            "zh": "鹿儿岛到",
            "en": "Arr. Kagoshima"
          }
        },
        {
          "key": "via",
          "label": {
            "ja": "備考",
            "zh": "备注",
            "en": "Note"
          }
        }
      ],
      "rows": [
        {
          "no": "121",
          "dep": "07:00",
          "arr": "09:40",
          "from": {
            "ja": "安房",
            "zh": "安房",
            "en": "Anbo"
          },
          "via": {
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "112",
          "dep": "10:00",
          "arr": "12:45",
          "from": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "111",
          "dep": "10:40",
          "arr": "12:30",
          "from": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "直航",
            "zh": "直航",
            "en": "Direct"
          }
        },
        {
          "no": "128",
          "dep": "13:10",
          "arr": "15:55",
          "from": {
            "ja": "安房",
            "zh": "安房",
            "en": "Anbo"
          },
          "via": {
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "117",
          "dep": "15:45",
          "arr": "18:20",
          "from": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "127",
          "dep": "16:00",
          "arr": "17:50",
          "from": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "直航",
            "zh": "直航",
            "en": "Direct"
          }
        }
      ]
    },
    {
      "id": "jetfoil_fare",
      "sourceKey": "jetfoil",
      "title": {
        "ja": "高速船：運賃（片道・往復割引）",
        "zh": "高速船：运价（单程·往返优惠）",
        "en": "Jetfoil fares (one-way & round-trip)"
      },
      "note": {
        "ja": "2026年5月11日～（種子島・屋久島交通 公式）。往復割引は7日間有効。",
        "zh": "2026年5月11日起（种子岛·屋久岛交通官网）。往返优惠 7 日内有效。",
        "en": "From 11 May 2026 (TaneYaku official). Round-trip discount valid 7 days."
      },
      "columns": [
        {
          "key": "route",
          "label": {
            "ja": "区間",
            "zh": "区间",
            "en": "Route"
          }
        },
        {
          "key": "adult",
          "label": {
            "ja": "大人",
            "zh": "成人",
            "en": "Adult"
          }
        },
        {
          "key": "child",
          "label": {
            "ja": "小児",
            "zh": "儿童",
            "en": "Child"
          }
        }
      ],
      "rows": [
        {
          "route": {
            "ja": "鹿児島↔屋久島（宮之浦/安房）",
            "zh": "鹿儿岛↔屋久岛（宫之浦/安房）",
            "en": "Kagoshima ↔ Yakushima (Miyanoura/Anbo)"
          },
          "adult": "¥14,000",
          "child": "¥7,000"
        },
        {
          "route": {
            "ja": "往復割引（鹿児島↔屋久島（宮之浦/安房）・大人）",
            "zh": "往返优惠（鹿儿岛↔屋久岛（宫之浦/安房）·成人）",
            "en": "Round-trip (Kagoshima ↔ Yakushima (Miyanoura/Anbo), adult)"
          },
          "adult": "¥25,900",
          "child": "¥12,950"
        },
        {
          "route": {
            "ja": "鹿児島↔種子島（参考）",
            "zh": "鹿儿岛↔种子岛（参考）",
            "en": "Kagoshima ↔ Tanegashima (reference)"
          },
          "adult": "¥12,000",
          "child": "¥6,000"
        },
        {
          "route": {
            "ja": "往復割引（鹿児島↔種子島（参考）・大人）",
            "zh": "往返优惠（鹿儿岛↔种子岛（参考）·成人）",
            "en": "Round-trip (Kagoshima ↔ Tanegashima (reference), adult)"
          },
          "adult": "¥22,200",
          "child": "¥11,100"
        }
      ]
    },
    {
      "id": "ferry",
      "sourceKey": "ferry",
      "title": {
        "ja": "フェリー屋久島2（1日1便）",
        "zh": "屋久岛2号渡轮（每日1班）",
        "en": "Ferry Yakushima 2 (daily)"
      },
      "note": {
        "ja": "繁忙期（GW・お盆・年末年始）は運賃・ダイヤが異なる場合あり。",
        "zh": "黄金周、盂兰盆、年末年初运价/班次可能不同。",
        "en": "Fares/schedules may differ in peak seasons (GW, Obon, New Year)."
      },
      "columns": [
        {
          "key": "from",
          "label": {
            "ja": "出発",
            "zh": "出发",
            "en": "From"
          }
        },
        {
          "key": "dep",
          "label": {
            "ja": "発",
            "zh": "发",
            "en": "Dep."
          }
        },
        {
          "key": "to",
          "label": {
            "ja": "到着",
            "zh": "到达",
            "en": "To"
          }
        },
        {
          "key": "arr",
          "label": {
            "ja": "着",
            "zh": "到",
            "en": "Arr."
          }
        }
      ],
      "rows": [
        {
          "dir": "to_yakushima",
          "dep": "08:30",
          "arr": "12:30",
          "from": {
            "ja": "鹿児島本港南ふ頭",
            "zh": "鹿儿岛本港南码头",
            "en": "Kagoshima Minami Port"
          },
          "to": {
            "ja": "宮之浦港",
            "zh": "宫之浦港",
            "en": "Miyanoura Port"
          }
        },
        {
          "dir": "to_kagoshima",
          "dep": "13:30",
          "arr": "17:40",
          "from": {
            "ja": "宮之浦港",
            "zh": "宫之浦港",
            "en": "Miyanoura Port"
          },
          "to": {
            "ja": "鹿児島本港南ふ頭",
            "zh": "鹿儿岛本港南码头",
            "en": "Kagoshima Minami Port"
          }
        }
      ]
    },
    {
      "id": "ferry_fare",
      "sourceKey": "ferry",
      "title": {
        "ja": "フェリー：運賃目安（片道・通常期）",
        "zh": "渡轮：运价参考（单程·平季）",
        "en": "Ferry: sample one-way fares (regular season)"
      },
      "columns": [
        {
          "key": "type",
          "label": {
            "ja": "区分",
            "zh": "类型",
            "en": "Class"
          }
        },
        {
          "key": "adult",
          "label": {
            "ja": "大人",
            "zh": "成人",
            "en": "Adult"
          }
        },
        {
          "key": "child",
          "label": {
            "ja": "小児",
            "zh": "儿童",
            "en": "Child"
          }
        }
      ],
      "rows": [
        {
          "type": {
            "ja": "二等",
            "zh": "二等",
            "en": "Standard"
          },
          "adult": "¥6,500",
          "child": "¥3,200"
        },
        {
          "type": {
            "ja": "一等",
            "zh": "一等",
            "en": "First"
          },
          "adult": "¥9,000",
          "child": "¥4,500"
        }
      ]
    },
    {
      "id": "pass",
      "sourceKey": "pass",
      "title": {
        "ja": "屋久島ゆったり満喫乗車券",
        "zh": "屋久岛悠享乘车券",
        "en": "Yakushima day pass"
      },
      "note": {
        "ja": "荒川登山バス・観光バス・まつばんだ便は対象外。自然館等4施設で100円割引券付。",
        "zh": "不含荒川登山巴士、观光巴士、松ばんだ班次。附自然馆等4处100日元折扣券。",
        "en": "Excludes Arakawa bus, tour buses & Matsubanda. Includes ¥100-off coupons at 4 sites."
      },
      "columns": [
        {
          "key": "days",
          "label": {
            "ja": "券種",
            "zh": "票种",
            "en": "Ticket"
          }
        },
        {
          "key": "adult",
          "label": {
            "ja": "大人",
            "zh": "成人",
            "en": "Adult"
          }
        },
        {
          "key": "child",
          "label": {
            "ja": "小児",
            "zh": "儿童",
            "en": "Child"
          }
        }
      ],
      "rows": [
        {
          "days": {
            "ja": "1日",
            "zh": "1日",
            "en": "1-day"
          },
          "adult": "¥2,500",
          "child": "¥1,250"
        },
        {
          "days": {
            "ja": "3日",
            "zh": "3日",
            "en": "3-day"
          },
          "adult": "¥4,000",
          "child": "¥2,000"
        },
        {
          "days": {
            "ja": "4日",
            "zh": "4日",
            "en": "4-day"
          },
          "adult": "¥5,000",
          "child": "¥2,500"
        }
      ]
    }
  ],
  "links": [
    {
      "key": "yakukan",
      "label": {
        "ja": "屋久島観光協会（交通）",
        "zh": "屋久岛观光协会（交通）",
        "en": "Yakushima tourism — transport"
      }
    },
    {
      "key": "jetfoil",
      "label": {
        "ja": "高速船 予約・時刻表",
        "zh": "高速船 预约·时刻表",
        "en": "Jetfoil booking & timetable"
      }
    },
    {
      "key": "ferry",
      "label": {
        "ja": "フェリー屋久島2",
        "zh": "屋久岛2号渡轮",
        "en": "Ferry Yakushima 2"
      }
    },
    {
      "key": "pass",
      "label": {
        "ja": "ゆったり満喫乗車券（詳細）",
        "zh": "悠享乘车券（详情）",
        "en": "Day pass details"
      }
    }
  ],
  "disclaimer": {
    "ja": "時刻・運賃は各社公式情報に基づく参考です。季節ダイヤ・運休・改定があるため、乗船・乗車前に必ず公式サイトで確認してください。",
    "zh": "时刻与票价仅供参考，均来自各运营商公开信息。季节班次、停运与改定频繁，出行前请务必查阅官网。",
    "en": "Times and fares are reference only from official sources. Check each operator before travel—seasonal schedules and suspensions apply."
  }
};
