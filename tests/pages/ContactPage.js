/** Contact page: validated form, info cards and the FAQ accordion. */
export class ContactPage {
  constructor(page, paths) {
    this.page = page;
    this.path = paths.contact;
  }

  async goto() {
    await this.page.goto(this.path);
  }

  get form() {
    return this.page.locator('#contactForm');
  }

  get name() {
    return this.page.locator('#name');
  }

  get email() {
    return this.page.locator('#email');
  }

  get track() {
    return this.page.locator('#track');
  }

  get role() {
    return this.page.locator('#role');
  }

  get message() {
    return this.page.locator('#message');
  }

  get submitButton() {
    return this.form.getByRole('button', { name: /send message|sending/i });
  }

  get invalidFields() {
    return this.page.locator('.field.invalid');
  }

  get errorMessages() {
    return this.page.locator('.field.invalid .err');
  }

  field(name) {
    return this.page.locator(`.field:has(#${name})`);
  }

  get toasts() {
    return this.page.locator('.toast-wrap .toast');
  }

  get successToast() {
    return this.page.locator('.toast-wrap .toast.success');
  }

  get errorToast() {
    return this.page.locator('.toast-wrap .toast.error');
  }

  get infoCards() {
    return this.page.locator('.info-card');
  }

  get faqItems() {
    return this.page.locator('.faq-item');
  }

  faqItem(index) {
    return this.faqItems.nth(index);
  }

  faqQuestion(index) {
    return this.faqItem(index).locator('.faq-q');
  }

  faqAnswer(index) {
    return this.faqItem(index).locator('.faq-a');
  }

  async openFaq(index) {
    await this.faqQuestion(index).click();
  }

  async fillForm({ name, email, message, track, role } = {}) {
    if (name !== undefined) await this.name.fill(name);
    if (email !== undefined) await this.email.fill(email);
    if (message !== undefined) await this.message.fill(message);
    if (track !== undefined) await this.track.selectOption(track);
    if (role !== undefined) await this.role.selectOption(role);
  }

  async submit() {
    await this.submitButton.click();
  }
}
