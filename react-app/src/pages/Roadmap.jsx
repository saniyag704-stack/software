import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DOMAINS, LEVELS, LEVEL_CLASS, Store, getDomain } from '../lib/data';
import { toast } from '../lib/ui';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { usePageMeta } from '../lib/meta';

export default function Roadmap() {
  usePageMeta('roadmap');
  const [searchParams, setSearchParams] = useSearchParams();
  const saved = Store.getAssessment();

  const [domainId, setDomainId] = useState(getDomain(searchParams.get('domain') || saved?.domain).id);
  const [progress, setProgress] = useState(() => {
    const p = Store.getProgress();
    return p && typeof p === 'object' ? p : {};
  });

  const domain = getDomain(domainId);
  const assessment = saved && saved.domain === domainId ? saved : null;
  const domainProgress = progress[domainId] || {};

  useEffect(() => {
    document.title = 'Career Roadmaps — Skill GPS';
  }, []);

  function changeDomain(id) {
    setDomainId(id);
    setSearchParams({ domain: id }, { replace: true });
  }

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    let phasesDone = 0;
    domain.roadmap.forEach((phase, pi) => {
      let phaseAll = true;
      phase.items.forEach((_, ii) => {
        total++;
        if (domainProgress[`${pi}-${ii}`]) done++;
        else phaseAll = false;
      });
      if (phaseAll) phasesDone++;
    });
    return { total, done, phasesDone, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [domain, domainProgress]);

  function toggle(pi, ii) {
    const key = `${pi}-${ii}`;
    const current = progress[domainId] || {};
    const willCheck = !current[key];
    const nextBoard = { ...current };
    if (willCheck) nextBoard[key] = true;
    else delete nextBoard[key];

    const next = { ...progress, [domainId]: nextBoard };
    setProgress(next);
    Store.setProgress(next);

    if (willCheck) {
      const phaseComplete = domain.roadmap[pi].items.every((_, idx) => nextBoard[`${pi}-${idx}`]);
      if (phaseComplete) toast(`Phase complete: ${domain.roadmap[pi].title}`, 'success');
    }
  }

  function reset() {
    if (Object.keys(domainProgress).length === 0) {
      toast('Nothing to reset yet — this roadmap is already empty.', 'info');
      return;
    }
    if (!window.confirm(`Reset all checked milestones for ${domain.name}? This cannot be undone.`)) return;
    const next = { ...progress };
    delete next[domainId];
    setProgress(next);
    Store.setProgress(next);
    toast('Roadmap progress reset.', 'info');
  }

  const progressText =
    totals.done === 0
      ? 'Tick your first milestone to start tracking.'
      : totals.pct === 100
      ? 'Roadmap complete. Time to apply and keep building.'
      : totals.done >= totals.total - 3
      ? 'Final stretch — finish strong and update your portfolio.'
      : `You are ${totals.pct}% of the way through this roadmap. Keep going.`;

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="arrowRight" size={13} />
            <span>Roadmap</span>
          </div>
          <span className="eyebrow">Your route</span>
          <h1>From where you are to hired.</h1>
          <p>
            Every track broken into five phases with realistic timelines. Tick items as you finish them — your
            progress is saved on this device.
          </p>
        </div>
      </section>

      <section className="section-sm" id="roadmap">
        <div className="container">
          <div className="roadmap-shell">
            <aside className="roadmap-side">
              <div className="panel">
                <div className="panel-head"><h3>Career track</h3></div>
                <div className="panel-body" style={{ paddingTop: 16 }}>
                  <label className="small muted" htmlFor="trackSelect" style={{ display: 'block', marginBottom: 7 }}>
                    Choose a roadmap
                  </label>
                  <select
                    className="input"
                    id="trackSelect"
                    aria-label="Select a career track"
                    value={domainId}
                    onChange={(e) => changeDomain(e.target.value)}
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                  <div className="row wrap mt-2" style={{ gap: 6 }}>
                    <span className="badge badge-dot">{domain.demand}% demand</span>
                    <span className="badge">{domain.salary}</span>
                    <span className="badge">{domain.skills.length} core skills</span>
                  </div>
                </div>
              </div>

              <div className="panel progress-card">
                <div className="panel-head">
                  <h3>Overall progress</h3>
                  <span className="badge">{totals.phasesDone} / {domain.roadmap.length} phases</span>
                </div>
                <div className="panel-body">
                  <div className="big">{totals.pct}<small>%</small></div>
                  <p>{progressText}</p>
                  <div className="bar"><span style={{ width: `${totals.pct}%` }} /></div>
                  <div
                    className="row"
                    style={{ justifyContent: 'space-between', marginTop: 14, fontSize: '.78rem', color: 'var(--muted)' }}
                  >
                    <span>{totals.done} item{totals.done === 1 ? '' : 's'} done</span>
                    <span>{totals.total} total</span>
                  </div>
                  <button className="btn btn-ghost btn-sm btn-block mt-4" onClick={reset}>
                    <Icon name="refresh" />
                    Reset this roadmap
                  </button>
                </div>
              </div>

              <div className="panel">
                <div className="panel-body">
                  {assessment ? (
                    <>
                      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                        <h3 style={{ fontSize: '.92rem', margin: 0 }}>Your assessed level</h3>
                        <span className={`level-pill ${LEVEL_CLASS[assessment.level]}`}>
                          {LEVELS[assessment.level]}
                        </span>
                      </div>
                      <p className="small muted" style={{ marginBottom: 12 }}>
                        Scored <b style={{ color: 'var(--text)' }}>{assessment.score}/100</b> on{' '}
                        {new Date(assessment.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        .
                      </p>
                      <div className="bar"><span style={{ width: `${assessment.score}%` }} /></div>
                      <Link className="btn btn-ghost btn-sm btn-block mt-2" to={`/skills?domain=${domain.id}`}>
                        Retake assessment
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: '.92rem', marginBottom: 7 }}>Personalise this roadmap</h3>
                      <p className="small muted" style={{ marginBottom: 14 }}>
                        Take the 2-minute {domain.short} assessment and we will highlight what you can skip.
                      </p>
                      <Link className="btn btn-primary btn-sm btn-block" to={`/skills?domain=${domain.id}`}>
                        Take the assessment
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </aside>

            <div>
              <div className="row wrap" style={{ justifyContent: 'space-between', marginBottom: 22 }}>
                <div>
                  <div className="row wrap" style={{ gap: 10, marginBottom: 6 }}>
                    <h2 className="h3" style={{ margin: 0 }}>{domain.name} roadmap</h2>
                    <span
                      className="badge"
                      style={{ color: domain.color, borderColor: `color-mix(in srgb, ${domain.color} 34%, transparent)` }}
                    >
                      {domain.duration}
                    </span>
                  </div>
                  <p className="small muted" style={{ margin: 0, maxWidth: 560 }}>{domain.description}</p>
                </div>
                <div className="row" style={{ gap: 8 }}>
                  {domain.careers.slice(0, 2).map((c) => <span className="badge" key={c}>{c}</span>)}
                </div>
              </div>

              <div className="timeline">
                {domain.roadmap.map((phase, pi) => {
                  const allDone = phase.items.every((_, ii) => domainProgress[`${pi}-${ii}`]);
                  const fastTrack = assessment && phase.minLevel < assessment.level;

                  return (
                    <div className={`phase ${allDone ? 'done' : ''}`} key={phase.title}>
                      <div className="phase-dot">
                        {allDone ? <Icon name="check" size={12} strokeWidth={3.4} /> : pi + 1}
                      </div>
                      <div className="phase-card">
                        <div className="phase-top">
                          <div>
                            <div className="q-count" style={{ marginBottom: 4 }}>{phase.phase}</div>
                            <h3>{phase.title}</h3>
                          </div>
                          <div className="row" style={{ gap: 8 }}>
                            {fastTrack && <span className="badge badge-accent">Fast-track</span>}
                            <span className="duration">{phase.duration}</span>
                          </div>
                        </div>
                        {fastTrack && (
                          <p className="small muted" style={{ margin: '8px 0 0' }}>
                            Based on your level you likely know the basics here — use this as a quick review.
                          </p>
                        )}
                        <div className="check-list">
                          {phase.items.map((item, ii) => {
                            const key = `${pi}-${ii}`;
                            return (
                              <label className="check-item" key={key}>
                                <input
                                  type="checkbox"
                                  checked={Boolean(domainProgress[key])}
                                  onChange={() => toggle(pi, ii)}
                                />
                                <span className="check-box"><Icon name="check" size={11} strokeWidth={3.4} /></span>
                                <span className="check-text">{item}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal className="cta-band">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Next step</span>
            <h2 className="h2">A roadmap only works if you do.</h2>
            <p>Block 45 minutes today, pick the first unchecked item and start. Momentum beats motivation.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" to="/skills">Re-check my skills</Link>
              <Link className="btn btn-ghost" to="/contact">Get guidance</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
