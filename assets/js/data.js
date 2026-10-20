/* ==========================================================================
   Skill GPS — Data layer
   Domains, assessment questions, roadmaps and the skill library.
   Exposed as window.SKILLGPS for the static pages.
   ========================================================================== */

const ICONS = {
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  data: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>',
  design: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>',
  marketing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-8-8 18-2-8-8-2z"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 15h2M20 9h2"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>'
};

const DOMAINS = [
  /* ------------------------------------------------------------------ WEB */
  {
    id: 'web',
    name: 'Web Development',
    short: 'Web Dev',
    icon: ICONS.web,
    color: '#6366f1',
    tagline: 'Build products people actually use',
    description: 'Front-end interfaces, APIs and full-stack products. The fastest route from zero to shipping real software.',
    demand: 94,
    salary: '₹6–18 LPA',
    duration: '8–10 months',
    skills: [
      { id: 'html-css', name: 'HTML & CSS', demand: 90, desc: 'Semantic markup, responsive layout, flexbox, grid and accessible styling.', tags: ['Foundation', 'Frontend', 'A11y'] },
      { id: 'javascript', name: 'JavaScript', demand: 95, desc: 'The language of the web: DOM, async, modules, and modern ES features.', tags: ['Core', 'Frontend', 'Logic'] },
      { id: 'react', name: 'React', demand: 88, desc: 'Component architecture, state management, hooks and app performance.', tags: ['Frontend', 'Framework', 'High demand'] },
      { id: 'backend', name: 'Backend & APIs', demand: 86, desc: 'REST design, authentication, databases and server-side business logic.', tags: ['Backend', 'Node', 'Database'] }
    ],
    careers: ['Frontend Developer', 'Full-Stack Engineer', 'Product Engineer'],
    quiz: [
      { q: 'Which HTML element is the most semantic choice for a page\'s primary navigation block?', options: ['<div class="nav">', '<aside>', '<nav>', '<footer>'], answer: 2, skill: 'html-css' },
      { q: 'Which CSS declaration creates a flexible, one-dimensional layout that distributes space between children?', options: ['display: grid', 'display: flex', 'position: sticky', 'float: left'], answer: 1, skill: 'html-css' },
      { q: 'In JavaScript, which array method returns a new array and does not mutate the original?', options: ['push()', 'splice()', 'map()', 'sort()'], answer: 2, skill: 'javascript' },
      { q: 'What will `const` prevent you from doing to a declared variable?', options: ['Changing its properties', 'Re-assigning the binding', 'Reading it inside a function', 'Using it in a loop'], answer: 1, skill: 'javascript' },
      { q: 'Which React hook is used to hold and update local component state?', options: ['useEffect', 'useMemo', 'useState', 'useRef'], answer: 2, skill: 'react' },
      { q: 'Why does React need a stable `key` prop when rendering a list?', options: ['To style list items', 'To identify items during reconciliation', 'To sort the list automatically', 'To make items focusable'], answer: 1, skill: 'react' },
      { q: 'Which HTTP status code should a REST API return after successfully creating a resource?', options: ['200 OK', '201 Created', '204 No Content', '302 Found'], answer: 1, skill: 'backend' },
      { q: 'A well-designed REST API is primarily built around which concept?', options: ['Session-heavy state on the server', 'Resources identified by URLs', 'Rendering HTML on the server only', 'A single POST endpoint'], answer: 1, skill: 'backend' }
    ],
    roadmap: [
      {
        phase: 'Foundation', title: 'The web, decoded', duration: '3–4 weeks', minLevel: 0,
        items: ['Learn how the browser, DNS and HTTP work', 'Write semantic HTML for a 3-page site', 'Master flexbox, grid and responsive units', 'Publish your first page with GitHub Pages']
      },
      {
        phase: 'Core language', title: 'JavaScript, properly', duration: '5–6 weeks', minLevel: 0,
        items: ['Variables, functions, arrays and objects', 'DOM events and form handling', 'Promises, async/await and fetch', 'Build a live API-powered app (weather / movies)']
      },
      {
        phase: 'Framework', title: 'React & component thinking', duration: '6–8 weeks', minLevel: 1,
        items: ['Components, props and state', 'Hooks: useState, useEffect, useMemo', 'Forms, routing and data fetching', 'Rebuild your API app in React with a clean component tree']
      },
      {
        phase: 'Backend', title: 'Full-stack capability', duration: '6–8 weeks', minLevel: 1,
        items: ['Design REST endpoints and status codes', 'Model data in SQL or MongoDB', 'JWT / session authentication and validation', 'Deploy an API and connect it to your front end']
      },
      {
        phase: 'Career', title: 'Portfolio & interviews', duration: '4–6 weeks', minLevel: 2,
        items: ['Ship 2 polished, documented projects', 'Write a README with architecture + demo', 'Practise DSA and front-end system design', 'Apply with a tailored GitHub + LinkedIn profile']
      }
    ]
  },

  /* ----------------------------------------------------------------- DATA */
  {
    id: 'data',
    name: 'Data Science',
    short: 'Data',
    icon: ICONS.data,
    color: '#22d3ee',
    tagline: 'Turn messy numbers into decisions',
    description: 'Python, statistics and SQL to clean data, find patterns and communicate insight that changes business decisions.',
    demand: 91,
    salary: '₹7–20 LPA',
    duration: '9–12 months',
    skills: [
      { id: 'python', name: 'Python', demand: 94, desc: 'Pandas, NumPy and clean, reproducible analysis notebooks.', tags: ['Core', 'Pandas', 'NumPy'] },
      { id: 'statistics', name: 'Statistics', demand: 87, desc: 'Distributions, hypothesis testing, regression and bias awareness.', tags: ['Math', 'Inference', 'Core'] },
      { id: 'sql', name: 'SQL', demand: 92, desc: 'Joins, aggregation, window functions and analytical queries.', tags: ['Database', 'Analytics', 'High demand'] },
      { id: 'visualization', name: 'Data Visualisation', demand: 84, desc: 'Charts that tell the truth: Matplotlib, Seaborn and dashboards.', tags: ['Storytelling', 'BI', 'Charts'] }
    ],
    careers: ['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst'],
    quiz: [
      { q: 'Which Python library is the standard for working with tabular DataFrames?', options: ['requests', 'pandas', 'flask', 'beautifulsoup'], answer: 1, skill: 'python' },
      { q: 'What is the result of `[x * 2 for x in range(3)]`?', options: ['[0, 1, 2]', '[2, 4, 6]', '[0, 2, 4]', '[1, 2, 3]'], answer: 2, skill: 'python' },
      { q: 'What is the mean of the values 2, 4, 6 and 8?', options: ['4', '5', '6', '20'], answer: 1, skill: 'statistics' },
      { q: 'A p-value tells you the probability of observing results at least this extreme when…', options: ['The null hypothesis is true', 'The alternative is true', 'The sample is biased', 'The data is normal'], answer: 0, skill: 'statistics' },
      { q: 'Which JOIN keeps every row from the left table, even when there is no match?', options: ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'], answer: 1, skill: 'sql' },
      { q: 'Which clause groups rows so aggregates like SUM and AVG can be computed per category?', options: ['ORDER BY', 'HAVING', 'GROUP BY', 'DISTINCT'], answer: 2, skill: 'sql' },
      { q: 'Which chart is best for showing the distribution of a single numeric variable?', options: ['Pie chart', 'Histogram', 'Stacked area chart', 'Bubble chart'], answer: 1, skill: 'visualization' },
      { q: 'Truncating the y-axis of a bar chart usually causes what problem?', options: ['Faster rendering', 'Exaggerated differences and misleading insight', 'Better colour contrast', 'More readable labels'], answer: 1, skill: 'visualization' }
    ],
    roadmap: [
      {
        phase: 'Foundation', title: 'Python & spreadsheets', duration: '3–4 weeks', minLevel: 0,
        items: ['Python syntax, lists, dicts, functions', 'Clean and reshape a messy CSV with pandas', 'Pivot tables and formulas in Sheets/Excel', 'Write your first exploratory analysis notebook']
      },
      {
        phase: 'Statistics', title: 'Thinking in uncertainty', duration: '5–6 weeks', minLevel: 0,
        items: ['Descriptive stats and distributions', 'Sampling, confidence intervals and p-values', 'Correlation vs causation and common biases', 'A/B test design and interpretation']
      },
      {
        phase: 'SQL', title: 'Query real databases', duration: '4–5 weeks', minLevel: 1,
        items: ['SELECT, WHERE, ORDER BY and joins', 'GROUP BY, HAVING and subqueries', 'Window functions for running totals', 'Solve 40+ practice queries on a public dataset']
      },
      {
        phase: 'Analysis', title: 'End-to-end projects', duration: '6–8 weeks', minLevel: 1,
        items: ['Feature engineering and data cleaning pipelines', 'Regression and classification with scikit-learn', 'Build a dashboard in Power BI or Streamlit', 'Write an insight memo for a non-technical reader']
      },
      {
        phase: 'Career', title: 'Portfolio & interviews', duration: '4–6 weeks', minLevel: 2,
        items: ['Publish 2 case studies with business impact', 'Practise SQL and stats interview questions', 'Present a 5-minute insight story', 'Target analyst roles with a focused resume']
      }
    ]
  },

  /* --------------------------------------------------------------- DESIGN */
  {
    id: 'design',
    name: 'UI/UX Design',
    short: 'UI/UX',
    icon: ICONS.design,
    color: '#f472b6',
    tagline: 'Design products that feel effortless',
    description: 'Research, wireframes, visual systems and prototypes. Learn to solve user problems, not just make screens pretty.',
    demand: 86,
    salary: '₹5–16 LPA',
    duration: '7–9 months',
    skills: [
      { id: 'research', name: 'User Research', demand: 82, desc: 'Interviews, usability tests and turning observations into insight.', tags: ['Discovery', 'Testing', 'Strategy'] },
      { id: 'wireframe', name: 'Wireframing & Flows', demand: 85, desc: 'Information architecture, user flows and low-fidelity structure.', tags: ['Structure', 'IA', 'Figma'] },
      { id: 'visual', name: 'Visual Design', demand: 88, desc: 'Type, colour, spacing, hierarchy and accessible contrast.', tags: ['Craft', 'Typography', 'A11y'] },
      { id: 'prototyping', name: 'Prototyping', demand: 83, desc: 'Interactive Figma prototypes, design systems and handoff.', tags: ['Figma', 'Systems', 'Handoff'] }
    ],
    careers: ['Product Designer', 'UX Designer', 'UI Designer'],
    quiz: [
      { q: 'Which stage comes first in the design-thinking process?', options: ['Prototype', 'Ideate', 'Empathise', 'Test'], answer: 2, skill: 'research' },
      { q: 'What is the best way to validate whether users understand a new flow?', options: ['Ask teammates their opinion', 'Run a moderated usability test', 'Add more animations', 'Increase brand colours'], answer: 1, skill: 'research' },
      { q: 'What is the main purpose of a low-fidelity wireframe?', options: ['Final visual polish', 'Fast exploration of layout and structure', 'Production-ready code', 'Brand illustration'], answer: 1, skill: 'wireframe' },
      { q: 'A user flow describes…', options: ['The colours used per screen', 'The path a user takes to complete a task', 'The server architecture', 'The typography scale'], answer: 1, skill: 'wireframe' },
      { q: 'WCAG AA requires a contrast ratio of at least what for normal body text?', options: ['2:1', '3:1', '4.5:1', '7:1'], answer: 2, skill: 'visual' },
      { q: 'Why do design systems commonly use an 8-point spacing grid?', options: ['It looks more creative', 'It creates consistent, predictable rhythm', 'It reduces file size', 'It is required by Figma'], answer: 1, skill: 'visual' },
      { q: 'Which prototype is most useful for testing interaction and navigation?', options: ['A static style tile', 'A clickable high-fidelity prototype', 'A printed sitemap', 'A mood board'], answer: 1, skill: 'prototyping' },
      { q: 'A design system primarily gives a team…', options: ['A single font choice', 'Reusable components, tokens and rules', 'A marketing plan', 'A research repository'], answer: 1, skill: 'prototyping' }
    ],
    roadmap: [
      {
        phase: 'Foundation', title: 'Design fundamentals', duration: '3–4 weeks', minLevel: 0,
        items: ['Learn hierarchy, spacing and alignment', 'Study type scales and colour theory', 'Recreate 3 screens from apps you love', 'Set up Figma: frames, auto-layout, components']
      },
      {
        phase: 'Structure', title: 'Flows & wireframes', duration: '4–5 weeks', minLevel: 0,
        items: ['Map user journeys for a real product', 'Sketch low-fidelity wireframes on paper', 'Build information architecture and sitemaps', 'Turn one flow into a clickable wireframe']
      },
      {
        phase: 'Research', title: 'Talk to real users', duration: '4–5 weeks', minLevel: 1,
        items: ['Write a discussion guide and interview 5 users', 'Run a usability test and log friction points', 'Synthesise findings into an affinity map', 'Redesign based on evidence, not taste']
      },
      {
        phase: 'Systems', title: 'Visual craft & systems', duration: '6–7 weeks', minLevel: 1,
        items: ['Build a 12-column responsive layout system', 'Create tokens for colour, type and spacing', 'Design accessible states and dark mode', 'Ship a component library in Figma']
      },
      {
        phase: 'Career', title: 'Case studies & interviews', duration: '4–6 weeks', minLevel: 2,
        items: ['Write 2 case studies: problem → process → outcome', 'Publish a polished portfolio site', 'Practise whiteboard design challenges', 'Ask for feedback from working designers']
      }
    ]
  },

  /* ------------------------------------------------------------ MARKETING */
  {
    id: 'marketing',
    name: 'Digital Marketing',
    short: 'Marketing',
    icon: ICONS.marketing,
    color: '#fbbf24',
    tagline: 'Grow audiences, measure everything',
    description: 'SEO, content, paid ads and analytics. Learn the growth loop behind products people actually find.',
    demand: 88,
    salary: '₹4–14 LPA',
    duration: '6–8 months',
    skills: [
      { id: 'seo', name: 'SEO', demand: 86, desc: 'Search intent, on-page structure, technical basics and links.', tags: ['Organic', 'Search', 'Content'] },
      { id: 'content', name: 'Content Strategy', demand: 84, desc: 'Editorial calendars, copywriting, hooks and distribution.', tags: ['Copy', 'Social', 'Planning'] },
      { id: 'ads', name: 'Paid Ads', demand: 82, desc: 'Campaign structure, targeting, creative testing and budgets.', tags: ['Meta', 'Google', 'Growth'] },
      { id: 'analytics', name: 'Analytics', demand: 89, desc: 'GA4, events, funnels, attribution and honest reporting.', tags: ['GA4', 'Data', 'ROI'] }
    ],
    careers: ['Digital Marketing Executive', 'Growth Marketer', 'SEO Specialist'],
    quiz: [
      { q: 'What does a canonical tag tell search engines?', options: ['Which page is the preferred version of duplicate content', 'Which keywords to rank for', 'That a page should be de-indexed', 'How fast a page loads'], answer: 0, skill: 'seo' },
      { q: 'In SEO, a backlink is valuable mainly because it…', options: ['Increases page weight', 'Signals trust and authority to search engines', 'Adds a navigation menu', 'Improves image compression'], answer: 1, skill: 'seo' },
      { q: 'What is the main job of a content calendar?', options: ['Automatically write posts', 'Plan and sequence publishing consistently', 'Boost ad spend', 'Replace keyword research'], answer: 1, skill: 'content' },
      { q: 'In a landing page, the CTA should primarily be…', options: ['Hidden below the footer', 'One clear next action with a strong verb', 'As many links as possible', 'Only an image'], answer: 1, skill: 'content' },
      { q: 'Click-through rate (CTR) is calculated as…', options: ['Clicks ÷ impressions × 100', 'Impressions ÷ clicks', 'Spend ÷ clicks', 'Clicks × conversions'], answer: 0, skill: 'ads' },
      { q: 'ROAS measures…', options: ['Revenue generated per unit of ad spend', 'Cost per thousand impressions', 'Organic traffic growth', 'Email open rate'], answer: 0, skill: 'ads' },
      { q: 'Which metric describes visitors who leave after viewing only one page?', options: ['Conversion rate', 'Bounce rate', 'Retention rate', 'Frequency'], answer: 1, skill: 'analytics' },
      { q: 'UTM parameters are used to…', options: ['Compress images', 'Tag campaign traffic so it can be attributed', 'Encrypt analytics data', 'Improve page speed'], answer: 1, skill: 'analytics' }
    ],
    roadmap: [
      {
        phase: 'Foundation', title: 'Marketing fundamentals', duration: '3 weeks', minLevel: 0,
        items: ['Understand funnel stages and positioning', 'Learn audience and competitor research', 'Set up GA4 on a real website', 'Define one north-star metric']
      },
      {
        phase: 'SEO', title: 'Earn organic traffic', duration: '5–6 weeks', minLevel: 0,
        items: ['Keyword research by search intent', 'On-page structure: titles, headings, internal links', 'Technical basics: sitemap, indexing, speed', 'Publish 4 optimised articles and track rankings']
      },
      {
        phase: 'Content', title: 'Create & distribute', duration: '4–5 weeks', minLevel: 1,
        items: ['Build a 30-day content calendar', 'Write hooks, headlines and landing copy', 'Repurpose one asset across 3 channels', 'Run an email capture and welcome sequence']
      },
      {
        phase: 'Paid', title: 'Ads that pay back', duration: '5–6 weeks', minLevel: 1,
        items: ['Set up a Meta or Google campaign with a small budget', 'Test 5 creatives and 3 audiences', 'Track CTR, CPC, CPA and ROAS', 'Kill losers, scale the winning combination']
      },
      {
        phase: 'Career', title: 'Proof & positioning', duration: '3–4 weeks', minLevel: 2,
        items: ['Document 2 growth case studies with numbers', 'Build a personal brand on LinkedIn', 'Get a free certification (Google, HubSpot)', 'Pitch freelance or internship work']
      }
    ]
  },

  /* ------------------------------------------------------------------- AI */
  {
    id: 'ai',
    name: 'AI & Machine Learning',
    short: 'AI / ML',
    icon: ICONS.ai,
    color: '#8b5cf6',
    tagline: 'Teach machines to find the pattern',
    description: 'Math, models and modern AI engineering. From classical ML to shipping LLM-powered products responsibly.',
    demand: 96,
    salary: '₹8–28 LPA',
    duration: '10–14 months',
    skills: [
      { id: 'math', name: 'Math & Probability', demand: 85, desc: 'Linear algebra, calculus and probability behind every model.', tags: ['Math', 'Core', 'Theory'] },
      { id: 'python-ml', name: 'Python for ML', demand: 95, desc: 'NumPy, pandas, scikit-learn and experiment workflows.', tags: ['Python', 'scikit-learn', 'Data'] },
      { id: 'modeling', name: 'Model Building', demand: 93, desc: 'Regression, trees, neural networks and evaluation strategy.', tags: ['ML', 'Deep learning', 'Evaluation'] },
      { id: 'mlops', name: 'ML Engineering', demand: 88, desc: 'Serving models, monitoring, prompt pipelines and cost control.', tags: ['MLOps', 'APIs', 'LLM'] }
    ],
    careers: ['ML Engineer', 'AI Engineer', 'Data Scientist (ML)'],
    quiz: [
      { q: 'What is the derivative of x² with respect to x?', options: ['x', '2x', 'x³/3', '2'], answer: 1, skill: 'math' },
      { q: 'Gradient descent iteratively adjusts parameters to…', options: ['Maximise the dataset size', 'Minimise a loss function', 'Increase model depth', 'Remove outliers'], answer: 1, skill: 'math' },
      { q: 'Which library is the standard starting point for classical machine learning in Python?', options: ['Django', 'scikit-learn', 'Pygame', 'Requests'], answer: 1, skill: 'python-ml' },
      { q: 'Why do we split data into training and test sets?', options: ['To train faster', 'To estimate performance on unseen data', 'To reduce disk usage', 'To balance class labels'], answer: 1, skill: 'python-ml' },
      { q: 'A model that performs excellently on training data but poorly on new data is…', options: ['Underfitting', 'Overfitting', 'Regularised', 'Stationary'], answer: 1, skill: 'modeling' },
      { q: 'For a highly imbalanced classification problem, which metric is usually more informative than accuracy?', options: ['Mean squared error', 'F1 score or recall', 'R² score', 'Learning rate'], answer: 1, skill: 'modeling' },
      { q: 'Data leakage happens when…', options: ['Training data is too large', 'Information from the test set influences training', 'A model is deployed to production', 'Features are normalised'], answer: 1, skill: 'mlops' },
      { q: 'In production, "inference" refers to…', options: ['Training on new data', 'Generating predictions from a trained model', 'Cleaning the dataset', 'Tuning hyperparameters'], answer: 1, skill: 'mlops' }
    ],
    roadmap: [
      {
        phase: 'Foundation', title: 'Python & math', duration: '5–6 weeks', minLevel: 0,
        items: ['Python, NumPy and pandas fluency', 'Linear algebra: vectors, matrices, dot products', 'Probability, distributions and Bayes', 'Calculus intuition for gradients']
      },
      {
        phase: 'Classical ML', title: 'First real models', duration: '6–8 weeks', minLevel: 0,
        items: ['Linear and logistic regression from scratch', 'Decision trees, random forests, gradient boosting', 'Cross-validation and proper metrics', 'Feature engineering on a tabular dataset']
      },
      {
        phase: 'Deep learning', title: 'Neural networks', duration: '8–10 weeks', minLevel: 1,
        items: ['Backpropagation and optimisers', 'Build an image classifier with PyTorch', 'Sequence models and attention', 'Fine-tune a small transformer model']
      },
      {
        phase: 'AI engineering', title: 'Ship it', duration: '6–8 weeks', minLevel: 1,
        items: ['Retrieval-augmented generation with embeddings', 'Wrap a model in a FastAPI service', 'Evaluate quality, latency and cost', 'Add guardrails and monitoring']
      },
      {
        phase: 'Career', title: 'Research to résumé', duration: '5–6 weeks', minLevel: 2,
        items: ['Publish 2 projects with clear evaluation tables', 'Replicate one paper or Kaggle solution', 'Practise ML system design interviews', 'Contribute to an open-source model or dataset']
      }
    ]
  },

  /* ---------------------------------------------------------------- CLOUD */
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    short: 'Cloud',
    icon: ICONS.cloud,
    color: '#34d399',
    tagline: 'Ship safely, scale calmly',
    description: 'Linux, containers and cloud infrastructure. The invisible engine that keeps modern products online.',
    demand: 90,
    salary: '₹6–22 LPA',
    duration: '8–11 months',
    skills: [
      { id: 'linux', name: 'Linux & Networking', demand: 88, desc: 'Shell, processes, permissions, DNS and HTTP fundamentals.', tags: ['OS', 'Shell', 'Network'] },
      { id: 'git', name: 'Git & CI/CD', demand: 92, desc: 'Branching, pull requests and automated build/test pipelines.', tags: ['Version control', 'Automation', 'Core'] },
      { id: 'containers', name: 'Containers', demand: 91, desc: 'Docker images, compose and orchestration with Kubernetes.', tags: ['Docker', 'K8s', 'High demand'] },
      { id: 'cloud-infra', name: 'Cloud Infrastructure', demand: 93, desc: 'AWS/GCP core services, IaC with Terraform and observability.', tags: ['AWS', 'Terraform', 'SRE'] }
    ],
    careers: ['DevOps Engineer', 'Cloud Engineer', 'Site Reliability Engineer'],
    quiz: [
      { q: 'In Linux, what does the permission set 755 grant the owner?', options: ['Read only', 'Read and write only', 'Read, write and execute', 'No permissions'], answer: 2, skill: 'linux' },
      { q: 'Which command shows currently running processes with live resource usage?', options: ['ls -la', 'top', 'grep', 'chmod'], answer: 1, skill: 'linux' },
      { q: 'What is the main difference between git merge and git rebase?', options: ['Merge rewrites history; rebase preserves it', 'Rebase replays commits onto another base; merge creates a merge commit', 'They are identical', 'Rebase only works on remote branches'], answer: 1, skill: 'git' },
      { q: 'A Git branch is best described as…', options: ['A copy of the whole repository', 'A movable pointer to a commit', 'A backup server', 'A type of tag'], answer: 1, skill: 'git' },
      { q: 'A Docker image is to a container as…', options: ['A running process is to a file', 'A class is to an instance', 'A server is to a network', 'A script is to a shell'], answer: 1, skill: 'containers' },
      { q: 'What is the purpose of a Dockerfile?', options: ['To run the container', 'To define the steps that build an image', 'To expose a port', 'To store secrets'], answer: 1, skill: 'containers' },
      { q: 'Auto-scaling automatically adjusts…', options: ['The source code quality', 'The number of running instances based on load', 'The database schema', 'The DNS registrar'], answer: 1, skill: 'cloud-infra' },
      { q: 'Infrastructure as Code (IaC) means…', options: ['Writing application logic in YAML', 'Managing infrastructure through versioned config files', 'Hosting code on a server', 'Compiling infrastructure'], answer: 1, skill: 'cloud-infra' }
    ],
    roadmap: [
      {
        phase: 'Foundation', title: 'Linux & the network', duration: '4–5 weeks', minLevel: 0,
        items: ['Shell navigation, files and permissions', 'Processes, services and logs', 'DNS, HTTP, ports and TLS basics', 'Set up a cloud VM and SSH into it']
      },
      {
        phase: 'Version control', title: 'Git & automation', duration: '3–4 weeks', minLevel: 0,
        items: ['Branching, rebasing and pull requests', 'Write a CI workflow that runs tests', 'Add linting and build steps', 'Automate a deploy on merge']
      },
      {
        phase: 'Containers', title: 'Package everything', duration: '5–6 weeks', minLevel: 1,
        items: ['Write efficient multi-stage Dockerfiles', 'Compose an app + database stack', 'Push images to a registry', 'Deploy a container to a managed runtime']
      },
      {
        phase: 'Cloud', title: 'Infrastructure & scale', duration: '6–8 weeks', minLevel: 1,
        items: ['Core AWS/GCP compute, storage and networking', 'Provision with Terraform, not clicks', 'Set up monitoring, alerts and budgets', 'Design a highly available architecture']
      },
      {
        phase: 'Career', title: 'Reliability & roles', duration: '4–5 weeks', minLevel: 2,
        items: ['Document an incident and post-mortem', 'Define SLIs, SLOs and error budgets', 'Build a project with CI/CD + IaC in one repo', 'Prepare for cloud certification + interviews']
      }
    ]
  }
];

/* --------------------------------------------------------------------------
   Helpers shared across pages
   -------------------------------------------------------------------------- */
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LEVEL_CLASS = ['level-beginner', 'level-intermediate', 'level-advanced'];

const Store = {
  KEY_TEST: 'skillgps.assessment.v1',
  KEY_PROGRESS: 'skillgps.progress.v1',
  KEY_THEME: 'skillgps.theme',

  read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked */ }
  },
  getAssessment() { return this.read(this.KEY_TEST, null); },
  setAssessment(data) { this.write(this.KEY_TEST, data); },
  getProgress() { return this.read(this.KEY_PROGRESS, {}); },
  setProgress(data) { this.write(this.KEY_PROGRESS, data); }
};

function getDomain(id) {
  return DOMAINS.find((d) => d.id === id) || DOMAINS[0];
}

function skillLevel(score) {
  if (score >= 70) return 2;
  if (score >= 40) return 1;
  return 0;
}

const SkillGPS = { DOMAINS, ICONS, LEVELS, LEVEL_CLASS, Store, getDomain, skillLevel };
window.SkillGPS = SkillGPS;
