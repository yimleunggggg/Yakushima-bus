/** 全站官方链接 / 参考链接 — 统一 HTML 结构 */
(function (global) {
  function pick(o, lang) {
    if (global.AppCore?.pick) return AppCore.pick(o, lang);
    if (o == null) return "";
    if (typeof o === "string" || typeof o === "number") return String(o);
    return o[lang] || o.ja || o.en || o.zh || "";
  }

  function itemHtml(item, lang) {
    const url = item.url || item.href || "#";
    const label = item.label != null && typeof item.label !== "object"
      ? String(item.label)
      : pick(item.label, lang);
    const note = item.note ? pick(item.note, lang) : "";
    const noteHtml = note ? `<span class="source-link-note">${note}</span>` : "";
    const isTel = String(url).startsWith("tel:");
    const ext = isTel ? "" : ' target="_blank" rel="noopener noreferrer"';
    const extra = item.attrs ? ` ${item.attrs}` : "";
    return `<a href="${url}"${ext}${extra}><span class="source-link-label">${label}</span>${noteHtml}</a>`;
  }

  function innerHtml(items, lang) {
    return (items || []).map((it) => itemHtml(it, lang)).join("");
  }

  function mountFlat(el, items, lang) {
    if (!el) return;
    el.className = "links source-links";
    el.innerHTML = innerHtml(items, lang);
  }

  function groupsHtml(groups, lang) {
    return (groups || [])
      .map((g) => {
        const inner = innerHtml(g.items, lang);
        const count = (g.items || []).length;
        const title = pick(g.title, lang);
        return `<details class="source-group-fold">
          <summary class="source-group-summary">
            <span class="source-group-summary-label">${title}</span>
            <span class="source-group-summary-meta"><span class="source-group-count">${count}</span><span class="aux-chevron" aria-hidden="true"></span></span>
          </summary>
          <div class="source-group-body">
            <div class="links source-links">${inner}</div>
          </div>
        </details>`;
      })
      .join("");
  }

  function introBodyHtml({ intro, groups }, lang) {
    const introP = intro
      ? `<p class="source-section-intro">${pick(intro, lang)}</p>`
      : "";
    return introP + groupsHtml(groups, lang);
  }

  global.SourceLinks = { pick, itemHtml, innerHtml, mountFlat, groupsHtml, introBodyHtml };
})(window);
