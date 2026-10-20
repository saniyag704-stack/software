# Skill GPS — Software Requirements Specification

| | |
|---|---|
| **Product** | Skill GPS — student skill assessment & career roadmap |
| **Version** | 1.0 |
| **Status** | Implemented — every requirement below is live and covered by tests |
| **Implementations** | (A) static multi-page site (HTML/CSS/vanilla JS, no build step)<br/>(B) React 18 + Vite + React Router SPA in `react-app/` |
| **Companion docs** | [TEST-CASES.md](./TEST-CASES.md) · [per-feature requirements & tests](./features/README.md) · [README.md](./README.md) · [Playwright test plan](./.opencode/skills/skill-gps-e2e/references/test-plan.md) |

Requirement IDs are stable and referenced from the test-case matrix, so every
requirement can be traced to at least one executable test.

---

## 1. Scope

Skill GPS helps a student answer three questions: *where am I now*, *where am I
going*, and *what do I do next*. It provides a scored skill assessment, a
level-aware career roadmap with progress tracking, a filterable skill library
and a contact route. All state lives in the browser; there is no backend and no
account system.

### In scope

- 6 career tracks with skills, quiz questions, roadmaps and career outcomes
- A scored assessment (8 questions/track) with per-skill breakdown
- Personalised roadmaps with milestone progress and "fast-track" hints
- A searchable/filterable skill library
- Contact form with validation + FAQ
- Theme switching, responsive layout, accessibility basics
- Metadata, robots and sitemap for discoverability (static **and** React)
- Two equivalent implementations: static and React

### Out of scope (v1)

- Real form delivery (currently simulated), accounts, payments, analytics
- Server-side rendering, a database, or any API
- Localisation (English-only copy, Indian salary context)

### Personas

| ID | Persona | Primary need |
|---|---|---|
| P1 | Final-year student, no direction | Find a track that fits and a starting point |
| P2 | Student with a rough idea | Confirm the level, skip what is already known |
| P3 | Self-learner / switcher | A structured, time-boxed plan and proof of progress |

---

## 2. Functional requirements

Priority: **P0** = must work, **P1** = important, **P2** = nice to have.
"Both" = the requirement is identical in the static site and the React app.

### 2.1 Application shell

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-SH-01 | Every page shares one header with the brand, four primary links (Home, Skills, Roadmap, Contact) and a "Start assessment" CTA | P0 | Both |
| FR-SH-02 | The header link for the current page is visually marked as active | P1 | Both |
| FR-SH-03 | The header becomes visually "scrolled" once the user scrolls down | P2 | Both |
| FR-SH-04 | Every page shares one footer with the current year, platform links and social icons | P1 | Both |
| FR-SH-05 | The theme can be toggled between dark and light, is applied to `<html data-theme>`, and persists across reloads and pages | P0 | Both |
| FR-SH-06 | On ≤880 px the primary links collapse behind a hamburger toggle exposing `aria-expanded` | P0 | Both |
| FR-SH-07 | The mobile menu closes when a link is tapped, when the route changes, and when the user taps outside it | P1 | Both |
| FR-SH-08 | Transient feedback (answer correct, phase complete, form sent, validation error) is shown as an auto-dismissing toast | P1 | Both |
| FR-SH-09 | Content sections reveal on scroll; counters animate to their target value | P2 | Both |
| FR-SH-10 | All animations are removed when the user prefers reduced motion | P1 | Both |

### 2.2 Home page

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-HM-01 | The hero states the value proposition and offers a primary CTA to the assessment and a secondary CTA to the roadmap | P0 | Both |
| FR-HM-02 | The hero shows a product mockup with four named skill bars | P2 | Both |
| FR-HM-03 | Four trust statistics render as real numbers (12,400+ students, 6 tracks, 24 skills, 92% found clarity) | P1 | Both |
| FR-HM-04 | All six career tracks are listed as cards with demand %, tagline, core-skill count and duration | P0 | Both |
| FR-HM-05 | Selecting a track card opens the assessment with that track preselected (`?domain=`) | P0 | Both |
| FR-HM-06 | Supporting sections explain the product: 3 feature cards, 4 "how it works" steps, 3 testimonials, closing CTA band | P1 | Both |

### 2.3 Assessment (Skills page)

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-AS-01 | All six tracks are listed; Web Development is selected by default | P0 | Both |
| FR-AS-02 | A `?domain=<id>` query parameter preselects that track | P0 | Both |
| FR-AS-03 | Each track has exactly 8 single-choice questions with 4 options each | P0 | Both |
| FR-AS-04 | Selecting a track restarts the quiz at question 1 and clears navigation state | P1 | Both |
| FR-AS-05 | "Next" is disabled until the current question is answered; "Back" is disabled on question 1 | P0 | Both |
| FR-AS-06 | Answering locks the options and immediately marks the chosen option correct/incorrect, revealing the correct answer | P0 | Both |
| FR-AS-07 | A progress bar and "Question *n* of 8" label reflect progress through the track | P1 | Both |
| FR-AS-08 | The quiz can be completed with the keyboard: `a`–`d` select an option, `Enter` advances/finishes | P1 | Both |
| FR-AS-09 | Scoring: each skill has 2 questions → per-skill score = correct/2 × 100; overall = round(correct/8 × 100) | P0 | Both |
| FR-AS-10 | Level thresholds: <40 Beginner, 40–69 Intermediate, ≥70 Advanced (also used for roadmap personalisation) | P0 | Both |
| FR-AS-11 | The result view shows the score ring, the level, correct count, date, a radar chart and four per-skill bars | P0 | Both |
| FR-AS-12 | The result is saved to `localStorage` and is restored (instead of a fresh quiz) on the next visit | P0 | Both |
| FR-AS-13 | "Retake test" clears the result view and restarts the quiz at question 1 | P1 | Both |
| FR-AS-14 | "Open my roadmap" links to the roadmap for the assessed track | P0 | Both |
| FR-AS-15 | "Try another track" returns to the track picker | P2 | Both |

### 2.4 Skill library (Skills page)

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-LB-01 | All 24 skills across the 6 tracks are listed as cards with demand, description and tags | P0 | Both |
| FR-LB-02 | A single-line filter chip set ("All skills" + 6 tracks) filters the list | P0 | Both |
| FR-LB-03 | Free-text search filters by skill name, description and tags | P0 | Both |
| FR-LB-04 | Search and chip filters combine (AND) | P1 | Both |
| FR-LB-05 | A live count of matching skills is shown; an empty result shows a dedicated empty state | P1 | Both |

### 2.5 Roadmap

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-RM-01 | Each track has a 5-phase roadmap with a title, duration and 4 milestones per phase | P0 | Both |
| FR-RM-02 | A `?domain=<id>` parameter or the track selector switches the roadmap shown | P0 | Both |
| FR-RM-03 | Milestones can be ticked; the percentage, bar, "n items done" and "n / 5 phases" badge update live | P0 | Both |
| FR-RM-04 | A phase is marked done when all its milestones are ticked, and completing one raises a toast | P1 | Both |
| FR-RM-05 | Progress is stored per track in `localStorage` and survives a reload | P0 | Both |
| FR-RM-06 | Progress for different tracks is independent | P1 | Both |
| FR-RM-07 | "Reset this roadmap" clears the current track's progress after a confirmation, and keeps it if the dialog is dismissed | P1 | Both |
| FR-RM-08 | Without an assessment the sidebar invites the user to take it (CTA to the same track) | P0 | Both |
| FR-RM-09 | With an assessment for *this* track the sidebar shows the level, score and a "Retake" link | P0 | Both |
| FR-RM-10 | Phases whose `minLevel` is below the assessed level are flagged "Fast-track — you likely know this" | P1 | Both |
| FR-RM-11 | An assessment for a *different* track never personalises the current roadmap | P1 | Both |

### 2.6 Contact

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-CT-01 | The page provides name, email, track, role-level, message fields plus a submit button | P0 | Both |
| FR-CT-02 | Submitting an empty form blocks, flags all required fields (`aria-invalid`, inline message) and shows an error toast; no success is claimed | P0 | Both |
| FR-CT-03 | Name (≥ 2 chars), email format and a minimum message length (10 chars) are validated | P0 | Both |
| FR-CT-04 | Inline errors clear as soon as the offending field is corrected | P1 | Both |
| FR-CT-05 | A valid submission shows a success toast, resets the form, and does not navigate | P0 | Both |
| FR-CT-06 | The track select is prefilled from the last assessment | P1 | Both |
| FR-CT-07 | Four contact info cards (email, phone, location, response time) are shown | P2 | Both |
| FR-CT-08 | A 5-item FAQ accordion opens/closes with ARIA state; opening one closes the previous | P1 | Both |
| FR-CT-09 | Sending is simulated in the browser — the endpoint is a deployment task, not a feature | P2 | Both |

### 2.7 Content & data model

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-DT-01 | All content (tracks, skills, questions, roadmaps) lives in a single data module (`assets/js/data.js`, mirrored as an ESM copy for React) | P0 | Both |
| FR-DT-02 | Each domain defines: id, name, short name, icon, colour, tagline, description, demand, salary, duration, 4 skills, 8 questions, 5 roadmap phases, careers | P0 | Both |
| FR-DT-03 | Each skill defines id, name, demand, description and ≥2 tags | P0 | Both |
| FR-DT-04 | Each question defines text, 4 options, a valid answer index and a `skill` that exists in that track | P0 | Both |
| FR-DT-05 | Each skill is covered by exactly 2 questions so per-skill scoring is balanced | P0 | Both |
| FR-DT-06 | Every roadmap phase defines title, duration, `minLevel` ∈ {0,1,2} and 4 milestones; levels never regress across phases and span 0→2 | P0 | Both |
| FR-DT-07 | Adding a track to the data module updates the home cards, track pickers, filters, roadmap and assessment without code changes | P1 | Both |
| FR-DT-08 | `getDomain()` falls back to the first track for unknown ids; `skillLevel()` implements the FR-AS-10 thresholds | P1 | Both |

### 2.8 Storage

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-ST-01 | `skillgps.assessment.v1` stores the last result (`domain`, `score`, `correct`, `total`, `level`, per-skill scores, `date`) | P0 | Both |
| FR-ST-02 | `skillgps.progress.v1` stores roadmap progress as `{ [trackId]: { 'phaseItem': true } }` | P0 | Both |
| FR-ST-03 | `skillgps.theme` stores `dark` \| `light` | P1 | Both |
| FR-ST-04 | Storage access never throws — blocked/full storage degrades to defaults | P1 | Both |

### 2.9 Discoverability & metadata

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-SEO-01 | Every page has a unique `<title>` containing "Skill GPS" | P0 | Both |
| FR-SEO-02 | Every page has a unique meta description (80–200 chars) | P0 | Both |
| FR-SEO-03 | Every page has complete Open Graph and Twitter card tags | P1 | Both |
| FR-SEO-04 | Every page declares `theme-color` and an inline SVG favicon | P2 | Both |
| FR-SEO-05 | `robots.txt` is served, allows crawling and points to the sitemap | P1 | Both |
| FR-SEO-06 | `sitemap.xml` is valid XML listing all four routes with absolute URLs and priorities | P1 | Both |
| FR-SEO-07 | No same-origin request on any page returns an error status (no missing assets) | P0 | Both |

---

## 3. Non-functional requirements

| ID | Requirement | Target | Verified by |
|---|---|---|---|
| NFR-01 | **Accessibility** — one `h1` per page, `lang="en"`, labelled form controls, ARIA state on toggle/tabs/accordion, visible focus ring, full keyboard operability | WCAG 2.1 AA subset | TC-A11Y-* |
| NFR-02 | **Responsive** — usable from 360 px to 1440 px+, no horizontal scrolling, grids collapse to one column | ≤880 px breakpoint | TC-RS-* |
| NFR-03 | **Performance** — no framework/build step for the static site; the React bundle stays under ~250 kB JS (~80 kB gzip) | build output | Manual (build log) |
| NFR-04 | **Privacy** — no accounts, no tracking, no third-party requests beyond Google Fonts | — | Manual (code review); TC-SEO-07 fails the build on any broken asset request |
| NFR-05 | **Maintainability** — content is data-driven (FR-DT-01) and the two implementations stay behaviourally identical | — | TC-* (same suite twice) |
| NFR-06 | **Quality gate** — the whole suite (static + React + data) is green on demand, and `npm run build` succeeds | 100 % pass | `npm run test` |
| NFR-07 | **Zero console errors** — no console error or uncaught exception on any page | 0 errors | TC-A11Y-01 |
| NFR-08 | **Test determinism** — the suite is repeatable: no timing flakiness under parallel execution | 3× repeat green | `--repeat-each=3` |
| NFR-09 | **Browser support** — latest Chrome/Edge/Firefox/Safari; the static site also works from the file system | — | Manual |

---

## 4. Assumptions & constraints

- Node.js 18+ is required only for the React app and the test suite.
- Salary figures are India-centric (₹ LPA) sample content; stats and testimonials are placeholders (see README "Before you launch").
- The contact form is the only simulated behaviour; everything else is real client-side logic.
- The static implementation is the reference; the React app must reach behavioural parity (NFR-05), including per-route metadata, `robots.txt` and `sitemap.xml`.
