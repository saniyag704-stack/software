# Skill GPS — Test Execution Evidence

| | |
|---|---|
| **Document** | TEST-EVIDENCE.md |
| **Version** | 2.0 (per-test-case evidence) |
| **Executed (UTC)** | 2026-10-20 06:26:45 → 06:29:13 |
| **Duration** | 147.79 s of test time · 2.5 min wall clock |
| **Environment** | win32 10.0.26200 · Node 22.14.0 |
| **Test framework** | Playwright 1.64.1 · Chromium revision 1248 |
| **Implementations under test** | static site (`http://127.0.0.1:8777`) + React app (`http://127.0.0.1:5173`) |
| **Command** | `npx playwright test` (**Playwright CLI**, no npm wrapper, no helper script) |
| **Overall result** | **163 passed · 0 failed · 0 skipped · 0 flaky** |
| **JUnit evidence** | [`evidence/junit.xml`](./evidence/junit.xml) — 163 `<testcase>`, 0 failures, 0 errors, 0 skipped |
| **CLI log** | [`evidence/cli-output.txt`](./evidence/cli-output.txt) — 163 result lines |
| **HTML report** | [`playwright-report/index.html`](./playwright-report/index.html) |
| **Screenshots** | `test-results/<test-slug>/test-finished-1.png` — **152** images (one per browser test) |

This is the execution evidence for [`REQUIREMENTS.md`](./REQUIREMENTS.md),
[`TEST-CASES.md`](./TEST-CASES.md) and the per-feature files in
[`features/`](./features/README.md).

---

## 1. What this proves

1. All **163** automated tests were executed in one CLI run against **both**
   implementations (`static`, `react`) plus the Node data suite (`unit`).
2. Nothing failed, was skipped, timed out or had to be retried.
3. Every single test case has its **own** evidence record — a JUnit
   `<testcase>` element, a screenshot (browser tests) and an entry in the HTML
   report. Nothing here is a hand-written status.

## 2. Command executed

```bash
npx playwright test
```

Run directly through the Playwright CLI. Playwright starts both web servers
itself (`http-server` on `:8777`, Vite on `:5173`) and reuses them if they are
already running.

The evidence outputs are configured in `playwright.config.js`:

```js
reporter: [
  ['list'],                                                     // per-test line on stdout
  ['html', { open: 'never', outputFolder: 'playwright-report' }], // per-test visual report
  ['junit', { outputFile: 'evidence/junit.xml' }]                // one <testcase> per test
],
use: {
  trace: 'retain-on-failure',
  screenshot: 'on',            // a screenshot for EVERY test, not only failures
  video: 'retain-on-failure',
  reducedMotion: 'reduce',
  actionTimeout: 10_000
}
```

## 3. Summary

| Metric | Value |
|---|---|
| Tests executed | **163** |
| Passed | **163** (100 %) |
| Failed | **0** |
| Skipped | **0** |
| Flaky | **0** |
| Retries used | **0** |
| Screenshots captured | **152** |
| JUnit `<testcase>` elements | **163** |

## 4. Evidence for every test case

Each test produces four independent records, all from the same run:

| # | Evidence | File / location | Coverage | One entry per test? |
|---|---|---|---|---|
| 1 | **JUnit XML** | `evidence/junit.xml` | 163 test cases | ✅ 163 `<testcase>` elements |
| 2 | **Screenshot** | `test-results/<test-slug>/test-finished-1.png` | 152 browser tests | ✅ 152 folders, 1 PNG each |
| 3 | **HTML report** | `playwright-report/index.html` | 163 test cases | ✅ expandable row per test |
| 4 | **CLI log** | `evidence/cli-output.txt` + §7 below | 163 test cases | ✅ 1 line per test |

**Why 152 screenshots and not 163?** The 11 `unit` tests run in Node with no
browser (data-model checks), so there is no page to photograph. 163 − 11 = 152.
JUnit still has all 163 cases.

**A JUnit entry, verbatim** (this is how each test links to its screenshot):

```xml
<testcase name="Accessibility and markup hygiene › every page loads without console errors"
          classname="e2e\accessibility.spec.js" time="13.93">
  <system-out><![CDATA[
    [[ATTACHMENT|..\test-results\accessibility-Accessibilit-1a864-oads-without-console-errors-static\test-finished-1.png]]
  ]]></system-out>
</testcase>
```

So for any test case you can open:

- `evidence/junit.xml` → find the `<testcase>` (name = describe + test title,
  `classname` = spec file, `time` = duration in seconds),
- `test-results/accessibility-Accessibilit-1a864-oads-without-console-errors-static/test-finished-1.png`
  → the screenshot of that exact test,
- `playwright-report/index.html` → the same test with its screenshot inline.

**Example folders that exist right now:**

```
test-results/accessibility-Accessibilit-024ca-vailable-for-keyboard-users-static/test-finished-1.png
test-results/accessibility-Accessibilit-024ca-vailable-for-keyboard-users-react/test-finished-1.png
test-results/accessibility-Accessibilit-1a864-oads-without-console-errors-static/test-finished-1.png
```

## 5. Results by project

| Project | What it runs against | Tests | Passed | Failed | Screenshots |
|---|---|---|---|---|---|
| `static` | static multi-page site | 76 | 76 | 0 | 76 |
| `react` | React + Vite SPA | 76 | 76 | 0 | 76 |
| `unit` | data module (Node, no browser) | 11 | 11 | 0 | 0 |
| **Total** | | **163** | **163** | **0** | **152** |

## 6. Results by spec

| Spec | Tests | Passed | Failed | Projects |
|---|---|---|---|---|
| `tests/e2e/accessibility.spec.js` | 24 | 24 | 0 | static + react |
| `tests/e2e/contact.spec.js` | 24 | 24 | 0 | static + react |
| `tests/e2e/home.spec.js` | 14 | 14 | 0 | static + react |
| `tests/e2e/navigation.spec.js` | 14 | 14 | 0 | static + react |
| `tests/e2e/roadmap.spec.js` | 28 | 28 | 0 | static + react |
| `tests/e2e/seo.spec.js` | 14 | 14 | 0 | static + react |
| `tests/e2e/skills.spec.js` | 34 | 34 | 0 | static + react |
| `tests/unit/data.spec.js` | 11 | 11 | 0 | unit |
| **Total** | **163** | **163** | **0** | |

## 7. Full CLI execution log (all 163 test cases)

Verbatim output of `npx playwright test`. Same content as
[`evidence/cli-output.txt`](./evidence/cli-output.txt). `ok` = passed,
`ok N` = test number, duration in brackets.

```text
[WebServer] (node:16968) [DEP0066] DeprecationWarning: OutgoingMessage.prototype._headers is deprecated
[WebServer] (Use `node --trace-deprecation ...` to show where the warning was created)

Running 163 tests using 6 workers

  ok   4 [static] › tests\e2e\accessibility.spec.js:30:3 › Accessibility and markup hygiene › contact form fields are labelled (8.2s)
  ok   3 [static] › tests\e2e\accessibility.spec.js:21:3 › Accessibility and markup hygiene › every page exposes a title and a meta description (8.7s)
  ok   2 [static] › tests\e2e\accessibility.spec.js:4:3 › Accessibility and markup hygiene › every page loads without console errors (8.8s)
  ok   5 [static] › tests\e2e\accessibility.spec.js:47:3 › Accessibility and markup hygiene › interactive controls carry accessible names and states (8.9s)
  ok   1 [static] › tests\e2e\accessibility.spec.js:12:3 › Accessibility and markup hygiene › each page declares a language and a single top-level heading (9.4s)
  ok   6 [static] › tests\e2e\accessibility.spec.js:62:3 › Accessibility and markup hygiene › the quiz can be driven with the keyboard only (9.0s)
  ok   7 [static] › tests\e2e\accessibility.spec.js:75:3 › Accessibility and markup hygiene › focus outlines are available for keyboard users (3.7s)
  ok   9 [static] › tests\e2e\accessibility.spec.js:114:3 › Small screens › no page scrolls sideways on a phone (3.8s)
  ok   8 [static] › tests\e2e\accessibility.spec.js:100:3 › Supported viewports › desktop shows the full navigation and a two-column roadmap (4.0s)
  ok  10 [static] › tests\e2e\accessibility.spec.js:130:3 › Small screens › content stacks into a single column (3.8s)
  ok  12 [static] › tests\e2e\accessibility.spec.js:143:3 › Small screens › the roadmap stacks its sidebar above the timeline (3.3s)
  ok  11 [static] › tests\e2e\accessibility.spec.js:138:3 › Small screens › floating hero chips are hidden so nothing overflows (3.5s)
  ok  13 [static] › tests\e2e\contact.spec.js:4:3 › Contact form › renders the form, contact details and FAQ (3.3s)
  ok  15 [static] › tests\e2e\contact.spec.js:27:3 › Contact form › a malformed email is rejected (4.1s)
  ok  14 [static] › tests\e2e\contact.spec.js:16:3 › Contact form › submitting an empty form blocks and highlights every required field (4.4s)
  ok  17 [static] › tests\e2e\contact.spec.js:61:3 › Contact form › inline errors clear as soon as the field is corrected (4.4s)
  ok  18 [static] › tests\e2e\contact.spec.js:44:3 › Contact form › a valid submission confirms and resets the form (4.9s)
  ok  16 [static] › tests\e2e\contact.spec.js:36:3 › Contact form › a short message is rejected (5.7s)
  ok  19 [static] › tests\e2e\contact.spec.js:72:3 › FAQ accordion › answers are collapsed until asked for (3.3s)
  ok  20 [static] › tests\e2e\contact.spec.js:81:3 › FAQ accordion › clicking a question opens it and reveals the answer (3.0s)
  ok  22 [static] › tests\e2e\contact.spec.js:105:3 › FAQ accordion › clicking an open question closes it again (3.0s)
  ok  21 [static] › tests\e2e\contact.spec.js:94:3 › FAQ accordion › opening one question closes the previous one (3.4s)
  ok  23 [static] › tests\e2e\contact.spec.js:118:3 › Contact prefill › the track is preselected from your last assessment (3.7s)
  ok  24 [static] › tests\e2e\contact.spec.js:125:3 › Contact prefill › no assessment means no preselected track (3.1s)
  ok  25 [static] › tests\e2e\home.spec.js:5:3 › Home page › hero communicates the value proposition with two calls to action (3.2s)
  ok  26 [static] › tests\e2e\home.spec.js:15:3 › Home page › the dashboard mockup shows four skill bars (3.3s)
  ok  27 [static] › tests\e2e\home.spec.js:25:3 › Home page › trust statistics resolve to real numbers (3.2s)
  ok  28 [static] › tests\e2e\home.spec.js:38:3 › Home page › all six career tracks are listed with demand badges (3.3s)
  ok  29 [static] › tests\e2e\home.spec.js:48:3 › Home page › the supporting sections are present (3.4s)
  ok  30 [static] › tests\e2e\home.spec.js:57:3 › Home page › clicking a track opens the assessment for that track (3.3s)
  ok  31 [static] › tests\e2e\home.spec.js:67:3 › Home page › the hero CTA starts the assessment (3.3s)
  ok  32 [static] › tests\e2e\navigation.spec.js:4:3 › Navigation and site chrome › the four primary pages are linked in the header (3.3s)
  ok  34 [static] › tests\e2e\navigation.spec.js:30:3 › Navigation and site chrome › theme toggle flips the theme and persists across reloads (3.6s)
  ok  33 [static] › tests\e2e\navigation.spec.js:12:3 › Navigation and site chrome › each nav link navigates and is marked active (4.2s)
  ok  35 [static] › tests\e2e\navigation.spec.js:47:3 › Navigation and site chrome › the sticky header gains a scrolled state (3.3s)
  ok  36 [static] › tests\e2e\navigation.spec.js:55:3 › Navigation and site chrome › footer shows the current year and platform links (3.3s)
  ok  37 [static] › tests\e2e\navigation.spec.js:68:3 › Mobile navigation › hamburger menu opens, navigates and closes (4.2s)
  ok  38 [static] › tests\e2e\navigation.spec.js:85:3 › Mobile navigation › tapping outside closes the mobile menu (3.3s)
  ok  39 [static] › tests\e2e\roadmap.spec.js:4:3 › Career roadmap › shows five phases with realistic detail (3.1s)
  ok  40 [static] › tests\e2e\roadmap.spec.js:19:3 › Career roadmap › a ?domain= deep link selects that roadmap (3.0s)
  ok  42 [static] › tests\e2e\roadmap.spec.js:35:3 › Career roadmap › progress starts empty (3.1s)
  ok  43 [static] › tests\e2e\roadmap.spec.js:44:3 › Career roadmap › checking a milestone updates the counter and stores progress (3.4s)
  ok  44 [static] › tests\e2e\roadmap.spec.js:59:3 › Career roadmap › completing a phase marks it done and celebrates (3.3s)
  ok  45 [static] › tests\e2e\roadmap.spec.js:70:3 › Career roadmap › progress survives a reload (3.2s)
  ok  41 [static] › tests\e2e\roadmap.spec.js:27:3 › Career roadmap › without an assessment it invites you to personalise (5.7s)
  ok  47 [static] › tests\e2e\roadmap.spec.js:96:3 › Career roadmap › dismissing the reset dialog keeps progress (3.2s)
  ok  46 [static] › tests\e2e\roadmap.spec.js:82:3 › Career roadmap › reset clears the roadmap after confirmation (3.9s)
  ok  48 [static] › tests\e2e\roadmap.spec.js:107:3 › Career roadmap › progress is tracked per track (3.4s)
  ok  49 [static] › tests\e2e\roadmap.spec.js:122:3 › Roadmap personalisation › an advanced result unlocks fast-track phases (3.3s)
  ok  51 [static] › tests\e2e\roadmap.spec.js:141:3 › Roadmap personalisation › an assessment for another track does not personalise this one (3.8s)
  ok  50 [static] › tests\e2e\roadmap.spec.js:133:3 › Roadmap personalisation › a beginner result shows no fast-track phases (4.1s)
  ok  52 [static] › tests\e2e\roadmap.spec.js:152:3 › Roadmap navigation › the assessment link points at the same track (3.9s)
  ok  53 [static] › tests\e2e\seo.spec.js:36:3 › Metadata › every page has a unique title containing the brand (3.9s)
  ok  54 [static] › tests\e2e\seo.spec.js:52:3 › Metadata › every page has a unique, descriptive meta description (4.3s)
  ok  57 [static] › tests\e2e\seo.spec.js:109:3 › Crawling files › robots.txt allows crawling and points at the sitemap (2.9s)
  ok  55 [static] › tests\e2e\seo.spec.js:69:3 › Metadata › every page ships complete Open Graph and Twitter cards (4.5s)
  ok  56 [static] › tests\e2e\seo.spec.js:92:3 › Metadata › every page declares a theme colour, an inline favicon and a responsive viewport (4.6s)
  ok  58 [static] › tests\e2e\seo.spec.js:121:3 › Crawling files › sitemap.xml lists every page that actually exists (4.0s)
  ok  59 [static] › tests\e2e\seo.spec.js:156:3 › Crawling files › no same-origin request fails on any page (4.1s)
  ok  60 [static] › tests\e2e\skills.spec.js:5:3 › Skill assessment › lists every career track and starts on Web Development (3.6s)
  ok  61 [static] › tests\e2e\skills.spec.js:15:3 › Skill assessment › a ?domain= deep link preselects that track (3.5s)
  ok  62 [static] › tests\e2e\skills.spec.js:23:3 › Skill assessment › switching track restarts the quiz from question 1 (3.9s)
  ok  63 [static] › tests\e2e\skills.spec.js:36:3 › Skill assessment › Next stays disabled until an option is chosen (3.6s)
  ok  64 [static] › tests\e2e\skills.spec.js:47:3 › Skill assessment › answering gives immediate correct/incorrect feedback (3.6s)
  ok  65 [static] › tests\e2e\skills.spec.js:61:3 › Skill assessment › a correct answer is confirmed with a toast (3.6s)
  ok  66 [static] › tests\e2e\skills.spec.js:71:3 › Skill assessment › keyboard shortcuts answer and advance the quiz (3.5s)
  ok  67 [static] › tests\e2e\skills.spec.js:84:3 › Skill assessment › progress bar advances as questions are answered (3.6s)
  ok  68 [static] › tests\e2e\skills.spec.js:97:3 › Skill assessment › the Back button returns to the previous question (3.6s)
  ok  73 [static] › tests\e2e\skills.spec.js:172:3 › Skill library › renders every skill from all tracks (4.6s)
  ok  69 [static] › tests\e2e\skills.spec.js:110:3 › Assessment results › a zero-score run reports Beginner and stores the result (7.2s)
  ok  74 [static] › tests\e2e\skills.spec.js:180:3 › Skill library › search narrows the list and can be cleared (5.3s)
  ok  70 [static] › tests\e2e\skills.spec.js:131:3 › Assessment results › a perfect run reports Advanced with full skill bars (7.6s)
  ok  71 [static] › tests\e2e\skills.spec.js:148:3 › Assessment results › Retake test returns to the first question (7.8s)
  ok  72 [static] › tests\e2e\skills.spec.js:159:3 › Assessment results › the result links to the matching roadmap (8.0s)
  ok  75 [static] › tests\e2e\skills.spec.js:197:3 › Skill library › track chips filter the library (3.6s)
  ok  76 [static] › tests\e2e\skills.spec.js:208:3 › Skill library › search combines with the active filter (3.6s)
  ok  77 [react] › tests\e2e\accessibility.spec.js:4:3 › Accessibility and markup hygiene › every page loads without console errors (8.4s)
  ok  78 [react] › tests\e2e\accessibility.spec.js:12:3 › Accessibility and markup hygiene › each page declares a language and a single top-level heading (8.6s)
  ok  79 [react] › tests\e2e\accessibility.spec.js:21:3 › Accessibility and markup hygiene › every page exposes a title and a meta description (8.8s)
  ok  80 [react] › tests\e2e\accessibility.spec.js:30:3 › Accessibility and markup hygiene › contact form fields are labelled (8.1s)
  ok  83 [react] › tests\e2e\accessibility.spec.js:75:3 › Accessibility and markup hygiene › focus outlines are available for keyboard users (4.8s)
  ok  81 [react] › tests\e2e\accessibility.spec.js:47:3 › Accessibility and markup hygiene › interactive controls carry accessible names and states (9.4s)
  ok  84 [react] › tests\e2e\accessibility.spec.js:100:3 › Supported viewports › desktop shows the full navigation and a two-column roadmap (5.0s)
  ok  82 [react] › tests\e2e\accessibility.spec.js:62:3 › Accessibility and markup hygiene › the quiz can be driven with the keyboard only (10.4s)
  ok  86 [react] › tests\e2e\accessibility.spec.js:130:3 › Small screens › content stacks into a single column (4.7s)
  ok  85 [react] › tests\e2e\accessibility.spec.js:114:3 › Small screens › no page scrolls sideways on a phone (5.0s)
  ok  87 [react] › tests\e2e\accessibility.spec.js:138:3 › Small screens › floating hero chips are hidden so nothing overflows (3.8s)
  ok  89 [react] › tests\e2e\contact.spec.js:4:3 › Contact form › renders the form, contact details and FAQ (3.6s)
  ok  88 [react] › tests\e2e\accessibility.spec.js:143:3 › Small screens › the roadmap stacks its sidebar above the timeline (5.0s)
  ok  90 [react] › tests\e2e\contact.spec.js:16:3 › Contact form › submitting an empty form blocks and highlights every required field (4.2s)
  ok  92 [react] › tests\e2e\contact.spec.js:36:3 › Contact form › a short message is rejected (4.2s)
  ok  91 [react] › tests\e2e\contact.spec.js:27:3 › Contact form › a malformed email is rejected (4.5s)
  ok  93 [react] › tests\e2e\contact.spec.js:44:3 › Contact form › a valid submission confirms and resets the form (5.3s)
  ok  94 [react] › tests\e2e\contact.spec.js:61:3 › Contact form › inline errors clear as soon as the field is corrected (4.3s)
  ok  95 [react] › tests\e2e\contact.spec.js:72:3 › FAQ accordion › answers are collapsed until asked for (4.0s)
  ok  96 [react] › tests\e2e\contact.spec.js:81:3 › FAQ accordion › clicking a question opens it and reveals the answer (3.8s)
  ok  97 [react] › tests\e2e\contact.spec.js:94:3 › FAQ accordion › opening one question closes the previous one (3.7s)
  ok  98 [react] › tests\e2e\contact.spec.js:105:3 › FAQ accordion › clicking an open question closes it again (4.1s)
  ok  99 [react] › tests\e2e\contact.spec.js:118:3 › Contact prefill › the track is preselected from your last assessment (3.8s)
  ok 100 [react] › tests\e2e\contact.spec.js:125:3 › Contact prefill › no assessment means no preselected track (3.8s)
  ok 101 [react] › tests\e2e\home.spec.js:5:3 › Home page › hero communicates the value proposition with two calls to action (4.1s)
  ok 102 [react] › tests\e2e\home.spec.js:15:3 › Home page › the dashboard mockup shows four skill bars (3.8s)
  ok 103 [react] › tests\e2e\home.spec.js:25:3 › Home page › trust statistics resolve to real numbers (3.6s)
  ok 104 [react] › tests\e2e\home.spec.js:38:3 › Home page › all six career tracks are listed with demand badges (4.0s)
  ok 106 [react] › tests\e2e\home.spec.js:57:3 › Home page › clicking a track opens the assessment for that track (3.6s)
  ok 107 [react] › tests\e2e\home.spec.js:67:3 › Home page › the hero CTA starts the assessment (3.5s)
  ok 105 [react] › tests\e2e\home.spec.js:48:3 › Home page › the supporting sections are present (4.8s)
  ok 108 [react] › tests\e2e\navigation.spec.js:4:3 › Navigation and site chrome › the four primary pages are linked in the header (4.2s)
  ok 110 [react] › tests\e2e\navigation.spec.js:30:3 › Navigation and site chrome › theme toggle flips the theme and persists across reloads (3.9s)
  ok 109 [react] › tests\e2e\navigation.spec.js:12:3 › Navigation and site chrome › each nav link navigates and is marked active (5.0s)
  ok 111 [react] › tests\e2e\navigation.spec.js:47:3 › Navigation and site chrome › the sticky header gains a scrolled state (3.7s)
  ok 112 [react] › tests\e2e\navigation.spec.js:55:3 › Navigation and site chrome › footer shows the current year and platform links (3.5s)
  ok 113 [react] › tests\e2e\navigation.spec.js:68:3 › Mobile navigation › hamburger menu opens, navigates and closes (3.8s)
  ok 114 [react] › tests\e2e\navigation.spec.js:85:3 › Mobile navigation › tapping outside closes the mobile menu (3.8s)
  ok 116 [react] › tests\e2e\roadmap.spec.js:19:3 › Career roadmap › a ?domain= deep link selects that roadmap (3.4s)
  ok 115 [react] › tests\e2e\roadmap.spec.js:4:3 › Career roadmap › shows five phases with realistic detail (3.5s)
  ok 117 [react] › tests\e2e\roadmap.spec.js:27:3 › Career roadmap › without an assessment it invites you to personalise (3.3s)
  ok 118 [react] › tests\e2e\roadmap.spec.js:35:3 › Career roadmap › progress starts empty (3.3s)
  ok 119 [react] › tests\e2e\roadmap.spec.js:44:3 › Career roadmap › checking a milestone updates the counter and stores progress (3.7s)
  ok 120 [react] › tests\e2e\roadmap.spec.js:59:3 › Career roadmap › completing a phase marks it done and celebrates (3.9s)
  ok 121 [react] › tests\e2e\roadmap.spec.js:70:3 › Career roadmap › progress survives a reload (4.2s)
  ok 122 [react] › tests\e2e\roadmap.spec.js:82:3 › Career roadmap › reset clears the roadmap after confirmation (4.3s)
  ok 123 [react] › tests\e2e\roadmap.spec.js:96:3 › Career roadmap › dismissing the reset dialog keeps progress (4.0s)
  ok 124 [react] › tests\e2e\roadmap.spec.js:107:3 › Career roadmap › progress is tracked per track (4.0s)
  ok 125 [react] › tests\e2e\roadmap.spec.js:122:3 › Roadmap personalisation › an advanced result unlocks fast-track phases (4.2s)
  ok 126 [react] › tests\e2e\roadmap.spec.js:133:3 › Roadmap personalisation › a beginner result shows no fast-track phases (4.4s)
  ok 127 [react] › tests\e2e\roadmap.spec.js:141:3 › Roadmap personalisation › an assessment for another track does not personalise this one (4.5s)
  ok 128 [react] › tests\e2e\roadmap.spec.js:152:3 › Roadmap navigation › the assessment link points at the same track (4.5s)
  ok 129 [react] › tests\e2e\seo.spec.js:36:3 › Metadata › every page has a unique title containing the brand (4.9s)
  ok 130 [react] › tests\e2e\seo.spec.js:52:3 › Metadata › every page has a unique, descriptive meta description (5.0s)
  ok 133 [react] › tests\e2e\seo.spec.js:109:3 › Crawling files › robots.txt allows crawling and points at the sitemap (2.7s)
  ok 131 [react] › tests\e2e\seo.spec.js:69:3 › Metadata › every page ships complete Open Graph and Twitter cards (5.7s)
  ok 132 [react] › tests\e2e\seo.spec.js:92:3 › Metadata › every page declares a theme colour, an inline favicon and a responsive viewport (5.5s)
  ok 134 [react] › tests\e2e\seo.spec.js:121:3 › Crawling files › sitemap.xml lists every page that actually exists (4.7s)
  ok 136 [react] › tests\e2e\skills.spec.js:5:3 › Skill assessment › lists every career track and starts on Web Development (4.1s)
  ok 135 [react] › tests\e2e\seo.spec.js:156:3 › Crawling files › no same-origin request fails on any page (4.9s)
  ok 137 [react] › tests\e2e\skills.spec.js:15:3 › Skill assessment › a ?domain= deep link preselects that track (4.1s)
  ok 138 [react] › tests\e2e\skills.spec.js:23:3 › Skill assessment › switching track restarts the quiz from question 1 (4.1s)
  ok 139 [react] › tests\e2e\skills.spec.js:36:3 › Skill assessment › Next stays disabled until an option is chosen (4.3s)
  ok 140 [react] › tests\e2e\skills.spec.js:47:3 › Skill assessment › answering gives immediate correct/incorrect feedback (4.0s)
  ok 141 [react] › tests\e2e\skills.spec.js:61:3 › Skill assessment › a correct answer is confirmed with a toast (4.0s)
  ok 142 [react] › tests\e2e\skills.spec.js:71:3 › Skill assessment › keyboard shortcuts answer and advance the quiz (3.9s)
  ok 143 [react] › tests\e2e\skills.spec.js:84:3 › Skill assessment › progress bar advances as questions are answered (3.9s)
  ok 144 [react] › tests\e2e\skills.spec.js:97:3 › Skill assessment › the Back button returns to the previous question (5.1s)
  ok 149 [react] › tests\e2e\skills.spec.js:172:3 › Skill library › renders every skill from all tracks (4.5s)
  ok 146 [react] › tests\e2e\skills.spec.js:131:3 › Assessment results › a perfect run reports Advanced with full skill bars (8.1s)
  ok 145 [react] › tests\e2e\skills.spec.js:110:3 › Assessment results › a zero-score run reports Beginner and stores the result (8.2s)
  ok 147 [react] › tests\e2e\skills.spec.js:148:3 › Assessment results › Retake test returns to the first question (8.3s)
  ok 148 [react] › tests\e2e\skills.spec.js:159:3 › Assessment results › the result links to the matching roadmap (8.4s)
  ok 150 [react] › tests\e2e\skills.spec.js:180:3 › Skill library › search narrows the list and can be cleared (5.6s)
  ok 151 [react] › tests\e2e\skills.spec.js:197:3 › Skill library › track chips filter the library (4.3s)
  ok 153 [unit] › tests\unit\data.spec.js:25:3 › Domain definitions › there are six career tracks with unique ids (9ms)
  ok 154 [unit] › tests\unit\data.spec.js:102:3 › Assessment questions › questions are unique inside a domain (11ms)
  ok 155 [unit] › tests\unit\data.spec.js:111:3 › Roadmaps › every domain has a five-phase, level-aware roadmap (158ms)
  ok 156 [unit] › tests\unit\data.spec.js:129:3 › Roadmaps › advancing phases never require a lower level than earlier ones (6ms)
  ok 157 [unit] › tests\unit\data.spec.js:141:3 › Helpers › skillLevel maps scores to the documented thresholds (5ms)
  ok 158 [unit] › tests\unit\data.spec.js:154:3 › Helpers › getDomain falls back to the first track for unknown ids (1ms)
  ok 159 [unit] › tests\unit\data.spec.js:160:3 › Helpers › Store degrades gracefully when storage is unavailable (2ms)
  ok 152 [react] › tests\e2e\skills.spec.js:208:3 › Skill library › search combines with the active filter (4.2s)
  ok 160 [unit] › tests\unit\data.spec.js:32:3 › Domain definitions › every domain carries the full set of fields (74ms)
  ok 161 [unit] › tests\unit\data.spec.js:49:3 › Domain definitions › every domain exposes exactly four core skills (71ms)
  ok 162 [unit] › tests\unit\data.spec.js:69:3 › Assessment questions › every domain has eight well-formed questions (161ms)
  ok 163 [unit] › tests\unit\data.spec.js:93:3 › Assessment questions › each skill is assessed by exactly two questions (19ms)

  163 passed (2.5m)
```

> The two `[WebServer]` lines are Node deprecation warnings from the static
> server, not test failures. The exit code of the run was **0**.

## 8. Defects found and fixed during this work

| # | Defect | Found by | Fix | Re-verified |
|---|---|---|---|---|
| D1 | `twitter:title` / `twitter:description` missing on skills, roadmap and contact pages (broken X/Twitter previews) | `seo.spec.js` | Added both tags to the three static pages | ✅ SEO 14/14 |
| D2 | Skills page advertised “36 real questions” while the app ships 48 (6 tracks × 8) | `seo.spec.js` | Corrected the OG description to 48 | ✅ SEO 14/14 |
| D3 | React mobile menu did not close on an outside tap | `navigation.spec.js` | Capture-phase `composedPath()` listener (React detaches the clicked icon node mid-dispatch) | ✅ 163/163 |
| D4 | FAQ height assertions flaked: `max-height` was sampled mid-transition | `contact.spec.js` | `transition: none !important` under `prefers-reduced-motion` + `expect.poll` | ✅ 163/163 |
| D5 | Focus-outline test flaked when the first Tab focused nothing | `accessibility.spec.js` | Retry Tab until a real element is focused | ✅ 163/163 |
| D6 | Keyboard quiz raced the React effect that attaches the handler | `skills.spec.js` | Retrying page-object helpers (`answerByKeyboard`, `advanceByKeyboard`, `finishByKeyboard`) | ✅ 163/163 |
| D7 | 7 SEO tests were skipped for React (no per-route metadata, no robots/sitemap) | suite report | Added `usePageMeta()`, OG defaults and `public/robots.txt` + `public/sitemap.xml` | ✅ 0 skipped |

## 9. Determinism evidence

```bash
npx playwright test tests/e2e/seo.spec.js --repeat-each=3
```

Result (same CLI, saved to [`evidence/cli-repeat-output.txt`](./evidence/cli-repeat-output.txt)):

```text
  42 passed (1.8m)
```

14 SEO cases × 3 repeats = 42, with 0 flaky. The whole suite also runs with
`reducedMotion: 'reduce'` (forced in `playwright.config.js`) so animation timing
cannot affect assertions.

## 10. Build evidence

```bash
cd react-app
npx vite build
```

```text
✓ 45 modules transformed.
dist/index.html                 1.92 kB │ gzip:  0.83 kB
dist/assets/index-PU2vKTyk.css 32.99 kB │ gzip:  7.61 kB
dist/assets/index-CvKReztk.js 240.66 kB │ gzip: 78.10 kB
✓ built in 738ms
```

Exit code 0. The build also copies `robots.txt` and `sitemap.xml` from
`react-app/public/` into `dist/`.

## 11. Requirement coverage

| Coverage | Result |
|---|---|
| Functional requirements traced to a test case | **75 / 75** |
| Non-functional requirements documented | **9 / 9** |
| Test-case IDs traced to a feature file | **102 / 102** |

Per-feature evidence: [`features/README.md`](./features/README.md).

## 12. How to reproduce

```bash
npm install
npx playwright install chromium

npx playwright test                 # 163 tests, 0 skipped, writes all evidence
npx playwright show-report          # opens playwright-report/index.html
```

Evidence is regenerated by every run:

| Output | Written by |
|---|---|
| `evidence/junit.xml` | `junit` reporter (config) |
| `test-results/<slug>/test-finished-1.png` | `screenshot: 'on'` (config) |
| `playwright-report/index.html` | `html` reporter (config) |
| `evidence/cli-output.txt` | CLI stdout redirect |

## 13. Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Prepared by (QA) | | | |
| Reviewed by | | | |
| Approved by | | | |

> Every result above comes from the Playwright CLI run recorded in
> `evidence/junit.xml` and `evidence/cli-output.txt` — 163 test cases,
> 0 failures, 0 skipped, 0 flaky.
