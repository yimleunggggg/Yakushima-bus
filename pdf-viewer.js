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

  /** 移动端内嵌预览（由 PDF 导出，每页一张） */
  const PDF_PREVIEW = {
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin.pdf": [
      "/assets/pdf-preview/yakushimabus-map-unchin-1.jpg",
      "/assets/pdf-preview/yakushimabus-map-unchin-2.jpg",
    ],
    "https://yakukan.jp/wp-content/uploads/2024/12/yakushimabus-map-unchin-en.pdf": [
      "/assets/pdf-preview/yakushimabus-map-unchin-en-1.jpg",
      "/assets/pdf-preview/yakushimabus-map-unchin-en-2.jpg",
    ],
  };

  global.pdfPreviewPages = function (url) {
    const clean = String(url || "").split("#")[0];
    return PDF_PREVIEW[clean] || [];
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
    container.innerHTML = pages.map((src, i) =>
      `<img src="${src}" alt="" class="pdf-mobile-page" loading="${i ? "lazy" : "eager"}" decoding="async">`
    ).join("");
    return true;
  };

  global.preferNativePdf = function () {
    return global.AppCore?.preferNativePdf?.()
      ?? global.matchMedia("(hover: none) and (pointer: coarse)").matches;
  };

  global.pdfEmbedSrc = function (url) {
    const clean = String(url || "").split("#")[0];
    const base = PDF_MIRROR[clean] || clean;
    return `${base}#toolbar=0&navpanes=0&view=FitH`;
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
    let rafId = 0;
    let pan = null;

    function baseHeight() {
      return viewport.clientHeight || Math.min(window.innerHeight * 0.46, 360);
    }

    function embedHeight() {
      /* 高于视口，外层 viewport 才能单指/滚轮拖动 */
      return Math.round(baseHeight() * scale * 2.2);
    }

    function apply(nextScale) {
      scale = Math.min(max, Math.max(min, nextScale));
      const ratioX = (viewport.scrollLeft + viewport.clientWidth / 2) / Math.max(viewport.scrollWidth, 1);
      const ratioY = (viewport.scrollTop + viewport.clientHeight / 2) / Math.max(viewport.scrollHeight, 1);
      const h = embedHeight();

      embed.style.width = `${Math.round(scale * 100)}%`;
      embed.style.minHeight = `${h}px`;
      embed.style.height = `${h}px`;
      if (zoomReset) zoomReset.textContent = `${Math.round(scale * 100)}%`;

      requestAnimationFrame(() => {
        viewport.scrollLeft = Math.max(0, ratioX * viewport.scrollWidth - viewport.clientWidth / 2);
        viewport.scrollTop = Math.max(0, ratioY * viewport.scrollHeight - viewport.clientHeight / 2);
      });
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
      const next = scale * (dist / pinchDist);
      pinchDist = dist;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        apply(next);
        rafId = 0;
      });
    }, { passive: false });

    viewport.addEventListener("touchend", (e) => {
      if (e.touches.length === 0) endPan();
      pinchDist = 0;
    });
    viewport.addEventListener("touchcancel", () => {
      endPan();
      pinchDist = 0;
    });

    apply(1);
    return { apply, getScale: () => scale, reset: () => apply(1) };
  };
})(window);
