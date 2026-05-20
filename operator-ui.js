/** 事業者 badge / 決済タグ / 图例 — 読み取り専用、BUS_DATA.operators を唯一の数据源 */
const OperatorUI = {
  pick(obj, lang) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.ja || obj.en || obj.zh || "";
  },

  get(id) {
    const ops = typeof BUS_DATA !== "undefined" ? BUS_DATA.operators : {};
    return ops[id] || ops.taneyaku || { ja: id, color: "#666" };
  },

  shortName(op, lang) {
    return this.pick(op.short, lang) || this.pick(op, lang);
  },

  badge(opOrId, lang, opts = {}) {
    const op = typeof opOrId === "string" ? this.get(opOrId) : opOrId;
    const short = opts.short !== false;
    const label = short ? this.shortName(op, lang) : this.pick(op, lang);
    const title = this.pick(op, lang);
    const cls = opts.invert ? "badge badge-invert" : "badge";
    return `<span class="${cls}" style="background:${op.color}" title="${title}">${label}</span>`;
  },

  paymentTags(opOrId, lang) {
    const op = typeof opOrId === "string" ? this.get(opOrId) : opOrId;
    return (op.paymentTags || []).map((tag) => ({
      text: this.pick(tag, lang),
      positive: !!tag.positive,
    }));
  },

  paymentTagsHtml(opOrId, lang) {
    return this.paymentTags(opOrId, lang).map((tag) =>
      `<span class="tag season" title="${tag.text}">${tag.text}</span>`
    ).join("");
  },

  legendHtml(lang) {
    const ops = Object.entries(BUS_DATA.operators || {});
    return ops.map(([, op]) => {
      const tags = (op.paymentTags || []).map((t) => this.pick(t, lang)).join(" · ");
      return `<span class="op-legend-item">${this.badge(op, lang)}<span class="op-legend-note">${tags}</span></span>`;
    }).join("");
  },
};
