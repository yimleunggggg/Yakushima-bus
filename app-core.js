/** 共享运行时：日种判定、时区、多语言 pick、轻反馈 */
const AppCore = {
  LANG_KEY: "yakushima-bus-lang",
  ABS_SEGMENT_MAX: 120,

  getLang() {
    return this._lang ?? this.resolveLang();
  },

  resolveLang() {
    if (window.SiteLang) return window.SiteLang.resolveLang();
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "ja" || q === "zh" || q === "en") return q;
    return localStorage.getItem(this.LANG_KEY) || "ja";
  },

  runPageBoot(fn) {
    const run = () => fn(this.resolveLang());
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }
  },

  setLang(lang) {
    this._lang = lang;
    localStorage.setItem(this.LANG_KEY, lang);
    window.SiteLang?.markUserPicked?.();
    if (window.SiteLang) window.SiteLang.current = lang;
    this.applyDocLang(lang);
    this.syncLangUrl(lang);
    window.__renderSiteChromeNav?.(lang);
    this.notifyLangChange(lang);
  },

  syncLangUrl(lang) {
    if (window.SiteLang?.syncLangUrl) {
      window.SiteLang.syncLangUrl(lang);
      return;
    }
    try {
      if (location.protocol !== "http:" && location.protocol !== "https:") return;
      const url = new URL(location.href);
      if (url.searchParams.get("lang") === lang) return;
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    } catch (_) { /* ignore */ }
  },

  notifyLangChange(lang = this.getLang()) {
    window.dispatchEvent(new CustomEvent("yakushima-bus-lang", { detail: { lang } }));
    window.SiteChrome?.refresh();
  },

  applyDocLang(lang = this.getLang()) {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  },

  pick(obj, lang = this.getLang()) {
    if (obj == null) return "";
    if (typeof obj === "string" || typeof obj === "number") return String(obj);
    return obj[lang] || obj.ja || obj.en || obj.zh || "";
  },

  japanParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      hour12: false,
    }).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value;
    const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get("weekday")];
    return {
      iso: `${get("year")}-${get("month")}-${get("day")}`,
      hour: get("hour"),
      minute: get("minute"),
      weekday: wd,
    };
  },

  routeInSeason(route, date = new Date()) {
    const season = route.season;
    if (!season) return true;
    const month = parseInt(this.japanParts(date).iso.split("-")[1], 10);
    if (season === "12-2") return month === 12 || month <= 2;
    if (season === "3-11") return month >= 3 && month <= 11;
    return true;
  },

  detectDayType(date = new Date()) {
    const cfg = typeof META_DATA !== "undefined" ? META_DATA : null;
    const holidays = cfg?.holidays || [];
    const dt = cfg?.dayTypes || {};
    const { iso, weekday } = this.japanParts(date);
    const sunHol = dt.sundayHoliday || "sunday_holiday";
    const sat = dt.saturday || "saturday";
    const wk = dt.weekday || "weekday";
    const sunIsHol = dt.sundayIsHoliday !== false;
    if (holidays.includes(iso) || (sunIsHol && weekday === 0)) return sunHol;
    if (weekday === 6) return sat;
    return wk;
  },

  parseMinutes(time) {
    if (!time || time === "↓") return null;
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  },

  isBusTime(time) {
    return Boolean(time && /^\d{1,2}:\d{2}$/.test(time));
  },

  /** 站序间距（边数，非站点数） */
  stopIndexGap(fromIdx, toIdx) {
    return Math.abs(toIdx - fromIdx);
  },

  /**
   * 区间最短合理车程（分）。环线 PDF 列合并后常出现「仅起终点同列」的伪班次。
   * gap≥2 且 <10min 必错；长距离稀疏链再按站数下限（约 1.2min/站）。
   */
  minPlausibleMinutes(gap, { sparse = false, column = false } = {}) {
    if (column) return gap <= 1 ? 2 : 5;
    if (gap <= 1) return 2;
    if (!sparse) {
      if (gap >= 3) return 10;
      return 5;
    }
    if (gap >= 5) return Math.ceil(gap * 1.2);
    return 10;
  },

  /** 区间最长合理车程（PDF 西向全程约 102m，全局上限 120m） */
  maxPlausibleMinutes(gap, { sparse = false } = {}) {
    const cfg = typeof META_DATA !== "undefined" ? META_DATA : null;
    const absMax = cfg?.segmentBounds?.absMaxMinutes ?? this.ABS_SEGMENT_MAX;
    const perStop = sparse ? 6 : 10;
    const cap = Math.min(absMax, sparse ? 90 : absMax);
    return Math.min(cap, Math.max(12, Math.ceil(gap * perStop)));
  },

  segmentSparse(gap, { chain = null, column = false } = {}) {
    if (column) return true;
    const chainLen = chain?.length ?? 0;
    if (chainLen <= 2) return true;
    if (gap >= 5 && chainLen - 1 < gap * 0.35) return true;
    return false;
  },

  isPlausibleSegment(dep, arr, fromIdx, toIdx, { chain = null, column = false } = {}) {
    const depM = this.parseMinutes(dep);
    const arrM = this.parseMinutes(arr);
    if (depM == null || arrM == null) return false;
    const dur = arrM - depM;
    const absMax = (typeof META_DATA !== "undefined" && META_DATA.segmentBounds?.absMaxMinutes)
      || this.ABS_SEGMENT_MAX;
    if (dur <= 0 || dur > absMax) return false;
    const gap = this.stopIndexGap(fromIdx, toIdx);
    const sparse = this.segmentSparse(gap, { chain, column });
    const minM = this.minPlausibleMinutes(gap, { sparse, column });
    const maxM = this.maxPlausibleMinutes(gap, { sparse });
    return dur >= minM && dur <= maxM;
  },

  /** 展示用 24 小时制 HH:mm（公交/船运时刻，与 locale 无关） */
  formatTime(time) {
    if (time == null || time === "") return "";
    if (time === "↓") return time;
    if (!this.isBusTime(time)) return String(time);
    const mins = this.parseMinutes(time);
    if (mins == null) return String(time);
    const h = Math.floor(mins / 60) % 24;
    const mm = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  },

  formatJapanClock(date = new Date()) {
    const jp = this.japanParts(date);
    return this.formatTime(`${jp.hour}:${jp.minute}`);
  },

  /** 环线区间：沿站序单调走到终点站，跳过错圈时刻 */
  resolveTripSegment(trip, dir, fromIdx, toIdx) {
    if (fromIdx === toIdx) return null;
    const fromId = dir.stops[fromIdx];
    const dep = trip.times[fromId];
    if (!this.isBusTime(dep)) return null;
    const depM = this.parseMinutes(dep);
    const step = fromIdx < toIdx ? 1 : -1;
    const chain = [{ sid: fromId, time: dep, idx: fromIdx }];
    let lastM = depM;

    for (let i = fromIdx + step; step > 0 ? i <= toIdx : i >= toIdx; i += step) {
      const sid = dir.stops[i];
      const raw = trip.times[sid];
      if (!this.isBusTime(raw)) continue;
      const m = this.parseMinutes(raw);
      if (m < lastM) continue;
      lastM = m;
      chain.push({ sid, time: raw, idx: i });
    }

    const last = chain[chain.length - 1];
    if (!last || last.idx !== toIdx || lastM <= depM) return null;
    const seg = { dep, arr: last.time, fi: fromIdx, ti: toIdx, chain };
    if (!this.isPlausibleSegment(dep, last.time, fromIdx, toIdx, { chain })) return null;
    return seg;
  },

  /** 环线 PDF 整列：起终点时刻同列且 arr>dep 即可搜（拆分前 columnTrips） */
  resolveColumnSegment(trip, dir, fromIdx, toIdx) {
    if (fromIdx === toIdx) return null;
    const fromId = dir.stops[fromIdx];
    const toId = dir.stops[toIdx];
    const dep = trip.times[fromId];
    const arr = trip.times[toId];
    if (!this.isBusTime(dep) || !this.isBusTime(arr)) return null;
    const depM = this.parseMinutes(dep);
    const arrM = this.parseMinutes(arr);
    if (arrM <= depM || arrM - depM > this.ABS_SEGMENT_MAX) return null;
    if (!this.isPlausibleSegment(dep, arr, fromIdx, toIdx, { column: true })) return null;
    return { dep, arr, fi: fromIdx, ti: toIdx, chain: null, column: true };
  },

  /** PDF 早班等：dest=makino 但 destNote 为自然馆，补全到屋久杉自然馆 */
  tripMeansMuseum(trip) {
    if (trip.dest === "yakusugi_museum") return true;
    const note = trip.destNote;
    if (!note) return false;
    const text = [note.ja, note.zh, note.en].filter(Boolean).join(" ");
    return /自然館|自然馆|Yakusugi Museum/i.test(text);
  },

  museumArrivalTime(trip, dir) {
    const museumIdx = dir.stops.indexOf("yakusugi_museum");
    if (museumIdx === -1) return null;
    const explicit = trip.times.yakusugi_museum;
    if (this.isBusTime(explicit)) return explicit;
    const makinoIdx = dir.stops.indexOf("makino");
    if (makinoIdx === -1 || makinoIdx >= museumIdx) return null;
    const makinoTime = trip.times.makino;
    if (!this.isBusTime(makinoTime)) return null;
    const depM = this.parseMinutes(makinoTime);
    if (depM == null) return null;
    const arrM = depM + 5;
    return this.formatTime(`${Math.floor(arrM / 60)}:${arrM % 60}`);
  },

  resolveMuseumDestSegment(trip, dir, fromIdx, toIdx) {
    if (dir.stops[toIdx] !== "yakusugi_museum" || !this.tripMeansMuseum(trip)) return null;
    const museumIdx = dir.stops.indexOf("yakusugi_museum");
    const makinoIdx = dir.stops.indexOf("makino");
    if (makinoIdx === -1 || fromIdx >= museumIdx || fromIdx > makinoIdx) return null;
    const fromId = dir.stops[fromIdx];
    const dep = trip.times[fromId];
    const arr = this.museumArrivalTime(trip, dir);
    if (!this.isBusTime(dep) || !this.isBusTime(arr)) return null;
    if (!this.isPlausibleSegment(dep, arr, fromIdx, toIdx, { column: true })) return null;
    return { dep, arr, fi: fromIdx, ti: toIdx, chain: null, column: true, museumInferred: true };
  },

  resolveSegment(trip, dir, fromIdx, toIdx) {
    return (
      this.resolveTripSegment(trip, dir, fromIdx, toIdx)
      || this.resolveColumnSegment(trip, dir, fromIdx, toIdx)
      || this.resolveMuseumDestSegment(trip, dir, fromIdx, toIdx)
    );
  },

  segmentStops(trip, dir, fromIdx, toIdx) {
    const seg = this.resolveTripSegment(trip, dir, fromIdx, toIdx);
    if (seg?.chain) {
      const timeMap = new Map(seg.chain.map((c) => [c.sid, c.time]));
      const out = [];
      const step = fromIdx < toIdx ? 1 : -1;
      for (let i = fromIdx; step > 0 ? i <= toIdx : i >= toIdx; i += step) {
        const sid = dir.stops[i];
        out.push({ sid, time: timeMap.get(sid) || null });
      }
      return out;
    }
    const col = this.resolveColumnSegment(trip, dir, fromIdx, toIdx)
      || this.resolveMuseumDestSegment(trip, dir, fromIdx, toIdx);
    if (!col) return [];
    const depM = this.parseMinutes(col.dep);
    const arrM = this.parseMinutes(col.arr);
    const out = [];
    const step = fromIdx < toIdx ? 1 : -1;
    for (let i = fromIdx; step > 0 ? i <= toIdx : i >= toIdx; i += step) {
      const sid = dir.stops[i];
      const raw = trip.times[sid];
      if (!this.isBusTime(raw)) {
        out.push({ sid, time: null });
        continue;
      }
      const m = this.parseMinutes(raw);
      if (m < depM || m > arrM) {
        out.push({ sid, time: null });
        continue;
      }
      out.push({ sid, time: raw });
    }
    return out;
  },

  isValidTripSegment(trip, dir, fromIdx, toIdx) {
    return Boolean(this.resolveSegment(trip, dir, fromIdx, toIdx));
  },

  isValidDepartureAtStop(trip, dir, stopIdx) {
    const stopId = dir.stops[stopIdx];
    const dep = trip.times[stopId];
    if (!this.isBusTime(dep)) return false;
    const depM = this.parseMinutes(dep);
    for (let i = stopIdx + 1; i < dir.stops.length; i++) {
      const next = trip.times[dir.stops[i]];
      if (!this.isBusTime(next)) continue;
      if (this.parseMinutes(next) > depM) return true;
    }
    for (let i = stopIdx - 1; i >= 0; i--) {
      const next = trip.times[dir.stops[i]];
      if (!this.isBusTime(next)) continue;
      if (this.parseMinutes(next) > depM) return true;
    }
    return false;
  },

  /** 同名区域站点簇（宫之浦港/入口/镇上 等合并搜索） */
  stopSearchCluster(stopId) {
    const cfg = typeof META_DATA !== "undefined" ? META_DATA : null;
    const map = cfg?.stopSearchClusters;
    if (map?.[stopId]?.length) return map[stopId];
    return [stopId];
  },

  findTrips(from, to, dayType) {
    const fromIds = this.stopSearchCluster(from);
    const toIds = this.stopSearchCluster(to);
    const found = [];
    if (typeof BUS_DATA === "undefined") return found;
    const central = BUS_DATA.routes.find((r) => r.id === "central");
    const centralStops = central
      ? new Set(central.directions.flatMap((d) => d.stops))
      : null;
    const centralOnly =
      centralStops && centralStops.has(from) && centralStops.has(to);
    for (const fromId of fromIds) {
      for (const toId of toIds) {
        if (fromId === toId) continue;
        for (const route of BUS_DATA.routes) {
          if (!this.routeInSeason(route)) continue;
          if (
            centralOnly
            && route.id.startsWith("matsubanda")
            && toId !== "yakusugi_museum"
            && fromId !== "yakusugi_museum"
          ) continue;
          for (const dir of route.directions) {
            const fi = dir.stops.indexOf(fromId);
            const ti = dir.stops.indexOf(toId);
            if (fi === -1 || ti === -1 || fi === ti) continue;
            if (fi > ti) continue;
            const pools = [];
            if (dir.columnTrips?.length) pools.push(...dir.columnTrips);
            else pools.push(...dir.trips);
            for (const trip of pools) {
              if (trip.suspended || !trip.days.includes(dayType)) continue;
              const seg = this.resolveSegment(trip, dir, fi, ti);
              if (!seg) continue;
              found.push({
                route,
                dir,
                trip,
                dep: seg.dep,
                arr: seg.arr,
                fi: seg.fi,
                ti: seg.ti,
                depStop: fromId,
                arrStop: toId,
              });
            }
          }
        }
      }
    }
    const busMap = new Map();
    for (const t of found) {
      const busKey = `${t.route.id}|${t.dir.id}|${t.arr}`;
      const prev = busMap.get(busKey);
      if (!prev) {
        busMap.set(busKey, t);
        continue;
      }
      const pick = (a, b) => {
        if (a.depStop === from && b.depStop !== from) return a;
        if (b.depStop === from && a.depStop !== from) return b;
        if (a.arrStop === to && b.arrStop !== to) return a;
        if (b.arrStop === to && a.arrStop !== to) return b;
        return this.parseMinutes(a.dep) <= this.parseMinutes(b.dep) ? a : b;
      };
      busMap.set(busKey, pick(prev, t));
    }
    return [...busMap.values()].sort((a, b) => this.parseMinutes(a.dep) - this.parseMinutes(b.dep));
  },

  /**
   * @param {string} stopId
   * @param {string} dayType
   * @param {{ pick?: Function, stopName?: Function }} [opts]
   */
  getStopDepartures(stopId, dayType, opts = {}) {
    const pick = opts.pick || ((o) => this.pick(o));
    const stopName = opts.stopName || ((id) => this.stopLabel(id));
    const groups = [];
    if (!stopId || typeof BUS_DATA === "undefined" || !BUS_DATA.stops[stopId]) return groups;
    for (const route of BUS_DATA.routes) {
      if (!this.routeInSeason(route)) continue;
      for (const dir of route.directions) {
        const si = dir.stops.indexOf(stopId);
        if (si === -1) continue;
        const pools = dir.columnTrips?.length ? dir.columnTrips : dir.trips;
        const deps = [];
        const seen = new Set();
        for (const trip of pools) {
          if (trip.suspended || !trip.days.includes(dayType)) continue;
          if (!this.isValidDepartureAtStop(trip, dir, si)) continue;
          const dep = trip.times[stopId];
          const time = this.formatTime(dep);
          if (seen.has(time)) continue;
          seen.add(time);
          let destId = trip.dest || dir.stops[dir.stops.length - 1];
          if (destId === "makino" && this.tripMeansMuseum(trip)) destId = "yakusugi_museum";
          deps.push({ time, dest: stopName(destId) });
        }
        if (!deps.length) continue;
        deps.sort((a, b) => this.parseMinutes(a.time) - this.parseMinutes(b.time));
        groups.push({
          routeName: pick(route.name),
          dirLabel: pick(dir.label),
          operator: BUS_DATA.operators[route.operator] || BUS_DATA.operators.taneyaku,
          operatorId: route.operator,
          deps,
        });
      }
    }
    return groups;
  },

  stopLabel(id, lang = this.getLang()) {
    const s = (typeof BUS_DATA !== "undefined" && BUS_DATA.stops[id])
      || (typeof MAP_DATA !== "undefined" && MAP_DATA.stops?.[id]);
    if (!s) return id;
    return lang === "ja" ? s.ja : (lang === "zh" ? s.zh : s.en);
  },

  stopAriaLabel(id, lang = this.getLang()) {
    const s = (typeof BUS_DATA !== "undefined" && BUS_DATA.stops[id])
      || (typeof MAP_DATA !== "undefined" && MAP_DATA.stops?.[id]);
    if (!s) return id;
    const parts = [s.ja, s.no ? `#${s.no}` : "", s.zh, s.en].filter(Boolean);
    return [...new Set(parts)].join(" · ");
  },

  flashBtn(btn) {
    if (!btn) return;
    btn.classList.remove("btn-flash");
    void btn.offsetWidth;
    btn.classList.add("btn-flash");
    setTimeout(() => btn.classList.remove("btn-flash"), 600);
  },

  showToast(el, message, timerRef = { id: null }) {
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    el.classList.add("show");
    clearTimeout(timerRef.id);
    timerRef.id = setTimeout(() => {
      el.classList.remove("show");
      el.hidden = true;
    }, 2200);
  },

  modalScrollY: 0,
  _modalPinEl: null,
  _modalPinHandler: null,

  lockScroll() {
    this.modalScrollY = window.scrollY;
    document.body.style.top = `-${this.modalScrollY}px`;
    document.body.classList.add("modal-open");
  },

  unlockScroll() {
    document.body.classList.remove("modal-open");
    document.body.style.top = "";
    window.scrollTo(0, this.modalScrollY);
  },

  pinOverlay(el) {
    this.unpinOverlay();
    this._modalPinEl = el;
    const pin = () => {
      const vv = window.visualViewport;
      if (!el || el.hidden) return;
      if (!vv) return;
      el.style.top = `${vv.offsetTop}px`;
      el.style.left = `${vv.offsetLeft}px`;
      el.style.width = `${vv.width}px`;
      el.style.height = `${vv.height}px`;
    };
    this._modalPinHandler = pin;
    pin();
    window.visualViewport?.addEventListener("resize", pin);
    window.visualViewport?.addEventListener("scroll", pin);
  },

  unpinOverlay() {
    if (this._modalPinHandler) {
      window.visualViewport?.removeEventListener("resize", this._modalPinHandler);
      window.visualViewport?.removeEventListener("scroll", this._modalPinHandler);
    }
    if (this._modalPinEl) {
      this._modalPinEl.style.top = "";
      this._modalPinEl.style.left = "";
      this._modalPinEl.style.width = "";
      this._modalPinEl.style.height = "";
    }
    this._modalPinEl = null;
    this._modalPinHandler = null;
  },

  preferNativePdf() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  },
};

AppCore.applyDocLang(AppCore.getLang());

if (typeof module !== "undefined" && module.exports) {
  module.exports = { AppCore };
}

/** @deprecated use AppCore.preferNativePdf — kept for inline scripts & cached pdf-viewer.js */
function preferNativePdf() {
  return AppCore.preferNativePdf();
}
