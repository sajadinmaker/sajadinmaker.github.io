/* Progressive enhancement: footer year, active nav, sticky header state, copy email. */
(function () {
  'use strict';

  /* Footer year. */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Mark where the reader is. Exact match wins; otherwise highlight the section.
     Paths are normalised to a trailing slash so /projects.html and /projects/ compare equal. */
  function path(href) {
    var p = new URL(href, location.href).pathname
      .replace(/index\.html?$/, '')
      .replace(/\.html$/, '/');
    return p.slice(-1) === '/' ? p : p + '/';
  }
  function markNav() {
    var links = document.querySelectorAll('nav[aria-label="Primary"] a[href]');
    if (!links.length) return;
    var here = path(location.href);
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var to = path(a.getAttribute('href'));
      if (to === here) {
        a.setAttribute('aria-current', 'page');
      } else if (to !== '/' && here.indexOf(to) === 0) {
        a.setAttribute('data-section', '');
      }
    }
  }
  markNav();

  /* Reveal the header rule only once the page has scrolled. */
  var header = document.querySelector('body > header');
  if (header) {
    var queued = false;
    function syncHeader() {
      queued = false;
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    addEventListener('scroll', function () {
      if (!queued) {
        queued = true;
        requestAnimationFrame(syncHeader);
      }
    }, { passive: true });
    syncHeader();
  }

  /* A copy button next to any link that displays a bare email address. */
  if (document.querySelectorAll('a[href^="mailto:"]').length) {
    var supportsClipboard = !!(navigator.clipboard && window.isSecureContext);
    var status = document.createElement('span');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.className = 'visually-hidden';

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      var addr = a.getAttribute('href').replace(/^mailto:/, '').split('?')[0].trim();
      if (!addr || a.textContent.indexOf('@') === -1) return;

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy email address');
      a.insertAdjacentElement('afterend', btn);

      var reset;
      btn.addEventListener('click', function () {
        var ok = function () {
          btn.textContent = 'Copied';
          btn.classList.add('is-done');
          status.textContent = 'Email address copied';
          clearTimeout(reset);
          reset = setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('is-done');
            status.textContent = '';
          }, 1600);
        };
        var fail = function () {
          window.prompt('Copy email address', addr);
        };
        if (supportsClipboard) navigator.clipboard.writeText(addr).then(ok, fail);
        else fail();
      });
    });

    document.body.appendChild(status);
  }
})();
