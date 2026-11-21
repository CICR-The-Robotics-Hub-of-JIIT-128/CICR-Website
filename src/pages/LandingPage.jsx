import React, { useState, useEffect, useRef } from 'react';
import CommunityJoinCard from '../components/CommunityJoinCard';
import Canvas3D from '../components/Canvas3D';
import CoverflowGallery from '../components/CoverflowGallery';
import HorizontalProjectsSection from '../components/HorizontalProjectsSection';
import {
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Terminal,
  Activity,
  Zap,
  Box,
  Compass,
  Radio,
  Eye,
  Crosshair,
  Shield,
  Github,
  Award,
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
  GraduationCap,
  Film,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2
} from 'lucide-react';

// ===================================================================
// Typewriter Component: Cycles through 'Build', 'Engineer', 'Automate'
// ===================================================================
function TypewriterWord({
  words = ['Build', 'Engineer', 'Automate'],
  typingSpeed = 110,
  deletingSpeed = 60,
  pauseTime = 1800,
  switchDelay = 350
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('Build');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex % words.length];
    let timer;

    if (!isDeleting) {
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length + 1));
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(currentWord.substring(0, text.length - 1));
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }, switchDelay);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime, switchDelay]);

  return (
    <span className="typewriter-word-wrap">
      <span className="typewriter-text">{text}</span>
      <span className="typewriter-cursor" aria-hidden="true">|</span>
    </span>
  );
}

export default function LandingPage({ setCurrentPage, onOpenChat }) {
  // Expanding Memory Video State & Scroll Expansion
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [videoTimecode, setVideoTimecode] = useState('00:00:00:00');

  const handleTimeUpdate = (e) => {
    const t = e.target.currentTime || 0;
    const mins = Math.floor(t / 60).toString().padStart(2, '0');
    const secs = Math.floor(t % 60).toString().padStart(2, '0');
    const frames = Math.floor((t % 1) * 30).toString().padStart(2, '0');
    setVideoTimecode(`00:${mins}:${secs}:${frames}`);
  };
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (trackRef.current) {
            const rect = trackRef.current.getBoundingClientRect();
            const vh = window.innerHeight;
            // Expansion starts as section enters view (vh * 0.82)
            // and reaches full expansion (100vw) near the top third of viewport (vh * 0.22)
            const start = vh * 0.82;
            const end = vh * 0.22;
            const rawProgress = (start - rect.top) / (start - end);
            const p = Math.min(Math.max(rawProgress, 0), 1);
            setScrollProgress(p);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Calculate expansion progress: 0 (framed card) -> 1 (covers whole screen width)
  const smoothedExp = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
  const isMobile = dimensions.width <= 768;

  const baseW = isMobile
    ? Math.max(dimensions.width - 24, 280)
    : Math.min(Math.max(dimensions.width * 0.72, 680), 1060);
  const targetW = dimensions.width;
  const cardWidth = Math.round(baseW + (targetW - baseW) * smoothedExp);
  const cardRadius = Math.round((isMobile ? 14 : 24) * (1 - smoothedExp));
  const cardScale = isMobile ? 1 : 0.95 + 0.05 * smoothedExp;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="jodc-landing-wrapper">
      {/* Clean Gridlines Background across whole page */}
      <div className="bg-grid-pattern"></div>

      {/* =================================================================
           1. HERO SECTION (Exact JODC Layout: Left-Aligned, Italic Serif Accent,
              Dual Action Buttons, 3 Bento Cards, Center Scroll Pill, Marquee Strip)
           ================================================================= */}
      {/* =================================================================
           1. HERO SECTION (Exact 3rd Screenshot: Clean Centered Typography,
              Typewriter Word + 'in the lab.', Two-Paragraph Mission Subtext, Dual Action Buttons)
           ================================================================= */}
      <section className="jodc-hero-section jodc-hero-centered-layout" id="hero">
        <div className="jodc-hero-main-container hero-centered-container">
          <div className="jodc-hero-center-box">
            {/* Centered Headline: Build| in the lab. */}
            <h1 className="jodc-hero-title-centered">
              <span className="hero-typed-word">
                <TypewriterWord words={['Build', 'Engineer', 'Automate']} />
              </span>{' '}
              <span className="hero-accent-serif">
                in the lab<span className="brand-dot-gradient">.</span>
                {/* Hand-drawn SVG curve underline */}
                <svg
                  viewBox="0 0 280 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="hero-underline-svg"
                  aria-hidden="true"
                >
                  <path
                    d="M4 14 C 60 4, 130 4, 190 9 S 250 16, 276 8"
                    stroke="url(#jodc-gradient-pink-blue)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="jodc-gradient-pink-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Mission Subtext Matching 3rd Screenshot */}
            <div className="jodc-hero-desc-group">
              <p className="jodc-hero-lead-line">
                Think beyond code. Build beyond imagination.
              </p>
              <p className="jodc-hero-body-line">
                CICR is the robotics and innovation community at JIIT-128. We design, build and
                experiment with autonomous systems, robotics, embedded technologies and intelligent
                machines to solve real engineering challenges.
              </p>
            </div>

            {/* Centered Dual Action Buttons */}
            <div className="jodc-hero-actions-centered">
              <a
                href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
                target="_blank"
                rel="noopener noreferrer"
                className="jodc-btn-white"
              >
                <span>Become a Member</span>
                <span className="jodc-btn-dark-circle">
                  <ArrowUpRight size={15} />
                </span>
              </a>

              <button
                onClick={() => scrollToSection('about')}
                className="jodc-btn-glass"
              >
                <span>See What We Do</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Centered Scroll Indicator Capsule */}
          <div className="jodc-scroll-indicator-wrap" onClick={() => scrollToSection('memories')}>
            <div className="scroll-capsule">
              <span className="scroll-dot"></span>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
           2. EXPANDING MEMORY REEL (Smooth Scroll-Driven Fullscreen Expansion)
           ================================================================= */}
      <section className="memory-section" id="memories" ref={trackRef}>
        <div className="memory-section-inner">
          {/* Section Title: Memories. in cool serif italic with white + mixed color gradient & underline */}
          <div className="memory-title-wrap">
            <h2 className="memory-title-heading">
              <span className="memory-accent-serif">
                Memories<span className="memory-dot">.</span>
                {/* Hand-drawn SVG curve underline matching Diaries style */}
                <svg
                  viewBox="0 0 280 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="memory-underline-svg"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 14 C 60 4, 130 4, 190 9 S 250 16, 276 8"
                    stroke="url(#memories-gradient-white-mix)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="memories-gradient-white-mix" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="25%" stopColor="#f472b6" />
                      <stop offset="65%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h2>
          </div>

          {/* Expanding Video Card: Smoothly expands to 100vw covering the whole screen width */}
          <div
            className="memory-card-shell"
            style={{
              width: smoothedExp >= 0.98 ? '100vw' : `${cardWidth}px`,
              maxWidth: '100vw',
              borderRadius: `${cardRadius}px`,
              transform: `scale(${cardScale})`,
              border: smoothedExp > 0.96 ? 'none' : '1px solid rgba(255, 255, 255, 0.16)',
              boxShadow:
                smoothedExp > 0.92
                  ? 'none'
                  : '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 255, 255, 0.04)'
            }}
          >
            <div className="memory-video-box">
              <video
                ref={videoRef}
                src="/cicr-memory.mp4"
                autoPlay
                loop
                muted
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className="memory-video-tag filter-bw"
              />

              {/* Camcorder Live Recording HUD Overlay */}
              <div className="camcorder-hud-overlay" aria-hidden="true">
                {/* 4 Corner Viewfinder Brackets */}
                <div className="hud-corner hud-corner-tl" />
                <div className="hud-corner hud-corner-tr" />
                <div className="hud-corner hud-corner-bl" />
                <div className="hud-corner hud-corner-br" />

                {/* Center Autofocus Reticle [ + ] */}
                <div className="hud-center-focus">
                  <div className="hud-focus-bracket-left" />
                  <div className="hud-focus-crosshair" />
                  <div className="hud-focus-bracket-right" />
                </div>

                {/* Top Status Bar: Blinking REC + Live Timecode + 4K / Battery */}
                <div className="hud-top-bar">
                  <div className="hud-rec-badge">
                    <span className="hud-rec-dot" />
                    <span className="hud-rec-text">REC</span>
                    <span className="hud-timecode">{videoTimecode}</span>
                  </div>

                  <div className="hud-top-meta">
                    <div className="hud-battery-box" title="Battery: 86%">
                      <span className="hud-battery-level">86%</span>
                      <div className="hud-battery-icon">
                        <div className="hud-battery-fill" />
                        <div className="hud-battery-tip" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Storage & Timestamp */}
                <div className="hud-bottom-bar">
                  <div className="hud-bottom-meta">
                    <span className="hud-storage">SD1 [01:48:22]</span>
                    <span className="hud-date-stamp">16 NOV 2026</span>
                  </div>
                </div>

                {/* Subtle Scanline Overlay */}
                <div className="hud-scanline-fx" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================
           3. HORIZONTAL SCROLL PROJECTS SHOWCASE (Upmanyu Portfolio Reference)
           ================================================================= */}
      <HorizontalProjectsSection setCurrentPage={setCurrentPage} />

      {/* =================================================================
           4. 3D COVERFLOW GALLERY (Advanced Media Gallery like CodeCanyon 3D Photo Scroll)
           ================================================================= */}
      <CoverflowGallery />

      {/* =================================================================
           4. COMMUNITY JOIN CARD (User's Exact Attachment Match)
           ================================================================= */}
      <CommunityJoinCard />
    </div>
  );
}
