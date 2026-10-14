const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const catalog = require('../explore/catalog.js');
const harness = require('../explore/search-harness.js');
const context = { window: {} };
for (const file of ['transport-data.js', 'partner-data.js']) vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
const base = { catalog, transport: context.window.TRANSPORT_DATA, partners: context.window.AFFILIATE_DATA, today: '2026-10-13', date: '2026-10-13' };
const ask = (q, extra = {}) => harness.answer(q, { ...base, ...extra });

test('Kyushu rail pass is conditional on foreign temporary visitor eligibility', () => {
  const undecided = ask('九州 JR パス', { lang: 'ja' });
  assert.equal(undecided.matches[0].id, 'jr-kyushu');
  assert.equal(undecided.matches[0].affiliate, null);
  const visitor = ask('九州 JR パス', { travelerType: 'visitor' });
  assert.match(visitor.matches[0].affiliate.url, /klook/);
  const resident = ask('九州 JR パス', { travelerType: 'resident' });
  assert.ok(resident.excluded.some(x => x.id === 'jr-kyushu' && x.ineligible));
  assert.ok(resident.matches.every(x => x.id !== 'jr-kyushu'));
});

test('Shiratani closure excludes hiking route even when an old product might exist', () => {
  const result = ask('白谷雲水峡を歩きたい', { lang: 'ja' });
  assert.ok(result.excluded.some(x => x.id === 'shiratani' && x.blocking?.sourceUrl));
  assert.ok(result.matches.every(x => x.id !== 'shiratani'));
  assert.ok(result.matches.some(x => x.id === 'janokuchi'));
  assert.ok(result.matches.some(x => x.id === 'tachudake'));
});

test('Yakushima ferry query resolves shared commercial catalog and map', () => {
  const result = ask('屋久島へ高速船で行きたい', { lang: 'ja' });
  const access = result.matches.find(x => x.id === 'yakushima-access');
  assert.ok(access);
  assert.equal(access.affiliate.url, context.window.AFFILIATE_DATA.items.jetfoil.url);
  assert.match(access.map, /google.com\/maps/);
});

test('unknown topic does not invent an answer; source age marks recheck', () => {
  assert.equal(ask('北海道のスキー場').matches.length, 0);
  const later = ask('鹿児島 仙巌園', { today: '2026-12-01' });
  assert.ok(later.matches.some(x => x.id === 'kagoshima-senganen' && x.sourceReviewDue));
});

test('AI adapter permits only grounded eligible candidate IDs and citations', () => {
  const adapter = require('../explore/ai-adapter.js');
  const result = ask('白谷雲水峡を歩きたい');
  const request = adapter.payload('白谷雲水峡を歩きたい', result, 'ja');
  const good = { recommendations: [{ id: 'janokuchi', citations: ['https://yakukan.jp/topics/19316.html'] }] };
  assert.equal(adapter.validate(good, request), true);
  assert.equal(adapter.validate({ recommendations: [{ id: 'shiratani', citations: ['https://yakukan.jp/topics/19316.html'] }] }, request), false);
  assert.equal(adapter.validate({ recommendations: [{ id: 'janokuchi', citations: ['https://example.com'] }] }, request), false);
});
