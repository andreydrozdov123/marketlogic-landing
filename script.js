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
      var open = mod.classList.toggle('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* появление блоков при скролле */
  var targets = document.querySelectorAll(
    '.sec__head, .card3, .miss li, .fall, .bn, .tools, .stage, ' +
    '.step, .fmt__media figure, .cmp__col, .author__media, .author__copy, ' +
    '.faq details, .apply__copy, .form, .prog__cta, .claim__in > *'
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

  /* форма заявки (заглушка) */
  var form = document.getElementById('applyForm');
  var ok = document.getElementById('formOk');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var required = form.querySelectorAll('input[required]');
    var valid = true;

    Array.prototype.forEach.call(required, function (input) {
      var empty = !input.value.trim();
      input.classList.toggle('is-error', empty);
      if (empty) valid = false;
    });

    if (!valid) return;

    // TODO: подключить отправку (Telegram-бот, CRM или почтовый вебхук)
    ok.hidden = false;
    form.reset();
  });

  Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('is-error');
    });
  });
})();
