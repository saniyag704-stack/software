# 4. Skill library (listing)

| | |
|---|---|
| **Covers** | The listing section under the assessment: 24 skill cards, track filter chips, free-text search, live count, empty state |
| **Static** | `skills.html` (`#library`) · `assets/js/skills.js` · `assets/js/data.js` |
| **React** | `react-app/src/pages/Skills.jsx` · `lib/data.js` |
| **Requirements** | FR-LB-01 … FR-LB-05 |
| **Test cases** | TC-LB-01 … TC-LB-05 |
| **Automated in** | `tests/e2e/skills.spec.js` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-LB-01 | All 24 skills (6 tracks × 4) are listed as cards with demand, description and tags | P0 | Both |
| FR-LB-02 | A chip set (“All skills” + 6 tracks) filters the list | P0 | Both |
| FR-LB-03 | Free-text search filters by skill name, description and tags | P0 | Both |
| FR-LB-04 | Search and chip filters combine (AND) | P1 | Both |
| FR-LB-05 | A live count of matching skills is shown; no matches shows a dedicated empty state | P1 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-LB-01 | All skills listed | Open Skills, scroll to the library | 24 cards, badge “24 skills”, 7 filter chips | P0 | `skills.spec.js` › `renders every skill from all tracks` |
| TC-LB-02 | Search filters and clears | Search “python”, then “zzzzz”, then clear | Fewer cards (all Python-related), empty state for the miss, 24 again when cleared | P0 | `skills.spec.js` › `search narrows the list and can be cleared` |
| TC-LB-03 | Chip filter | Click “Marketing”, then “All skills” | 4 cards / “4 skills”, then 24 | P0 | `skills.spec.js` › `track chips filter the library` |
| TC-LB-04 | Search + chip combine | Chip “Data”, search “sql” | Exactly 1 card containing “SQL” | P1 | `skills.spec.js` › `search combines with the active filter` |
| TC-LB-05 | Tag/keyword search | Search a tag such as “Foundation” or “backend” | Skills matching by tag or description are returned | P2 | Manual |

## Implementation notes

- The library is fed by the same data module as the assessment, so every skill
  already used by a question appears here.
- Search is case-insensitive and matches `name + description + tags`; chips set a
  `domain` filter and both are applied together.
- The count badge and the empty state are driven by the filtered array length, not
  by DOM counting, so they cannot drift from the cards.
- Chips are plain buttons with a single active state (only one track at a time).
- The static implementation renders once on load and re-renders on input; the
  React version derives the filtered list during render (`useMemo`), so there is
  no stale-state path.
