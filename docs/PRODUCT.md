# Portfolio Site

> Maintainer doc. Static site, hosted by GitHub Pages at sajadinmaker.github.io.
> Codebase: `~/sajadinmaker.github.io` | Stack: vanilla HTML + CSS + JS, no build.

## 1. What this product is

Personal portfolio for Sajad: Projects (Lexora, EsenceLab, vpnbox, HookFlow, neuDB), About,
AI and Engineering pages. Goal: bring visitors to GitHub / LinkedIn /
email contact. No blog, no archive, no feed, no personality pages.

## 2. How it works

- `index.html` (canonical), `projects.html`, `about.html`, `ai.html`, `engineering.html`, `404.html`
- `projects/lexora.html`, `projects/esencelab.html` (case studies)
- `style.css` (ink palette: pure black `#000000`, quiet greys, system blue links; 42rem column, static header, mono chrome)
- `script.js` (footer year, active-nav marking, mailto copy)
- Discovery: `sitemap.xml`, `robots.txt`, OG meta, `favicon.svg`
- Internal maintainer docs: `README.md`, `docs/PRODUCT.md`, `humans.txt`

No templating: header/nav/footer duplicated per file (drift risk, see roadmap).

## 3. User guide

### Serve locally
```bash
python3 -m http.server -d ~/sajadinmaker.github.io 8000
# → http://localhost:8000
```

### Edit content
- Site copy follows the technical-writing standard: plain sentences, one thought per sentence, real words over jargon (Diataxis modes, Google developer style, STE, Global English).
- Project blurbs: `index.html` + `projects.html` + `projects/*.html` (keep in sync with the GitHub profile README)
- Styles/nav: `style.css`, each page's `<nav>`

### Deploy
Push `main` → GitHub Pages serves the repo root. Verify: `/sitemap.xml`, `/robots.txt`, `404.html`.

## 4. Operations

- No env, no health endpoint (static). Monitor via Pages status + manual link check.
- Keep `sitemap.xml` `lastmod` in sync when a page's content changes.
- Roadmap: shared header/footer include (or 11ty), `link-check` CI, HTML validator, contact form (currently mailto only).

## 5. Verification

```bash
python3 -m http.server -d . 8000
# check /, /projects.html, /sitemap.xml, /404.html
```
