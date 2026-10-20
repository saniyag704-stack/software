# 8. Accessibility & responsive layout

| | |
|---|---|
| **Covers** | Console errors, landmarks/headings, labels, ARIA state, keyboard operability, visible focus, mobile/desktop breakpoints, horizontal overflow |
| **Static** | all four HTML pages · `assets/css/styles.css` |
| **React** | `react-app/src/styles.css` · page components |
| **Requirements** | NFR-01, NFR-02, NFR-07 (+ FR-SH-06, FR-SH-10) |
| **Test cases** | TC-A11Y-01 … TC-A11Y-07, TC-RS-01 … TC-RS-04 |
| **Automated in** | `tests/e2e/accessibility.spec.js` |

## Requirements

| ID | Requirement | Target | Impl |
|---|---|---|---|
| NFR-01 | One `h1` per page, `lang="en"`, labelled form controls, ARIA state on toggles/accordion/tabs, visible focus ring, full keyboard operability | WCAG 2.1 AA subset | Both |
| NFR-02 | Usable from 360 px to 1440 px+, no horizontal scrolling; grids collapse to one column at ≤ 880 px | — | Both |
| NFR-07 | Zero console errors and zero uncaught exceptions on every page | 0 | Both |
| FR-SH-06 | Mobile menu exposes `aria-expanded` and is operable by touch and keyboard | — | Both |
| FR-SH-10 | Animations removed under `prefers-reduced-motion: reduce` | — | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-A11Y-01 | Zero console errors | Visit all 4 pages | No console error, no uncaught exception | P0 | `accessibility.spec.js` › `every page loads without console errors` |
| TC-A11Y-02 | Language + single `h1` | Visit all 4 pages | `lang="en"`, exactly one `h1` | P0 | `accessibility.spec.js` › `each page declares a language and a single top-level heading` |
| TC-A11Y-03 | Title + description | Visit all 4 pages | Title matches /Skill GPS/, description > 40 chars | P1 | `accessibility.spec.js` › `every page exposes a title and a meta description` |
| TC-A11Y-04 | Form controls labelled | Open Contact, audit the DOM | Every input/select/textarea has a `<label for>` or an ARIA name | P0 | `accessibility.spec.js` › `contact form fields are labelled` |
| TC-A11Y-05 | Accessible names & states | Home + Skills | Theme button named; mobile toggle exposes `aria-expanded`; track buttons are `role=tab` with `aria-selected` (5 false) | P1 | `accessibility.spec.js` › `interactive controls carry accessible names and states` |
| TC-A11Y-06 | Visible focus ring | Press Tab from the top of home | Focused element has a visible outline | P1 | `accessibility.spec.js` › `focus outlines are available for keyboard users` |
| TC-A11Y-07 | Keyboard-only quiz | Complete all 8 questions with `a`–`d` + `Enter` | Result view reached without a mouse | P1 | `accessibility.spec.js` › `the quiz can be driven with the keyboard only` |
| TC-RS-01 | No sideways scroll | 390 × 844 on all 4 pages | `scrollWidth == clientWidth` | P0 | `accessibility.spec.js` › `no page scrolls sideways on a phone` |
| TC-RS-02 | Single-column stacking | 390 × 844 on home | Track grid is 1 column, all 6 cards present | P1 | `accessibility.spec.js` › `content stacks into a single column` |
| TC-RS-03 | Decorative chips hidden | 390 × 844 on home | Floating hero chips hidden | P2 | `accessibility.spec.js` › `floating hero chips are hidden so nothing overflows` |
| TC-RS-04 | Roadmap stacks on mobile | 390 × 844 on roadmap | Shell is 1 column, 5 phases still render | P1 | `accessibility.spec.js` › `the roadmap stacks its sidebar above the timeline` |

## Implementation notes

- **Determinism:** `playwright.config.js` sets `reducedMotion: 'reduce'`, and both
  stylesheets replace every transition with `transition: none !important` inside
  `@media (prefers-reduced-motion: reduce)`. Without the `!important` the FAQ
  `max-height` was still animating and height assertions sampled `0`.
- **Focus test:** retries `Tab` until a real element is focused, because the first
  Tab can land on the document/body in some engines.
- **Overflow test:** compares `document.documentElement.scrollWidth` with
  `clientWidth` on each page rather than checking a single element.
- **Same suite twice:** these cases run against both implementations, which is how
  NFR-05 (behavioural parity) is enforced.
- Not automated here (see TC-MAN-08): screen-reader announcements and colour
  contrast judgement.
