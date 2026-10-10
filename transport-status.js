/** One operational-status layer for search, map, trekking and reference pages. */
(function () {
  const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const data = () => window.TRANSPORT_DATA;
  const active = (a, date) => (!a.validFrom || date >= a.validFrom) && (!a.validTo || date <= a.validTo);
  const pick = (value, lang) => value?.[lang] || value?.ja || '';
  const api = {
    today,
    alerts(date = today()) { return (data()?.alerts || []).filter(a => active(a, date)); },
    blocked(route, date = today()) {
      return !data() || this.alerts(date).some(a => a.status === 'suspended'
        && (a.routeIds?.includes(route.id) || a.operatorIds?.includes(route.operator)));
    },
    forStop(stopId, date = today()) {
      return this.alerts(date).filter(a => a.stopIds?.includes(stopId));
    },
    forCourse(courseId, date = today()) {
      return this.alerts(date).filter(a => a.courseIds?.includes(courseId));
    },
    timetableAvailable(date = today()) {
      const t = data()?.timetable;
      return !!t && date >= t.validFrom && (!t.validTo || date <= t.validTo);
    },
    render() {
      // The timetable is the only page that needs a page-level notice. Other
      // pages show status at the affected route/course instead of above content.
      if (location.pathname !== '/') {
        document.getElementById('transport-status')?.remove();
        return;
      }
      const host = document.querySelector('.header');
      if (!host) return;
      let box = document.getElementById('transport-status');
      if (!box) {
        box = document.createElement('details');
        box.id = 'transport-status';
        box.className = 'transport-status';
        host.insertAdjacentElement('afterend', box);
      }
      const lang = window.SiteLang?.current || new URLSearchParams(location.search).get('lang') || 'ja';
      const wasOpen = box.open;
      box.replaceChildren();
      const rows = this.alerts().filter(a => a.status === 'suspended');
      const expired = !this.timetableAvailable();
      if (expired) rows.unshift({ message: {
        ja: 'この日付の確認済みバス時刻表がありません。公式情報をご確認ください。',
        zh: '当前日期没有已核实的公交时刻表，请查看官方信息。',
        en: 'No verified bus timetable covers this date. Please check official information.'
      }, sourceUrl: data()?.timetable?.sourceUrl || 'https://yakukan.jp/on-island.html' });
      if (!rows.length) { box.remove(); return; }
      const summary = document.createElement('summary');
      summary.textContent = expired
        ? pick({ ja: '時刻表の再確認が必要 · 詳細', zh: '时刻表需重新核查 · 查看详情', en: 'Timetable recheck needed · Details' }, lang)
        : pick({ ja: '一部路線が運休中 · 詳細', zh: '部分线路停运 · 查看详情', en: 'Some routes suspended · Details' }, lang);
      box.append(summary);
      const body = document.createElement('div');
      body.className = 'transport-status-body';
      for (const a of rows) {
        const p = document.createElement('p');
        p.append(document.createTextNode(pick(a.message, lang) + ' '));
        const link = document.createElement('a');
        link.href = a.sourceUrl;
        link.target = '_blank'; link.rel = 'noopener';
        link.textContent = pick({ ja: '公式情報', zh: '官方公告', en: 'Official notice' }, lang);
        p.append(link); body.append(p);
      }
      const stamp = document.createElement('small');
      stamp.textContent = pick({ ja: '最終確認', zh: '最近核查', en: 'Last checked' }, lang) + ': ' + (data()?.checkedAt || '—');
      if (data()?.reviewAfter < today()) stamp.textContent += ' · ' + pick({ ja: '再確認が必要です。運休の解除は未確認です。', zh: '已到复核期，尚未确认停运解除。', en: 'Recheck due; suspended services are not confirmed reopened.' }, lang);
      body.append(stamp);
      box.append(body);
      box.open = wasOpen;
    }
  };
  window.TransportStatus = api;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => api.render());
  else api.render();
  window.addEventListener('yakushima-bus-lang', () => api.render());
})();
