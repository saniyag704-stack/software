---
name: Skill GPS end-to-end tests
description: Run, extend and debug the Playwright test suite for the Skill GPS site (static HTML/CSS/JS pages and the React app in ./react-app). Use when asked to run tests, add a test case, fix a failing test, verify a change across both implementations, or review test coverage.
---

# Skill GPS — Playwright test suite

One spec suite, two browser projects. Every spec in `tests/e2e/` runs against
**both** implementations:

- `static` → the plain HTML/CSS/JS pages served from the repo root
- `react`  → the Vite + React Router app in `react-app/`

Plus a `unit` project that checks the shared data model in Node.

## Commands

Run from the repository root:

```bash
npm run test              # everything (static + react + unit)
npm run test:static       # browser specs against the static site
npm run test:react        # browser specs against the React app
npm run test:unit         # data-integrity checks (fast, no browser)
npm run test:headed       # watch the browser while it runs
npm run test:ui           # Playwright's interactive UI mode
npm run report            # open the last HTML report
```

Target a single spec or test:

```bash
npx playwright test tests/e2e/roadmap.spec.js
npx playwright test --project=react -g "fast-track"
```

The config starts both web servers automatically (`http-server` on :8777,
Vite on :5173) and reuses them if they are already running.

## Layout

```text
playwright.config.js          projects, web servers, reporters
tests/
├── paths.js                  route table, storage keys, seeding helpers
├── fixtures.js               page-object fixtures + localStorage seeders
├── pages/                    page-object classes (Nav, Home, Skills, Roadmap, Contact)
├── e2e/                      browser specs (run twice: static + react)
│   ├── navigation.spec.js
│   ├── home.spec.js
│   ├── skills.spec.js
│   ├── roadmap.spec.js
│   ├── contact.spec.js
│   ├── accessibility.spec.js
│   └── seo.spec.js           metadata, robots.txt, sitemap (static + react)
└── unit/
    └── data.spec.js          validates DOMAINS / quiz / roadmaps
```

`REQUIREMENTS.md` (FR-*/NFR-*) and `TEST-CASES.md` (TC-* with the
requirement → test traceability matrix) describe the same coverage in
prose — update them when you add or rename a spec.

## Writing a test

Always import `test`/`expect` from `../fixtures.js`, never directly from
`@playwright/test`. The fixtures give you `paths` (route table), `home`,
`skills`, `roadmap`, `contact`, `nav` page objects, plus `seedAssessment`,
`seedProgress`, `clearStorage` and `consoleErrors`.

```js
import { test, expect, pageUrl } from '../fixtures.js';

test('a deep link preselects the track', async ({ page, skills, paths }) => {
  await skills.goto('cloud');
  await expect(skills.activeTrack).toContainText('Cloud & DevOps');
  await expect(page).toHaveURL(pageUrl(paths.skills));
});
```

Never hard-code `skills.html` or `/skills`: use `paths.skills` so the same test
runs on both implementations. If the two implementations genuinely differ,
adapt inside the page object, not inside the spec.

## Rules that keep the suite stable

1. **Reduced motion** is forced by the config, so reveal animations and count-up
   numbers resolve immediately. Do not wait for animations manually.
2. **Visually hidden controls** (roadmap checkboxes) must be clicked through
   their `.check-item` label — the `input` has zero size.
3. **Static pages** vary only by class name; if you add a new element to a page,
   give it a class that both implementations share, then add a locator to the
   relevant page object.
4. **Storage keys** must be referenced through `STORAGE` in `tests/paths.js`
   (`skillgps.assessment.v1`, `skillgps.progress.v1`).
5. `consoleErrors` is an auto-fixture: assert it is empty in any test that
   exercises a page for the first time.
6. Assert mobile-menu state through the page object (`nav.isMobileMenuOpen()`,
   `aria-expanded`) rather than by holding DOM nodes. The React nav closes the
   menu from a capture-phase document listener and swaps the hamburger icon, so
   the element that started a click can already be detached by the time the
   event finishes bubbling.

## Debugging

```bash
npx playwright test --debug                  # step through
npx playwright test --project=static --trace on
npx playwright show-trace test-results/<test>/trace.zip
```

Failures keep a screenshot, video and trace under `test-results/`.

## Deep dives

- `references/test-plan.md` — what each spec covers and why.
- `references/data-model.md` — the shapes the assertions rely on.
