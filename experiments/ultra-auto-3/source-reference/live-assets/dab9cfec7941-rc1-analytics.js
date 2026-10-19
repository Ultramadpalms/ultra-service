/* RC1: one event source, bounded coded context, no form values or visitor IDs. */
document.addEventListener('DOMContentLoaded',()=>{
 if(window.USA_RC1_EVENTS_BOUND)return;
 const config=document.querySelector('#usa-rc1-context');if(!config)return;
 window.USA_RC1_EVENTS_BOUND=true;
 const c=JSON.parse(config.textContent), seenClicks=new WeakSet();
 const symptoms={'Не заводится':'no_start','Не заряжается':'no_charge','Не выходит в Ready':'not_ready','Ошибка высоковольтной системы':'hv_error','Ошибка изоляции':'isolation_error','Ошибка ВВБ':'battery_error','Ошибка BMS':'bms_error','Ошибка ВВБ/BMS':'battery_bms_error','Ограничение мощности':'power_limit','Ошибка электропривода':'drive_error','Не запускается после ДТП':'after_crash','Не запускается после глубокой разрядки':'deep_discharge','Другой вопрос':'other'};
 const channels=new Map([['https://wa.me/79990036640','whatsapp'],['https://t.me/ultra_service_auto','telegram'],['https://max.ru/u/f9LHodD0cOL4o-aPzqYA3KqbDyaSayGyPamnLD8DbQEeHIuVsqXaltYkI7U','max']]);
 const block=(el,suffix='')=>{
  for(const [selector,id] of [['.site-header__socials','desktop_header'],['.footer__socials','desktop_footer'],['.ux-mobile-footer','mobile_footer'],['.mobile-menu__socials','mobile_menu'],['.mp-sticky,.stage2-sticky','sticky'],['.mp-contact,.stage2-call','hero'],['.stage1-symptoms,.mp-symptoms','symptoms'],['.site-header','header'],['.site-footer,.footer','desktop_footer']])if(el.closest(selector))return id+suffix;
  return 'content'+suffix;
 };
 function emit(event,block_id,symptom=null,channel=null){
  const payload={page_type:c.page_type,brand:c.brand,model:c.model,service:c.service,symptom,block_id};
  if(channel)payload.channel=channel;
  document.dispatchEvent(new CustomEvent('usa:rc1',{detail:{event,...payload}}));
  if(c.production===true && ['ultraserviceauto.ru','www.ultraserviceauto.ru'].includes(location.hostname) && typeof window.ym==='function')window.ym(108453116,'reachGoal',event,payload);
 }
 document.addEventListener('click',e=>{
  const el=e.target.closest('a,button');if(!el||seenClicks.has(e))return;
  // Programmatic proxy clicks used by the free-text button must not create a second event.
  if(!e.isTrusted)return;
  seenClicks.add(e);
  if(el.matches('a[href^="tel:"]'))emit('phone_click',block(el,'_phone'));
  else if(channels.has(el.getAttribute('href'))){const channel=channels.get(el.getAttribute('href'));emit('messenger_click',block(el,'_messengers'),null,channel);emit(channel+'_click',block(el,'_messengers'),null,channel);}
  else if(el.dataset.stage4cEvent==='battery_shipping_click')emit('battery_shipping_click','battery_shipping');
  else if(el.hasAttribute('data-open-callback'))emit('describe_problem',block(el,'_problem'),symptoms[el.dataset.symptom]|| (el.classList.contains('ux-other')?'other':null));
 },true);
 document.querySelectorAll('details.mp-faq').forEach((el,i)=>el.addEventListener('toggle',()=>{if(el.open)emit('faq_open','faq_'+(i+1));}));
 document.querySelectorAll('.faq-item__inner').forEach((el,i)=>el.addEventListener('click',()=>{queueMicrotask(()=>{if(el.getAttribute('aria-expanded')==='true'||el.closest('.faq-item')?.classList.contains('is-open'))emit('faq_open','faq_'+(i+1));});}));
 const caseBlock=document.querySelector('.s4c [data-block-id="case"]');
 if(caseBlock){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){emit('case_view','confirmed_case');observer.disconnect();}},{threshold:.25});observer.observe(caseBlock);}
 document.addEventListener('usa:form-success',e=>{if(['callback_form','callout_form'].includes(e.detail?.block_id))emit('form_success',e.detail.block_id);});
 // Set approved server context before callback UI handlers; never derive analytics from input.
 document.addEventListener('click',e=>{const b=e.target.closest('[data-open-callback]');if(!b)return;if(c.service&&!b.dataset.service)b.dataset.service=c.service;},true);
});
