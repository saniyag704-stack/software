import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS } from '../lib/data';
import { Icon, StarIcon } from '../components/Icon';
import { Reveal, CountUp } from '../components/Reveal';
import { usePageMeta } from '../lib/meta';

const features = [
  {
    icon: 'check',
    title: 'Honest skill assessment',
    text: 'Eight real questions per track — not a personality quiz. See a score per skill and a level you can trust, saved right in your browser.'
  },
  {
    icon: 'map',
    title: 'Personalised roadmap',
    text: 'Your roadmap adapts to your level. Beginners get foundations, intermediate learners skip ahead, advanced learners focus on portfolio and interviews.'
  },
  {
    icon: 'chart',
    title: 'Progress that sticks',
    text: 'Tick milestones as you complete them. Progress is stored locally, so you can leave, come back and pick up exactly where you stopped.'
  }
];

const steps = [
  { title: 'Choose a track', text: 'Pick the field you are curious about. You can always test another one later.' },
  { title: 'Take the test', text: 'Eight focused questions score four core skills and reveal your current level.' },
  { title: 'Get your roadmap', text: 'See every phase, the skills inside it, and a realistic time estimate.' },
  { title: 'Track and ship', text: 'Tick off milestones, build projects and move toward job-ready.' }
];

const stories = [
  {
    quote:
      '“I kept starting new courses and quitting. The assessment showed my JavaScript was fine but my projects were the real gap. Six weeks later I had two apps on GitHub.”',
    initials: 'RK',
    name: 'Riya K.',
    meta: 'Final year, BCA'
  },
  {
    quote:
      '“The roadmap was the first thing that gave me actual dates. ‘Learn data science’ became ‘finish SQL in five weeks, then build a dashboard’. That made it real.”',
    initials: 'AV',
    name: 'Aditya V.',
    meta: '3rd year, B.Sc Statistics'
  },
  {
    quote:
      '“I switched from a track I hated to UI/UX after the assessment. My parents were nervous, but the skill breakdown made the decision feel reasoned instead of random.”',
    initials: 'SM',
    name: 'Sana M.',
    meta: '2nd year, B.Des'
  }
];

const heroSkills = [
  { name: 'HTML & CSS', value: 82, cls: '' },
  { name: 'JavaScript', value: 64, cls: 'cyan' },
  { name: 'React', value: 41, cls: 'violet' },
  { name: 'Backend & APIs', value: 28, cls: '' }
];

export default function Home() {
  usePageMeta('home');
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="badge badge-dot">Free for students · No sign-up required</span>
              </div>
              <h1 className="display">
                Find your direction.
                <br />
                Master the <span className="grad-text">right skills.</span>
              </h1>
              <p className="lead">
                Most students don't lack talent — they lack a map. Take a 2-minute skill assessment, get an
                honest level check, and follow a roadmap built for the career you actually want.
              </p>
              <div className="hero-cta">
                <Link className="btn btn-primary" to="/skills">
                  Take the free skill test
                  <Icon name="arrowRight" />
                </Link>
                <Link className="btn btn-ghost" to="/roadmap">
                  <Icon name="map" />
                  Explore roadmaps
                </Link>
              </div>

              <div className="hero-trust">
                <div className="item">
                  <strong><CountUp to={12400} suffix="+" /></strong>
                  <span>Students guided</span>
                </div>
                <div className="item">
                  <strong><CountUp to={6} /></strong>
                  <span>Career tracks</span>
                </div>
                <div className="item">
                  <strong><CountUp to={24} /></strong>
                  <span>Core skills mapped</span>
                </div>
                <div className="item">
                  <strong><CountUp to={92} suffix="%" /></strong>
                  <span>Found clarity</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="float-chip chip-1">
                <Icon name="check" size={16} strokeWidth={2.2} />
                Roadmap updated
              </div>
              <div className="float-chip chip-2">
                <Icon name="bolt" size={16} />
                +18% this month
              </div>

              <div className="gps-card">
                <div className="gps-head">
                  <span className="title">Skill GPS · Dashboard</span>
                  <span className="gps-dots"><i /><i /><i /></span>
                </div>

                <div className="gps-profile">
                  <div className="avatar">AS</div>
                  <div>
                    <h4>Aarav Sharma</h4>
                    <p>B.Tech CSE · 2nd year</p>
                  </div>
                  <span className="badge badge-accent" style={{ marginLeft: 'auto' }}>Intermediate</span>
                </div>

                <div className="gps-skills">
                  {heroSkills.map((s) => (
                    <div className="gps-skill" key={s.name}>
                      <div className="meta">
                        <b>{s.name}</b>
                        <span>{s.value}%</span>
                      </div>
                      <div className={`bar ${s.cls}`}>
                        <span style={{ width: barsReady ? `${s.value}%` : 0 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gps-footer">
                  <div>
                    <div className="score">54<small>/100</small></div>
                    <span className="small muted">Overall readiness</span>
                  </div>
                  <span className="badge badge-dot">Next: React hooks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="why">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Why Skill GPS</span>
            <h2 className="h2">A compass, not another course library</h2>
            <p>
              Thousands of tutorials tell you <em>what</em> to learn. We tell you where you are, what actually
              matters next, and how long it will take.
            </p>
          </Reveal>

          <Reveal className="grid grid-3">
            {features.map((f) => (
              <article className="card" key={f.title}>
                <div className="card-icon"><Icon name={f.icon} size={23} strokeWidth={1.8} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="tracks">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Career tracks</span>
            <h2 className="h2">Six paths. Pick the one that fits you.</h2>
            <p>Each track includes a skill breakdown, an assessment and a phase-by-phase roadmap with realistic timelines.</p>
          </Reveal>

          <Reveal className="grid grid-3">
            {DOMAINS.map((d) => (
              <Link key={d.id} className="card domain-card" to={`/skills?domain=${d.id}`} style={{ '--dc': d.color }}>
                <div className="dc-top">
                  <div className="dc-icon" dangerouslySetInnerHTML={{ __html: d.icon }} />
                  <span className="demand">{d.demand}% demand</span>
                </div>
                <h3>{d.name}</h3>
                <p>{d.tagline}</p>
                <div className="domain-meta">
                  <span><b>{d.skills.length}</b> core skills</span>
                  <span>{d.duration}</span>
                </div>
              </Link>
            ))}
          </Reveal>

          <div className="center mt-6">
            <Link className="btn btn-ghost" to="/skills">
              Compare all tracks
              <Icon name="arrowRight" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">How it works</span>
            <h2 className="h2">From confused to clear in four steps</h2>
            <p>No account, no payment, no 40-hour video course you will never finish.</p>
          </Reveal>

          <Reveal className="steps">
            {steps.map((s) => (
              <div className="step" key={s.title}>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-alt" id="stories">
        <div className="container">
          <Reveal className="section-head center">
            <span className="eyebrow">Student stories</span>
            <h2 className="h2">Clarity changes everything</h2>
            <p>Real feedback from students who stopped guessing and started building.</p>
          </Reveal>

          <Reveal className="grid grid-3">
            {stories.map((s) => (
              <article className="card quote-card" key={s.name}>
                <div className="stars" aria-label="5 out of 5">
                  {Array.from({ length: 5 }).map((_, k) => <StarIcon key={k} />)}
                </div>
                <blockquote>{s.quote}</blockquote>
                <div className="quote-person">
                  <div className="avatar">{s.initials}</div>
                  <div><b>{s.name}</b><span>{s.meta}</span></div>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="cta-band">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Your next 10 minutes</span>
            <h2 className="h2">Stop guessing. Get your bearings.</h2>
            <p>Free, private and instant. Your results stay in your browser — no sign-up, no spam.</p>
            <div className="hero-cta">
              <Link className="btn btn-primary" to="/skills">
                Start the assessment
                <Icon name="arrowRight" />
              </Link>
              <Link className="btn btn-ghost" to="/contact">Talk to us</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
