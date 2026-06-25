/** 共享运行时：日种判定、时区、多语言 pick、轻反馈 */
const AppCore = {
  LANG_KEY: "yakushima-bus-lang",

  getLang() {
    return this._lang ?? this.resolveLang();
  },

  resolveLang() {
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
    this.applyDocLang(lang);
    this.notifyLangChange(lang);
  },

  notifyLangChange(lang = this.getLang()) {
    window.dispatchEvent(new CustomEvent("yakushima-bus-lang", { detail: { lang } }));
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

/** @deprecated use AppCore.preferNativePdf — kept for inline scripts & cached pdf-viewer.js */
function preferNativePdf() {
  return AppCore.preferNativePdf();
}
