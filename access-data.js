/** 上岛交通 — scripts/build_access_data.py 生成；数据 sources/access/ */
const ACCESS_DATA = {
  "meta": {
    "revision": "2026-10-09",
    "updatedAt": "2026-10-09",
    "activeSeason": "winter_2026",
    "seasonRange": {
      "from": "2026-10-01",
      "to": "2027-02-28"
    },
    "sources": {
      "jetfoil": "https://www.tykousoku.jp/fare_time/",
      "jetfoilBook": "https://www.tykousoku.jp/reserve/",
      "ferry": "https://ferryyakusima2.com/timetable",
      "airportShuttle": "https://nangoku-kotsu.com/ashuttle/kagoshima/",
      "pass": "https://www.iwasaki-corp.com/kagoshima_kotsu/route-bus/yakushima-free-pass/",
      "yakukan": "https://yakukan.jp/on-island.html",
      "yakukanAbout": "https://yakukan.jp/tourism-association/"
    },
    "sourceLabels": {
      "jetfoil": {
        "ja": "種子屋久高速船（トッピー・ロケット）",
        "zh": "种子屋久高速船（Toppy/Rocket）",
        "en": "TaneYaku Jetfoil (Toppy/Rocket)"
      },
      "jetfoilBook": {
        "ja": "高速船 オンライン予約",
        "zh": "高速船 在线预约",
        "en": "Jetfoil online booking"
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
  "jetfoilSeasons": [
    {
      "id": "summer_2026",
      "label": {
        "ja": "夏ダイヤ",
        "zh": "夏季班次",
        "en": "Summer schedule"
      },
      "validFrom": "2026-04-01",
      "validTo": "2026-06-30",
      "note": {
        "ja": "公式時刻表に基づく。",
        "zh": "依据官网时刻表。",
        "en": "Based on official timetable."
      },
      "toYakushima": [
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
      ],
      "toKagoshima": [
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
      ],
      "notes": {
        "jetfoil_out": {
          "ja": "夏ダイヤ（2026-04-01–2026-06-30）。鹿児島発：本港南ふ頭（同一ターミナル）。屋久島側は宮之浦または安房着（着港欄）。 公式時刻表に基づく。",
          "zh": "夏季班次（2026-04-01–2026-06-30）。鹿儿岛出发：本港南码头（同一码头）。屋久岛侧到达宫之浦或安房（见「到达港」）。 依据官网时刻表。",
          "en": "Summer schedule (2026-04-01–2026-06-30). Departs Kagoshima Honko South Pier (one terminal). Arrives Miyanoura or Anbo on Yakushima (see Port). Based on official timetable."
        },
        "jetfoil_in": {
          "ja": "夏ダイヤ（2026-04-01–2026-06-30）。屋久島発：宮之浦または安房（発港欄）。鹿児島着：本港南ふ頭。 公式時刻表に基づく。",
          "zh": "夏季班次（2026-04-01–2026-06-30）。屋久岛出发：宫之浦或安房（见「出发港」）。到达鹿儿岛本港南码头。 依据官网时刻表。",
          "en": "Summer schedule (2026-04-01–2026-06-30). Departs Miyanoura or Anbo on Yakushima (see From). Arrives Kagoshima Honko South Pier. Based on official timetable."
        }
      }
    },
    {
      "id": "winter_2025",
      "label": {
        "ja": "冬ダイヤ",
        "zh": "冬季班次",
        "en": "Winter schedule"
      },
      "validFrom": "2025-10-01",
      "validTo": "2026-02-28",
      "note": {
        "ja": "2025/10/1–2026/2/28 冬ダイヤ（公式）。",
        "zh": "2025/10/1–2026/2/28 冬季时刻（官网）。",
        "en": "Winter 2025–26 (official)."
      },
      "toYakushima": [
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
          "arr": "09:45",
          "port": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "指宿経由",
            "zh": "经指宿",
            "en": "Via Ibusuki"
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
      ],
      "toKagoshima": [
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
            "ja": "—",
            "zh": "—",
            "en": "—"
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
            "ja": "—",
            "zh": "—",
            "en": "—"
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
            "ja": "—",
            "zh": "—",
            "en": "—"
          }
        },
        {
          "no": "117",
          "dep": "15:45",
          "arr": "18:30",
          "from": {
            "ja": "宮之浦",
            "zh": "宫之浦",
            "en": "Miyanoura"
          },
          "via": {
            "ja": "—",
            "zh": "—",
            "en": "—"
          }
        }
      ],
      "notes": {
        "jetfoil_out": {
          "ja": "冬ダイヤ（2025-10-01–2026-02-28）。鹿児島発：本港南ふ頭（同一ターミナル）。屋久島側は宮之浦または安房着（着港欄）。 2025/10/1–2026/2/28 冬ダイヤ（公式）。",
          "zh": "冬季班次（2025-10-01–2026-02-28）。鹿儿岛出发：本港南码头（同一码头）。屋久岛侧到达宫之浦或安房（见「到达港」）。 2025/10/1–2026/2/28 冬季时刻（官网）。",
          "en": "Winter schedule (2025-10-01–2026-02-28). Departs Kagoshima Honko South Pier (one terminal). Arrives Miyanoura or Anbo on Yakushima (see Port). Winter 2025–26 (official)."
        },
        "jetfoil_in": {
          "ja": "冬ダイヤ（2025-10-01–2026-02-28）。屋久島発：宮之浦または安房（発港欄）。鹿児島着：本港南ふ頭。 2025/10/1–2026/2/28 冬ダイヤ（公式）。",
          "zh": "冬季班次（2025-10-01–2026-02-28）。屋久岛出发：宫之浦或安房（见「出发港」）。到达鹿儿岛本港南码头。 2025/10/1–2026/2/28 冬季时刻（官网）。",
          "en": "Winter schedule (2025-10-01–2026-02-28). Departs Miyanoura or Anbo on Yakushima (see From). Arrives Kagoshima Honko South Pier. Winter 2025–26 (official)."
        }
      }
    },
    {
      "id": "autumn_2026",
      "label": {
        "ja": "7–9月ダイヤ",
        "zh": "7–9月班次",
        "en": "July–September schedule"
      },
      "validFrom": "2026-07-01",
      "validTo": "2026-09-30",
      "checkedAt": "2026-09-21",
      "note": {
        "ja": "公式掲載は「申請中」。出発前に運航状況をご確認ください。",
        "zh": "官网标注“申请中”，出发前请再次确认运行情况。",
        "en": "The official timetable is marked pending approval. Recheck service status before departure."
      },
      "toYakushima": [
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
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "112",
          "dep": "08:00",
          "arr": "09:50",
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
          "no": "129",
          "dep": "10:10",
          "arr": "12:55",
          "port": {
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
          "no": "127",
          "dep": "13:00",
          "arr": "15:35",
          "port": {
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
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        }
      ],
      "toKagoshima": [
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
          "dep": "10:05",
          "arr": "12:50",
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
      ],
      "notes": {
        "jetfoil_out": {
          "ja": "7–9月ダイヤ（2026-07-01–2026-09-30）。鹿児島発：本港南ふ頭（同一ターミナル）。屋久島側は宮之浦または安房着（着港欄）。 公式掲載は「申請中」。出発前に運航状況をご確認ください。",
          "zh": "7–9月班次（2026-07-01–2026-09-30）。鹿儿岛出发：本港南码头（同一码头）。屋久岛侧到达宫之浦或安房（见「到达港」）。 官网标注“申请中”，出发前请再次确认运行情况。",
          "en": "July–September schedule (2026-07-01–2026-09-30). Departs Kagoshima Honko South Pier (one terminal). Arrives Miyanoura or Anbo on Yakushima (see Port). The official timetable is marked pending approval. Recheck service status before departure."
        },
        "jetfoil_in": {
          "ja": "7–9月ダイヤ（2026-07-01–2026-09-30）。屋久島発：宮之浦または安房（発港欄）。鹿児島着：本港南ふ頭。 公式掲載は「申請中」。出発前に運航状況をご確認ください。",
          "zh": "7–9月班次（2026-07-01–2026-09-30）。屋久岛出发：宫之浦或安房（见「出发港」）。到达鹿儿岛本港南码头。 官网标注“申请中”，出发前请再次确认运行情况。",
          "en": "July–September schedule (2026-07-01–2026-09-30). Departs Miyanoura or Anbo on Yakushima (see From). Arrives Kagoshima Honko South Pier. The official timetable is marked pending approval. Recheck service status before departure."
        }
      }
    },
    {
      "id": "winter_2026",
      "label": {
        "ja": "冬ダイヤ",
        "zh": "冬季班次",
        "en": "Winter schedule"
      },
      "validFrom": "2026-10-01",
      "validTo": "2027-02-28",
      "checkedAt": "2026-10-09",
      "note": {
        "ja": "公式掲載は「申請中」。出発前に運航状況をご確認ください。",
        "zh": "官网标注“申请中”，出发前请再次确认运行情况。",
        "en": "The official timetable is marked pending approval. Recheck service status before departure."
      },
      "toYakushima": [
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
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "112",
          "dep": "08:00",
          "arr": "09:50",
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
          "dep": "10:00",
          "arr": "12:40",
          "port": {
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
          "no": "127",
          "dep": "13:00",
          "arr": "15:30",
          "port": {
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
          "no": "117",
          "dep": "13:30",
          "arr": "15:20",
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
          "dep": "14:45",
          "arr": "17:20",
          "port": {
            "ja": "安房",
            "zh": "安房",
            "en": "Anbo"
          },
          "via": {
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        }
      ],
      "toKagoshima": [
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
          "dep": "10:05",
          "arr": "12:50",
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
          "dep": "12:55",
          "arr": "15:35",
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
      ],
      "notes": {
        "jetfoil_out": {
          "ja": "冬ダイヤ（2026-10-01–2027-02-28）。鹿児島発：本港南ふ頭（同一ターミナル）。屋久島側は宮之浦または安房着（着港欄）。 公式掲載は「申請中」。出発前に運航状況をご確認ください。",
          "zh": "冬季班次（2026-10-01–2027-02-28）。鹿儿岛出发：本港南码头（同一码头）。屋久岛侧到达宫之浦或安房（见「到达港」）。 官网标注“申请中”，出发前请再次确认运行情况。",
          "en": "Winter schedule (2026-10-01–2027-02-28). Departs Kagoshima Honko South Pier (one terminal). Arrives Miyanoura or Anbo on Yakushima (see Port). The official timetable is marked pending approval. Recheck service status before departure."
        },
        "jetfoil_in": {
          "ja": "冬ダイヤ（2026-10-01–2027-02-28）。屋久島発：宮之浦または安房（発港欄）。鹿児島着：本港南ふ頭。 公式掲載は「申請中」。出発前に運航状況をご確認ください。",
          "zh": "冬季班次（2026-10-01–2027-02-28）。屋久岛出发：宫之浦或安房（见「出发港」）。到达鹿儿岛本港南码头。 官网标注“申请中”，出发前请再次确认运行情况。",
          "en": "Winter schedule (2026-10-01–2027-02-28). Departs Miyanoura or Anbo on Yakushima (see From). Arrives Kagoshima Honko South Pier. The official timetable is marked pending approval. Recheck service status before departure."
        }
      }
    }
  ],
  "booking": {
    "title": {
      "ja": "チケットの買い方",
      "zh": "如何购票",
      "en": "How to buy tickets"
    },
    "footerHint": {
      "ja": "下で乗船日を選び、高速船ダイヤとフェリーの計画運休をご確認ください。",
      "zh": "在下方选择出行日期，查看高速船班次及渡轮计划停运。",
      "en": "Choose a travel date below for jetfoil times and planned ferry suspensions."
    },
    "items": [
      {
        "id": "jetfoil",
        "badge": {
          "ja": "オンライン可",
          "zh": "可网上预约",
          "en": "Online booking"
        },
        "duration": {
          "ja": "約2–3時間",
          "zh": "约 2–3 小时",
          "en": "~2–3 hr"
        },
        "title": {
          "ja": "高速船（トッピー・ロケット）",
          "zh": "高速船（Toppy / Rocket）",
          "en": "Jetfoil (Toppy / Rocket)"
        },
        "body": {
          "ja": "公式サイトからオンライン予約・購入できます（T&Rフレンド登録、クレジット・コンビニ払い）。乗船2ヶ月前の同一日9:00から予約開始。繁忙期は早めの予約を。",
          "zh": "可在官网在线预约购票（需注册 T&R 会员，支持信用卡/便利店支付）。一般于乘船日 2 个月前同日上午 9:00 起开放预约，旺季建议尽早订。",
          "en": "Book and pay on the official site (T&R Friend signup; card or convenience-store payment). Opens ~2 months before sailing at 9:00. Book early in peak season."
        },
        "ctaUrl": "https://www.tykousoku.jp/reserve/",
        "ctaLabel": {
          "ja": "オンライン予約（公式）",
          "zh": "在线预约（官网）",
          "en": "Book online (official)"
        }
      },
      {
        "id": "ferry",
        "badge": {
          "ja": "窓口当日",
          "zh": "码头当日购",
          "en": "Counter on day"
        },
        "duration": {
          "ja": "約4時間",
          "zh": "约 4 小时",
          "en": "~4 hr"
        },
        "title": {
          "ja": "フェリー屋久島2",
          "zh": "屋久岛2号渡轮",
          "en": "Ferry Yakushima 2"
        },
        "body": {
          "ja": "個人（12名未満）は予約不要。ネット販売はなく、出港当日に窓口で購入。出港約1時間前までにご来港ください。12名以上の団体・車両航送は電話予約（公式参照）。計画運休は下で乗船日を選んでご確認ください。",
          "zh": "普通乘客（不足12人）无需预约，不支持线上购票，出发当天到码头窗口购买，建议提前约1小时办理。12人及以上团体、运车需电话预约（见官网）。请在下方选择乘船日核对计划停运。",
          "en": "Walk-on parties of fewer than 12 need no reservation. Buy at the port counter on sailing day; arrive about 1 hour early. Groups of 12 or more and vehicles require phone reservations (see official site). Select your sailing date below to check planned suspensions."
        },
        "ctaUrl": "https://ferryyakusima2.com/terminal",
        "ctaLabel": {
          "ja": "乗り場・窓口（公式）",
          "zh": "码头窗口（官网）",
          "en": "Terminals (official)"
        }
      }
    ]
  },
  "ferryCalendar": {
    "checkedAt": "2026-10-09",
    "periods": [
      {
        "validFrom": "2026-07-01",
        "validTo": "2026-11-30",
        "announcedAt": "2026-05-08",
        "checkedAt": "2026-10-09",
        "sourceUrl": "https://ferryyakusima2.com/news/10207",
        "dates": [
          "2026-07-05",
          "2026-07-12",
          "2026-07-26",
          "2026-08-02",
          "2026-08-23",
          "2026-08-30",
          "2026-09-06",
          "2026-09-13",
          "2026-09-27",
          "2026-10-04",
          "2026-10-18",
          "2026-10-25",
          "2026-11-08",
          "2026-11-15",
          "2026-11-29"
        ]
      },
      {
        "validFrom": "2026-12-01",
        "validTo": "2027-01-31",
        "announcedAt": "2026-10-08",
        "checkedAt": "2026-10-09",
        "sourceUrl": "https://ferryyakusima2.com/news/15420",
        "dates": [
          "2026-12-06",
          "2026-12-13",
          "2026-12-20",
          "2027-01-01",
          "2027-01-03",
          "2027-01-10",
          "2027-01-17",
          "2027-01-24"
        ],
        "sourceNote": "原文1月の列挙は「1日17日」と誤記。前後の列挙と日曜日表記に基づき2027-01-17に正規化。出航前に公式へ再確認。"
      }
    ]
  },
  "sections": [
    {
      "id": "jetfoil_out",
      "kind": "schedule",
      "sourceKey": "jetfoil",
      "title": {
        "ja": "高速船：鹿児島 → 屋久島",
        "zh": "高速船：鹿儿岛 → 屋久岛",
        "en": "Jetfoil: Kagoshima → Yakushima"
      },
      "note": {
        "ja": "冬ダイヤ（2026-10-01–2027-02-28）。鹿児島発：本港南ふ頭（同一ターミナル）。屋久島側は宮之浦または安房着（着港欄）。 公式掲載は「申請中」。出発前に運航状況をご確認ください。",
        "zh": "冬季班次（2026-10-01–2027-02-28）。鹿儿岛出发：本港南码头（同一码头）。屋久岛侧到达宫之浦或安房（见「到达港」）。 官网标注“申请中”，出发前请再次确认运行情况。",
        "en": "Winter schedule (2026-10-01–2027-02-28). Departs Kagoshima Honko South Pier (one terminal). Arrives Miyanoura or Anbo on Yakushima (see Port). The official timetable is marked pending approval. Recheck service status before departure."
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
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        },
        {
          "no": "112",
          "dep": "08:00",
          "arr": "09:50",
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
          "dep": "10:00",
          "arr": "12:40",
          "port": {
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
          "no": "127",
          "dep": "13:00",
          "arr": "15:30",
          "port": {
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
          "no": "117",
          "dep": "13:30",
          "arr": "15:20",
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
          "dep": "14:45",
          "arr": "17:20",
          "port": {
            "ja": "安房",
            "zh": "安房",
            "en": "Anbo"
          },
          "via": {
            "ja": "西之表経由",
            "zh": "经西之表",
            "en": "Via Nishinoomote"
          }
        }
      ]
    },
    {
      "id": "jetfoil_in",
      "kind": "schedule",
      "sourceKey": "jetfoil",
      "title": {
        "ja": "高速船：屋久島 → 鹿児島",
        "zh": "高速船：屋久岛 → 鹿儿岛",
        "en": "Jetfoil: Yakushima → Kagoshima"
      },
      "note": {
        "ja": "冬ダイヤ（2026-10-01–2027-02-28）。屋久島発：宮之浦または安房（発港欄）。鹿児島着：本港南ふ頭。 公式掲載は「申請中」。出発前に運航状況をご確認ください。",
        "zh": "冬季班次（2026-10-01–2027-02-28）。屋久岛出发：宫之浦或安房（见「出发港」）。到达鹿儿岛本港南码头。 官网标注“申请中”，出发前请再次确认运行情况。",
        "en": "Winter schedule (2026-10-01–2027-02-28). Departs Miyanoura or Anbo on Yakushima (see From). Arrives Kagoshima Honko South Pier. The official timetable is marked pending approval. Recheck service status before departure."
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
          "dep": "10:05",
          "arr": "12:50",
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
          "dep": "12:55",
          "arr": "15:35",
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
      "kind": "fare",
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
      "fareKey": "route",
      "rows": [
        {
          "route": {
            "ja": "鹿児島↔屋久島（宮之浦/安房）",
            "zh": "鹿儿岛↔屋久岛（宫之浦/安房）",
            "en": "Kagoshima ↔ Yakushima (Miyanoura/Anbo)"
          },
          "adult": "¥14,000",
          "child": "¥7,000",
          "sub": false
        },
        {
          "route": {
            "ja": "↳ 往復割引（鹿児島↔屋久島（宮之浦/安房））",
            "zh": "↳ 往返优惠（鹿儿岛↔屋久岛（宫之浦/安房））",
            "en": "↳ Round-trip (Kagoshima ↔ Yakushima (Miyanoura/Anbo))"
          },
          "adult": "¥25,900",
          "child": "¥12,950",
          "sub": true
        },
        {
          "route": {
            "ja": "鹿児島↔種子島（参考）",
            "zh": "鹿儿岛↔种子岛（参考）",
            "en": "Kagoshima ↔ Tanegashima (reference)"
          },
          "adult": "¥12,000",
          "child": "¥6,000",
          "sub": false
        },
        {
          "route": {
            "ja": "↳ 往復割引（鹿児島↔種子島（参考））",
            "zh": "↳ 往返优惠（鹿儿岛↔种子岛（参考））",
            "en": "↳ Round-trip (Kagoshima ↔ Tanegashima (reference))"
          },
          "adult": "¥22,200",
          "child": "¥11,100",
          "sub": true
        }
      ]
    },
    {
      "id": "ferry",
      "kind": "schedule",
      "sourceKey": "ferry",
      "title": {
        "ja": "フェリー屋久島2（運航日の時刻）",
        "zh": "屋久岛2号渡轮（运行日时刻）",
        "en": "Ferry Yakushima 2 (sailing-day times)"
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
      "kind": "fare",
      "sourceKey": "ferry",
      "title": {
        "ja": "フェリー：運賃目安（片道）",
        "zh": "渡轮：运价参考（单程）",
        "en": "Ferry: sample one-way fares"
      },
      "fareKey": "type",
      "note": {
        "ja": "2026-10-01以降の公式掲載額（2026-10-09確認、燃料油価格変動調整金込み）。将来の運賃を保証するものではありません。乗船日の料金は公式でご確認ください。",
        "zh": "2026-10-01起官网列价（2026-10-09核对，含燃油调整金）。不保证未来票价不变，请在出行前核对官网。",
        "en": "Official listed fares from 2026-10-01, checked 2026-10-09, including fuel adjustment. Future fares may change; check the operator before travel."
      },
      "validity": {
        "validFrom": "2026-10-01",
        "validTo": null,
        "checkedAt": "2026-10-09",
        "sourceUrl": "https://ferryyakusima2.com/timetable",
        "changeUrl": "https://ferryyakusima2.com/news/14684",
        "includesFuelAdjustment": true
      },
      "rows": [
        {
          "type": {
            "ja": "二等",
            "zh": "二等（经济舱）",
            "en": "Standard (2nd class)"
          },
          "adult": "¥7,000",
          "child": "¥3,450"
        },
        {
          "type": {
            "ja": "一等",
            "zh": "一等（头等舱）",
            "en": "First class"
          },
          "adult": "¥9,500",
          "child": "¥4,750"
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
      "intro": {
        "ja": "種子島・屋久島交通など島内主要路線バスが、購入日から1・3・4日間乗り放題になるフリーパスです。下記の窓口で購入できます。",
        "zh": "种子岛·屋久岛交通等岛内主要公交线路通票，自购买日起 1 / 3 / 4 天内可无限次乘坐。可在下列发售点购买。",
        "en": "A multi-day pass for unlimited rides on main Yakushima route buses (Tanegashima Yakushima Kotsu, etc.). Valid 1, 3, or 4 calendar days from purchase. Buy at the offices below."
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
      "key": "jetfoilBook",
      "label": {
        "ja": "高速船 オンライン予約",
        "zh": "高速船 在线预约",
        "en": "Jetfoil online booking"
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
