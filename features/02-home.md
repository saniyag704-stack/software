# 2. Home page

| | |
|---|---|
| **Covers** | Hero, product mockup, trust statistics, six career-track cards, feature/step/testimonial sections, closing CTA |
| **Static** | `index.html` · `assets/js/data.js` (DOMAINS) · `assets/js/app.js` (counters, reveal) |
| **React** | `react-app/src/pages/Home.jsx` · `components/Reveal.jsx` · `lib/data.js` |
| **Requirements** | FR-HM-01 … FR-HM-06 |
| **Test cases** | TC-HM-01 … TC-HM-07 |
| **Automated in** | `tests/e2e/home.spec.js` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-HM-01 | The hero states the value proposition and offers a primary CTA to the assessment and a secondary CTA to the roadmap | P0 | Both |
| FR-HM-02 | The hero shows a product mockup with four named skill bars | P2 | Both |
| FR-HM-03 | Four trust statistics render as real numbers: `12,400+` students, `6` tracks, `24` skills, `92%` found clarity | P1 | Both |
| FR-HM-04 | All six career tracks are listed as cards with demand %, tagline, core-skill count and duration | P0 | Both |
| FR-HM-05 | Selecting a track card opens the assessment with that track preselected (`?domain=` on the static site, `/skills?domain=` in React) | P0 | Both |
| FR-HM-06 | Supporting sections explain the product: 3 feature cards, 4 “how it works” steps, 3 testimonials, closing CTA band | P1 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-HM-01 | Hero value proposition + CTAs | Load home | `h1` states direction + skills; primary “Take the free skill test” and secondary “Explore roadmaps” visible | P0 | `home.spec.js` › `hero communicates the value proposition with two calls to action` |
| TC-HM-02 | Product mockup bars | Load home | 4 bars labelled HTML & CSS, JavaScript, React, Backend & APIs | P2 | `home.spec.js` › `the dashboard mockup shows four skill bars` |
| TC-HM-03 | Trust statistics | Load home | 4 stats settle at `12,400+`, `6`, `24`, `92%` | P1 | `home.spec.js` › `trust statistics resolve to real numbers` |
| TC-HM-04 | Six career tracks listed | Load home | 6 domain cards, one per track, each with a demand badge | P0 | `home.spec.js` › `all six career tracks are listed with demand badges` |
| TC-HM-05 | Track card deep-links to the assessment | Click the Data Science card | URL carries `domain=data`, the Skills page opens with Data Science selected and titled | P0 | `home.spec.js` › `clicking a track opens the assessment for that track` |
| TC-HM-06 | Hero CTA starts the assessment | Click the primary hero CTA | Skills page opens and the quiz panel is visible | P0 | `home.spec.js` › `the hero CTA starts the assessment` |
| TC-HM-07 | Supporting sections render | Load home | 3 feature cards, 4 steps, 3 testimonials, CTA band | P1 | `home.spec.js` › `the supporting sections are present` |

Related manual checks: **TC-MAN-01** (visual review, both themes) and **TC-MAN-07**
(replace the placeholder stats/testimonials before launch).

## Implementation notes

- Cards are generated from `DOMAINS` (static) / `DOMAINS.map` (React), so adding
  a track to the data module adds a card automatically (FR-DT-07).
- Counter elements carry `data-count`; the value is only written once the
  IntersectionObserver fires, so tests assert the settled text.
- `?domain=` is read by the Skills page, not the home page — the card is a plain
  link, which keeps it shareable and back-button friendly.
- **Placeholders:** `12,400+ students` and `92% found clarity` are illustrative,
  not measured. Replace before launch.
