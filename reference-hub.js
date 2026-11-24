/* Consolidate repeated reference lists; do not touch transport, map or booking actions. */
(()=>{
 const L={en:{label:'Sources & references',faq:'Common questions',more:'Sources, review dates and service notices',trust:'About & trust'},zh:{label:'资料与参考链接',faq:'常见问题',more:'查看资料、核查日期与运行公告',trust:'关于与来源'},ja:{label:'資料・参考リンク',faq:'よくある質問',more:'出典・確認日・運行のお知らせ',trust:'サイトと出典'}};
 const path=location.pathname;const topic=path==='/'?'bus':path.startsWith('/fare/')?'fares':path.startsWith('/ferry/')?'ferry':path.startsWith('/trekking/')?'hiking':path.startsWith('/map/')||path.startsWith('/about/')?'map':'guides';
 let scheduled=false;const done=new WeakSet();
 const language=()=>window.SiteChrome?.readLang?.()||'en';
 const hub=(hash=topic)=>'/resources/?lang='+language()+'#'+hash;
 function arrange(){scheduled=false;const c=L[language()]||L.en;
  // Replace the footer source action itself, preserving the existing four-column A composition.
  document.querySelectorAll('.footer-source-link').forEach(old=>{if(old.dataset.referenceHub==='true'){if(old.textContent!==c.label)old.textContent=c.label;old.href=hub();return}const a=old.cloneNode(false);a.textContent=c.label;a.href=hub();a.dataset.referenceHub='true';old.replaceWith(a)});
  if(path==='/resources/')return;
  document.querySelectorAll('.seo-evidence,.guide-sources').forEach(source=>{
   if(done.has(source))return;done.add(source);
   const hasFaq=source.querySelector('h3');
   if(hasFaq){const faq=document.createElement('details');faq.className='reference-faq';const summary=document.createElement('summary');summary.textContent=c.faq;faq.appendChild(summary);
    source.querySelectorAll('.aux-body > [data-seo-lang]').forEach(group=>{const wrap=document.createElement('div');wrap.dataset.seoLang=group.dataset.seoLang;wrap.lang=group.lang;wrap.hidden=group.hidden;group.querySelectorAll('h3').forEach(h=>{wrap.appendChild(h.cloneNode(true));let n=h.nextElementSibling;while(n&&n.tagName!=='H3'){if(n.tagName==='P')wrap.appendChild(n.cloneNode(true));n=n.nextElementSibling}});faq.appendChild(wrap)});source.before(faq);
   }
   source.remove();
  });
  // The below lists duplicate the new catalogue; primary table citations / download controls stay.
  const refs=document.getElementById('sourceLinks');
  if(refs&&!refs.closest('.references-kept')){
   const container=refs.closest('details')||refs.closest('section')||refs.parentElement;
   if(container&&!done.has(container)){done.add(container);container.remove()}
  }
  if(['/ferry/','/trekking/'].includes(path))document.querySelectorAll('.app-footer-booking').forEach(el=>el.remove());
  // Existing component may rerender after language switches; remove only now-empty wrappers.
  document.querySelectorAll('.panel-aux').forEach(p=>{if(!p.querySelector('details,.sec,.booking-grid,a'))p.remove()});
 }
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(arrange)}};
 function init(){const style=document.createElement('link');style.rel='stylesheet';style.href='/resources/resources.css';document.head.appendChild(style);new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});schedule();window.addEventListener('yakushima-bus-lang',()=>{document.querySelectorAll('.reference-faq>summary').forEach(el=>el.textContent=(L[language()]||L.en).faq);schedule()});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
