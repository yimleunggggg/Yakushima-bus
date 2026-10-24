const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
function runtime() {
  const c = {window:{addEventListener(){}},URL,URLSearchParams,localStorage:{getItem:()=>null},location:{search:'',protocol:'file:'},document:{readyState:'loading',documentElement:{},addEventListener(){}}};
  vm.createContext(c);
  for (const file of ['transport-data.js','transport-status.js','data.js','map-data.js','meta-data.js','app-core.js','partner-data.js','partner-ui.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),c);
  vm.runInContext('this.core=AppCore;this.bus=BUS_DATA',c);
  c.core.japanParts = () => ({iso:'2026-10-24',weekday:6});
  return c;
}
test('Taneyaku reopens on official date while Matsubanda Shiratani stays suspended', () => {
  const {window:w,bus} = runtime();
  const taneyaku = bus.routes.find(r=>r.id==='shiratani');
  const matsubanda = bus.routes.find(r=>r.id==='matsubanda_shiratani');
  assert.equal(w.TransportStatus.blocked(taneyaku,'2026-10-17'),true);
  for (const date of ['2026-10-18','2026-10-24','2026-10-31']) {
    assert.equal(w.TransportStatus.blocked(taneyaku,date),false);
    assert.equal(w.TransportStatus.blocked(matsubanda,date),true);
    assert.ok(w.TransportStatus.forStop('shiratani',date).every(a=>a.status!=='suspended'));
    assert.match(w.TransportStatus.forCourse('taikoiwa',date).find(a=>a.status==='notice').message.en,/some trail sections|Parts of the Yayoi-sugi/);
  }
});
test('reopened Shiratani searches return the four official departures both ways on every day type', () => {
  const {core} = runtime();
  for (const day of ['weekday','saturday','sunday_holiday']) {
    for (const [from,to,times] of [['miyanoura_port','shiratani',['08:20','10:05','13:10','15:30']],['shiratani','miyanoura_port',['09:00','10:40','13:45','16:10']]]) {
      const trips=core.findTrips(from,to,day).filter(t=>t.depStop===from && t.arrStop===to);
      assert.deepEqual(Array.from(trips,t=>core.formatTime(t.dep)),times);
      assert.ok(trips.every(t=>t.route.operator==='taneyaku'));
    }
  }
});
test('reopened booking cards retain partial-closure advice and partner attribution', () => {
  const {window:w}=runtime();
  const original=w.TransportStatus.alerts.bind(w.TransportStatus);
  w.TransportStatus.alerts=()=>original('2026-10-24');
  for (const lang of ['ja','zh','en']) {
    const html=w.AffiliateUI.travelGuideHtml(lang);
    for(const id of ['1492163','1492168']) {
      const card=html.split('<article').find(part=>part.includes(`data-affiliate-id="${id}"`)).split('</article>')[0];
      assert.match(card,/affiliate-route-note/);
      assert.match(card,/y-rekumori\.com/);
      assert.match(card,/aid=125410/);
    }
    assert.doesNotMatch(html,/全便運休|全线停运|All Miyanoura/);
  }
});
test('update labels use months while exact source and effective dates stay machine-readable', () => {
  const {window:w}=runtime();
  assert.equal(w.TransportStatus.month('2026-10-24','zh'),'2026年10月');
  assert.equal(w.TransportStatus.month('2026-10-24','ja'),'2026年10月');
  assert.equal(w.TransportStatus.month('2026-10-24','en'),'Oct 2026');
  assert.equal(w.TRANSPORT_DATA.checkedAt,'2026-10-24');
  assert.equal(w.TRANSPORT_DATA.alerts.find(a=>a.id==='shiratani-partial-reopening').validFrom,'2026-10-18');
  const llms=fs.readFileSync(path.join(root,'llms.txt'),'utf8');
  assert.match(llms,/partially reopened/);
  assert.doesNotMatch(llms,/Shiratani Unsuikyo is closed to access|all-day suspension/);
});
