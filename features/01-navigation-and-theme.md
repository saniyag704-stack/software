# 1. Navigation, shell & theme

| | |
|---|---|
| **Covers** | Header, footer, active nav state, dark/light theme, mobile menu, toasts, scroll reveal + counters |
| **Static** | shared markup in `index.html`, `skills.html`, `roadmap.html`, `contact.html` · `assets/js/app.js` |
| **React** | `react-app/src/App.jsx` (theme state + routes) · `components/Nav.jsx` · `components/Footer.jsx` · `components/Reveal.jsx` · `lib/ui.js` (`toast`) |
| **Requirements** | FR-SH-01 … FR-SH-10 |
| **Test cases** | TC-GL-01 … TC-GL-12 |
| **Automated in** | `tests/e2e/navigation.spec.js`, `tests/e2e/accessibility.spec.js` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-SH-01 | Every page shares one header with the brand, four primary links (Home, Skills, Roadmap, Contact) and a “Start assessment” CTA | P0 | Both |
| FR-SH-02 | The header link for the current page is visually marked as active | P1 | Both |
| FR-SH-03 | The header becomes visually “scrolled” once the user scrolls down | P2 | Both |
| FR-SH-04 | Every page shares one footer with the current year, platform links and social icons | P1 | Both |
| FR-SH-05 | The theme toggles between dark and light, is applied to `<html data-theme>`, and persists across reloads and pages | P0 | Both |
| FR-SH-06 | On ≤880 px the primary links collapse behind a hamburger toggle exposing `aria-expanded` | P0 | Both |
| FR-SH-07 | The mobile menu closes on link tap, on route change, and on an outside tap | P1 | Both |
| FR-SH-08 | Transient feedback is shown as an auto-dismissing toast in one global container | P1 | Both |
| FR-SH-09 | Content sections reveal on scroll; counters animate to their target value | P2 | Both |
| FR-SH-10 | All animations are removed when the user prefers reduced motion | P1 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-GL-01 | Header exposes the four primary pages | Load home | 4 links in order Home, Skills, Roadmap, Contact + the CTA visible | P0 | `navigation.spec.js` › `the four primary pages are linked in the header` |
| TC-GL-02 | Nav link navigation + active state | Click each nav link in turn | URL changes, the link gets `active`, the page `h1` matches | P0 | `navigation.spec.js` › `each nav link navigates and is marked active` |
| TC-GL-03 | Theme toggle + persistence | Read `data-theme`, toggle, reload, toggle back | Theme flips, survives reload, returns to the original | P0 | `navigation.spec.js` › `theme toggle flips the theme and persists across reloads` |
| TC-GL-04 | Scrolled header state | Scroll to y = 600 | `header.nav` gains `scrolled` | P2 | `navigation.spec.js` › `the sticky header gains a scrolled state` |
| TC-GL-05 | Footer year + links | Load home | Current year, platform links and 3 social icons | P1 | `navigation.spec.js` › `footer shows the current year and platform links` |
| TC-GL-06 | Mobile menu opens, navigates, closes | 390 px viewport, tap hamburger, tap Skills | `aria-expanded=true`, menu visible; after navigating it closes and `aria-expanded=false` | P0 | `navigation.spec.js` › `hamburger menu opens, navigates and closes` |
| TC-GL-07 | Tap outside closes the mobile menu | Open the menu, tap at (200, 700) | Menu closes | P1 | `navigation.spec.js` › `tapping outside closes the mobile menu` |
| TC-GL-08 | Desktop nav visible, hamburger hidden | 1440 px on home | `.nav-links` visible, `.nav-toggle` hidden | P1 | `accessibility.spec.js` › `desktop shows the full navigation and a two-column roadmap` |
| TC-GL-09 | Reduced motion | Emulate `prefers-reduced-motion: reduce` | Transitions removed, reveals visible at once, counters already final | P1 | Implicit — Playwright config forces `reducedMotion: 'reduce'` for every case |
| TC-GL-10 | Toast feedback | Trigger a toast (answer, phase complete, form error) | Expected message appears in the toast container | P1 | Implicit — TC-AS-05/06, TC-RM-06, TC-CT-02/05 |
| TC-GL-11 | Scroll reveal | Load any page | All `.reveal` sections end up visible | P2 | Implicit — every visibility assertion runs after reveal |
| TC-GL-12 | Brand links home | Click the brand from Skills | Navigates to home | P2 | Manual |

## Implementation notes

- **Active link:** the static pages hard-code `.active` per page; React uses
  `NavLink`'s `isActive` callback — both must produce the same class.
- **Mobile menu outside tap (React):** handled in a **capture-phase** listener
  that checks `event.composedPath()`. A bubble-phase `closest('.nav')` check
  fails because React detaches the clicked icon node mid-dispatch, so the event
  target is no longer inside the header when the handler runs.
- **Theme:** stored under `skillgps.theme`. The static site starts with
  `data-theme="dark"` and `assets/js/app.js` applies the stored value on load;
  React initialises `useState` from `localStorage` and sets the attribute in an
  effect.
- **Toasts:** one `.toast-wrap`; `toast(message, type, duration ≈ 3400 ms)`;
  types are `success` and `error`.
- **Counters** read `data-count` and skip animation under reduced motion.

## Test notes

- Tests read the theme from `<html data-theme>`, never from the button icon.
- The scrolled-state test scrolls the window, not an inner container.
