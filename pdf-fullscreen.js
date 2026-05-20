(function (global) {
  function activeEl() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function exitFs() {
    const fn = document.exitFullscreen || document.webkitExitFullscreen;
    return fn?.call(document);
  }

  function enterFs(el) {
    const fn = el.requestFullscreen || el.webkitRequestFullscreen;
    return fn?.call(el);
  }

  global.bindPdfFullscreen = function ({ stage, toggleBtn, getLabel, onFallback }) {
    function syncBtn() {
      const on = activeEl() === stage;
      toggleBtn.textContent = getLabel(on ? "exit" : "enter");
      toggleBtn.setAttribute("aria-pressed", on ? "true" : "false");
    }

    toggleBtn.addEventListener("click", () => {
      if (activeEl()) exitFs();
      else enterFs(stage)?.catch?.(() => onFallback?.());
    });

    stage.querySelector(".pdf-fs-close")?.addEventListener("click", () => {
      if (activeEl() === stage) exitFs();
    });

    document.addEventListener("fullscreenchange", syncBtn);
    document.addEventListener("webkitfullscreenchange", syncBtn);
    syncBtn();
    return { sync: syncBtn };
  };
})(window);
