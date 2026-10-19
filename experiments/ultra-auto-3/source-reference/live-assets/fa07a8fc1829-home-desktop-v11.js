document.addEventListener('DOMContentLoaded',()=>{
 const mq=matchMedia('(min-width:768px)'),hero=document.querySelector('#s-hero'),models=document.querySelector('.usa-model-work'),video=document.querySelector('#s-work'),team=document.querySelector('#s-team'),proof=document.querySelector('.usa-proof');
 const marks=new Map();for(const node of [models,team,proof]){const mark=document.createComment('home desktop original position');node.before(mark);marks.set(node,mark);}
 const other=document.querySelector('.ux-other');
 function apply(){if(mq.matches){document.querySelector('.stage11-specialties').after(document.querySelector('.s-brands'));document.querySelector('.stage1-symptoms').after(models);hero.after(video);video.after(team);team.after(proof);if(other)other.textContent='Свой вариант';}else{for(const [node,mark]of marks)mark.after(node);proof.before(video);if(other)other.textContent='Другой вопрос';}}
 mq.addEventListener('change',apply);apply();
 const track=models.querySelector('.stage11-model-grid');track.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();track.scrollBy({left:(e.key==='ArrowRight'?1:-1)*300,behavior:'smooth'});}});
});

document.addEventListener('DOMContentLoaded',()=>{
 const mq=matchMedia('(min-width:768px)'),track=document.querySelector('#video-slider'),counter=document.querySelector('[data-slider="video"] .slider-nav__counter');
 // A quick toggle or reduced motion can omit transitionend in the legacy accordion.
 document.querySelector('#s-faq').addEventListener('click',()=>{if(mq.matches)setTimeout(()=>document.querySelectorAll('#s-faq .faq-item.is-closing:not(.is-open)').forEach(x=>x.classList.remove('is-closing')),450);});
 const prev=document.querySelector('.nav-btn--prev[data-target="video-slider"]'),next=document.querySelector('.nav-btn--next[data-target="video-slider"]');
 const cards=()=>[...track.querySelectorAll('.video-card')];
 function update(){if(!mq.matches)return;const list=cards(),step=(list[0]?.getBoundingClientRect().width||1)+18,index=Math.min(list.length,Math.round(track.scrollLeft/step)+1);counter.textContent=String(index).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');prev.disabled=track.scrollLeft<=1;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;}
 for(const [btn,dir]of[[prev,-1],[next,1]])btn.addEventListener('click',e=>{if(!mq.matches)return;e.stopImmediatePropagation();track.scrollBy({left:dir*track.clientWidth,behavior:'smooth'});},true);
 track.tabIndex=0;track.setAttribute('aria-label','Видео Ultra Service — прокрутите горизонтально');
 track.addEventListener('keydown',e=>{if(mq.matches&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();track.scrollBy({left:(e.key==='ArrowRight'?1:-1)*track.clientWidth,behavior:'smooth'});}});
 track.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',()=>requestAnimationFrame(update));new MutationObserver(update).observe(track,{childList:true});update();
 track.addEventListener('click',e=>{const button=e.target.closest('.play-btn');if(!mq.matches||!button)return;const card=button.closest('.video-card'),id=card.dataset.rutubeId;if(!/^[a-f0-9]{20,64}$/i.test(id||''))return;e.stopImmediatePropagation();const frame=document.createElement('iframe');frame.src='https://rutube.ru/play/embed/'+id+'?autoplay=1';frame.title=card.querySelector('img')?.alt||'Видео Ultra Service';frame.allow='autoplay; encrypted-media';frame.allowFullscreen=true;card.replaceChildren(frame);card.classList.add('is-playing');},true);
});
