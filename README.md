# Skill GPS 🧭

A professional **student skill-assessment & career roadmap** website.

Skill GPS helps students answer three questions: *where am I, where should I go, and what do I do next?*
It includes a real 8-question skill test per career track, a skill-by-skill result breakdown, a
phase-by-phase roadmap, and locally saved progress.

**Live:** [Firebase](https://software-4b622.web.app) · [GitHub Pages](https://saniyag704-stack.github.io/software/)
**Source:** [github.com/saniyag704-stack/software](https://github.com/saniyag704-stack/software)

---

## ✨ What's inside

| Page | What it does |
|------|--------------|
| **Home** (`index.html`) | Hero, live dashboard mockup, features, six career tracks, how it works, student stories, CTA |
| **Skills** (`skills.html`) | Interactive assessment for 6 tracks, radar-chart results, skill library with live search & filters |
| **Roadmap** (`roadmap.html`) | Level-aware 5-phase roadmaps, checkable milestones, progress bar, fast-track badges |
| **Contact** (`contact.html`) | Validated contact form, info cards, FAQ accordion |

**Career tracks:** Web Development · Data Science · UI/UX Design · Digital Marketing · AI & ML · Cloud & DevOps

### Highlights
- 🎯 **48 real assessment questions** (6 tracks × 8) with instant correct/incorrect feedback
- 📊 **SVG radar chart** + score ring + per-skill bars
- 🧠 **Adaptive roadmaps** — foundation phases are labelled "Fast-track" if your level is already above them
- 💾 **No backend needed** — assessment, theme and progress persist in `localStorage`
- 🌗 **Dark & light themes** with system-preference detection
- ⌨️ **Keyboard shortcuts** in the quiz (`A–D` to answer, `Enter` to continue)
- 📱 Fully responsive, accessible focus states, reduced-motion support
- ⚡ No frameworks, no build step for the static version

---

## 🚀 Run the static site (recommended)

No installation required.

```bash
# Option 1 — just open index.html in your browser
# (works, but localStorage + fonts behave best over HTTP)

# Option 2 — serve it locally
cd "C:\Users\saniy\Downloads\software"
python -m http.server 8777
# open http://127.0.0.1:8777
```

Deploy by uploading this folder to **Netlify, Vercel, GitHub Pages, or any static host**.

---

## ⚛️ Run the React version

A complete React + Vite + React Router implementation lives in `react-app/`.

```bash
cd react-app
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the production build
```

> Requires Node.js 18+.

The React version reuses the same design system and data, so both versions look and behave
identically. Use whichever fits your workflow.

---

## 🗂 Folder structure

```
software/
├─ index.html              # Home
├─ skills.html             # Assessment + skill library
├─ roadmap.html            # Career roadmaps
├─ contact.html            # Contact + FAQ
├─ assets/
│  ├─ css/styles.css       # Full design system (tokens, components, responsive)
│  └─ js/
│     ├─ data.js           # ⭐ All content: domains, questions, roadmaps, skills
│     ├─ app.js            # Theme, nav, reveal animations, counters, toasts
│     ├─ skills.js         # Assessment engine + library filters
│     ├─ roadmap.js        # Roadmap rendering + progress storage
│     └─ contact.js        # Form validation + FAQ
├─ react-app/              # React + Vite version of the same site
│  ├─ src/
│  │  ├─ lib/data.js       # Same data, exported as ES modules
│  │  ├─ pages/            # Home, Skills, Roadmap, Contact
│  │  ├─ components/       # Nav, Footer, Icons, Reveal/CountUp
│  │  └─ styles.css        # Shared design system
│  └─ vite.config.js
├─ tests/                  # Playwright suite (see 🧪 Automated tests)
│  ├─ pages/               # Page-object classes
│  ├─ e2e/                 # Browser specs — run against static AND react
│  └─ unit/data.spec.js    # Data-integrity checks
├─ RFP.md                  # Request for Proposal (scope, deliverables, criteria)
├─ REQUIREMENTS.md         # 75 functional + 9 non-functional requirements
├─ TEST-CASES.md           # 102 test cases + traceability matrix
├─ TEST-EVIDENCE.md        # execution evidence (163 passed, 0 skipped)
├─ evidence/               # junit.xml + cli-output.txt (per-test-case evidence)
├─ features/               # one requirement + test-case file per feature
├─ robots.txt              # Crawling rules
├─ sitemap.xml             # All four pages
├─ playwright.config.js
├─ firebase.json            # Hosting config (SPA rewrites, cleanUrls, headers)
├─ .firebaserc              # default project: software-4b622
└─ package.json            # Test scripts + Playwright/http-server dev deps
```

---

## ✏️ Customising content

All content is data-driven. Edit **`assets/js/data.js`** (and the copy in
`react-app/src/lib/data.js` if you use React):

```js
{
  id: 'web',
  name: 'Web Development',
  tagline: 'Build products people actually use',
  demand: 94,
  salary: '₹6–18 LPA',
  skills: [ ... ],      // name, demand, description, tags
  quiz: [ ... ],        // question, options, answer index, skill id
  roadmap: [ ... ],     // phase, title, duration, minLevel, items
  careers: [ ... ]
}
```

- **Add a track** → append an object to `DOMAINS`; navigation, filters, roadmap picker and
  home cards update automatically.
- **Change questions** → edit `quiz`. Keep two questions per skill id so scoring stays balanced.
- **Adjust difficulty logic** → `minLevel` (0 = beginner, 1 = intermediate, 2 = advanced).
- **Brand colours** → CSS variables at the top of `styles.css`.

### Storage keys
| Key | Contents |
|-----|----------|
| `skillgps.assessment.v1` | Last assessment (score, level, per-skill scores) |
| `skillgps.progress.v1` | Checked roadmap milestones per track |
| `skillgps.theme` | `dark` or `light` |

---

## 🚦 Before you launch

This is a complete, working product shell. A few things are intentionally sample content:

1. **Stats** on the home page (`12,400+ students`, `92% found clarity`) and the **testimonials** are
   placeholders — replace them with real data or remove them.
2. **Contact details** (`hello@skillgps.dev`, phone, location) are placeholders.
3. The **contact form** simulates sending. Wire it to Formspree, Web3Forms, or your own API.
4. Add your own **logo/OG image** and update `<meta>` tags per page.

---

## 📬 Contact form

The form validates entirely in the browser and then simulates a send. To make it real, point the
submit handler at your endpoint, or use [Formspree](https://formspree.io) /
[Web3Forms](https://web3forms.com) — no server required.

---

## 🧪 Automated tests (Playwright)

The project ships with an end-to-end suite that runs the **same specs against both
implementations** — the static pages and the React app — plus fast data-integrity checks.

```bash
npm install                  # once: installs @playwright/test + http-server
npx playwright install chromium

npx playwright test          # everything, via the Playwright CLI (writes all evidence)
npm run test                 # same run, via the npm script
npm run test:static          # browser tests against the static site only
npm run test:react           # browser tests against the React app only
npm run test:unit            # data model checks (Node, no browser)
npm run test:headed          # watch the browser while it runs
npm run test:ui              # interactive Playwright UI mode
npm run report               # open the last HTML report
```

The config boots both web servers automatically (`http-server` on `:8777`, Vite on `:5173`)
and reuses them if they are already running.

### What is covered

| Spec | Focus |
|------|-------|
| `navigation.spec.js` | Nav links + active state, theme persistence, sticky header, mobile menu |
| `home.spec.js` | Hero, animated stats, six track cards, deep links into the assessment |
| `skills.spec.js` | Quiz flow, keyboard shortcuts, scoring/levels, persistence, radar + bars, library search & filters |
| `roadmap.spec.js` | Phases, per-track progress, reset, reload persistence, level-aware fast-track badges |
| `contact.spec.js` | Field validation, success/reset, FAQ accordion, track prefill |
| `accessibility.spec.js` | Zero console errors, one `h1`, labels, ARIA states, keyboard-only run, responsive breakpoints |
| `seo.spec.js` | Unique titles/descriptions, Open Graph + Twitter cards, favicon, `robots.txt`, `sitemap.xml`, no broken assets |
| `unit/data.spec.js` | Domain/skill/quiz/roadmap shape, scoring thresholds, storage fallbacks |

### Structure

```
playwright.config.js          # static + react + unit projects, web servers, reporters
tests/
├─ paths.js                   # route table, storage keys, seeding helpers
├─ fixtures.js                # page-object fixtures + localStorage seeders
├─ pages/                     # Nav, HomePage, SkillsPage, RoadmapPage, ContactPage
├─ e2e/                       # browser specs (each runs twice: static + react)
└─ unit/data.spec.js          # data-integrity checks
```

Page objects absorb every difference between the two implementations, so specs never
hard-code `skills.html` vs `/skills` — they ask for `paths.skills`.

There is also a project skill (`.opencode/skills/skill-gps-e2e/`) documenting how to run
and extend the suite, including a full [test plan](.opencode/skills/skill-gps-e2e/references/test-plan.md).

### Evidence for every test case

Each run writes four independent records per test — no extra tooling:

| Output | What it contains |
|---|---|
| `evidence/junit.xml` | one `<testcase>` per test (describe + title, spec file, duration, screenshot attachment) |
| `test-results/<test-slug>/test-finished-1.png` | a screenshot of every browser test (152) |
| `playwright-report/index.html` | visual report — open with `npx playwright show-report` |
| `evidence/cli-output.txt` | the CLI log, one line per test with status and duration |

`unit` tests run in Node without a browser, so they get a JUnit entry but no
screenshot: 163 tests → 152 screenshots. Screenshots for every test are enabled
by `screenshot: 'on'` in `playwright.config.js`.

### Deployment

#### Firebase Hosting (React app)

Live: **<https://software-4b622.web.app>** · Firebase project `software-4b622`
(default site).

```bash
cd react-app
npx vite build            # writes react-app/dist
cd ..
firebase deploy --only hosting
```

`firebase.json` serves `react-app/dist` with:

- `cleanUrls` — `/skills` instead of `/skills.html`;
- an SPA rewrite `** → /index.html`, so deep links like `/roadmap` survive a
  hard refresh;
- `Cache-Control: public,max-age=31536000,immutable` for hashed `assets/*`;
- `Cache-Control: no-cache` for `index.html`;
- `X-Content-Type-Options: nosniff` and `Referrer-Policy`.

The canonical origin `https://software-4b622.web.app` lives in
`react-app/src/lib/meta.js` (override with `VITE_SITE_URL` at build time) and in
`react-app/public/robots.txt` + `sitemap.xml`. Update those three files when
moving to a custom domain.

#### GitHub Pages (static site)

Live: **<https://saniyag704-stack.github.io/software/>**

- Published from `main` at the repository root (Settings → Pages).
- `.nojekyll` at the root disables Jekyll so files are served verbatim.
- The static pages use relative links and asset paths, so the site works
  unchanged under the `/software/` sub-path.

### Requirements & test cases

- [`REQUIREMENTS.md`](REQUIREMENTS.md) — the complete requirement
  specification (FR-*/NFR-* with priorities and per-implementation notes).
- [`TEST-CASES.md`](TEST-CASES.md) — every test case (TC-*), its steps,
  expected result, priority, and the automated test that covers it, plus a
  [requirement → test case traceability matrix](TEST-CASES.md#13-traceability--requirement--test-cases)
  and the 8 cases that stay manual.
- [`features/`](features/README.md) — **one file per feature** (home,
  assessment, skill library, roadmap, contact, navigation, SEO, accessibility,
  data/storage, manual checks) containing that feature's requirements, test cases
  and implementation notes.
- [`RFP.md`](RFP.md) — Request for Proposal: scope, deliverables, acceptance
  criteria, evaluation weights, timeline and submission requirements.
- [`TEST-EVIDENCE.md`](TEST-EVIDENCE.md) — execution evidence for the latest run:
  environment, command, per-project and per-spec results, defects found, build
  sizes and the complete 163-line CLI log, built from
  [`evidence/junit.xml`](evidence/junit.xml) and
  [`evidence/cli-output.txt`](evidence/cli-output.txt).

> Also verified: React production build passes (`npx vite build` in `react-app/`).

---

Built with care — HTML, CSS, vanilla JS, and a React port. No tracking, no accounts, no noise.
