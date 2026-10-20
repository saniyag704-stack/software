# Feature requirements & test cases

One file per feature. Every file holds **that feature's requirements** (FR-*)
and **its test cases** (TC-*), plus the automated test that proves it. The
master documents are still the single overview:

- [`../REQUIREMENTS.md`](../REQUIREMENTS.md) — all 75 functional + 9 non-functional requirements
- [`../TEST-CASES.md`](../TEST-CASES.md) — all test cases + requirement → test traceability
- [`../TEST-EVIDENCE.md`](../TEST-EVIDENCE.md) — the latest real execution log (per-test results)
- [`../RFP.md`](../RFP.md) — Request for Proposal (scope, deliverables, acceptance criteria)

## Index

| # | Feature | Requirements | Test cases | Automated | Spec |
|---|---|---|---|---|---|
| 1 | [Navigation, shell & theme](./01-navigation-and-theme.md) | FR-SH-01 … FR-SH-10 | TC-GL-01 … TC-GL-12 | 8 (+3 implicit) | `navigation.spec.js` |
| 2 | [Home page](./02-home.md) | FR-HM-01 … FR-HM-06 | TC-HM-01 … TC-HM-07 | 7 | `home.spec.js` |
| 3 | [Skill assessment](./03-assessment.md) | FR-AS-01 … FR-AS-15 | TC-AS-01 … TC-AS-14 | 14 | `skills.spec.js` |
| 4 | [Skill library (listing)](./04-skill-library.md) | FR-LB-01 … FR-LB-05 | TC-LB-01 … TC-LB-05 | 4 (+1 manual) | `skills.spec.js` |
| 5 | [Career roadmap](./05-roadmap.md) | FR-RM-01 … FR-RM-11 | TC-RM-01 … TC-RM-14 | 14 | `roadmap.spec.js` |
| 6 | [Contact & FAQ](./06-contact.md) | FR-CT-01 … FR-CT-09 | TC-CT-01 … TC-CT-13 | 12 (+1 manual) | `contact.spec.js` |
| 7 | [SEO & metadata](./07-seo-and-metadata.md) | FR-SEO-01 … FR-SEO-07 | TC-SEO-01 … TC-SEO-07 | 7 | `seo.spec.js` |
| 8 | [Accessibility & responsive](./08-accessibility-and-responsive.md) | NFR-01, NFR-02, NFR-07 | TC-A11Y-01 … TC-A11Y-07, TC-RS-01 … TC-RS-04 | 11 | `accessibility.spec.js` |
| 9 | [Data model & storage](./09-data-and-storage.md) | FR-DT-01 … FR-DT-08, FR-ST-01 … FR-ST-04 | TC-DT-01 … TC-DT-11 | 11 | `unit/data.spec.js` |
| 10 | [Manual / cross-cutting](./10-manual-checks.md) | NFR-03, NFR-04, NFR-09 (+ NFR-05/06/08 enforced by the suite) | TC-MAN-01 … TC-MAN-08 | — | manual |

**Totals:** 102 test-case IDs = **88 automated** + 11 manual + 3 implicitly
covered. The 88 automated cases are executed as **163 tests** (each browser case
runs against both the static site and the React app — 0 skipped).

## Conventions

| Column | Meaning |
|---|---|
| **ID** | `FR-<area>-nn` / `TC-<area>-nn`. IDs are stable — never renumber, append instead. |
| **Pri** | `P0` release blocker · `P1` important · `P2` polish |
| **Impl** | `Static` · `React` · `Both` — where the behaviour is expected |
| **Automation** | `spec.js › test title`. `Implicit` = proven by another case, `Manual` = human check |

## Rules for changing a feature

1. Behaviour change → update the requirement row (same ID) and the test case row.
2. New behaviour → append a new `FR-*` **and** a new `TC-*`, then add the
   Playwright test and reference it in the Automation column.
3. Renaming a test breaks the traceability — update this file, the master
   `../TEST-CASES.md`, and `.opencode/skills/skill-gps-e2e/references/test-plan.md`.
4. Run `npm run test` — the static, React and unit projects must all stay green.
