/**
 * Route table.
 *
 * The static site uses real files (skills.html) while the React app uses
 * clean routes (/skills). Specs stay identical because they never hard-code a
 * URL — they ask for a logical page name instead.
 */
export const PATHS = {
  static: {
    home: '/index.html',
    skills: '/skills.html',
    roadmap: '/roadmap.html',
    contact: '/contact.html'
  },
  react: {
    home: '/',
    skills: '/skills',
    roadmap: '/roadmap',
    contact: '/contact'
  }
};

export function pathsFor(projectName) {
  return PATHS[projectName] ?? PATHS.static;
}

export const DOMAIN_NAMES = {
  web: 'Web Development',
  data: 'Data Science',
  design: 'UI/UX Design',
  marketing: 'Digital Marketing',
  ai: 'AI & Machine Learning',
  cloud: 'Cloud & DevOps'
};

/** Skill ids per domain — used to seed a realistic assessment payload. */
export const DOMAIN_SKILLS = {
  web: [['html-css', 'HTML & CSS'], ['javascript', 'JavaScript'], ['react', 'React'], ['backend', 'Backend & APIs']],
  data: [['python', 'Python'], ['statistics', 'Statistics'], ['sql', 'SQL'], ['visualization', 'Data Visualisation']],
  design: [['research', 'User Research'], ['wireframe', 'Wireframing & Flows'], ['visual', 'Visual Design'], ['prototyping', 'Prototyping']],
  marketing: [['seo', 'SEO'], ['content', 'Content Strategy'], ['ads', 'Paid Ads'], ['analytics', 'Analytics']],
  ai: [['math', 'Math & Probability'], ['python-ml', 'Python for ML'], ['modeling', 'Model Building'], ['mlops', 'ML Engineering']],
  cloud: [['linux', 'Linux & Networking'], ['git', 'Git & CI/CD'], ['containers', 'Containers'], ['cloud-infra', 'Cloud Infrastructure']]
};

export const STORAGE = {
  assessment: 'skillgps.assessment.v1',
  progress: 'skillgps.progress.v1',
  theme: 'skillgps.theme'
};

/**
 * Builds an assessment payload in the exact shape the app expects.
 * `score` drives the level unless `level` is given explicitly.
 */
export function assessmentPayload(domain = 'web', score = 100, level) {
  const resolvedLevel = level ?? (score >= 70 ? 2 : score >= 40 ? 1 : 0);
  const skills = DOMAIN_SKILLS[domain] ?? DOMAIN_SKILLS.web;
  return {
    domain,
    domainName: DOMAIN_NAMES[domain] ?? 'Web Development',
    score,
    correct: Math.round((score / 100) * 8),
    total: 8,
    level: resolvedLevel,
    skills: skills.map(([id, name]) => ({ id, name, score })),
    date: new Date('2026-01-15T10:00:00.000Z').toISOString()
  };
}
