/* Ultra Service Auto — modal-callback.js
   Callback modal, phone-mask form validation, callout form */

document.addEventListener('DOMContentLoaded', () => {

  // An attempted native submit is not a conversion. Use an explicit action;
  // only the acknowledged server response can emit usa:form-success.
  function bindSubmission(form, button, handler) {
    if (!button || form.dataset.usaSubmissionBound) return;
    form.dataset.usaSubmissionBound = 'true';
    form.classList.add('ym-disable-submit');
    button.type = 'button';
    let pending = false;
    const run = async e => {
      e.preventDefault();
      if (pending || button.disabled) return;
      pending = true;
      try { await handler(e); } finally { pending = false; }
    };
    button.addEventListener('click', run);
    form.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('input')) run(e);
    });
    form.addEventListener('submit', e => { e.preventDefault(); e.stopImmediatePropagation(); });
  }
  function acknowledged(form, block_id) {
    document.dispatchEvent(new CustomEvent('usa:form-success', {detail:{block_id}}));
  }


  async function getRecaptchaToken(action) {
    const key = window.USA?.recaptchaSiteKey;
    if (!key || typeof grecaptcha === 'undefined') return '';
    return new Promise(resolve => {
      grecaptcha.ready(() => {
        grecaptcha.execute(key, { action }).then(resolve).catch(() => resolve(''));
      });
    });
  }

  // ── Callback Modal ───────────────────────────────────────────
  const callbackOverlay = document.getElementById('modal-callback');
  const callbackClose   = callbackOverlay && callbackOverlay.querySelector('.callback-modal__close');

  const callbackForm = callbackOverlay && callbackOverlay.querySelector('.callback-modal__form');
  const nameInput    = callbackOverlay && callbackOverlay.querySelector('#callback-name');
  const phoneInput   = callbackOverlay && callbackOverlay.querySelector('#callback-phone');
  const modalTitle   = callbackOverlay && callbackOverlay.querySelector('.callback-modal__title');
  const modalSubtitle = callbackOverlay && callbackOverlay.querySelector('.callback-modal__subtitle');
  const modalService = callbackOverlay && callbackOverlay.querySelector('.callback-modal__service');
  const successBlock = callbackOverlay && callbackOverlay.querySelector('.callback-modal__success');
  const submitBtn    = callbackForm    && callbackForm.querySelector('.callback-modal__submit');

  const contextFields = callbackOverlay?.querySelector('.stage1-context');
  const vehicleInput = callbackOverlay?.querySelector('#callback-vehicle');
  const symptomInput = callbackOverlay?.querySelector('#callback-symptom');
  const contactFields = callbackOverlay?.querySelector('.stage11-contactfields');
  const methodInput = callbackOverlay?.querySelector('#callback-method');
  const contactInput = callbackOverlay?.querySelector('#callback-contact');
  const systemInput = callbackOverlay?.querySelector('#callback-system');
  let problemMode = false;
  const contactHints = { phone:['Номер телефона *','Например, +7 999 123-45-67','tel'], email:['Email *','Например, name@example.ru','email'], telegram:['Контакт в Telegram *','@имя пользователя или ссылка https://t.me/…','text'], max:['Контакт в MAX *','Номер телефона или ссылка https://max.ru/…','text'] };
  function updateContact() {
    if (!contactInput) return;
    const hint=contactHints[methodInput.value] || ['Контакт *','Сначала выберите способ связи.','text'];
    callbackOverlay.querySelector('#callback-contact-label').textContent=hint[0];
    callbackOverlay.querySelector('#callback-contact-help').textContent=hint[1];
    contactInput.type=hint[2]; contactInput.placeholder=hint[1];
    contactInput.autocomplete=methodInput.value==='email'?'email':methodInput.value==='phone'?'tel':'off';
    clearFieldError(contactInput); clearFieldError(methodInput);
  }
  methodInput?.addEventListener('change',updateContact);
  contactInput?.addEventListener('input',()=>clearFieldError(contactInput));
  let opener = null;
  let closeTimer;
  function openCallback(service = '', problem = false, symptom = '', vehicle = '', system = '') {
    clearTimeout(closeTimer);
    opener = document.activeElement;
    if (contextFields) contextFields.hidden = !problem;
    problemMode = problem && !!contactFields;
    if (contactFields) contactFields.hidden = !problemMode;
    if (phoneInput) phoneInput.closest('.callback-modal__field').hidden = problemMode;
    if (nameInput) callbackOverlay.querySelector('label[for=callback-name]').textContent = problemMode ? 'Ваше имя (необязательно)' : 'Ваше имя';
    if (methodInput) { methodInput.value=''; contactInput.value=''; updateContact(); }
    if (successBlock) successBlock.querySelector('p').textContent = problemMode ? 'Спасибо! Свяжемся с вами выбранным способом.' : 'Спасибо! Мы перезвоним вам в ближайшее время.';
    if (vehicleInput) vehicleInput.value = vehicle;
    if (systemInput) systemInput.value = system;
    if (symptomInput) symptomInput.value = symptom;
    if (!callbackOverlay) return;
    callbackOverlay.classList.add('is-open');
    callbackOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (modalTitle) {
      modalTitle.innerHTML = problem ? 'Описать проблему' : service ? 'Запись<br>на услугу' : 'Обратный<br>звонок';
    }
    if (modalSubtitle) {
      modalSubtitle.textContent = problem ? 'Укажите автомобиль и симптомы. Мы свяжемся с вами и уточним детали.' : service
        ? 'Оставьте свой номер телефона, и мы свяжемся с вами для записи.'
        : 'Оставьте свой номер телефона и мы вам перезвоним!';
    }
    if (modalService) {
      // Preserve the legacy service value for submission integrations.
      // A technical identifier is not a customer-facing service name.
      const isTechnicalId = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+$/.test(service);
      modalService.textContent = service;
      modalService.hidden = !service;
      modalService.style.display = isTechnicalId ? 'none' : '';
      if (isTechnicalId) modalService.setAttribute('aria-hidden', 'true');
      else modalService.removeAttribute('aria-hidden');
      let label = callbackOverlay.querySelector('[data-service-display-label]');
      if (!label) {
        label = document.createElement('p');
        label.className = 'callback-modal__service';
        label.setAttribute('data-service-display-label', '');
        modalService.insertAdjacentElement('afterend', label);
      }
      const pageTitle = document.body.dataset.template === 'recovery-service'
        ? document.querySelector('main h1')?.textContent.trim() : '';
      label.textContent = isTechnicalId ? (pageTitle || '') : '';
      label.hidden = !label.textContent;
    }
    if (callbackForm)   callbackForm.style.display = '';
    if (successBlock)   successBlock.classList.remove('is-visible');
    if (nameInput)  { nameInput.value = '';  clearFieldError(nameInput); }
    if (phoneInput) { phoneInput.value = ''; clearFieldError(phoneInput); }
    if (submitBtn)  { submitBtn.disabled = false; submitBtn.textContent = 'Отправить'; }
    const firstInput = problemMode ? methodInput : nameInput;
    if (firstInput) firstInput.focus();
  }

  function closeCallback() {
    clearTimeout(closeTimer);
    if (!callbackOverlay) return;
    callbackOverlay.classList.remove('is-open');
    callbackOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    opener?.focus();
  }

  document.querySelectorAll('[data-open-callback]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openCallback(btn.dataset.service || '', btn.dataset.problem === 'true', btn.dataset.symptom || '', btn.dataset.vehicle || '', btn.dataset.system || '');
    });
  });

  if (callbackClose) callbackClose.addEventListener('click', closeCallback);

  if (callbackOverlay) {
    callbackOverlay.addEventListener('click', e => {
      if (e.target === callbackOverlay) closeCallback();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Tab' && callbackOverlay?.classList.contains('is-open')) {
      const items = [...callbackOverlay.querySelectorAll('button,input,select,textarea,a[href]')].filter(el => !el.disabled && el.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    if (e.key === 'Escape'  && callbackOverlay && callbackOverlay.classList.contains('is-open')) {
      closeCallback();
    }
  });

  // ── Callback Form: phone mask, validation, submit ───────────
  function applyPhoneMask(input) {
    input.addEventListener('input', function () {
      let digits = this.value.replace(/\D/g, '');
      if (digits.startsWith('8')) digits = '7' + digits.slice(1);
      if (!digits.startsWith('7') && digits.length) digits = '7' + digits;
      digits = digits.slice(0, 11);
      let masked = '';
      if (digits.length > 0)  masked  = '+7';
      if (digits.length > 1)  masked += ' (' + digits.slice(1, 4);
      if (digits.length >= 4) masked += ')';
      if (digits.length > 4)  masked += ' ' + digits.slice(4, 7);
      if (digits.length > 7)  masked += '-' + digits.slice(7, 9);
      if (digits.length > 9)  masked += '-' + digits.slice(9, 11);
      this.value = masked;
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && this.value === '+7') {
        this.value = '';
        e.preventDefault();
      }
    });
  }

  if (phoneInput) applyPhoneMask(phoneInput);

  function setFieldError(input, msg) {
    const field = input.closest('.callback-modal__field');
    input.classList.add('is-error');
    input.setAttribute('aria-invalid','true');
    let err = field.querySelector('.callback-modal__error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'callback-modal__error';
      err.setAttribute('role','alert');
      field.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearFieldError(input) {
    input.classList.remove('is-error');
    input.removeAttribute('aria-invalid');
    const err = input.closest('.callback-modal__field').querySelector('.callback-modal__error');
    if (err) err.remove();
  }

  function validateForm() {
    let valid = true;
    clearFieldError(nameInput);
    clearFieldError(phoneInput);

    if (!problemMode && !nameInput.value.trim()) {
      setFieldError(nameInput, 'Пожалуйста, введите ваше имя');
      valid = false;
    }

    const digits = phoneInput.value.replace(/\D/g, '');
    if (!problemMode && digits.length < 11) {
      setFieldError(phoneInput, 'Введите корректный номер телефона');
      valid = false;
    }

    if (problemMode) {
      clearFieldError(methodInput); clearFieldError(contactInput);
      const method=methodInput.value, contact=contactInput.value.trim();
      if (!contactHints[method]) { setFieldError(methodInput,'Выберите способ связи'); valid=false; }
      const phoneOk=/^\+?[\d\s()–-]+$/.test(contact) && contact.replace(/\D/g,'').length>=10 && contact.replace(/\D/g,'').length<=15;
      const okay = method==='phone' ? phoneOk : method==='email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) : method==='telegram' ? /^(?:@[A-Za-z0-9_]{5,32}|https:\/\/t\.me\/[A-Za-z0-9_]{5,32}\/?)$/.test(contact) : method==='max' ? phoneOk || /^https:\/\/max\.ru\/[A-Za-z0-9_/-]+$/.test(contact) : false;
      if (!okay) { setFieldError(contactInput,'Укажите контакт для выбранного способа связи'); valid=false; }
    }
    return valid;
  }

  if (nameInput)  nameInput.addEventListener('input',  () => clearFieldError(nameInput));
  if (phoneInput) phoneInput.addEventListener('input',  () => clearFieldError(phoneInput));

  if (callbackForm) {
    bindSubmission(callbackForm, submitBtn, async e => {
      e.preventDefault();
      if (!validateForm()) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем...';
      const service = modalService && !modalService.hidden ? modalService.textContent.trim() : '';

      try {
        const recaptchaToken = await getRecaptchaToken('callback');
        const res = await fetch(window.USA?.ajaxUrl || '/index.php?option=com_ajax&plugin=usaforms&group=system&format=raw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type:            problemMode ? 'inquiry' : 'callback',
            contact_method:  problemMode ? methodInput.value : '',
            contact:         problemMode ? contactInput.value.trim() : '',
            name:            nameInput.value.trim(),
            phone:           phoneInput.value.trim(),
            service,
            system: problemMode && systemInput ? systemInput.value.trim() : '',
            vehicle: contextFields && !contextFields.hidden ? vehicleInput.value.trim() : '',
            symptom: contextFields && !contextFields.hidden ? symptomInput.value.trim() : '',

            page_url:        window.location.href,
            page_title:      document.title,
            recaptcha_token: recaptchaToken,
          })
        });

        if (!res.ok || (await res.json()).ok !== true) throw new Error('server error');

        acknowledged(callbackForm, 'callback_form');
        callbackForm.style.display = 'none';
        if (successBlock) successBlock.classList.add('is-visible');
        closeTimer = setTimeout(closeCallback, 3000);

      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
        setFieldError(problemMode ? contactInput : phoneInput, 'Ошибка отправки. Попробуйте ещё раз или позвоните нам.');
      }
    });
  }

  // ── Callout Form («Остались вопросы?») ─────────────────────
  const calloutForm    = document.querySelector('.callout__form');
  const calloutSuccess = document.querySelector('.callout__success');

  if (calloutForm) {
    const calloutPhone  = calloutForm.querySelector('.callout__input--phone');
    const calloutName   = calloutForm.querySelector('[name="name"]');
    const calloutSubmit = calloutForm.querySelector('.callout__submit');

    if (calloutPhone) applyPhoneMask(calloutPhone);

    bindSubmission(calloutForm, calloutSubmit, async e => {
      e.preventDefault();
      calloutPhone && calloutPhone.classList.remove('is-error');

      const digits = calloutPhone ? calloutPhone.value.replace(/\D/g, '') : '';
      if (digits.length < 11) {
        calloutPhone && calloutPhone.classList.add('is-error');
        calloutPhone && calloutPhone.focus();
        return;
      }

      if (calloutSubmit) {
        calloutSubmit.disabled = true;
        calloutSubmit.textContent = 'Отправляем...';
      }

      try {
        const recaptchaToken = await getRecaptchaToken('callout');
        const res = await fetch(window.USA?.ajaxUrl || '/index.php?option=com_ajax&plugin=usaforms&group=system&format=raw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type:            'callback',
            name:            calloutName ? calloutName.value.trim() : '',
            phone:           calloutPhone ? calloutPhone.value.trim() : '',
            recaptcha_token: recaptchaToken,
          })
        });
        if (!res.ok || (await res.json()).ok !== true) throw new Error('server error');
        acknowledged(calloutForm, 'callout_form');
        calloutForm.style.display = 'none';
        if (calloutSuccess) calloutSuccess.classList.add('is-visible');
      } catch (_) {
        if (calloutSubmit) {
          calloutSubmit.disabled = false;
          calloutSubmit.textContent = 'Оставить заявку';
        }
        calloutPhone && calloutPhone.classList.add('is-error');
      }
    });
  }

});
