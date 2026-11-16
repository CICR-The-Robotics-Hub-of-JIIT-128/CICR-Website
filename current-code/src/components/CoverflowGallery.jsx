import React, { useState, useEffect, useRef } from 'react';

// Exactly 7 items for the 3D gallery with the user's authentic CICR photos
const GALLERY_ITEMS = [
  {
    id: 1,
    image: '/gallery/cicr-moment-1.jpg',
    fallbackBg: 'linear-gradient(145deg, #051a16 0%, #0a2f27 100%)'
  },
  {
    id: 2,
    image: '/gallery/cicr-moment-2.jpg',
    fallbackBg: 'linear-gradient(145deg, #160724 0%, #2a0f42 100%)'
  },
  {
    id: 3,
    // 3rd Picture: DRON-O-WAR 1.0 Registration Desk at JIIT-128
    image: '/gallery/cicr-moment-3.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c140d 0%, #2f2015 100%)'
  },
  {
    id: 4,
    // 4th Picture: The uploaded screenshot of CICR team members
    image: '/gallery/cicr-moment-4.jpg',
    fallbackBg: 'linear-gradient(145deg, #1f1124 0%, #341a3c 100%)'
  },
  {
    id: 5,
    image: '/gallery/cicr-moment-5.jpg',
    fallbackBg: 'linear-gradient(145deg, #071528 0%, #0e274a 100%)'
  },
  {
    id: 6,
    image: '/gallery/cicr-moment-6.jpg',
    fallbackBg: 'linear-gradient(145deg, #061c14 0%, #0d3426 100%)'
  },
  {
    id: 7,
    image: '/gallery/cicr-moment-7.jpg',
    fallbackBg: 'linear-gradient(145deg, #220610 0%, #3a0d1e 100%)'
  }
];

export default function CoverflowGallery() {
  // Start with activeIndex = 3 (the 4th image) as the active center photo
  const [activeIndex, setActiveIndex] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const stageRef = useRef(null);
  const dragStartX = useRef(0);
  const hasDragged = useRef(false);
  const lastScrollTime = useRef(0);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const total = GALLERY_ITEMS.length;

  const handlePrev = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  // Mouse / Pointer Drag Handlers (Smooth drag from right to left / left to right)
  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    hasDragged.current = false;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const diff = dragStartX.current - e.clientX;
    // When dragging from right to left (diff > 35), advance to next
    // When dragging from left to right (diff < -35), advance to prev
    if (Math.abs(diff) > 35) {
      hasDragged.current = true;
      if (diff > 35) {
        handleNext();
      } else {
        handlePrev();
      }
      dragStartX.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setTimeout(() => {
      hasDragged.current = false;
    }, 60);
  };

  // Touch Handlers for Mobile Devices (prevents closing website on swipe)
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      setIsDragging(true);
      hasDragged.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!e.touches || !e.touches[0]) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = touchStartY.current - currentY;

    // If swipe is mostly horizontal, advance carousel and prevent browser back navigation
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 28) {
        hasDragged.current = true;
        if (diffX > 28) {
          handleNext();
        } else {
          handlePrev();
        }
        touchStartX.current = currentX;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => {
      hasDragged.current = false;
    }, 60);
  };

  // Wheel / Trackpad scroll listener
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e) => {
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : (e.shiftKey ? e.deltaY : 0);

      if (Math.abs(delta) > 15) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollTime.current > 220) {
          if (delta > 0) {
            handleNext();
          } else {
            handlePrev();
          }
          lastScrollTime.current = now;
        }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [total]);

  // 3D Coverflow positioning math (Non-overlapping, completely solid, no see-through)
  const getCardStyle = (index) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    const isCenter = diff === 0;

    const maxVisible = isMobile ? 1 : 3;
    if (absDiff > maxVisible) {
      return {
        transform: `translateX(${diff * 240}px) translateZ(-160px) scale(0.6)`,
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none',
        visibility: 'hidden'
      };
    }

    let translateX = 0;
    let translateZ = 0;
    let rotateY = 0;
    let scale = 1;

    if (isCenter) {
      translateX = 0;
      translateZ = isMobile ? 40 : 80;
      rotateY = 0;
      scale = isMobile ? 1.05 : 1.1;
    } else if (diff === -1) {
      translateX = isMobile ? -175 : -230;
      translateZ = isMobile ? -40 : -45;
      rotateY = isMobile ? 38 : 42;
      scale = isMobile ? 0.85 : 0.88;
    } else if (diff === 1) {
      translateX = isMobile ? 175 : 230;
      translateZ = isMobile ? -40 : -45;
      rotateY = isMobile ? -38 : -42;
      scale = isMobile ? 0.85 : 0.88;
    } else if (diff === -2) {
      translateX = -415;
      translateZ = -90;
      rotateY = 48;
      scale = 0.78;
    } else if (diff === 2) {
      translateX = 415;
      translateZ = -90;
      rotateY = -48;
      scale = 0.78;
    } else if (diff === -3) {
      translateX = -580;
      translateZ = -130;
      rotateY = 52;
      scale = 0.68;
    } else if (diff === 3) {
      translateX = 580;
      translateZ = -130;
      rotateY = -52;
      scale = 0.68;
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      zIndex: 35 - absDiff,
      opacity: 1, // 100% solid
      filter: isCenter ? 'brightness(1.05)' : `brightness(${absDiff === 1 ? 0.75 : absDiff === 2 ? 0.55 : 0.42})`
    };
  };

  return (
    <section
      className="coverflow-gallery-section"
      id="gallery"
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="3D Photo Gallery"
    >
      <div id="wings" style={{ position: 'relative', top: '-80px' }} />
      <div id="fleet" style={{ position: 'relative', top: '-80px' }} />

      <div className="coverflow-wrapper">
        {/* Section Heading: CICR Diaries. with cool serif italic font & gradient underline */}
        <div className="gallery-header-clean">
          <h2 className="gallery-title-wrapper">
            <span className="gallery-accent-serif">
              CICR Diaries<span className="gallery-dot">.</span>
              {/* Hand-drawn SVG curve underline matching Memories white+gradient style */}
              <svg
                viewBox="0 0 280 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="gallery-underline-svg"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 14 C 60 4, 130 4, 190 9 S 250 16, 276 8"
                  stroke="url(#gallery-gradient-white-mix)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gallery-gradient-white-mix" x1="0%" y1="0%" x2="100%" y2="0%">
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

        {/* 3D Coverflow Stage with drag & gesture scroll (Buttons removed per user request) */}
        <div
          ref={stageRef}
          className={`coverflow-stage ${isDragging ? 'is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: 'pan-y', overscrollBehaviorX: 'contain' }}
        >
          {/* 3D Cards Track */}
          <div className="coverflow-track">
            {GALLERY_ITEMS.map((item, idx) => {
              const isCenter = idx === activeIndex;
              const style = getCardStyle(idx);

              return (
                <div
                  key={item.id}
                  className={`coverflow-card ${isCenter ? 'is-active-center' : ''}`}
                  style={style}
                  onClick={() => {
                    if (!hasDragged.current) {
                      setActiveIndex(idx);
                    }
                  }}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="coverflow-card-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.style.background = item.fallbackBg;
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Pagination Dots Row */}
        <div className="coverflow-dots-bar">
          {GALLERY_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`coverflow-dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Jump to photo ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
