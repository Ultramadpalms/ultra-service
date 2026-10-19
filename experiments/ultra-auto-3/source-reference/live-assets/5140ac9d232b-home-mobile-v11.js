document.addEventListener('DOMContentLoaded',()=>{
 if(!document.body.classList.contains('stage2-home'))return;
 const mq=matchMedia('(max-width:767px)');
 const h1=document.querySelector('.hero__title'),special=document.querySelector('.stage2-short-specialties'),team=document.querySelector('.team__title');
 const old={h1:h1.innerHTML,special:special.innerHTML,team:team.innerHTML};
 const brands=document.querySelector('.s-brands'),video=document.querySelector('#s-work'),proof=document.querySelector('.usa-proof');
 const marks=new Map();for(const node of [brands,video]){const mark=document.createComment('mobile-v11 original position');node.before(mark);marks.set(node,mark);}
 const keep=['Не заводится','Не заряжается','Не выходит в Ready','Ошибка высоковольтной системы'];
 const symptoms=[...document.querySelectorAll('.stage1-symptom[data-symptom]')];symptoms.forEach(x=>{if(!keep.includes(x.dataset.symptom))x.classList.add('ux-extra-symptom');});
 const other=document.querySelector('.ux-other');if(other)other.textContent='Другой вопрос';
 // Retain every existing symptom as an available form choice, without creating URLs.
 const box=document.createElement('div');box.className='callback-modal__field ux-more-symptoms';
 const label=document.createElement('label');label.htmlFor='ux-symptom-choice';label.className='callback-modal__label';label.textContent='Другие симптомы (необязательно)';
 const select=document.createElement('select');select.id='ux-symptom-choice';select.className='callback-modal__input';select.append(new Option('Выберите или опишите своими словами',''));
 symptoms.forEach(x=>select.append(new Option(x.dataset.symptom,x.dataset.symptom)));select.addEventListener('change',()=>{if(select.value)document.querySelector('#callback-symptom').value=select.value;});box.append(label,select);document.querySelector('.stage1-context').append(box);
 other?.addEventListener('click',()=>{select.value='';});
 document.querySelectorAll('.feature-card').forEach(x=>{if(['Комплексная диагностика','Компонентный ремонт электроники'].includes(x.querySelector('h3')?.textContent.trim()))x.classList.add('ux-repeat-feature');});
 function disclosure(host,label,cls){const b=document.createElement('button');b.type='button';b.className='ux-v11-more';b.textContent=label;b.setAttribute('aria-expanded','false');b.addEventListener('click',()=>{const open=host.classList.toggle(cls);b.setAttribute('aria-expanded',String(open));b.textContent=open?'Свернуть':label;});return b;}
 const services=document.querySelector('#s-services .services__list');services.after(disclosure(services,'Все услуги','ux-services-open'));
 const faqs=[...document.querySelectorAll('.faq-item')];faqs.slice(3).forEach(x=>x.classList.add('ux-extra-faq'));const faqHost=faqs[0].parentElement;faqHost.after(disclosure(faqHost,'Все вопросы','ux-faq-open'));
 const battery=faqs.find(x=>x.querySelector('.faq-item__question')?.textContent.includes('только высоковольтную батарею'));
 if(battery)battery.querySelector('.faq-item__answer-inner').textContent='Да. Высоковольтную батарею можно отправить отдельно транспортной компанией в обрешётке или доставить своими силами без автомобиля. Перед отправкой необходимо согласовать с нами возможность ремонта и условия приёма батареи.';
 function apply(){if(mq.matches){h1.textContent='Диагностика: электроники, гибридов и электромобилей';special.textContent='Ремонт: батарей (ВВБ) • BMS • HV • ЭБУ';team.textContent='Наша команда';document.querySelector('.hero__top').after(brands);proof.before(video);}else{h1.innerHTML=old.h1;special.innerHTML=old.special;team.innerHTML=old.team;for(const [node,mark]of marks)mark.after(node);}}
 mq.addEventListener('change',apply);apply();
});
