/* ==========================================================================
   Skill GPS — Contact page
   Local form validation, FAQ accordion and smart prefill.
   ========================================================================== */

(function () {
  'use strict';

  const { Store, getDomain } = window.SkillGPS;
  const { toast } = window.SkillGPSUI;

  /* ---------------- Prefill track from assessment ---------------- */
  const saved = Store.getAssessment();
  const trackSelect = document.getElementById('track');
  if (saved && trackSelect) {
    const domain = getDomain(saved.domain);
    Array.from(trackSelect.options).forEach((opt) => {
      if (opt.textContent.trim() === domain.name) trackSelect.value = opt.value || opt.textContent;
    });
  }

  /* ---------------- Form validation ---------------- */
  const form = document.getElementById('contactForm');
  if (!form) return;

  const rules = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),
    message: (v) => v.trim().length >= 10
  };

  function setError(input, invalid) {
    const field = input.closest('.field');
    if (field) field.classList.toggle('invalid', invalid);
    input.setAttribute('aria-invalid', String(invalid));
  }

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const valid = rule(input.value);
    setError(input, !valid);
    return valid;
  }

  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', () => {
      if (input.value.trim() !== '') validateField(input);
    });
    input.addEventListener('input', () => {
      if (input.closest('.field').classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    let firstInvalid = null;

    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      const ok = validateField(input);
      if (!ok) {
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!valid) {
      toast('Please fix the highlighted fields.', 'error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const btn = document.getElementById('submitBtn');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulated submission — replace with a real endpoint when you have one.
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = original;
      form.reset();
      Object.keys(rules).forEach((name) => {
        const input = form.elements[name];
        if (input) setError(input, false);
      });
      toast('Message sent. We usually reply within one working day.', 'success', 4200);
    }, 900);
  });

  /* ---------------- FAQ accordion ---------------- */
  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  function close(item) {
    item.classList.remove('open');
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    btn.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = '0px';
  }

  function open(item) {
    item.classList.add('open');
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    btn.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + 'px';
  }

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    panel.style.maxHeight = '0px';

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(close);
      if (!isOpen) open(item);
    });
  });

  // Recalculate height on resize so open answers never clip
  window.addEventListener('resize', () => {
    faqItems.forEach((item) => {
      if (item.classList.contains('open')) {
        const panel = item.querySelector('.faq-a');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();
