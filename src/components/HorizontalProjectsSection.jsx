import React, { useEffect, useRef } from 'react';
import { projectsCatalog } from '../data/projectsData';
import { ArrowRight, Award } from 'lucide-react';

export default function HorizontalProjectsSection({ setCurrentPage }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  const metricsRef = useRef({
    maxTranslate: 0,
    scrollTravel: 0,
    endDwell: 0,
    windowHeight: 0,
  });

  const stateRef = useRef({
    currentX: 0,
    targetX: 0,
    skew: 0,
    targetSkew: 0,
    isLooping: false,
    rafId: null,
  });

  useEffect(() => {
    const updateMetrics = () => {
      if (!containerRef.current || !trackRef.current) return;

      const trackWidth = trackRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const lastCard = trackRef.current.querySelector('.h-project-card:last-child');
      const lastCardWidth = lastCard ? lastCard.offsetWidth : 360;

      // Center the 13th project horizontally on screen when fully translated
      const centerOffset = Math.max((windowWidth - lastCardWidth) / 2, 40);
      const maxTranslate = Math.max(0, trackWidth - windowWidth + centerOffset);

      // Pacing: 1.1x provides natural, responsive 1:1 feel matching Upmanyu portfolio
      const scrollTravel = Math.round(maxTranslate * 1.1);
      // Gentle dwell so user can view Box 13, then continue down with 1 scroll tick
      const endDwell = Math.min(Math.round(windowHeight * 0.22), 180);

      containerRef.current.style.height = `${windowHeight + scrollTravel + endDwell}px`;

      metricsRef.current = {
        maxTranslate,
        scrollTravel,
        endDwell,
        windowHeight,
      };
    };

    const updateTargetFromScroll = () => {
      if (!containerRef.current) return;
      const { maxTranslate, scrollTravel } = metricsRef.current;
      if (maxTranslate <= 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const state = stateRef.current;

      if (scrolled <= 0) {
        state.targetX = 0;
      } else if (scrolled >= scrollTravel) {
        state.targetX = maxTranslate;
      } else {
        state.targetX = (scrolled / scrollTravel) * maxTranslate;
      }
    };

    // Smooth, high-performance animation loop (Zero lag, buttery 60/120fps, Lenis/Upmanyu feel)
    const tick = () => {
      const state = stateRef.current;
      const track = trackRef.current;

      if (!track) {
        state.isLooping = false;
        return;
      }

      updateTargetFromScroll();

      const diff = state.targetX - state.currentX;

      // 0.26 lerp: instantly responsive, zero lag, smooth wheel smoothing
      if (Math.abs(diff) > 0.08) {
        state.currentX += diff * 0.26;
      } else {
        state.currentX = state.targetX;
      }

      // Dynamic velocity tilt matching Upmanyu portfolio
      const velocity = diff;
      state.targetSkew = Math.max(-2.5, Math.min(2.5, velocity * 0.07));
      state.skew += (state.targetSkew - state.skew) * 0.18;

      track.style.transform = `translate3d(-${state.currentX.toFixed(2)}px, 0, 0)`;

      // Continue animating until completely settled
      if (Math.abs(diff) > 0.1 || Math.abs(state.skew) > 0.05) {
        state.rafId = requestAnimationFrame(tick);
      } else {
        state.isLooping = false;
      }
    };

    const onScroll = () => {
      const state = stateRef.current;
      if (!state.isLooping) {
        state.isLooping = true;
        state.rafId = requestAnimationFrame(tick);
      }
    };

    const syncImmediate = () => {
      updateMetrics();
      updateTargetFromScroll();
      const state = stateRef.current;
      state.currentX = state.targetX;
      state.skew = 0;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${state.currentX.toFixed(2)}px, 0, 0)`;
      }
    };

    syncImmediate();

    const timer1 = setTimeout(syncImmediate, 200);
    const timer2 = setTimeout(syncImmediate, 800);

    window.addEventListener('scroll', onScroll, { passive: true });
    const onResize = () => {
      updateMetrics();
      onScroll();
    };
    window.addEventListener('resize', onResize, { passive: true });

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics();
      });
      resizeObserver.observe(trackRef.current);
    }

    // Support horizontal trackpad gestures
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        window.scrollBy({ top: e.deltaX * 0.8, behavior: 'auto' });
      }
    };
    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (containerEl) {
        containerEl.removeEventListener('wheel', handleWheel);
      }
      if (stateRef.current.rafId) {
        cancelAnimationFrame(stateRef.current.rafId);
      }
    };
  }, []);

  return (
    <section className="horizontal-projects-scroll-wrapper" id="featured-projects" ref={containerRef}>
      {/* Sticky Fullscreen Stage */}
      <div className="horizontal-sticky-viewport">
        {/* Centered Section Title matching Memories */}
        <div className="h-projects-header-centered">
          <h2 className="h-projects-title-heading">
            <span className="h-projects-accent-serif">
              Featured Innovations<span className="memory-dot">.</span>
              {/* Hand-drawn SVG curve underline matching Memories style */}
              <svg
                viewBox="0 0 280 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-projects-underline-svg"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 14 C 60 4, 130 4, 190 9 S 250 16, 276 8"
                  stroke="url(#projects-gradient-white-mix)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="projects-gradient-white-mix" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="40%" stopColor="#f472b6" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#a855f7" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="1" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
        </div>

        {/* Sliding Stage */}
        <div className="h-projects-sliding-stage">
          <div className="h-projects-track" ref={trackRef}>
            {/* 1. Intro Callout Card */}
            <div className="h-project-intro-card">
              <div className="h-intro-inner">
                <h2 className="h-intro-title">
                  We also<br />
                  <span className="h-intro-serif">build<span className="brand-dot-orange">.</span></span>
                </h2>

                <p className="h-intro-desc">
                  Autonomous vision heads, interactive AI hosts, payload delivery quadcopters, and smart IoT systems engineered in-house at JIIT-128.
                </p>

                <button
                  onClick={() => setCurrentPage && setCurrentPage('projects')}
                  className="h-intro-cta-btn"
                  title="View all projects in detail"
                >
                  <span>Explore All Projects</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* 2. The 13 Featured Project Cards */}
            {projectsCatalog.map((project, idx) => {
              const numStr = String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={project.id}
                  className="h-project-card"
                  onClick={() => setCurrentPage && setCurrentPage('projects')}
                  title={`View ${project.title}`}
                >
                  {/* Card Visual / Photo Box */}
                  <div className="h-card-image-box">
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      className="h-card-img"
                    />
                    <div className="h-card-img-gradient" />

                    {/* Achievement Pill if present */}
                    {project.achievement && (
                      <div className="h-card-award-ribbon">
                        <Award size={13} className="award-icon" />
                        <span className="award-text">{project.achievement}</span>
                      </div>
                    )}
                  </div>

                  {/* Below Card: Structured, Aligned Text Rows */}
                  <div className="h-card-footer-meta">
                    <div className="h-card-title-row">
                      <span className="h-num-accent">{numStr}</span>
                      <span className="h-title-text">{project.title.toUpperCase()}</span>
                    </div>

                    {project.subtitle && (
                      <div className="h-card-subtitle-row">
                        <span className="h-sub-text">{project.subtitle.toUpperCase()}</span>
                      </div>
                    )}

                    {/* Idea summary in short */}
                    <p className="h-card-short-idea">{project.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
