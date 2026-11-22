import React, { useState, useEffect, useCallback } from 'react';
import cicrLogo from '../assets/cicr-logo.png';
import { ShieldCheck, User, Hash, Award, AlertTriangle, FileText, Loader2, ExternalLink } from 'lucide-react';

// Role-specific descriptions matching the certificate templates exactly
const ROLE_DESCRIPTIONS = {
  participant: {
    label: 'Participant',
    title: 'Certificate of Participation',
    description:
      'This certificate is awarded for the successful completion of TechTonic 2.0 — a three-day hands-on workshop on Artificial Intelligence, Computer Vision and Edge AI, organised by CICR (Creative & Innovative Cell in Robotics) at Jaypee Institute of Information Technology, Sector 128, Noida. The recipient engaged in intensive practical learning sessions, project development, and demonstrated dedication throughout the programme.',
    color: '#6366f1',
    glow: 'rgba(99, 102, 241, 0.3)',
    badge: '🎓',
  },
  team_member: {
    label: 'Core Team Member',
    title: 'Certificate of Contribution',
    description:
      'This certificate is awarded in recognition of outstanding dedication and contribution as a core team member of CICR towards the planning, coordination, and successful execution of TechTonic 2.0 — the three-day hands-on workshop on Artificial Intelligence, Computer Vision and Edge AI. The recipient's commitment and hard work were instrumental in making the event a success.',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.3)',
    badge: '⭐',
  },
};

export default function CertificatePage({ certificateId }) {
  const [state, setState] = useState('loading'); // 'loading' | 'found' | 'not_found' | 'error'
  const [certData, setCertData] = useState(null);
  const [pdfAvailable, setPdfAvailable] = useState(false);

  const fetchCertificate = useCallback(async () => {
    if (!certificateId) {
      setState('not_found');
      return;
    }

    setState('loading');
    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(certificateId)}`);
      if (res.status === 404) {
        setState('not_found');
        return;
      }
      if (!res.ok) {
        setState('error');
        return;
      }
      const data = await res.json();
      setCertData(data);
      setPdfAvailable(!!data.drive_file_id);
      setState('found');
    } catch {
      setState('error');
    }
  }, [certificateId]);

  useEffect(() => {
    fetchCertificate();
  }, [fetchCertificate]);

  const roleInfo = certData ? ROLE_DESCRIPTIONS[certData.role] : null;

  // Construct Google Drive embed URL (public viewer, no auth required)
  const driveEmbedUrl = certData?.drive_file_id
    ? `https://drive.google.com/file/d/${certData.drive_file_id}/preview`
    : null;

  const driveViewUrl = certData?.drive_file_id
    ? `https://drive.google.com/file/d/${certData.drive_file_id}/view`
    : null;

  return (
    <div className="cert-page-root">
      {/* Background grid overlay */}
      <div className="cert-bg-grid" aria-hidden="true" />

      {/* Header */}
      <header className="cert-header">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="cert-logo-link"
          aria-label="Go to CICR home"
        >
          <img src={cicrLogo} alt="CICR Logo" className="cert-logo" />
          <span className="cert-logo-text">CICR</span>
        </a>
        <div className="cert-header-badge">
          <ShieldCheck size={14} />
          Certificate Verification
        </div>
      </header>

      <main className="cert-main">
        {/* Loading state */}
        {state === 'loading' && (
          <div className="cert-status-card cert-loading">
            <Loader2 size={36} className="cert-spin" />
            <p className="cert-status-title">Verifying Certificate…</p>
            <p className="cert-status-sub">Looking up {certificateId}</p>
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
              records. Please verify the ID and try again.
            </p>
            <a href="/" className="cert-back-btn">← Back to CICR</a>
          </div>
        )}

        {/* Error state */}
        {state === 'error' && (
          <div className="cert-status-card cert-not-found">
            <div className="cert-status-icon-wrap cert-warn">
              <AlertTriangle size={28} />
            </div>
            <p className="cert-status-title">Verification Unavailable</p>
            <p className="cert-status-sub">
              Unable to reach the verification server. Please try again later.
            </p>
            <button className="cert-back-btn" onClick={fetchCertificate}>Retry</button>
          </div>
        )}

        {/* Certificate found */}
        {state === 'found' && certData && roleInfo && (
          <div className="cert-found-layout">
            {/* Verification card */}
            <div
              className="cert-card"
              style={{ '--role-color': roleInfo.color, '--role-glow': roleInfo.glow }}
            >
              {/* Verified badge */}
              <div className="cert-verified-strip">
                <ShieldCheck size={16} />
                <span>Verified Certificate</span>
              </div>

              {/* Event label */}
              <div className="cert-event-tag">TechTonic 2.0 · CICR</div>

              {/* Certificate title */}
              <h1 className="cert-cert-title">{roleInfo.title}</h1>

              {/* Recipient name */}
              <div className="cert-awarded-to">Awarded to</div>
              <div className="cert-recipient-name">{certData.name}</div>

              {/* Meta fields */}
              <div className="cert-meta-grid">
                <div className="cert-meta-item">
                  <Hash size={14} className="cert-meta-icon" />
                  <span className="cert-meta-label">Certificate ID</span>
                  <span className="cert-meta-value cert-mono">{certData.certificate_id}</span>
                </div>
                <div className="cert-meta-item">
                  <Award size={14} className="cert-meta-icon" />
                  <span className="cert-meta-label">Role</span>
                  <span className="cert-meta-value">
                    <span className="cert-role-badge" style={{ background: `${roleInfo.color}22`, color: roleInfo.color }}>
                      {roleInfo.badge} {roleInfo.label}
                    </span>
                  </span>
                </div>
                {certData.issued_at && (
                  <div className="cert-meta-item">
                    <User size={14} className="cert-meta-icon" />
                    <span className="cert-meta-label">Issued</span>
                    <span className="cert-meta-value">
                      {new Date(certData.issued_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="cert-divider" />
              <p className="cert-description">{roleInfo.description}</p>

              {/* Open in Drive button (if available) */}
              {pdfAvailable && driveViewUrl && (
                <a
                  href={driveViewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cert-drive-btn"
                >
                  <ExternalLink size={15} />
                  Open Full Certificate PDF
                </a>
              )}
            </div>

            {/* PDF Preview */}
            {pdfAvailable && driveEmbedUrl ? (
              <div className="cert-pdf-wrapper">
                <div className="cert-pdf-header">
                  <FileText size={16} />
                  <span>Certificate Preview</span>
                </div>
                <div className="cert-pdf-frame-wrap">
                  <iframe
                    src={driveEmbedUrl}
                    className="cert-pdf-frame"
                    title={`Certificate PDF – ${certData.name}`}
                    allow="autoplay"
                    loading="lazy"
                    onError={() => setPdfAvailable(false)}
                  />
                </div>
              </div>
            ) : (
              /* PDF gracefully omitted if unavailable */
              null
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="cert-footer">
        <span>© {new Date().getFullYear()} CICR — Creative &amp; Innovative Cell in Robotics · JIIT-128</span>
      </footer>
    </div>
  );
}

