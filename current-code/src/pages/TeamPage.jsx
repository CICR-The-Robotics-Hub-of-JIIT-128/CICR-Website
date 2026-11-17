import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchTeamMembers, subscribeToTeamMembers } from '../lib/supabase';
import { teamData } from '../data/teamData';
import { generateInstantAvatar } from '../utils/avatar';
import { ChevronLeft, ChevronRight, Instagram, Linkedin, Github, Globe, Users } from 'lucide-react';
import CommunityJoinCard from '../components/CommunityJoinCard';

/**
 * Resolves member avatar URL instantly (0ms latency).
 * For Google Drive links (which require user auth and redirect to Google Accounts sign-in),
 * directly uses the instant high-definition vector SVG avatar to eliminate network bottlenecks.
 */
function getMemberImage(member) {
  if (!member) return '';
  const img = member.image;
  if (!img || img === 'null' || img === 'undefined' || (typeof img === 'string' && img.trim() === '') || (typeof img === 'string' && img.includes('placeholder'))) {
    return member.fallbackImage && member.fallbackImage !== 'null'
      ? member.fallbackImage
      : generateInstantAvatar(member.name, member.domain);
  }
  if (typeof img === 'string' && (img.includes('drive.google.com') || img.includes('lh3.googleusercontent.com'))) {
    return member.fallbackImage && member.fallbackImage !== 'null'
      ? member.fallbackImage
      : generateInstantAvatar(member.name, member.domain);
  }
  return img;
}

export default function TeamPage({ setCurrentPage }) {
  // Initialize synchronously with real team data to eliminate any loading flash or empty states
  const [teamMembersData, setTeamMembersData] = useState(() => {
    return teamData || { faculty: [], leads: [], core: [], volunteers: [] };
  });
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('faculty'); // 'faculty' | 'leads' | 'core' | 'volunteers'
  const [coreDomainFilter, setCoreDomainFilter] = useState('all'); // 'all' | 'Technical' | 'Management' | 'Creative'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await fetchTeamMembers();
        if (data && (data.faculty?.length || data.leads?.length || data.core?.length || data.volunteers?.length)) {
          setTeamMembersData(data);
        }
      } catch (err) {
        console.warn('Error loading team roster:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();

    // Realtime autosync with Supabase database
    const unsubscribe = subscribeToTeamMembers(() => {
      loadTeam();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const rawMembers = teamMembersData[activeCategory] || [];

  // Filter core team members by domain if active
  const currentMembers =
    activeCategory === 'core' && coreDomainFilter !== 'all'
      ? rawMembers.filter((m) => m.domain === coreDomainFilter)
      : rawMembers;

  const validIndex = currentMembers.length > 0 ? Math.min(selectedIndex, currentMembers.length - 1) : 0;
  const currentMember = currentMembers[validIndex] || null;

    // Auto-scroll selected avatar purely horizontally inside the carousel track without scrolling the page/window
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (validIndex === 0) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
      return;
    }

    const selectedEl =
      track.querySelector('.team-portrait-card-slot.selected') ||
      track.querySelector('.carousel-avatar-slot.selected');
    if (selectedEl) {
      const slotLeft = selectedEl.offsetLeft;
      const slotWidth = selectedEl.offsetWidth;
      const trackWidth = track.clientWidth;
      const targetLeft = slotLeft - (trackWidth / 2) + (slotWidth / 2);
      track.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' });
    }
  }, [validIndex, activeCategory, coreDomainFilter]);

  const handleCategoryChange = (catKey) => {
    setActiveCategory(catKey);
    setCoreDomainFilter('all');
    setSelectedIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  };

  const handleDomainFilterChange = (domKey) => {
    setCoreDomainFilter(domKey);
    setSelectedIndex(0);
    if (trackRef.current) {
      trackRef.current.scrollTo({ left: 0, behavior: 'instant' });
    }
  };

  const handlePrev = useCallback(() => {
    if (currentMembers.length <= 1) return;
    setSelectedIndex((prev) => (prev === 0 ? currentMembers.length - 1 : prev - 1));
  }, [currentMembers.length]);

  const handleNext = useCallback(() => {
    if (currentMembers.length <= 1) return;
    setSelectedIndex((prev) => (prev === currentMembers.length - 1 ? 0 : prev + 1));
  }, [currentMembers.length]);

  // Global Keyboard Navigation (Left / Right Arrow keys to switch/slide profiles without clicking)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'Left') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'Right') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const renderColorizedName = (name) => {
    return <span className="spotlight-name-gradient">{name}</span>;
  };

  // Counts for core domain sub-buttons
  const allCore = teamMembersData.core || [];
  const techCount = allCore.filter((m) => m.domain === 'Technical').length;
  const mgmtCount = allCore.filter((m) => m.domain === 'Management').length;
  const creativeCount = allCore.filter((m) => m.domain === 'Creative').length;

  return (
    <div className="gdg-team-page">
      {/* Background Grid Pattern (Only clean gridlines) */}
      <div className="bg-grid-pattern"></div>

      <div className="team-page-content-wrapper">
        {/* =================================================================
             1. Main Showcase Card (Selected Member Spotlight)
             ================================================================= */}
        <section className="spotlight-showcase-container">
          {currentMember ? (
            <div className="spotlight-card">
              {/* Left: Avatar with Rainbow / Gradient Ring */}
              <div className="spotlight-avatar-frame">
                <div className="gradient-ring-border">
                  <img
                    src={getMemberImage(currentMember)}
                    alt={currentMember.name}
                    className="spotlight-avatar-img"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = generateInstantAvatar(currentMember.name, currentMember.domain);
                    }}
                  />
                </div>
              </div>

              {/* Right: Info & Bio */}
              <div className="spotlight-details">
                <div className="spotlight-role-pill">
                  <span>{currentMember.role}</span>
                </div>

                <h1 className="spotlight-greeting">Hi, my name is</h1>

                <h2 className="spotlight-name">
                  {renderColorizedName(currentMember.name)}
                </h2>

                <p className="spotlight-quote">
                  {currentMember?.quote
                    ? `"${currentMember.quote.trim().replace(/^[\"'“”]+|[\"'“”]+$/g, '').trim()}"`
                    : '\u00A0'}
                </p>

                {/* Social Links Row */}
                <div className="spotlight-social-row">
                  {currentMember.linkedin && (
                    <a
                      href={
                        currentMember.linkedin.startsWith('http')
                          ? currentMember.linkedin
                          : `https://${currentMember.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotlight-social-item"
                      title={`${currentMember.name} on LinkedIn`}
                    >
                      <Linkedin size={18} />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {currentMember.github && (
                    <a
                      href={
                        currentMember.github.startsWith('http')
                          ? currentMember.github
                          : `https://${currentMember.github}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotlight-social-item"
                      title={`${currentMember.name} on GitHub`}
                    >
                      <Github size={18} />
                      <span>GitHub</span>
                    </a>
                  )}

                  {currentMember.portfolio && (
                    <a
                      href={
                        currentMember.portfolio.startsWith('http')
                          ? currentMember.portfolio
                          : `https://${currentMember.portfolio}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotlight-social-item"
                      title={`${currentMember.name}'s Portfolio / Website`}
                    >
                      <Globe size={18} />
                      <span>Portfolio</span>
                    </a>
                  )}

                  {currentMember.instagram && (
                    <a
                      href={
                        currentMember.instagram.startsWith('http')
                          ? currentMember.instagram
                          : `https://instagram.com/${currentMember.instagram}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="spotlight-social-item"
                      title={`${currentMember.name} on Instagram`}
                    >
                      <Instagram size={18} />
                      <span>Instagram</span>
                    </a>
                  )}


                </div>
              </div>
            </div>
          ) : (
            <div className="spotlight-card empty-category-card">
              <div className="empty-category-inner">
                <Users size={48} className="empty-category-icon" />
                <h3 className="empty-category-title">
                  {loading ? 'Loading Team...' : 'No Profiles in this Category Yet'}
                </h3>
                <p className="empty-category-text">
                  {loading
                    ? 'Fetching live team roster from database...'
                    : 'Team members added to Supabase database will automatically sync and appear here in real-time.'}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* =================================================================
             2. Category Navigation Tabs
             Requested Order: Faculty Coordinators -> Leads -> Core Team -> Volunteers
             ================================================================= */}
        <div className="team-category-nav-bar">
          <button
            className={`team-category-nav-btn ${activeCategory === 'faculty' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('faculty')}
          >
            Faculty Coordinators ({(teamMembersData.faculty || []).length})
          </button>

          <button
            className={`team-category-nav-btn ${activeCategory === 'leads' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('leads')}
          >
            Heads ({(teamMembersData.leads || []).length})
          </button>

          <button
            className={`team-category-nav-btn ${activeCategory === 'core' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('core')}
          >
            Core Team ({allCore.length})
          </button>

          <button
            className={`team-category-nav-btn ${activeCategory === 'volunteers' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('volunteers')}
          >
            Volunteers ({(teamMembersData.volunteers || []).length})
          </button>
        </div>

        {/* =================================================================
             2b. Core Team Domain Sub-Buttons (Technical | Management | Creative)
             ================================================================= */}
        {activeCategory === 'core' && (
          <div className="team-subdomain-nav-bar" aria-label="Core Team Domain Filter">
            <button
              className={`team-subdomain-pill ${coreDomainFilter === 'all' ? 'active' : ''}`}
              onClick={() => handleDomainFilterChange('all')}
            >
              <span>All Core ({allCore.length})</span>
            </button>

            <button
              className={`team-subdomain-pill ${coreDomainFilter === 'Technical' ? 'active' : ''}`}
              onClick={() => handleDomainFilterChange('Technical')}
            >
              <span className="subdomain-dot dot-cyan"></span>
              <span>Technical ({techCount})</span>
            </button>

            <button
              className={`team-subdomain-pill ${coreDomainFilter === 'Management' ? 'active' : ''}`}
              onClick={() => handleDomainFilterChange('Management')}
            >
              <span className="subdomain-dot dot-orange"></span>
              <span>Management ({mgmtCount})</span>
            </button>

            <button
              className={`team-subdomain-pill ${coreDomainFilter === 'Creative' ? 'active' : ''}`}
              onClick={() => handleDomainFilterChange('Creative')}
            >
              <span className="subdomain-dot dot-pink"></span>
              <span>Creative ({creativeCount})</span>
            </button>
          </div>
        )}

        {/* =================================================================
             3. Interactive Member Card Carousel Track (Modern Portrait Design)
             ================================================================= */}
        {currentMembers.length > 0 && (
          <section className="avatar-carousel-container">
            <button
              className="carousel-arrow-btn arrow-prev"
              onClick={handlePrev}
              aria-label="Previous member"
              disabled={currentMembers.length <= 1}
            >
              <ChevronLeft size={22} />
            </button>

            <div className="avatar-carousel-track" ref={trackRef}>
              {currentMembers.map((member, idx) => {
                const isSelected = idx === validIndex;
                const avatarSrc = getMemberImage(member);
                return (
                  <div
                    key={member.id || idx}
                    className={`team-portrait-card-slot ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedIndex(idx)}
                    title={member.name}
                  >
                    <div className="portrait-card-inner">
                      <img
                        src={avatarSrc}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="portrait-card-img"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = generateInstantAvatar(member.name, member.domain);
                        }}
                      />
                      <div className="portrait-card-gradient" />
                      <div className="portrait-card-glass-badge">
                        <span className="portrait-card-name">{member.name}</span>
                        <span className="portrait-card-role">{member.role || member.domain || 'Member'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="carousel-arrow-btn arrow-next"
              onClick={handleNext}
              aria-label="Next member"
              disabled={currentMembers.length <= 1}
            >
              <ChevronRight size={22} />
            </button>
          </section>
        )}

        {/* =================================================================
             4. "Ready to join our community?" Bottom Card
             ================================================================= */}
        <CommunityJoinCard />
      </div>
    </div>
  );
}
