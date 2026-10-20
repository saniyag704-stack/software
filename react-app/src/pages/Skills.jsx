import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DOMAINS, LEVELS, LEVEL_CLASS, Store, getDomain, skillLevel } from '../lib/data';
import { toast } from '../lib/ui';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { usePageMeta } from '../lib/meta';

const KEYS = ['A', 'B', 'C', 'D'];

/* ------------------------------------------------------------------ */
/* Result widgets                                                      */
/* ------------------------------------------------------------------ */
const RING_R = 70;
const CIRC = 2 * Math.PI * RING_R;

function ScoreRing({ score }) {
  const [offset, setOffset] = useState(CIRC);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOffset(CIRC * (1 - score / 100)));
    return () => cancelAnimationFrame(id);
  }, [score]);

  return (
    <div className="score-ring">
      <svg width="176" height="176" viewBox="0 0 176 176" aria-hidden="true">
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx="88" cy="88" r={RING_R} fill="none" strokeWidth="12" />
        <circle
          className="ring-fg"
          cx="88"
          cy="88"
          r={RING_R}
          fill="none"
          strokeWidth="12"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-label">
        <strong>{score}</strong>
        <span>out of 100</span>
      </div>
    </div>
  );
}

function Radar({ skills }) {
  const n = skills.length;
  const cx = 120;
  const cy = 116;
  const radius = 72;

  const point = (i, value) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (radius * value) / 100;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  };

  const rings = [25, 50, 75, 100].map((v) => (
    <polygon
      key={v}
      points={skills.map((_, i) => point(i, v).join(',')).join(' ')}
      fill="none"
      stroke="currentColor"
      strokeOpacity={v === 100 ? 0.22 : 0.1}
      strokeWidth="1"
    />
  ));

  const dataPts = skills.map((s, i) => point(i, Math.max(s.score, 4)).join(',')).join(' ');

  return (
    <div className="radar-wrap">
      <svg viewBox="0 0 240 232" role="img" aria-label="Skill radar chart">
        <defs>
          <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {rings}
        {skills.map((_, i) => {
          const [x, y] = point(i, 100);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />;
        })}
        <polygon points={dataPts} fill="url(#radarFill)" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
        {skills.map((s, i) => {
          const [x, y] = point(i, Math.max(s.score, 4));
          return <circle key={s.id} cx={x} cy={y} r="3" fill="#22d3ee" />;
        })}
        {skills.map((s, i) => {
          const [x, y] = point(i, 138);
          const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
          const cos = Math.cos(angle);
          const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
          return (
            <text key={s.id} x={x} y={y} textAnchor={anchor} className="radar-label" dominantBaseline="middle">
              {s.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function resultMessage(level, domain) {
  if (level === 0)
    return `You are at the starting line of ${domain.name} — which is a great place to be. Your roadmap starts with foundations and builds up in five clear phases.`;
  if (level === 1)
    return `Solid base in ${domain.name}. You can fast-track the fundamentals and spend your time on projects, depth and the skills that get you hired.`;
  return `Strong ${domain.name} foundation. Your priority is no longer tutorials — it is portfolio work, system thinking and interview practice.`;
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function Skills() {
  usePageMeta('skills');
  const [searchParams, setSearchParams] = useSearchParams();
  const saved = useMemo(() => Store.getAssessment(), []);
  const initialId = getDomain(searchParams.get('domain') || saved?.domain).id;

  const [domainId, setDomainId] = useState(initialId);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(saved && saved.domain === initialId ? saved : null);
  const [barsReady, setBarsReady] = useState(false);

  const domain = getDomain(domainId);
  const locked = answers[index] !== undefined;

  useEffect(() => {
    document.title = 'Skill Assessment & Library — Skill GPS';
  }, []);

  /* library state */
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const allSkills = useMemo(
    () =>
      DOMAINS.flatMap((d) =>
        d.skills.map((s) => ({ ...s, domain: d.id, domainName: d.name, short: d.short, color: d.color }))
      ),
    []
  );

  const visibleSkills = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allSkills.filter((s) => {
      const inDomain = filter === 'all' || s.domain === filter;
      const hay = `${s.name} ${s.desc} ${s.tags.join(' ')} ${s.domainName}`.toLowerCase();
      return inDomain && (!q || hay.includes(q));
    });
  }, [allSkills, filter, query]);

  /* ---------------------------------------------------------------- */
  function selectDomain(id) {
    setDomainId(id);
    const existing = Store.getAssessment();
    if (existing && existing.domain === id) {
      setResult(existing);
    } else {
      setResult(null);
      setIndex(0);
      setAnswers([]);
    }
    setSearchParams({ domain: id }, { replace: true });
  }

  function answer(choice) {
    if (answers[index] !== undefined) return;
    const next = [...answers];
    next[index] = choice;
    setAnswers(next);
    if (choice === domain.quiz[index].answer) toast('Correct — nicely done.', 'success', 1800);
    else toast('Not quite. The correct answer is highlighted.', 'error', 2200);
  }

  function finish() {
    const perSkill = {};
    domain.skills.forEach((s) => (perSkill[s.id] = { correct: 0, total: 0 }));

    domain.quiz.forEach((q, i) => {
      perSkill[q.skill].total++;
      if (answers[i] === q.answer) perSkill[q.skill].correct++;
    });

    const skills = domain.skills.map((s) => ({
      id: s.id,
      name: s.name,
      score: Math.round((perSkill[s.id].correct / perSkill[s.id].total) * 100)
    }));

    const correct = domain.quiz.filter((q, i) => answers[i] === q.answer).length;
    const score = Math.round((correct / domain.quiz.length) * 100);

    const payload = {
      domain: domain.id,
      domainName: domain.name,
      score,
      correct,
      total: domain.quiz.length,
      level: skillLevel(score),
      skills,
      date: new Date().toISOString()
    };

    Store.setAssessment(payload);
    setResult(payload);
    setBarsReady(false);
    toast(`Assessment saved — you scored ${score}/100.`, 'success');
    setTimeout(() => {
      document.getElementById('quizPanel')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  }

  function retake() {
    setResult(null);
    setIndex(0);
    setAnswers([]);
  }

  /* keyboard shortcuts */
  useEffect(() => {
    if (result) return;
    const onKey = (e) => {
      if (e.target.matches('input, textarea, select')) return;
      const i = ['a', 'b', 'c', 'd'].indexOf(e.key.toLowerCase());
      if (i > -1 && i < domain.quiz[index].options.length && answers[index] === undefined) {
        e.preventDefault();
        answer(i);
      }
      if (e.key === 'Enter' && answers[index] !== undefined) {
        e.preventDefault();
        if (index === domain.quiz.length - 1) finish();
        else setIndex(index + 1);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  /* animate result bars */
  useEffect(() => {
    if (!result) return;
    const id = requestAnimationFrame(() => setBarsReady(true));
    return () => cancelAnimationFrame(id);
  }, [result]);

  const progressPct = Math.round(((index + (locked ? 1 : 0)) / domain.quiz.length) * 100);

  /* ---------------------------------------------------------------- */
  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="arrowRight" size={13} />
            <span>Skills</span>
          </div>
          <span className="eyebrow">Assessment &amp; library</span>
          <h1>Know exactly where you stand.</h1>
          <p>
            Pick a track, answer eight real questions, and get a skill-by-skill breakdown. Then use the library
            to see what is actually in demand.
          </p>
        </div>
      </section>

      <section className="section-sm" id="assessment">
        <div className="container">
          <div className="assess-shell">
            <aside className="panel">
              <div className="panel-head">
                <h3>Career tracks</h3>
                <span className="badge badge-accent">{DOMAINS.length}</span>
              </div>
              <div className="domain-list" role="tablist" aria-label="Career tracks">
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    className={`domain-btn ${d.id === domainId ? 'active' : ''}`}
                    role="tab"
                    aria-selected={d.id === domainId}
                    style={{ '--dc': d.color }}
                    onClick={() => selectDomain(d.id)}
                  >
                    <span className="db-icon" dangerouslySetInnerHTML={{ __html: d.icon }} />
                    <span className="db-text">
                      <b>{d.name}</b>
                      <span>{d.skills.length} skills · {d.duration}</span>
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="panel" id="quizPanel">
              <div className="panel-head">
                <h3>{result ? `${domain.name} result` : `${domain.name} assessment`}</h3>
                <span className={`badge ${result ? LEVEL_CLASS[result.level] : 'badge-accent'}`}>
                  {result ? LEVELS[result.level] : `${index + 1} / ${domain.quiz.length}`}
                </span>
              </div>

              <div className="panel-body">
                {result ? (
                  <>
                    <div className="result-hero">
                      <div>
                        <span className="eyebrow" style={{ marginBottom: 8 }}>Your result</span>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: 10 }}>{domain.name}</h3>
                        <p className="small muted" style={{ marginBottom: 18 }}>
                          {resultMessage(result.level, domain)}
                        </p>
                        <div className="row wrap" style={{ gap: 8 }}>
                          <span className="badge badge-dot">
                            {result.correct} of {result.total} correct
                          </span>
                          <span className="badge">
                            {new Date(result.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                      <ScoreRing score={result.score} />
                    </div>

                    <div className="grid grid-2" style={{ marginTop: 26, alignItems: 'center', gap: 18 }}>
                      <Radar skills={result.skills} />
                      <div>
                        {result.skills.map((s) => (
                          <div className="result-skill" key={s.id}>
                            <div className="rs-head">
                              <b>{s.name}</b>
                              <span>{s.score}%</span>
                            </div>
                            <div className="bar">
                              <span style={{ width: barsReady ? `${s.score}%` : 0 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="quiz-nav" style={{ marginTop: 26, flexWrap: 'wrap' }}>
                      <Link className="btn btn-primary btn-sm" to={`/roadmap?domain=${domain.id}`}>
                        Open my roadmap
                        <Icon name="arrowRight" />
                      </Link>
                      <button className="btn btn-ghost btn-sm" onClick={retake}>Retake test</button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          document.querySelector('.domain-list')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          toast('Pick a track on the left to start a new test.', 'info');
                        }}
                      >
                        Try another track
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="quiz-progress">
                      <div className="track"><i style={{ width: `${progressPct}%` }} /></div>
                      <span>{progressPct}%</span>
                    </div>

                    <div className="question" key={index}>
                      <div className="q-count">
                        Question {index + 1} of {domain.quiz.length} · {domain.quiz[index].skill.replace('-', ' ')}
                      </div>
                      <h3>{domain.quiz[index].q}</h3>
                      <div className="options">
                        {domain.quiz[index].options.map((opt, i) => {
                          let cls = 'option';
                          if (locked) {
                            if (i === domain.quiz[index].answer) cls += ' correct';
                            else if (i === answers[index]) cls += ' wrong';
                            else cls += ' dim';
                          }
                          return (
                            <button
                              key={i}
                              className={cls}
                              data-option={i}
                              disabled={locked}
                              onClick={() => answer(i)}
                            >
                              <span className="key">{KEYS[i]}</span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="quiz-nav">
                      <button
                        className="btn btn-ghost btn-sm"
                        disabled={index === 0}
                        onClick={() => setIndex((v) => Math.max(0, v - 1))}
                      >
                        <Icon name="arrowLeft" />
                        Back
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={!locked}
                        onClick={() => (index === domain.quiz.length - 1 ? finish() : setIndex(index + 1))}
                      >
                        {index === domain.quiz.length - 1 ? 'See my result' : 'Next question'}
                        <Icon name="arrowRight" />
                      </button>
                    </div>

                    <p className="small muted" style={{ margin: '16px 0 0' }}>
                      Tip: use keys <b>A–D</b> to answer, <b>Enter</b> to continue.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="library">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Skill library</span>
            <h2 className="h2">What the market is actually asking for</h2>
            <p>
              Demand scores blend job-posting frequency and growth. Use them to decide what deserves your next
              100 hours.
            </p>
          </Reveal>

          <div className="toolbar">
            <div className="search-box">
              <Icon name="search" size={17} />
              <input
                className="input"
                type="search"
                placeholder="Search skills, tags or tracks…"
                aria-label="Search skills"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="chips">
              <button className={`chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                All skills
              </button>
              {DOMAINS.map((d) => (
                <button
                  key={d.id}
                  className={`chip ${filter === d.id ? 'active' : ''}`}
                  onClick={() => setFilter(d.id)}
                >
                  {d.short}
                </button>
              ))}
            </div>

            <span className="badge" style={{ marginLeft: 'auto' }}>
              {visibleSkills.length} skill{visibleSkills.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-3">
            {visibleSkills.length === 0 && (
              <div className="no-results">
                <h3 style={{ fontSize: '1.05rem' }}>No skills matched “{query}”</h3>
                <p className="small">Try a different keyword or clear the filters.</p>
              </div>
            )}

            {visibleSkills.map((s) => (
              <article className="card skill-card" key={`${s.domain}-${s.id}`}>
                <div className="sc-top">
                  <h4>{s.name}</h4>
                  <span className="demand">{s.demand}%</span>
                </div>
                <p>{s.desc}</p>
                <div className="tags">
                  <span
                    className="tag"
                    style={{ color: s.color, borderColor: `color-mix(in srgb, ${s.color} 32%, transparent)` }}
                  >
                    {s.domainName}
                  </span>
                  {s.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
                <div className="skill-meter">
                  <span>Demand</span>
                  <div className="bar"><span style={{ width: `${s.demand}%` }} /></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
