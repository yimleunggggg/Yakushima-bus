const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
function runtime(){
 const c={window:{addEventListener(){}},document:{readyState:'loading',addEventListener(){},documentElement:{}},location:{search:'',protocol:'file:'},localStorage:{getItem(){return 'zh';}},URLSearchParams};
 vm.createContext(c);
 for(const f of ['transport-data.js','transport-status.js','data.js','map-data.js','meta-data.js','app-core.js','access-data.js','access-schedule.js','pdf-viewer.js','trekking-data.js','without-car-data.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8'),c);
 vm.runInContext('this.core=AppCore;this.bus=BUS_DATA;this.access=ACCESS_DATA;this.schedule=AccessSchedule',c);
 c.core.japanParts=()=>({iso:'2026-10-09',weekday:5});
 return c;
}
test('suspension does not silently reopen when a review is overdue',()=>{
 const {window:w}=runtime();
 for(const date of ['2026-10-09','2026-10-17','2027-04-01']) assert.equal(w.TransportStatus.blocked({id:'shiratani',operator:'taneyaku'},date),true);
 assert.equal(w.TransportStatus.blocked({id:'arakawa',operator:'taneyaku'},'2026-10-09'),false);
});
test('unknown or expired bus validity fails closed in both search and stop departures',()=>{
 const {core,window:w}=runtime();
 assert.ok(core.findTrips('miyanoura_port','airport','sunday_holiday').length>0);
 core.japanParts=()=>({iso:'2026-12-01',weekday:2});
 assert.equal(core.findTrips('miyanoura_port','airport','weekday').length,0);
 assert.equal(core.getStopDepartures('airport','weekday').length,0);
 delete w.TRANSPORT_DATA;
 assert.equal(core.findTrips('miyanoura_port','airport','weekday').length,0);
});
test('ferry cancellations and new fares follow travel date across month boundaries',()=>{
 const {access,schedule}=runtime();
 for(const date of ['2026-10-18','2026-10-25','2026-12-06','2027-01-01','2027-01-24']) assert.equal(schedule.sections(access,date).find(s=>s.id==='ferry').rows.length,0);
 for(const date of ['2026-10-09','2026-10-11','2026-12-27']) assert.equal(schedule.sections(access,date).find(s=>s.id==='ferry').rows.length,2);
 assert.equal(schedule.sections(access,'2026-09-30').find(s=>s.id==='ferry_fare').rows.length,0);
 assert.equal(schedule.sections(access,'2026-10-01').find(s=>s.id==='ferry_fare').rows[0].adult,'¥7,000');
 assert.equal(schedule.ferry(access,'2027-02-01').period,null);
});
test('weekend service preserves daily columns, with only school-day columns excluded',()=>{
 const {bus}=runtime();
 const central=bus.routes.find(r=>r.id==='central');
 for(const dir of central.directions){
  assert.equal(dir.columnTrips.length,17);
  assert.equal(dir.columnTrips.filter(t=>t.days.includes('sunday_holiday')).length,16);
  assert.equal(dir.columnTrips.filter(t=>t.condition==='school-days').length,1);
 }
});
test('full-length October PDF runs remain searchable beyond the former 120-minute cap',()=>{
 const {core}=runtime();
 core.routeAvailable=route=>core.routeInSeason(route);
 const runs=core.findTrips('nagata','kurio_bashi','weekday')
  .filter(t=>t.depStop==='nagata' && t.arrStop==='kurio_bashi');
 assert.deepEqual(Array.from(runs,t=>core.formatTime(t.dep)),['07:26','09:26']);
 assert.deepEqual(Array.from(runs,t=>core.parseMinutes(t.arr)-core.parseMinutes(t.dep)),[128,132]);
});
test('drop-off-only section never offers boarding at intermediate stops',()=>{
 const {core,bus}=runtime();
 const runs=core.findTrips('anbo','hotel_yakushima','weekday');
 assert.ok(runs.length>0);
 assert.ok(runs.every(r=>!r.trip.boardOnlyAt || r.trip.boardOnlyAt.includes(r.depStop)));
 assert.ok(!core.stopSearchCluster('miyanoura_port').includes('miyanoura_port_early'));
 assert.equal(bus.stops.miyanoura_port_early.no,'19');
 assert.equal(bus.stops.hotel_yakushima.ja,'いわさきホテル');
});
test('both in-page PDF languages resolve to new mirrors and content-addressed previews',()=>{
 const {window:w,bus}=runtime();
 for(const key of ['taneyaku','taneyakuEn']){
  const url=bus.meta.sources[key],asset=w.TRANSPORT_DATA.pdfAssets[url];
  assert.match(asset.mirror,/20261001\.pdf$/);
  assert.ok(w.pdfPreviewPages(url).length>0);
  assert.ok(w.pdfPreviewPages(url).every(p=>p.includes(asset.sha256.slice(0,8))&&!p.includes('20260301')));
 }
});
test('closed trail links only to available alternatives and mountain routes avoid Shiratani',()=>{
 const {window:w}=runtime(),courses=w.TREKKING_DATA.courses;
 const notice=w.TransportStatus.forCourse('taikoiwa','2026-10-10').find(a=>a.status==='suspended');
 assert.ok(notice);
 assert.deepEqual(Array.from(notice.alternativeCourseIds),['janokuchi','tachudake']);
 for(const id of notice.alternativeCourseIds){
  assert.ok(courses.find(c=>c.id===id));
  assert.equal(w.TransportStatus.forCourse(id,'2026-10-10').length,0);
 }
 assert.equal(courses.find(c=>c.id==='tachudake').presetRoute.to,'yakusugiland');
 for(const id of ['kuromidake','miyanouradake']){
  const course=courses.find(c=>c.id===id);
  assert.equal(course.presetRoute,undefined);
  assert.ok(course.accessNote.zh.includes('淀川登山口'));
 }
});
test('without-car route table stores pairs only and shares timetable and fare sources',()=>{
 const {window:w}=runtime();
 for(const row of w.WITHOUT_CAR_DATA.evidence.rows){
  assert.ok(w.TransportStatus && row.from && row.to);
  assert.ok(!('buses' in row) && !('hours' in row) && !('fare' in row));
 }
});
