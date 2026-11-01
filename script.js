/* Progressive enhancement: footer year, active nav, copy email. */
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

  /* Background: an original ASCII tide in neon red. Decoration only: it is
     aria-hidden, ignores pointers, holds still for reduced motion, and stops
     drawing while the tab is hidden. */
  (function () {
    var canvas = document.createElement('canvas');
    canvas.className = 'ascii-tide';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var CELL = 20, SIZE = 14;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var glyphs = '.:-=';
    var neon = getComputedStyle(document.documentElement).getPropertyValue('--neon').trim() || '#ff073a';
    var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var w = 0, h = 0, cols = 0, rows = 0, raf = 0, last = 0;

    function hash(x, y) {
      var n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ 0x9e3779b9;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    }

    function size() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = SIZE + 'px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
      ctx.textBaseline = 'top';
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = neon;
      var tt = t * 0.001;
      var cx1 = cols * 0.28 + Math.sin(tt * 0.5) * cols * 0.10;
      var cy1 = rows * 0.36 + Math.cos(tt * 0.4) * rows * 0.08;
      var cx2 = cols * 0.72 + Math.cos(tt * 0.34 + 1.7) * cols * 0.09;
      var cy2 = rows * 0.64 + Math.sin(tt * 0.44 + 0.6) * rows * 0.10;
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          /* Two soft, wide swells; glyph density shades them like water. */
          var d1x = x - cx1, d1y = (y - cy1) * 1.15;
          var d2x = x - cx2, d2y = (y - cy2) * 1.15;
          var wave = 0.5 + 0.5 * Math.sin(x * 0.11 + y * 0.07 - tt * 1.2);
          var v = 0.62 * Math.exp(-(d1x * d1x + d1y * d1y) / 420)
                + 0.50 * Math.exp(-(d2x * d2x + d2y * d2y) / 300)
                + 0.10 * wave;
          if (v < 0.55) continue;
          var hsh = hash(x, y);
          if (hsh < 0.35) continue;
          ctx.globalAlpha = 0.06 + Math.min(0.09, (v - 0.55) * 0.22) + hsh * 0.02;
          var gi = Math.min(glyphs.length - 1, ((v - 0.55) * 6 + hsh * 1.5) | 0);
          ctx.fillText(glyphs[gi], x * CELL + (hsh - 0.5) * 2, y * CELL);
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      if (now - last > 90) { last = now; draw(now); }
      raf = requestAnimationFrame(frame);
    }

    size();
    window.addEventListener('resize', size);
    if (!calm) raf = requestAnimationFrame(frame);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!calm && !raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });
  })();

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
