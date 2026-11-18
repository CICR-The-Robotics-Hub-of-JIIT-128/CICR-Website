import React, { useState, useEffect } from 'react';
import { fetchEvents, subscribeToEvents } from '../lib/supabase';
import { eventsCatalog, eventCategories } from '../data/eventsData';
import {
  Calendar,
  Sparkles,
  ExternalLink,
  Users,
  Cpu,
  Layers,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Radio
} from 'lucide-react';

export default function EventsPage({ setCurrentPage }) {
  const [events, setEvents] = useState(() => eventsCatalog || []);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        if (data && Array.isArray(data)) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('Error loading events:', err);
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

  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory || (selectedCategory === 'upcoming' && e.status === 'upcoming'));

  return (
    <div className="gdg-events-page">
      {/* Background Grid Pattern */}
      <div className="bg-grid-pattern"></div>

      <div className="events-page-content-wrapper">
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              background: 'rgba(255, 96, 28, 0.1)',
              border: '1px solid rgba(255, 96, 28, 0.35)',
              color: '#ff601c',
              fontSize: '0.84rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}
          >
            <Radio size={14} className="animate-pulse" />
            <span>CICR Robotics Calendar</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 12px'
            }}
          >
            Events & Workshops
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
              maxWidth: '620px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            Hands-on hardware bootcamps, autonomous drone tournaments, and inter-collegiate robotics championships at JIIT-128.
          </p>
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
             Empty State: When no event data is scheduled
             ========================================================= */
          <div
            style={{
              maxWidth: '680px',
              margin: '20px auto 60px',
              padding: '48px 28px',
              borderRadius: '28px',
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
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 96, 28, 0.2), rgba(245, 158, 11, 0.1))',
                border: '1px solid rgba(255, 96, 28, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#ff601c'
              }}
            >
              <Calendar size={32} />
            </div>

            <h3
              style={{
                color: '#ffffff',
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '12px'
              }}
            >
              Events Announcing Soon
            </h3>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.98rem',
                lineHeight: 1.65,
                maxWidth: '520px',
                margin: '0 auto 28px'
              }}
            >
              We are currently designing and scheduling upcoming autonomous robotics challenges, hardware bootcamps, and technical workshops. Join our official community for real-time announcements.
            </p>

            {/* Quick Actions */}
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
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #ff601c, #ea580c)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.92rem',
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
                  padding: '12px 20px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.92rem',
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
                  padding: '12px 20px',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '0.92rem',
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
             Events Cards Grid: Rendered dynamically if events exist
             ========================================================= */
          <div className="events-cards-grid-section">
            <div className="events-cards-grid">
              {filteredEvents.map((evt) => (
                <article key={evt.id} className="gdg-event-card">
                  {evt.image && (
                    <div className="gdg-event-img-wrap">
                      <img src={evt.image} alt={evt.title} className="gdg-event-thumb-img" />
                    </div>
                  )}

                  <div className="gdg-event-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#ff601c',
                          letterSpacing: '0.06em'
                        }}
                      >
                        {evt.category || 'Workshop'}
                      </span>
                      {evt.dates && (
                        <>
                          <span style={{ color: '#475569' }}>•</span>
                          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{evt.dates}</span>
                        </>
                      )}
                    </div>

                    <h3 className="gdg-event-title">{evt.title}</h3>

                    <p className="gdg-event-desc">
                      <span className="event-desc-slash">/</span>
                      {evt.tagline || evt.desc}
                    </p>

                    {evt.venue && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.82rem', marginTop: '6px' }}>
                        <MapPin size={13} color="#f59e0b" />
                        <span>{evt.venue}</span>
                      </div>
                    )}

                    {evt.isActiveForRegistration && (
                      <div style={{ marginTop: '14px' }}>
                        <button
                          onClick={() => setCurrentPage('registrations')}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'linear-gradient(135deg, #ff601c, #ea580c)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            padding: '8px 18px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <span>Register Now</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
