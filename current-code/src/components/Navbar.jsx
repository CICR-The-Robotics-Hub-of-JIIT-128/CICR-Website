import React, { useState, useEffect, useRef } from 'react';
import cicrLogo from '../assets/cicr-logo.png';
import {
  Bell,
  Menu,
  X,
  ExternalLink,
  Github,
  Instagram,
  Linkedin
} from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, onOpenChat }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const notifRef = useRef(null);

  // Detect scroll state and current section on page with hysteresis buffer
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 85) {
        setIsScrolled(true);
      } else if (scrollY < 40) {
        setIsScrolled(false);
      }

      // Section breadcrumb detection on Home page
      if (currentPage === 'home') {
        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const isNearBottom = scrollBottom >= docHeight - 120;

        if (isNearBottom) {
          setActiveSection('Footer');
        } else {
          const sections = [
            { id: 'footer', name: 'Footer' },
            { id: 'community', name: 'Footer' },
            { id: 'gallery', name: 'CICR Diaries' },
            { id: 'featured-projects', name: 'Projects' },
            { id: 'memories', name: 'Memories' }
          ];

          let current = '';
          for (const sec of sections) {
            const el = document.getElementById(sec.id);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= Math.min(window.innerHeight * 0.6, 420)) {
                current = sec.name;
                break;
              }
            }
          }
          setActiveSection(current);
        }
      } else {
        setActiveSection('');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Close notifications on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [notificationsOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (pageId, anchor = null) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Outer Header Wrapper: changes between Full-Width (1st SS) and Floating Island Capsule (2nd SS) */}
      <header className={`jodc-navbar-outer ${isScrolled ? 'scrolled-island-mode' : 'top-bar-mode'}`}>
        <div className="jodc-navbar-capsule">
          {/* Left: Official CICR Stencil Logo + Orange Dot + Subheading (Aligned Text Column) */}
          <div
            className="jodc-nav-brand"
            onClick={() => handleNavClick('home')}
            role="button"
            tabIndex={0}
            title="CICR - The Robotic Society of JIIT 128"
          >
            <img
              src={cicrLogo}
              alt="CICR Logo"
              className="jodc-brand-logo-img"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/cicr-logo.png';
              }}
            />
            <div className="jodc-brand-text-col">
              <div className="jodc-brand-logo-row">
                <span className="jodc-brand-title-text">CICR</span>
                <span className="brand-dot-orange">.</span>
              </div>
              <span className="jodc-brand-subheading">The Robotic Society of JIIT 128</span>
            </div>
          </div>

          {/* Center: Nav Links Dock */}
          <nav className="jodc-nav-center-dock" aria-label="Main Navigation">
            {/* 1. Home */}
            <button
              className={`jodc-dock-item ${currentPage === 'home' ? 'active-pill' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <span>Home</span>
              {currentPage === 'home' && isScrolled && activeSection && (
                <>
                  <span className="dock-crumb-slash">/</span>
                  <span className="dock-crumb-section">{activeSection}</span>
                </>
              )}
            </button>

            {/* 2. Events */}
            <button
              className={`jodc-dock-item ${currentPage === 'events' ? 'active-pill' : ''}`}
              onClick={() => handleNavClick('events')}
            >
              <span>Events</span>
            </button>

            {/* 3. Projects */}
            <button
              className={`jodc-dock-item ${currentPage === 'projects' ? 'active-pill' : ''}`}
              onClick={() => handleNavClick('projects')}
            >
              <span>Projects</span>
            </button>

            {/* 4. Team */}
            <button
              className={`jodc-dock-item ${currentPage === 'team' ? 'active-pill' : ''}`}
              onClick={() => handleNavClick('team')}
            >
              <span>Team</span>
            </button>

            {/* 5. Inventory */}
            <a
              href="https://inventory.cicr.in"
              target="_blank"
              rel="noopener noreferrer"
              className="jodc-dock-item dock-item-highlight"
              title="Launch deployed hardware inventory portal"
            >
              <span>Inventory</span>
              <span className="dock-orange-dot" title="Live inventory"></span>
            </a>
          </nav>

          {/* Right: Actions (Notification Bell, Join CTA button, Mobile Toggle) */}
          <div className="jodc-nav-right-actions">
            {/* Circular Notification Bell */}
            <div className="jodc-notif-wrap" ref={notifRef}>
              <button
                className={`jodc-bell-icon-btn ${notificationsOpen ? 'active' : ''}`}
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Announcements & Alerts"
                title="Announcements"
              >
                <Bell size={17} />
                <span className="jodc-bell-dot"></span>
              </button>

              {/* Notifications Flyout Dropdown */}
              {notificationsOpen && (
                <div className="jodc-notif-dropdown">
                  <div className="jodc-notif-head">
                    <span className="jodc-notif-title">Announcements</span>
                    <span className="jodc-notif-badge">3 New</span>
                  </div>

                  <div className="jodc-notif-body">
                    <div
                      className="jodc-notif-item"
                      onClick={() => {
                        handleNavClick('projects');
                        setNotificationsOpen(false);
                      }}
                    >
                      <span className="notif-dot-gradient"></span>
                      <div className="jodc-notif-item-text">
                        <h6>Autonomous Drone Fleet</h6>
                        <p>Explore upcoming projects and research developments.</p>
                      </div>
                    </div>

                    <div
                      className="jodc-notif-item"
                      onClick={() => {
                        handleNavClick('registrations');
                        setNotificationsOpen(false);
                      }}
                    >
                      <span className="notif-dot-gradient"></span>
                      <div className="jodc-notif-item-text">
                        <h6>Permanent Registration Endpoint</h6>
                        <p>Instant scannable QR code and direct registration live.</p>
                      </div>
                    </div>

                    <a
                      href="https://inventory.cicr.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jodc-notif-item"
                    >
                      <span className="notif-dot-gradient"></span>
                      <div className="jodc-notif-item-text">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h6>Inventory Portal Online</h6>
                          <ExternalLink size={11} color="#38bdf8" />
                        </div>
                        <p>Reserve sensors, boards and LiPo batteries on inventory.cicr.in</p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* JODC-Style Orange Pill CTA: Join the club */}
            <a
              href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
              target="_blank"
              rel="noopener noreferrer"
              className="jodc-join-club-btn"
            >
              <span>Join the club</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              className="jodc-mobile-burger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile JODC-Style Overlay & Card Modal (Exact Match to User's Screenshot) */}
      {mobileMenuOpen && (
        <div className="jodc-mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="jodc-mobile-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Top Header Pill Capsule */}
            <div className="jodc-mobile-top-capsule">
              <div className="jodc-nav-brand" onClick={() => handleNavClick('home')}>
                <div className="jodc-brand-logo-row">
                  <img
                    src={cicrLogo}
                    alt="CICR Logo"
                    className="jodc-brand-logo-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/cicr-logo.png';
                    }}
                  />
                  <span className="jodc-brand-title-text">CICR</span>
                  <span className="brand-dot-orange">.</span>
                </div>
                <span className="jodc-brand-subheading">The Robotic Society of JIIT 128</span>
              </div>
              <button
                className="jodc-mobile-modal-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Menu Floating Card */}
            <div className="jodc-mobile-menu-card">
              {/* Nav Items List */}
              <div className="jodc-mobile-nav-list">
                {/* Home */}
                <button
                  className={`jodc-mobile-nav-item ${currentPage === 'home' ? 'active-orange' : ''}`}
                  onClick={() => handleNavClick('home')}
                >
                  <span>Home</span>
                </button>

                {/* Events */}
                <button
                  className={`jodc-mobile-nav-item ${currentPage === 'events' ? 'active-orange' : ''}`}
                  onClick={() => handleNavClick('events')}
                >
                  <span>Events</span>
                </button>

                {/* Projects */}
                <button
                  className={`jodc-mobile-nav-item ${currentPage === 'projects' ? 'active-orange' : ''}`}
                  onClick={() => handleNavClick('projects')}
                >
                  <span>Projects</span>
                </button>

                {/* Team */}
                <button
                  className={`jodc-mobile-nav-item ${currentPage === 'team' ? 'active-orange' : ''}`}
                  onClick={() => handleNavClick('team')}
                >
                  <span>Team</span>
                </button>

                {/* Inventory with SPOTLIGHT badge */}
                <a
                  href="https://inventory.cicr.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jodc-mobile-nav-item"
                >
                  <span>Inventory</span>
                  <span className="jodc-mobile-spotlight-badge">SPOTLIGHT</span>
                </a>
              </div>

              {/* Full-Width Orange CTA Button: Join the club */}
              <a
                href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
                target="_blank"
                rel="noopener noreferrer"
                className="jodc-mobile-card-join-btn"
              >
                <span>Join the club</span>
              </a>

              {/* 3-Column Social Icons Row: GitHub, Instagram, LinkedIn */}
              <div className="jodc-mobile-social-grid">
                <a
                  href="https://github.com/CICR-The-Robotics-Hub-of-JIIT-128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jodc-mobile-social-card"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>

                <a
                  href="https://www.instagram.com/cicr_jiit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jodc-mobile-social-card"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>

                <a
                  href="https://www.linkedin.com/company/cicr-jiit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="jodc-mobile-social-card"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
