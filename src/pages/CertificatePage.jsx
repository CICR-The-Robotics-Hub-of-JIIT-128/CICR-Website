import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  ExternalLink,
  Award,
  Hash,
  User,
  Calendar,
  Check,
  Copy,
  Share2,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import '../styles/certificate.css';

// Role-specific descriptions matching the certificate templates exactly
const ROLE_DESCRIPTIONS = {
  participant: {
    label: 'Participant',
    title: 'Certificate of Participation',
    description:
      'This certificate is awarded for the successful completion of TechTonic 2.0 — a three-day hands-on workshop on Artificial Intelligence, Computer Vision and Edge AI, organised by CICR (Creative & Innovative Cell in Robotics) at Jaypee Institute of Information Technology, Sector 128, Noida. The recipient engaged in intensive practical learning sessions, project development, and demonstrated dedication throughout the programme.',
    color: '#00f0ff',
    glow: 'rgba(0, 240, 255, 0.35)',
    badge: '🎓',
  },
  team_member: {
    label: 'Core Team Member',
    title: 'Certificate of Contribution',
    description:
      "This certificate is awarded in recognition of outstanding dedication and contribution as a core team member of CICR towards the planning, coordination, and successful execution of TechTonic 2.0 — the three-day hands-on workshop on Artificial Intelligence, Computer Vision and Edge AI. The recipient's commitment and hard work were instrumental in making the event a success.",
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.35)',
    badge: '⭐',
  },
};

export default function CertificatePage({ certificateId, setCurrentPage }) {
  const [state, setState] = useState('loading'); // 'loading' | 'found' | 'not_found' | 'error'
  const [certData, setCertData] = useState(null);
  const [pdfAvailable, setPdfAvailable] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchCertificate = useCallback(async () => {
    if (!certificateId) {
      setState('not_found');
      return;
    }

    setState('loading');
    let certificate = null;

    // 1. Try Vercel Serverless / Vite dev API endpoint
    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(certificateId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.certificate_id) {
          certificate = data;
        }
      } else if (res.status === 404) {
        setState('not_found');
        return;
      }
    } catch {
      // In local dev without API server, fallback gracefully to direct Supabase query
    }

    // 2. Direct Supabase query fallback (essential for local Vite dev server)
    if (!certificate && supabase) {
      try {
        const { data: dbData, error } = await supabase
          .from('techtonic2.0_certificates')
          .select('certificate_id, name, role, drive_file_id, certificate_generated_at, created_at')
          .eq('certificate_id', certificateId)
          .single();

        if (dbData && !error) {
          certificate = {
            certificate_id: dbData.certificate_id,
            name: dbData.name,
            role: dbData.role,
            drive_file_id: dbData.drive_file_id || null,
            certificate_generated_at: dbData.certificate_generated_at || null,
            issued_at: dbData.certificate_generated_at || dbData.created_at,
          };
        } else if (error && error.code === 'PGRST116') {
          setState('not_found');
          return;
        }
      } catch (err) {
        console.warn('Supabase direct lookup failed:', err);
      }
    }

    if (certificate) {
      setCertData(certificate);
      setPdfAvailable(!!certificate.drive_file_id);
      setState('found');
    } else {
      setState('not_found');
    }
  }, [certificateId]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const copyCertificateId = () => {
    if (!certData?.certificate_id) return;
    navigator.clipboard.writeText(certData.certificate_id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const copyVerificationUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const roleInfo = certData ? ROLE_DESCRIPTIONS[certData.role] || ROLE_DESCRIPTIONS.participant : null;

  // Direct high-resolution image rendered by Google Drive CDN
  const driveThumbnailUrl = certData?.drive_file_id
    ? `https://lh3.googleusercontent.com/d/${certData.drive_file_id}=w1600`
    : null;

  // Construct Google Drive embed URL (public viewer fallback)
  const driveEmbedUrl = certData?.drive_file_id
    ? `https://drive.google.com/file/d/${certData.drive_file_id}/preview`
    : null;

  const driveViewUrl = certData?.drive_file_id
    ? `https://drive.google.com/file/d/${certData.drive_file_id}/view`
    : null;

  return (
    <div className="gdg-cert-page">
      {/* Background Grid Pattern (Matching Team and Events Pages) */}
      <div className="bg-grid-pattern" aria-hidden="true" />

      <div className="cert-page-content-wrapper">
        {/* Top Breadcrumb Navigation */}
        <div className="cert-header-eyebrow">
          <button
            type="button"
            className="cert-breadcrumb-link-btn"
            onClick={() => {
              if (setCurrentPage) {
                setCurrentPage('events');
              } else {
                window.location.href = '/events';
              }
              setTimeout(() => {
                const el = document.getElementById('techtonic-2');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
          >
            TechTonic 2.0
          </button>
          {certData && (
            <>
              <span className="cert-breadcrumb-divider">/</span>
              <span className="cert-breadcrumb-id-text">{certData.certificate_id}</span>
            </>
          )}
        </div>

        {/* Loading state */}
        {state === 'loading' && (
          <div className="cert-status-card cert-loading">
            <Loader2 size={36} className="cert-spin" />
            <p className="cert-status-title">Verifying Certificate…</p>
            <p className="cert-status-sub">Querying cryptographic records for {certificateId}</p>
          </div>
        )}

        {/* Not found state */}
        {state === 'not_found' && (
          <div className="cert-status-card cert-not-found">
            <div className="cert-status-icon-wrap cert-warn">
              <AlertTriangle size={28} />
            </div>
            <p className="cert-status-title">Certificate Not Found</p>
            <p className="cert-status-sub">
              No certificate with ID <code className="cert-id-code">{certificateId}</code> exists in our
              database records. Please verify the ID and try again.
            </p>
            <button
              type="button"
              onClick={() => setCurrentPage && setCurrentPage('home')}
              className="cert-back-btn"
            >
              ← Back to CICR Home
            </button>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="cert-status-card cert-not-found">
            <div className="cert-status-icon-wrap cert-warn">
              <AlertTriangle size={28} />
            </div>
            <p className="cert-status-title">Verification Server Unavailable</p>
            <p className="cert-status-sub">
              Unable to reach the verification server. Please check your connection and try again.
            </p>
            <div className="flex gap-3">
              <button type="button" className="cert-back-btn" onClick={fetchCertificate}>
                Retry Verification
              </button>
              <button
                type="button"
                className="cert-back-btn"
                style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }}
                onClick={() => setCurrentPage && setCurrentPage('home')}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Certificate found — Wide Horizontal Showcase followed by Details Content */}
        {state === 'found' && certData && roleInfo && (
          <div className="cert-horizontal-layout">
            {/* =================================================================
                 1. DETAILED CONTENT SECTION (ON TOP)
                 ================================================================= */}
            <section className="cert-content-container">
              <div
                className="cert-content-card"
                style={{
                  '--role-color': roleInfo.color,
                  '--role-glow': roleInfo.glow,
                }}
              >
                {/* Left: Main Award & Recipient Details */}
                <div className="cert-main-details-col">
                  <div className="cert-event-tag">TechTonic 2.0 · CICR · JIIT-128</div>

                  <h1 className="cert-awarded-heading">{roleInfo.title}</h1>

                  <div className="cert-awarded-label">Awarded to</div>
                  <h2 className="cert-recipient-name-large">
                    <span className="spotlight-name-gradient">{certData.name}</span>
                  </h2>

                  <div className="cert-description-box">
                    <p className="cert-description-text">{roleInfo.description}</p>
                  </div>
                </div>

                {/* Right: Metadata Cards & Quick Actions */}
                <div className="cert-sidebar-meta-col">
                  <div className="cert-meta-cards-grid">
                    {/* Certificate ID */}
                    <div className="cert-meta-stat-card">
                      <div className="cert-meta-stat-header">
                        <Hash size={15} className="cert-meta-stat-icon" />
                        <span className="cert-meta-stat-label">Certificate ID</span>
                      </div>
                      <div className="cert-meta-stat-body">
                        <span className="cert-id-mono">{certData.certificate_id}</span>
                        <button
                          type="button"
                          onClick={copyCertificateId}
                          className="cert-id-copy-btn"
                          title="Copy Certificate ID"
                        >
                          {copiedId ? <Check size={14} className="cert-text-emerald" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Role Track */}
                    <div className="cert-meta-stat-card">
                      <div className="cert-meta-stat-header">
                        <Award size={15} className="cert-meta-stat-icon" />
                        <span className="cert-meta-stat-label">Award Track</span>
                      </div>
                      <div className="cert-meta-stat-body">
                        <span
                          className="cert-role-chip"
                          style={{
                            background: `${roleInfo.color}1f`,
                            borderColor: `${roleInfo.color}44`,
                            color: roleInfo.color,
                          }}
                        >
                          {roleInfo.badge} {roleInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Issue Date */}
                    {certData.issued_at && (
                      <div className="cert-meta-stat-card">
                        <div className="cert-meta-stat-header">
                          <Calendar size={15} className="cert-meta-stat-icon" />
                          <span className="cert-meta-stat-label">Issued Date</span>
                        </div>
                        <div className="cert-meta-stat-body">
                          <span className="cert-meta-stat-val">
                            {new Date(certData.issued_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column */}
                  <div className="cert-actions-cluster">
                    {pdfAvailable && driveViewUrl && (
                      <a
                        href={driveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-primary-action-btn"
                      >
                        <ExternalLink size={16} />
                        <span>Open Full Certificate PDF</span>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={copyVerificationUrl}
                      className="cert-secondary-action-btn"
                    >
                      {copiedLink ? <Check size={16} className="cert-text-emerald" /> : <Share2 size={16} />}
                      <span>{copiedLink ? 'Verification URL Copied!' : 'Copy Verification URL'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================================
                 2. BIG SCREEN HORIZONTAL CERTIFICATE SHOWCASE (BELOW CONTENT)
                 ================================================================= */}
            <section className="cert-showcase-container">
              <div
                className="cert-spotlight-card"
                style={{
                  '--role-color': roleInfo.color,
                  '--role-glow': roleInfo.glow,
                }}
              >
                {/* Control Header Bar */}
                <div className="cert-spotlight-topbar">
                  <div className="cert-topbar-left">
                    <span className="cert-topbar-title">{roleInfo.title}</span>
                  </div>

                  <div className="cert-topbar-actions">
                    {pdfAvailable && driveViewUrl && (
                      <a
                        href={driveViewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cert-topbar-btn"
                        title="Open Full PDF in new tab"
                      >
                        <ExternalLink size={15} />
                        <span>Open PDF</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={copyVerificationUrl}
                      className="cert-topbar-btn"
                      title="Copy certificate verification link"
                    >
                      {copiedLink ? <Check size={15} className="cert-text-emerald" /> : <Share2 size={15} />}
                      <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                {/* Big Horizontal Landscape Frame */}
                <div className="cert-big-screen-frame">
                  {pdfAvailable && driveThumbnailUrl && !imgError ? (
                    <a
                      href={driveViewUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cert-img-link"
                      title="Click to view full vector PDF in Google Drive"
                    >
                      <img
                        src={driveThumbnailUrl}
                        alt={`${roleInfo.title} – ${certData.name}`}
                        className="cert-showcase-img"
                        loading="eager"
                        onError={() => setImgError(true)}
                      />
                    </a>
                  ) : pdfAvailable && driveEmbedUrl ? (
                    <div className="cert-big-iframe-wrap">
                      <iframe
                        src={driveEmbedUrl}
                        className="cert-big-iframe"
                        title={`Official Certificate – ${certData.name}`}
                        allow="autoplay"
                        loading="lazy"
                        onError={() => setPdfAvailable(false)}
                      />
                    </div>
                  ) : (
                    <div className="cert-fallback-display">
                      <div className="cert-fallback-watermark">CICR</div>
                      <div className="cert-fallback-inner">
                        <Award size={48} className="cert-fallback-icon" />
                        <h2 className="cert-fallback-title">{roleInfo.title}</h2>
                        <p className="cert-fallback-subtitle">Awarded to</p>
                        <h1 className="cert-fallback-name">{certData.name}</h1>
                        <p className="cert-fallback-id">Certificate ID: {certData.certificate_id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
