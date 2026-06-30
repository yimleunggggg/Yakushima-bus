/** 元数据 — scripts/build_meta_data.py 生成 */
const META_DATA = {
  "revision": "2026",
  "updatedAt": "2026-05-20",
  "builtAt": "2026-06-29",
  "holidays": [
    "2026-01-01",
    "2026-01-12",
    "2026-02-11",
    "2026-02-23",
    "2026-03-20",
    "2026-04-29",
    "2026-05-03",
    "2026-05-04",
    "2026-05-05",
    "2026-05-06",
    "2026-07-20",
    "2026-08-11",
    "2026-09-21",
    "2026-09-22",
    "2026-09-23",
    "2026-10-12",
    "2026-11-03",
    "2026-11-23"
  ],
  "dayTypes": {
    "sundayIsHoliday": true,
    "weekday": "weekday",
    "saturday": "saturday",
    "sundayHoliday": "sunday_holiday"
  },
  "expiryWarnDays": 14,
  "datasets": {
    "timetable": {
      "revision": "2026-03-01",
      "validFrom": "2026-03-01",
      "validTo": "2026-11-30",
      "updatedAt": "2026-05-20"
    },
    "access": {
      "revision": "2026-04-01",
      "updatedAt": "2026-06-23",
      "activeSeason": "summer_2026",
      "seasonFrom": "2026-04-01",
      "seasonTo": "2026-06-30"
    }
  },
  "warnings": [
    "上岛季节 summer_2026 将于 2026-06-30 结束（剩 1 天）"
  ],
  "errors": [],
  "stopSearchClusters": {
    "miyanoura_port_early": [
      "miyanoura_port_early",
      "miyanoura_port",
      "miyanoura_port_entrance",
      "miyanoura"
    ],
    "miyanoura_port": [
      "miyanoura_port_early",
      "miyanoura_port",
      "miyanoura_port_entrance",
      "miyanoura"
    ],
    "miyanoura_port_entrance": [
      "miyanoura_port_early",
      "miyanoura_port",
      "miyanoura_port_entrance",
      "miyanoura"
    ],
    "miyanoura": [
      "miyanoura_port_early",
      "miyanoura_port",
      "miyanoura_port_entrance",
      "miyanoura"
    ]
  },
  "segmentBounds": {
    "absMaxMinutes": 120,
    "pdfWestMaxSegment": 50,
    "pdfWestMaxFullTrip": 102
  }
};
