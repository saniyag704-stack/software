/* ==========================================================================
   Skill GPS — Skills page
   Assessment engine, radar result view and the filterable skill library.
   ========================================================================== */

(function () {
  'use strict';

  const { DOMAINS, Store, LEVELS, LEVEL_CLASS, getDomain, skillLevel } = window.SkillGPS;
  const { toast } = window.SkillGPSUI;

  const domainList = document.getElementById('domainList');
  const quizBody = document.getElementById('quizBody');
  const quizTitle = document.getElementById('quizTitle');
  const quizStatus = document.getElementById('quizStatus');
  if (!domainList || !quizBody) return;

  const params = new URLSearchParams(location.search);
  const saved = Store.getAssessment();

  const state = {
    domainId: params.get('domain') || (saved && saved.domain) || DOMAINS[0].id,
    index: 0,
    answers: [],
    locked: false,
    view: saved && saved.domain === (params.get('domain') || saved.domain) ? 'result' : 'quiz',
    result: saved && saved.domain === (params.get('domain') || saved.domain) ? saved : null
  };

  if (!getDomain(state.domainId)) state.domainId = DOMAINS[0].id;

  /* ------------------------------------------------------------------ */
  /* Domain switcher                                                     */
  /* ------------------------------------------------------------------ */
  function renderDomains() {
    domainList.innerHTML = DOMAINS.map((d) => `
      <button class="domain-btn ${d.id === state.domainId ? 'active' : ''}"
              data-domain="${d.id}" role="tab" aria-selected="${d.id === state.domainId}" style="--dc:${d.color}">
        <span class="db-icon">${d.icon}</span>
        <span class="db-text"><b>${d.name}</b><span>${d.skills.length} skills · ${d.duration}</span></span>
      </button>
    `).join('');
  }

  function selectDomain(id, { keepResult = false } = {}) {
    state.domainId = id;
    const existing = Store.getAssessment();
    if (!keepResult && existing && existing.domain === id) {
      state.view = 'result';
      state.result = existing;
    } else {
      state.view = 'quiz';
      state.result = null;
      state.index = 0;
      state.answers = [];
      state.locked = false;
    }
    renderDomains();
    render();
  }

  domainList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-domain]');
    if (!btn) return;
    selectDomain(btn.dataset.domain);
    document.getElementById('quizPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ------------------------------------------------------------------ */
  /* Quiz                                                                */
  /* ------------------------------------------------------------------ */
  const KEYS = ['A', 'B', 'C', 'D'];

  function renderQuiz() {
    const domain = getDomain(state.domainId);
    const total = domain.quiz.length;
    const q = domain.quiz[state.index];
    const answered = state.answers[state.index];
    const locked = answered !== undefined;

    quizTitle.textContent = `${domain.name} assessment`;
    quizStatus.textContent = `${state.index + 1} / ${total}`;
    quizStatus.className = 'badge badge-accent';

    const progress = ((state.index + (locked ? 1 : 0)) / total) * 100;

    quizBody.innerHTML = `
      <div class="quiz-progress">
        <div class="track"><i style="width:${progress}%"></i></div>
        <span>${Math.round(progress)}%</span>
      </div>

      <div class="question">
        <div class="q-count">Question ${state.index + 1} of ${total} · ${q.skill.replace('-', ' ')}</div>
        <h3>${q.q}</h3>
        <div class="options">
          ${q.options.map((opt, i) => {
            let cls = 'option';
            if (locked) {
              if (i === q.answer) cls += ' correct';
              else if (i === answered) cls += ' wrong';
              else cls += ' dim';
            }
            return `<button class="${cls}" data-option="${i}" ${locked ? 'disabled' : ''}>
              <span class="key">${KEYS[i]}</span>
              <span>${opt}</span>
            </button>`;
          }).join('')}
        </div>
      </div>

      <div class="quiz-nav">
        <button class="btn btn-ghost btn-sm" id="prevBtn" ${state.index === 0 ? 'disabled' : ''}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
          Back
        </button>
        <button class="btn btn-primary btn-sm" id="nextBtn" ${locked ? '' : 'disabled'}>
          ${state.index === total - 1 ? 'See my result' : 'Next question'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>

      <p class="small muted" style="margin:16px 0 0">Tip: use keys <b>A–D</b> to answer, <b>Enter</b> to continue.</p>
    `;

    quizBody.querySelectorAll('[data-option]').forEach((btn) => {
      btn.addEventListener('click', () => answer(Number(btn.dataset.option)));
    });

    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if (prev) prev.addEventListener('click', () => {
      if (state.index > 0) { state.index--; render(); }
    });
    if (next) next.addEventListener('click', () => {
      if (state.answers[state.index] === undefined) return;
      if (state.index === total - 1) finish();
      else { state.index++; render(); }
    });
  }

  function answer(choice) {
    if (state.answers[state.index] !== undefined) return;
    state.answers[state.index] = choice;
    const domain = getDomain(state.domainId);
    const correct = domain.quiz[state.index].answer;

    render();
    if (choice === correct) toast('Correct — nicely done.', 'success', 1800);
    else toast('Not quite. The correct answer is highlighted.', 'error', 2200);
  }

  function finish() {
    const domain = getDomain(state.domainId);
    const perSkill = {};
    domain.skills.forEach((s) => (perSkill[s.id] = { correct: 0, total: 0 }));

    domain.quiz.forEach((q, i) => {
      perSkill[q.skill].total++;
      if (state.answers[i] === q.answer) perSkill[q.skill].correct++;
    });

    const skills = domain.skills.map((s) => ({
      id: s.id,
      name: s.name,
      score: Math.round((perSkill[s.id].correct / perSkill[s.id].total) * 100)
    }));

    const correct = domain.quiz.filter((q, i) => state.answers[i] === q.answer).length;
    const score = Math.round((correct / domain.quiz.length) * 100);

    state.result = {
      domain: domain.id,
      domainName: domain.name,
      score,
      correct,
      total: domain.quiz.length,
      level: skillLevel(score),
      skills,
      date: new Date().toISOString()
    };
    state.view = 'result';

    Store.setAssessment(state.result);
    render();
    toast(`Assessment saved — you scored ${score}/100.`, 'success');

    const panel = document.getElementById('quizPanel');
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ------------------------------------------------------------------ */
  /* Result view                                                         */
  /* ------------------------------------------------------------------ */
  const RING_R = 70;
  const CIRC = 2 * Math.PI * RING_R;

  function resultMessage(level, domain) {
    if (level === 0) return `You are at the starting line of ${domain.name} — which is a great place to be. Your roadmap starts with foundations and builds up in five clear phases.`;
    if (level === 1) return `Solid base in ${domain.name}. You can fast-track the fundamentals and spend your time on projects, depth and the skills that get you hired.`;
    return `Strong ${domain.name} foundation. Your priority is no longer tutorials — it is portfolio work, system thinking and interview practice.`;
  }

  function radarSVG(skills) {
    const n = skills.length;
    const cx = 120, cy = 116, radius = 72;
    const point = (i, value) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (radius * value) / 100;
      return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
    };

    const rings = [25, 50, 75, 100].map((v) => {
      const pts = skills.map((_, i) => point(i, v).join(',')).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="currentColor" stroke-opacity="${v === 100 ? 0.22 : 0.1}" stroke-width="1"/>`;
    }).join('');

    const spokes = skills.map((_, i) => {
      const [x, y] = point(i, 100);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="currentColor" stroke-opacity="0.12" stroke-width="1"/>`;
    }).join('');

    const dataPts = skills.map((s, i) => point(i, Math.max(s.score, 4)).join(',')).join(' ');

    const labels = skills.map((s, i) => {
      const [x, y] = point(i, 138);
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const cos = Math.cos(angle);
      const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="radar-label" dominant-baseline="middle">${escapeHTML(s.name)}</text>`;
    }).join('');

    return `
      <div class="radar-wrap">
        <svg viewBox="0 0 240 232" role="img" aria-label="Skill radar chart">
          <defs>
            <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.55"/>
              <stop offset="100%" stop-color="#22d3ee" stop-opacity="0.3"/>
            </linearGradient>
          </defs>
          ${rings}${spokes}
          <polygon points="${dataPts}" fill="url(#radarFill)" stroke="#818cf8" stroke-width="2" stroke-linejoin="round"/>
          ${skills.map((s, i) => {
            const [x, y] = point(i, Math.max(s.score, 4));
            return `<circle cx="${x}" cy="${y}" r="3" fill="#22d3ee"/>`;
          }).join('')}
          ${labels}
        </svg>
      </div>`;
  }

  function renderResult() {
    const r = state.result;
    const domain = getDomain(r.domain);
    const offset = CIRC * (1 - r.score / 100);

    quizTitle.textContent = `${domain.name} result`;
    quizStatus.textContent = LEVELS[r.level];
    quizStatus.className = 'badge ' + LEVEL_CLASS[r.level];

    quizBody.innerHTML = `
      <div class="result-hero">
        <div>
          <span class="eyebrow" style="margin-bottom:8px">Your result</span>
          <h3 style="font-size:1.3rem;margin-bottom:10px">${escapeHTML(domain.name)}</h3>
          <p class="small muted" style="margin-bottom:18px">${resultMessage(r.level, domain)}</p>
          <div class="row wrap" style="gap:8px">
            <span class="badge badge-dot">${r.correct} of ${r.total} correct</span>
            <span class="badge">${new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
        <div class="score-ring">
          <svg width="176" height="176" viewBox="0 0 176 176" aria-hidden="true">
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="55%" stop-color="#8b5cf6"/>
                <stop offset="100%" stop-color="#22d3ee"/>
              </linearGradient>
            </defs>
            <circle class="ring-bg" cx="88" cy="88" r="${RING_R}" fill="none" stroke-width="12"/>
            <circle class="ring-fg" cx="88" cy="88" r="${RING_R}" fill="none" stroke-width="12"
              stroke-dasharray="${CIRC}" stroke-dashoffset="${CIRC}" id="ringFg"/>
          </svg>
          <div class="ring-label"><strong>${r.score}</strong><span>out of 100</span></div>
        </div>
      </div>

      <div class="grid grid-2" style="margin-top:26px;align-items:center;gap:18px">
        ${radarSVG(r.skills)}
        <div>
          ${r.skills.map((s) => `
            <div class="result-skill">
              <div class="rs-head"><b>${escapeHTML(s.name)}</b><span>${s.score}%</span></div>
              <div class="bar"><span data-w="${s.score}" style="width:0"></span></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="quiz-nav" style="margin-top:26px;flex-wrap:wrap">
        <a class="btn btn-primary btn-sm" href="roadmap.html?domain=${domain.id}">
          Open my roadmap
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <button class="btn btn-ghost btn-sm" id="retakeBtn">Retake test</button>
        <button class="btn btn-ghost btn-sm" id="switchBtn">Try another track</button>
      </div>
    `;

    // animate ring + bars after paint
    requestAnimationFrame(() => {
      const ring = document.getElementById('ringFg');
      if (ring) ring.style.strokeDashoffset = String(offset);
      quizBody.querySelectorAll('.bar > span[data-w]').forEach((bar) => {
        bar.style.width = bar.dataset.w + '%';
      });
    });

    document.getElementById('retakeBtn').addEventListener('click', () => {
      state.view = 'quiz';
      state.index = 0;
      state.answers = [];
      state.result = null;
      render();
    });

    document.getElementById('switchBtn').addEventListener('click', () => {
      domainList.scrollIntoView({ behavior: 'smooth', block: 'center' });
      toast('Pick a track on the left to start a new test.', 'info');
    });
  }

  /* ------------------------------------------------------------------ */
  function render() {
    if (state.view === 'result' && state.result) renderResult();
    else renderQuiz();
  }

  /* ------------------------------------------------------------------ */
  /* Keyboard shortcuts                                                  */
  /* ------------------------------------------------------------------ */
  document.addEventListener('keydown', (e) => {
    if (state.view !== 'quiz' || document.activeElement.matches('input, textarea, select')) return;
    const idx = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase());
    if (idx > -1) {
      const domain = getDomain(state.domainId);
      if (idx < domain.quiz[state.index].options.length && state.answers[state.index] === undefined) {
        e.preventDefault();
        answer(idx);
      }
    }
    if (e.key === 'Enter') {
      const next = document.getElementById('nextBtn');
      if (next && !next.disabled) { e.preventDefault(); next.click(); }
    }
  });

  /* ------------------------------------------------------------------ */
  /* Skill library                                                       */
  /* ------------------------------------------------------------------ */
  const ALL_SKILLS = DOMAINS.flatMap((d) =>
    d.skills.map((s) => ({ ...s, domain: d.id, domainName: d.name, short: d.short, color: d.color }))
  );

  const grid = document.getElementById('skillGrid');
  const search = document.getElementById('skillSearch');
  const filters = document.getElementById('skillFilters');
  const countEl = document.getElementById('skillCount');
  let activeFilter = 'all';
  let query = '';

  function renderFilters() {
    filters.innerHTML =
      `<button class="chip ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All skills</button>` +
      DOMAINS.map((d) => `<button class="chip ${activeFilter === d.id ? 'active' : ''}" data-filter="${d.id}">${d.short}</button>`).join('');
  }

  function renderSkills() {
    const q = query.trim().toLowerCase();
    const list = ALL_SKILLS.filter((s) => {
      const inDomain = activeFilter === 'all' || s.domain === activeFilter;
      const hay = `${s.name} ${s.desc} ${s.tags.join(' ')} ${s.domainName}`.toLowerCase();
      return inDomain && (!q || hay.includes(q));
    });

    if (countEl) countEl.textContent = `${list.length} skill${list.length === 1 ? '' : 's'}`;

    if (!list.length) {
      grid.innerHTML = `<div class="no-results">
        <h3 style="font-size:1.05rem">No skills matched “${escapeHTML(query)}”</h3>
        <p class="small">Try a different keyword or clear the filters.</p>
      </div>`;
      return;
    }

    grid.innerHTML = list.map((s) => `
      <article class="card skill-card">
        <div class="sc-top">
          <h4>${escapeHTML(s.name)}</h4>
          <span class="demand">${s.demand}%</span>
        </div>
        <p>${escapeHTML(s.desc)}</p>
        <div class="tags">
          <span class="tag" style="color:${s.color};border-color:color-mix(in srgb, ${s.color} 32%, transparent)">${s.domainName}</span>
          ${s.tags.map((t) => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
        </div>
        <div class="skill-meter">
          <span>Demand</span>
          <div class="bar"><span style="width:${s.demand}%"></span></div>
        </div>
      </article>
    `).join('');
  }

  filters.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter]');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    renderFilters();
    renderSkills();
  });

  let t;
  search.addEventListener('input', (e) => {
    clearTimeout(t);
    query = e.target.value;
    t = setTimeout(renderSkills, 120);
  });

  /* ------------------------------------------------------------------ */
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                */
  /* ------------------------------------------------------------------ */
  renderDomains();
  render();
  renderFilters();
  renderSkills();

  if (params.get('domain')) {
    const d = getDomain(params.get('domain'));
    document.getElementById('quizTitle').textContent = `${d.name} assessment`;
    setTimeout(() => document.getElementById('assessment').scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  }
})();
