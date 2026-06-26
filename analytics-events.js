/** GA4 事件 — 全站委托埋点（见 docs/notes/2026-06-25-analytics.md） */
(function () {
  function event(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, Object.assign({ page_path: location.pathname }, params || {}));
  }

  window.BusAnalytics = { event };

  document.addEventListener(
    "click",
    (e) => {
      const dayBtn = e.target.closest(".day-tabs button[data-day]");
      if (dayBtn) {
        event("timetable_day_tab", { day_type: dayBtn.dataset.day });
      }

      const presetBtn = e.target.closest(".presets button[data-from]");
      if (presetBtn) {
        event("timetable_preset", {
          from: presetBtn.dataset.from,
          to: presetBtn.dataset.to,
        });
      }

      if (e.target.closest("#swapBtn")) {
        const fromEl = document.getElementById("fromStop");
        const toEl = document.getElementById("toStop");
        event("timetable_swap", {
          from: fromEl?.value || "",
          to: toEl?.value || "",
        });
      }

      if (e.target.closest("#timeFilterBtn")) {
        event("timetable_time_open", {});
      }

      if (e.target.closest("#timeFilterReset")) {
        event("timetable_time_reset", {});
      }

      const pdfLangBtn = e.target.closest("button[data-pdf-lang]");
      if (pdfLangBtn) {
        event("pdf_lang_switch", { lang: pdfLangBtn.dataset.pdfLang });
      }

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

      const aff = e.target.closest("a[data-affiliate-id]");
      if (aff) {
        event("affiliate_click", {
          partner: aff.dataset.affiliatePartner || "klook",
          adid: aff.dataset.affiliateId || "",
          placement: aff.dataset.affiliatePlacement || "",
          link_url: aff.getAttribute("href") || "",
        });
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
      const pathOnly = href.replace(location.origin, "").split("?")[0];
      if (
        /^\/(fare|map|ferry|access|guide|trekking|without-car|intro|about)\/?$/i.test(pathOnly) ||
        (href.startsWith("/") && pathOnly && pathOnly !== location.pathname)
      ) {
        event("internal_link", {
          link_url: href,
          link_text: (a.textContent || "").trim().slice(0, 60),
        });
      }
    },
    true
  );

  document.addEventListener(
    "change",
    (e) => {
      const t = e.target;
      if (!t || t.id !== "upcomingOnly") return;
      event("timetable_upcoming_toggle", { enabled: !!t.checked });
    },
    true
  );

  document.addEventListener(
    "toggle",
    (e) => {
      const d = e.target;
      if (d.tagName !== "DETAILS" || !d.open) return;
      const label = d.querySelector("summary")?.textContent?.trim().slice(0, 80) || "";
      if (d.classList.contains("aux-block") || d.classList.contains("source-group-fold") || d.classList.contains("intro-sources-fold")) {
        event("section_open", { section: label });
      }
      if (d.classList.contains("seo-faq-item")) {
        event("faq_open", { question: label });
      }
    },
    true
  );
})();
