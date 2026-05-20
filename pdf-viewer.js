(function (global) {
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

    function baseHeight() {
      return Math.min(window.innerHeight * 0.46, 360);
    }

    function apply(nextScale) {
      scale = Math.min(max, Math.max(min, nextScale));
      const ratioX = (viewport.scrollLeft + viewport.clientWidth / 2) / Math.max(viewport.scrollWidth, 1);
      const ratioY = (viewport.scrollTop + viewport.clientHeight / 2) / Math.max(viewport.scrollHeight, 1);

      embed.style.width = `${Math.round(scale * 100)}%`;
      embed.style.minHeight = `${Math.round(baseHeight() * scale)}px`;
      if (zoomReset) zoomReset.textContent = `${Math.round(scale * 100)}%`;

      requestAnimationFrame(() => {
        viewport.scrollLeft = Math.max(0, ratioX * viewport.scrollWidth - viewport.clientWidth / 2);
        viewport.scrollTop = Math.max(0, ratioY * viewport.scrollHeight - viewport.clientHeight / 2);
      });
    }

    zoomIn?.addEventListener("click", () => apply(scale + step));
    zoomOut?.addEventListener("click", () => apply(scale - step));
    zoomReset?.addEventListener("click", () => apply(1));

    viewport.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        pinchDist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      }
    }, { passive: true });

    viewport.addEventListener("touchmove", (e) => {
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

    viewport.addEventListener("touchend", () => {
      pinchDist = 0;
    });

    apply(1);
    return { apply, getScale: () => scale, reset: () => apply(1) };
  };
})(window);
