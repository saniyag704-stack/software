import { Link } from 'react-router-dom';
import { SocialIcon } from './Icon';
import { Brand } from './Nav';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="mt-2">
              Helping students find a direction worth committing to — one honest skill check at a time.
            </p>
            <div className="socials mt-2">
              <a href="#" aria-label="LinkedIn"><SocialIcon name="linkedin" /></a>
              <a href="#" aria-label="GitHub"><SocialIcon name="github" /></a>
              <a href="#" aria-label="Instagram"><SocialIcon name="instagram" /></a>
            </div>
          </div>

          <div>
            <h5>Platform</h5>
            <div className="footer-links">
              <Link to="/skills">Skill assessment</Link>
              <Link to="/skills#library">Skill library</Link>
              <Link to="/roadmap">Career roadmaps</Link>
              <Link to="/roadmap">My progress</Link>
            </div>
          </div>

          <div>
            <h5>Resources</h5>
            <div className="footer-links">
              <Link to="/#how">How it works</Link>
              <Link to="/#stories">Student stories</Link>
              <Link to="/contact#faq">FAQs</Link>
              <Link to="/contact">Support</Link>
            </div>
          </div>

          <div>
            <h5>Company</h5>
            <div className="footer-links">
              <Link to="/contact">About us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/contact">Privacy</Link>
              <Link to="/contact">Terms</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Skill GPS. Built for students, by students.</span>
          <span>
            Made with care in India · <Link to="/contact" style={{ color: 'var(--accent)' }}>Say hello</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
