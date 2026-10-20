import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, getDomain } from '../lib/data';
import { toast } from '../lib/ui';
import { Icon } from '../components/Icon';
import { Reveal } from '../components/Reveal';
import { usePageMeta } from '../lib/meta';

const TRACKS = [
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'AI & Machine Learning',
  'Cloud & DevOps'
];

const FAQS = [
  {
    q: 'Is Skill GPS really free?',
    a: 'Yes. The assessment, skill library and all roadmaps are free for students. No account is required, and your results stay in your browser.'
  },
  {
    q: 'How accurate is the assessment?',
    a: 'It is a short diagnostic, not a certification. Eight questions give a useful directional read on four core skills. Use it to decide what to learn next — not as proof of expertise.'
  },
  {
    q: 'Where is my progress stored?',
    a: "Everything is stored in your browser's local storage. Clearing site data will reset your assessment and checked milestones, and nothing is uploaded to a server."
  },
  {
    q: 'Can I follow more than one track?',
    a: 'Absolutely — and it is often smart. Web development plus design, or data science plus cloud, are strong combinations. Progress is tracked independently for each track.'
  },
  {
    q: 'Do you offer mentorship or placements?',
    a: 'Not yet. Right now we focus on honest self-assessment and clear roadmaps. If you want guidance on a specific decision, email us and we will point you in the right direction.'
  }
];

const saved = Store.getAssessment();

export default function Contact() {
  usePageMeta('contact');
  const [form, setForm] = useState({
    name: '',
    email: '',
    track: saved ? getDomain(saved.domain).name : '',
    role: 'College student',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  useEffect(() => {
    document.title = 'Contact & Support — Skill GPS';
  }, []);

  const rules = {
    name: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),
    message: (v) => v.trim().length >= 10
  };

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[name];
        return next;
      });
    }
  };

  const validateField = (name) => {
    const rule = rules[name];
    if (!rule) return true;
    return rule(form[name]);
  };

  function submit(e) {
    e.preventDefault();
    const nextErrors = {};
    Object.keys(rules).forEach((name) => {
      if (!validateField(name)) nextErrors[name] = true;
    });

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast('Please fix the highlighted fields.', 'error');
      const first = Object.keys(nextErrors)[0];
      document.getElementById(first)?.focus();
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: '', email: '', track: '', role: 'College student', message: '' });
      setErrors({});
      toast('Message sent. We usually reply within one working day.', 'success', 4200);
    }, 900);
  }

  const invalid = (name) => (errors[name] ? 'field invalid' : 'field');

  return (
    <>
      <section className="page-head">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <Icon name="arrowRight" size={13} />
            <span>Contact</span>
          </div>
          <span className="eyebrow">We reply within 24 hours</span>
          <h1>Let’s find your direction.</h1>
          <p>
            Stuck between two tracks? Want a second opinion on your roadmap? Send a message — a real human reads
            every one.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 30, alignItems: 'start' }}>
            <div className="panel">
              <div className="panel-head">
                <h3>Send us a message</h3>
                <span className="badge badge-dot">Online</span>
              </div>
              <div className="panel-body">
                <form id="contactForm" noValidate onSubmit={submit}>
                  <div className="form-grid">
                    <div className={invalid('name')}>
                      <label htmlFor="name">Full name <span className="req">*</span></label>
                      <input
                        className="input"
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Aarav Sharma"
                        autoComplete="name"
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                        onBlur={() => form.name.trim() && !validateField('name') && setErrors((x) => ({ ...x, name: true }))}
                        aria-invalid={Boolean(errors.name)}
                      />
                      <span className="err">Please enter your name (at least 2 characters).</span>
                    </div>

                    <div className={invalid('email')}>
                      <label htmlFor="email">Email <span className="req">*</span></label>
                      <input
                        className="input"
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@college.edu"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        onBlur={() => form.email.trim() && !validateField('email') && setErrors((x) => ({ ...x, email: true }))}
                        aria-invalid={Boolean(errors.email)}
                      />
                      <span className="err">Please enter a valid email address.</span>
                    </div>

                    <div className="field">
                      <label htmlFor="track">Track of interest</label>
                      <select className="input" id="track" value={form.track} onChange={(e) => setField('track', e.target.value)}>
                        <option value="">Not sure yet</option>
                        {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div className="field">
                      <label htmlFor="role">You are</label>
                      <select className="input" id="role" value={form.role} onChange={(e) => setField('role', e.target.value)}>
                        <option>College student</option>
                        <option>School student</option>
                        <option>Recent graduate</option>
                        <option>Working professional</option>
                        <option>Teacher / counsellor</option>
                      </select>
                    </div>

                    <div className={`${invalid('message')} full`}>
                      <label htmlFor="message">Message <span className="req">*</span></label>
                      <textarea
                        className="input"
                        id="message"
                        name="message"
                        placeholder="Tell us where you are stuck, what you have tried, and what kind of help you need…"
                        value={form.message}
                        onChange={(e) => setField('message', e.target.value)}
                        onBlur={() => form.message.trim() && !validateField('message') && setErrors((x) => ({ ...x, message: true }))}
                        aria-invalid={Boolean(errors.message)}
                      />
                      <span className="err">Please write at least 10 characters.</span>
                    </div>

                    <div className="field full">
                      <button className="btn btn-primary btn-block" type="submit" disabled={sending}>
                        {sending ? 'Sending…' : 'Send message'}
                        {!sending && <Icon name="send" />}
                      </button>
                      <p className="form-note">
                        This demo form validates locally. Connect it to your backend or a service like Formspree
                        to receive messages.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="stack" style={{ gap: 16 }}>
              <div className="contact-info">
                <a className="info-card" href="mailto:hello@skillgps.dev">
                  <span className="ic-icon"><Icon name="mail" size={19} /></span>
                  <div><b>Email</b><span>hello@skillgps.dev</span></div>
                </a>
                <a className="info-card" href="tel:+919000000000">
                  <span className="ic-icon"><Icon name="phone" size={19} /></span>
                  <div><b>Phone</b><span>+91 90000 00000 · Mon–Fri</span></div>
                </a>
                <div className="info-card">
                  <span className="ic-icon"><Icon name="pin" size={19} /></span>
                  <div><b>Based in</b><span>Bengaluru, India · working with students everywhere</span></div>
                </div>
                <div className="info-card">
                  <span className="ic-icon"><Icon name="clock" size={19} /></span>
                  <div><b>Response time</b><span>Usually within one working day</span></div>
                </div>
              </div>

              <div className="card" style={{ marginTop: 4 }}>
                <h3 style={{ fontSize: '1rem' }}>Quick self-serve</h3>
                <p style={{ marginBottom: 14 }}>Most questions are answered instantly on these pages.</p>
                <div className="stack" style={{ gap: 8 }}>
                  <Link className="card-link" style={{ margin: 0 }} to="/skills">Take the skill assessment →</Link>
                  <Link className="card-link" style={{ margin: 0 }} to="/skills#library">Browse the skill library →</Link>
                  <Link className="card-link" style={{ margin: 0 }} to="/roadmap">Open a career roadmap →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="faq">
        <div className="container">
          <div className="grid grid-2" style={{ gap: 44, alignItems: 'start' }}>
            <Reveal>
              <span className="eyebrow">FAQ</span>
              <h2 className="h2">Answers before you ask</h2>
              <p className="muted">Still unsure about something? Send a message and we will add the answer here.</p>
              <a className="btn btn-ghost mt-2" href="#contactForm">Ask a question</a>
            </Reveal>

            <div className="faq">
              {FAQS.map((item, i) => {
                const open = faqOpen === i;
                return (
                  <div className={`faq-item ${open ? 'open' : ''}`} key={item.q}>
                    <button
                      className="faq-q"
                      aria-expanded={open}
                      onClick={() => setFaqOpen(open ? null : i)}
                    >
                      {item.q}
                      <span className="plus" aria-hidden="true" />
                    </button>
                    <div className="faq-a" style={{ maxHeight: open ? '300px' : 0 }}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
