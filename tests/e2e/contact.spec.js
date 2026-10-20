import { test, expect } from '../fixtures.js';

test.describe('Contact form', () => {
  test('renders the form, contact details and FAQ', async ({ page, contact }) => {
    await contact.goto();

    await expect(contact.form).toBeVisible();
    await expect(contact.name).toBeVisible();
    await expect(contact.email).toBeVisible();
    await expect(contact.message).toBeVisible();
    await expect(contact.infoCards).toHaveCount(4);
    await expect(contact.faqItems).toHaveCount(5);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/find your direction/i);
  });

  test('submitting an empty form blocks and highlights every required field', async ({ contact }) => {
    await contact.goto();
    await contact.submit();

    await expect(contact.invalidFields).toHaveCount(3);
    await expect(contact.errorMessages).toHaveCount(3);
    await expect(contact.toasts.last()).toContainText(/fix the highlighted fields/i);
    await expect(contact.name).toHaveAttribute('aria-invalid', 'true');
    await expect(contact.successToast).toHaveCount(0);
  });

  test('a malformed email is rejected', async ({ contact }) => {
    await contact.goto();
    await contact.fillForm({ name: 'Test Student', email: 'not-an-email', message: 'I need help choosing a track.' });
    await contact.submit();

    await expect(contact.invalidFields).toHaveCount(1);
    await expect(contact.field('email')).toHaveClass(/invalid/);
  });

  test('a short message is rejected', async ({ contact }) => {
    await contact.goto();
    await contact.fillForm({ name: 'Test Student', email: 'test@college.edu', message: 'too short' });
    await contact.submit();

    await expect(contact.field('message')).toHaveClass(/invalid/);
  });

  test('a valid submission confirms and resets the form', async ({ contact }) => {
    await contact.goto();
    await contact.fillForm({
      name: 'Test Student',
      email: 'test@college.edu',
      message: 'I am stuck between data science and web development — can you help me decide?',
      track: 'Data Science'
    });
    await contact.submit();

    await expect(contact.successToast).toContainText(/message sent/i);
    await expect(contact.invalidFields).toHaveCount(0);
    await expect(contact.name).toHaveValue('');
    await expect(contact.email).toHaveValue('');
    await expect(contact.message).toHaveValue('');
  });

  test('inline errors clear as soon as the field is corrected', async ({ contact }) => {
    await contact.goto();
    await contact.submit();
    await expect(contact.field('name')).toHaveClass(/invalid/);

    await contact.name.fill('Riya');
    await expect(contact.field('name')).not.toHaveClass(/invalid/);
  });
});

test.describe('FAQ accordion', () => {
  test('answers are collapsed until asked for', async ({ contact }) => {
    await contact.goto();

    await expect(contact.faqItems).toHaveCount(5);
    await expect(contact.faqQuestion(0)).toHaveAttribute('aria-expanded', 'false');
    const height = await contact.faqAnswer(0).evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBe(0);
  });

  test('clicking a question opens it and reveals the answer', async ({ contact }) => {
    await contact.goto();

    await contact.openFaq(0);

    await expect(contact.faqQuestion(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(contact.faqItem(0)).toHaveClass(/open/);
    await expect(contact.faqAnswer(0)).toContainText(/free for students/i);
    await expect
      .poll(() => contact.faqAnswer(0).evaluate((el) => el.getBoundingClientRect().height))
      .toBeGreaterThan(0);
  });

  test('opening one question closes the previous one', async ({ contact }) => {
    await contact.goto();

    await contact.openFaq(0);
    await expect(contact.faqItem(0)).toHaveClass(/open/);

    await contact.openFaq(2);
    await expect(contact.faqItem(2)).toHaveClass(/open/);
    await expect(contact.faqItem(0)).not.toHaveClass(/open/);
  });

  test('clicking an open question closes it again', async ({ contact }) => {
    await contact.goto();

    await contact.openFaq(1);
    await expect(contact.faqItem(1)).toHaveClass(/open/);

    await contact.openFaq(1);
    await expect(contact.faqItem(1)).not.toHaveClass(/open/);
    await expect(contact.faqQuestion(1)).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('Contact prefill', () => {
  test('the track is preselected from your last assessment', async ({ seedAssessment, contact }) => {
    await seedAssessment('marketing', 70, 2);
    await contact.goto();

    await expect(contact.track).toHaveValue('Digital Marketing');
  });

  test('no assessment means no preselected track', async ({ clearStorage, contact }) => {
    await clearStorage();
    await contact.goto();

    await expect(contact.track).toHaveValue('');
  });
});
