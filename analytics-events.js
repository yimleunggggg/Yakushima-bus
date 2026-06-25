/** GA4 关键事件 — 在 GA4 后台将下列事件标为「关键事件」 */
(function () {
  function event(name, params) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, Object.assign({ page_path: location.pathname }, params || {}));
  }

  window.BusAnalytics = { event };

  document.addEventListener(
    "click",
    (e) => {
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
    },
    true
  );
})();
