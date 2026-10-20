# Skill GPS — Test Cases

Complete test-case catalogue for the Skill GPS product, mapped to the
[requirements](./REQUIREMENTS.md) and marked with the automated test that
verifies each one.

> Per-feature versions (requirement + test cases in one file, with implementation
> notes) live in [`features/`](./features/README.md). The latest real execution
> log is in [`TEST-EVIDENCE.md`](./TEST-EVIDENCE.md).

## 1. How to run

```bash
npm install
npx playwright install chromium

npm run test          # everything: static + react + unit  (163 passing tests, 0 skipped)
npm run test:static   # browser suite against the static site
npm run test:react    # browser suite against the React app
npm run test:unit     # data-integrity suite (Node, no browser)
npm run test:headed   # watch it run
npm run test:ui       # interactive mode
npm run report        # open the HTML report
```

Targeting one case:

```bash
npx playwright test tests/e2e/roadmap.spec.js
npx playwright test --project=react -g "fast-track"
npx playwright test --repeat-each=3            # determinism check (NFR-08)
```

## 2. Environments

| | Value |
|---|---|
| Static site | `http://127.0.0.1:8777` (served from the repo root) |
| React app | `http://127.0.0.1:5173` (Vite dev server) |
| Browser | Chromium (Chrome for Testing 156), `reducedMotion: reduce`, 1280×720 default; 1440×900 and 390×844 in responsive cases |
| Test data | Empty `localStorage` per test; assessment/progress seeded via fixtures |

## 3. Conventions

- **Every browser case runs twice** — once in the `static` project, once in the
  `react` project — because the two implementations must behave identically
  (NFR-05). Requirement IDs are per feature, so the same TC covers both.
- **Type**: `E2E` = Playwright browser test · `Unit` = Node data test · `Manual` = human check.
- **Priority**: `P0` release blocker · `P1` important · `P2` cosmetic/polish.
- **Automation** column: `<spec file> › <describe> › <test title>`. `—` means not automated (see §12).

| Automated suite | Cases | Runs in |
|---|---|---|
| `tests/e2e/navigation.spec.js` | 7 | static + react |
| `tests/e2e/home.spec.js` | 7 | static + react |
| `tests/e2e/skills.spec.js` | 17 | static + react |
| `tests/e2e/roadmap.spec.js` | 14 | static + react |
| `tests/e2e/contact.spec.js` | 12 | static + react |
| `tests/e2e/accessibility.spec.js` | 12 | static + react |
| `tests/e2e/seo.spec.js` | 7 | static + react |
| `tests/unit/data.spec.js` | 11 | Node |
| **Total** | **87 cases → 163 passing tests** (0 skipped) | |

---

## 4. Application shell — `TC-GL-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-GL-01 | Header exposes the four primary pages | Load home | 4 links in order: Home, Skills, Roadmap, Contact + Start assessment CTA visible | P0 | E2E | `navigation.spec.js › Navigation and site chrome › the four primary pages are linked in the header` |
| TC-GL-02 | Nav link navigation + active state | Click each nav link in turn | URL changes to the page, the link gets `active`, and the page's `h1` matches the page purpose | P0 | E2E | `navigation.spec.js › … › each nav link navigates and is marked active` |
| TC-GL-03 | Theme toggle + persistence | Read `data-theme`, toggle, reload, toggle back | Theme flips, survives reload, returns to the original | P0 | E2E | `navigation.spec.js › … › theme toggle flips the theme and persists across reloads` |
| TC-GL-04 | Sticky header scrolled state | Scroll to y=600 | `header.nav` gains `scrolled` | P2 | E2E | `navigation.spec.js › … › the sticky header gains a scrolled state` |
| TC-GL-05 | Footer year and links | Load home | Footer shows the current year, platform links and 3 social icons | P1 | E2E | `navigation.spec.js › … › footer shows the current year and platform links` |
| TC-GL-06 | Mobile menu opens, navigates, closes | Viewport 390 px, tap hamburger, tap "Skills" | `aria-expanded=true`, menu visible; after navigating the menu closes and `aria-expanded=false` | P0 | E2E | `navigation.spec.js › Mobile navigation › hamburger menu opens, navigates and closes` |
| TC-GL-07 | Tap outside closes the mobile menu | Open menu, tap at (200, 700) | Menu closes | P1 | E2E | `navigation.spec.js › Mobile navigation › tapping outside closes the mobile menu` |
| TC-GL-08 | Desktop navigation visible / hamburger hidden | Viewport 1440 px on home | `.nav-links` visible, `.nav-toggle` hidden | P1 | E2E | `accessibility.spec.js › Supported viewports › desktop shows the full navigation and a two-column roadmap` |
| TC-GL-09 | Reduced-motion support | Emulate `prefers-reduced-motion: reduce` | Transitions disabled, reveals visible immediately, counters already final | P1 | E2E | Implicit in every case (config sets `reducedMotion: reduce`) + TC-HM-03 |
| TC-GL-10 | Toast feedback appears and auto-dismisses | Trigger a toast (answer, phase complete, form error) | Toast with the expected message appears in `.toast-wrap` | P1 | E2E | Covered by TC-AS-06, TC-AS-07, TC-RM-04, TC-CT-02, TC-CT-05 |
| TC-GL-11 | Scroll-reveal sections | Load any page | All `.reveal` sections are visible (opacity 1) | P2 | E2E | Implicit in every case (visibility assertions on revealed sections) |
| TC-GL-12 | Logo/brand links home | Click "Skill GPS home" from Skills | Navigates to home | P2 | Manual | — |

## 5. Home page — `TC-HM-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-HM-01 | Hero value proposition + CTAs | Load home | `h1` states direction + skills; primary CTA "Take the free skill test" and secondary "Explore roadmaps" visible | P0 | E2E | `home.spec.js › Home page › hero communicates the value proposition with two calls to action` |
| TC-HM-02 | Product mockup bars | Load home | 4 skill bars labelled HTML & CSS, JavaScript, React, Backend & APIs | P2 | E2E | `home.spec.js › Home page › the dashboard mockup shows four skill bars` |
| TC-HM-03 | Trust statistics | Load home | 4 stats resolving to `12,400+`, `6`, `24`, `92%` (counters settle) | P1 | E2E | `home.spec.js › Home page › trust statistics resolve to real numbers` |
| TC-HM-04 | Six career tracks listed | Load home | 6 `.domain-card`s, one per track, each with a demand badge | P0 | E2E | `home.spec.js › Home page › all six career tracks are listed with demand badges` |
| TC-HM-05 | Track card deep-links to the assessment | Click "Data Science" card | URLs contains `domain=data`, Skills page opens with Data Science selected and titled | P0 | E2E | `home.spec.js › Home page › clicking a track opens the assessment for that track` |
| TC-HM-06 | Hero CTA starts the assessment | Click primary hero CTA | Skills page opens and the quiz panel is visible | P0 | E2E | `home.spec.js › Home page › the hero CTA starts the assessment` |
| TC-HM-07 | Supporting sections render | Load home | 3 feature cards, 4 steps, 3 testimonials, CTA band | P1 | E2E | `home.spec.js › Home page › the supporting sections are present` |

## 6. Assessment — `TC-AS-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-AS-01 | Six tracks, Web Development default | Open Skills | 6 track buttons, Web Development active, title "Web Development assessment", "Question 1 of 8", 4 options | P0 | E2E | `skills.spec.js › Skill assessment › lists every career track and starts on Web Development` |
| TC-AS-02 | `?domain=` preselects a track | Open `skills?domain=cloud` | Cloud & DevOps active and titled, question 1 of 8 | P0 | E2E | `skills.spec.js › … › a ?domain= deep link preselects that track` |
| TC-AS-03 | Switching track restarts the quiz | Answer Q1, go to Q2, pick "UI/UX Design" | Back to Question 1 of 8, UI/UX title, Back and Next disabled | P1 | E2E | `skills.spec.js › … › switching track restarts the quiz from question 1` |
| TC-AS-04 | Next gated on an answer | Open Skills | Back disabled (Q1), Next disabled; after choosing an option Next enabled and the progress label shows a % | P0 | E2E | `skills.spec.js › … › Next stays disabled until an option is chosen` |
| TC-AS-05 | Wrong answer feedback | Choose a wrong option | Chosen option marked `wrong`, correct one marked `correct`, options locked, "Not quite" toast | P0 | E2E | `skills.spec.js › … › answering gives immediate correct/incorrect feedback` |
| TC-AS-06 | Correct answer feedback | Choose the correct option | Option marked `correct`, no `wrong` option, success toast | P0 | E2E | `skills.spec.js › … › a correct answer is confirmed with a toast` |
| TC-AS-07 | Keyboard operation | Press `b`, then `Enter` | Answer registered from the keyboard, Enter advances to Question 2 of 8 | P1 | E2E | `skills.spec.js › … › keyboard shortcuts answer and advance the quiz` |
| TC-AS-08 | Progress bar advances | Answer Q1, then advance | Fill width > 0 and non-decreasing | P1 | E2E | `skills.spec.js › … › progress bar advances as questions are answered` |
| TC-AS-09 | Back returns to the previous question | Answer Q1, next, Back | Question 1 shown, Next enabled (answer remembered) | P1 | E2E | `skills.spec.js › … › the Back button returns to the previous question` |
| TC-AS-10 | Scoring + persistence | Complete all 8 questions (all option 1) | Score = correct/8×100, level badge matches thresholds, radar + 4 skill bars, payload in `localStorage`, same score after reload | P0 | E2E | `skills.spec.js › Assessment results › a zero-score run reports Beginner and stores the result` |
| TC-AS-11 | Perfect run → Advanced | Complete AI & ML answering the correct option | Score 100, level "Advanced" in pill and badge, all four bars at 100 % | P0 | E2E | `skills.spec.js › Assessment results › a perfect run reports Advanced with full skill bars` |
| TC-AS-12 | Retake | Finish a quiz, click "Retake test" | Result view gone, Question 1 of 8, Next disabled | P1 | E2E | `skills.spec.js › Assessment results › Retake test returns to the first question` |
| TC-AS-13 | Result → roadmap link | Finish, read the CTA href, click it | `href` contains `domain=<track>` and the roadmap opens for that track | P0 | E2E | `skills.spec.js › Assessment results › the result links to the matching roadmap` |
| TC-AS-14 | Whole quiz by keyboard only | Press `b`/`Enter` for all 8 questions | Result view reached without touching the mouse | P1 | E2E | `accessibility.spec.js › Accessibility and markup hygiene › the quiz can be driven with the keyboard only` |

## 7. Skill library — `TC-LB-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-LB-01 | All skills listed | Open Skills, scroll to library | 24 cards, toolbar badge "24 skills", 7 filter chips | P0 | E2E | `skills.spec.js › Skill library › renders every skill from all tracks` |
| TC-LB-02 | Search filters and clears | Search "python", then "zzzzz", then "" | Fewer matches (all Python-related), empty state for the miss, 24 again when cleared | P0 | E2E | `skills.spec.js › Skill library › search narrows the list and can be cleared` |
| TC-LB-03 | Chip filter | Click "Marketing", then "All skills" | 4 cards / badge "4 skills", then 24 | P0 | E2E | `skills.spec.js › Skill library › track chips filter the library` |
| TC-LB-04 | Search + chip combine | Chip "Data" then search "sql" | Exactly 1 card, containing "SQL" | P1 | E2E | `skills.spec.js › Skill library › search combines with the active filter` |
| TC-LB-05 | Tag/keyword search | Search a tag (e.g. "Foundation", "backend") | Skills matching by tag/description are returned | P2 | Manual | — (search covers name+desc+tags in code) |

## 8. Roadmap — `TC-RM-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-RM-01 | Five phases with detail | Open Roadmap | 5 phases with the documented web titles, 4 milestones each, a duration on phase 1 | P0 | E2E | `roadmap.spec.js › Career roadmap › shows five phases with realistic detail` |
| TC-RM-02 | `?domain=` selects a roadmap | Open `roadmap?domain=cloud` | Selector = cloud, first phase "Linux & the network", URL keeps `domain=cloud` | P0 | E2E | `roadmap.spec.js › Career roadmap › a ?domain= deep link selects that roadmap` |
| TC-RM-03 | No assessment → personalise CTA | Open Roadmap with empty storage | Assessment CTA visible, no level pill, no fast-track badges | P0 | E2E | `roadmap.spec.js › Career roadmap › without an assessment it invites you to personalise` |
| TC-RM-04 | Progress starts empty | Open Roadmap | 0 %, "0 / 5 phases", no phase done | P1 | E2E | `roadmap.spec.js › Career roadmap › progress starts empty` |
| TC-RM-05 | Milestone updates + stores | Tick phase 1 item 1, untick it | 5 % → "1 item done" → stored `web['0-0']=true`; untick returns to 0 % and `{}` | P0 | E2E | `roadmap.spec.js › Career roadmap › checking a milestone updates the counter and stores progress` |
| TC-RM-06 | Phase completion | Tick all 4 milestones of phase 1 | Phase gets `done`, badge "1 / 5 phases", 20 %, "Phase complete" toast | P1 | E2E | `roadmap.spec.js › Career roadmap › completing a phase marks it done and celebrates` |
| TC-RM-07 | Progress survives reload | Tick 2 milestones, reload | Both still checked, 10 % | P0 | E2E | `roadmap.spec.js › Career roadmap › progress survives a reload` |
| TC-RM-08 | Reset with confirmation | Complete phase 1, click "Reset this roadmap", accept | 0 %, no ticks, stored progress `{}` | P1 | E2E | `roadmap.spec.js › Career roadmap › reset clears the roadmap after confirmation` |
| TC-RM-09 | Reset dismissed | Tick a milestone, reset, dismiss the dialog | Progress untouched (5 %, tick keeps) | P1 | E2E | `roadmap.spec.js › Career roadmap › dismissing the reset dialog keeps progress` |
| TC-RM-10 | Per-track progress | Tick on web, switch to data, back to web | data shows 0 %, web still 5 % | P1 | E2E | `roadmap.spec.js › Career roadmap › progress is tracked per track` |
| TC-RM-11 | Advanced → fast-track | Seed an Advanced web result, open Roadmap | Level pill "Advanced", "Retake assessment" link, no assessment CTA, 4 fast-track badges, phase 1 explains "likely know the basics" | P1 | E2E | `roadmap.spec.js › Roadmap personalisation › an advanced result unlocks fast-track phases` |
| TC-RM-12 | Beginner → no fast-track | Seed a Beginner design result | Level pill "Beginner", 0 fast-track badges | P1 | E2E | `roadmap.spec.js › Roadmap personalisation › a beginner result shows no fast-track phases` |
| TC-RM-13 | Other track's result ignored | Seed a web Advanced result, open the marketing roadmap | No level pill, assessment CTA back, 0 fast-track badges | P1 | E2E | `roadmap.spec.js › Roadmap personalisation › an assessment for another track does not personalise this one` |
| TC-RM-14 | Sidebar assessment link | Open Roadmap, click the sidebar CTA | `href` contains `domain=web`, navigates to the Skills page | P1 | E2E | `roadmap.spec.js › Roadmap navigation › the assessment link points at the same track` |

## 9. Contact — `TC-CT-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-CT-01 | Form, info cards, FAQ render | Open Contact | Form fields visible, 4 info cards, 5 FAQ items, `h1` about finding direction | P0 | E2E | `contact.spec.js › Contact form › renders the form, contact details and FAQ` |
| TC-CT-02 | Empty submit blocked | Submit with no input | 3 invalid fields with messages, `aria-invalid=true` on name, error toast, no success toast | P0 | E2E | `contact.spec.js › Contact form › submitting an empty form blocks and highlights every required field` |
| TC-CT-03 | Invalid email rejected | Valid name + "not-an-email" + valid message, submit | Only the email field invalid | P0 | E2E | `contact.spec.js › Contact form › a malformed email is rejected` |
| TC-CT-04 | Short message rejected | Message "too short" | Message field invalid | P0 | E2E | `contact.spec.js › Contact form › a short message is rejected` |
| TC-CT-05 | Valid submit → success + reset | Fill all fields, submit | "Message sent" toast, no invalid fields, name/email/message cleared | P0 | E2E | `contact.spec.js › Contact form › a valid submission confirms and resets the form` |
| TC-CT-06 | Errors clear on correction | Submit empty, then type in name | Name field no longer invalid | P1 | E2E | `contact.spec.js › Contact form › inline errors clear as soon as the field is corrected` |
| TC-CT-07 | FAQ collapsed initially | Open Contact | `aria-expanded=false`, answer height 0 | P1 | E2E | `contact.spec.js › FAQ accordion › answers are collapsed until asked for` |
| TC-CT-08 | FAQ opens | Click question 1 | `aria-expanded=true`, item `.open`, answer text visible and height > 0 | P1 | E2E | `contact.spec.js › FAQ accordion › clicking a question opens it and reveals the answer` |
| TC-CT-09 | Single-open accordion | Open Q1, then Q3 | Q3 open, Q1 closed | P1 | E2E | `contact.spec.js › FAQ accordion › opening one question closes the previous one` |
| TC-CT-10 | Click open question closes it | Open Q2, click Q2 again | Closed, `aria-expanded=false` | P2 | E2E | `contact.spec.js › FAQ accordion › clicking an open question closes it again` |
| TC-CT-11 | Track prefilled from assessment | Seed a Digital Marketing result, open Contact | Track select = "Digital Marketing" | P1 | E2E | `contact.spec.js › Contact prefill › the track is preselected from your last assessment` |
| TC-CT-12 | No assessment → empty track | Clear storage, open Contact | Track select empty | P2 | E2E | `contact.spec.js › Contact prefill › no assessment means no preselected track` |
| TC-CT-13 | Real delivery | Submit a valid form with a configured endpoint | Message arrives in the inbox; button shows a sending state | P2 | Manual | — (FR-CT-09, deployment task) |

## 10. Discoverability — `TC-SEO-*` (both implementations)

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-SEO-01 | Unique titles | Load all 4 pages, collect titles | Each contains "Skill GPS"; 4 distinct values | P0 | E2E | `seo.spec.js › Metadata › every page has a unique title containing the brand` |
| TC-SEO-02 | Unique descriptions | Load all 4 pages, collect descriptions | Each 80–200 chars; 4 distinct values | P0 | E2E | `seo.spec.js › Metadata › every page has a unique, descriptive meta description` |
| TC-SEO-03 | Social cards | Load all 4 pages | `og:type`, `og:site_name`, `og:title`, `og:description`, `twitter:card`, `twitter:title`, `twitter:description` all present | P1 | E2E | `seo.spec.js › Metadata › every page ships complete Open Graph and Twitter cards` |
| TC-SEO-04 | Theme colour, favicon, viewport | Load all 4 pages | `theme-color` present, `rel=icon` is an inline SVG, viewport is `width=device-width` | P2 | E2E | `seo.spec.js › Metadata › every page declares a theme colour, an inline favicon and a responsive viewport` |
| TC-SEO-05 | robots.txt | GET `/robots.txt` | 200, `User-agent: *`, `Allow: /`, a `Sitemap:` URL | P1 | E2E | `seo.spec.js › Crawling files › robots.txt allows crawling and points at the sitemap` |
| TC-SEO-06 | sitemap.xml | GET `/sitemap.xml`, parse XML | 4 `<url>` entries, absolute `https://skillgps.dev/...` locs, priorities 0–1, every listed page returns 200 locally | P1 | E2E | `seo.spec.js › Crawling files › sitemap.xml lists every page that actually exists` |
| TC-SEO-07 | No broken assets | Load all 4 pages, watch same-origin responses | No 4xx/5xx responses (CSS/JS/icons all resolve) | P0 | E2E | `seo.spec.js › Crawling files › no same-origin request fails on any page` |

## 11. Accessibility, responsive & data — `TC-A11Y-*`, `TC-RS-*`, `TC-DT-*`

| ID | Title | Steps | Expected | Pri | Type | Automation |
|---|---|---|---|---|---|---|
| TC-A11Y-01 | Zero console errors | Visit all 4 pages | No console error, no uncaught exception | P0 | E2E | `accessibility.spec.js › … › every page loads without console errors` |
| TC-A11Y-02 | Language + single `h1` | Visit all 4 pages | `lang="en"`, exactly one `h1` | P0 | E2E | `accessibility.spec.js › … › each page declares a language and a single top-level heading` |
| TC-A11Y-03 | Title + description exist | Visit all 4 pages | Title matches /Skill GPS/, description > 40 chars | P1 | E2E | `accessibility.spec.js › … › every page exposes a title and a meta description` |
| TC-A11Y-04 | Form controls labelled | Open Contact, audit the DOM | Every input/select/textarea has a `<label for>` or ARIA name | P0 | E2E | `accessibility.spec.js › … › contact form fields are labelled` |
| TC-A11Y-05 | Accessible names & states | Home + Skills | Theme button has a name, mobile toggle exposes `aria-expanded`, track buttons are `role=tab` with `aria-selected` (5 false) | P1 | E2E | `accessibility.spec.js › … › interactive controls carry accessible names and states` |
| TC-A11Y-06 | Visible focus ring | Press Tab from the top of home | Focused element has a visible outline | P1 | E2E | `accessibility.spec.js › … › focus outlines are available for keyboard users` |
| TC-A11Y-07 | Full keyboard quiz | See TC-AS-14 | Result reached by keyboard | P1 | E2E | `accessibility.spec.js › … › the quiz can be driven with the keyboard only` |
| TC-RS-01 | No sideways scroll on mobile | 390×844 on all 4 pages | `scrollWidth == clientWidth` per page | P0 | E2E | `accessibility.spec.js › Small screens › no page scrolls sideways on a phone` |
| TC-RS-02 | Single-column stacking | 390×844 on home | Track grid is 1 column, all 6 cards present | P1 | E2E | `accessibility.spec.js › Small screens › content stacks into a single column` |
| TC-RS-03 | Decorative chips hidden | 390×844 on home | Floating hero chips hidden | P2 | E2E | `accessibility.spec.js › Small screens › floating hero chips are hidden so nothing overflows` |
| TC-RS-04 | Roadmap stacks on mobile | 390×844 on roadmap | Shell is 1 column, 5 phases still render | P1 | E2E | `accessibility.spec.js › Small screens › the roadmap stacks its sidebar above the timeline` |
| TC-DT-01 | Six unique domains | Unit | 6 domains with the expected ids | P0 | Unit | `data.spec.js › Domain definitions › there are six career tracks with unique ids` |
| TC-DT-02 | Complete domain fields | Unit | All 15 keys present; name/tagline/description lengths, colour, icon, demand 0–100, ≥2 careers | P0 | Unit | `data.spec.js › Domain definitions › every domain carries the full set of fields` |
| TC-DT-03 | Four skills per domain | Unit | 4 skills, unique ids, description > 30 chars, ≥2 tags, demand 0–100 | P0 | Unit | `data.spec.js › Domain definitions › every domain exposes exactly four core skills` |
| TC-DT-04 | Eight valid questions | Unit | 8 per domain, 4 unique options, answer index in range, `skill` exists | P0 | Unit | `data.spec.js › Assessment questions › every domain has eight well-formed questions` |
| TC-DT-05 | Two questions per skill | Unit | Each skill referenced exactly twice | P0 | Unit | `data.spec.js › Assessment questions › each skill is assessed by exactly two questions` |
| TC-DT-06 | Unique question text | Unit | No duplicate question inside a domain | P1 | Unit | `data.spec.js › Assessment questions › questions are unique inside a domain` |
| TC-DT-07 | Five valid phases | Unit | 5 phases, 4 milestones each, duration present, `minLevel` ∈ {0,1,2} | P0 | Unit | `data.spec.js › Roadmaps › every domain has a five-phase, level-aware roadmap` |
| TC-DT-08 | Level progression | Unit | `minLevel` never regresses; starts 0, ends 2 | P1 | Unit | `data.spec.js › Roadmaps › advancing phases never require a lower level than earlier ones` |
| TC-DT-09 | Level thresholds | Unit | 0/39→0, 40/69→1, 70/100→2 with matching labels | P0 | Unit | `data.spec.js › Helpers › skillLevel maps scores to the documented thresholds` |
| TC-DT-10 | `getDomain` fallback | Unit | Known id returned; unknown/undefined → first track | P1 | Unit | `data.spec.js › Helpers › getDomain falls back to the first track for unknown ids` |
| TC-DT-11 | Storage degrades safely | Unit | `read` returns the fallback, `write` never throws, empty progress `{}` | P1 | Unit | `data.spec.js › Helpers › Store degrades gracefully when storage is unavailable` |

## 12. Manual / non-automated cases — `TC-MAN-*`

These are deliberately manual: they need human judgement, real deployment, or
hardware/network conditions the suite does not control.

| ID | Title | Steps | Expected | Pri |
|---|---|---|---|---|
| TC-MAN-01 | Visual design review | Open all pages in dark and light themes | Spacing, type scale, gradients and contrast look intentional; no clipped text | P1 |
| TC-MAN-02 | Cross-browser pass | Chrome, Edge, Firefox, Safari on desktop + Android/iOS | Layout, theme, quiz and forms behave identically | P1 |
| TC-MAN-03 | Static site from the file system | Double-click `index.html` | Pages work (localStorage, assets, navigation) | P2 |
| TC-MAN-04 | Contact endpoint wiring | Point the submit handler at Formspree/Web3Forms | Real email arrives; success/error states handled | P2 |
| TC-MAN-05 | Lighthouse / Core Web Vitals | Run Lighthouse on the deployed site | Performance/Accessibility/Best-practices ≥ 90 | P2 |
| TC-MAN-06 | Deployment smoke test | Deploy static site to Netlify/Vercel/GitHub Pages, then React `dist/` | Both work, deep links resolve, `robots.txt` + `sitemap.xml` served | P1 |
| TC-MAN-07 | Real content swap | Replace placeholder stats/testimonials/contact details | Numbers are honest, no placeholder text remains | P1 |
| TC-MAN-08 | Screen-reader pass | VoiceOver/NVDA over home + quiz + roadmap | Landmarks, headings and live toasts are announced sensibly | P2 |

---

## 13. Traceability — requirement → test cases

| Requirement | Test cases |
|---|---|
| FR-SH-01 | TC-GL-01, TC-GL-12 |
| FR-SH-02 | TC-GL-02 |
| FR-SH-03 | TC-GL-04 |
| FR-SH-04 | TC-GL-05 |
| FR-SH-05 | TC-GL-03 |
| FR-SH-06 | TC-GL-06, TC-GL-08, TC-A11Y-05 |
| FR-SH-07 | TC-GL-06, TC-GL-07 |
| FR-SH-08 | TC-AS-05, TC-AS-06, TC-RM-06, TC-CT-02, TC-CT-05 (TC-GL-10 umbrella) |
| FR-SH-09 | TC-GL-11 |
| FR-SH-10 | TC-GL-09 |
| FR-HM-01 | TC-HM-01 |
| FR-HM-02 | TC-HM-02 |
| FR-HM-03 | TC-HM-03 |
| FR-HM-04 | TC-HM-04 |
| FR-HM-05 | TC-HM-05, TC-AS-02 |
| FR-HM-06 | TC-HM-06, TC-HM-07 |
| FR-AS-01 | TC-AS-01 |
| FR-AS-02 | TC-AS-02 |
| FR-AS-03 | TC-AS-01, TC-DT-04, TC-DT-05 |
| FR-AS-04 | TC-AS-03 |
| FR-AS-05 | TC-AS-04, TC-AS-09 |
| FR-AS-06 | TC-AS-05, TC-AS-06 |
| FR-AS-07 | TC-AS-08 |
| FR-AS-08 | TC-AS-07, TC-AS-14, TC-A11Y-07 |
| FR-AS-09 | TC-AS-10, TC-AS-11 |
| FR-AS-10 | TC-AS-10, TC-AS-11, TC-DT-09 |
| FR-AS-11 | TC-AS-10, TC-AS-11 |
| FR-AS-12 | TC-AS-10 |
| FR-AS-13 | TC-AS-12 |
| FR-AS-14 | TC-AS-13 |
| FR-AS-15 | TC-AS-03 |
| FR-LB-01 | TC-LB-01, TC-DT-03 |
| FR-LB-02 | TC-LB-03 |
| FR-LB-03 | TC-LB-02, TC-LB-05 |
| FR-LB-04 | TC-LB-04 |
| FR-LB-05 | TC-LB-02, TC-LB-03 |
| FR-RM-01 | TC-RM-01, TC-DT-07 |
| FR-RM-02 | TC-RM-02, TC-RM-10 |
| FR-RM-03 | TC-RM-04, TC-RM-05 |
| FR-RM-04 | TC-RM-06 |
| FR-RM-05 | TC-RM-05, TC-RM-07 |
| FR-RM-06 | TC-RM-10 |
| FR-RM-07 | TC-RM-08, TC-RM-09 |
| FR-RM-08 | TC-RM-03, TC-RM-14 |
| FR-RM-09 | TC-RM-11, TC-RM-12 |
| FR-RM-10 | TC-RM-11, TC-RM-12, TC-DT-08 |
| FR-RM-11 | TC-RM-13 |
| FR-CT-01 | TC-CT-01 |
| FR-CT-02 | TC-CT-02 |
| FR-CT-03 | TC-CT-03, TC-CT-04 |
| FR-CT-04 | TC-CT-06 |
| FR-CT-05 | TC-CT-05 |
| FR-CT-06 | TC-CT-11, TC-CT-12 |
| FR-CT-07 | TC-CT-01 |
| FR-CT-08 | TC-CT-07 … TC-CT-10 |
| FR-CT-09 | TC-CT-13, TC-MAN-04 |
| FR-DT-01 | TC-DT-01 … TC-DT-08 |
| FR-DT-02 | TC-DT-02 |
| FR-DT-03 | TC-DT-03 |
| FR-DT-04 | TC-DT-04 |
| FR-DT-05 | TC-DT-05 |
| FR-DT-06 | TC-DT-07, TC-DT-08 |
| FR-DT-07 | TC-MAN-07 (data-driven by construction; every TC reads from the data module) |
| FR-DT-08 | TC-DT-09, TC-DT-10 |
| FR-ST-01 | TC-AS-10 |
| FR-ST-02 | TC-RM-05, TC-RM-07, TC-RM-08 |
| FR-ST-03 | TC-GL-03 |
| FR-ST-04 | TC-DT-11 |
| FR-SEO-01 | TC-SEO-01 |
| FR-SEO-02 | TC-SEO-02 |
| FR-SEO-03 | TC-SEO-03 |
| FR-SEO-04 | TC-SEO-04 |
| FR-SEO-05 | TC-SEO-05 |
| FR-SEO-06 | TC-SEO-06 |
| FR-SEO-07 | TC-SEO-07, TC-A11Y-01 |
| NFR-01 | TC-A11Y-01 … TC-A11Y-07, TC-RS-01 |
| NFR-02 | TC-RS-01 … TC-RS-04, TC-GL-08 |
| NFR-03 | TC-MAN-05 (build size logged by `npm run build`) |
| NFR-04 | TC-MAN-05, TC-SEO-07 (no third-party failures counted) |
| NFR-05 | Every E2E case runs in both the `static` and `react` projects |
| NFR-06 | `npm run test` + `npm run build` |
| NFR-07 | TC-A11Y-01 |
| NFR-08 | `npx playwright test --repeat-each=3` |
| NFR-09 | TC-MAN-02, TC-MAN-03 |

---

## 14. Coverage summary

| Layer | Covered |
|---|---|
| Functional requirements | 73 / 75 automated. The two exceptions are FR-CT-09 (real form delivery) and FR-DT-07 (extensibility), both covered by manual cases as noted in §12 |
| Non-functional requirements | 6 / 9 automated (NFR-01, 02, 05, 06, 07, 08). NFR-03 (bundle size) and NFR-09 (browser support) are checked from the build log / on real browsers, and NFR-04 (privacy) is a code-review check |
| Browser test cases | 76 automated cases, each executed against both the static **and** React implementations (152 browser tests) + 11 unit tests = **163 passing, 0 skipped** |
| Data test cases | 11 automated in Node |
| Manual test cases | 8 (design, cross-browser, file-system, endpoint, Lighthouse, deployment, content, screen reader) |
