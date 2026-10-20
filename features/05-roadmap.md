# 5. Career roadmap

| | |
|---|---|
| **Covers** | Five-phase roadmap per track, milestone checkboxes, progress %, phase completion, reset, persisted per-track progress, level-aware “fast-track” hints |
| **Static** | `roadmap.html` · `assets/js/roadmap.js` · `assets/js/data.js` |
| **React** | `react-app/src/pages/Roadmap.jsx` · `lib/data.js` |
| **Requirements** | FR-RM-01 … FR-RM-11 |
| **Test cases** | TC-RM-01 … TC-RM-14 |
| **Automated in** | `tests/e2e/roadmap.spec.js` |
| **Storage** | `skillgps.progress.v1` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-RM-01 | Each track has a 5-phase roadmap with a title, duration and 4 milestones per phase | P0 | Both |
| FR-RM-02 | `?domain=<id>` or the track selector switches the roadmap shown | P0 | Both |
| FR-RM-03 | Milestones can be ticked; percentage, bar, “n items done” and “n / 5 phases” update live | P0 | Both |
| FR-RM-04 | A phase is done when all its milestones are ticked, and completing one raises a toast | P1 | Both |
| FR-RM-05 | Progress is stored per track in `localStorage` and survives a reload | P0 | Both |
| FR-RM-06 | Progress for different tracks is independent | P1 | Both |
| FR-RM-07 | “Reset this roadmap” clears the current track after a confirmation, and keeps it if dismissed | P1 | Both |
| FR-RM-08 | Without an assessment the sidebar invites the user to take it (CTA to the same track) | P0 | Both |
| FR-RM-09 | With an assessment for *this* track the sidebar shows level, score and “Retake” | P0 | Both |
| FR-RM-10 | Phases whose `minLevel` is below the assessed level are flagged “Fast-track — you likely know this” | P1 | Both |
| FR-RM-11 | An assessment for a *different* track never personalises the current roadmap | P1 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-RM-01 | Five phases with detail | Open Roadmap | 5 phases with the documented titles, 4 milestones each, a duration on phase 1 | P0 | `roadmap.spec.js` › `shows five phases with realistic detail` |
| TC-RM-02 | `?domain=` selects a roadmap | Open `?domain=cloud` | Selector = cloud, first phase “Linux & the network”, URL keeps `domain=cloud` | P0 | `roadmap.spec.js` › `a ?domain= deep link selects that roadmap` |
| TC-RM-03 | No assessment → personalise CTA | Open Roadmap with empty storage | Assessment CTA visible, no level pill, no fast-track badges | P0 | `roadmap.spec.js` › `without an assessment it invites you to personalise` |
| TC-RM-04 | Progress starts empty | Open Roadmap | 0 %, “0 / 5 phases”, no phase done | P1 | `roadmap.spec.js` › `progress starts empty` |
| TC-RM-05 | Milestone updates + stores | Tick phase 1 item 1, untick it | 5 %, “1 item done”, stored `web['0-0']=true`; untick → 0 % and `{}` | P0 | `roadmap.spec.js` › `checking a milestone updates the counter and stores progress` |
| TC-RM-06 | Phase completion | Tick all 4 milestones of phase 1 | Phase `.done`, “1 / 5 phases”, 20 %, “Phase complete” toast | P1 | `roadmap.spec.js` › `completing a phase marks it done and celebrates` |
| TC-RM-07 | Progress survives reload | Tick 2 milestones, reload | Both still checked, 10 % | P0 | `roadmap.spec.js` › `progress survives a reload` |
| TC-RM-08 | Reset with confirmation | Complete phase 1, reset, accept | 0 %, no ticks, stored `{}` | P1 | `roadmap.spec.js` › `reset clears the roadmap after confirmation` |
| TC-RM-09 | Reset dismissed | Tick a milestone, reset, dismiss | Progress untouched (5 %, tick kept) | P1 | `roadmap.spec.js` › `dismissing the reset dialog keeps progress` |
| TC-RM-10 | Per-track progress | Tick on web, switch to data, back to web | Data shows 0 %, web still 5 % | P1 | `roadmap.spec.js` › `progress is tracked per track` |
| TC-RM-11 | Advanced → fast-track | Seed an Advanced web result, open Roadmap | Level “Advanced”, “Retake assessment” link, no CTA, 4 fast-track badges | P1 | `roadmap.spec.js` › `an advanced result unlocks fast-track phases` |
| TC-RM-12 | Beginner → no fast-track | Seed a Beginner design result | Level “Beginner”, 0 fast-track badges | P1 | `roadmap.spec.js › a beginner result shows no fast-track phases` |
| TC-RM-13 | Other track's result ignored | Seed an Advanced web result, open marketing | No level pill, CTA back, 0 fast-track badges | P1 | `roadmap.spec.js` › `an assessment for another track does not personalise this one` |
| TC-RM-14 | Sidebar assessment link | Open Roadmap, click the CTA | `href` carries `domain=web`, navigates to Skills | P1 | `roadmap.spec.js` › `the assessment link points at the same track` |

## Implementation notes

- **Progress maths:** 5 phases × 4 items = **20 items per track**, so each
  milestone is exactly **5 %**. Percent = `round(done / 20 × 100)`.
- **Storage shape:** `{ web: { '0-0': true, '1-2': true }, data: { … } }`.
  Milestone ids are `"<phaseIndex>-<itemIndex>"`.
- **Reset** uses `confirm()`; dismissing it must leave state untouched (tested).
- **Fast-track rule:** flag a phase when `phase.minLevel < assessedLevel`. For an
  Advanced result (level 2) that flags the four phases with `minLevel` 0 or 1;
  phase 5 (`minLevel` 2) is never flagged.
- **Personalisation is track-scoped:** the card only reads the assessment when
  `assessment.domain === currentDomain`, which is why TC-RM-13 exists.
- Checkboxes are visually hidden inputs — clicking the **label** is what tests do.
