# Data model the tests rely on

Source of truth: `assets/js/data.js` (static) and `react-app/src/lib/data.js`
(ESM copy). Keep them in sync — `tests/unit/data.spec.js` asserts the shape of
the ESM copy, and the browser specs exercise the static copy.

## Domain

```js
{
  id: 'web',                    // unique, lowercase
  name: 'Web Development',
  short: 'Web Dev',
  icon: '<svg …>',              // inline SVG string
  color: '#6366f1',
  tagline: 'Build products people actually use',
  description: '…',             // > 40 chars
  demand: 94,                   // 0–100
  salary: '₹6–18 LPA',
  duration: '8–10 months',
  skills: [ /* exactly 4 */ ],
  quiz: [ /* exactly 8 */ ],
  roadmap: [ /* exactly 5 */ ],
  careers: ['Frontend Developer', 'Full-Stack Engineer', 'Product Engineer']
}
```

## Skill

```js
{ id: 'html-css', name: 'HTML & CSS', demand: 90, desc: '…', tags: ['Foundation', 'Frontend', 'A11y'] }
```

## Question

```js
{ q: '…?', options: ['a', 'b', 'c', 'd'], answer: 2, skill: 'html-css' }
```

Two questions per skill, so a perfect run gives every skill 100%.

## Roadmap phase

```js
{ phase: 'Foundation', title: 'The web, decoded', duration: '3–4 weeks', minLevel: 0, items: ['…', '…', '…', '…'] }
```

`minLevel` is `0 | 1 | 2`. Phases whose `minLevel` is below the assessed level
render a "Fast-track" badge (`minLevel < level`). A level-2 result on Web
Development unlocks four badges (levels `0, 0, 1, 1`).

## Scoring

```js
skillScore   = (correctForSkill / 2) * 100
overallScore = Math.round((correctTotal / 8) * 100)
level        = score >= 70 ? 2 : score >= 40 ? 1 : 0   // helper: skillLevel()
LEVELS       = ['Beginner', 'Intermediate', 'Advanced']
```

## Storage

| Key | Shape | Written when |
| --- | --- | --- |
| `skillgps.assessment.v1` | `{ domain, domainName, score, correct, total, level, skills: [{ id, name, score }], date }` | quiz finishes |
| `skillgps.progress.v1` | `{ [domainId]: { 'phaseIndex-itemIndex': true } }` | milestone toggled |
| `skillgps.theme` | `'light' \| 'dark'` | theme toggle |

Storage is origin-scoped, so the static site (:8777) and the React app (:5173)
keep separate progress. Fixtures seed through `assessmentPayload()` in
`tests/paths.js` to guarantee the exact shape.
