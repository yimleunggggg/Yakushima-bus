/** Stop departure modal — shared by map guide & fare. Requires data.js, app-core.js; operator-ui.js for badges. */
const TimetableModal = {
  STRINGS: {
    ja: {
      weekday: "平日",
      saturday: "土曜",
      sunday: "日祝",
      modalTitle: "発車時刻",
      toward: "方面",
      noDeps: "この日種の発車便はありません",
      openRouteSearch: "区間で検索（時刻表ページ）",
      close: "閉じる",
    },
    zh: {
      weekday: "工作日",
      saturday: "周六",
      sunday: "周日·节假日",
      modalTitle: "发车时刻",
      toward: "方向",
      noDeps: "该日期类型无发车",
      openRouteSearch: "按区间查询（时刻表页）",
      close: "关闭",
    },
    en: {
      weekday: "Weekday",
      saturday: "Sat",
      sunday: "Sun & holidays",
      modalTitle: "Departures",
      toward: "Direction",
      noDeps: "No departures on this day type",
      openRouteSearch: "Search by route (timetable page)",
      close: "Close",
    },
  },

  _lang: "ja",
  _stopId: null,
  _modalDay: null,
  _els: null,
  _mounted: false,

  t(key) {
    const s = this.STRINGS[this._lang] || this.STRINGS.ja;
    return s[key] || this.STRINGS.ja[key] || key;
  },

  pick(o) {
    if (typeof AppCore !== "undefined" && AppCore.pick) return AppCore.pick(o, this._lang);
    if (o == null) return "";
    if (typeof o === "string" || typeof o === "number") return String(o);
    return o[this._lang] || o.ja || o.en || o.zh || "";
  },

  stopName(id) {
    const s = (typeof BUS_DATA !== "undefined" && BUS_DATA.stops[id])
      || (typeof MAP_DATA !== "undefined" && MAP_DATA.stops[id]);
    if (!s) return id;
    return this._lang === "ja" ? s.ja : (this._lang === "zh" ? s.zh : s.en);
  },

  isOfficialStop(stopId) {
    return !!(typeof BUS_DATA !== "undefined" && BUS_DATA.stops && BUS_DATA.stops[stopId]);
  },

  parseMinutes(time) {
    return typeof AppCore !== "undefined" ? AppCore.parseMinutes(time) : 0;
  },

  detectDayType(date = new Date()) {
    return typeof AppCore !== "undefined" ? AppCore.detectDayType(date) : "weekday";
  },

  getStopDepartures(stopId, dayType) {
    if (!this.isOfficialStop(stopId) || typeof AppCore === "undefined") return [];
    return AppCore.getStopDepartures(stopId, dayType, {
      pick: (o) => this.pick(o),
      stopName: (id) => this.stopName(id),
    });
  },

  mount() {
    if (this._mounted) return;
    const modal = document.getElementById("timeModal");
    if (!modal) return;
    this._els = {
      timeModal: modal,
      modalBackdrop: document.getElementById("modalBackdrop"),
      modalClose: document.getElementById("modalClose"),
      modalTitle: document.getElementById("modalTitle"),
      modalBody: document.getElementById("modalBody"),
      modalDayTabs: document.getElementById("modalDayTabs"),
      modalRouteLink: document.getElementById("modalRouteLink"),
    };
    if (!this._els.modalClose || !this._els.modalBody) return;

    this._els.modalClose.addEventListener("click", () => this.close());
    this._els.modalBackdrop?.addEventListener("click", () => this.close());
    this._els.modalBackdrop?.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
    this._els.modalDayTabs?.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-day]");
      if (!btn) return;
      this._modalDay = btn.dataset.day;
      this._els.modalDayTabs.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("active", b === btn);
      });
      this.render();
    });

    this._mounted = true;
  },

  setLang(lang) {
    if (lang !== "ja" && lang !== "zh" && lang !== "en") return;
    this._lang = lang;
    this.syncDayTabLabels();
    if (this._els?.modalRouteLink) {
      this._els.modalRouteLink.textContent = this.t("openRouteSearch");
    }
    if (this._els?.modalClose) {
      this._els.modalClose.setAttribute("aria-label", this.t("close"));
    }
    if (this._els && !this._els.timeModal.hidden) this.render();
  },

  syncDayTabLabels() {
    if (!this._els?.modalDayTabs) return;
    this._els.modalDayTabs.querySelectorAll("button[data-day]").forEach((btn) => {
      const day = btn.dataset.day;
      if (day === "weekday") btn.textContent = this.t("weekday");
      else if (day === "saturday") btn.textContent = this.t("saturday");
      else if (day === "sunday_holiday") btn.textContent = this.t("sunday");
    });
  },

  open(stopId) {
    if (!this.isOfficialStop(stopId)) return;
    this.mount();
    if (!this._els) return;
    this._stopId = stopId;
    this._modalDay = this.detectDayType();
    this._els.modalDayTabs?.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("active", b.dataset.day === this._modalDay);
    });
    this.syncDayTabLabels();
    if (this._els.modalRouteLink) {
      this._els.modalRouteLink.textContent = this.t("openRouteSearch");
    }
    this.render();
    AppCore.openDialog(this._els.timeModal, {
      onClose: () => this.close(),
      initialFocus: this._els.modalClose,
    });
  },

  close() {
    if (!this._els) return;
    AppCore.closeDialog(this._els.timeModal);
  },

  render() {
    if (!this._els || !this._stopId) return;
    const id = this._stopId;
    this._els.modalTitle.textContent = `${this.t("modalTitle")} — ${this.stopName(id)}`;
    if (this._els.modalRouteLink) {
      this._els.modalRouteLink.href = `/?from=${encodeURIComponent(id)}&lang=${encodeURIComponent(this._lang)}`;
    }
    const groups = this.getStopDepartures(id, this._modalDay);
    if (!groups.length) {
      this._els.modalBody.innerHTML = `<div class="empty">${this.t("noDeps")}</div>`;
      return;
    }
    const opUi = typeof OperatorUI !== "undefined" ? OperatorUI : null;
    this._els.modalBody.innerHTML = groups.map((g) => `
      <div class="modal-dir">
        <div class="modal-dir-head">
          <div class="modal-dir-title">
            ${opUi ? opUi.badge(g.operator, this._lang) : ""}
            <span class="modal-route">${g.routeName}</span>
            <span class="modal-toward">${this.t("toward")} ${g.dirLabel}</span>
          </div>
          <div class="modal-pay-tags">${opUi ? opUi.paymentTagsHtml(g.operator, this._lang) : ""}</div>
        </div>
        <div class="dep-grid">${g.deps.map((d) =>
          `<span class="dep-chip" title="${d.dest}">${AppCore.formatTime(d.time)}</span>`
        ).join("")}</div>
      </div>
    `).join("");
  },
};

window.TimetableModal = TimetableModal;
