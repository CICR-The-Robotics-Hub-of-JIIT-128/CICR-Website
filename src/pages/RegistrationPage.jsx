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
  RotateCcw,
  Lock,
  AlertCircle
} from 'lucide-react';

export default function RegistrationPage({ setCurrentPage, isEmbedded = false }) {
  const { permanentRoute, permanentUrlDisplay, upcomingQueue } = activeRegistrationConfig;

  // Active events initialized synchronously from eventsCatalog with live Supabase synchronization
  const [activeEvents, setActiveEvents] = useState(() => {
    return (eventsCatalog || []).filter((e) => e.isActiveForRegistration);
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
        const active = data.filter((e) => e.isActiveForRegistration);
        setActiveEvents(active);

        // Check if URL has ?event= query param
        if (active.length > 0) {
          try {
            const urlParams = new URLSearchParams(window.location.search);
            const eventParam = urlParams.get('event');
            if (eventParam && active.some((e) => e.slug === eventParam)) {
              setSelectedEventSlug(eventParam);
            } else {
              setSelectedEventSlug(active[0].slug);
            }
          } catch {
            setSelectedEventSlug(active[0].slug);
          }
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
          {!activeEvent ? (
            <>
              <div className="endpoint-pill-badge" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 10px #ef4444' }} />
                <span>REGISTRATIONS CURRENTLY CLOSED</span>
              </div>

              <h1 className="registration-main-title">
                Registration Closed <span style={{ color: '#ef4444' }}>for this Event.</span>
              </h1>

              <p className="registration-main-desc">
                Admissions, slot reservations, and hardware challenge entries for this event are officially closed.
                Join our official WhatsApp community below for instant alerts when registrations reopen.
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </section>
      )}

      {!activeEvent ? (
        /* PROMINENT REGISTRATION CLOSED SHOWCASE */
        <div className="registration-closed-container" style={{ maxWidth: '920px', margin: '0 auto', width: '100%' }}>
          {/* Large Hero Alert Card */}
          <div className="registration-closed-hero-card">
            <div className="closed-hero-glow-accent" />

            <div className="closed-status-pill-big">
              <span className="closed-pulse-dot-big" />
              <span>REGISTRATION CLOSED • THIS EVENT</span>
            </div>

            <div className="closed-hero-icon-box">
              <Lock size={34} />
            </div>

            <h2 className="closed-hero-title">
              Registration Closed for this Event
            </h2>

            <p className="closed-hero-desc">
              All participant slots, battlebot entries, and workshop kits for this event have concluded.
              Join our official WhatsApp community to get instant priority alerts as soon as the next flagship season begins.
            </p>

            <div className="closed-hero-actions-row">
              <a
                href="https://chat.whatsapp.com/JxQJozp3DRO5eipFBK9Tqd?s=cl&p=a&iam=2"
                target="_blank"
                rel="noopener noreferrer"
                className="closed-primary-whatsapp-btn"
              >
                <Sparkles size={16} />
                <span>Join Official WhatsApp Community</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                onClick={() => setCurrentPage && setCurrentPage('events')}
                className="closed-secondary-btn"
              >
                <span>Browse Event Galleries</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                onClick={() => setCurrentPage && setCurrentPage('projects')}
                className="closed-secondary-btn"
              >
                <span>Explore Projects</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Two-Column Hub */
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

            {/* Selected Active Event Info Banner */}
            <div className="active-event-header-info">
              <div className="event-meta-badge-row">
                <span className="event-category-badge">{activeEvent.category || 'Robotics'}</span>
                <span className="event-status-badge">
                  <span className="status-dot"></span>
                  Official Entry Open
                </span>
              </div>
              <h2 className="active-event-headline">{activeEvent.title}</h2>
              {activeEvent.tagline && (
                <p className="active-event-tagline-text">{activeEvent.tagline}</p>
              )}
            </div>

            {/* Registration Form / Issued Pass */}
            {issuedPass ? (
              <div className="issued-pass-card">
                <div className="pass-status-badge">
                  <CheckCircle2 size={16} />
                  <span>REGISTRATION CONFIRMED</span>
                </div>
                <h3 className="pass-title">Official Participant Pass</h3>
                <p className="pass-desc">
                  Present this digital pass at the venue desk during reporting.
                </p>
                {passQrUrl && (
                  <div className="pass-qr-frame">
                    <img src={passQrUrl} alt="Participant Pass QR" className="pass-qr-img" />
                  </div>
                )}
                <div className="pass-details-grid">
                  <div className="pass-detail-col">
                    <span className="pass-label">Participant</span>
                    <span className="pass-value">{issuedPass.full_name}</span>
                  </div>
                  <div className="pass-detail-col">
                    <span className="pass-label">Event</span>
                    <span className="pass-value">{issuedPass.event_title}</span>
                  </div>
                  <div className="pass-detail-col">
                    <span className="pass-label">Pass ID</span>
                    <span className="pass-value pass-id-code">{issuedPass.pass_id}</span>
                  </div>
                </div>
                <div className="pass-actions-row">
                  <button
                    type="button"
                    className="qr-action-btn download-btn"
                    onClick={() => window.print()}
                  >
                    <Printer size={15} />
                    <span>Print / Save PDF</span>
                  </button>
                  <button
                    type="button"
                    className="qr-action-btn copy-btn"
                    onClick={handleResetRegistration}
                  >
                    <RotateCcw size={15} />
                    <span>New Registration</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="native-registration-form">
                {submitError && (
                  <div className="form-error-banner">
                    <Info size={16} />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gourav Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. gourav@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label>WhatsApp / Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Enrollment / Roll No.</label>
                    <input
                      type="text"
                      placeholder="e.g. 23103001"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field-group">
                  <label>College / Institute</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="form-field-group">
                    <label>Participation Type</label>
                    <select
                      value={formData.participationType}
                      onChange={(e) => setFormData({ ...formData, participationType: e.target.value })}
                    >
                      <option value="Individual">Individual Entry</option>
                      <option value="Team">Team Entry</option>
                    </select>
                  </div>
                  {formData.participationType === 'Team' && (
                    <div className="form-field-group">
                      <label>Team Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. RoboSlayers"
                        value={formData.teamName}
                        onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="form-field-group">
                  <label>Additional Notes / Hardware Requirements</label>
                  <textarea
                    rows={2}
                    placeholder="Any specific battery connector or transmitter frequency needed?"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="native-submit-btn"
                >
                  <ShieldCheck size={18} />
                  <span>{isSubmitting ? 'Registering with Supabase...' : 'Confirm Registration Pass →'}</span>
                </button>
              </form>
            )}
          </main>
        </div>
      )}

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
