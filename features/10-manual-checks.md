# 10. Manual / cross-cutting checks

These cannot be proven by the automated suite: they need human judgement, a real
deployment, real browsers or assistive technology.

| Requirement | Why it stays manual |
|---|---|
| NFR-03 (performance) | Measured from the `npm run build` log and Lighthouse, not asserted in CI |
| NFR-04 (privacy) | Code review: no accounts, no tracking, no third-party calls beyond Google Fonts |
| NFR-09 (browser support) | The suite runs Chromium only |
| NFR-06 (quality gate) | `npm run test` + `npm run build` are run by a human before shipping |

## Cross-cutting requirements enforced by the suite itself

| Requirement | How it is enforced |
|---|---|
| NFR-05 (static ↔ React parity) | Every shared E2E case runs twice — once in the `static` project, once in `react`. A behaviour that exists in only one implementation fails. |
| NFR-06 (quality gate) | `npm run test` → 163 passing tests, 0 skipped; `npm run build` in `react-app/` must succeed. |
| NFR-08 (test determinism) | `npx playwright test --repeat-each=3` — the suite is repeatable under parallel execution. |

## Test cases

| ID | Title | Steps | Expected | Pri |
|---|---|---|---|---|
| TC-MAN-01 | Visual design review | Open all four pages in dark and light themes, desktop and phone | Spacing, type scale, gradients and contrast look intentional; no clipped text; both themes complete | P1 |
| TC-MAN-02 | Cross-browser pass | Chrome, Edge, Firefox, Safari on desktop; Android Chrome and iOS Safari | Layout, theme, quiz, roadmap and forms behave identically to the automated run | P1 |
| TC-MAN-03 | Static site from the file system | Double-click `index.html` (no server) | Pages load, navigation works, theme and progress persist, fonts degrade gracefully | P2 |
| TC-MAN-04 | Wire a real form endpoint | Point the submit handler at Formspree / Web3Forms / your API and send a message | The email arrives; loading, success and failure states are handled without a page reload | P2 |
| TC-MAN-05 | Lighthouse / Core Web Vitals | Run Lighthouse on the deployed static site and on the React build | Performance, Accessibility and Best-practices ≥ 90; no layout shift from web fonts | P2 |
| TC-MAN-06 | Deployment smoke test | Deploy the static site (Netlify/Vercel/Pages) and the React `dist/` | Both work, deep links resolve, `robots.txt` and `sitemap.xml` are served, `/skills?domain=web` survives a hard reload | P1 |
| TC-MAN-07 | Content swap | Replace placeholder stats (`12,400+`, `92%`), testimonials, contact details and the `https://skillgps.dev` domain | Numbers are honest, no placeholder text or fake domain remains, `sitemap.xml`/`robots.txt` updated | P1 |
| TC-MAN-08 | Screen-reader pass | VoiceOver (macOS) or NVDA (Windows) over home, the quiz and the roadmap | Landmarks and headings make sense; options announce position and state; toasts are announced without stealing focus | P2 |

## Sign-off checklist

```
[ ] npm run test          → 163 passed, 0 skipped, 0 failed
[ ] npm run build         → React bundle builds (react-app)
[ ] TC-MAN-01 … TC-MAN-08 → checked and dated
[ ] placeholders removed (stats, testimonials, contact details, domain)
[ ] real form endpoint wired, or the "simulated" note accepted
```
