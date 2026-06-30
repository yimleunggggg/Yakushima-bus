#!/usr/bin/env node
/** One-off: node scripts/check_route.js [from] [to] [day] */
const fs = require("fs");
const vm = require("vm");

const sandbox = {
  window: {},
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { documentElement: { lang: "ja" }, addEventListener: () => {} },
  location: { search: "", protocol: "file:" },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(require.resolve("../data.js"), "utf8") + "\nthis.BUS_DATA = BUS_DATA;", sandbox);
vm.runInContext(
  fs.readFileSync(require.resolve("../app-core.js"), "utf8")
    .replace("AppCore.applyDocLang(AppCore.getLang());", "")
  + "\nthis.AppCore = AppCore;",
  sandbox,
);

const AppCore = sandbox.AppCore;

const from = process.argv[2] || "miyanoura_port";
const to = process.argv[3] || "anbo";
const day = process.argv[4] || "weekday";

const trips = AppCore.findTrips(from, to, day);
console.log(`${from} -> ${to} (${day}): ${trips.length} trips`);
trips.forEach((t) => {
  const dur = AppCore.parseMinutes(t.arr) - AppCore.parseMinutes(t.dep);
  const seg = AppCore.resolveTripSegment(t.trip, t.dir, t.fi, t.ti);
  console.log(
    `${AppCore.formatTime(t.dep)} -> ${AppCore.formatTime(t.arr)} (${dur}m)`,
    `${t.route.id}/${t.dir.id}`,
    seg ? `chain=${seg.chain.length}` : "col",
  );
});
