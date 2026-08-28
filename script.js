(function () {
  'use strict';

  /* год в футере */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* шапка при скролле */
  var hdr = document.getElementById('hdr');
  var onScroll = function () {
    hdr.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* мобильное меню */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mmenu');

  var closeMenu = function () {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
  };
  closeMenu();

  burger.addEventListener('click', function () {
    if (burger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
    }
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 900) closeMenu();
  });

  /* аккордеон программы */
  Array.prototype.forEach.call(document.querySelectorAll('.mod'), function (mod, i) {
    var head = mod.querySelector('.mod__h');

    if (i === 0) {
      mod.classList.add('is-open');
      head.setAttribute('aria-expanded', 'true');
    }

    head.addEventListener('click', function () {
      var wasOpen = mod.classList.contains('is-open');

      // закрываем все остальные — открытым остаётся только один модуль
      Array.prototype.forEach.call(document.querySelectorAll('.mod'), function (m) {
        m.classList.remove('is-open');
        m.querySelector('.mod__h').setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        mod.classList.add('is-open');
        head.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* появление блоков при скролле */
  var targets = document.querySelectorAll(
    '.sec__head, .card3, .pains li, .mod, .cv, .fmt__list li, ' +
    '.check, .nope, .author__media, .author__copy, .faq details, ' +
    '.apply__copy, .form, .prog__cta'
  );

  if ('IntersectionObserver' in window) {
    Array.prototype.forEach.call(targets, function (el, i) {
      el.classList.add('rv');
      el.style.transitionDelay = Math.min(i % 6, 5) * 45 + 'ms';
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    Array.prototype.forEach.call(targets, function (el) {
      io.observe(el);
    });
  }


  /* ── модальное окно с политикой ── */
  (function () {
    var modal = document.getElementById('privacyModal');
    if (!modal) return;
    var opener = null;

    var open = function (e) {
      if (e) { e.preventDefault(); opener = e.currentTarget; }
      modal.hidden = false;
      document.body.classList.add('pp-open');
      var x = modal.querySelector('.pp__x');
      if (x) x.focus();
    };

    var close = function () {
      modal.hidden = true;
      document.body.classList.remove('pp-open');
      if (opener && opener.focus) opener.focus();
    };

    Array.prototype.forEach.call(document.querySelectorAll('[data-pp-open]'), function (a) {
      a.addEventListener('click', open);
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-pp-close]'), function (b) {
      b.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) close();
    });
  })();

  /* ── лёгкий параллакс картинки первого экрана ── */
  (function () {
    var pic = document.querySelector('.hero__pic');
    if (!pic) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var ticking = false;
    var limit = 900;

    var apply = function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      if (y > limit) return;
      var k = window.innerWidth < 900 ? 0.05 : 0.1;
      pic.style.transform = 'translate3d(0,' + (y * k).toFixed(1) + 'px,0)';
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }, { passive: true });

    apply();
  })();

  /* ── UTM / атрибуция ── */
  (function () {
    var TRACK_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','yclid'];
    var STORAGE_KEY = 'ml:attribution';
    var REFERER_COOKIE = 'ml_referer1';
    var REFERER_TTL = 90;

    var setCookie = function (n, v, days) {
      var d = new Date();
      d.setTime(d.getTime() + days * 864e5);
      document.cookie = n + '=' + encodeURIComponent(v) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
    };
    var getCookie = function (n) {
      var m = document.cookie.match('(^|;)\\s*' + n + '\\s*=\\s*([^;]+)');
      return m ? decodeURIComponent(m[2]) : '';
    };

    var params = new URLSearchParams(window.location.search);
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {}; } catch (e) {}
    TRACK_KEYS.forEach(function (k) {
      var v = params.get(k);
      if (v) stored[k] = v;
    });
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored)); } catch (e) {}

    var urlReferer = params.get('referer1');
    if (urlReferer) setCookie(REFERER_COOKIE, urlReferer, REFERER_TTL);
    var referer1 = urlReferer || getCookie(REFERER_COOKIE) || '';

    var form = document.getElementById('leadForm');
    if (!form) return;
    TRACK_KEYS.forEach(function (k) {
      var el = form.querySelector('input[name="' + k + '"]');
      if (el && stored[k]) el.value = stored[k];
    });
    var r1 = form.querySelector('input[name="referer1"]');
    if (r1 && referer1) r1.value = referer1;
    var rf = form.querySelector('input[name="referrer"]');
    if (rf) rf.value = document.referrer || '';
    var lu = form.querySelector('input[name="landing_url"]');
    if (lu) lu.value = window.location.href;
  })();

  /* ── телефон с выбором страны ── */
  var iti = null;
  var phoneEl = document.getElementById('phone');
  if (phoneEl && window.intlTelInput) {
    iti = window.intlTelInput(phoneEl, {
      initialCountry: 'auto',
      geoIpLookup: function (success) {
        fetch('https://api.country.is/')
          .then(function (r) { return r.json(); })
          .then(function (d) { success(d.country || 'KZ'); })
          .catch(function () { success('KZ'); });
      },
      preferredCountries: ['kz','ru','uz','kg','by','az','am','ge','ua','md'],
      separateDialCode: true,
      autoPlaceholder: 'aggressive',
      customPlaceholder: function (p) { return p.replace(/^([08])[\s.]+/, ''); },
      utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.5.3/build/js/utils.js'
    });
  }

  /* ── отправка заявки ── */
  var form = document.getElementById('leadForm');
  var submitBtn = document.getElementById('submitBtn');

  var NAME_RE = /^[^\-\s][\p{L}\s\-]+$/u;
  var EMAIL_RE = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;

  var validPhone = function (v) {
    if (iti && typeof iti.isValidNumber === 'function') return iti.isValidNumber();
    return v.replace(/\D/g, '').length >= 6;
  };

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      Array.prototype.forEach.call(form.querySelectorAll('.form-row'), function (r) {
        r.classList.remove('error');
      });

      var name = form.name.value.trim();
      var surname = form.surname.value.trim();
      var email = form.email.value.trim();
      var phone = form.phone.value.trim();
      var valid = true;

      var fail = function (el) { el.closest('.form-row').classList.add('error'); valid = false; };

      if (!name || !NAME_RE.test(name)) fail(form.name);
      if (!surname || !NAME_RE.test(surname)) fail(form.surname);
      if (!email || !EMAIL_RE.test(email)) fail(form.email);
      if (!phone || !validPhone(phone)) fail(form.phone);

      if (!form.consent.checked) {
        form.consent.style.outline = '2px solid #E5342F';
        setTimeout(function () { form.consent.style.outline = ''; }, 2500);
        valid = false;
      }
      if (!valid) return;

      if (iti && typeof iti.getNumber === 'function') form.phone.value = iti.getNumber();

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправляем…';

      fetch(form.action, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
        .then(function () { window.location.replace('thank-you.html'); })
        .catch(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Оставить заявку';
          alert('Не удалось отправить заявку. Попробуйте ещё раз.');
        });
    });

    Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
      input.addEventListener('input', function () {
        var row = input.closest('.form-row');
        if (row) row.classList.remove('error');
      });
    });
  }
})();
