import { useLayoutEffect } from 'react';

/**
 * Per-route metadata for the SPA.
 *
 * The static site ships one <head> per page; the React app has a single
 * document, so each route applies its own title/description/social tags. The
 * copy mirrors the static pages exactly — keep both in sync.
 */
export const PAGE_META = {
  home: {
    path: '/',
    title: 'Skill GPS — Find your direction, master the right skills',
    description:
      'Skill GPS helps students assess their real skill level, discover a career direction and follow a step-by-step roadmap from beginner to job-ready.',
    social:
      'Take a free 2-minute skill assessment, get an honest level check and follow a personalised career roadmap.'
  },
  skills: {
    path: '/skills',
    title: 'Skill Assessment & Library — Skill GPS',
    description:
      'Test your real skill level across six career tracks, then explore 24 in-demand skills with demand scores, descriptions and learning tags.',
    social:
      '48 real questions across six tracks, instant scoring, a radar breakdown and a searchable library of in-demand skills.'
  },
  roadmap: {
    path: '/roadmap',
    title: 'Career Roadmaps — Skill GPS',
    description:
      'A phase-by-phase roadmap for six career tracks, personalised to your assessed level. Track every milestone and see how close you are to job-ready.',
    social:
      'Five phases per track, realistic timelines and milestone tracking that adapts to your skill level.'
  },
  contact: {
    path: '/contact',
    title: 'Contact & Support — Skill GPS',
    description:
      'Questions about a career track, your assessment or a roadmap? Reach the Skill GPS team, browse FAQs, or send us a message.',
    social: 'Stuck between two tracks? Send a message and a real human will reply within one working day.'
  }
};

/** Canonical site origin — override with VITE_SITE_URL when deploying elsewhere. */
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://software-4b622.web.app').replace(/\/$/, '');

/** Updates a meta tag, creating it when the document does not have one yet. */
function upsertMeta(selector, attributes, content) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

export function applyPageMeta(key) {
  const meta = PAGE_META[key];
  if (!meta || typeof document === 'undefined') return;

  document.title = meta.title;

  upsertMeta('meta[name="description"]', { name: 'description' }, meta.description);
  upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, 'Skill GPS');
  upsertMeta('meta[property="og:title"]', { property: 'og:title' }, meta.title);
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, meta.social);
  upsertMeta('meta[property="og:url"]', { property: 'og:url' }, `${SITE_URL}${meta.path}`);
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary');
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, meta.title);
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, meta.social);
}

/**
 * Applies the metadata for one route. A layout effect (not a passive effect)
 * means the tags are in place before the browser paints, so social crawlers and
 * tests never observe the previous route's title.
 */
export function usePageMeta(key) {
  useLayoutEffect(() => {
    applyPageMeta(key);
  }, [key]);
}
