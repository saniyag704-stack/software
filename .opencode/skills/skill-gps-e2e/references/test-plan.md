# Test plan

Coverage map for the Skill GPS suite. Each browser spec runs twice — once
against the static site, once against the React app — so every behaviour below
is verified for both implementations.

## navigation.spec.js — site chrome

| Case | What it protects |
| --- | --- |
| Four primary pages are linked | Header stays complete after template edits |
| Each link navigates and becomes active | `active` class logic + correct page heading |
| Theme toggle flips and persists | `data-theme` on `<html>`, `skillgps.theme` storage |
| Scrolled header state | `.nav.scrolled` on scroll listener |
| Footer year + links | Copyright year is computed, socials render |
| Mobile: menu opens / navigates / closes | `aria-expanded`, `.open` class, close-on-navigate |
| Mobile: tap outside closes | Backdrop click handler |

## home.spec.js — landing page

| Case | What it protects |
| --- | --- |
| Hero copy + two CTAs | Value proposition and entry points |
| Dashboard mockup bars | Four skill bars with the expected labels |
| Trust statistics | Counters resolve to `12,400+ / 6 / 24 / 92%` |
| Six career tracks | Every domain card renders with a demand badge |
| Supporting sections | 3 features, 4 steps, 3 testimonials, CTA band |
| Clicking a track deep-links | `?domain=` reaches the assessment preselected |
| Hero CTA starts the assessment | Primary conversion path |

## skills.spec.js — assessment + library

Assessment engine:

- six tracks listed, Web Development active by default
- `?domain=` deep link preselects a track
- switching track restarts at question 1 and disables navigation
- `Next` is disabled until an option is chosen, `Back` disabled on Q1
- answering gives immediate correct/incorrect feedback, locks the options and
  toasts the result
- keyboard `a`–`d` answers, `Enter` advances
- progress bar advances; `Back` restores the previous question

Results:

- a full run computes the score from the collected answers and matches the
  rendered ring
- level pill and status badge agree with the Beginner / Intermediate / Advanced
  thresholds (`<40`, `40–69`, `70+`)
- radar chart and four per-skill bars render
- the result is written to `skillgps.assessment.v1` and survives a reload
- `Retake test` returns to question 1 and clears the result view
- `Open my roadmap` links to the same track with `?domain=`

Skill library:

- 24 skills render, with 7 filter chips (All skills + 6 tracks)
- search narrows the list, a miss shows the empty state, clearing restores 24
- track chips filter to 4 skills
- search and chip filters combine

## roadmap.spec.js — career roadmap

- five phases with the documented titles, four milestones each
- `?domain=` deep link selects the roadmap and updates the URL
- without an assessment: personalise CTA, no level pill, no fast-track badges
- progress starts at `0%`, `0 / 5 phases`
- checking a milestone updates the percentage (1 of 20 items = 5%) and persists
- completing a phase marks it `.done`, updates the badge and toasts
- progress survives a reload
- reset clears after `confirm()`; dismissing the dialog keeps progress
- per-track progress is independent (switching tracks shows separate counts)
- a seeded Advanced result unlocks 4 fast-track phases on Web Development and
  swaps the CTA for `Retake assessment`
- a seeded Beginner result shows no fast-track phases
- an assessment for a different track does not personalise the current roadmap

## contact.spec.js — form + FAQ

- form, contact cards (4) and FAQ (5) render
- empty submit marks all three required fields invalid, sets `aria-invalid`,
  shows an error toast and no success toast
- malformed email is rejected; a message under 10 characters is rejected
- a valid submission shows the success toast and clears the form
- inline errors clear as the field is corrected
- FAQ answers start collapsed (height 0, `aria-expanded="false"`)
- opening reveals the answer; opening another closes the previous; clicking the
  open question closes it
- the track select is prefilled from the last assessment, empty without one

## accessibility.spec.js — a11y, markup, viewports

- no console errors or uncaught exceptions on any of the four pages
- `lang="en"` and exactly one `<h1>` per page
- every page has a title and a meta description over 40 characters
- every contact field has a `<label for>` (or an ARIA name)
- theme button has an accessible name; mobile toggle exposes `aria-expanded`;
  track buttons use `role="tab"`/`aria-selected`
- the whole quiz can be completed with the keyboard alone
- focus is visible after `Tab`
- desktop (1440px): full navigation, two-column roadmap
- phone (390px): no horizontal overflow on any page, single-column grids,
  decorative hero chips hidden

## seo.spec.js — discoverability (both implementations)

Runs in both projects. The static site ships one `<head>` per page; the React app
applies route metadata with `usePageMeta()` (`src/lib/meta.js`) and serves
`robots.txt` + `sitemap.xml` from `react-app/public/`.

- titles are unique across the four routes and all contain "Skill GPS"
- meta descriptions are unique and 80–200 characters
- Open Graph (`og:type`, `og:site_name`, `og:title`, `og:description`) and
  Twitter (`twitter:card`, `twitter:title`, `twitter:description`) tags are
  complete, with `og:title` mirroring `<title>`
- `theme-color`, an inline SVG favicon and `width=device-width` viewport
- `robots.txt` is served as `text/plain`, allows crawling and points at the sitemap
- `sitemap.xml` lists four absolute URLs with valid priorities, and every listed
  route really returns `200` (`normalizeRoute()` maps `/skills.html` and
  `/skills` to the same logical page, so one spec covers both layouts)
- no same-origin response on any page returns 4xx/5xx (no missing assets)

## unit/data.spec.js — data model- six domains with unique ids and the complete field set
- four skills per domain with unique ids, descriptions and tags
- eight questions per domain: four unique options, an in-range answer index and
  a skill id that exists
- each skill is assessed by exactly two questions; questions are unique
- five roadmap phases with four items, valid `minLevel`, ordering never
  regresses, first phase `0`, last phase `2`
- `skillLevel()` boundaries (0/39/40/69/70/100)
- `getDomain()` fallback, and `Store` degrading gracefully without storage
