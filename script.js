(function () {
  'use strict';

  /* ---------- год в футере ---------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- шапка: тень при скролле ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');

  var closeMenu = function () {
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    if (open) {
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
    if (window.innerWidth >= 860) closeMenu();
  });

  /* ---------- аккордеон программы ---------- */
  var modules = document.querySelectorAll('.module');
  Array.prototype.forEach.call(modules, function (mod, i) {
    var head = mod.querySelector('.module__head');

    // первый модуль раскрыт по умолчанию
    if (i === 0) {
      mod.classList.add('is-open');
      head.setAttribute('aria-expanded', 'true');
    }

    head.addEventListener('click', function () {
      var open = mod.classList.toggle('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* ---------- появление блоков при скролле ---------- */
  var targets = document.querySelectorAll(
    '.section__head, .pain, .skills li, .module, .quote, .pain__answer, ' +
    '.fit__copy, .fit__note, .author__media, .author__copy, .faq details, ' +
    '.cta__copy, .form, .program__cta'
  );

  if ('IntersectionObserver' in window) {
    Array.prototype.forEach.call(targets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i % 6, 5) * 45 + 'ms';
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    Array.prototype.forEach.call(targets, function (el) {
      io.observe(el);
    });
  }

  /* ---------- форма заявки (заглушка) ---------- */
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
