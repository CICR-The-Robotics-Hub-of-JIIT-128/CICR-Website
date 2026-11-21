import React, { useEffect, useRef } from 'react';
import { projectsCatalog } from '../data/projectsData';
import { ArrowRight, Award } from 'lucide-react';

export default function HorizontalProjectsSection({ setCurrentPage }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  // Cached layout metrics to avoid reading DOM inside RAF loop (eliminates layout thrashing)
  const metricsRef = useRef({
    maxTranslate: 0,
    horizontalScrollTravel: 0,
    totalScrollTravel: 0,
    windowHeight: 0,
  });

  // Inertial RAF lerp state (matches Lenis smooth-scroll feel with 0 lag and 0 React re-renders)
  const animStateRef = useRef({
    targetX: 0,
    currentX: 0,
    isAnimating: false,
    rafId: null,
  });

  useEffect(() => {
    // 0.085 provides luxurious, buttery-smooth deceleration matching Lenis lerp
    const LERP_FACTOR = 0.12;

    // Dynamically calculate wrapper height based on actual track width and screen dimensions
    const updateMetrics = () => {
      if (!containerRef.current || !trackRef.current) return;

      const trackWidth = trackRef.current.scrollWidth;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Find last card width dynamically so Card 09 ends up centered in the viewport
      const lastCard = trackRef.current.querySelector('.h-project-card:last-child');
      const lastCardWidth = lastCard ? lastCard.offsetWidth : 390;

      // Center the 9th project horizontally on screen when fully translated
      const centerOffset = Math.max((windowWidth - lastCardWidth) / 2, 40);
      const maxTranslate = Math.max(0, trackWidth - windowWidth + centerOffset);

      // SCROLL PACING:
      // Allocate 1.85x vertical scroll space for the horizontal movement.
      // This slows down the scroll speed by ~46%, making each project glide smoothly
      // and comfortably across the screen instead of whizzing past.
      // SCROLL PACING:
      // Allocate generous vertical scroll space so every project (1 to 9)
      // glides smoothly and is completely visible before unpinning.
      const SCROLL_PACING = 2.0;
      const horizontalScrollTravel = maxTranslate * SCROLL_PACING;

      // Keep screen firmly pinned on the projects showcase until all projects
      // have been fully displayed across the screen!
      const pauseOnLastProject = Math.max(windowHeight * 0.65, 500);

      // Total vertical scroll space allocated for horizontal traversal + last card viewing
      const totalScrollTravel = horizontalScrollTravel + pauseOnLastProject;
      const totalHeight = windowHeight + totalScrollTravel;

      containerRef.current.style.height = `${totalHeight}px`;

      metricsRef.current = {
        maxTranslate,
        horizontalScrollTravel,
        totalScrollTravel,
        windowHeight,
      };
    };

    // Continuous RAF animation loop with lerp (GPU accelerated translate3d, 0 lag)
    const animate = () => {
      const anim = animStateRef.current;
      const diff = anim.targetX - anim.currentX;

      if (Math.abs(diff) > 0.15) {
        anim.currentX += diff * LERP_FACTOR;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${anim.currentX.toFixed(2)}px, 0, 0)`;
        }
        anim.rafId = requestAnimationFrame(animate);
      } else {
        anim.currentX = anim.targetX;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${anim.currentX.toFixed(2)}px, 0, 0)`;
        }
        anim.isAnimating = false;
      }
    };

    // Passive scroll handler: computes targetX and wakes RAF loop if sleeping
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;

      const { maxTranslate, horizontalScrollTravel } = metricsRef.current;
      if (maxTranslate <= 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const anim = animStateRef.current;

      if (scrolled <= 0) {
        anim.targetX = 0;
      } else if (scrolled >= horizontalScrollTravel) {
        // Locked at Card 09 throughout the dwell buffer!
        anim.targetX = maxTranslate;
      } else {
        // Smooth, slow, controlled gliding
        const progress = scrolled / horizontalScrollTravel;
        anim.targetX = progress * maxTranslate;
      }

      if (!anim.isAnimating) {
        anim.isAnimating = true;
        anim.rafId = requestAnimationFrame(animate);
      }
    };

    // Immediate sync on initial render or resize without jump
    const syncImmediate = () => {
      updateMetrics();
      if (!containerRef.current || !trackRef.current) return;
      const { maxTranslate, horizontalScrollTravel } = metricsRef.current;
      if (maxTranslate <= 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const anim = animStateRef.current;

      let initialX = 0;
      if (scrolled <= 0) {
        initialX = 0;
      } else if (scrolled >= horizontalScrollTravel) {
        initialX = maxTranslate;
      } else {
        initialX = (scrolled / horizontalScrollTravel) * maxTranslate;
      }

      anim.targetX = initialX;
      anim.currentX = initialX;
      trackRef.current.style.transform = `translate3d(-${initialX.toFixed(2)}px, 0, 0)`;
    };

    syncImmediate();

    // Recompute after images load / layout finishes settling
    const timer1 = setTimeout(syncImmediate, 200);
    const timer2 = setTimeout(syncImmediate, 800);

    window.addEventListener('scroll', handleScroll, { passive: true });
    const onResize = () => {
      updateMetrics();
      handleScroll();
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Automatically recalculate metrics as images finish loading
    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && trackRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateMetrics();
      });
      resizeObserver.observe(trackRef.current);
    }

    // Support horizontal trackpad swipe seamlessly
    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        window.scrollBy({ top: e.deltaX * 0.7, behavior: 'auto' });
      }
    };
    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.addEventListener('wheel', handleWheel, { passive: true });
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (containerEl) {
        containerEl.removeEventListener('wheel', handleWheel);
      }
      if (animStateRef.current.rafId) {
        cancelAnimationFrame(animStateRef.current.rafId);
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

        {/* Horizontal Sliding Track */}
        <div className="h-projects-sliding-stage">
          <div className="h-projects-track" ref={trackRef}>
            {/* 1. Intro Hero Column (slides left along with the cards) */}
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

            {/* 2. The 9 Featured Project Cards */}
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
