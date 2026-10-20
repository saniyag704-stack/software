import { test, expect } from '@playwright/test';
import {
  DOMAINS,
  ICONS,
  LEVELS,
  LEVEL_CLASS,
  Store,
  getDomain,
  skillLevel
} from '../../react-app/src/lib/data.js';

/**
 * Data-integrity suite.
 *
 * The whole site is generated from one data object, so a typo here breaks
 * every page. These checks run in Node (no browser) and are fast.
 */

const REQUIRED_DOMAIN_KEYS = [
  'id', 'name', 'short', 'icon', 'color', 'tagline', 'description',
  'demand', 'salary', 'duration', 'skills', 'quiz', 'roadmap', 'careers'
];

test.describe('Domain definitions', () => {
  test('there are six career tracks with unique ids', () => {
    expect(DOMAINS).toHaveLength(6);
    const ids = DOMAINS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(['web', 'data', 'design', 'marketing', 'ai', 'cloud']);
  });

  test('every domain carries the full set of fields', () => {
    for (const domain of DOMAINS) {
      for (const key of REQUIRED_DOMAIN_KEYS) {
        expect(domain, `${domain.id} is missing "${key}"`).toHaveProperty(key);
      }
      expect(domain.name.length, domain.id).toBeGreaterThan(3);
      expect(domain.tagline.length, domain.id).toBeGreaterThan(10);
      expect(domain.description.length, domain.id).toBeGreaterThan(40);
      expect(domain.color, domain.id).toMatch(/^#[0-9a-f]{6}$/i);
      expect(domain.icon, domain.id).toMatch(/^<svg/i);
      expect(domain.demand, domain.id).toBeGreaterThanOrEqual(0);
      expect(domain.demand, domain.id).toBeLessThanOrEqual(100);
      expect(domain.careers.length, domain.id).toBeGreaterThanOrEqual(2);
      expect(ICONS[domain.id], `ICONS.${domain.id}`).toBeTruthy();
    }
  });

  test('every domain exposes exactly four core skills', () => {
    for (const domain of DOMAINS) {
      expect(domain.skills, domain.id).toHaveLength(4);

      const ids = domain.skills.map((s) => s.id);
      expect(new Set(ids).size, `${domain.id} has duplicate skill ids`).toBe(ids.length);

      for (const skill of domain.skills) {
        expect(skill.name.length, `${domain.id}/${skill.id}`).toBeGreaterThan(2);
        expect(skill.desc.length, `${domain.id}/${skill.id}`).toBeGreaterThan(30);
        expect(Array.isArray(skill.tags), `${domain.id}/${skill.id}`).toBe(true);
        expect(skill.tags.length, `${domain.id}/${skill.id}`).toBeGreaterThanOrEqual(2);
        expect(skill.demand, `${domain.id}/${skill.id}`).toBeGreaterThan(0);
        expect(skill.demand, `${domain.id}/${skill.id}`).toBeLessThanOrEqual(100);
      }
    }
  });
});

test.describe('Assessment questions', () => {
  test('every domain has eight well-formed questions', () => {
    for (const domain of DOMAINS) {
      expect(domain.quiz, domain.id).toHaveLength(8);

      for (const [index, question] of domain.quiz.entries()) {
        const label = `${domain.id} question ${index + 1}`;

        expect(typeof question.q, label).toBe('string');
        expect(question.q.length, label).toBeGreaterThanOrEqual(12);
        expect(question.options, label).toHaveLength(4);
        expect(new Set(question.options).size, `${label} has duplicate options`).toBe(4);

        expect(Number.isInteger(question.answer), label).toBe(true);
        expect(question.answer, label).toBeGreaterThanOrEqual(0);
        expect(question.answer, label).toBeLessThan(4);

        question.options.forEach((option) => expect(option.length, label).toBeGreaterThan(0));

        const skillIds = domain.skills.map((s) => s.id);
        expect(skillIds, `${label} references an unknown skill`).toContain(question.skill);
      }
    }
  });

  test('each skill is assessed by exactly two questions', () => {
    for (const domain of DOMAINS) {
      for (const skill of domain.skills) {
        const asked = domain.quiz.filter((q) => q.skill === skill.id);
        expect(asked, `${domain.id}/${skill.id}`).toHaveLength(2);
      }
    }
  });

  test('questions are unique inside a domain', () => {
    for (const domain of DOMAINS) {
      const texts = domain.quiz.map((q) => q.q);
      expect(new Set(texts).size, domain.id).toBe(texts.length);
    }
  });
});

test.describe('Roadmaps', () => {
  test('every domain has a five-phase, level-aware roadmap', () => {
    for (const domain of DOMAINS) {
      expect(domain.roadmap, domain.id).toHaveLength(5);

      for (const [index, phase] of domain.roadmap.entries()) {
        const label = `${domain.id} phase ${index + 1}`;

        expect(phase.title.length, label).toBeGreaterThan(5);
        expect(phase.duration, label).toMatch(/week|month/i);
        expect([0, 1, 2], label).toContain(phase.minLevel);
        expect(phase.items, label).toHaveLength(4);

        phase.items.forEach((item) => expect(item.length, label).toBeGreaterThan(15));
        expect(new Set(phase.items).size, `${label} has duplicate items`).toBe(phase.items.length);
      }
    }
  });

  test('advancing phases never require a lower level than earlier ones', () => {
    for (const domain of DOMAINS) {
      const levels = domain.roadmap.map((p) => p.minLevel);
      const sorted = [...levels].sort((a, b) => a - b);
      expect(levels, `${domain.id} roadmap is not ordered by level`).toEqual(sorted);
      expect(levels[0], domain.id).toBe(0);
      expect(levels.at(-1), domain.id).toBe(2);
    }
  });
});

test.describe('Helpers', () => {
  test('skillLevel maps scores to the documented thresholds', () => {
    const cases = [
      [0, 0], [39, 0],
      [40, 1], [69, 1],
      [70, 2], [100, 2]
    ];
    for (const [score, level] of cases) {
      expect(skillLevel(score), `score ${score}`).toBe(level);
      expect(LEVELS[level], `score ${score}`).toBeTruthy();
      expect(LEVEL_CLASS[level], `score ${score}`).toBeTruthy();
    }
  });

  test('getDomain falls back to the first track for unknown ids', () => {
    expect(getDomain('data').id).toBe('data');
    expect(getDomain('nope').id).toBe(DOMAINS[0].id);
    expect(getDomain(undefined).id).toBe(DOMAINS[0].id);
  });

  test('Store degrades gracefully when storage is unavailable', () => {
    expect(Store.read('missing.key', 'fallback')).toBe('fallback');
    expect(() => Store.write('any.key', { ok: true })).not.toThrow();
    expect(Store.getAssessment()).toBeNull();
    expect(Store.getProgress()).toEqual({});
  });
});
