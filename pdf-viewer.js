(function (global) {
  /** 同源镜像：跨域 iframe 嵌入 PDF 在桌面浏览器常黑屏 */
  const PDF_MIRROR = {
    "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301.pdf":
      "/assets/pdf/taneyakubus-timetable-20260301.pdf",
    "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301-en.pdf":
      "/assets/pdf/taneyakubus-timetable-20260301-en.pdf",
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf":
      "/assets/pdf/yakushimabus-map-unchin.pdf",
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf":
      "/assets/pdf/yakushimabus-map-unchin-en.pdf",
  };

  /** 稳定的内嵌预览（由 PDF 导出，每页一张） */
  const PDF_PREVIEW = {
    "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301.pdf": [
      "/assets/pdf-preview/taneyakubus-timetable-20260301-1.jpg",
    ],
    "https://yakukan.jp/wp-content/uploads/2026/03/taneyakubus-timetable-20260301-en.pdf": [
      "/assets/pdf-preview/taneyakubus-timetable-20260301-en-1.jpg",
    ],
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf": [
      "/assets/pdf-preview/yakushimabus-map-unchin-1.jpg",
      "/assets/pdf-preview/yakushimabus-map-unchin-2.jpg",
    ],
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf": [
      "/assets/pdf-preview/yakushimabus-map-unchin-en-1.jpg",
      "/assets/pdf-preview/yakushimabus-map-unchin-en-2.jpg",
    ],
  };

  const PDF_PREVIEW_DIMS = {
    "/assets/pdf-preview/taneyakubus-timetable-20260301-1.jpg": [2002, 1418],
    "/assets/pdf-preview/taneyakubus-timetable-20260301-en-1.jpg": [2002, 1418],
    "/assets/pdf-preview/yakushimabus-map-unchin-1.jpg": [2002, 1418],
    "/assets/pdf-preview/yakushimabus-map-unchin-2.jpg": [1684, 1190],
    "/assets/pdf-preview/yakushimabus-map-unchin-en-1.jpg": [2002, 1418],
    "/assets/pdf-preview/yakushimabus-map-unchin-en-2.jpg": [1684, 1190],
    "/assets/pdf-preview/yakuzarugo-1.jpg": [1684, 1191],
  };

  /** 默认打开页（1-based）；运价 PDF 第 1 页为路线图、第 2 页为运价表 */
  const PDF_START_PAGE = {
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf": 2,
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf": 2,
    "/assets/pdf/yakushimabus-map-unchin.pdf": 2,
    "/assets/pdf/yakushimabus-map-unchin-en.pdf": 2,
  };

  global.pdfStartPage = function (url) {
    const clean = String(url || "").split("#")[0];
    return PDF_START_PAGE[clean] || 1;
  };

  global.pdfUrlWithPage = function (url) {
    const clean = String(url || "").split("#")[0];
    const page = global.pdfStartPage(clean);
    return page > 1 ? `${clean}#page=${page}` : clean;
  };

  global.pdfPreviewPages = function (url) {
    const clean = String(url || "").split("#")[0];
    let pages = PDF_PREVIEW[clean] || [];
    const start = global.pdfStartPage(clean);
    if (start > 1 && pages.length >= start) {
      const idx = start - 1;
      pages = [pages[idx], ...pages.slice(0, idx), ...pages.slice(idx + 1)];
    }
    return pages;
  };

  global.renderPdfMobilePreview = function (container, url) {
    if (!container) return false;
    const pages = global.pdfPreviewPages(url);
    if (!pages.length) {
      container.innerHTML = "";
      container.hidden = true;
      return false;
    }
    container.hidden = false;
    container.innerHTML = pages.map((src, i) => {
      const [w, h] = PDF_PREVIEW_DIMS[src] || [2002, 1418];
      return `<img src="${src}" alt="" class="pdf-mobile-page" width="${w}" height="${h}" style="aspect-ratio:${w}/${h}" loading="${i ? "lazy" : "eager"}" decoding="async">`;
    }).join("");
    return true;
  };

  global.preferNativePdf = function () {
    return global.AppCore?.preferNativePdf?.()
      ?? global.matchMedia("(hover: none) and (pointer: coarse)").matches;
  };

  /**
   * 优先使用逐页 JPG 预览。Chrome 的内嵌 PDF 插件在 iframe 中会随环境
   * 出现黑屏/白屏；图片预览在桌面端和移动端都更稳定。
   * 无预览图时，触屏设备显示 PDF 直达链接，桌面端则回退到原生内嵌。
   */
  global.initPdfMobileFallback = function ({
    mobilePagesEl,
    url,
    stageEl,
    fallbackEl,
    embedEl,
    loadingEl,
  }) {
    const hasPreview = global.pdfPreviewPages(url).length > 0;
    if (!hasPreview && !global.preferNativePdf()) {
      stageEl?.parentElement?.classList.remove("pdf-image-mode");
      return false;
    }
    stageEl?.parentElement?.classList.add("pdf-image-mode");
    if (stageEl) stageEl.hidden = true;
    if (fallbackEl) fallbackEl.hidden = false;
    if (embedEl) embedEl.removeAttribute("src");
    if (loadingEl) loadingEl.hidden = true;
    global.renderPdfMobilePreview(mobilePagesEl, url);
    return true;
  };

  global.pdfEmbedSrc = function (url) {
    const clean = String(url || "").split("#")[0];
    const base = PDF_MIRROR[clean] || clean;
    const page = global.pdfStartPage(clean);
    const pageFrag = page > 1 ? `page=${page}&` : "";
    return `${base}#${pageFrag}toolbar=0&navpanes=0&view=FitH`;
  };

  global.initPdfViewer = function ({
    embed,
    url,
    loadingEl,
    slowHintEl,
    loadingText,
    slowText,
    onReady,
    resetZoom,
  }) {
    if (!embed || !url) return;

    if (loadingEl) {
      if (loadingText) loadingEl.textContent = loadingText;
      loadingEl.hidden = false;
    }
    if (slowHintEl) slowHintEl.hidden = true;

    let timer = null;
    const hideLoading = () => {
      if (loadingEl) loadingEl.hidden = true;
      if (timer) clearTimeout(timer);
      timer = null;
    };

    embed.onload = () => {
      hideLoading();
      onReady?.();
    };
    embed.onerror = () => {
      if (slowHintEl && slowText) {
        slowHintEl.textContent = slowText;
        slowHintEl.hidden = false;
      }
      setTimeout(hideLoading, 2500);
    };

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      hideLoading();
      if (slowHintEl) slowHintEl.hidden = false;
    }, 4000);

    embed.removeAttribute("loading");
    embed.src = global.pdfEmbedSrc(url);
    resetZoom?.();
  };

  global.bindPdfZoom = function ({
    viewport,
    embed,
    zoomIn,
    zoomOut,
    zoomReset,
    min = 0.5,
    max = 3,
    step = 0.25,
  }) {
    let scale = 1;
    let pinchDist = 0;
    let pinchBaseScale = 1;
    let pinching = false;
    let pan = null;

    function baseHeight() {
      return viewport.clientHeight || Math.min(window.innerHeight * 0.46, 360);
    }

    function embedHeight() {
      /* 高于视口，外层 viewport 才能单指/滚轮拖动 */
      return Math.round(baseHeight() * scale * 2.2);
    }

    function centerScroll() {
      const cw = viewport.clientWidth;
      const ch = viewport.clientHeight;
      const sl = viewport.scrollLeft;
      const st = viewport.scrollTop;
      const sw = Math.max(viewport.scrollWidth, 1);
      const sh = Math.max(viewport.scrollHeight, 1);
      const ratioX = (sl + cw / 2) / sw;
      const ratioY = (st + ch / 2) / sh;
      viewport.scrollLeft = Math.max(0, ratioX * viewport.scrollWidth - cw / 2);
      viewport.scrollTop = Math.max(0, ratioY * viewport.scrollHeight - ch / 2);
    }

    function apply(nextScale, { adjustScroll = true } = {}) {
      scale = Math.min(max, Math.max(min, nextScale));
      const h = embedHeight();

      embed.style.width = `${Math.round(scale * 100)}%`;
      embed.style.minHeight = `${h}px`;
      embed.style.height = `${h}px`;
      if (zoomReset) zoomReset.textContent = `${Math.round(scale * 100)}%`;

      if (adjustScroll) {
        requestAnimationFrame(centerScroll);
      }
    }

    function panTarget(el) {
      return el.closest(".pdf-toolbar, .pdf-fs-close, button, a");
    }

    function startPan(x, y) {
      pan = { x, y, sl: viewport.scrollLeft, st: viewport.scrollTop };
      viewport.classList.add("is-dragging");
    }

    function movePan(x, y) {
      if (!pan) return;
      viewport.scrollLeft = pan.sl + (pan.x - x);
      viewport.scrollTop = pan.st + (pan.y - y);
    }

    function endPan() {
      pan = null;
      viewport.classList.remove("is-dragging");
    }

    zoomIn?.addEventListener("click", () => apply(scale + step));
    zoomOut?.addEventListener("click", () => apply(scale - step));
    zoomReset?.addEventListener("click", () => apply(1));

    viewport.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || panTarget(e.target)) return;
      e.preventDefault();
      startPan(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", (e) => {
      if (pan) movePan(e.clientX, e.clientY);
    });
    window.addEventListener("mouseup", endPan);

    viewport.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        endPan();
        pinchDist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        pinchBaseScale = scale;
        pinching = true;
        return;
      }
      if (e.touches.length === 1 && !panTarget(e.target)) {
        startPan(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    viewport.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && pan) {
        e.preventDefault();
        movePan(e.touches[0].clientX, e.touches[0].clientY);
        return;
      }
      if (e.touches.length !== 2 || !pinchDist) return;
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const next = pinchBaseScale * (dist / pinchDist);
      apply(next, { adjustScroll: false });
    }, { passive: false });

    function endPinch() {
      if (!pinching) return;
      pinching = false;
      pinchDist = 0;
      centerScroll();
    }

    viewport.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) endPan();
      if (e.touches.length < 2) endPinch();
    });
    viewport.addEventListener("touchcancel", () => {
      endPan();
      endPinch();
    });

    apply(1);
    return { apply, getScale: () => scale, reset: () => apply(1) };
  };
})(window);
