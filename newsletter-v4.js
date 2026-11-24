/* Native Brevo POST adapter. A local submission marker is not DOI confirmation. */
(() => {
  'use strict';
  const KEY = 'yakubus-newsletter-submitted-v1';
  const path = location.pathname.replace(/\/$/, '') || '/';
  const dedicated = path === '/newsletter';
  const full = true;
  const light = ['/', '/fare', '/ferry', '/guides'].includes(path);
  const COPY = {
    zh: {
      eyebrow: 'YAKUBUS · TRAVEL NOTES', title: "探索屋久岛，不止查公交。",
      body: "未来有新的旅行工具、实用攻略和岛上推荐时，我们会与你分享。",
      email: '邮箱地址', button: "有新消息告诉我",
      consent: "我同意接收 YakuBus 的旅行资讯、服务推荐及相关优惠邮件。随时可退订。", privacy: "隐私政策",
      note: '英文邮件 · 不定期发送 · 随时退订', teaser: '屋久岛旅行资讯，偶尔写封信给你。',
      sending: '正在提交…', success: '请到邮箱确认订阅。', next: '我们已收到你的申请。点击邮件中的确认链接后，订阅才会生效；没找到时，也看看垃圾邮件。',
      error: '这次没提交成功，请稍后重试。', offline: '网络暂时不通，输入已保留，连接后再试。',
      fallback: '打开订阅页面重试', reopen: '换个邮箱 / 重新订阅', hide: '知道了，收起',
      invalid: '请填写有效的邮箱地址。', agree: '请先勾选订阅同意。',
      pageTitle: '屋久岛旅行邮件', back: '返回公交时刻表',
    },
    en: {
      eyebrow: 'YAKUBUS · TRAVEL NOTES', title: "More ways to explore Yakushima.",
      body: "Hear about new travel tools, useful island information and recommendations as we add them.",
      email: 'Email address', button: "Keep me posted",
      consent: "I agree to receive travel updates, recommendations and related offers from YakuBus. Unsubscribe anytime.", privacy: "Privacy policy",
      note: 'English emails · Occasionally · Unsubscribe anytime', teaser: 'Occasional Yakushima travel notes, by email.',
      sending: 'Sending…', success: 'Check your inbox to confirm.', next: 'We’ve received your request. Click the link in our email to complete your subscription. Can’t see it? Check your spam folder too.',
      error: 'That didn’t go through. Please try again in a moment.', offline: 'You seem to be offline. Your input is still here—try again when connected.',
      fallback: 'Try the hosted sign-up page', reopen: 'Use another email / sign up again', hide: 'Got it, close',
      invalid: 'Please enter a valid email address.', agree: 'Please tick the consent box to continue.',
      pageTitle: 'Yakushima travel emails', back: 'Back to bus timetables',
    },
    ja: {
      eyebrow: 'YAKUBUS · TRAVEL NOTES', title: "屋久島の旅を、もっと便利に。",
      body: "旅に役立つ新しいツールや島の情報、おすすめが増えたら、メールでお知らせします。",
      email: 'メールアドレス', button: "新着情報を受け取る",
      consent: "YakuBusからの旅行情報、おすすめサービスや関連するキャンペーン情報の受信に同意します。いつでも配信停止できます。", privacy: "プライバシーポリシー",
      note: '英語で不定期配信 · いつでも配信停止可能', teaser: '屋久島の旅の情報を、ときどきメールで。',
      sending: '送信中…', success: '確認メールをご確認ください。', next: 'お申し込みを受け付けました。メール内のリンクをクリックすると登録が完了します。迷惑メールフォルダーもご確認ください。',
      error: '送信できませんでした。しばらくしてからお試しください。', offline: '入力内容は残っています。接続をご確認のうえ、もう一度お試しください。',
      fallback: '登録ページで再試行', reopen: '別のアドレスで登録する', hide: '閉じる',
      invalid: '有効なメールアドレスを入力してください。', agree: '受信への同意にチェックを入れてください。',
      pageTitle: '屋久島の旅行メール', back: 'バス時刻表に戻る',
    },
  };
  let section, busy = false, result = '', toast = false, forced = false;
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const mark = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch {} };
  const lang = () => { const code = window.SiteChrome?.readLang?.() || 'en'; return COPY[code] ? code : 'en'; };
  const current = () => COPY[lang()];
  const pageSource = path === '/' ? 'bus' : path.split('/')[1];
  const from = new URLSearchParams(location.search).get('from');
  const knownSources = ['bus', 'map', 'fare', 'ferry', 'without-car', 'trekking', 'guides', 'about', 'intro', 'privacy'];
  const source = dedicated ? (knownSources.includes(from) ? from : 'newsletter') : pageSource;
  const track = name => window.YakuNewsletterAnalytics?.(name) || undefined;
  function visibility() {
    // Suppress repeat invitations after submission, without claiming confirmed status.
    section.hidden = false;
    if (!full) return;
    section.querySelector('.nl-content').hidden = toast;
    section.querySelector('.nl-success').hidden = !toast;
  }
  function refresh() {
    if (!section) return;
    const copy = current(); section.lang = lang();
    section.querySelector('.v4-language')?.remove();
    if (lang() !== 'en') { const note = document.createElement('p'); note.className='v4-language'; note.textContent=lang()==='zh'?'目前邮件以英文发送。':'現在、メールは英語で配信しています。'; section.querySelector('.nl-copy').appendChild(note); }
    section.querySelectorAll('[data-nl]').forEach(el => { el.textContent = copy[el.dataset.nl]; });
    const entry = '/newsletter/?lang=' + lang() + '&from=' + encodeURIComponent(source);
    const teaserLink = section.querySelector('.nl-teaser-link');
    if (teaserLink) teaserLink.href = entry;
    if (full) {
      const form = section.querySelector('form');
      form.action = window.YakuNewsletterForms[lang() === 'zh' ? 'zh' : 'en'];
      // Both original exports use locale=en; it is not a contact language attribute.
      form.elements.locale.value = 'en';
      section.querySelector('.nl-fallback').href = form.action;
      section.querySelector('.nl-error').textContent = result ? copy[result] : '';
      section.querySelector('.nl-button').textContent = busy ? copy.sending : copy.button;
    }
    if (dedicated) {
      document.title = copy.pageTitle + ' | YakuBus';
      const title = document.getElementById('newsletterPageTitle'); if (title) title.textContent = copy.pageTitle;
      const back = document.getElementById('newsletterBack'); if (back) { back.textContent = copy.back; back.href = '/?lang=' + lang(); }
      const label = section.querySelector('.nl-hide'); if (toast) label.textContent = copy.back;
    }
    visibility();
  }
  async function submit(event) {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget, email = form.elements.EMAIL, consent = form.elements.OPT_IN;
    email.value = email.value.trim(); email.setCustomValidity(''); consent.setCustomValidity('');
    if (!email.validity.valid) { email.setCustomValidity(current().invalid); email.reportValidity(); return; }
    if (!consent.checked) { consent.setCustomValidity(current().agree); consent.reportValidity(); return; }
    busy = true; result = ''; refresh(); track('newsletter_submit_attempt');
    const button = section.querySelector('.nl-button'); button.disabled = true; form.setAttribute('aria-busy', 'true');
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action + '?isAjax=1', { method: 'POST', body: new FormData(form), signal: controller.signal, credentials: 'omit', referrerPolicy: 'no-referrer' });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error('rejected');
      mark(); track('newsletter_submitted'); form.reset(); forced = false; toast = true;
      section.querySelector('.nl-fallback').hidden = true;
      refresh(); section.querySelector('.nl-success-title').focus({ preventScroll: true });
    } catch {
      track('newsletter_error'); result = navigator.onLine === false ? 'offline' : 'error';
      section.querySelector('.nl-error').textContent = current()[result];
      section.querySelector('.nl-fallback').hidden = false;
    } finally {
      clearTimeout(timer); busy = false; button.disabled = false; form.removeAttribute('aria-busy'); button.textContent = current().button;
    }
  }
  function init() {
    if ((!full && !light) || !window.YakuNewsletterForms || section) return;
    const footer = document.querySelector('.app-footer'); if (!footer) return;
    section = document.createElement('section'); section.id = 'travel-notes'; section.lang = lang();
    if (!full) {
      section.className = 'travel-notes-teaser'; section.setAttribute('aria-label', current().pageTitle);
      section.innerHTML = '<span data-nl="teaser"></span><a class="nl-teaser-link" data-nl="button"></a>';
    } else {
      section.className = 'travel-notes clarity-mask'; section.setAttribute('data-clarity-mask', 'true'); section.setAttribute('aria-labelledby', 'newsletterTitle');
      section.innerHTML = `<div class="nl-content"><div class="nl-copy"><h2 id="newsletterTitle" data-nl="title"></h2><p class="nl-body" data-nl="body"></p></div>
        <form class="nl-form" method="post" novalidate><label class="nl-label" for="newsletterEmail" data-nl="email"></label>
          <div class="nl-field-row"><input id="newsletterEmail" name="EMAIL" type="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required data-clarity-mask="true" aria-describedby="nl-error"><button class="nl-button" type="submit" data-nl="button"></button></div>
          <label class="nl-consent" for="newsletterConsent"><input type="checkbox" id="newsletterConsent" name="OPT_IN" value="1" required><span><span data-nl="consent"></span> <a href="/privacy/#newsletter" target="_blank" rel="noopener" data-nl="privacy"></a></span></label>
          <input class="nl-honeypot" type="text" name="email_address_check" value="" tabindex="-1" autocomplete="off" aria-hidden="true"><input type="hidden" name="locale" value="en">
          <p class="nl-error" id="nl-error" role="alert"></p><a class="nl-fallback" target="_blank" rel="noopener noreferrer" hidden data-nl="fallback"></a>
        </form></div><div class="nl-success" hidden><h2 class="nl-success-title" tabindex="-1" data-nl="success"></h2><p data-nl="next"></p><div class="nl-success-actions"><button type="button" class="nl-hide" data-nl="hide"></button><button type="button" class="nl-reopen" data-nl="reopen"></button></div></div>`;
      section.querySelector('form').addEventListener('submit', submit);
      section.querySelector('form').addEventListener('input', e => e.target.setCustomValidity?.(''));
      section.querySelector('.nl-hide').addEventListener('click', () => {
        if (dedicated) { location.href = '/?lang=' + lang(); return; }
        toast = Boolean(read()); forced = false; refresh();
        window.dispatchEvent(new Event('newsletter-panel-close'));
        document.querySelector('.footer-newsletter-link')?.focus({ preventScroll: true });
      });
      section.querySelector('.nl-reopen').addEventListener('click', () => { forced = true; toast = false; refresh(); section.querySelector('#newsletterEmail').focus({ preventScroll: true }); });
    }
    const next = document.querySelector('.journey-next');
    if (dedicated) document.getElementById('newsletterMount').appendChild(section);
    else footer.querySelector('.footer-touch').appendChild(section);
    if (read()) toast = true;
    refresh();
    window.addEventListener('yakushima-bus-lang', refresh);
    window.addEventListener('storage', e => { if (e.key === KEY) { forced = false; toast = Boolean(read()); refresh(); } });
    if (location.hash === '#travel-notes') requestAnimationFrame(() => { if (!section.hidden) section.scrollIntoView({ block: 'center' }); });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting && !section.hidden)) { track(full ? 'newsletter_view' : 'newsletter_entry_view'); observer.disconnect(); }
      }, { threshold: .3 }); observer.observe(section);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();

/* V4 isolated visual prototype. One form moves between footer and invitation. */
(() => {
  const SUB='yakubus-newsletter-submitted-v1', DIS='yakubus-newsletter-dismissed-v4';
  const get=(key)=>{try{return localStorage.getItem(key)}catch{return null}};
  const put=(key,val)=>{try{localStorage.setItem(key,val)}catch{}};
  const selected=new URLSearchParams(location.search).get('design');
  if(['a','b'].includes(selected))put('yakubus-v4-design',selected);
  document.documentElement.dataset.newsletterDesign='a';
  const names={en:{invite:'Get travel updates',close:'Dismiss invitation for 30 days',panel:'Close sign-up panel',label:'Travel updates',stamp:'ISLAND POST'},zh:{invite:'屋久岛旅行新消息',close:'30天内不再提示',panel:'关闭订阅面板',label:'旅行新消息',stamp:'岛上来信'},ja:{invite:'屋久島の旅の新着情報',close:'30日間表示しない',panel:'登録パネルを閉じる',label:'旅の新着情報',stamp:'島からの便り'}};
  let dragging=false;
  let widget, section, slot, active=0, meaningful=false, lastAction=Date.now(), open=false, pendingTimer=0, priorFocus;
  const path=location.pathname, type=path==='/'?'times':path.startsWith('/map')?'map':path.startsWith('/fare')?'fares':path.startsWith('/trekking')?'hikes':path.split('/')[1]||'other';
  const lang=()=>window.SiteChrome?.readLang?.()||'en';
  const copy=()=>names[lang()]||names.en;
  const analytics=(name,placement=open?'floating':'footer')=>window.BusAnalytics?.event?.(name==='newsletter_submitted'?'newsletter_submit':name,{placement,page_type:type,ui_language:lang(),email_language:'en',copy_version:'v4',design_version:'a',trigger_type:open?'user_open':'behavior'});
  window.YakuNewsletterAnalytics=analytics;
  function restore(){
    if(!section||!slot?.isConnected)return;
    slot.appendChild(section); open=false; widget.dataset.open='false';
    widget.querySelector('.v4-launch').setAttribute('aria-expanded','false');
    if(priorFocus?.isConnected)priorFocus.focus({preventScroll:true});
    updateVisibility();
  }
  function blocked(){
    const focused=document.activeElement;
    const modal=[...document.querySelectorAll('.modal,[aria-modal="true"],dialog[open]')].some(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
    return dragging||document.hidden||!!document.fullscreenElement||!!document.querySelector('.guide-map-wrap--fullscreen,.guide-map-fullscreen,.guide-map-wrap.is-fullscreen')||Boolean(document.getElementById('guideMapFsBtn')?.getAttribute('aria-pressed')==='true')||/INPUT|TEXTAREA|SELECT/.test(focused?.tagName)||modal;
  }
  function footerVisible(){return !!slot?.isConnected&&slot.getBoundingClientRect().top<innerHeight&&slot.getBoundingClientRect().bottom>0}
  function updateVisibility(){
    if(!widget)return;
    const dismissed=Date.now()-Number(get(DIS)||0)<30*864e5;
    const ready=new URLSearchParams(location.search).get('previewInvite')==='1'?true:type==='map'?meaningful&&Date.now()-lastAction>3000:type==='times'?meaningful&&active>=15&&!!document.querySelector('#results .trip'):active>=20&&meaningful;
    widget.hidden=!open&&(!!get(SUB)||dismissed||!ready||blocked()||footerVisible()||innerHeight<420||path.startsWith('/newsletter'));
  }
  function mount(){
    section=document.getElementById('travel-notes') || section; const footer=document.querySelector('.app-footer');
    if(!section||!footer?.querySelector('.footer-touch'))return;
    slot=footer.querySelector('.footer-touch');
    const support=footer.querySelector('.footer-support-link'); const trust=footer.querySelector('[aria-labelledby="footer-trust"] .v4-nav-links') || footer.querySelector('[aria-labelledby="footer-trust"]');
    if(support&&trust&&support.parentElement!==trust)trust.appendChild(support);
    [...slot.children].forEach(el=>{if(el!==section)el.remove()});
    footer.querySelectorAll('.footer-group nav').forEach(()=>{});
    // Preserve real navigation anchors and source-opening handlers inside native mobile folds.
    footer.querySelectorAll('.footer-grid > nav').forEach(nav=>{
      if(nav.querySelector('details'))return;
      const heading=nav.querySelector('h2'), fold=document.createElement('details'),summary=document.createElement('summary');
      summary.textContent=heading.textContent; const content=document.createElement('div'); content.className='v4-nav-links';
      [...nav.children].forEach(el=>{if(el!==heading)content.appendChild(el)}); heading.remove();
      fold.append(summary,content);fold.open=matchMedia('(min-width:701px)').matches;nav.appendChild(fold);
    });
    if(path.startsWith('/newsletter'))return;
    if(!open&&section.parentElement!==slot)slot.appendChild(section);
    if(!widget){
      widget=document.createElement('aside');widget.className='v4-floating';widget.hidden=true;widget.dataset.open='false';
      widget.innerHTML='<div class="v4-invitation"><button type="button" class="v4-launch" aria-controls="v4-panel" aria-expanded="false"><span class="v4-stamp" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="M4 23 12 9l5 8 4-5 7 11H4Z" stroke="currentColor" stroke-width="1.3"/><path d="M5 27h22M9 5h5" stroke="currentColor" stroke-width="1.3"/></svg></span><span class="v4-invite-text"></span><span class="v4-open-arrow" aria-hidden="true">↗</span></button><button type="button" class="v4-dismiss">×</button></div><section id="v4-panel" class="v4-panel" role="dialog" aria-modal="false" aria-labelledby="newsletterTitle"><div class="v4-panel-head"><span class="v4-panel-label"></span><button type="button" class="v4-panel-close">×</button></div><div class="v4-panel-mount"></div></section>';
      document.body.appendChild(widget);
      const impressions=new Set(); const impressionObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting||widget.hidden&&entry.target===widget)continue;const placement=entry.target===widget?'floating':'footer';const key='yakubus-newsletter-impression-v4-'+placement;let seen=false;try{seen=sessionStorage.getItem(key)==='1'}catch{}if(seen||impressions.has(key))continue;impressions.add(key);try{sessionStorage.setItem(key,'1')}catch{}analytics('newsletter_impression',placement)}},{threshold:.5});impressionObserver.observe(widget);impressionObserver.observe(slot);
      widget.querySelector('.v4-launch').onclick=()=>{
        priorFocus=document.activeElement;open=true;widget.hidden=false;widget.dataset.open='true';
        widget.querySelector('.v4-launch').setAttribute('aria-expanded','true');
        widget.querySelector('.v4-panel-mount').appendChild(section);analytics('newsletter_open');
        section.querySelector('h2')?.setAttribute('tabindex','-1'); section.querySelector('h2')?.focus({preventScroll:true});
      };
      widget.querySelector('.v4-dismiss').onclick=()=>{put(DIS,Date.now());analytics('newsletter_dismiss');widget.hidden=true};
      widget.querySelector('.v4-panel-close').onclick=restore;
      document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){restore();e.preventDefault()}});
      window.addEventListener('newsletter-panel-close',restore);
      window.addEventListener('storage',e=>{if(e.key===SUB&&e.newValue)restore();updateVisibility()});
      const observer=new MutationObserver(()=>{if(get(SUB)&&!section.querySelector('.nl-success').hidden){clearTimeout(pendingTimer); /* Keep success readable until explicit close. */}});observer.observe(section,{attributes:true,subtree:true,attributeFilter:['hidden']});
    }
    widget.querySelector('.v4-invite-text').textContent=copy().invite;
    widget.querySelector('.v4-dismiss').setAttribute('aria-label',copy().close);
    widget.querySelector('.v4-panel-close').setAttribute('aria-label',copy().panel);
    widget.querySelector('.v4-panel-label').textContent=document.documentElement.dataset.newsletterDesign==='b'?copy().stamp:copy().label;
    section.querySelector('#newsletterEmail').placeholder=lang()==='en'?'Your email':lang()==='zh'?'邮箱地址':'メールアドレス';
    updateVisibility();
  }
  let raf=false;
  const schedule=()=>{if(!raf){raf=true;requestAnimationFrame(()=>{raf=false;mount()})}};
  const init=()=>{
    new MutationObserver(schedule).observe(document.querySelector('.app-footer'),{childList:true});
    const wait=setInterval(()=>{if(document.getElementById('travel-notes')){clearInterval(wait);mount()}},100);
    document.addEventListener('click',e=>{
      if(e.target.closest('.presets button[data-from],#presetBar,#swapBtn,[data-preset],#guideFilters button,#guideList,.leaflet-marker-icon,.leaflet-control-zoom')){meaningful=true;lastAction=Date.now()}
    },true);
    document.addEventListener('change',e=>{if(e.target.closest('#fromPicker,#toPicker,#fromStop,#toStop,#guideFilters select')){meaningful=true;lastAction=Date.now()}},true);
    let start;
    document.addEventListener('pointerdown',e=>{if(e.target.closest('#guideMap')){start=[e.clientX,e.clientY];dragging=true;}lastAction=Date.now();updateVisibility()},true);
    document.addEventListener('pointerup',e=>{if(start){if(Math.hypot(e.clientX-start[0],e.clientY-start[1])>12)meaningful=true;start=null}dragging=false;lastAction=Date.now()},true);
    document.addEventListener('pointercancel',()=>{dragging=false;start=null;lastAction=Date.now()},true);
    document.addEventListener('pointermove',()=>{if(dragging)lastAction=Date.now()},{passive:true});
    document.addEventListener('wheel',e=>{if(e.target.closest('#guideMap')){meaningful=true;lastAction=Date.now()}},{passive:true});
    window.addEventListener('scroll',()=>{if(!['times','map'].includes(type)&&scrollY>innerHeight*.5)meaningful=true;updateVisibility()},{passive:true});
    ['focusin','focusout','fullscreenchange'].forEach(name=>document.addEventListener(name,updateVisibility));
    window.addEventListener('yakushima-bus-lang',()=>setTimeout(mount,0));
    window.addEventListener('resize',()=>{document.querySelectorAll('.footer-grid > nav details').forEach(el=>el.open=matchMedia('(min-width:701px)').matches);updateVisibility()});
    window.visualViewport?.addEventListener('resize',()=>{widget?.style.setProperty('--v4-height',window.visualViewport.height+'px')});
    setInterval(()=>{if(!document.hidden&&!blocked())active++;updateVisibility()},1000);
  };
  const ready=setInterval(()=>{if(document.querySelector('.footer-touch')){clearInterval(ready);init()}},100);
})();
