/** Select by travel date; never substitute an expired seasonal timetable. */
const AccessSchedule = {
  today() {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  },
  validDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  },
  season(data, date) {
    if (!this.validDate(date)) return null;
    return (data.jetfoilSeasons || []).find((s) => s.validFrom <= date && date <= s.validTo) || null;
  },
  ferry(data, date) {
    const period = this.validDate(date) && (data.ferryCalendar?.periods || []).find((p) => p.validFrom <= date && date <= p.validTo);
    return { period: period || null, suspended: !!period?.dates?.includes(date) };
  },
  sections(data, date) {
    const season = this.season(data, date);
    const ferry = this.ferry(data, date);
    return data.sections.map((s) => {
      const key = { jetfoil_out: 'toYakushima', jetfoil_in: 'toKagoshima' }[s.id];
      if (key) return { ...s, rows: season?.[key] || [], note: season?.notes[s.id] || {} };
      if (s.id === 'ferry') {
        const alert = ferry.suspended ? {
          ja: `${date}：公式の計画運休日です。この日の便は表示しません。`,
          zh: `${date}：官方计划停运，当天不显示可乘班次。`,
          en: `${date}: planned suspension. No sailings are shown for this date.`,
        } : ferry.period ? {
          ja: `${date}：公表済みの計画運休には該当しません。天候等の欠航は出航前に公式で確認してください。`,
          zh: `${date}：不在已公布的计划停运日期内；天气等临时停航仍须出发前查官网。`,
          en: `${date}: not listed as a planned suspension. Check the operator for weather and other cancellations.`,
        } : {
          ja: '選択日の計画運休情報は未確認です。以下は通常時刻で、運航を保証するものではありません。',
          zh: '所选日期的计划停运信息尚未核实。下列为常规时刻，不代表确认当天运行。',
          en: 'Planned suspensions have not been verified for this date. Regular times below do not confirm a sailing.',
        };
        return { ...s, rows: ferry.suspended || !this.validDate(date) ? [] : s.rows, alert, alertUrl: ferry.period?.sourceUrl || data.meta.sources.ferry };
      }
      if (s.id === 'ferry_fare' && (!this.validDate(date) || date < s.validity?.validFrom || (s.validity?.validTo && date > s.validity.validTo))) {
        return { ...s, rows: [], note: {
          ja: '選択日に適用される運賃は未確認です。公式サイトでご確認ください。',
          zh: '尚未核实所选日期适用的票价，请查阅官网。',
          en: 'Fares for the selected date have not been verified. Check the official site.',
        } };
      }
      return s;
    });
  },
};
