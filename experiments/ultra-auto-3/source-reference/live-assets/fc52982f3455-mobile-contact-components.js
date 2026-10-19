document.addEventListener('DOMContentLoaded',()=>{
 const messengers=()=>document.querySelector('#ux-messenger-template').content.cloneNode(true);
 document.querySelectorAll('.mp-messengers').forEach(el=>el.replaceWith(messengers()));
 const call=document.querySelector('.stage2-call');if(call)call.append(messengers());
 const phoneIcon=()=>document.querySelector('#ux-phone-template').content.cloneNode(true);
 document.querySelectorAll('.mp-phone>span,.mp-sticky>a,.stage2-phone>span,.stage2-sticky>a').forEach(el=>{el.textContent=el.textContent.replace(/[☎📞\uFE0F]/gu,'').trim();el.prepend(phoneIcon());});
 const first=document.querySelector('.stage1-symptom');if(first){const btn=first.cloneNode(true);btn.textContent='Другой вопрос';btn.classList.add('ux-other');btn.removeAttribute('data-symptom');btn.dataset.symptomId='other';btn.addEventListener('click',()=>{const saved=first.getAttribute('data-symptom');first.setAttribute('data-symptom','');first.click();if(saved!==null)first.setAttribute('data-symptom',saved);else first.removeAttribute('data-symptom');});first.parentElement.append(btn);first.parentElement.classList.add('ux-symptom-grid');}
 const footer=document.querySelector('.ux-mobile-footer');if(footer)new IntersectionObserver(entries=>document.body.classList.toggle('ux-footer-in-view',entries[0].isIntersecting),{threshold:0}).observe(footer);
});
