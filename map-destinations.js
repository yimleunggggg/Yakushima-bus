/** Render map page「主景区与公交」from DESTINATIONS_DATA */
(function (global) {
  function pick(o, lang) {
    if (!o) return "";
    return o[lang] || o.ja || o.en || "";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function presetLabel(fromId, toId, stopName) {
    return `${stopName(fromId)} → ${stopName(toId)}`;
  }

  function renderSpotActions(presets, ctx) {
    if (!presets?.length) return "";
    const { t, stopName, onFare, onTimetable } = ctx;
    return `<div class="map-dest-actions" role="group" aria-label="${escapeHtml(t("destActions"))}">
      ${presets
        .map((p) => {
          const label = presetLabel(p.from, p.to, stopName);
          return `<button type="button" class="map-dest-btn" data-action="fare" data-from="${p.from}" data-to="${p.to}">${escapeHtml(t("destSetFare"))} · ${escapeHtml(label)}</button>
        <a class="map-dest-btn map-dest-btn-link" href="/?from=${p.from}&to=${p.to}&lang=${ctx.lang}">${escapeHtml(t("destTimetable"))} · ${escapeHtml(label)}</a>`;
        })
        .join("")}
    </div>`;
  }

  function renderVariant(v, ctx) {
    const cells = (v.cells || []).map((c) => `<li>${pick(c, ctx.lang)}</li>`).join("");
    const links = (v.links || [])
      .map(
        (l) =>
          `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(pick(l.label, ctx.lang))}</a>`
      )
      .join("");
    return `<article class="map-dest-variant">
      <h4 class="map-dest-variant-title">${escapeHtml(pick(v.title, ctx.lang))}</h4>
      <ul class="map-dest-lines">${cells}</ul>
      ${renderSpotActions(v.presets, ctx)}
      ${links ? `<div class="map-dest-ref">${links}</div>` : ""}
    </article>`;
  }

  function renderSpot(spot, ctx) {
    const badge = pick(spot.badge, ctx.lang);
    const intro = spot.intro ? `<p class="map-dest-intro">${pick(spot.intro, ctx.lang)}</p>` : "";
    let body = "";
    if (spot.variants?.length) {
      body = `<div class="map-dest-variants">${spot.variants.map((v) => renderVariant(v, ctx)).join("")}</div>`;
      const tracks = spot.trackLinks;
      if (tracks?.length) {
        const trackHtml = tracks
          .map(
            (l) =>
              `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(pick(l.label, ctx.lang))}</a>`
          )
          .join(" · ");
        body += `<p class="map-dest-track">${escapeHtml(ctx.t("destTrackRef"))} ${trackHtml}</p>`;
      }
    } else {
      const lines = (spot.lines || []).map((l) => `<li>${pick(l, ctx.lang)}</li>`).join("");
      const refs = (spot.links || [])
        .map(
          (l) =>
            `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(pick(l.label, ctx.lang))}</a>`
        )
        .join("");
      body = `<ul class="map-dest-lines">${lines}</ul>
        ${renderSpotActions(spot.presets, ctx)}
        ${refs ? `<div class="map-dest-ref">${refs}</div>` : ""}`;
    }
    return `<section class="map-dest-spot" data-priority="${spot.priority || ""}" id="dest-${spot.id}">
      <div class="map-dest-spot-head">
        <h3 class="map-dest-spot-title">${escapeHtml(pick(spot.title, ctx.lang))}</h3>
        ${badge ? `<span class="map-dest-badge">${escapeHtml(badge)}</span>` : ""}
      </div>
      ${intro}
      ${body}
    </section>`;
  }

  function bindActions(root, ctx) {
    root.querySelectorAll("[data-action='fare']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const from = btn.dataset.from;
        const to = btn.dataset.to;
        if (ctx.onFare) ctx.onFare(from, to);
      });
    });
  }

  function render(container, options) {
    const data = global.DESTINATIONS_DATA;
    if (!container || !data) return;
    const ctx = {
      lang: options.lang || "ja",
      t: options.t || ((k) => k),
      stopName: options.stopName || ((id) => id),
      onFare: options.onFare,
    };
    const disclaimer = pick(data.meta?.disclaimer, ctx.lang);
    container.innerHTML = `
      <p class="map-dest-disclaimer">${escapeHtml(disclaimer)}</p>
      <div class="map-dest-spots">${(data.spots || []).map((s) => renderSpot(s, ctx)).join("")}</div>`;
    bindActions(container, ctx);
  }

  global.MapDestinations = { render, pick };
})(typeof window !== "undefined" ? window : globalThis);
