const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '../lang-boot.js'), 'utf8');

function boot(href, { stored, picked = false, locale = 'en-US', referrer = '' } = {}) {
  const location = new URL(href);
  const storage = new Map(stored ? [['yakushima-bus-lang', stored]] : []);
  if (picked) storage.set('yakushima-bus-lang-picked', '1');
  const window = {}, document = { documentElement: {}, referrer };
  const context = vm.createContext({
    window, document, location, URL, URLSearchParams,
    navigator: { languages: [locale], userAgent: 'test-browser' },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    history: { replaceState(_state, _title, url) { location.href = String(url); } },
  });
  vm.runInContext(code, context);
  return { location, window, document };
}

test('bare homepage stays Japanese regardless of browser, saved choice or search referrer', () => {
  for (const options of [{}, { locale: 'zh-CN' }, { stored: 'en', picked: true }, { stored: 'zh' }, { referrer: 'https://www.baidu.com/' }]) {
    const c = boot('https://yakushimabus.com/', options);
    assert.equal(c.window.SiteLang.current, 'ja');
    assert.equal(c.window.SiteLang.resolveLang(), 'ja');
    assert.equal(c.location.href, 'https://yakushimabus.com/');
    assert.equal(c.document.documentElement.lang, 'ja');
  }
});

test('explicit homepage language wins over conflicting preferences', () => {
  for (const lang of ['ja', 'zh', 'en']) {
    const c = boot('https://yakushimabus.com/?lang=' + lang, { stored: 'en', picked: true, locale: 'zh-CN' });
    assert.equal(c.window.SiteLang.current, lang);
    assert.equal(c.window.SiteLang.resolveLang(), lang);
    assert.equal(c.document.documentElement.lang, lang === 'zh' ? 'zh-CN' : lang);
    assert.equal(c.location.search, lang === 'ja' ? '' : '?lang=' + lang);
  }
});

test('legacy homepage aliases preserve route, tracking parameters and fragment', () => {
  const c = boot('https://yakushimabus.com/index.html?lang=ja&from=airport&to=anbo&utm_source=test#results');
  assert.equal(c.location.pathname, '/');
  assert.equal(c.location.searchParams.has('lang'), false);
  assert.equal(c.location.searchParams.get('from'), 'airport');
  assert.equal(c.location.searchParams.get('to'), 'anbo');
  assert.equal(c.location.searchParams.get('utm_source'), 'test');
  assert.equal(c.location.hash, '#results');
});

test('manual language switches keep the homepage URL in sync without losing the route', () => {
  const c = boot('https://yakushimabus.com/?from=airport&to=anbo#results');
  for (const lang of ['en', 'zh', 'ja']) {
    c.window.SiteLang.current = lang;
    c.window.SiteLang.syncLangUrl(lang);
    assert.equal(c.location.searchParams.get('lang'), lang === 'ja' ? null : lang);
    assert.equal(c.window.SiteLang.resolveLang(), lang);
    assert.equal(c.location.searchParams.get('from'), 'airport');
    assert.equal(c.location.hash, '#results');
  }
});

test('invalid homepage language falls back to stable Japanese', () => {
  const c = boot('https://yakushimabus.com/?lang=fr', { stored: 'en', picked: true });
  assert.equal(c.window.SiteLang.current, 'ja');
  assert.equal(c.location.search, '');
});

test('other pages keep their existing preference and explicit language behavior', () => {
  for (const path of ['/fare/', '/ferry/', '/map/', '/without-car/']) {
    const c = boot('https://yakushimabus.com' + path, { stored: 'zh', picked: true });
    assert.equal(c.window.SiteLang.current, 'zh');
    assert.equal(c.location.search, '?lang=zh');
    const explicit = boot('https://yakushimabus.com' + path + '?lang=ja', { stored: 'en', picked: true });
    assert.equal(explicit.window.SiteLang.current, 'ja');
    assert.equal(explicit.location.search, '?lang=ja');
  }
});
