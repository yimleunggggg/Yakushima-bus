const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(root, 'sources/seo-pages.json'), 'utf8'));

function runtime(pagePath, lang) {
  const events = {};
  const elements = new Map();
  for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]',
    'meta[property="og:url"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'link[rel="canonical"]']) {
    elements.set(selector, { attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } });
  }
  const evidence = ['ja', 'zh', 'en'].map(lang => ({ dataset: { seoLang: lang }, hidden: false }));
  const filename = path.join(root, pagePath, 'index.html');
  const html = fs.readFileSync(filename, 'utf8');
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => ({ textContent: m[1] }));
  const document = {
    title: '',
    querySelector: selector => elements.get(selector),
    querySelectorAll: selector => selector === '[data-seo-lang]' ? evidence : schemas,
    addEventListener: (type, fn) => { events[type] = fn; },
  };
  const window = { SiteLang: { current: lang }, addEventListener: (type, fn) => { events[type] = fn; } };
  const context = vm.createContext({ window, document, location: { pathname: pagePath } });
  for (const file of ['seo-data.js', 'seo-head-zh.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
  events.DOMContentLoaded();
  return { document, elements, schemas, evidence, events };
}

for (const pagePath of Object.keys(pages)) {
  test(`metadata follows all three languages on ${pagePath}`, () => {
    for (const initial of ['ja', 'zh', 'en']) {
      const c = runtime(pagePath, initial);
      for (const selected of [initial, 'en', 'zh', 'ja']) {
        c.events['yakushima-bus-lang']({ detail: { lang: selected } });
        assert.equal(c.document.title, pages[pagePath][selected][0]);
        assert.equal(c.elements.get('meta[name="description"]').attrs.content, pages[pagePath][selected][1]);
        assert.equal(c.elements.get('link[rel="canonical"]').attrs.href, `https://yakushimabus.com${pagePath}?lang=${selected}`);
        assert.equal(c.elements.get('meta[property="og:url"]').attrs.content, `https://yakushimabus.com${pagePath}?lang=${selected}`);
        assert.deepEqual(c.evidence.filter(e => !e.hidden).map(e => e.dataset.seoLang), [selected]);
        for (const schema of c.schemas) {
          const data = JSON.parse(schema.textContent);
          for (const node of data['@graph'] || [data]) {
            if (['WebPage', 'AboutPage', 'WebApplication'].includes(node['@type'])) {
              assert.equal(node.name, c.document.title);
              assert.equal(node.inLanguage, selected === 'zh' ? 'zh-CN' : selected);
            }
            if (node['@type'] === 'Article') {
              assert.equal(node.headline, c.document.title);
              assert.equal(node.url, `https://yakushimabus.com${pagePath}?lang=${selected}`);
              assert.equal(node.inLanguage, selected === 'zh' ? 'zh-CN' : selected);
            }
          }
        }
      }
    }
  });
}

test('the non-indexed intro has no generated index metadata', () => {
  assert.equal(pages['/intro/'], undefined);
  assert.equal(pages['/explore/'], undefined);
});
