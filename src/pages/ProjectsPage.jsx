import React from 'react';
import { projectsCatalog } from '../data/projectsData';
import CommunityJoinCard from '../components/CommunityJoinCard';
import { Award } from 'lucide-react';

export default function ProjectsPage({ setCurrentPage }) {
  return (
    <div className="cicr-projects-page">
      {/* Background Grid Pattern */}
      <div className="bg-grid-pattern" style={{ opacity: 0.15 }} />

      <div className="projects-page-content-wrapper">
        {/* Simple Headline matching user instruction */}
        <section className="projects-hero-header-simple">
          <h1 className="projects-simple-headline">
            When tech meets{' '}
            <span className="projects-headline-serif">
              creativity &amp; innovation<span className="memory-dot">.</span>
              <svg
                viewBox="0 0 280 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="projects-headline-underline"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 14 C 60 4, 130 4, 190 9 S 250 16, 276 8"
                  stroke="url(#proj-gradient-white-mix)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="proj-gradient-white-mix" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#f472b6" />
                    <stop offset="65%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
        </section>

        {/* Projects Cards Grid */}
        <div className="projects-cards-grid">
          {projectsCatalog.map((project) => (
            <div key={project.id} className="cicr-project-card">
              {/* Photo Box */}
              <div className="project-card-img-wrap">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="project-card-img"
                />
                <div className="project-card-img-overlay" />
              </div>

              {/* Title */}
              <h2 className="project-card-title">{project.title}</h2>

              {/* Idea (in short) */}
              <p className="project-card-desc">{project.description}</p>

              {/* Achievement Badge (only if genuine award) */}
              {project.achievement && (
                <div className="project-achievement-badge">
                  <Award size={15} className="achievement-icon" />
                  <span>{project.achievement}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Community Join Card */}
        <CommunityJoinCard />
      </div>
    </div>
  );
}
