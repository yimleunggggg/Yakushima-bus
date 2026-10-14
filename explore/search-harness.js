(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.ExploreHarness = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const regionTerms = {
    yakushima: /屋久[島岛]|yakushima|白谷|shiratani|太鼓岩|miyanoura|宮之浦|宫之浦/i,
    kyushu: /九州|kyushu|鹿児島|鹿儿岛|kagoshima|熊本|博多|福岡|福冈|仙巌園|仙岩园|sengan/i
  };
  const intentTerms = {
    rail: /\bjr\b|列車|列车|電車|火车|鉄道|铁路|\btrain\b|\brail\b|新幹線|新干线/i,
    pass: /パス|通票|周游券|周遊券|\bpass\b/i,
    ferry: /フェリー|高速船|船|渡轮|\bferry\b|jetfoil|港/i,
    hiking: /登山|徒步|ハイク|白谷|太鼓岩|hike|trek/i,
    sightseeing: /観光|观光|景点|tour|sightseeing|庭園|园林|バスツアー/i,
    first: /初めて|第一次|新手|初心者|how to|乗り方|怎么坐|怎么买/i
  };
  const choose = (value, lang) => value?.[lang] || value?.ja || '';
  function classify(query) {
    const q = String(query || '').trim().toLowerCase();
    const regions = Object.keys(regionTerms).filter(k => regionTerms[k].test(q));
    const intents = Object.keys(intentTerms).filter(k => intentTerms[k].test(q));
    return { q, regions, intents };
  }
  function affiliateFor(record, partners) {
    if (!record.affiliateRef || !partners) return null;
    const [group, id] = record.affiliateRef.split('.');
    return group === 'experiences'
      ? partners.experiences?.find(x => x.id === id) || null
      : partners.items?.[id] || null;
  }
  function active(alert, date) {
    return date >= alert.validFrom && (!alert.validTo || date <= alert.validTo);
  }
  function answer(query, options = {}) {
    const lang = ['ja', 'en', 'zh'].includes(options.lang) ? options.lang : 'ja';
    const date = /^\d{4}-\d{2}-\d{2}$/.test(options.date || '') ? options.date : new Date().toISOString().slice(0, 10);
    const today = /^\d{4}-\d{2}-\d{2}$/.test(options.today || '') ? options.today : new Date().toISOString().slice(0, 10);
    const catalog = options.catalog || [];
    const transport = options.transport || {};
    const parsed = classify(query);
    const matches = [], excluded = [];
    if (!parsed.q) return { matches, excluded, parsed, date, needsReview: false };
    for (const item of catalog) {
      const terms = item.terms.filter(t => parsed.q.includes(t.toLowerCase()));
      const regionHit = parsed.regions.includes(item.region);
      const intentHits = item.intents.filter(i => parsed.intents.includes(i));
      if (parsed.regions.length && !regionHit && item.region !== 'japan') continue;
      if (parsed.intents.length && !intentHits.length && !terms.length) continue;
      let score = terms.length * 2 + intentHits.length * 3 + (regionHit ? 5 : 0);
      if (!parsed.regions.length && item.region === 'japan' && parsed.intents.includes('rail')) score += 2;
      if (score < 2 && !(item.alternativeFor === 'shiratani' && parsed.q.match(/白谷|shiratani|太鼓岩|taiko/i))) continue;
      if (item.alternativeFor === 'shiratani' && parsed.q.match(/白谷|shiratani|太鼓岩|taiko/i)) score = Math.max(score, 4);
      const blocking = (transport.alerts || []).find(a => a.status === 'suspended' && active(a, date)
        && item.courseId && a.courseIds?.includes(item.courseId));
      const ineligible = item.eligibility === 'temporary-visitor' && options.travelerType === 'resident';
      const sourceReviewDue = item.sources.some(source => (Date.parse(today) - Date.parse(source.checkedAt)) > 30 * 86400000);
      const result = { ...item, score, termHits: terms, intentHits, blocking, ineligible, sourceReviewDue,
        affiliate: item.eligibility === 'temporary-visitor' && options.travelerType !== 'visitor' ? null : affiliateFor(item, options.partners),
        reason: choose(item.next, lang) };
      (blocking || ineligible ? excluded : matches).push(result);
    }
    matches.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    excluded.sort((a, b) => b.score - a.score);
    return { matches: matches.slice(0, 4), excluded, parsed, date,
      needsReview: parsed.regions.includes('yakushima') && !!transport.reviewAfter && today > transport.reviewAfter };
  }
  return { answer, classify, affiliateFor };
});
