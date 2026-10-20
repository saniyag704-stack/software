import { expect } from '@playwright/test';

/**
 * Skills page: the assessment wizard plus the filterable skill library.
 * Both implementations share the same class names, so one locator set works.
 */
export class SkillsPage {
  constructor(page, paths) {
    this.page = page;
    this.path = paths.skills;
  }

  async goto(domain) {
    await this.page.goto(domain ? `${this.path}?domain=${domain}` : this.path);
    // The theme attribute is applied by the first effect flush, so waiting for
    // it means the app has booted (React attaches its listeners in effects).
    await this.page.locator('html[data-theme]').waitFor({ state: 'attached' });
  }

  /* ---------------------------------------------------------------- */
  /* Track picker                                                      */
  /* ---------------------------------------------------------------- */
  get tracks() {
    return this.page.locator('.domain-btn');
  }

  track(name) {
    return this.page.locator('.domain-btn', { hasText: name });
  }

  get activeTrack() {
    return this.page.locator('.domain-btn.active');
  }

  async selectTrack(name) {
    await this.track(name).click();
  }

  /* ---------------------------------------------------------------- */
  /* Quiz                                                             */
  /* ---------------------------------------------------------------- */
  get panelTitle() {
    return this.page.locator('#quizPanel .panel-head h3');
  }

  get statusBadge() {
    return this.page.locator('#quizPanel .panel-head .badge');
  }

  get progressFill() {
    return this.page.locator('.quiz-progress .track > i');
  }

  get progressLabel() {
    return this.page.locator('.quiz-progress span');
  }

  get questionCounter() {
    return this.page.locator('.q-count');
  }

  get questionText() {
    return this.page.locator('.question h3');
  }

  get options() {
    return this.page.locator('.option');
  }

  option(index) {
    return this.options.nth(index);
  }

  get nextButton() {
    return this.page.locator('.quiz-nav').getByRole('button', { name: /next question|see my result/i });
  }

  get backButton() {
    return this.page.locator('.quiz-nav').getByRole('button', { name: /^back$/i });
  }

  get correctOptions() {
    return this.page.locator('.option.correct');
  }

  get wrongOptions() {
    return this.page.locator('.option.wrong');
  }

  get toasts() {
    return this.page.locator('.toast-wrap .toast');
  }

  /** Number of questions in the current track ("Question 1 of 8 · python"). */
  async questionTotal() {
    const text = await this.questionCounter.first().innerText();
    const match = text.match(/of\s+(\d+)/i);
    return match ? Number(match[1]) : 0;
  }

  /** Clicks an option and reports whether the app marked it correct. */
  async answer(index) {
    const option = this.option(index);
    await option.click();
    return option.evaluate((el) => el.classList.contains('correct'));
  }

  /**
   * Keyboard equivalents.
   *
   * The app ignores keys once a question is answered, so re-pressing is safe —
   * which lets `toPass` absorb the window between first paint and React
   * attaching its document-level keydown listener.
   */
  async answerByKeyboard(key) {
    await expect(async () => {
      await this.page.keyboard.press(key);
      await expect(this.page.locator('.option.correct, .option.wrong').first()).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 5_000 });
  }

  async advanceByKeyboard() {
    await expect(async () => {
      await this.page.keyboard.press('Enter');
      const stillAnswered = await this.page.locator('.option.correct, .option.wrong').count();
      if (stillAnswered > 0) throw new Error('quiz did not advance');
    }).toPass({ timeout: 5_000 });
  }

  async finishByKeyboard() {
    await expect(async () => {
      await this.page.keyboard.press('Enter');
      await expect(this.page.locator('.score-ring')).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 5_000 });
  }

  /**
   * Answers every question. `pick(questionIndex)` returns the option index.
   * Returns a boolean per question so specs can compute the expected score.
   */
  async completeQuiz(pick = () => 0) {
    const total = await this.questionTotal();
    const results = [];
    for (let i = 0; i < total; i++) {
      results.push(await this.answer(pick(i)));
      await this.nextButton.click();
    }
    return results;
  }

  /* ---------------------------------------------------------------- */
  /* Result view                                                       */
  /* ---------------------------------------------------------------- */
  get resultView() {
    return this.page.locator('.score-ring');
  }

  get score() {
    return this.page.locator('.score-ring .ring-label strong');
  }

  async scoreValue() {
    return Number((await this.score.innerText()).trim());
  }

  /** The level chip in the assessment panel header (level-beginner/intermediate/advanced). */
  get levelBadge() {
    return this.page.locator('#quizPanel .panel-head .badge[class*="level-"]');
  }

  get radar() {
    return this.page.locator('.radar-wrap svg');
  }

  get resultSkills() {
    return this.page.locator('.result-skill');
  }

  get openRoadmapLink() {
    return this.page.getByRole('link', { name: /open my roadmap/i });
  }

  get retakeButton() {
    return this.page.getByRole('button', { name: /retake test/i });
  }

  get switchTrackButton() {
    return this.page.getByRole('button', { name: /try another track/i });
  }

  /* ---------------------------------------------------------------- */
  /* Skill library                                                     */
  /* ---------------------------------------------------------------- */
  get librarySearch() {
    return this.page.locator('.search-box input');
  }

  get filterChips() {
    return this.page.locator('.chips .chip');
  }

  chip(name) {
    return this.page.locator('.chips .chip', { hasText: name });
  }

  get skillCards() {
    return this.page.locator('.skill-card');
  }

  get noResults() {
    return this.page.locator('.no-results');
  }

  async search(term) {
    await this.librarySearch.fill(term);
    // The static page debounces the input by 120 ms.
    await this.page.waitForTimeout(200);
  }

  /* ---------------------------------------------------------------- */
  /* Persistence                                                       */
  /* ---------------------------------------------------------------- */
  async storedAssessment() {
    return this.page.evaluate(() => {
      const raw = localStorage.getItem('skillgps.assessment.v1');
      return raw ? JSON.parse(raw) : null;
    });
  }
}
