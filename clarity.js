/** Microsoft Clarity — https://clarity.microsoft.com (yakushimabus.com) */
window.CLARITY_PROJECT_ID = 'xggkccgsor';

(function () {
  var id = window.CLARITY_PROJECT_ID;
  if (!id) return;

  var host = location.hostname;
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host.endsWith('.local')
  ) {
    return;
  }

  (function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    t = l.createElement(r);
    t.async = 1;
    t.src = 'https://www.clarity.ms/tag/' + i + '?ref=bwt';
    y = l.getElementsByTagName(r)[0];
    y.parentNode.insertBefore(t, y);
  })(window, document, 'clarity', 'script', id);
})();
