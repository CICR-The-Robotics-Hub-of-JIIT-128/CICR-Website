import React from 'react';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="cicr-footer-terminal-root" id="footer">
      <div className="footer-terminal-container">
        {/* Same-line row containing both the video and social handles */}
        <div className="footer-inline-content">
          {/* Animated Cybernetic Dot-Matrix Video Screen from footer.mp4 */}
          <div className="footer-screen-wrapper">
            <video
              src="/footer.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="footer-matrix-video"
            />
          </div>

          {/* Social Handles Side Column */}
          <div className="footer-social-side-col">
            <div className="footer-handles-heading-row">
              <span className="footer-handles-dot" />
              <span className="footer-handles-heading">CICR Official handles</span>
            </div>
            <div className="footer-social-row-inline">
              <a
                href="https://github.com/CICR-The-Robotics-Hub-of-JIIT-128"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                title="CICR GitHub Organization"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/cicrjiit128/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                title="CICR LinkedIn"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/cicr_jiit/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-pill"
                title="CICR Instagram"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:cicrjiit128noida@gmail.com"
                className="footer-social-pill"
                title="Email CICR"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
