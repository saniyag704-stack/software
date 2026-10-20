# 6. Contact & FAQ

| | |
|---|---|
| **Covers** | Contact form, client-side validation, success/error toasts, track prefill from the last assessment, contact info cards, 5-item FAQ accordion |
| **Static** | `contact.html` · `assets/js/contact.js` · `assets/js/app.js` (toast) |
| **React** | `react-app/src/pages/Contact.jsx` · `lib/ui.js` (toast) |
| **Requirements** | FR-CT-01 … FR-CT-09 |
| **Test cases** | TC-CT-01 … TC-CT-13 |
| **Automated in** | `tests/e2e/contact.spec.js` |

## Requirements

| ID | Requirement | Pri | Impl |
|---|---|---|---|
| FR-CT-01 | The page provides name, email, track, “you are” and message fields plus a submit button | P0 | Both |
| FR-CT-02 | Submitting an empty form blocks, flags every required field (`aria-invalid` + inline message) and shows an error toast; no success is claimed | P0 | Both |
| FR-CT-03 | Validation: name ≥ 2 characters, a valid email format, and a message ≥ 10 characters | P0 | Both |
| FR-CT-04 | Inline errors clear as soon as the offending field is corrected | P1 | Both |
| FR-CT-05 | A valid submission shows a success toast, resets the form, and does not navigate | P0 | Both |
| FR-CT-06 | The track select is prefilled from the last assessment | P1 | Both |
| FR-CT-07 | Four contact info cards (email, phone, location, response time) are shown | P2 | Both |
| FR-CT-08 | A 5-item FAQ accordion opens/closes with ARIA state; opening one closes the previous | P1 | Both |
| FR-CT-09 | Sending is simulated in the browser — wiring a real endpoint is a deployment task, not a feature | P2 | Both |

## Test cases

| ID | Title | Steps | Expected | Pri | Automation |
|---|---|---|---|---|---|
| TC-CT-01 | Form, info cards, FAQ render | Open Contact | Fields visible, 4 info cards, 5 FAQ items, `h1` about finding direction | P0 | `contact.spec.js` › `renders the form, contact details and FAQ` |
| TC-CT-02 | Empty submit blocked | Submit with no input | 3 invalid fields with messages, `aria-invalid=true` on name, error toast, no success toast | P0 | `contact.spec.js` › `submitting an empty form blocks and highlights every required field` |
| TC-CT-03 | Invalid email rejected | Valid name + “not-an-email” + valid message | Only the email field is invalid | P0 | `contact.spec.js` › `a malformed email is rejected` |
| TC-CT-04 | Short message rejected | Message “too short” | Message field invalid | P0 | `contact.spec.js` › `a short message is rejected` |
| TC-CT-05 | Valid submit → success + reset | Fill all fields, submit | “Message sent” toast, no invalid fields, name/email/message cleared | P0 | `contact.spec.js` › `a valid submission confirms and resets the form` |
| TC-CT-06 | Errors clear on correction | Submit empty, then type in name | Name no longer invalid | P1 | `contact.spec.js` › `inline errors clear as soon as the field is corrected` |
| TC-CT-07 | FAQ collapsed initially | Open Contact | `aria-expanded=false`, answer height 0 | P1 | `contact.spec.js` › `answers are collapsed until asked for` |
| TC-CT-08 | FAQ opens | Click question 1 | `aria-expanded=true`, item `.open`, answer visible with height > 0 | P1 | `contact.spec.js` › `clicking a question opens it and reveals the answer` |
| TC-CT-09 | Single-open accordion | Open Q1, then Q3 | Q3 open, Q1 closed | P1 | `contact.spec.js` › `opening one question closes the previous one` |
| TC-CT-10 | Click open question closes it | Open Q2, click Q2 again | Closed, `aria-expanded=false` | P2 | `contact.spec.js` › `clicking an open question closes it again` |
| TC-CT-11 | Track prefilled from assessment | Seed a Digital Marketing result, open Contact | Track select = “Digital Marketing” | P1 | `contact.spec.js` › `the track is preselected from your last assessment` |
| TC-CT-12 | No assessment → empty track | Clear storage, open Contact | Track select empty | P2 | `contact.spec.js` › `no assessment means no preselected track` |
| TC-CT-13 | Real delivery | Submit a valid form with a configured endpoint | Message arrives in the inbox, button shows a sending state | P2 | Manual |

## Implementation notes

- **Required fields:** `name`, `email`, `message`. `track` and `role` are optional.
- **Error UI:** the wrapper `.field` gets `.invalid` and the input gets
  `aria-invalid="true"`; the message lives inside that wrapper.
- **Simulated send:** a short timeout fakes latency, then the success toast
  (“Message sent. We usually reply within one working day.”) fires and the form
  resets. No network request is made.
- **Track prefill:** reads `skillgps.assessment.v1` and selects the matching
  `<option>`; unknown/absent assessment leaves the select empty.
- **FAQ:** one open at a time. Height is animated with `max-height`, which is set
  to `none` under `prefers-reduced-motion` so tests never sample a mid-animation
  value.
- **Contact details** (email/phone/address) are sample values — replace before
  launch (TC-MAN-07).
