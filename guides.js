/** Shared editorial language behaviour. Existing pages keep their own controls. */
(function () {
  const labels = {
    ja: { home:'旅行ガイド', related:'旅の準備をする', stay:'宮之浦か安房か、宿選び', rain:'雨の日の過ごし方', city:'鹿児島で半日', noCar:'車なし2泊3日の組み立て' },
    zh: { home:'旅行攻略', related:'继续准备行程', stay:'宫之浦还是安房：住宿怎么选', rain:'屋久岛雨天备选', city:'鹿儿岛半天怎么玩', noCar:'不租车2晚3天安排' },
    en: { home:'Travel guides', related:'Plan the rest of your trip', stay:'Miyanoura or Anbo: choosing a base', rain:'Rainy-day alternatives', city:'A half-day in Kagoshima', noCar:'Three days without a car' }
  };
  const routes = {stay:'/guides/yakushima-where-to-stay/',rain:'/guides/yakushima-rainy-day/',city:'/guides/kagoshima-half-day/',noCar:'/without-car/'};
  function sync() {
    const lang = window.SiteLang?.current || 'ja', c=labels[lang] || labels.ja;
    document.querySelectorAll('[data-guide-lang]').forEach(el=>{el.hidden=el.dataset.guideLang!==lang;});
    document.querySelectorAll('[data-guide-home]').forEach(el=>{el.textContent=c.home;});
    // All editorial and related links retain the selected language across pages.
    document.querySelectorAll('.guide-article a, #guideMain a, .guide-toolbar a, .guide-related a').forEach(a=>{
      const u=new URL(a.getAttribute('href'),location.href);
      if(u.origin===location.origin && u.pathname.endsWith('/')) {u.searchParams.set('lang',lang);a.setAttribute('href',u.pathname+u.search+u.hash);}
    });
    const related=document.getElementById('guideRelated');
    if(related){
      related.querySelector('summary').textContent=c.related;
      const keys=location.pathname==='/ferry/'?['city','noCar']:['noCar','stay','rain'];
      related.querySelector('ul').innerHTML=keys.filter(k=>routes[k]!==location.pathname).map(k=>`<li><a href="${routes[k]}?lang=${lang}" data-guide-link="${k}">${c[k]} →</a></li>`).join('');
    }
    document.querySelectorAll('.travel-guide-page #langSwitch button').forEach(b=>{
      b.classList.toggle('active',b.dataset.lang===lang);b.setAttribute('aria-pressed',String(b.dataset.lang===lang));
    });
  }
  function init(){
    // Keep recommendations after the primary page task, immediately before footer.
    if(!location.pathname.startsWith('/guides/') && !/^\/(intro|about)\/?$/.test(location.pathname)){
      const footer=document.querySelector('.app-footer');
      if(footer && !document.getElementById('guideRelated')) {
        const box=document.createElement('details');box.id='guideRelated';box.className='guide-related';
        box.innerHTML='<summary></summary><ul></ul>';footer.before(box);
      }
    }
    document.querySelector('.travel-guide-page #langSwitch')?.addEventListener('click',e=>{
      const b=e.target.closest('button[data-lang]');if(b && labels[b.dataset.lang]) AppCore.setLang(b.dataset.lang);
    });
    sync();
    document.addEventListener('click',e=>{
      const a=e.target.closest('[data-guide-source], [data-guide-link], .guide-card');if(!a)return;
      window.BusAnalytics?.event(a.hasAttribute('data-guide-source')?'source_click':'guide_open',{article_path:location.pathname,link_url:a.getAttribute('href'),lang:window.SiteLang?.current||'ja'});
    });
  }
  window.addEventListener('yakushima-bus-lang',sync);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
