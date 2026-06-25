/** GA4 事件 — 在 GA4「事件」里标为关键事件（见 docs/notes/2026-06-25-analytics.md） */
(function () {
  function event(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, Object.assign({ page_path: location.pathname }, params || {}));
  }

  window.BusAnalytics = { event };

  document.addEventListener(
    "click",
    (e) => {
      const nav = e.target.closest(".nav-main a[href]");
      if (nav) {
        event("nav_click", {
          link_url: nav.getAttribute("href") || "",
          link_text: (nav.textContent || "").trim().slice(0, 40),
        });
        return;
      }

      const langBtn = e.target.closest(".lang-switch button[data-lang]");
      if (langBtn) {
        event("lang_switch", { lang: langBtn.dataset.lang });
        return;
      }

      const footerA = e.target.closest(".app-footer-links a[href]");
      if (footerA) {
        event("footer_click", { link_url: footerA.getAttribute("href") || "" });
        return;
      }

      const a = e.target.closest("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/\.pdf(\?|#|$)/i.test(href) || href.includes("/assets/pdf/")) {
        event("file_download", {
          file_name: href.split("/").pop().split("#")[0] || "pdf",
          link_url: href,
        });
      }
      if (/google\.com\/maps|maps\.google/.test(href)) {
        event("open_maps", { link_url: href });
      }
      if (/^\/(fare|map|ferry|access|guide|trekking|without-car|intro|about)\/?/i.test(href.replace(location.origin, "")) || href.startsWith("/")) {
        const path = href.split("?")[0];
        if (path && path !== location.pathname) {
          event("internal_link", { link_url: href, link_text: (a.textContent || "").trim().slice(0, 60) });
        }
      }
    },
    true
  );

  document.addEventListener(
    "toggle",
    (e) => {
      const d = e.target;
      if (d.tagName !== "DETAILS" || !d.open) return;
      if (d.classList.contains("aux-block") || d.classList.contains("intro-sources-fold")) {
        const label = d.querySelector("summary")?.textContent?.trim().slice(0, 80) || "";
        event("section_open", { section: label });
      }
    },
    true
  );
})();
