import { test, expect, levelFor, pageUrl } from '../fixtures.js';
import { DOMAIN_NAMES } from '../paths.js';

test.describe('Skill assessment', () => {
  test('lists every career track and starts on Web Development', async ({ skills }) => {
    await skills.goto();

    await expect(skills.tracks).toHaveCount(6);
    await expect(skills.activeTrack).toContainText('Web Development');
    await expect(skills.panelTitle).toContainText('Web Development assessment');
    await expect(skills.questionCounter).toContainText('Question 1 of 8');
    await expect(skills.options).toHaveCount(4);
  });

  test('a ?domain= deep link preselects that track', async ({ skills }) => {
    await skills.goto('cloud');

    await expect(skills.activeTrack).toContainText('Cloud & DevOps');
    await expect(skills.panelTitle).toContainText('Cloud & DevOps');
    await expect(skills.questionCounter).toContainText('1 of 8');
  });

  test('switching track restarts the quiz from question 1', async ({ skills }) => {
    await skills.goto();
    await skills.answer(0);
    await skills.nextButton.click();
    await expect(skills.questionCounter).toContainText('Question 2 of 8');

    await skills.selectTrack('UI/UX Design');
    await expect(skills.questionCounter).toContainText('Question 1 of 8');
    await expect(skills.panelTitle).toContainText('UI/UX Design');
    await expect(skills.backButton).toBeDisabled();
    await expect(skills.nextButton).toBeDisabled();
  });

  test('Next stays disabled until an option is chosen', async ({ skills }) => {
    await skills.goto();

    await expect(skills.backButton).toBeDisabled();
    await expect(skills.nextButton).toBeDisabled();

    await skills.answer(1);
    await expect(skills.nextButton).toBeEnabled();
    await expect(skills.progressLabel).toContainText('%');
  });

  test('answering gives immediate correct/incorrect feedback', async ({ skills }) => {
    await skills.goto();

    // Option 2 (index 1) is wrong for the first Web Development question.
    const correct = await skills.answer(1);
    expect(correct).toBe(false);
    await expect(skills.correctOptions).toHaveCount(1);
    await expect(skills.wrongOptions).toHaveCount(1);
    await expect(skills.toasts.last()).toContainText(/not quite/i);

    // Locked: options are disabled once answered.
    await expect(skills.option(0)).toBeDisabled();
  });

  test('a correct answer is confirmed with a toast', async ({ skills }) => {
    await skills.goto();

    const correct = await skills.answer(2);
    expect(correct).toBe(true);
    await expect(skills.correctOptions).toHaveCount(1);
    await expect(skills.wrongOptions).toHaveCount(0);
    await expect(skills.toasts.last()).toContainText(/correct/i);
  });

  test('keyboard shortcuts answer and advance the quiz', async ({ skills }) => {
    await skills.goto();

    // "b" picks option 2, which is wrong for the first Web Development question.
    await skills.answerByKeyboard('b');
    await expect(skills.wrongOptions).toHaveCount(1);
    await expect(skills.correctOptions).toHaveCount(1); // the right answer is revealed too
    await expect(skills.nextButton).toBeEnabled();

    await skills.advanceByKeyboard();
    await expect(skills.questionCounter).toContainText('Question 2 of 8');
  });

  test('progress bar advances as questions are answered', async ({ skills }) => {
    await skills.goto();
    await expect(skills.progressFill).toHaveCSS('width', '0px');

    await skills.answer(0);
    const afterOne = await skills.progressFill.evaluate((el) => el.style.width);
    expect(parseFloat(afterOne)).toBeGreaterThan(0);

    await skills.nextButton.click();
    const afterTwo = await skills.progressFill.evaluate((el) => el.style.width);
    expect(parseFloat(afterTwo)).toBeGreaterThanOrEqual(parseFloat(afterOne));
  });

  test('the Back button returns to the previous question', async ({ skills }) => {
    await skills.goto();
    await skills.answer(0);
    await skills.nextButton.click();
    await expect(skills.questionCounter).toContainText('Question 2');

    await skills.backButton.click();
    await expect(skills.questionCounter).toContainText('Question 1');
    await expect(skills.nextButton).toBeEnabled();
  });
});

test.describe('Assessment results', () => {
  test('a zero-score run reports Beginner and stores the result', async ({ page, skills }) => {
    await skills.goto();
    const results = await skills.completeQuiz(() => 0);
    const correct = results.filter(Boolean).length;
    const score = Math.round((correct / results.length) * 100);

    await expect(skills.resultView).toBeVisible();
    expect(await skills.scoreValue()).toBe(score);
    await expect(skills.levelBadge).toContainText(levelFor(score));
    await expect(skills.radar).toBeVisible();
    await expect(skills.resultSkills).toHaveCount(4);

    const stored = await skills.storedAssessment();
    expect(stored).toMatchObject({ domain: 'web', score, total: 8 });
    expect(stored.skills).toHaveLength(4);

    await page.reload();
    await expect(skills.resultView).toBeVisible();
    expect(await skills.scoreValue()).toBe(score);
  });

  test('a perfect run reports Advanced with full skill bars', async ({ page, skills }) => {
    await skills.goto('ai');

    // Option index 1 is correct for every AI & ML question.
    const results = await skills.completeQuiz(() => 1);
    expect(results.every(Boolean)).toBe(true);

    expect(await skills.scoreValue()).toBe(100);
    await expect(skills.levelBadge).toContainText('Advanced');
    await expect(page.locator('#quizPanel .panel-head .badge')).toContainText('Advanced');

    const barWidths = await skills.resultSkills.locator('.bar > span').evaluateAll((bars) =>
      bars.map((b) => parseFloat(b.style.width))
    );
    expect(barWidths).toEqual([100, 100, 100, 100]);
  });

  test('Retake test returns to the first question', async ({ skills }) => {
    await skills.goto();
    await skills.completeQuiz(() => 0);
    await expect(skills.resultView).toBeVisible();

    await skills.retakeButton.click();
    await expect(skills.resultView).toHaveCount(0);
    await expect(skills.questionCounter).toContainText('Question 1 of 8');
    await expect(skills.nextButton).toBeDisabled();
  });

  test('the result links to the matching roadmap', async ({ page, skills, paths }) => {
    await skills.goto('data');
    await skills.completeQuiz(() => 0);

    await expect(skills.openRoadmapLink).toHaveAttribute('href', /domain=data/);
    await skills.openRoadmapLink.click();

    await expect(page).toHaveURL(pageUrl(paths.roadmap));
    expect(page.url()).toContain('domain=data');
  });
});

test.describe('Skill library', () => {
  test('renders every skill from all tracks', async ({ page, skills }) => {
    await skills.goto();

    await expect(skills.skillCards).toHaveCount(24);
    await expect(page.locator('#library .toolbar .badge')).toContainText('24 skills');
    await expect(skills.filterChips).toHaveCount(7); // All skills + 6 tracks
  });

  test('search narrows the list and can be cleared', async ({ skills }) => {
    await skills.goto();

    await skills.search('python');
    const matches = await skills.skillCards.count();
    expect(matches).toBeGreaterThan(0);
    expect(matches).toBeLessThan(24);
    expect(await skills.skillCards.first().innerText()).toMatch(/python/i);

    await skills.search('zzzzz');
    await expect(skills.skillCards).toHaveCount(0);
    await expect(skills.noResults).toBeVisible();

    await skills.search('');
    await expect(skills.skillCards).toHaveCount(24);
  });

  test('track chips filter the library', async ({ page, skills }) => {
    await skills.goto();

    await skills.chip('Marketing').click();
    await expect(skills.skillCards).toHaveCount(4);
    await expect(page.locator('#library .toolbar .badge')).toContainText('4 skills');

    await skills.chip('All skills').click();
    await expect(skills.skillCards).toHaveCount(24);
  });

  test('search combines with the active filter', async ({ skills }) => {
    await skills.goto();

    await skills.chip('Data').click();
    await skills.search('sql');
    await expect(skills.skillCards).toHaveCount(1);
    await expect(skills.skillCards.first()).toContainText('SQL');
  });
});
