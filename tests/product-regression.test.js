const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
function runtime() {
  const c = { window: { addEventListener() {} }, URL, URLSearchParams, localStorage: { getItem: () => null }, location: { search: '', protocol: 'file:' }, document: { readyState: 'loading', documentElement: {}, addEventListener() {} } };
  vm.createContext(c);
  for (const file of ['transport-data.js', 'transport-status.js', 'data.js', 'meta-data.js', 'app-core.js', 'access-data.js', 'access-schedule.js', 'partner-data.js', 'partner-ui.js']) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8').replace('AppCore.applyDocLang(AppCore.getLang());',''),c);
  vm.runInContext('this.core=AppCore;this.bus=BUS_DATA;this.access=ACCESS_DATA;this.schedule=AccessSchedule;',c);
  return c;
}
test('nearby port matches collapse to four real return buses on all day types', () => {
  const { core } = runtime();
  core.routeAvailable = route => core.routeInSeason(route);
  for (const day of ['weekday','saturday','sunday_holiday']) {
    const trips=core.findTrips('shiratani','miyanoura_port',day);
    assert.deepEqual(Array.from(trips,t=>core.formatTime(t.dep)),['09:00','10:40','13:45','16:10']);
    assert.ok(trips.every(t=>t.arrStop==='miyanoura_port'));
    assert.equal(new Set(trips.map(t=>t.trip)).size,4);
  }
});
test('separate runs sharing an arrival time are not merged', () => {
  const {core,bus}=runtime();
  core.routeAvailable = route => core.routeInSeason(route);
  const dir=bus.routes.find(r=>r.id==='shiratani').directions.find(d=>d.id==='from');
  dir.columnTrips.push(JSON.parse(JSON.stringify(dir.columnTrips[0])));
  assert.equal(core.findTrips('shiratani','miyanoura_port','weekday').length,5);
});
test('Arakawa query has real museum to trailhead service', () => {
  const {core}=runtime();
  core.routeAvailable=()=>true;
  const trips=core.findTrips('yakusugi_museum','arakawa_trailhead','weekday');
  assert.ok(trips.length>0);
  assert.ok(trips.every(t=>t.depStop==='yakusugi_museum' && t.arrStop==='arakawa_trailhead'));
});
test('travel date changes seasons at boundaries, never falls back after expiry', () => {
  const {schedule,access}=runtime();
  assert.equal(schedule.season(access,'2026-09-30').id,'autumn_2026');
  assert.equal(schedule.season(access,'2026-10-01').id,'winter_2026');
  assert.equal(schedule.season(access,'2027-02-28').id,'winter_2026');
  for (const date of ['2027-03-01','2026-03-15','2026-02-30','']) {
    assert.equal(schedule.season(access,date),null);
    assert.equal(schedule.sections(access,date).find(s=>s.id==='jetfoil_out').rows.length,0);
  }
  const sail=(date,no)=>schedule.sections(access,date).find(s=>s.id==='jetfoil_out').rows.find(r=>r.no===no);
  assert.equal(sail('2026-09-30','118').dep,'15:45');
  assert.equal(sail('2026-10-01','118').dep,'14:45');
  assert.equal(sail('2026-09-30','112').dep,'08:00');
});
test('affiliate placements have matching destinations, preserved attribution and no unverified ratings', () => {
  const c=runtime(),d=c.window.AFFILIATE_DATA;
  for (const [key, destination] of [['destYakushima','p60271491-yakushima'],['destKagoshima','c21043']]) {
    const u=new URL(d.items[key].url);
    assert.equal(u.searchParams.get('aid'),'125410');
    assert.equal(u.searchParams.get('aff_adid'),d.items[key].adid);
    assert.ok(u.searchParams.get('k_site').includes(`/destination/${destination}/`));
  }
  assert.ok(!d.experiences.some(x=>x.productCode==='143822P2'));
  assert.ok(d.experiences.every(x=>!x.rating && !x.reviewCount));
  assert.equal(d.items.jetfoil.adid,'1492155');
  assert.equal(d.items.destKagoshima.adid,'1492153');
  assert.equal(d.items.senganEn.adid,'1492169');
  assert.equal(d.experiences.find(x=>x.id==='klook_yakuzaru_day').adid,'1492158');
  for(const key of ['samanaHotel','iwasakiHotel']) {
    const target=new URL(new URL(d.items[key].url).searchParams.get('k_site'));
    assert.equal(target.search,'');
    assert.match(target.pathname,/\/hotels\/detail\//);
  }
  for (const lang of ['ja','zh','en']) {
    assert.ok(c.window.AffiliateUI.jetfoilAffiliateHintHtml(lang).length>0);
    assert.doesNotMatch(c.window.AffiliateUI.trekkingSectionHtml(lang),/2026-05-20|affiliate-trust-stars/);
    assert.match(c.window.AffiliateUI.trekkingSectionHtml(lang),/destination%2Fp60271491-yakushima/);
    assert.match(c.window.AffiliateUI.trekkingSectionHtml(lang),/destination%2Fc21043/);
    assert.equal((c.window.AffiliateUI.ferryBottomHtml(lang).match(/destination%2Fp60271491-yakushima/g)||[]).length,1);
    assert.equal((c.window.AffiliateUI.ferryBottomHtml(lang).match(/destination%2Fc21043/g)||[]).length,1);
    assert.match(c.window.AffiliateUI.ferryBottomHtml(lang),/1492169/);
    assert.doesNotMatch(c.window.AffiliateUI.ferryBottomHtml(lang),/jr_japan_7|1492176|1492181/);
    assert.match(c.window.AffiliateUI.experiencesSectionHtml(lang,'without-car'),/commission|佣金|紹介料/);
    assert.equal((c.window.AffiliateUI.experiencesSectionHtml(lang,'without-car').match(/<article class="affiliate-card/g)||[]).length,2);
    assert.match(c.window.AffiliateUI.lodgingSectionHtml(lang),/1492165/);
    assert.match(c.window.AffiliateUI.lodgingSectionHtml(lang),/1492166/);
  }
});
test('Klook localization preserves partner attribution in every language', () => {
  const c=runtime();
  for(const [lang,locale] of Object.entries({ja:'ja',zh:'zh-CN',en:'en-US'})) {
    for(const it of Object.values(c.window.AFFILIATE_DATA.items)) {
      const url=new URL(c.window.AffiliateUI.localizedUrl(it,lang));
      assert.equal(url.searchParams.get('aid'),'125410');
      assert.equal(url.searchParams.get('aff_adid'),it.adid);
      assert.ok(new URL(url.searchParams.get('k_site')).pathname.startsWith('/'+locale+'/'));
    }
  }
});

test('current Shiratani suspension hides scheduled trips without hiding Arakawa service', () => {
  const c = runtime();
  const { core, bus } = c;
  assert.equal(c.window.TransportStatus.timetableAvailable(), true);
  assert.equal(c.window.TransportStatus.blocked(bus.routes.find(r=>r.id==='shiratani')), true);
  assert.equal(core.findTrips('shiratani', 'miyanoura_port', 'weekday').length, 0);
  assert.ok(core.findTrips('yakusugi_museum', 'arakawa_trailhead', 'weekday').length > 0);
  const matsubanda=bus.routes.find(r=>r.id.startsWith('matsubanda'));
  assert.equal(core.routeAvailable(matsubanda), false);
});

test('suspended Shiratani tour is not promoted while the road is closed', () => {
  const c=runtime();
  const html=c.window.AffiliateUI.experiencesSectionHtml('zh','without-car');
  assert.doesNotMatch(html,/43454P739|146665|76916|白谷徒步/);
  assert.match(html,/1492158|43454P373/);
  const hike=c.window.AffiliateUI.trekkingSectionHtml('zh');
  assert.match(hike,/白谷云水峡路线目前封闭/);
  assert.match(hike,/https:\/\/yakukan\.jp\/topics\/19316\.html/);
  assert.doesNotMatch(hike,/43454P373/);
});
test('October timetable and ferry suspension respect current official dates', () => {
  const { core, access, schedule } = runtime();
  core.routeAvailable = route => core.routeInSeason(route);
  const portAirport = core.findTrips('miyanoura_port', 'airport', 'weekday');
  assert.ok(portAirport.some(t => t.dep === '8:00' && t.arr === '8:23'));
  const ferry = date => schedule.sections(access, date).find(s => s.id === 'ferry');
  assert.equal(ferry('2026-10-18').rows.length, 0);
  assert.equal(ferry('2026-10-19').rows.length, 2);
  assert.equal(schedule.sections(access,'2026-09-30').find(s=>s.id==='ferry_fare').rows.length,0);
  assert.match(schedule.sections(access,'2026-10-09').find(s=>s.id==='ferry_fare').rows[0].adult,/7,000/);
});
