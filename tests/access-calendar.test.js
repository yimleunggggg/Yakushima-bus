const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const root = path.join(__dirname, '..');
// Build in memory: tests never overwrite a checked-in generated artifact.
const data = JSON.parse(execFileSync('python3', ['-c', 'import sys,json;sys.path.insert(0,"scripts");from build_access_data import build_data;print(json.dumps(build_data()))'], { cwd: root, encoding: 'utf8' }));
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(root, 'access-schedule.js'), 'utf8') + '\nthis.schedule=AccessSchedule;', ctx);
const schedule = ctx.schedule;
const section = (date, id) => schedule.sections(data, date).find(s => s.id === id);
test('planned suspensions suppress both directions including October and New Year', () => {
  for (const date of ['2026-10-04','2026-10-18','2026-10-25','2026-12-06','2026-12-13','2026-12-20','2027-01-01','2027-01-03','2027-01-10','2027-01-17','2027-01-24']) {
    assert.equal(section(date,'ferry').rows.length, 0, date);
    assert.match(section(date,'ferry').alert.zh, /计划停运/);
  }
  for (const date of ['2026-10-11','2026-11-01','2026-12-27','2027-01-31']) {
    assert.equal(section(date,'ferry').rows.length, 2, date);
    assert.match(section(date,'ferry').alert.zh, /不在已公布/);
  }
  assert.match(section('2027-02-01','ferry').alert.zh, /尚未核实/);
  assert.equal(section('2026-02-30','ferry').rows.length, 0);
});
test('new fares are not applied to September history or invalid dates', () => {
  assert.equal(section('2026-09-30','ferry_fare').rows.length, 0);
  assert.equal(section('','ferry_fare').rows.length, 0);
  const fares = section('2026-10-01','ferry_fare').rows;
  assert.equal(fares[0].adult,'¥7,000'); assert.equal(fares[0].child,'¥3,450');
  assert.equal(fares[1].adult,'¥9,500'); assert.equal(fares[1].child,'¥4,750');
});
test('calendar selection leaves the shared source unchanged', () => {
  const before = JSON.stringify(data);
  section('2026-10-18','ferry'); section('2026-10-11','ferry');
  assert.equal(JSON.stringify(data), before);
  assert.match(data.ferryCalendar.periods[1].sourceNote, /1日17日/);
  assert.match(data.booking.items.find(x=>x.id==='ferry').body.en, /fewer than 12/);
});
test('builder rejects duplicated or out-of-range suspension dates', () => {
  execFileSync('python3', ['-c', `import sys,copy
sys.path.insert(0,'scripts')
from build_access_data import load_json,validate_ferry
base=load_json('ferry.json')
for invalid in ['2026-02-30','2026-06-30',base['suspensionPeriods'][0]['dates'][0]]:
 d=copy.deepcopy(base);d['suspensionPeriods'][0]['dates'].append(invalid)
 try: validate_ferry(d)
 except ValueError: pass
 else: raise AssertionError(invalid)
`], { cwd: root });
});
