# 7. SEO & metadata

| | |
|---|---|
| **Covers** | Per-route titles and descriptions, Open Graph + Twitter cards, theme colour, favicon, viewport, `robots.txt`, `sitemap.xml`, no broken same-origin requests |
| **Static** | `index.html`, `skills.html`, `roadmap.html`, `contact.html` (`<head>`) · `robots.txt` · `sitemap.xml` |
| **React** | `react-app/index.html` (defaults) · `react-app/src/lib/meta.js` (`usePageMeta`) · `react-app/public/robots.txt` · `react-app/public/sitemap.xml` |
| **Requirements** | FR-SEO-01 … FR-SEO-07 |
| **Test cases** | TC-SEO-01 … TC-SEO-07 |
| **Automated in** | `tests/e2e/seo.spec.js` — **both** the `static` and `react` projects |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-SEO-01 | Every page has a unique `<title>` containing “Skill GPS” | P0 | Both |
| FR-SEO-02 | Every page has a unique meta description (80–200 chars) | P0 | Both |
| FR-SEO-03 | Every page has complete Open Graph and Twitter card tags | P1 | Both |
| FR-SEO-04 | Every page declares `theme-color` and an inline SVG favicon | P2 | Both |
| FR-SEO-05 | `robots.txt` is served, allows crawling and points at the sitemap | P1 | Both |
| FR-SEO-06 | `sitemap.xml` is valid XML listing all four routes with absolute URLs and priorities | P1 | Both |
| FR-SEO-07 | No same-origin request on any page returns an error status | P0 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-SEO-01 | Unique titles | Load all 4 pages, collect titles | Each contains “Skill GPS”; 4 distinct values | P0 | `seo.spec.js` › `every page has a unique title containing the brand` |
| TC-SEO-02 | Unique descriptions | Load all 4 pages, collect descriptions | Each 80–200 chars; 4 distinct values | P0 | `seo.spec.js` › `every page has a unique, descriptive meta description` |
| TC-SEO-03 | Social cards | Load all 4 pages | `og:type`, `og:site_name`, `og:title`, `og:description`, `twitter:card`, `twitter:title`, `twitter:description` all present; `og:title` mirrors `<title>` | P1 | `seo.spec.js` › `every page ships complete Open Graph and Twitter cards` |
| TC-SEO-04 | Theme colour, favicon, viewport | Load all 4 pages | `theme-color` present, `rel=icon` is an inline SVG, viewport is `width=device-width` | P2 | `seo.spec.js` › `every page declares a theme colour, an inline favicon and a responsive viewport` |
| TC-SEO-05 | robots.txt | GET `/robots.txt` | 200, `text/plain`, `User-agent: *`, `Allow: /`, a `Sitemap:` URL | P1 | `seo.spec.js` › `robots.txt allows crawling and points at the sitemap` |
| TC-SEO-06 | sitemap.xml | GET `/sitemap.xml`, parse XML | 4 `<loc>` entries, absolute `https://…` URLs, priorities 0–1, every listed route returns 200 | P1 | `seo.spec.js` › `sitemap.xml lists every page that actually exists` |
| TC-SEO-07 | No broken assets | Load all 4 pages, watch same-origin responses | No 4xx/5xx (CSS, JS, icons all resolve) | P0 | `seo.spec.js` › `no same-origin request fails on any page` |

## Implementation notes

- **Static site:** each page has its own `<head>`; `robots.txt` and `sitemap.xml`
  sit at the project root and list `…/skills.html` style URLs.
- **React app:** one document, so `usePageMeta(key)` applies the route's title,
  description, OG and Twitter tags from `src/lib/meta.js`. `index.html` carries
  the home defaults so the first paint (and crawlers that do not run JS) still get
  a complete card.
- **Why a layout effect:** `useLayoutEffect` applies the tags during the route
  commit, before paint, so a crawler never sees the previous route's title. The
  test waits for the page heading, which guarantees that commit.
- **Crawling files:** `react-app/public/robots.txt` and
  `react-app/public/sitemap.xml` are served by Vite in dev and copied into
  `dist/` by `npm run build`. Their sitemap uses clean routes (`/skills`), the
  static one uses `.html` files — the test normalises both with `normalizeRoute()`.
- **Single source of metadata:** the React copy mirrors the static copy exactly,
  including the social descriptions, so the two implementations describe
  themselves identically.
- **Favicon** is a `data:image/svg+xml` URI, so it needs no extra request.
- **Found by this spec:** three static pages were missing `twitter:title` /
  `twitter:description`, and the skills page advertised “36 real questions” while
  the app ships 48 (6 tracks × 8). Both fixed.
- **Previously skipped:** the spec used to skip the `react` project. The React app
  now has full parity, so the suite runs **163 tests with 0 skipped**.
