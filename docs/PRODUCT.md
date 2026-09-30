# Portfolio Site — Product Documentation

> Deep codebase documentation + user-serving product guide.
> Codebase: `/home/sajad/Projects/portfolio/site` | Stack: vanilla HTML + CSS + JS, no build | Live: GitHub Pages (sajadinmaker.github.io)

## 1. What this product is

Personal portfolio for Sajad: showcases HookFlow (featured), Lexora (featured), neuDB, EsenceLab, plus Writing (3 posts), About, Resume, AI + Engineering pages. Goal: convert visitors → GitHub / LinkedIn / email contact.

**Who it's for:** hiring managers, collaborators, and developers evaluating backend + AI product work.

## 2. How it works

Zero-dependency static root:
- `index.html` (canonical), `projects.html`, `writing.html`, `about.html`, `ai.html`, `engineering.html`, `404.html`
- `projects/*.html` (4), `writing/*.html` (3), `humanize/index.html` demo
- `style.css` (308 lines, dark, 42rem column), `script.js` (92 lines: year, active-nav, sticky header, mailto copy)
- Discovery: `sitemap.xml`, `robots.txt`, `feed.xml` (RSS), OG/Twitter, JSON-LD Person, `favicon.svg`, `resume.pdf`

No templating — header/nav/footer duplicated per file (drift risk, see roadmap).

## 3. User guide (serve users)

### Serve locally
```bash
python3 -m http.server -d /home/sajad/Projects/portfolio/site 8000
# → http://localhost:8000
```

### Edit content
- Project blurbs: `index.html` + `projects/*.html` (keep in sync with `../profile/README.md`)
- Writing: `writing/*.html` + `feed.xml`
- Resume: replace `resume.pdf` + update `about.html`
- Styles/nav: `style.css`, each page's `<nav>`

### Deploy
Push `main` → GitHub Pages serves repo root (`sajadinmaker.github.io`). Verify: `/sitemap.xml`, `/feed.xml`, `/robots.txt`, 404 page.

## 4. Operations

- No env, no health endpoint (static). Monitor via Pages status + manual link check.
- Keep `sitemap.xml` + `feed.xml` dates in sync on new posts.
- Roadmap: shared header/footer include (or 11ty), `link-check` CI, HTML validator, Plausible analytics, contact form (currently mailto only).

## 5. Verification

```bash
python3 -m http.server -d . 8000
# check /, /projects.html, /sitemap.xml, /feed.xml
```
