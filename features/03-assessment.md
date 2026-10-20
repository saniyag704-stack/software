# 3. Skill assessment

| | |
|---|---|
| **Covers** | Track picker, 8-question quiz, option feedback, keyboard shortcuts, scoring, result view (ring, level, radar, per-skill bars), persistence, retake |
| **Static** | `skills.html` · `assets/js/skills.js` · `assets/js/data.js` |
| **React** | `react-app/src/pages/Skills.jsx` · `lib/data.js` |
| **Requirements** | FR-AS-01 … FR-AS-15 |
| **Test cases** | TC-AS-01 … TC-AS-14 |
| **Automated in** | `tests/e2e/skills.spec.js`, `tests/e2e/accessibility.spec.js` |
| **Storage** | `skillgps.assessment.v1` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-AS-01 | All six tracks are listed; Web Development is selected by default | P0 | Both |
| FR-AS-02 | `?domain=<id>` preselects that track | P0 | Both |
| FR-AS-03 | Each track has exactly 8 single-choice questions with 4 options each | P0 | Both |
| FR-AS-04 | Selecting a track restarts the quiz at question 1 and clears navigation state | P1 | Both |
| FR-AS-05 | “Next” is disabled until the current question is answered; “Back” is disabled on question 1 | P0 | Both |
| FR-AS-06 | Answering locks the options and immediately marks the chosen option correct/incorrect, revealing the correct answer | P0 | Both |
| FR-AS-07 | A progress bar and “Question *n* of 8” label reflect progress | P1 | Both |
| FR-AS-08 | The quiz is fully keyboard-operable: `a`–`d` select an option, `Enter` advances/finishes | P1 | Both |
| FR-AS-09 | Scoring: 2 questions per skill → per-skill score = correct/2 × 100; overall = round(correct/8 × 100) | P0 | Both |
| FR-AS-10 | Level thresholds: < 40 Beginner, 40–69 Intermediate, ≥ 70 Advanced (shared with the roadmap) | P0 | Both |
| FR-AS-11 | The result view shows the score ring, level, correct count, date, radar chart and four per-skill bars | P0 | Both |
| FR-AS-12 | The result is saved to `localStorage` and restored instead of a fresh quiz on the next visit | P0 | Both |
| FR-AS-13 | “Retake test” clears the result view and restarts at question 1 | P1 | Both |
| FR-AS-14 | “Open my roadmap” links to the roadmap for the assessed track | P0 | Both |
| FR-AS-15 | “Try another track” returns to the track picker | P2 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-AS-01 | Six tracks, Web Development default | Open Skills | 6 track buttons, Web Development active, “Web Development assessment”, “Question 1 of 8”, 4 options | P0 | `skills.spec.js` › `lists every career track and starts on Web Development` |
| TC-AS-02 | `?domain=` preselects | Open `?domain=cloud` | Cloud & DevOps active and titled, question 1 of 8 | P0 | `skills.spec.js` › `a ?domain= deep link preselects that track` |
| TC-AS-03 | Switching track restarts | Answer Q1, advance, choose UI/UX Design | Back to Question 1 of 8, UI/UX title, Back and Next disabled | P1 | `skills.spec.js` › `switching track restarts the quiz from question 1` |
| TC-AS-04 | Next gated on an answer | Open Skills | Back disabled, Next disabled; after choosing, Next enabled and progress reads > 0 | P0 | `skills.spec.js` › `Next stays disabled until an option is chosen` |
| TC-AS-05 | Wrong answer feedback | Choose a wrong option | Chosen marked `wrong`, correct marked `correct`, options locked, “Not quite” toast | P0 | `skills.spec.js` › `answering gives immediate correct/incorrect feedback` |
| TC-AS-06 | Correct answer feedback | Choose the correct option | Option marked `correct`, no `wrong` option, success toast | P0 | `skills.spec.js` › `a correct answer is confirmed with a toast` |
| TC-AS-07 | Keyboard operation | Press `b`, then `Enter` | Answer registered, Enter advances to Question 2 of 8 | P1 | `skills.spec.js` › `keyboard shortcuts answer and advance the quiz` |
| TC-AS-08 | Progress bar advances | Answer Q1 then advance | Fill width > 0 and non-decreasing | P1 | `skills.spec.js` › `progress bar advances as questions are answered` |
| TC-AS-09 | Back returns to the previous question | Answer Q1, advance, press Back | Question 1 shown, Next enabled (answer remembered) | P1 | `skills.spec.js` › `the Back button returns to the previous question` |
| TC-AS-10 | Scoring + persistence | Answer all 8 questions | Score = correct/8 × 100, level matches thresholds, radar + 4 bars, payload in storage, same score after reload | P0 | `skills.spec.js` › `a zero-score run reports Beginner and stores the result` |
| TC-AS-11 | Perfect run → Advanced | Answer all 8 correctly | 100, level “Advanced”, all four bars 100 % | P0 | `skills.spec.js` › `a perfect run reports Advanced with full skill bars` |
| TC-AS-12 | Retake | Finish, click “Retake test” | Result view gone, Question 1 of 8, Next disabled | P1 | `skills.spec.js` › `Retake test returns to the first question` |
| TC-AS-13 | Result → roadmap | Finish, read CTA `href`, click it | `href` carries `domain=<track>`, roadmap opens for that track | P0 | `skills.spec.js` › `the result links to the matching roadmap` |
| TC-AS-14 | Keyboard-only run | `b`/`Enter` through all 8 questions | Result view reached without a mouse | P1 | `accessibility.spec.js` › `the quiz can be driven with the keyboard only` |

## Implementation notes

- **Question model:** `{ q, options[4], answer, skill }` where `skill` must be one
  of the track's four skill ids (validated by `tests/unit/data.spec.js`).
- **Even coverage:** each skill is referenced by exactly 2 questions, which is what
  makes the per-skill percentage fair.
- **Answer index:** options are single-select; after answering, the option list is
  locked for that question, but going Back preserves the choice.
- **Level mapping:** implemented by `skillLevel(score)` → `{ level: 0|1|2, label }`
  shared with the roadmap.
- **Stored payload:** `{ domain, score, correct, total, level, skills: {...}, date }`.
- **React timing:** the keydown handler is attached in an effect, so the page
  objects retry keyboard input until the quiz is ready
  (`answerByKeyboard` / `advanceByKeyboard` / `finishByKeyboard`).

## Test notes

- The perfect run uses the **AI & ML** track, where every correct answer is
  option index `1`; the zero-score run simply always picks the first option.
- The level chip is `#quizPanel .panel-head .badge` (with a `level-*` class) —
  not a `.level-pill`.
