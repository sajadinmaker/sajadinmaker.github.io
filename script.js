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

  /* Homepage terminal — a tiny, fake-but-honest command loop.
     No JS: the block stays a readable quick-facts card with an inert input. */
  var term = document.querySelector('.term');
  if (term) {
    var outEl = term.querySelector('.term-out');
    var input = term.querySelector('.term-in');
    if (outEl && input) {
      var LINKS = {
        'hookflow': './projects/hookflow.html',
        'lexora': './projects/lexora.html',
        'neudb': './projects/neudb.html',
        'esencelab': './projects/esencelab.html',
        'vpnbox': 'https://github.com/sajadinmaker/vpnbox'
      };
      var PAGES = {
        'projects': './projects.html',
        'writing': './writing.html',
        'about': './about.html',
        'resume': './resume.html'
      };
      var NAMES = Object.keys(LINKS).concat(Object.keys(PAGES)).join('  ');
      var LS_LONG = [
        'total 9',
        '-rw-r--r--   5.7k  2026-09-27  preventing-double-delivery.html',
        '-rw-r--r--   6.6k  2026-09-14  hookflow-persist-first.html',
        '-rw-r--r--   5.8k  2026-07-24  why-neudb.html',
        '-rw-r--r--   9.2k  2026-09-20  hookflow.html',
        '-rw-r--r--   6.5k  2026-09-20  lexora.html',
        '-rw-r--r--   6.4k  2026-09-20  neudb.html',
        '-rw-r--r--   6.3k  2026-09-20  esencelab.html',
        'drwxr-xr-x         2026-09     vpnbox/'
      ];
      var HELP = [
        'help        this list',
        'ls ~/work   what I shipped',
        'ls -la      the detailed listing',
        'open <name> go there — try: open hookflow',
        'read        writing, newest first',
        'contact     best way in',
        'clear       tidy up',
        'sudo        for the bold',
        'coffee      probably overdue'
      ];
      var READ = [
        'preventing double delivery under concurrent workers — 27 Sep 2026',
        'hookflow: accept first, deliver later — 14 Sep 2026',
        'why I built neuDB — 24 Jul 2026'
      ];

      var MAX_DYN = 60;
      var hist = [], hi = 0;

      /* the input hugs its content so the block cursor sits right after the text */
      function fitInput() {
        input.setAttribute('size', String(input.value.length ? input.value.length + 1 : 10));
      }
      input.addEventListener('input', fitInput);
      fitInput();

      function push(p) {
        outEl.appendChild(p);
        var dyn = outEl.querySelectorAll('p.dyn');
        if (dyn.length > MAX_DYN) outEl.removeChild(dyn[0]);
      }
      function echo(cmd) {
        var p = document.createElement('p');
        p.className = 'dyn';
        var s = document.createElement('span');
        s.className = 'prompt';
        s.textContent = '$ ';
        p.appendChild(s);
        p.appendChild(document.createTextNode(cmd));
        push(p);
      }
      function out(text) {
        var p = document.createElement('p');
        p.className = 'dyn out';
        p.textContent = text;
        push(p);
      }

      function run(raw) {
        var cmd = raw.trim();
        if (!cmd) return;
        echo(cmd);
        var parts = cmd.split(/\s+/);
        var name = parts[0].toLowerCase();
        switch (name) {
          case 'help':
            HELP.forEach(out);
            break;
          case 'ls':
            var args = parts.slice(1);
            var wantLong = args[0] === '-la' || args[0] === '-l';
            var t = wantLong ? args[1] : args[0];
            if (t && t !== '~/work' && t !== '~' && t !== '.') {
              out('ls: ' + t + ': not here — try ls ~/work');
            } else if (wantLong) {
              LS_LONG.forEach(out);
            } else {
              out('hookflow/  lexora/  neudb/  esencelab/  vpnbox/');
            }
            break;
          case 'open':
            var target = (parts[1] || '').toLowerCase();
            var dest = LINKS[target] || PAGES[target];
            if (dest) {
              out('opening ' + target + ' …');
              window.setTimeout(function () { window.location.href = dest; }, 350);
            } else {
              out('open which? names: ' + NAMES);
            }
            break;
          case 'read':
            READ.forEach(out);
            break;
          case 'contact':
            out('abdullasajad01@gmail.com — email works best');
            break;
          case 'sudo':
            out('nice try — the vpn needs sudo, not this site');
            break;
          case 'coffee':
            out('418 — I am a teapot');
            break;
          case 'clear':
            Array.prototype.slice.call(outEl.querySelectorAll('p.dyn')).forEach(function (n) {
              outEl.removeChild(n);
            });
            break;
          default:
            out(name + ": command not found — 'help' lists a few");
        }
      }

      term.addEventListener('click', function () {
        var sel = window.getSelection && window.getSelection();
        if (sel && String(sel)) return; // let people select text
        input.focus();
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          var v = input.value;
          run(v);
          if (v.trim()) { hist.push(v); hi = hist.length; }
          input.value = '';
          fitInput();
        } else if (e.key === 'ArrowUp' && hist.length) {
          e.preventDefault();
          if (hi > 0) hi--;
          input.value = hist[hi] || '';
          fitInput();
        } else if (e.key === 'ArrowDown' && hist.length) {
          e.preventDefault();
          if (hi < hist.length - 1) hi++;
          else hi = hist.length;
          input.value = hi < hist.length ? hist[hi] : '';
          fitInput();
        }
      });
    }
  }
})();
