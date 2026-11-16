import React from 'react';
import CommunityJoinCard from '../components/CommunityJoinCard';

export default function ProjectsPage({ setCurrentPage }) {
  return (
    <div className="cicr-projects-page celestial-projects-page">
      {/* Background Cosmic Grid / Void */}
      <div className="bg-grid-pattern" style={{ opacity: 0.15 }} />

      <div className="projects-page-content-wrapper">
        {/* Celestial Eclipse Coming Soon Hero (Matching screenshot) */}
        <section className="celestial-coming-soon-stage" aria-label="Projects Coming Soon">
          {/* Celestial Horizon & Coronal Aura */}
          <div className="celestial-horizon-wrapper">
            <div className="celestial-coronal-glow" />
            <div className="celestial-planet-dome">
              <div className="celestial-rim-arc" />
            </div>
          </div>

          {/* Centered Spaced Coming Soon Typography */}
          <div className="celestial-text-container">
            <h1 className="celestial-coming-soon-title">
              <span>C</span>
              <span>O</span>
              <span>M</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
              <span className="celestial-word-gap">&nbsp;&nbsp;</span>
              <span>S</span>
              <span>O</span>
              <span>O</span>
              <span>N</span>
            </h1>
          </div>
        </section>

        {/* Ready to join our community? Box */}
        <CommunityJoinCard />
      </div>
    </div>
  );
}
