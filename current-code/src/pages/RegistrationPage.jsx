import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { fetchActiveEvents, submitRegistration, subscribeToEvents } from '../lib/supabase';
import { activeRegistrationConfig } from '../data/activeRegistration';
import { eventsCatalog } from '../data/eventsData';
import CommunityJoinCard from '../components/CommunityJoinCard';
import {
  QrCode,
  Copy,
  Check,
  Download,
  Calendar,
  MapPin,
  Users,
  Cpu,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  Printer,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export default function RegistrationPage({ setCurrentPage, isEmbedded = false }) {
  const { permanentRoute, permanentUrlDisplay, upcomingQueue } = activeRegistrationConfig;

  // Active events initialized synchronously from eventsCatalog with live Supabase synchronization
  const [activeEvents, setActiveEvents] = useState(() => {
    const active = (eventsCatalog || []).filter((e) => e.isActiveForRegistration || e.status === 'upcoming');
    return active.length > 0 ? active : (eventsCatalog && eventsCatalog.length > 0 ? [eventsCatalog[0]] : []);
  });
  const [selectedEventSlug, setSelectedEventSlug] = useState('techtonic-3');
  const [copied, setCopied] = useState(false);
  const [permanentQrUrl, setPermanentQrUrl] = useState('');
  const [passQrUrl, setPassQrUrl] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: 'Jaypee Institute of Information Technology, Sector 128',
    branchAndYear: 'CSE - 2nd Year',
    rollNumber: '',
    participationType: 'Individual',
    teamName: '',
    teamSize: '1',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [issuedPass, setIssuedPass] = useState(null);

  // Load active events from Supabase in real-time
  useEffect(() => {
    async function loadEvents() {
      const data = await fetchActiveEvents();
      if (data && data.length > 0) {
        setActiveEvents(data);

        // Check if URL has ?event= query param
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const eventParam = urlParams.get('event');
          if (eventParam && data.some((e) => e.slug === eventParam)) {
            setSelectedEventSlug(eventParam);
          } else {
            setSelectedEventSlug(data[0].slug);
          }
        } catch {
          setSelectedEventSlug(data[0].slug);
        }
      } else {
        setActiveEvents([]);
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

  // Selected event object (strictly from Supabase, no mock fallback)
  const activeEvent =
    activeEvents.find((e) => e.slug === selectedEventSlug) ||
    activeEvents[0] ||
    null;

  // 1. Generate High-Res Permanent Universal QR Code for Posters/Print
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cicr.in';
    const targetUrl = `${origin}${permanentRoute}`;
    const fallbackQr = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(targetUrl)}`;

    try {
      QRCode.toDataURL(
        targetUrl,
        {
          width: 600,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        },
        (err, url) => {
          if (!err && url) {
            setPermanentQrUrl(url);
          } else {
            setPermanentQrUrl(fallbackQr);
          }
        }
      );
    } catch {
      setPermanentQrUrl(fallbackQr);
    }
  }, [permanentRoute]);

  // 2. Generate Personal Entry Pass QR Code when Pass is Issued
  useEffect(() => {
    if (issuedPass) {
      const passPayload = JSON.stringify({
        id: issuedPass.registrationId,
        token: issuedPass.qrToken,
        name: issuedPass.record?.full_name || 'Attendee',
        event: issuedPass.record?.event_title || 'CICR Event',
        issuedAt: new Date().toISOString()
      });
      const fallbackPassQr = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(passPayload)}`;

      try {
        QRCode.toDataURL(
          passPayload,
          {
            width: 400,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
          },
          (err, url) => {
            if (!err && url) {
              setPassQrUrl(url);
            } else {
              setPassQrUrl(fallbackPassQr);
            }
          }
        );
      } catch {
        setPassQrUrl(fallbackPassQr);
      }
    }
  }, [issuedPass]);

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cicr.in';
    const targetUrl = `${origin}${permanentRoute}`;
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPermanentQr = () => {
    if (!permanentQrUrl) return;
    const a = document.createElement('a');
    a.href = permanentQrUrl;
    a.download = `CICR-Permanent-Registration-QR.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadPassQr = () => {
    if (!passQrUrl || !issuedPass) return;
    const a = document.createElement('a');
    a.href = passQrUrl;
    a.download = `${issuedPass.registrationId}-EntryPass.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!formData.fullName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setSubmitError('Please enter a valid WhatsApp / Phone contact number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        eventSlug: activeEvent ? (activeEvent.slug || selectedEventSlug) : selectedEventSlug,
        eventTitle: activeEvent ? activeEvent.title : 'CICR Event'
      };

      const result = await submitRegistration(payload);
      setIsSubmitting(false);

      if (result.success) {
        setIssuedPass(result);
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        setSubmitError(result.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'An unexpected error occurred during submission.');
    }
  };

  const handleResetRegistration = () => {
    setIssuedPass(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      college: 'Jaypee Institute of Information Technology, Sector 128',
      branchAndYear: 'CSE - 2nd Year',
      rollNumber: '',
      participationType: 'Individual',
      teamName: '',
      teamSize: '1',
      notes: ''
    });
  };

  const content = (
    <div className={isEmbedded ? "embedded-registration-wrapper" : "registration-content-wrapper"}>
      {/* Header Section */}
      {!isEmbedded && (
        <section className="registration-header-section">
          <div className="endpoint-pill-badge">
            <QrCode size={14} className="text-cyan" />
            <span>PERMANENT UNIVERSAL REGISTRATION ENDPOINT</span>
          </div>

          <h1 className="registration-main-title">
            One Endpoint. One QR. <span className="text-cyan">Direct Website Enrollment.</span>
          </h1>

          <p className="registration-main-desc">
            Organizers print this single permanent QR code on posters, notices, and banners once. 
            All registrations are handled directly on this official website and stored into our secure database.
          </p>
        </section>
      )}

        {/* Main Two-Column Hub */}
        <div className="registration-hub-grid">
          {/* =============================================================
              Column 1: Permanent Universal QR Code Card (For Print & Posters)
              ============================================================= */}
          <aside className="permanent-qr-card">
            <div className="qr-badge-header">
              <span className="qr-pulse-beacon"></span>
              <span>PERMANENT PRINT QR</span>
            </div>

            <div className="qr-code-frame">
              {permanentQrUrl ? (
                <img
                  src={permanentQrUrl}
                  alt="CICR Permanent Universal Registration QR Code"
                  className="qr-image"
                />
              ) : (
                <div className="qr-loading-box">Generating QR Matrix...</div>
              )}
            </div>

            <div className="qr-url-box">
              <span className="qr-url-label">Permanent Destination:</span>
              <code className="qr-url-text">{permanentUrlDisplay}</code>
            </div>

            <div className="qr-actions-row">
              <button
                className="qr-action-btn copy-btn"
                onClick={handleCopyLink}
                title="Copy permanent registration URL"
              >
                {copied ? <Check size={15} className="text-green" /> : <Copy size={15} />}
                <span>{copied ? 'Copied URL!' : 'Copy Link'}</span>
              </button>

              <button
                className="qr-action-btn download-btn"
                onClick={handleDownloadPermanentQr}
                title="Download high-resolution 600px PNG for print posters"
              >
                <Download size={15} />
                <span>Download Print QR</span>
              </button>
            </div>

            <div className="qr-organizer-note">
              <Info size={16} className="text-cyan" />
              <p>
                <strong>Print-Once Guarantee:</strong> Print this QR code on physical brochures and noticeboards. 
                Whichever event is active in our Supabase database is dynamically served to attendees on scan.
              </p>
            </div>
          </aside>

          {/* =============================================================
              Column 2: Dynamic Event Card + Native Registration Form
              ============================================================= */}
          <main className="active-event-card">
            {!activeEvent ? (
              <div className="no-active-events-card" style={{ textAlign: 'center', padding: '70px 24px' }}>
                <Calendar size={44} style={{ color: '#ff601c', marginBottom: 18 }} />
                <h3 style={{ color: '#ffffff', fontSize: '1.45rem', fontWeight: 700, marginBottom: 12 }}>
                  Registrations Announcing Soon
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.98rem', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.65 }}>
                  New workshops, robotic tournaments, and bootcamps are being scheduled.
                  Join our official WhatsApp community to get instant notifications when entries open.
                </p>
                <a
                  href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="qr-action-btn download-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 9999, margin: '0 auto', textDecoration: 'none' }}
                >
                  <Sparkles size={16} />
                  <span>Join Official WhatsApp Community</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <>
                {/* Event Switcher Pills if multiple events are open */}
                {activeEvents.length > 1 && (
                  <div className="native-event-selector-wrap">
                    <span className="event-selector-label">
                      <Sparkles size={14} className="text-orange" />
                      Select Open Event:
                    </span>
                    <div className="event-picker-pills">
                      {activeEvents.map((evt) => (
                        <button
                          key={evt.slug || evt.id}
                          type="button"
                          className={`event-picker-pill ${selectedEventSlug === evt.slug ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedEventSlug(evt.slug);
                            setIssuedPass(null);
                          }}
                        >
                          <span className="event-picker-pill-dot" />
                          <span>{evt.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

            {/* Active Status Bar */}
            <div className="active-status-bar">
              <div className="status-indicator-live">
                <span className="beacon-dot"></span>
                <span>REGISTRATIONS OPEN • OFFICIAL WEBPAGE</span>
              </div>
              <span className="edition-badge">{activeEvent?.year || '2025-2026'}</span>
            </div>

            <h2 className="active-event-title">{activeEvent?.title || 'CICR Event'}</h2>
            {activeEvent?.tagline && (
              <p className="active-event-tagline">{activeEvent.tagline}</p>
            )}

            {/* Event Specs Grid */}
            <div className="active-specs-grid">
              <div className="active-spec-item">
                <Calendar size={18} className="text-cyan" />
                <div>
                  <span className="spec-label">Timeline / Schedule</span>
                  <span className="spec-value">{activeEvent?.dates || 'Upcoming'}</span>
                </div>
              </div>

              <div className="active-spec-item">
                <MapPin size={18} className="text-cyan" />
                <div>
                  <span className="spec-label">Event Venue</span>
                  <span className="spec-value">{activeEvent?.venue || 'CICR Robotics Lab, JIIT-128'}</span>
                </div>
              </div>

              <div className="active-spec-item">
                <Users size={18} className="text-cyan" />
                <div>
                  <span className="spec-label">Target Eligibility</span>
                  <span className="spec-value">{activeEvent?.eligibility || 'Open to all students'}</span>
                </div>
              </div>

              <div className="active-spec-item">
                <Cpu size={18} className="text-cyan" />
                <div>
                  <span className="spec-label">Hardware Provision</span>
                  <span className="spec-value">{activeEvent?.hardwarePerk || 'Lab hardware provided'}</span>
                </div>
              </div>
            </div>

            {/* If Pass Issued: Display Digital Confirmation Ticket Badge */}
            {issuedPass ? (
              <div className="digital-pass-container">
                <div className="digital-pass-card">
                  {/* Top Strip */}
                  <div className="pass-card-strip-top">
                    <span className="pass-institution">
                      CENTRE FOR INNOVATION, ROBOTICS &amp; CYBER-PHYSICAL SYSTEMS (CICR)
                    </span>
                    <div className="pass-status-badge">
                      <ShieldCheck size={14} />
                      <span>VERIFIED ENTRY PASS</span>
                    </div>
                  </div>

                  {/* Pass Body */}
                  <div className="pass-body-layout">
                    <div className="pass-info-side">
                      <div className="pass-ticket-id">
                        PASS ID: <code>{issuedPass.registrationId}</code>
                      </div>
                      <h3 className="pass-attendee-name">{issuedPass.record.full_name}</h3>
                      <p className="pass-attendee-college">{issuedPass.record.college}</p>

                      <div className="pass-meta-grid">
                        <div className="pass-meta-cell">
                          <span className="pass-meta-label">Event</span>
                          <span className="pass-meta-value">{issuedPass.record.event_title}</span>
                        </div>
                        <div className="pass-meta-cell">
                          <span className="pass-meta-label">Venue</span>
                          <span className="pass-meta-value">{activeEvent?.venue || 'CICR Robotics Lab, JIIT-128'}</span>
                        </div>
                        <div className="pass-meta-cell">
                          <span className="pass-meta-label">Branch &amp; Year</span>
                          <span className="pass-meta-value">{issuedPass.record.branch_and_year}</span>
                        </div>
                        <div className="pass-meta-cell">
                          <span className="pass-meta-label">Participation</span>
                          <span className="pass-meta-value">
                            {issuedPass.record.participation_type}{' '}
                            {issuedPass.record.team_name ? `(${issuedPass.record.team_name})` : ''}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* QR Code Pass for Lab Check-in Desk */}
                    <div className="pass-qr-side">
                      <div className="pass-qr-canvas-wrap">
                        {passQrUrl ? (
                          <img src={passQrUrl} alt="Check-in QR Code" />
                        ) : (
                          <span>Generating Pass...</span>
                        )}
                      </div>
                      <span className="pass-qr-caption">Scan at Event Check-in</span>
                    </div>
                  </div>

                  {/* Pass Action Buttons */}
                  <div className="pass-actions-strip">
                    <button
                      type="button"
                      className="pass-btn pass-btn-primary"
                      onClick={handleDownloadPassQr}
                    >
                      <Download size={15} />
                      <span>Download Entry Pass</span>
                    </button>

                    <button
                      type="button"
                      className="pass-btn pass-btn-outline"
                      onClick={() => window.print()}
                    >
                      <Printer size={15} />
                      <span>Print Ticket</span>
                    </button>

                    {activeEvent?.whatsappCommunityUrl && (
                      <a
                        href={activeEvent.whatsappCommunityUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pass-btn pass-btn-whatsapp"
                      >
                        <span>Join Event WhatsApp Group</span>
                        <ExternalLink size={13} />
                      </a>
                    )}

                    <button
                      type="button"
                      className="pass-btn pass-btn-outline"
                      onClick={handleResetRegistration}
                    >
                      <RotateCcw size={14} />
                      <span>Register Another Attendee</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Native Registration Form Handled Directly Through Our Website */
              <form className="native-registration-form" onSubmit={handleFormSubmit}>
                <div className="form-header-bar">
                  <div className="form-header-title">
                    <Sparkles size={17} className="text-orange" />
                    <span>Direct Website Registration Form</span>
                  </div>
                  <div className="form-secure-badge">
                    <ShieldCheck size={13} />
                    <span>Supabase Secured</span>
                  </div>
                </div>

                {submitError && (
                  <div className="form-error-banner" style={{ color: '#ef4444', marginBottom: 14, fontSize: '0.85rem' }}>
                    {submitError}
                  </div>
                )}

                <div className="form-fields-grid">
                  {/* Full Name */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Full Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>

                  {/* Email */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. student@jiit.ac.in"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="form-field-group">
                    <label className="form-label">
                      WhatsApp / Contact Number <span className="required-star">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>

                  {/* Roll Number */}
                  <div className="form-field-group">
                    <label className="form-label">Enrollment / Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      placeholder="e.g. 23103045"
                      value={formData.rollNumber}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>

                  {/* College / Institute */}
                  <div className="form-field-group full-width">
                    <label className="form-label">
                      College / University Name <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      required
                      placeholder="e.g. Jaypee Institute of Information Technology, Sector 128"
                      value={formData.college}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>

                  {/* Branch & Year */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Branch &amp; Academic Year <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      name="branchAndYear"
                      required
                      placeholder="e.g. ECE - 2nd Year"
                      value={formData.branchAndYear}
                      onChange={handleFormChange}
                      className="form-input"
                    />
                  </div>

                  {/* Participation Type */}
                  <div className="form-field-group">
                    <label className="form-label">Participation Type</label>
                    <div className="participation-radio-group">
                      <label className={`radio-pill-label ${formData.participationType === 'Individual' ? 'checked' : ''}`}>
                        <input
                          type="radio"
                          name="participationType"
                          value="Individual"
                          checked={formData.participationType === 'Individual'}
                          onChange={handleFormChange}
                        />
                        <span>Individual</span>
                      </label>
                      <label className={`radio-pill-label ${formData.participationType === 'Team' ? 'checked' : ''}`}>
                        <input
                          type="radio"
                          name="participationType"
                          value="Team"
                          checked={formData.participationType === 'Team'}
                          onChange={handleFormChange}
                        />
                        <span>Team</span>
                      </label>
                    </div>
                  </div>

                  {/* Team details if Team is selected */}
                  {formData.participationType === 'Team' && (
                    <>
                      <div className="form-field-group">
                        <label className="form-label">Team Name</label>
                        <input
                          type="text"
                          name="teamName"
                          placeholder="e.g. RoboStrikers"
                          value={formData.teamName}
                          onChange={handleFormChange}
                          className="form-input"
                        />
                      </div>
                      <div className="form-field-group">
                        <label className="form-label">Team Size</label>
                        <select
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleFormChange}
                          className="form-select"
                        >
                          <option value="2">2 Members</option>
                          <option value="3">3 Members</option>
                          <option value="4">4 Members</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* Special Interests / Notes */}
                  <div className="form-field-group full-width">
                    <label className="form-label">Prior Experience or Special Hardware Interests (Optional)</label>
                    <textarea
                      name="notes"
                      placeholder="e.g. Interested in ROS2 SLAM, experience with Arduino / ESP32, or beginner eager to learn..."
                      value={formData.notes}
                      onChange={handleFormChange}
                      className="form-textarea"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit-registration"
                >
                  {isSubmitting ? (
                    <span>Registering with Database...</span>
                  ) : (
                    <>
                      <span>Complete Registration &amp; Issue Entry Pass</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Highlights */}
            {activeEvent && activeEvent.highlights && activeEvent.highlights.length > 0 && (
              <div className="active-highlights-section">
                <h4 className="highlights-heading">Bootcamp Highlights &amp; Inclusions:</h4>
                <ul className="highlights-list">
                  {activeEvent.highlights.map((item, idx) => (
                    <li key={idx} className="highlight-item">
                      <CheckCircle2 size={16} className="text-cyan" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Participant Instructions */}
            {activeEvent && activeEvent.instructions && activeEvent.instructions.length > 0 && (
              <div className="active-instructions-box">
                <h5 className="instructions-title">Important Guidelines for Attendees:</h5>
                <ul className="instructions-list">
                  {activeEvent.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}
              </>
            )}
          </main>
        </div>

        {/* Upcoming Registration Queue */}
        {upcomingQueue && upcomingQueue.length > 0 && (
          <section className="upcoming-queue-section">
            <div className="section-title-wrap">
              <span className="section-eyebrow">Pipeline</span>
              <h3 className="queue-section-title">
                Upcoming <span className="text-cyan">Registration Queue</span>
              </h3>
              <p className="queue-section-desc">
                When current registrations conclude, the permanent QR endpoint transitions to feature these upcoming initiatives next.
              </p>
            </div>

            <div className="queue-grid">
              {upcomingQueue.map((item, idx) => (
                <div key={idx} className="queue-card">
                  <div className="queue-card-top">
                    <span className="queue-num">0{idx + 1}</span>
                    <span className="queue-date">{item.expectedDate}</span>
                  </div>
                  <h4 className="queue-card-title">{item.title}</h4>
                  <p className="queue-card-desc">{item.description}</p>
                  <div className="queue-status-tag">Next in Queue</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Community Join Card */}
        {!isEmbedded && <CommunityJoinCard />}
      </div>
    );

    if (isEmbedded) {
      return content;
    }

    return (
      <div className="registration-page-container">
        <div className="bg-grid-pattern"></div>
        {content}
      </div>
    );
  }
