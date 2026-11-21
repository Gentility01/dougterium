(function () {
  'use strict';

  var EMAILJS_PUBLIC_KEY = 'z7JFEBPMo9FtNPqE9';
  var EMAILJS_SERVICE_ID = 'service_t7uqjt6';
  var EMAILJS_TEMPLATE_ID = 'template_39xvmhe';

  var root = document.documentElement;

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById('theme-toggle');
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  var toTop = document.getElementById('to-top');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var nav = document.getElementById('site-nav');
  var navToggle = document.getElementById('nav-toggle');
  function setNav(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('open'));
    });
  }
  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  /* ---------- Active section in nav ---------- */
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  if ('IntersectionObserver' in window && links.length) {
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.section-head, .project, .timeline > li, .skill-group, .about-copy, .contact-form, .mini-projects');
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      revealer.observe(el);
    });
  }

  /* ---------- Contact form (EmailJS) ---------- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var emailjsReady = false;

  function initEmailJS() {
    if (emailjsReady || !window.emailjs) return emailjsReady;
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailjsReady = true;
    return true;
  }

  function setStatus(msg, kind) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  function validate() {
    var ok = true;
    var firstBad = null;
    ['name', 'email', 'message'].forEach(function (id) {
      var input = form.querySelector('#' + id);
      var value = input.value.trim();
      var bad = !value || (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      input.closest('.field').classList.toggle('invalid', bad);
      input.setAttribute('aria-invalid', String(bad));
      if (bad && !firstBad) firstBad = input;
      if (bad) ok = false;
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  if (form) {
    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        setStatus('Please fill in your name, a valid email and a message.', 'err');
        return;
      }
      if (!initEmailJS()) {
        setStatus('The form could not load. Please email me directly at douglaschiemela1@gmail.com.', 'err');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';
      setStatus('', '');

      window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
        .then(function () {
          form.reset();
          setStatus('Thanks! Your message has been sent. I\'ll get back to you shortly.', 'ok');
        })
        .catch(function (err) {
          console.error('EmailJS error:', err);
          setStatus('Something went wrong. Please email me directly at douglaschiemela1@gmail.com.', 'err');
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = label;
        });
    });
  }
})();
