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
  Radio,
  Terminal,
  Zap,
  Award,
  Crosshair,
  FileText,
  X,
  ChevronRight,
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function EventsPage({ setCurrentPage }) {
  const [events, setEvents] = useState(() => eventsCatalog || []);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [techtonicEdition, setTechtonicEdition] = useState('2.0');
  const [selectedDossier, setSelectedDossier] = useState(null);

  // Sync with Supabase if live data exists, else fallback to rich catalog
  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchEvents();
        if (data && Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      } catch (err) {
        console.warn('Events fallback to catalog:', err);
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

  // Filter events
  const filteredEvents =
    selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  // Handle registration navigation with event slug
  const handleRegister = (slug) => {
    try {
      const url = new URL(window.location);
      url.searchParams.set('event', slug);
      window.history.pushState({}, '', url);
    } catch {
      // ignore history err
    }
    if (setCurrentPage) {
      setCurrentPage('registrations');
    }
  };

  return (
    <div className="gdg-events-page cyber-events-page">
      {/* Background Cyber Grid */}
      <div className="bg-grid-pattern"></div>
      <div className="cyber-ambient-glow"></div>

      <div className="events-page-content-wrapper">
        {/* =========================================================
            1. CYBERNETIC HERO & TELEMETRY DASHBOARD
            ========================================================= */}
        <div className="events-hero-container">
          <div className="events-status-radar-badge">
            <span className="radar-dot animate-pulse"></span>
            <span className="radar-label">TACTICAL OPS RADAR // JIIT-128 COMBAT & INNOVATION CADRE</span>
          </div>

          <h1 className="events-hero-headline">
            Robotics <span className="events-gradient-text">Operations & Arenas</span>
          </h1>

          <p className="events-hero-description">
            Four signature battlegrounds and deep-tech bootcamps. From breadboard circuit engineering to supersonic FPV drone dogfights and heavyweight bot clashes.
          </p>

          {/* Telemetry HUD Counters Bar */}
          <div className="events-telemetry-hud">
            <div className="telemetry-hud-item">
              <span className="telemetry-value">04</span>
              <span className="telemetry-label">FLAGSHIP OPS</span>
            </div>
            <div className="telemetry-hud-divider"></div>
            <div className="telemetry-hud-item">
              <span className="telemetry-value highlight-orange">13</span>
              <span className="telemetry-label">TOTAL ARENA DAYS</span>
            </div>
            <div className="telemetry-hud-divider"></div>
            <div className="telemetry-hud-item">
              <span className="telemetry-value highlight-cyan">50+</span>
              <span className="telemetry-label">ROBOTS & FPV DRONES</span>
            </div>
            <div className="telemetry-hud-divider"></div>
            <div className="telemetry-hud-item">
              <span className="telemetry-value highlight-amber">₹1.0L+</span>
              <span className="telemetry-label">CASH BOUNTY & KITS</span>
            </div>
          </div>
        </div>

        {/* =========================================================
            2. CATEGORY FILTER NAVIGATION
            ========================================================= */}
        <div className="events-category-nav-bar cyber-category-pills">
          {eventCategories.map((cat) => {
            const count =
              cat.id === 'all'
                ? events.length
                : events.filter((e) => e.category === cat.id).length;
            return (
              <button
                key={cat.id}
                className={`cyber-category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span>{cat.label}</span>
                <span className="cyber-tab-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================
            3. UNIQUE CYBERNETIC EVENT CARDS GRID
            ========================================================= */}
        <div className="events-cards-grid-section">
          <div className="cyber-events-grid">
            {filteredEvents.map((evt) => {
              const isTechTonic = evt.id === 'techtonic';
              const currentEdition = isTechTonic && evt.editions ? evt.editions[techtonicEdition] : null;
              const displayDuration = isTechTonic
                ? `3 DAYS // ${techtonicEdition === '1.0' ? 'EDITION 1.0' : 'EDITION 2.0'}`
                : `${evt.durationDays} DAYS IMMERSIVE`;

              return (
                <article
                  key={evt.id}
                  className="cyber-event-card"
                  style={{
                    '--card-theme-color': evt.themeColor || '#ff601c',
                    '--card-theme-glow': evt.accentGlow || 'rgba(255, 96, 28, 0.35)'
                  }}
                >
                  {/* Cyber Corner Reticles */}
                  <span className="corner-bracket top-left">⌜</span>
                  <span className="corner-bracket top-right">⌝</span>
                  <span className="corner-bracket bottom-left">⌞</span>
                  <span className="corner-bracket bottom-right">⌟</span>

                  {/* Card Header: Tactical Code & Duration Badge */}
                  <div className="cyber-card-meta-bar">
                    <div className="cyber-code-badge">
                      <Terminal size={12} />
                      <span>{evt.code || `OP-${evt.id.toUpperCase()}`}</span>
                    </div>

                    <div className="cyber-duration-badge">
                      <Clock size={12} />
                      <span>{displayDuration}</span>
                    </div>
                  </div>

                  {/* Media Visual with Scanlines */}
                  <div className="cyber-card-media-wrap">
                    <img
                      src={evt.image || '/gallery/cicr-moment-1.jpg'}
                      alt={evt.title}
                      className="cyber-card-img"
                      loading="lazy"
                    />
                    <div className="cyber-scanline-overlay"></div>
                    <div className="cyber-card-category-floating">
                      <span className="floating-category-pill">{evt.categoryLabel || evt.category}</span>
                    </div>
                  </div>

                  {/* Card Content Area */}
                  <div className="cyber-card-content">
                    {/* Event Title */}
                    <div className="cyber-card-title-row">
                      <h3 className="cyber-event-title">{evt.title}</h3>
                      <div className="cyber-live-pulse-dot" title="Active Campaign"></div>
                    </div>

                    {/* Tagline */}
                    <p className="cyber-event-tagline">
                      <span className="tagline-arrow">›</span> {isTechTonic && currentEdition ? currentEdition.tagline : evt.tagline}
                    </p>

                    {/* Dedicated Edition Switcher for TechTonic */}
                    {isTechTonic && evt.editions && (
                      <div className="techtonic-edition-selector">
                        <div className="edition-selector-label">
                          <Zap size={13} color="#06b6d4" />
                          <span>Select Operational Phase:</span>
                        </div>
                        <div className="edition-pills-row">
                          <button
                            type="button"
                            className={`edition-pill ${techtonicEdition === '1.0' ? 'active' : ''}`}
                            onClick={() => setTechtonicEdition('1.0')}
                          >
                            ⚡ TechTonic 1.0 (3 Days)
                          </button>
                          <button
                            type="button"
                            className={`edition-pill ${techtonicEdition === '2.0' ? 'active' : ''}`}
                            onClick={() => setTechtonicEdition('2.0')}
                          >
                            🚀 TechTonic 2.0 (3 Days)
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p className="cyber-event-body-desc">
                      {evt.description}
                    </p>

                    {/* Tech Highlights / Day-by-Day Micro Track */}
                    <div className="cyber-itinerary-preview-box">
                      <div className="itinerary-preview-header">
                        <Activity size={13} />
                        <span>
                          {isTechTonic
                            ? `${currentEdition.name} Highlights`
                            : `${evt.durationDays}-Day Tactical Itinerary`}
                        </span>
                      </div>
                      <div className="itinerary-preview-steps">
                        {isTechTonic && currentEdition
                          ? currentEdition.itinerary.map((item, idx) => (
                              <div key={idx} className="preview-step-row">
                                <span className="step-day-badge">{item.day}</span>
                                <span className="step-title">{item.title}</span>
                              </div>
                            ))
                          : evt.itinerary &&
                            evt.itinerary.map((item, idx) => (
                              <div key={idx} className="preview-step-row">
                                <span className="step-day-badge">{item.day}</span>
                                <span className="step-title">{item.title}</span>
                              </div>
                            ))}
                      </div>
                    </div>

                    {/* Hardware & Spec Chips */}
                    {evt.hardwareStack && (
                      <div className="cyber-specs-chips-row">
                        {evt.hardwareStack.slice(0, 4).map((spec, i) => (
                          <span key={i} className="cyber-spec-chip">
                            <Cpu size={10} />
                            <span>{spec}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Venue & Team Format */}
                    <div className="cyber-card-meta-footer">
                      <div className="meta-footer-item">
                        <MapPin size={13} />
                        <span>{evt.venue || 'JIIT Sector 128'}</span>
                      </div>
                      <div className="meta-footer-item">
                        <Users size={13} />
                        <span>{evt.teamSize || 'Open Squad'}</span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="cyber-card-actions-row">
                      <button
                        type="button"
                        className="cyber-btn-register"
                        onClick={() => handleRegister(evt.slug || evt.id)}
                      >
                        <Zap size={15} />
                        <span>Register Now</span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        className="cyber-btn-dossier"
                        onClick={() => setSelectedDossier(evt)}
                      >
                        <FileText size={14} />
                        <span>Mission Dossier</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            4. TACTICAL COMMUNITY & INVENTORY FOOTER STRIP
            ========================================================= */}
        <div className="events-bottom-cta-banner">
          <div className="bottom-cta-info">
            <div className="cta-icon-box">
              <Crosshair size={26} color="#ff601c" />
            </div>
            <div>
              <h3 className="cta-heading">Want to Deploy Your Hardware or Pitch a Robot?</h3>
              <p className="cta-subtext">
                Join our official WhatsApp cadre or browse our 200+ sensor and component inventory at JIIT-128.
              </p>
            </div>
          </div>

          <div className="bottom-cta-actions">
            <a
              href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-cta-btn-primary"
            >
              <Sparkles size={16} />
              <span>Join WhatsApp Cadre</span>
              <ExternalLink size={14} />
            </a>

            <a
              href="https://inventory.cicr.in"
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-cta-btn-secondary"
            >
              <Cpu size={16} />
              <span>Hardware Inventory</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. INTERACTIVE MISSION DOSSIER MODAL
          ========================================================= */}
      {selectedDossier && (
        <div
          className="cyber-dossier-modal-backdrop"
          onClick={() => setSelectedDossier(null)}
        >
          <div
            className="cyber-dossier-modal-window"
            onClick={(e) => e.stopPropagation()}
            style={{
              '--modal-theme-color': selectedDossier.themeColor || '#ff601c',
              '--modal-theme-glow': selectedDossier.accentGlow || 'rgba(255, 96, 28, 0.4)'
            }}
          >
            {/* Modal Corner Reticles */}
            <span className="corner-bracket top-left">⌜</span>
            <span className="corner-bracket top-right">⌝</span>
            <span className="corner-bracket bottom-left">⌞</span>
            <span className="corner-bracket bottom-right">⌟</span>

            {/* Modal Header */}
            <div className="dossier-modal-header">
              <div className="dossier-header-meta">
                <div className="dossier-code-pill">
                  <Terminal size={13} />
                  <span>{selectedDossier.code}</span>
                </div>
                <div className="dossier-duration-pill">
                  <Clock size={13} />
                  <span>{selectedDossier.duration}</span>
                </div>
              </div>

              <button
                type="button"
                className="dossier-close-btn"
                onClick={() => setSelectedDossier(null)}
                aria-label="Close Dossier"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Title Banner */}
            <div className="dossier-title-banner">
              <h2 className="dossier-main-title">{selectedDossier.title}</h2>
              <p className="dossier-tagline-text">{selectedDossier.tagline}</p>
            </div>

            {/* Modal Body Scrollable */}
            <div className="dossier-modal-body">
              {/* Quick Specs Grid */}
              <div className="dossier-specs-grid">
                <div className="dossier-spec-card">
                  <span className="spec-label">VENUE ARENA</span>
                  <span className="spec-value">{selectedDossier.venue}</span>
                </div>
                <div className="dossier-spec-card">
                  <span className="spec-label">TEAM STRUCTURE</span>
                  <span className="spec-value">{selectedDossier.teamSize}</span>
                </div>
                <div className="dossier-spec-card">
                  <span className="spec-label">STATUS</span>
                  <span className="spec-value highlight-status">REGISTRATION QUEUE OPEN</span>
                </div>
                <div className="dossier-spec-card">
                  <span className="spec-label">ACADEMIC HUB</span>
                  <span className="spec-value">JIIT Sector 128, Noida</span>
                </div>
              </div>

              {/* Day-by-Day Detailed Itinerary */}
              <div className="dossier-section-block">
                <h4 className="dossier-section-title">
                  <Calendar size={16} />
                  <span>Complete Multi-Day Arena Schedule ({selectedDossier.durationDays} Days)</span>
                </h4>

                <div className="dossier-itinerary-timeline">
                  {selectedDossier.itinerary &&
                    selectedDossier.itinerary.map((item, idx) => (
                      <div key={idx} className="timeline-day-card">
                        <div className="timeline-day-marker">
                          <span className="marker-badge">{item.day}</span>
                        </div>
                        <div className="timeline-day-content">
                          <h5 className="timeline-day-heading">{item.title}</h5>
                          <p className="timeline-day-desc">{item.desc}</p>
                          {item.topics && (
                            <ul className="timeline-topics-list">
                              {item.topics.map((t, ti) => (
                                <li key={ti}>
                                  <ChevronRight size={13} color={selectedDossier.themeColor || '#ff601c'} />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Hardware Stack */}
              {selectedDossier.hardwareStack && (
                <div className="dossier-section-block">
                  <h4 className="dossier-section-title">
                    <Cpu size={16} />
                    <span>Hardware Stack & Technical Repertoire</span>
                  </h4>
                  <div className="dossier-hardware-grid">
                    {selectedDossier.hardwareStack.map((hw, i) => (
                      <div key={i} className="dossier-hw-card">
                        <Zap size={14} color={selectedDossier.themeColor || '#ff601c'} />
                        <span>{hw}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operational Perks & Certifications */}
              {selectedDossier.perks && (
                <div className="dossier-section-block">
                  <h4 className="dossier-section-title">
                    <Award size={16} />
                    <span>Operative Privileges & Certifications</span>
                  </h4>
                  <div className="dossier-perks-list">
                    {selectedDossier.perks.map((perk, i) => (
                      <div key={i} className="dossier-perk-item">
                        <CheckCircle2 size={16} color="#10b981" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="dossier-modal-footer">
              <button
                type="button"
                className="dossier-cancel-btn"
                onClick={() => setSelectedDossier(null)}
              >
                Close Dossier
              </button>

              <button
                type="button"
                className="dossier-engage-btn"
                onClick={() => {
                  const slug = selectedDossier.slug || selectedDossier.id;
                  setSelectedDossier(null);
                  handleRegister(slug);
                }}
              >
                <Zap size={16} />
                <span>Engage & Register for {selectedDossier.title}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
