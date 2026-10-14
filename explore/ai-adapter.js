/* Server-side AI integration contract. No API key or model call belongs in the browser. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.ExploreAIAdapter = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function payload(query, result, lang) {
    const candidates = [...result.matches, ...result.excluded].map(item => ({
      id: item.id,
      status: item.blocking ? 'blocked' : item.ineligible ? 'ineligible' : 'candidate',
      sourceUrls: item.sources.map(source => source.url),
      noticeUrl: item.blocking?.sourceUrl || null
    }));
    return { version: 'curated-grounded-v1', query: String(query).slice(0, 180), lang,
      travelDate: result.date, candidates };
  }
  function validate(response, request) {
    if (!response || !Array.isArray(response.recommendations)) return false;
    const allowed = new Map(request.candidates.map(x => [x.id, x]));
    return response.recommendations.every(rec => {
      const candidate = allowed.get(rec.id);
      return candidate && candidate.status === 'candidate' && Array.isArray(rec.citations)
        && rec.citations.length > 0 && rec.citations.every(url => candidate.sourceUrls.includes(url));
    });
  }
  return { payload, validate };
});
