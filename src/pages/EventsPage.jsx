import React, { useState, useEffect } from 'react';
import { fetchEvents, subscribeToEvents } from '../lib/supabase';
import { eventsCatalog, eventCategories } from '../data/eventsData';
import {
  Calendar,
  Sparkles,
  ExternalLink,
  Users,
  Cpu,
  ArrowRight,
  Images,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Explicit chronological order requested: new/recent events on top
// 1. TechTonic 2.0 -> 2. CICR की कक्षा -> 3. Dron-O-War -> 4. Converge -> 5. TechTonic 1.0
const EVENT_CHRONO_ORDER = {
  'techtonic-2': 1,
  'cicr-ki-kaksha': 2,
  'dron-o-war': 3,
  'converge': 4,
  'techtonic-1': 5
};

const sortEventsChronologically = (items) => {
  return [...items].sort((a, b) => {
    const aKey = a.slug || a.id || '';
    const bKey = b.slug || b.id || '';
    const orderA = EVENT_CHRONO_ORDER[aKey] ?? 99;
    const orderB = EVENT_CHRONO_ORDER[bKey] ?? 99;
    return orderA - orderB;
  });
};

export default function EventsPage({ setCurrentPage }) {
  const [events, setEvents] = useState(() => sortEventsChronologically(eventsCatalog || []));
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeGalleryEvent, setActiveGalleryEvent] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        if (data && Array.isArray(data) && data.length > 0) {
          const catalogMap = new Map(eventsCatalog.map((e) => [e.slug || e.id, e]));
          const mergedFromDb = data.map((dbEvt) => {
            const local = catalogMap.get(dbEvt.slug) || catalogMap.get(dbEvt.id);
            return {
              ...dbEvt,
              title: dbEvt.title || local?.title,
              category: dbEvt.category || local?.category,
              tagline: dbEvt.tagline || dbEvt.desc || local?.tagline,
              image: (local?.gallery && local.gallery.length > 0) ? (local.image || dbEvt.image) : (dbEvt.image || local?.image),
              gallery: (local?.gallery && local.gallery.length > 0) ? local.gallery : (dbEvt.gallery || []),
              isActiveForRegistration: dbEvt.isActiveForRegistration ?? local?.isActiveForRegistration ?? true
            };
          });

          // Combine with catalog to never lose curated events, and sort by chronological order
          const existingSlugs = new Set(mergedFromDb.map((e) => e.slug || e.id));
          const missingCatalog = eventsCatalog.filter((c) => !existingSlugs.has(c.slug) && !existingSlugs.has(c.id));
          const combined = [...mergedFromDb, ...missingCatalog];

          setEvents(sortEventsChronologically(combined));
        } else {
          setEvents(sortEventsChronologically(eventsCatalog));
        }
      } catch (err) {
        console.warn('Error loading events:', err);
        setEvents(sortEventsChronologically(eventsCatalog));
      } finally {
        setLoading(false);
      }
    }
    loadEvents();

    const unsubscribe = subscribeToEvents(() => {
      loadEvents();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Keyboard navigation & body scroll lock for the Gallery lightbox
  useEffect(() => {
    if (!activeGalleryEvent) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveGalleryEvent(null);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev === 0 ? activeGalleryEvent.gallery.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev === activeGalleryEvent.gallery.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeGalleryEvent]);

  // Touch swipe handlers
  const minSwipeDistance = 45;
  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !activeGalleryEvent) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      // Swipe Left -> Next Photo
      setActivePhotoIndex((prev) =>
        prev === activeGalleryEvent.gallery.length - 1 ? 0 : prev + 1
      );
    } else if (distance < -minSwipeDistance) {
      // Swipe Right -> Prev Photo
      setActivePhotoIndex((prev) =>
        prev === 0 ? activeGalleryEvent.gallery.length - 1 : prev - 1
      );
    }
  };

  const sortedEvents = sortEventsChronologically(events);

  const filteredEvents =
    selectedCategory === 'all'
      ? sortedEvents
      : sortedEvents.filter((e) => {
          const cat = e.category?.toLowerCase() || '';
          const slug = e.slug?.toLowerCase() || '';
          const title = e.title?.toLowerCase() || '';

          if (selectedCategory === 'techtonic') {
            return cat === 'techtonic' || slug.includes('techtonic') || title.includes('techtonic');
          }
          if (selectedCategory === 'cicr-ki-kaksha') {
            return cat === 'cicr-ki-kaksha' || slug.includes('kaksha') || title.includes('कक्षा') || title.includes('kaksha');
          }
          if (selectedCategory === 'dron-o-war') {
            return cat === 'dron-o-war' || slug.includes('dron') || title.includes('dron');
          }
          if (selectedCategory === 'converge') {
            return cat === 'converge' || slug.includes('converge') || title.includes('converge');
          }
          return cat === selectedCategory;
        });

  return (
    <div className="gdg-events-page">
      {/* Background Grid Pattern */}
      <div className="bg-grid-pattern"></div>

      <div className="events-page-content-wrapper">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: 0
            }}
          >
            Events & Workshops
          </h1>
        </div>

        {/* Category Tabs if events exist */}
        {events.length > 0 && (
          <div className="events-category-nav-bar">
            {eventCategories.map((cat) => (
              <button
                key={cat.id}
                className={`events-category-tab-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Section */}
        {events.length === 0 ? (
          /* =========================================================
             Empty State
             ========================================================= */
          <div
            style={{
              maxWidth: '680px',
              margin: '20px auto 60px',
              padding: '48px 24px',
              borderRadius: '24px',
              background: 'rgba(14, 16, 24, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              textAlign: 'center',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 96, 28, 0.2), rgba(245, 158, 11, 0.1))',
                border: '1px solid rgba(255, 96, 28, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px',
                color: '#ff601c'
              }}
            >
              <Calendar size={30} />
            </div>

            <h3
              style={{
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '10px'
              }}
            >
              Events Announcing Soon
            </h3>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                maxWidth: '520px',
                margin: '0 auto 24px'
              }}
            >
              We are currently designing and scheduling upcoming autonomous robotics challenges, hardware bootcamps, and technical workshops. Join our official community for real-time announcements.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <a
                href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #ff601c, #ea580c)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(255, 96, 28, 0.4)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <Sparkles size={16} />
                <span>Join Official WhatsApp Community</span>
                <ExternalLink size={14} />
              </a>

              <a
                href="https://inventory.cicr.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none'
                }}
              >
                <Cpu size={16} color="#38bdf8" />
                <span>Hardware Inventory</span>
                <ExternalLink size={14} />
              </a>

              <button
                onClick={() => setCurrentPage('team')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                <Users size={16} color="#a855f7" />
                <span>Meet the Team</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* =========================================================
             Events Cards Grid: Clean cards without repetitive labels
             ========================================================= */
          <div className="events-cards-grid-section">
            <div className="events-cards-grid">
              {filteredEvents.map((evt) => (
                <article key={evt.id} id={evt.slug || evt.id} className="gdg-event-card">
                  {evt.image && (
                    <div className="gdg-event-img-wrap">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="gdg-event-thumb-img"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="gdg-event-info">
                    {/* Title */}
                    <h3
                      className="gdg-event-title"
                      style={{
                        margin: '0 0 8px',
                        fontSize: 'clamp(1.25rem, 3vw, 1.55rem)',
                        fontWeight: 700,
                        lineHeight: 1.25
                      }}
                    >
                      {evt.title}
                    </h3>

                    {/* Short Tagline */}
                    {evt.tagline && (
                      <p
                        style={{
                          fontSize: 'clamp(0.84rem, 2vw, 0.88rem)',
                          color: '#94a3b8',
                          lineHeight: 1.55,
                          margin: '0 0 16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {evt.tagline}
                      </p>
                    )}

                    {/* Action Buttons: Register Now & Gallery */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: 'auto',
                        flexWrap: 'wrap'
                      }}
                    >
                      {evt.isActiveForRegistration && (
                        <button
                          type="button"
                          onClick={() => setCurrentPage('registrations')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #ff601c, #ea580c)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '10px 20px',
                            minHeight: '42px',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(255, 96, 28, 0.35)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            touchAction: 'manipulation'
                          }}
                        >
                          <span>Register Now</span>
                          <ArrowRight size={14} />
                        </button>
                      )}

                      {evt.gallery && evt.gallery.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveGalleryEvent(evt);
                            setActivePhotoIndex(0);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '7px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.16)',
                            color: '#e2e8f0',
                            borderRadius: '9999px',
                            padding: '10px 18px',
                            minHeight: '42px',
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                            transition: 'all 0.2s ease',
                            touchAction: 'manipulation'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                            e.currentTarget.style.color = '#38bdf8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                            e.currentTarget.style.color = '#e2e8f0';
                          }}
                        >
                          <Images size={15} color="#38bdf8" />
                          <span>Gallery</span>
                          <span
                            style={{
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '9999px',
                              marginLeft: '2px'
                            }}
                          >
                            {evt.gallery.length}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          Interactive & Responsive Event Gallery Modal / Lightbox
          ========================================================= */}
      {activeGalleryEvent && activeGalleryEvent.gallery && activeGalleryEvent.gallery.length > 0 && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveGalleryEvent(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 7, 12, 0.95)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px clamp(8px, 3vw, 20px) 16px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* Header Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '1100px',
              margin: '0 auto 8px',
              padding: '8px 14px',
              background: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <span
                style={{
                  background: 'rgba(255, 96, 28, 0.15)',
                  color: '#ff601c',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap'
                }}
              >
                GALLERY
              </span>
              <h3
                style={{
                  color: '#ffffff',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                  fontWeight: 700,
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {activeGalleryEvent.title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <span
                style={{
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {activePhotoIndex + 1} / {activeGalleryEvent.gallery.length}
              </span>
              <button
                type="button"
                onClick={() => setActiveGalleryEvent(null)}
                aria-label="Close Gallery"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  minHeight: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease, transform 0.2s ease',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Main Stage Image with Navigation Arrows & Swipe */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '1100px',
              width: '100%',
              margin: '0 auto',
              maxHeight: 'calc(100dvh - 190px)',
              overflow: 'hidden'
            }}
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) =>
                  prev === 0 ? activeGalleryEvent.gallery.length - 1 : prev - 1
                )
              }
              aria-label="Previous photo"
              style={{
                position: 'absolute',
                left: '8px',
                zIndex: 10,
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.2s ease',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff601c';
                e.currentTarget.style.borderColor = '#ff601c';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={22} />
            </button>

            {/* Main Display Image */}
            <img
              src={activeGalleryEvent.gallery[activePhotoIndex]}
              alt={`${activeGalleryEvent.title} photo ${activePhotoIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '14px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                userSelect: 'none',
                WebkitUserSelect: 'none'
              }}
            />

            {/* Next Button */}
            <button
              type="button"
              onClick={() =>
                setActivePhotoIndex((prev) =>
                  prev === activeGalleryEvent.gallery.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Next photo"
              style={{
                position: 'absolute',
                right: '8px',
                zIndex: 10,
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.2s ease',
                touchAction: 'manipulation'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ff601c';
                e.currentTarget.style.borderColor = '#ff601c';
                e.currentTarget.style.transform = 'scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Thumbnail Strip (Touch & Horizontal Scrollable) */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              gap: '8px',
              justifyContent: activeGalleryEvent.gallery.length > 7 ? 'flex-start' : 'center',
              alignItems: 'center',
              overflowX: 'auto',
              padding: '10px 4px 4px',
              maxWidth: '1100px',
              width: '100%',
              margin: '8px auto 0',
              scrollbarWidth: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {activeGalleryEvent.gallery.map((photoUrl, idx) => (
              <button
                key={photoUrl + idx}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                style={{
                  position: 'relative',
                  flexShrink: 0,
                  width: 'clamp(50px, 12vw, 68px)',
                  height: 'clamp(38px, 9vw, 48px)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  padding: 0,
                  cursor: 'pointer',
                  border: activePhotoIndex === idx ? '2px solid #ff601c' : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: activePhotoIndex === idx ? '0 0 12px rgba(255, 96, 28, 0.6)' : 'none',
                  opacity: activePhotoIndex === idx ? 1 : 0.55,
                  transition: 'all 0.2s ease',
                  background: 'none',
                  touchAction: 'manipulation'
                }}
              >
                <img
                  src={photoUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
