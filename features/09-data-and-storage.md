# 9. Data model & storage

| | |
|---|---|
| **Covers** | The single content source (6 tracks, 24 skills, 48 questions, 30 roadmap phases), data shape rules, scoring helpers, `localStorage` behaviour |
| **Static** | `assets/js/data.js` (IIFE that also exposes `window.SkillGPS`) |
| **React** | `react-app/src/lib/data.js` (ESM copy, same content) |
| **Requirements** | FR-DT-01 … FR-DT-08, FR-ST-01 … FR-ST-04 |
| **Test cases** | TC-DT-01 … TC-DT-11 |
| **Automated in** | `tests/unit/data.spec.js` (Node project, no browser) |
| **Storage keys** | `skillgps.assessment.v1` · `skillgps.progress.v1` · `skillgps.theme` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-DT-01 | All content lives in a single data module (`assets/js/data.js`, mirrored as an ESM copy for React) | P0 | Both |
| FR-DT-02 | Each domain defines id, name, short name, icon, colour, tagline, description, demand, salary, duration, 4 skills, 8 questions, 5 roadmap phases and careers | P0 | Both |
| FR-DT-03 | Each skill defines id, name, demand, description and ≥ 2 tags | P0 | Both |
| FR-DT-04 | Each question defines text, 4 options, a valid answer index and a `skill` that exists in that track | P0 | Both |
| FR-DT-05 | Each skill is covered by exactly 2 questions so per-skill scoring is balanced | P0 | Both |
| FR-DT-06 | Every phase defines title, duration, `minLevel` ∈ {0,1,2} and 4 milestones; levels never regress and span 0 → 2 | P0 | Both |
| FR-DT-07 | Adding a track to the data module updates home cards, track pickers, filters, roadmap and assessment without code changes | P1 | Both |
| FR-DT-08 | `getDomain()` falls back to the first track for unknown ids; `skillLevel()` implements the < 40 / 40–69 / ≥ 70 thresholds | P1 | Both |
| FR-ST-01 | `skillgps.assessment.v1` stores the last result (domain, score, correct, total, level, per-skill scores, date) | P0 | Both |
| FR-ST-02 | `skillgps.progress.v1` stores roadmap progress as `{ [trackId]: { 'phase-item': true } }` | P0 | Both |
| FR-ST-03 | `skillgps.theme` stores `dark` or `light` | P1 | Both |
| FR-ST-04 | Storage access never throws — blocked or full storage degrades to defaults | P1 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-DT-01 | Six unique domains | Inspect `DOMAINS` | 6 entries with the expected ids | P0 | `data.spec.js` › `there are six career tracks with unique ids` |
| TC-DT-02 | Complete domain fields | Inspect every domain | All keys present; name/tagline/description lengths, colour, icon, demand 0–100, ≥ 2 careers | P0 | `data.spec.js` › `every domain carries the full set of fields` |
| TC-DT-03 | Four skills per domain | Inspect `DOMAINS[].skills` | 4 skills, unique ids, description > 30 chars, ≥ 2 tags, demand 0–100 | P0 | `data.spec.js` › `every domain exposes exactly four core skills` |
| TC-DT-04 | Eight valid questions | Inspect `DOMAINS[].quiz` | 8 per domain, 4 unique options, answer index in range, `skill` exists in the domain | P0 | `data.spec.js` › `every domain has eight well-formed questions` |
| TC-DT-05 | Two questions per skill | Group questions by `skill` | Each skill referenced exactly twice | P0 | `data.spec.js` › `each skill is assessed by exactly two questions` |
| TC-DT-06 | Unique question text | Compare question strings | No duplicate inside a domain | P1 | `data.spec.js` › `questions are unique inside a domain` |
| TC-DT-07 | Five valid phases | Inspect `DOMAINS[].roadmap` | 5 phases, 4 milestones each, duration present, `minLevel` ∈ {0,1,2} | P0 | `data.spec.js` › `every domain has a five-phase, level-aware roadmap` |
| TC-DT-08 | Level progression | Walk phases in order | `minLevel` never regresses; starts at 0 and ends at 2 | P1 | `data.spec.js` › `advancing phases never require a lower level than earlier ones` |
| TC-DT-09 | Level thresholds | Call `skillLevel(0,39,40,69,70,100)` | 0/39 → 0, 40/69 → 1, 70/100 → 2, with matching labels | P0 | `data.spec.js` › `skillLevel maps scores to the documented thresholds` |
| TC-DT-10 | `getDomain` fallback | Call with a known, unknown and `undefined` id | Known id returned; otherwise the first track | P1 | `data.spec.js` › `getDomain falls back to the first track for unknown ids` |
| TC-DT-11 | Storage degrades safely | Simulate unavailable `localStorage` | `read` returns the fallback, `write` never throws, empty progress is `{}` | P1 | `data.spec.js` › `Store degrades gracefully when storage is unavailable` |

## Implementation notes

- **Known duplication risk:** the static site and the React app each have a copy of
  the data (`assets/js/data.js` vs `react-app/src/lib/data.js`). They are synced by
  hand — change both, then run `npm run test`; the shared unit spec validates the
  copy it imports, and the browser specs prove the two render the same content.
- **Totals:** 6 tracks · 24 skills · 48 questions · 30 phases · 120 milestones.
- **Helpers:** `getDomain(id)` (fallback = first track), `skillLevel(score)` →
  `{ level, label }`, and `Store` (`get/set/remove` with try/catch around every
  `localStorage` call, so private mode or a full quota never breaks a page).
- **Storage versioning:** keys carry `.v1`; a shape change should bump the version
  rather than migrate in place, so old data is simply ignored.
- **Per-skill scores** are stored as `{ <skillId>: <0|50|100> }` (2 questions per
  skill → 0, 50 or 100).
- **Node safety:** the React copy guards its `window` assignment with
  `typeof window !== 'undefined'`, which is what lets the unit project import it
  without a DOM.
