/* Local-only conversion hook. No network, cookies, contact values or production analytics. */
document.addEventListener('DOMContentLoaded',()=>{
 const sticky=document.querySelector('.stage2-sticky');
 const modal=document.querySelector('#modal-callback');
 const mobile=matchMedia('(max-width:767px)');
 let heroVisible=true;
 const sync=()=>{
  const editing=!!document.activeElement?.matches('input,textarea,select,[contenteditable="true"]');
  const keyboard=window.visualViewport && visualViewport.height<innerHeight*.72;
  if(sticky)sticky.hidden=heroVisible||!mobile.matches||modal?.classList.contains('is-open')||editing||keyboard;
 };
 const hero=document.querySelector('.stage2-phone');
 if(hero)new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;sync();},{threshold:0}).observe(hero);
 if(modal)new MutationObserver(sync).observe(modal,{attributes:true,attributeFilter:['class']});
 document.addEventListener('focusin',sync);document.addEventListener('focusout',()=>requestAnimationFrame(sync));
 window.visualViewport?.addEventListener('resize',sync);window.addEventListener('resize',sync);sync();
});
