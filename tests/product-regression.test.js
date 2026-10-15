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
    assert.ok(c.window.AffiliateUI.jetfoilSecondaryHtml(lang).length>0);
    assert.equal(d.items.jetfoil.hint,undefined);
    assert.doesNotMatch(c.window.AffiliateUI.travelGuideHtml(lang),/2026-05-20|affiliate-trust-stars/);
    assert.doesNotMatch(c.window.AffiliateUI.travelGuideHtml(lang),/destination%2F/);
    assert.equal((c.window.AffiliateUI.ferryBottomHtml(lang).match(/destination%2Fp60271491-yakushima/g)||[]).length,1);
    assert.equal((c.window.AffiliateUI.ferryBottomHtml(lang).match(/destination%2Fc21043/g)||[]).length,1);
    assert.match(c.window.AffiliateUI.ferryBottomHtml(lang),/1492169/);
    assert.doesNotMatch(c.window.AffiliateUI.ferryBottomHtml(lang),/jr_japan_7|1492176|1492181/);
    assert.ok(c.window.AffiliateUI.bookingNotesHtml(lang).length>0);
    assert.doesNotMatch(c.window.AffiliateUI.bookingNotesHtml(lang),/commission|佣金|紹介料/);
    for (const html of [c.window.AffiliateUI.travelGuideHtml(lang),c.window.AffiliateUI.experiencesSectionHtml(lang,'without-car'),c.window.AffiliateUI.lodgingSectionHtml(lang),c.window.AffiliateUI.ferryBottomHtml(lang)]) {
      assert.doesNotMatch(html,/commission|佣金|紹介料/);
    }
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

test('only verified Klook products show dated booking and review evidence', () => {
  const c=runtime(), data=c.window.AFFILIATE_DATA;
  const tour=data.experiences.find(x=>x.id==='klook_yakuzaru_day');
  assert.equal(tour.socialProof.checkedAt,'2026-10-11');
  assert.equal(data.items.senganEn.socialProof.reviews,193);
  for (const [lang, booked, reviews] of [['ja','100件以上の予約','8件の評価'],['zh','100+ 次预订','8 条评价'],['en','100+ bookings','8 reviews']]) {
    const tourHtml=c.window.AffiliateUI.experiencesSectionHtml(lang,'without-car');
    assert.ok(tourHtml.includes(booked));
    assert.ok(tourHtml.includes(reviews));
    assert.equal((tourHtml.match(/affiliate-social-proof/g)||[]).length,1);
    assert.match(c.window.AffiliateUI.ferryBottomHtml(lang),/2026-10-11/);
  }
  assert.doesNotMatch(c.window.AffiliateUI.experiencesSectionHtml('zh','without-car'),/人预订/);
});

test('travel guide groups sourced offers and withholds closed Shiratani booking links', () => {
  const c=runtime(), d=c.window.AFFILIATE_DATA;
  for (const [key,id] of Object.entries({shirataniWalking:'1492163',kagoshimaYakushimaDay:'1492168',senganSpecial:'1492172',kagoshimaKitchen:'1492170',ibusukiHotel:'1492174'})) {
    assert.equal(d.items[key].adid,id);
    assert.equal(new URL(d.items[key].url).searchParams.get('aff_adid'),id);
  }
  for (const lang of ['ja','zh','en']) {
    const html=c.window.AffiliateUI.travelGuideHtml(lang);
    assert.equal((html.match(/href="#/g)||[]).length,1);
    assert.match(html,/#hiking-routes/);
    for (const id of ['1492158','1492165','1492166','1492169','1492172','1492170','1492174']) assert.match(html,new RegExp(id));
    assert.doesNotMatch(html,/data-affiliate-id="1492163"|data-affiliate-id="1492168"/);
    assert.doesNotMatch(html,/check_in=2026|check_out=2026/);
  }
  assert.match(c.window.AffiliateUI.travelGuideHtml('zh'),/4\.9\/5.*119 条评价/);
  const travel=c.window.AffiliateUI.travelGuideHtml('zh');
  assert.equal((travel.match(/<article class="affiliate-card affiliate-card--klook">/g)||[]).length,6);
  assert.match(travel,/data-affiliate-id="1316225"/);
  const hikingCard=travel.split('<article').find(card=>card.includes('data-affiliate-id="1316225"')).split('</article>')[0];
  assert.match(hikingCard,/绳文杉/);
  assert.match(hikingCard,/50\+ 人参加过.*5\.0\/5.*3 条评价/);
  assert.doesNotMatch(hikingCard,/封闭|通行止め|closed|affiliate-card-route-notice/);
  assert.equal((hikingCard.match(/data-affiliate-id="1316225"/g)||[]).length,1);
  assert.doesNotMatch(travel,/travel-hero|travel-paused|不展示|暂缓推荐|快照|卖点/);
  assert.match(c.window.AffiliateUI.jetfoilSecondaryHtml('zh'),/在 Klook 查看船票（优惠）/);
  c.window.TransportStatus.alerts=()=>[];
  const reopened=c.window.AffiliateUI.travelGuideHtml('zh');
  assert.match(reopened,/data-affiliate-id="1492163"/);
  assert.match(reopened,/data-affiliate-id="1492168"/);
  delete c.window.TransportStatus;
  const unknown=c.window.AffiliateUI.travelGuideHtml('zh');
  assert.doesNotMatch(unknown,/data-affiliate-id="1492163"|data-affiliate-id="1492168"/);
  assert.doesNotMatch(fs.readFileSync(path.join(root,'trekking/index.html'),'utf8'),/trekAffiliatePanel/);
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
  const hike=c.window.AffiliateUI.travelGuideHtml('zh');
  assert.doesNotMatch(hike,/data-affiliate-id="1492163"|data-affiliate-id="1492168"/);
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
