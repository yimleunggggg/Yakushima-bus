/** Shared metadata for JA/ZH/EN; filename retained for existing page references. */
(function () {
  const path = (location.pathname.replace(/\/+$/, "") || "") + "/";
  const page = window.SEO_PAGES?.[path];
  if (!page) return;

  function sync(lang) {
    const selected = page[lang] ? lang : "ja";
    const [title, description] = page[selected];
    const url = "https://yakushimabus.com" + path + "?lang=" + selected;
    document.title = title;
    const values = {
      'meta[name="description"]': description,
      'meta[property="og:title"]': title,
      'meta[property="og:description"]': description,
      'meta[property="og:url"]': url,
      'meta[name="twitter:title"]': title,
      'meta[name="twitter:description"]': description,
    };
    for (const [selector, value] of Object.entries(values)) {
      document.querySelector(selector)?.setAttribute("content", value);
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", url);
    document.querySelectorAll("[data-seo-lang]").forEach(el => {
      el.hidden = el.dataset.seoLang !== selected;
    });
    document.querySelectorAll('script[type="application/ld+json"]').forEach(el => {
      const data = JSON.parse(el.textContent);
      for (const node of data["@graph"] || [data]) {
        if (["WebPage", "AboutPage", "WebApplication"].includes(node["@type"])) {
          Object.assign(node, { name: title, description, url, inLanguage: selected === "zh" ? "zh-CN" : selected });
        }
        if (node['@type'] === 'Article') Object.assign(node, { headline:title, description, url, mainEntityOfPage:url, inLanguage:selected === 'zh' ? 'zh-CN' : selected });
      }
      el.textContent = JSON.stringify(data);
    });
  }

  sync(window.SiteLang?.current || "ja");
  document.addEventListener("DOMContentLoaded", () => sync(window.SiteLang?.current || "ja"));
  window.addEventListener("yakushima-bus-lang", event => sync(event.detail?.lang || window.SiteLang?.current || "ja"));
})();
