import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from './Icon';

export function Brand({ onClick }) {
  return (
    <Link className="brand" to="/" aria-label="Skill GPS home" onClick={onClick}>
      <span className="brand-mark">
        <Icon name="compass" size={20} strokeWidth={2} />
      </span>
      <span>
        Skill GPS
        <small>Career navigation</small>
      </span>
    </Link>
  );
}

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/skills', label: 'Skills' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/contact', label: 'Contact' }
];

export default function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Tapping anywhere outside the header or the panel closes the mobile menu.
  // The listener runs in the capture phase and walks the original event path,
  // because changing the icon re-renders (and detaches) the element that was
  // clicked before a bubble-phase listener would see it.
  useEffect(() => {
    if (!open) return undefined;

    const onDocumentClick = (event) => {
      const path = typeof event.composedPath === 'function' ? event.composedPath() : [event.target];
      const insideNav = path.some(
        (node) => node instanceof Element && (node.classList.contains('nav') || node.classList.contains('mobile-menu'))
      );
      if (!insideNav) setOpen(false);
    };

    document.addEventListener('click', onDocumentClick, { capture: true });
    return () => document.removeEventListener('click', onDocumentClick, { capture: true });
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Brand />

          <nav className="nav-links" aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="icon-btn"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
            </button>
            <Link className="btn btn-primary btn-sm" to="/skills">
              Start assessment
            </Link>
            <button
              className="icon-btn nav-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobileMenu"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? 'close' : 'menu'} size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? 'open' : ''}`} id="mobileMenu">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <Link className="btn btn-primary" to="/skills" onClick={() => setOpen(false)}>
          Start free assessment
        </Link>
      </div>
    </>
  );
}
