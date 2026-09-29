/* /humanize — scroll reveal. No-ops without IntersectionObserver or under
   prefers-reduced-motion, so content is never left hidden. */
(function () {
  'use strict';

  var items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('hz');
  items.forEach(function (el) { el.classList.add('hz-pending'); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('hz-pending');
      entry.target.classList.add('hz-shown');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });

  items.forEach(function (el) { io.observe(el); });
})();
