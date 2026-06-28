/** 语言为 zh 时同步 <title> / description / og（利于百度等中文爬虫） */
(function () {
  if (window.SiteLang?.current !== "zh") return;

  const path = location.pathname.replace(/\/+$/, "") || "/";
  const META = {
    "/": {
      title: "屋久岛公交时刻表 2026最新｜下一班车查询",
      description:
        "屋久岛巴士官方时刻表2026最新。平日/周末祝日，宫之浦港、白谷、荒川登山口下一班车；路线图与票价见专用页。",
    },
    "/fare": {
      title: "屋久岛公交路线图·票价 2026最新｜区间票价查询",
      description:
        "屋久岛巴士官方路线图与区间票价2026最新。宫之浦港、白谷、自然馆、荒川登山口；选站查成人单程票价。",
    },
    "/map": {
      title: "屋久岛便利指南地图｜温泉·海滩·超市·景点",
      description:
        "屋久岛名胜古迹、温泉、海滩、纪念品、超市药店、ATM 地图；已核实公交站，可导航并查时刻表。",
    },
    "/ferry": {
      title: "屋久岛船运上岛｜鹿儿岛↔屋久岛 高速船与渡轮",
      description:
        "鹿儿岛↔屋久岛高速船、渡轮时刻与票价（含指宿出发）；上岛后查公交时刻表与票价。",
    },
    "/without-car": {
      title: "屋久岛不租车攻略 2026｜公交·船运怎么玩",
      description:
        "不租车如何玩屋久岛：公交时刻表、路线图、票价、上岛船运；附当地体验与一日游参考。",
    },
    "/trekking": {
      title: "屋久岛登山路线参考｜绳文杉·太鼓岩·公交衔接",
      description:
        "绳文杉、太鼓岩、宫之浦岳等徒步路线参考；登山口公交班次请查时刻表。",
    },
    "/about": {
      title: "关于屋久岛公交查询站｜数据来源与联系",
      description: "独立整理的屋久岛公交时刻表、票价与上岛信息；数据来源与联系方式。",
    },
  };

  const m = META[path];
  if (!m) return;

  document.title = m.title;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", m.description);
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", m.title);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", m.description);
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute("content", m.title);
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute("content", m.description);
})();
