# Request for Proposal (RFP) — Skill GPS

| | |
|---|---|
| **RFP reference** | RFP-SGPS-2026-01 |
| **Issued** | 20 October 2026 |
| **Issued by** | Skill GPS product team |
| **Contact** | hello@skillgps.dev |
| **Questions due** | 27 October 2026, 18:00 IST |
| **Proposals due** | 3 November 2026, 18:00 IST |
| **Award decision** | 6 November 2026 |
| **Target delivery** | 6 weeks from award |
| **Budget band** | ₹1,50,000 – ₹2,50,000 (fixed price, inclusive of taxes) |

---

## 1. Introduction

Skill GPS is a career-guidance product for students. It answers three
questions — *where am I now*, *where am I going*, and *what do I do next* — with
a scored skill assessment, a level-aware career roadmap and a searchable skill
library.

This RFP invites proposals to **design, build, test and hand over** the Skill
GPS web product in two equivalent implementations:

1. a **static multi-page site** (HTML, CSS, vanilla JavaScript, no build step);
2. a **React 18 + Vite single-page app** with the same behaviour.

Both implementations must pass the same automated acceptance suite.

## 2. Background and problem statement

Students choose career tracks on hearsay. They cannot tell which skills they
already have, which ones employers actually ask for, or what to learn in which
order. Existing platforms either sell courses or dump a 200-hour playlist on the
learner.

The product must give an honest, fast read of the learner's current level, then
a realistic, time-boxed path forward — with progress the student can see and
resume.

## 3. Objectives

| ID | Objective | Success measure |
|---|---|---|
| O1 | Let a student measure their real level in under 3 minutes | Assessment completable in ≤ 8 questions per track |
| O2 | Convert the result into a personalised plan | Roadmap adapts to the assessed level |
| O3 | Make progress tangible and resumable | Milestone progress persists per track |
| O4 | Keep the product usable without an account or backend | All state in the browser; no API calls |
| O5 | Ship quality that is provable | 100 % of acceptance tests pass, evidence attached |

## 4. Scope of work

### 4.1 In scope

- Six career tracks: Web Development, Data Science, UI/UX Design, Digital
  Marketing, AI & Machine Learning, Cloud & DevOps.
- Four core skills per track, eight single-choice questions per track
  (**48 questions** in total), two questions per skill.
- Scored result view: score ring, level (Beginner / Intermediate / Advanced),
  correct count, radar chart, four per-skill bars, date.
- Five-phase roadmap per track with four milestones per phase
  (**120 milestones** in total), live percentage, phase completion, reset, and
  per-track persistence.
- Level-aware personalisation: phases below the assessed level are flagged as
  fast-track.
- Skill library: 24 skill cards with demand, description and tags; track chips,
  free-text search, live count and an empty state.
- Contact page: validated form (name, email, track, role, message), success and
  error states, four contact-info cards, five-item FAQ accordion.
- Global shell: header, footer, active nav state, dark/light theme with
  persistence, mobile menu, toasts, scroll reveal and counters.
- Responsive layout from 360 px to 1440 px+, keyboard operability, reduced-motion
  support, zero console errors.
- Per-page metadata, Open Graph and Twitter cards, `robots.txt`, `sitemap.xml`.
- The two implementations above, plus the automated test suite and documentation.

### 4.2 Out of scope (v1)

- Server-side rendering, a database, accounts, payments, analytics.
- Real form delivery (the endpoint is wired by the client at deployment).
- Localisation (English copy, India-centric salary context).
- Native mobile apps.
- Content authoring tools or a CMS.

## 5. Functional requirements

The complete, testable specification is in [`REQUIREMENTS.md`](./REQUIREMENTS.md).
Bidders must respond to every requirement ID.

| Area | Requirement IDs | Count |
|---|---|---|
| Application shell (nav, footer, theme, mobile menu, toasts) | FR-SH-01 … FR-SH-10 | 10 |
| Home page (hero, stats, track cards, supporting sections) | FR-HM-01 … FR-HM-06 | 6 |
| Assessment (quiz, feedback, scoring, results, persistence) | FR-AS-01 … FR-AS-15 | 15 |
| Skill library (cards, chips, search, count, empty state) | FR-LB-01 … FR-LB-05 | 5 |
| Roadmap (phases, milestones, progress, reset, personalisation) | FR-RM-01 … FR-RM-11 | 11 |
| Contact (validation, success/error, prefill, FAQ) | FR-CT-01 … FR-CT-09 | 9 |
| Content model (tracks, skills, questions, phases) | FR-DT-01 … FR-DT-08 | 8 |
| Storage (assessment, progress, theme, safe degradation) | FR-ST-01 … FR-ST-04 | 4 |
| Discoverability (titles, descriptions, social cards, robots, sitemap) | FR-SEO-01 … FR-SEO-07 | 7 |
| **Total functional requirements** | | **75** |

## 6. Non-functional requirements

| ID | Requirement | Target |
|---|---|---|
| NFR-01 | Accessibility | WCAG 2.1 AA subset: one `h1` per page, labels, ARIA state, visible focus, full keyboard use |
| NFR-02 | Responsive | 360 px – 1440 px+, no horizontal scrolling, single-column grids ≤ 880 px |
| NFR-03 | Performance | Static site: no build step. React: ≤ 250 kB JS (~80 kB gzip) |
| NFR-04 | Privacy | No accounts, no tracking, no third-party calls beyond Google Fonts |
| NFR-05 | Parity | Both implementations behave identically and pass the same suite |
| NFR-06 | Quality gate | Full suite green on demand; production build succeeds |
| NFR-07 | Console hygiene | Zero console errors / uncaught exceptions on every page |
| NFR-08 | Test determinism | Suite repeatable in parallel with no flakes |
| NFR-09 | Browser support | Latest Chrome, Edge, Firefox, Safari; static site also opens from the file system |

## 7. Deliverables

| # | Deliverable | Format | Acceptance |
|---|---|---|---|
| D1 | Static site (4 pages + assets) | Source in repository | Serves from a plain HTTP server; all P0 requirements pass |
| D2 | React application | Source + production build | `npm run build` succeeds; parity suite passes |
| D3 | Playwright test suite | Config, page objects, specs | `npm run test` green; 163 tests, 0 skipped |
| D4 | Requirements specification | `REQUIREMENTS.md` | Every requirement has an ID, priority and implementation note |
| D5 | Test-case catalogue | `TEST-CASES.md` + `features/*.md` | Every requirement traces to at least one test case |
| D6 | Test execution evidence | `TEST-EVIDENCE.md` + JUnit XML + per-test screenshots + HTML report | Real execution log, environment, counts and defects |
| D7 | Project documentation | `README.md` + project skill | A new developer can run, test and extend the project |
| D8 | Handover session | 60-minute walkthrough | Client team can run and modify the product unaided |

## 8. Technical constraints and standards

- **Static implementation:** semantic HTML5, one stylesheet per design system,
  vanilla ES2020 JavaScript, no runtime framework, no build step.
- **React implementation:** React 18, Vite 5, React Router 6, plain CSS.
- **Data:** a single content module per implementation (JSON-like JS objects);
  adding a track must not require component changes.
- **State:** `localStorage` only (`skillgps.assessment.v1`,
  `skillgps.progress.v1`, `skillgps.theme`); access must never throw.
- **Code quality:** no dead code, no console noise, consistent naming, comments
  where behaviour is non-obvious.
- **Testing:** Playwright with class-based page objects; specs must not hard-code
  implementation-specific URLs; `reducedMotion: 'reduce'` for determinism.
- **Assets:** no external images required; fonts may be loaded from Google Fonts.

## 9. Acceptance criteria

1. All 75 functional requirements are implemented and traceable.
2. All 163 automated tests pass with zero failures, skips or retries, against
   **both** implementations.
3. The React production build succeeds and stays within the performance budget.
4. No console errors on any page; no horizontal overflow at 360 px.
5. The evidence pack (`TEST-EVIDENCE.md`, `evidence/junit.xml`, per-test
   screenshots, HTML report) matches the delivered code.
6. Manual checks in [`features/10-manual-checks.md`](./features/10-manual-checks.md)
   are signed off by the client.

## 10. Evaluation criteria

| Criterion | Weight | What we look for |
|---|---|---|
| Requirements coverage | 30 % | Clear response to every FR, with gaps called out honestly |
| Technical approach | 25 % | Data-driven content, clean state handling, parity strategy |
| Quality & testing | 20 % | Real test strategy, page objects, evidence, defect handling |
| UX & visual design | 15 % | Clear hierarchy, responsive behaviour, accessible components |
| Timeline & delivery plan | 10 % | Realistic 6-week plan with checkpoints |

Proposals scoring below 60 % overall will not be shortlisted.

## 11. Timeline

| Week | Milestone | Exit criteria |
|---|---|---|
| 1 | Discovery & design system | Tokens, typography, components, page wireframes approved |
| 2 | Static site: shell + home | Header/footer/theme/mobile menu work; home content complete |
| 3 | Assessment + skill library | Quiz, scoring, results, search and filters work |
| 4 | Roadmap + contact | Progress tracking, personalisation, validation, FAQ |
| 5 | React parity + test suite | Both implementations pass the shared suite |
| 6 | Evidence, docs, handover | Evidence pack, README, walkthrough, sign-off |

Weekly 30-minute demo. Any slip of more than three working days must be
escalated in writing.

## 12. Proposal submission requirements

Submit a single PDF (max 15 pages) containing:

1. **Understanding of the brief** — the problem and the three user questions.
2. **Proposed approach** — architecture for both implementations, data model,
   parity strategy, state handling.
3. **Requirement response matrix** — every FR/NFR ID with `Comply` /
   `Partially comply` / `Do not comply` and one line of evidence.
4. **Test strategy** — what is automated, what stays manual, how evidence is
   produced.
5. **Timeline** — week-by-week plan mapped to the milestones in §11.
6. **Team** — roles, availability and relevant work samples.
7. **Commercials** — fixed price, payment milestones, exclusions, validity
   (60 days).

Questions must be submitted in writing to hello@skillgps.dev by the deadline in
the header. Answers are shared with all bidders.

## 13. Terms and conditions

- **IP:** all source code, designs, tests and documentation transfer to the
  client on final payment.
- **Confidentiality:** the brief, data model and roadmap content are confidential
  until launch.
- **Warranty:** 30 days of defect fixing after acceptance, at no extra cost.
- **Content:** the client supplies final statistics, testimonials, contact
  details and the production domain; the bidder must not invent metrics.
- **Third-party costs:** hosting, domain and any paid services are the client's.
- **Evaluation:** the client may request a short technical interview before award
  and is not obliged to accept the lowest bid.

## 14. Glossary

| Term | Meaning |
|---|---|
| Track / domain | One of the six career paths (e.g. Data Science) |
| Milestone | One checkbox item inside a roadmap phase (4 per phase) |
| Fast-track | A phase flagged because the assessed level already exceeds its `minLevel` |
| Parity | Identical behaviour between the static site and the React app |
| Evidence pack | Execution report + raw results + HTML report |

---

### Annex A — Requirement detail

[`REQUIREMENTS.md`](./REQUIREMENTS.md) · [per-feature breakdown](./features/README.md)

### Annex B — Test catalogue and evidence

[`TEST-CASES.md`](./TEST-CASES.md) · [`TEST-EVIDENCE.md`](./TEST-EVIDENCE.md)
