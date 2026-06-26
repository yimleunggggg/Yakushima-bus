#!/usr/bin/env node
/** One-off: node scripts/check_route.js [from] [to] */
global.location = { search: "" };
global.localStorage = { getItem: () => null, setItem: () => {} };
global.document = { documentElement: { lang: "ja" } };
require("../app-core.js");
require("../data.js");

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
    seg ? `chain=${seg.chain.length}` : "NO_SEG",
  );
});
