/** POI guide map — poi-data.js · guide/index.html */
(function () {
  const LANG_KEY = "yakushima-bus-lang";
  const MAP_CENTER = [30.35, 130.5];
  const MAP_ZOOM = 10;
  const POPUP_OPTS = { maxWidth: 280, autoPan: true, autoPanPadding: [36, 36] };

  const CAT_COLORS = {
    historic: "#7a5c44",
    spa: "#9a5a52",
    beach: "#4a7f96",
    souvenir: "#8a7440",
    outdoor_rental: "#4f7356",
    supermarket: "#2f6b62",
    pharmacy: "#6b5a8a",
    atm: "#5f6864",
  };

  /** Map icon shape groups — filter chips stay per-category */
  const CAT_ICON_GROUP = {
    historic: "sight",
    beach: "sight",
    souvenir: "shop",
    outdoor_rental: "shop",
    supermarket: "shop",
    atm: "atm",
    spa: "spa",
    pharmacy: "pharmacy",
  };

  const POI_GLYPHS = {
    shop:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="#fff" d="M4.5 6.2h7l.9 7.3H3.6L4.5 6.2zm1.2-2.4h4.6l.7 1.4H5l.7-1.4z"/></svg>',
    atm:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="4.5" width="10" height="7.5" rx="1.2" fill="none" stroke="#fff" stroke-width="1.3"/><rect x="5" y="7.5" width="6" height="1.8" rx=".4" fill="#fff"/></svg>',
    sight:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="#fff" d="M2.5 12.2 8 4.2l5.5 8H2.5z"/><circle cx="12" cy="4.8" r="1.4" fill="#fff"/></svg>',
    spa:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="none" stroke="#fff" stroke-width="1.25" stroke-linecap="round" d="M5 11.5c0-2 .8-3.2.8-5.2M8 11.5c0-2 .8-3.2.8-5.2M11 11.5c0-2 .8-3.2.8-5.2"/><path stroke="#fff" stroke-width="1.2" d="M3 12.5h10"/></svg>',
    pharmacy:
      '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="7" y="3.5" width="2" height="9" rx=".3" fill="#fff"/><rect x="3.5" y="7" width="9" height="2" rx=".3" fill="#fff"/></svg>',
  };

  const BUS_GLYPH =
    '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="4.5" width="12" height="6.5" rx="1.5" fill="#fff"/><circle cx="5" cy="12" r="1.15" fill="#fff"/><circle cx="11" cy="12" r="1.15" fill="#fff"/></svg>';

  const UI = {
    ja: {
      filterAll: "すべて",
      filterBus: "バス停",
      stopHint: "地図は公式時刻表の52停留所のみ。OSMの他バス停は参考表示で、当サイトでは扱いません。",
      stopListCat: "バス停",
      stopsPartial: "確認済み {n}/{total}",
      navigate: "ナビ",
      copyAddress: "住所をコピー",
      copyAddressDone: "コピーしました",
      viewTimetable: "時刻表",
      source: "出典：",
      sourceLink: "yakukan.jp",
      updated: "更新",
      noResults: "該当なし",
      mapFullscreen: "地図を全画面",
      mapExitFullscreen: "全画面を終了",
    },
    zh: {
      filterAll: "全部",
      filterBus: "公交站",
      stopHint: "地图只标官方时刻表 52 站；OSM 上其他公交站不在本站范围内（无时刻/运价）。",
      stopListCat: "公交站",
      stopsPartial: "已核实 {n}/{total} 站",
      navigate: "导航",
      copyAddress: "复制地址",
      copyAddressDone: "已复制",
      viewTimetable: "查时刻表",
      source: "来源：",
      sourceLink: "yakukan.jp",
      updated: "更新",
      noResults: "无匹配结果",
      mapFullscreen: "全屏查看地图",
      mapExitFullscreen: "退出全屏",
    },
    en: {
      filterAll: "All",
      filterBus: "Bus stops",
      stopHint: "Map shows 52 official timetable stops only. Other OSM bus stops are not in our data.",
      stopListCat: "Bus stop",
      stopsPartial: "{n} of {total} stops mapped",
      navigate: "Navigate",
      copyAddress: "Copy address",
      copyAddressDone: "Copied",
      viewTimetable: "Timetable",
      source: "Source: ",
      sourceLink: "yakukan.jp",
      updated: "Updated",
      noResults: "No matches",
      mapFullscreen: "Fullscreen map",
      mapExitFullscreen: "Exit fullscreen",
    },
  };

  let lang = (() => {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ja" || q === "zh" || q === "en") return q;
    return localStorage.getItem(LANG_KEY) || "ja";
  })();
  let map;
  let markersLayer;
  let busStopsLayer;
  const markerById = {};
  const busMarkerById = {};
  let activeId = null;
  let enabledCats = new Set();
  let showBusStops = true;
  let clockTimer = null;

  const els = {};

  function t(key) {
    return (UI[lang] && UI[lang][key]) || UI.ja[key] || key;
  }

  function track(name, params) {
    window.BusAnalytics?.event(name, params);
  }

  function pick(o) {
    if (o == null) return "";
    if (typeof o === "string" || typeof o === "number") return String(o);
    return o[lang] || o.ja || o.en || o.zh || "";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function spotColor(spot) {
    const cat = (spot.categories && spot.categories[0]) || "supermarket";
    return CAT_COLORS[cat] || CAT_COLORS.supermarket;
  }

  function iconGroupForSpot(spot) {
    const cat = (spot.categories && spot.categories[0]) || "supermarket";
    return CAT_ICON_GROUP[cat] || "shop";
  }

  function poiMarkerHtml(group, color) {
    const glyph = POI_GLYPHS[group] || POI_GLYPHS.shop;
    return `<span class="guide-poi-marker guide-poi-marker--${group}" style="--marker-color:${color}">${glyph}</span>`;
  }

  function makePoiIcon(spot) {
    const group = iconGroupForSpot(spot);
    const color = spotColor(spot);
    return L.divIcon({
      className: "guide-poi-marker-wrap",
      html: poiMarkerHtml(group, color),
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  function catLabel(catId, data) {
    const c = data.meta.categories[catId];
    return c ? pick(c) : catId;
  }

  function cleanDesc(text, spot) {
    if (!text) return "";
    let s = text
      .replace(
        /^(?:可以买的东西|可以买什么|你可以买什么|購入できるもの|Things you can buy)[：:]\s*/iu,
        ""
      )
      .trim();
    if (!spot) return s;

    const names = [
      pick(spot.name),
      spot.name?.ja,
      spot.name?.zh,
      spot.name?.en,
    ].filter((n) => n && n.length >= 2);
    const seen = new Set();
    for (const raw of names) {
      const n = raw.trim();
      if (seen.has(n)) continue;
      seen.add(n);
      const esc = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      s = s.replace(new RegExp(`^${esc}\\s*[，,、]?\\s*`, "u"), "");
      s = s.replace(new RegExp(`^屋久岛的?${esc}[是为]?`, "u"), "");
      s = s.replace(new RegExp(`^${esc}是`, "u"), "");
      s = s.replace(new RegExp(`^${esc}は[、,]?\\s*`, "u"), "");
      s = s.replace(
        new RegExp(`^屋久島の${esc}(?:[（(][^）)]*[）)])?は[、,]?\\s*`, "u"),
        ""
      );
      s = s.replace(new RegExp(`^The\\s+${esc}\\s+is\\s+`, "iu"), "");
    }
    s = s.replace(/^屋久岛的[^，,。]{2,24}[是为]/u, "");
    s = s.replace(/^屋久島の[^、。]{2,36}は[、,]?/u, "");
    s = s.replace(/^は[、,]?\s*/u, "");
    s = s.replace(/^是/u, "");
    s = s.replace(/^is\s+/iu, "");
    if (s && /^[a-z]/.test(s)) s = s.charAt(0).toUpperCase() + s.slice(1);
    return s.trim();
  }

  /** Hide per-row category when a single POI filter chip is active (chip already shows it). */
  function showPoiCategoryInList(data) {
    const cats = Object.keys(data.meta.categories || {});
    const on = cats.filter((c) => enabledCats.has(c));
    return on.length !== 1;
  }

  function filteredSpots(data) {
    return (data.spots || []).filter((s) =>
      (s.categories || []).some((c) => enabledCats.has(c))
    );
  }

  function navUrl(lat, lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }

  function spotCopyText(spot) {
    const name = pick(spot.name);
    return `${name}\n${spot.lat}, ${spot.lng}`;
  }

  function isOfficialStop(stopId) {
    return !!(typeof BUS_DATA !== "undefined" && BUS_DATA.stops && BUS_DATA.stops[stopId]);
  }

  function stopLabel(stop) {
    return pick(stop);
  }

  function stopPopupHtml(stopId, stop) {
    const name = stopLabel(stop);
    const no = stop.no ? `<span class="guide-popup-stopno">No.${escapeHtml(stop.no)}</span>` : "";
    return `<div class="guide-popup guide-popup--stop">
      ${no}
      <strong class="guide-popup-name">${escapeHtml(name)}</strong>
      <p class="guide-popup-desc guide-popup-stop-hint">${escapeHtml(t("stopHint"))}</p>
      <div class="guide-popup-actions guide-popup-actions--pair">
        <a class="guide-nav-btn" href="${navUrl(stop.lat, stop.lng)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("navigate"))}</a>
        ${isOfficialStop(stopId)
          ? `<button type="button" class="guide-tt-btn" data-guide-tt="${escapeHtml(stopId)}">${escapeHtml(t("viewTimetable"))}</button>`
          : ""}
      </div>
    </div>`;
  }

  function popupHtml(spot, data) {
    const name = pick(spot.name);
    const desc = cleanDesc(pick(spot.desc), spot);
    const cats = (spot.categories || [])
      .map((c) => `<span class="guide-popup-cat guide-cat--${c}">${escapeHtml(catLabel(c, data))}</span>`)
      .join(" ");
    const descBlock = desc ? `<p class="guide-popup-desc">${escapeHtml(desc)}</p>` : "";
    const src = spot.sourceUrl
      ? `<p class="guide-popup-source"><a href="${spot.sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("sourceLink"))}</a></p>`
      : "";
    return `<div class="guide-popup">
      <strong class="guide-popup-name">${escapeHtml(name)}</strong>
      <div class="guide-popup-cats">${cats}</div>
      ${descBlock}
      <div class="guide-popup-actions guide-popup-actions--pair">
        <a class="guide-nav-btn" href="${navUrl(spot.lat, spot.lng)}" target="_blank" rel="noopener noreferrer">${escapeHtml(t("navigate"))}</a>
        <button type="button" class="guide-copy-btn" data-guide-copy="${encodeURIComponent(spotCopyText(spot))}">${escapeHtml(t("copyAddress"))}</button>
      </div>
      ${src}
    </div>`;
  }

  function mapStops() {
    if (typeof MAP_DATA !== "undefined" && MAP_DATA.stops) return MAP_DATA.stops;
    return window.MAP_DATA?.stops || {};
  }

  function catalogStop(id) {
    return mapStops()[id] || null;
  }

  function busStopsMap() {
    const geo = window.BUS_STOP_GEO?.stops || {};
    const out = {};
    for (const [id, coords] of Object.entries(geo)) {
      const meta = catalogStop(id);
      if (meta) out[id] = { ...meta, ...coords };
    }
    return out;
  }

  function busStopsSorted() {
    return Object.entries(busStopsMap()).sort((a, b) => {
      const na = Number(a[1].no) || 999;
      const nb = Number(b[1].no) || 999;
      return na - nb || stopLabel(a[1]).localeCompare(stopLabel(b[1]), lang);
    });
  }

  function busStopsMeta() {
    const mapped = busStopsSorted().length;
    const total = window.BUS_STOP_GEO?.meta?.catalogStops ?? Object.keys(mapStops()).length;
    return { mapped, total };
  }

  function setActive(id, kind = "poi") {
    activeId = kind === "bus" ? `bus:${id}` : id;
    document.querySelectorAll(".guide-list-item").forEach((el) => {
      const isBus = el.dataset.kind === "bus";
      const elId = isBus ? `bus:${el.dataset.id}` : el.dataset.id;
      el.classList.toggle("active", elId === activeId);
    });
    if (activeId && els.list) {
      const rawId = activeId.startsWith("bus:") ? activeId.slice(4) : activeId;
      const item = els.list.querySelector(`[data-id="${rawId}"]`);
      item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function focusBusStop(stopId) {
    if (!map) return;
    const stop = busStopsMap()[stopId];
    if (!stop) return;
    setActive(stopId, "bus");
    map.setView([stop.lat, stop.lng], Math.max(map.getZoom(), 14), { animate: true });
    busMarkerById[stopId]?.openPopup();
  }

  function focusSpot(spot, data) {
    if (!map || !spot) return;
    setActive(spot.id, "poi");
    map.setView([spot.lat, spot.lng], Math.max(map.getZoom(), 13), { animate: true });
    const marker = markerById[spot.id];
    if (marker) marker.openPopup();
  }

  function updateBusStops() {
    if (!busStopsLayer) return;
    busStopsLayer.clearLayers();
    Object.keys(busMarkerById).forEach((k) => delete busMarkerById[k]);
    if (!showBusStops) return;
    const stops = busStopsMap();
    Object.entries(stops).forEach(([id, stop]) => {
      const icon = L.divIcon({
        className: "guide-poi-marker-wrap",
        html: `<span class="guide-poi-marker guide-poi-marker--bus" style="--marker-color:#3d6b5f">${BUS_GLYPH}</span>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([stop.lat, stop.lng], { icon, pane: "guideBusStops" });
      marker.bindPopup(stopPopupHtml(id, stop), POPUP_OPTS);
      marker.on("click", () => setActive(id, "bus"));
      marker.addTo(busStopsLayer);
      busMarkerById[id] = marker;
    });
  }

  function updateMarkers(data) {
    if (!markersLayer) return;
    markersLayer.clearLayers();
    Object.keys(markerById).forEach((k) => delete markerById[k]);

    filteredSpots(data).forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: makePoiIcon(spot),
        pane: "guidePoi",
      });
      marker.bindPopup(popupHtml(spot, data), POPUP_OPTS);
      marker.on("click", () => setActive(spot.id));
      marker.addTo(markersLayer);
      markerById[spot.id] = marker;
    });
  }

  function countByCategory(data) {
    const counts = {};
    (data.spots || []).forEach((spot) => {
      (spot.categories || []).forEach((c) => {
        counts[c] = (counts[c] || 0) + 1;
      });
    });
    return counts;
  }

  function chipLabel(label, n) {
    return `${escapeHtml(label)} <span class="guide-chip-count">${n}</span>`;
  }

  function allCatsOn(data) {
    const cats = Object.keys(data.meta.categories || {});
    return cats.length > 0 && cats.every((c) => enabledCats.has(c));
  }

  function renderFilters(data) {
    const cats = Object.keys(data.meta.categories || {});
    const allOn = allCatsOn(data);
    const counts = countByCategory(data);
    const busTotal = busStopsMeta().mapped;
    const chips = [
      `<button type="button" class="guide-chip guide-chip-all${allOn ? " active" : ""}" data-cat="__all__">${escapeHtml(t("filterAll"))}</button>`,
      `<button type="button" class="guide-chip guide-chip-bus${showBusStops ? " active" : ""}" data-cat="__bus__">${chipLabel(t("filterBus"), busTotal)}</button>`,
      ...cats.map((c) => {
        const on = enabledCats.has(c);
        return `<button type="button" class="guide-chip guide-cat--${c}${on ? " active" : ""}" data-cat="${c}">${chipLabel(catLabel(c, data), counts[c] || 0)}</button>`;
      }),
    ];
    els.filters.innerHTML = chips.join("");
    els.filters.querySelectorAll(".guide-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.cat;
        if (cat === "__bus__") {
          showBusStops = !showBusStops;
          track("guide_filter", { category: "__bus__", enabled: showBusStops });
          renderFilters(data);
          updateBusStops();
          renderList(data);
          return;
        }
        if (cat === "__all__") {
          if (allOn) {
            enabledCats.clear();
            track("guide_filter", { category: "__all__", enabled: false });
          } else {
            cats.forEach((c) => enabledCats.add(c));
            track("guide_filter", { category: "__all__", enabled: true });
          }
        } else if (enabledCats.has(cat)) {
          enabledCats.delete(cat);
          track("guide_filter", { category: cat, enabled: false });
        } else {
          enabledCats.add(cat);
          track("guide_filter", { category: cat, enabled: true });
        }
        renderFilters(data);
        renderList(data);
        updateMarkers(data);
      });
    });
  }

  function renderSpaGuide(data) {
    const spa =
      (data.meta.supplements || []).find((s) => s.id === "yesyakushima_hot_springs") ||
      (data.meta.supplements || [])[0];
    if (!spa) return;
    const link = document.getElementById("guideSpaLink");
    const title = document.getElementById("guideSpaTitle");
    const note = document.getElementById("guideSpaNote");
    if (link) link.href = spa.url;
    if (title) title.textContent = pick(spa.title);
    if (note) note.textContent = pick(spa.note);
  }

  function renderPdfLayers(data) {
    const layers = data.meta.pdfLayers || [];
    if (!els.pdfCards) return;
    els.pdfCards.innerHTML = layers
      .map(
        (layer) => `<a class="guide-foot-link guide-foot-link--pdf" href="${layer.url}" target="_blank" rel="noopener noreferrer">
        <span class="guide-foot-link-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M7 4h7l5 5v11H7z"/><path d="M14 4v5h5"/><path d="M9 13h6M9 17h4"/></svg>
        </span>
        <span class="guide-foot-link-text">
          <span class="guide-foot-link-title">${escapeHtml(pick(layer.title))}</span>
          <span class="guide-foot-link-note">${escapeHtml(pick(layer.note))}</span>
        </span>
        <span class="guide-foot-link-arrow" aria-hidden="true">›</span>
      </a>`
      )
      .join("");
  }

  function renderList(data) {
    const spots = filteredSpots(data);
    const buses = showBusStops ? busStopsSorted() : [];
    const { mapped, total } = busStopsMeta();

    if (!spots.length && !buses.length) {
      els.list.innerHTML = `<li class="guide-list-empty">${escapeHtml(t("noResults"))}</li>`;
      return;
    }

    const parts = [];

    if (spots.length) {
      parts.push(
        spots
          .map((spot) => {
            const cat = (spot.categories && spot.categories[0]) || "supermarket";
            const name = pick(spot.name);
            const desc = cleanDesc(pick(spot.desc), spot);
            const sub = (spot.categories || []).map((c) => catLabel(c, data)).join(" · ");
            const descHtml = desc
              ? `<span class="guide-list-desc">${escapeHtml(desc)}</span>`
              : "";
            const catHtml = showPoiCategoryInList(data)
              ? `<span class="guide-list-cat">${escapeHtml(sub)}</span>`
              : "";
            const active = spot.id === activeId ? " active" : "";
            const group = iconGroupForSpot(spot);
            const color = spotColor(spot);
            return `<li class="guide-list-item guide-cat--${cat}${active}" data-id="${spot.id}" data-kind="poi" tabindex="0" role="button">
          <span class="guide-list-icon">${poiMarkerHtml(group, color)}</span>
          <span class="guide-list-text">
            <span class="guide-list-name">${escapeHtml(name)}</span>
            ${descHtml}
            ${catHtml}
          </span>
        </li>`;
          })
          .join("")
      );
    }

    if (buses.length && !spots.length) {
      const note = t("stopsPartial").replace("{n}", String(mapped)).replace("{total}", String(total));
      parts.push(`<li class="guide-list-note" aria-hidden="false">${escapeHtml(note)}</li>`);
      parts.push(
        buses
          .map(([id, stop]) => {
            const name = stopLabel(stop);
            const no = stop.no ? `No.${stop.no}` : "";
            const active = activeId === `bus:${id}` ? " active" : "";
            const busCatHtml = spots.length
              ? `<span class="guide-list-cat">${escapeHtml(no ? `${no} · ` : "")}${escapeHtml(t("stopListCat"))}</span>`
              : no
                ? `<span class="guide-list-cat">${escapeHtml(no)}</span>`
                : "";
            return `<li class="guide-list-item guide-list-item--bus${active}" data-id="${id}" data-kind="bus" tabindex="0" role="button">
          <span class="guide-list-icon"><span class="guide-poi-marker guide-poi-marker--bus guide-poi-marker--list" style="--marker-color:#3d6b5f">${BUS_GLYPH}</span></span>
          <span class="guide-list-text">
            <span class="guide-list-name">${escapeHtml(name)}</span>
            ${busCatHtml}
          </span>
        </li>`;
          })
          .join("")
      );
    }

    els.list.innerHTML = parts.join("");

    els.list.querySelectorAll('.guide-list-item[data-kind="poi"]').forEach((item) => {
      const id = item.dataset.id;
      const spot = data.spots.find((s) => s.id === id);
      const go = () => {
        track("guide_poi_select", { poi_id: id, category: (spot.categories || [])[0] || "" });
        focusSpot(spot, data);
      };
      item.addEventListener("click", go);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });

    els.list.querySelectorAll('.guide-list-item[data-kind="bus"]').forEach((item) => {
      const id = item.dataset.id;
      const go = () => {
        track("guide_stop_select", { stop_id: id });
        focusBusStop(id);
      };
      item.addEventListener("click", go);
      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          go();
        }
      });
    });
  }

  function applyPageHead() {
    const titleEl = document.getElementById("appTitle");
    const titles = { ja: "スポット地図", zh: "便利设施地图", en: "Island POI map" };
    if (window.SiteChrome) {
      SiteChrome.applyPageHead("map", {
        titleEl,
        leadEl: els.lead,
        crossEl: document.getElementById("guideCross"),
        lang,
      });
      return;
    }
    if (titleEl) titleEl.textContent = titles[lang] || titles.ja;
  }

  function applyI18n(data) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    window.__renderSiteChromeNav?.(lang);
    window.__syncPageTitle?.(lang);
    applyPageHead();
    els.sourceLabel.textContent = t("source");
    const updated = data.meta?.updatedAt;
    els.updated.textContent = updated ? `${t("updated")} ${updated}` : "";
    renderFilters(data);
    renderPdfLayers(data);
    renderSpaGuide(data);
    renderList(data);
    updateMarkers(data);
    updateBusStops();
    window.TimetableModal?.setLang(lang);
    const fsBtn = document.getElementById("guideMapFsBtn");
    if (fsBtn) {
      const open = document.querySelector(".guide-map-wrap--fullscreen");
      const exitLabel = t("mapExitFullscreen");
      fsBtn.title = open ? exitLabel : t("mapFullscreen");
      fsBtn.setAttribute("aria-label", fsBtn.title);
      const label = fsBtn.querySelector(".guide-map-fs-label");
      if (label) label.textContent = open ? exitLabel : "";
    }
  }

  function bindLang() {
    document.querySelectorAll("#langSwitch [data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.lang;
        if (next === lang) return;
        lang = next;
        if (window.AppCore) AppCore.setLang(lang);
        else {
          localStorage.setItem(LANG_KEY, lang);
          window.__renderSiteChromeNav?.(lang);
          window.dispatchEvent(new CustomEvent("yakushima-bus-lang", { detail: { lang } }));
        }
        document.querySelectorAll("#langSwitch [data-lang]").forEach((b) => {
          b.classList.toggle("active", b.dataset.lang === lang);
        });
        applyI18n(window.POI_DATA);
      });
    });
  }

  function startClock() {
    const el = document.getElementById("liveClockTime");
    if (!el) return;
    const tick = () => {
      if (typeof AppCore !== "undefined") {
        el.textContent = AppCore.formatJapanClock();
      }
      el.title = lang === "zh" ? "日本时间 (JST)" : "JST";
    };
    tick();
    clearInterval(clockTimer);
    clockTimer = setInterval(tick, 30000);
  }

  function initMap() {
    map = L.map("guideMap", { scrollWheelZoom: true }).setView(MAP_CENTER, MAP_ZOOM);
    map.createPane("guideBusStops");
    map.getPane("guideBusStops").style.zIndex = 420;
    map.createPane("guidePoi");
    map.getPane("guidePoi").style.zIndex = 460;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);
    busStopsLayer = L.layerGroup().addTo(map);
    markersLayer = L.layerGroup().addTo(map);
  }

  function placeGuideFoot() {
    const foot = document.getElementById("guidePageFoot");
    const listBlock = document.querySelector(".guide-list-block");
    const shell = document.querySelector(".guide-shell");
    if (!foot || !listBlock || !shell) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (mobile) {
      foot.classList.add("guide-page-foot--in-list");
      listBlock.appendChild(foot);
    } else {
      foot.classList.remove("guide-page-foot--in-list");
      shell.insertAdjacentElement("afterend", foot);
    }
  }

  function onGuideViewportChange() {
    placeGuideFoot();
    map?.invalidateSize();
  }

  function bindMapFullscreen() {
    const wrap = document.querySelector(".guide-map-wrap");
    const btn = document.getElementById("guideMapFsBtn");
    if (!wrap || !btn) return;

    const setOpen = (open) => {
      wrap.classList.toggle("guide-map-wrap--fullscreen", open);
      document.body.classList.toggle("guide-map-fs-open", open);
      btn.setAttribute("aria-pressed", open ? "true" : "false");
      const label = btn.querySelector(".guide-map-fs-label");
      const exitLabel = t("mapExitFullscreen");
      btn.title = open ? exitLabel : t("mapFullscreen");
      btn.setAttribute("aria-label", btn.title);
      if (label) label.textContent = open ? exitLabel : "";
      window.setTimeout(() => map?.invalidateSize(), 80);
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!wrap.classList.contains("guide-map-wrap--fullscreen"));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && wrap.classList.contains("guide-map-wrap--fullscreen")) setOpen(false);
    });
  }

  function bindPopupActions() {
    if (!map) return;
    map.on("popupopen", (ev) => {
      const root = ev.popup.getElement();
      if (!root) return;
      root.querySelectorAll("[data-guide-copy]").forEach((btn) => {
        if (btn.dataset.copyBound) return;
        btn.dataset.copyBound = "1";
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const raw = btn.getAttribute("data-guide-copy");
          if (!raw) return;
          const text = decodeURIComponent(raw);
          const label = t("copyAddress");
          try {
            await navigator.clipboard.writeText(text);
            btn.textContent = t("copyAddressDone");
            window.setTimeout(() => { btn.textContent = label; }, 1600);
          } catch {
            window.prompt(label, text);
          }
        });
      });
      root.querySelectorAll("[data-guide-tt]").forEach((btn) => {
        if (btn.dataset.ttBound) return;
        btn.dataset.ttBound = "1";
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const stopId = btn.getAttribute("data-guide-tt");
          if (!stopId || !isOfficialStop(stopId)) return;
          track("open_timetable", { from: stopId, source: "map_popup" });
          window.TimetableModal?.setLang(lang);
          window.TimetableModal?.open(stopId);
        });
      });
    });
  }

  function init() {
    const data = window.POI_DATA;
    if (!data) return;

    els.filters = document.getElementById("guideFilters");
    els.list = document.getElementById("guideList");
    els.pdfCards = document.getElementById("guidePdfCards");
    els.lead = document.getElementById("guideLead");
    els.sourceLabel = document.getElementById("guideSourceLabel");
    els.updated = document.getElementById("guideUpdated");

    Object.keys(data.meta.categories || {}).forEach((c) => enabledCats.add(c));

    initMap();
    bindMapFullscreen();
    bindPopupActions();
    window.TimetableModal?.mount();
    bindLang();
    startClock();
    const boot = () => {
      lang = (() => {
        const q = new URLSearchParams(location.search).get("lang");
        if (q === "ja" || q === "zh" || q === "en") return q;
        return localStorage.getItem(LANG_KEY) || "ja";
      })();
      document.querySelectorAll("#langSwitch [data-lang]").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
      });
      applyI18n(data);
      placeGuideFoot();
      map?.invalidateSize();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
      boot();
    }

    placeGuideFoot();
    window.addEventListener("resize", onGuideViewportChange);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
