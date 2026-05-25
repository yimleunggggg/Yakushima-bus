/** GA4 — 衡量 ID：https://analytics.google.com */
window.GA_MEASUREMENT_ID = 'G-BX2P31GEHW';

(function () {
  var id = window.GA_MEASUREMENT_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;

  var host = location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host.endsWith('.local')
  ) {
    return;
  }

  var params = new URLSearchParams(location.search);
  var internal =
    params.get('ga_internal') === '1' ||
    localStorage.getItem('yakushima-bus-ga-internal') === '1';
  var debug = params.get('ga_debug') === '1';

  if (params.get('ga_internal') === '1') {
    localStorage.setItem('yakushima-bus-ga-internal', '1');
  }
  if (params.get('ga_internal') === '0') {
    localStorage.removeItem('yakushima-bus-ga-internal');
  }

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());

  var config = { anonymize_ip: true };
  if (internal) config.traffic_type = 'internal';
  if (debug) config.debug_mode = true;

  window.gtag('config', id, config);
})();
