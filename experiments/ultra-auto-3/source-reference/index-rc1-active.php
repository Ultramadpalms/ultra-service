<?php
defined('_JEXEC') or die;
require_once JPATH_ROOT.'/plugins/system/usaforms/Rc1Runtime.php';

use Joomla\CMS\Factory;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Plugin\PluginHelper;
use Joomla\CMS\Session\Session;
use Joomla\Registry\Registry;

/** @var Joomla\CMS\Document\HtmlDocument $this */
$app      = Factory::getApplication();
$sitename = htmlspecialchars($app->get('sitename'), ENT_QUOTES, 'UTF-8');
$base     = $this->baseurl;
$tplPath  = $base . '/templates/' . $this->template;

$recaptchaSiteKey = '';
$usaPlugin = PluginHelper::getPlugin('system', 'usaforms');
if ($usaPlugin) {
    $pluginParams     = new Registry($usaPlugin->params);
    $recaptchaSiteKey = htmlspecialchars($pluginParams->get('recaptcha_site_key', ''), ENT_QUOTES, 'UTF-8');
}
$csrfToken = Session::getFormToken();
$isStage5Model=(UsaRc1Gate::context()['model_only'] ?? false)===true;
$mobilePilotCategories=[35,36,37,40,64,89];
$isMobilePilot = $isStage5Model || $app->input->getCmd('option') === 'com_content' && (($app->input->getCmd('view') === 'category' && in_array($app->input->getInt('id'),$mobilePilotCategories,true)) || ($app->input->getCmd('view') === 'article' && $app->input->getInt('id') === 202));
$isStageOneHome = $app->input->getCmd('option') === 'com_content' && $app->input->getCmd('view') === 'article' && $app->input->getInt('id') === 3;
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0<?php if ($isStageOneHome || $isMobilePilot): ?>, viewport-fit=cover<?php endif; ?>">
  <jdoc:include type="head" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=TikTok+Sans:opsz,wdth,wght@12..36,75..125,300..900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="<?php echo $tplPath; ?>/css/style.css?v=20260925-layout-2">

  <?php if ($isStageOneHome): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/stage1-home.css?v=11"><?php endif; ?>

  <?php if ($isStageOneHome): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/stage2-home.css?v=20"><?php endif; ?>
<?php if ($isMobilePilot): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/mobile-pilot.css?v=1"><?php endif; ?>
<?php if ($isMobilePilot): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/stage3c-model.css?v=1"><?php endif; ?>
    <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">
  <script>
    window.USA = {
      recaptchaSiteKey: '<?php echo $recaptchaSiteKey; ?>',
      ajaxUrl: '<?php echo $base; ?>/index.php?option=com_ajax&plugin=usaforms&group=system&format=raw&<?php echo $csrfToken; ?>=1'
    };
  </script>
  <?php if ($recaptchaSiteKey): ?>
  <script src="https://www.google.com/recaptcha/api.js?render=<?php echo $recaptchaSiteKey; ?>" async defer></script>
  <?php endif; ?>
<?php if ($isMobilePilot || $isStageOneHome): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/mobile-contact-components.css?v=2"><?php endif; ?>
<?php if ($isMobilePilot || $isStageOneHome): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/home-mobile-v11.css?v=11"><?php endif; ?>
<?php $isStage4c=$app->input->getCmd('option')==='com_content'&&(($app->input->getCmd('view')==='article'&&in_array($app->input->getInt('id'),[202],true))||($app->input->getCmd('view')==='category'&&$app->input->getInt('id')===35)); if($isStage4c): ?><link rel="stylesheet" href="<?= $tplPath ?>/css/stage4c.css?v=1"><?php endif; ?>
<?php if ($isStageOneHome): ?><link rel="stylesheet" href="<?php echo $tplPath; ?>/css/team-update-v1.css"><?php endif; ?>
</head>
<body<?php if ($isStageOneHome): ?> class="stage2-home"<?php elseif ($isMobilePilot): ?> class="mobile-pilot"<?php endif; ?>>
<jdoc:include type="message" />

<svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
  <defs>
    <linearGradient id="nav-grad" x1="60" y1="27" x2="30" y2="27" gradientUnits="userSpaceOnUse">
      <stop stop-color="#DA2531"/>
      <stop offset="1" stop-color="#EF5F3D"/>
    </linearGradient>
    <linearGradient id="svc-arrow-grad" x1="0" y1="0.5" x2="1" y2="0.5" gradientUnits="objectBoundingBox">
      <stop stop-color="#DA2531"/>
      <stop offset="1" stop-color="#EF5F3D"/>
    </linearGradient>
  </defs>
</svg>

<div class="page-frame">

  <!-- ═══════════════════════════════════════════════
       HEADER
  ═══════════════════════════════════════════════ -->
  <header class="site-header">
    <a href="<?php echo $base; ?>/" class="site-header__logo">
      <img src="<?php echo $tplPath; ?>/images/logo.svg" alt="<?php echo $sitename; ?>" width="95" height="62">
    </a>
    <div class="site-header__contact-bar">
      <div class="site-header__contact">
        <span class="site-header__phone">+7 999 003 66 40</span>
        <span class="site-header__hours">Ежедневно, с 9:00 — 20:00</span>
      </div>
      <button class="btn btn--dark btn--md site-header__cta" data-open-callback>
        <img src="<?php echo $tplPath; ?>/icons/phone-icon.svg" alt="" class="btn__icon">
        <span class="site-header__cta-divider"></span>
        Заказать звонок
      </button>
    </div>
    <div class="site-header__nav-wrap">
      <nav class="site-header__nav">
        <jdoc:include type="modules" name="header-nav" style="none" />
      </nav>
      <div class="site-header__socials">
        <a href="https://max.ru/u/f9LHodD0cOL4o-aPzqYA3KqbDyaSayGyPamnLD8DbQEeHIuVsqXaltYkI7U" aria-label="Max"><img src="<?php echo $tplPath; ?>/icons/social-max.svg" alt="Max"></a>
        <a href="https://t.me/ultra_service_auto" aria-label="Telegram" target="_blank" rel="noopener"><img src="<?php echo $tplPath; ?>/icons/social-tg.svg" alt="Telegram"></a>
        <a href="https://wa.me/79990036640" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="<?php echo $tplPath; ?>/icons/social-wa.svg" alt="WhatsApp"></a>
      </div>
    </div>
    <div class="site-header__actions">
      <a href="tel:+79990036640" class="site-header__call-btn" aria-label="Заказать звонок">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5629 0.195118L10.9627 3.4895C10.6666 3.75915 10.6548 4.21638 10.939 4.49775L12.5378 6.11563C13.1536 6.73699 13.0707 7.1825 12.526 7.79214L10.2876 10.1603L7.83616 12.4934C7.23217 13.0444 6.78214 13.1265 6.14262 12.5285L4.48461 10.9693C4.20039 10.6996 3.73851 10.7231 3.46612 11.0162L0.185637 14.6271C-0.0749092 14.9202 -0.0630665 15.3657 0.233007 15.6354L2.19893 17.4174C2.80292 17.9215 3.44244 18.0739 4.08195 17.9684C5.23072 17.7808 6.87688 16.9484 8.14408 16.1981C8.93755 15.7291 9.51785 15.2954 10.2166 14.6974C11.0337 13.994 11.8154 13.2789 12.5496 12.5285C13.3076 11.7665 14.0537 10.9693 14.7643 10.1252C15.3564 9.42174 15.7828 8.83555 16.2446 8.05006C16.9907 6.78389 17.8079 5.13084 17.9737 3.99363C18.0684 3.36054 17.9145 2.73918 17.3934 2.14127L15.5577 0.218566C15.2854 -0.062805 14.8353 -0.0745288 14.5393 0.195118H14.5629Z" fill="url(#phone-grad-header)"/>
          <defs>
            <linearGradient id="phone-grad-header" x1="18" y1="9" x2="0" y2="9" gradientUnits="userSpaceOnUse">
              <stop stop-color="#DA2531"/>
              <stop offset="1" stop-color="#EF5F3D"/>
            </linearGradient>
          </defs>
        </svg>
      </a>
      <button class="site-header__burger" aria-label="Открыть меню" aria-expanded="false">
        <span></span>
        <span></span>
      </button>
    </div>
  </header>

  <main>
    <jdoc:include type="modules" name="breadcrumbs" style="none" />
    <?php if($isStage5Model){require JPATH_THEMES.'/ultraserviceauto/html/stage5-model.php';}else{ ?><jdoc:include type="component" /><?php } ?>


  </main>

  <!-- ═══════════════════════════════════════════════
       FOOTER
  ═══════════════════════════════════════════════ -->
  <?php if ($isMobilePilot || $isStageOneHome) require __DIR__.'/html/mobile-contact-components.php'; ?>
  <footer class="site-footer">
    <div class="container">
      <div class="footer__inner">

        <!-- Brand -->
        <div class="footer__brand">
          <div class="footer__brand-head">
              <a href="<?php echo $base; ?>/" class="footer__logo">
                <img src="<?php echo $tplPath; ?>/images/logo.svg" alt="<?php echo $sitename; ?>" style="filter: brightness(0) invert(1);">
              </a>
              <div class="footer__review">
                <a href="https://yandex.com/maps/org/ultra_service_auto/212502103829/?ll=37.607552%2C55.572619&utm_source=share&z=11" target="_blank">
                  <img src="<?php echo $tplPath; ?>/images/yandex-footer.png" alt="Яндекс" class="footer__review-icon">
                </a>
              </div>
          </div>
            <p class="footer__desc">Ремонт автоэлектроники, электромобилей и гибридов</p>
          <div class="footer__brand-top">
            <p class="footer__messenger-label">Связаться с нами можно через мессенджеры:</p>
            <div class="footer__socials">
              <a href="https://wa.me/79990036640" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="<?php echo $tplPath; ?>/icons/social-wa.svg" alt="WhatsApp"></a>
              <a href="https://t.me/ultra_service_auto" aria-label="Telegram" target="_blank" rel="noopener"><img src="<?php echo $tplPath; ?>/icons/social-tg.svg" alt="Telegram"></a>
              <a href="https://max.ru/u/f9LHodD0cOL4o-aPzqYA3KqbDyaSayGyPamnLD8DbQEeHIuVsqXaltYkI7U" aria-label="Max"><img src="<?php echo $tplPath; ?>/icons/social-max.svg" alt="Max"></a>
            </div>
          </div>
          <p class="footer__legal-ip">ИП Опойцев Олег Николаевич<br>ИНН: 503608092798<br>ОГРНИП: 306507419100037</p>
        </div>

        <!-- Navigation -->
        <nav class="footer__nav" aria-label="Навигация в подвале">
          <jdoc:include type="modules" name="header-nav" style="none" />
        </nav>

        <!-- Contacts -->
        <div class="footer__contacts">
          <div class="footer__contacts-top">
            <span class="footer__contacts-label">Контакты</span>
            <a href="tel:+79990036640" class="footer__phone">+7 (999) 003‑66‑40</a>
            <p class="footer__address">
              г. Москва, 32-й–33-й км МКАД, внешняя сторона. Варшавское шоссе, 21-й километр, 3Б/3
            </p>
            <a href="mailto:remont@oscomp.ru" class="footer__email">remont@oscomp.ru</a>
          </div>
          <div class="footer__legal-links">
            <a href="/privacy">Политика конфиденциальности</a>
            <p>© <?php echo date('Y'); ?> Ультра сервис авто</p>
          </div>
        </div>

      </div>
    </div>
  </footer>

</div><!-- /.page-frame -->

<!-- Mobile menu overlay -->
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <div class="mobile-menu__inner">
    <button class="mobile-menu__close" aria-label="Закрыть меню">
     <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.474546 0.398377C1.00572 -0.132792 1.86623 -0.132792 2.3974 0.398377L11.4355 9.43646L20.4579 0.414979C20.9891 -0.116123 21.8496 -0.116164 22.3808 0.414979C22.9119 0.946126 22.9119 1.80666 22.3808 2.33783L13.3583 11.3593L22.457 20.4579C22.9881 20.9891 22.9881 21.8496 22.457 22.3808C21.9258 22.912 21.0653 22.912 20.5341 22.3808L11.4355 13.2822L2.32123 22.3974C1.79006 22.9286 0.929544 22.9286 0.398374 22.3974C-0.13279 21.8662 -0.132793 21.0057 0.398374 20.4745L9.51263 11.3593L0.474546 2.32123C-0.0566213 1.79006 -0.056618 0.929547 0.474546 0.398377Z" fill="white"/>
    </svg>
    </button>
    <nav class="mobile-menu__nav">
      <jdoc:include type="modules" name="header-nav" style="none" />
    </nav>
    <a href="#s-contacts" class="btn btn--gradient mobile-menu__cta">Записаться</a>
    <div class="mobile-menu__footer">
      <p class="mobile-menu__socials-label">Связаться с нами можно через мессенджеры:</p>
      <div class="mobile-menu__socials">
        <a href="https://max.ru/u/f9LHodD0cOL4o-aPzqYA3KqbDyaSayGyPamnLD8DbQEeHIuVsqXaltYkI7U" aria-label="Max"><img src="<?php echo $tplPath; ?>/icons/social-max.svg" alt="Max"></a>
        <a href="https://wa.me/79990036640" aria-label="WhatsApp" target="_blank" rel="noopener"><img src="<?php echo $tplPath; ?>/icons/social-wa.svg" alt="WhatsApp"></a>
        <a href="https://t.me/ultra_service_auto" aria-label="Telegram" target="_blank" rel="noopener"><img src="<?php echo $tplPath; ?>/icons/social-tg.svg" alt="Telegram"></a>
      </div>
      <a href="tel:+79990036640" class="mobile-menu__phone-btn" aria-label="Позвонить">
        <svg xmlns="http://www.w3.org/2000/svg" width="68" height="68" viewBox="0 0 68 68" fill="none">
          <rect x="2" y="2" width="64" height="64" rx="32" fill="#1F1F1F"/>
          <rect x="2" y="2" width="64" height="64" rx="32" stroke="url(#paint0_linear_2739_6704)" stroke-width="4"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M41.2263 22.271L36.226 26.8465C35.8147 27.221 35.7983 27.8561 36.1931 28.2469L38.4136 30.4939C39.2689 31.3569 39.1538 31.9757 38.3972 32.8224L35.2884 36.1116L31.8836 39.3519C31.0447 40.1172 30.4196 40.2312 29.5314 39.4008L27.2286 37.2351C26.8339 36.8606 26.1924 36.8932 25.8141 37.3002L21.2578 42.3154C20.896 42.7225 20.9124 43.3413 21.3236 43.7158L24.0541 46.1908C24.8929 46.891 25.7812 47.1026 26.6694 46.9561C28.2649 46.6956 30.5512 45.5395 32.3112 44.4974C33.4133 43.846 34.2192 43.2436 35.1897 42.4131C36.3247 41.4361 37.4103 40.4429 38.4301 39.4008C39.4828 38.3424 40.519 37.2351 41.5059 36.0627C42.3284 35.0858 42.9205 34.2716 43.562 33.1806C44.5982 31.4221 45.7332 29.1262 45.9635 27.5467C46.0951 26.6674 45.8812 25.8044 45.1575 24.974L42.608 22.3036C42.2297 21.9128 41.6046 21.8999 41.1934 22.271H41.2263Z" fill="url(#paint1_linear_2739_6704)"/>
          <defs>
            <linearGradient id="paint0_linear_2739_6704" x1="0" y1="34" x2="68" y2="34" gradientUnits="userSpaceOnUse">
              <stop stop-color="#DA2531"/>
              <stop offset="1" stop-color="#EF5F3D"/>
            </linearGradient>
            <linearGradient id="paint1_linear_2739_6704" x1="46" y1="34.5" x2="21" y2="34.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="#DA2531"/>
              <stop offset="1" stop-color="#EF5F3D"/>
            </linearGradient>
          </defs>
        </svg>
      </a>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════
     GALLERY LIGHTBOX
═══════════════════════════════════════════════ -->
<div class="gallery-lightbox" id="gallery-lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Просмотр фотографии">
  <div class="gallery-lightbox__backdrop"></div>
  <button class="gallery-lightbox__close" aria-label="Закрыть">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0.44 0.44a1.5 1.5 0 0 1 2.12 0L12 9.88l9.44-9.44a1.5 1.5 0 1 1 2.12 2.12L14.12 12l9.44 9.44a1.5 1.5 0 1 1-2.12 2.12L12 14.12l-9.44 9.44A1.5 1.5 0 1 1 .44 21.44L9.88 12 .44 2.56A1.5 1.5 0 0 1 .44.44Z" fill="white"/>
    </svg>
  </button>
  <button class="gallery-lightbox__prev" aria-label="Предыдущая фотография">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 19l-7-7 7-7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <button class="gallery-lightbox__next" aria-label="Следующая фотография">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 5l7 7-7 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <div class="gallery-lightbox__img-wrap">
    <img class="gallery-lightbox__img" src="" alt="">
  </div>
  <div class="gallery-lightbox__counter">1 / 12</div>
</div>

  <!-- ═══════════════════════════════════════════════
       CALLBACK MODAL
  ═══════════════════════════════════════════════ -->
  <div class="modal-overlay" id="modal-callback" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modal-callback-title">
    <div class="callback-modal">
      <button class="callback-modal__close" aria-label="Закрыть">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0.47 0.47a1.6 1.6 0 0 1 2.26 0L13 10.74 23.27.47a1.6 1.6 0 1 1 2.26 2.26L15.26 13l10.27 10.27a1.6 1.6 0 1 1-2.26 2.26L13 15.26 2.73 25.53A1.6 1.6 0 1 1 .47 23.27L10.74 13 .47 2.73A1.6 1.6 0 0 1 .47.47Z" fill="#1f1f1f"/>
        </svg>
      </button>

      <h2 class="callback-modal__title" id="modal-callback-title">Обратный<br>звонок</h2>
      <p class="callback-modal__subtitle">Оставьте свой номер телефона и мы вам перезвоним!</p>
      <p class="callback-modal__service" hidden></p>

      <form class="callback-modal__form" novalidate>
        <?php if ($isStageOneHome || $isMobilePilot): ?>
        <div class="stage11-contactfields" hidden>
          <div class="callback-modal__field"><label class="callback-modal__label" for="callback-method">Способ связи *</label><select id="callback-method" name="contact_method" class="callback-modal__input"><option value="">Выберите способ связи</option><option value="phone">Телефон</option><option value="telegram">Telegram</option><option value="max">MAX</option><option value="email">Email</option></select></div>
          <div class="callback-modal__field"><label class="callback-modal__label" id="callback-contact-label" for="callback-contact">Контакт *</label><input id="callback-contact" name="contact" class="ym-disable-keys callback-modal__input" maxlength="254" aria-describedby="callback-contact-help"><small id="callback-contact-help">Сначала выберите способ связи.</small></div>
        </div>
        <?php endif; ?>

        <div class="callback-modal__field">
          <label class="callback-modal__label" for="callback-name">Ваше имя</label>
          <input class="ym-disable-keys callback-modal__input" type="text" id="callback-name" name="name" autocomplete="given-name">
        </div>
        <div class="callback-modal__field">
          <label class="callback-modal__label" for="callback-phone">Номер телефона</label>
          <input class="ym-disable-keys callback-modal__input" type="tel" id="callback-phone" name="phone" autocomplete="tel" placeholder="+7 (___) ___-__-__">
        </div>
        <?php if ($isStageOneHome || $isMobilePilot): ?>
        <div class="stage1-context" hidden>
          <div class="callback-modal__field"><label class="callback-modal__label" for="callback-system">Система / направление</label><input class="ym-disable-keys callback-modal__input" id="callback-system" name="system" maxlength="160"></div>
          <div class="callback-modal__field">
            <label class="callback-modal__label" for="callback-vehicle">Автомобиль: марка и модель</label>
            <input class="ym-disable-keys callback-modal__input" id="callback-vehicle" name="vehicle" maxlength="160" placeholder="Например, Voyah Free, 2023">
          </div>
          <div class="callback-modal__field">
            <label class="callback-modal__label" for="callback-symptom">Что произошло?</label>
            <textarea class="ym-disable-keys callback-modal__input" id="callback-symptom" name="symptom" maxlength="2000" rows="3" placeholder="Опишите симптомы или сообщение на экране"></textarea>
          </div>
        </div>
        <?php endif; ?>
        <div class="callback-modal__actions">
          <button type="submit" class="callback-modal__submit">Отправить</button>
        </div>
      </form>

      <p class="callback-modal__privacy">Нажимая на кнопку «Отправить», я даю согласие на <a href="/privacy">обработку персональных данных</a></p>
      <div class="callback-modal__success" aria-live="polite">
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none" aria-hidden="true">
          <circle cx="30" cy="30" r="28" stroke="url(#success-grad)" stroke-width="4"/>
          <path d="M17 30.5l9 9 17-18" stroke="url(#success-grad)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <defs><linearGradient id="success-grad" x1="0" y1="30" x2="60" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#da2531"/><stop offset="1" stop-color="#ef5f3d"/></linearGradient></defs>
        </svg>
        <p>Спасибо! Мы перезвоним вам в ближайшее время.</p>
      </div>
    </div>
  </div>

  <script src="<?php echo $tplPath; ?>/js/breadcrumbs.js"></script>
  <script src="<?php echo $tplPath; ?>/js/accordion.js"></script>
  <script src="<?php echo $tplPath; ?>/js/slider.js"></script>
  <script src="<?php echo $tplPath; ?>/js/brands-slider.js"></script>
  <script src="<?php echo $tplPath; ?>/js/nav.js"></script>
  <script src="<?php echo $tplPath; ?>/js/rc1-modal-callback.js?v=rc11"></script>
  <?php if ($isStageOneHome): ?><script src="<?php echo $tplPath; ?>/js/stage11-home.js?v=11"></script><?php endif; ?>
  <script src="<?php echo $tplPath; ?>/js/gallery.js"></script>
  <script src="<?php echo $tplPath; ?>/js/reviews.js"></script>

<?php if (UsaRc1Runtime::mode()==='production'): ?>
<!-- Yandex.Metrika counter -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108453116', 'ym');

    ym(108453116, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/108453116" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
<?php endif; ?>




<jdoc:include type="modules" name="debug" style="none" />
<?php if ($isStageOneHome): ?>
<nav class="stage2-sticky" aria-label="Связаться с сервисом" data-page-type="home" data-block-id="sticky"><a href="tel:+79990036640" data-phone-click>Позвонить</a><button type="button" data-open-callback data-problem="true">Описать проблему</button></nav>
<script src="<?php echo $tplPath; ?>/js/stage2-home.js?v=20"></script>
<?php endif; ?>
<?php if ($isMobilePilot): ?><script src="<?php echo $tplPath; ?>/js/mobile-pilot.js?v=1"></script><?php endif; ?>
<?php if ($isMobilePilot || $isStageOneHome): ?><script src="<?php echo $tplPath; ?>/js/mobile-contact-components.js?v=2"></script><?php endif; ?>
<?php if ($isStageOneHome): ?><script src="<?php echo $tplPath; ?>/js/home-mobile-v11.js?v=11"></script><?php endif; ?>
<?php if($isStage4c&&$app->input->getInt('id')===202): ?><script src="<?= $tplPath ?>/js/stage4c.js?v=1"></script><?php endif; ?>
<?php $rc1Context=UsaRc1Gate::context(); $rc1Context['production']=UsaRc1Runtime::mode()==='production'; ?><script type="application/json" id="usa-rc1-context"><?= json_encode($rc1Context,JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) ?></script><script src="<?= $tplPath ?>/js/rc1-analytics.js?v=rc11"></script>
</body>
</html>
