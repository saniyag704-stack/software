/* ==========================================================================
   Skill GPS — Roadmap page
   Track selection, level-aware phases and locally persisted milestone ticks.
   ========================================================================== */

(function () {
  'use strict';

  const { DOMAINS, LEVELS, LEVEL_CLASS, Store, getDomain } = window.SkillGPS;
  const { toast } = window.SkillGPSUI;

  const select = document.getElementById('trackSelect');
  const timeline = document.getElementById('timeline');
  const trackHeader = document.getElementById('trackHeader');
  const levelPanel = document.getElementById('levelPanel');
  const phaseBadge = document.getElementById('phaseBadge');
  const progressPct = document.getElementById('progressPct');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const itemsDone = document.getElementById('itemsDone');
  const itemsTotal = document.getElementById('itemsTotal');
  const resetBtn = document.getElementById('resetBtn');

  if (!select || !timeline) return;

  const params = new URLSearchParams(location.search);
  const saved = Store.getAssessment();
  let domainId = params.get('domain') || (saved && saved.domain) || DOMAINS[0].id;
  if (!getDomain(domainId)) domainId = DOMAINS[0].id;

  let progress = Store.getProgress();
  if (!progress || typeof progress !== 'object') progress = {};

  /* ------------------------------------------------------------------ */
  /* Track picker                                                        */
  /* ------------------------------------------------------------------ */
  select.innerHTML = DOMAINS.map(
    (d) => `<option value="${d.id}" ${d.id === domainId ? 'selected' : ''}>${d.name}</option>`
  ).join('');

  select.addEventListener('change', () => {
    domainId = select.value;
    renderAll();
    history.replaceState(null, '', `?domain=${domainId}`);
  });

  /* ------------------------------------------------------------------ */
  /* Progress helpers                                                    */
  /* ------------------------------------------------------------------ */
  function domainProgress() {
    const p = progress[domainId];
    return p && typeof p === 'object' ? p : {};
  }

  function saveProgress() {
    Store.setProgress(progress);
  }

  function isChecked(pi, ii) {
    return Boolean(domainProgress()[`${pi}-${ii}`]);
  }

  function totals(domain) {
    let total = 0;
    let done = 0;
    let phasesDone = 0;
    domain.roadmap.forEach((phase, pi) => {
      let phaseAll = true;
      phase.items.forEach((_, ii) => {
        total++;
        if (isChecked(pi, ii)) done++;
        else phaseAll = false;
      });
      if (phaseAll) phasesDone++;
    });
    return { total, done, phasesDone, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  /* ------------------------------------------------------------------ */
  /* Renderers                                                           */
  /* ------------------------------------------------------------------ */
  function renderHeader(domain) {
    trackHeader.innerHTML = `
      <div>
        <div class="row wrap" style="gap:10px;margin-bottom:6px">
          <h2 class="h3" style="margin:0">${domain.name} roadmap</h2>
          <span class="badge" style="color:${domain.color};border-color:color-mix(in srgb, ${domain.color} 34%, transparent)">
            ${domain.duration}
          </span>
        </div>
        <p class="small muted" style="margin:0;max-width:560px">${domain.description}</p>
      </div>
      <div class="row" style="gap:8px">
        ${domain.careers.slice(0, 2).map((c) => `<span class="badge">${c}</span>`).join('')}
      </div>
    `;

    document.getElementById('trackMeta').innerHTML = `
      <span class="badge badge-dot">${domain.demand}% demand</span>
      <span class="badge">${domain.salary}</span>
      <span class="badge">${domain.skills.length} core skills</span>
    `;
  }

  function renderLevel(domain) {
    const assessment = Store.getAssessment();
    const hasResult = assessment && assessment.domain === domain.id;

    if (!hasResult) {
      levelPanel.innerHTML = `
        <div class="panel-body">
          <h3 style="font-size:.92rem;margin-bottom:7px">Personalise this roadmap</h3>
          <p class="small muted" style="margin-bottom:14px">Take the 2-minute ${domain.short} assessment and we will highlight what you can skip.</p>
          <a class="btn btn-primary btn-sm btn-block" href="skills.html?domain=${domain.id}">Take the assessment</a>
        </div>`;
      return;
    }

    levelPanel.innerHTML = `
      <div class="panel-body">
        <div class="row" style="justify-content:space-between;margin-bottom:10px">
          <h3 style="font-size:.92rem;margin:0">Your assessed level</h3>
          <span class="level-pill ${LEVEL_CLASS[assessment.level]}">${LEVELS[assessment.level]}</span>
        </div>
        <p class="small muted" style="margin-bottom:12px">
          Scored <b style="color:var(--text)">${assessment.score}/100</b> on
          ${new Date(assessment.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}.
        </p>
        <div class="bar"><span style="width:${assessment.score}%"></span></div>
        <a class="btn btn-ghost btn-sm btn-block mt-2" href="skills.html?domain=${domain.id}">Retake assessment</a>
      </div>`;
  }

  function renderTimeline(domain) {
    const assessment = Store.getAssessment();
    const userLevel = assessment && assessment.domain === domain.id ? assessment.level : 0;
    const hasLevel = Boolean(assessment && assessment.domain === domain.id);

    timeline.innerHTML = domain.roadmap.map((phase, pi) => {
      const allDone = phase.items.every((_, ii) => isChecked(pi, ii));
      const fastTrack = hasLevel && phase.minLevel < userLevel;

      return `
        <div class="phase ${allDone ? 'done' : ''}" data-phase="${pi}">
          <div class="phase-dot">${allDone
            ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
            : pi + 1}</div>
          <div class="phase-card">
            <div class="phase-top">
              <div>
                <div class="q-count" style="margin-bottom:4px">${phase.phase}</div>
                <h3>${phase.title}</h3>
              </div>
              <div class="row" style="gap:8px">
                ${fastTrack ? '<span class="badge badge-accent">Fast-track</span>' : ''}
                <span class="duration">${phase.duration}</span>
              </div>
            </div>
            ${fastTrack ? '<p class="small muted" style="margin:8px 0 0">Based on your level you likely know the basics here — use this as a quick review.</p>' : ''}
            <div class="check-list">
              ${phase.items.map((item, ii) => `
                <label class="check-item">
                  <input type="checkbox" data-pi="${pi}" data-ii="${ii}" ${isChecked(pi, ii) ? 'checked' : ''} />
                  <span class="check-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  <span class="check-text">${item}</span>
                </label>`).join('')}
            </div>
          </div>
        </div>`;
    }).join('');
  }

  function updateProgress(domain) {
    const { total, done, phasesDone, pct } = totals(domain);
    progressPct.textContent = pct;
    progressBar.style.width = pct + '%';
    phaseBadge.textContent = `${phasesDone} / ${domain.roadmap.length} phases`;
    itemsDone.textContent = `${done} item${done === 1 ? '' : 's'} done`;
    itemsTotal.textContent = `${total} total`;

    if (done === 0) progressText.textContent = 'Tick your first milestone to start tracking.';
    else if (pct === 100) progressText.textContent = 'Roadmap complete. Time to apply and keep building.';
    else if (done >= total - 3) progressText.textContent = 'Final stretch — finish strong and update your portfolio.';
    else progressText.textContent = `You are ${pct}% of the way through this roadmap. Keep going.`;
  }

  function syncPhases() {
    const domain = getDomain(domainId);
    domain.roadmap.forEach((phase, pi) => {
      const el = timeline.querySelector(`[data-phase="${pi}"]`);
      if (!el) return;
      const allDone = phase.items.every((_, ii) => isChecked(pi, ii));
      el.classList.toggle('done', allDone);
      const dot = el.querySelector('.phase-dot');
      if (dot) {
        dot.innerHTML = allDone
          ? '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
          : pi + 1;
      }
    });
  }

  function renderAll() {
    const domain = getDomain(domainId);
    renderHeader(domain);
    renderLevel(domain);
    renderTimeline(domain);
    updateProgress(domain);
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */
  timeline.addEventListener('change', (e) => {
    const input = e.target.closest('input[type="checkbox"][data-pi]');
    if (!input) return;

    const pi = input.dataset.pi;
    const ii = input.dataset.ii;
    const key = `${pi}-${ii}`;

    if (!progress[domainId]) progress[domainId] = {};
    if (input.checked) progress[domainId][key] = true;
    else delete progress[domainId][key];

    saveProgress();

    const domain = getDomain(domainId);
    const phase = domain.roadmap[pi];
    const wasDone = timeline.querySelector(`[data-phase="${pi}"]`).classList.contains('done');
    const nowDone = phase.items.every((_, idx) => isChecked(pi, idx));

    syncPhases();
    updateProgress(domain);

    if (!wasDone && nowDone) toast(`Phase complete: ${phase.title}`, 'success');
    else if (wasDone && !nowDone) { /* silently un-complete */ }
  });

  resetBtn.addEventListener('click', () => {
    const domain = getDomain(domainId);
    if (Object.keys(domainProgress()).length === 0) {
      toast('Nothing to reset yet — this roadmap is already empty.', 'info');
      return;
    }
    if (!window.confirm(`Reset all checked milestones for ${domain.name}? This cannot be undone.`)) return;
    delete progress[domainId];
    saveProgress();
    renderAll();
    toast('Roadmap progress reset.', 'info');
  });

  /* ------------------------------------------------------------------ */
  renderAll();
})();
