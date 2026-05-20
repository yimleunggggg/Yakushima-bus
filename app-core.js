/** 共享运行时：日种判定、时区、多语言 pick、轻反馈 */
const AppCore = {
  LANG_KEY: "yakushima-bus-lang",

  getLang() {
    return this._lang ?? (localStorage.getItem(this.LANG_KEY) || "ja");
  },

  setLang(lang) {
    this._lang = lang;
    localStorage.setItem(this.LANG_KEY, lang);
    this.applyDocLang(lang);
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
};

AppCore.applyDocLang(AppCore.getLang());
