import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TeamPage from './pages/TeamPage';
import ProjectsPage from './pages/ProjectsPage';
import EventsPage from './pages/EventsPage';
import CertificatePage from './pages/CertificatePage';
import AIChatModal from './components/AIChatModal';
import Chatbot from './components/Chatbot';
import ExitGuard from './components/ExitGuard';
import Preloader from './components/Preloader';

export default function App() {
  // Synchronously determine initial route from URL path to eliminate any blank ticks
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (path === '/events' || path === '/event' || hash === 'events' || hash === 'event') return 'events';
      if (path === '/team' || hash === 'team') return 'team';
      if (path === '/projects' || path === '/project' || hash === 'projects' || hash === 'project') return 'projects';
      if (path.startsWith('/certificate/')) return 'certificate';
    }
    return 'home';
  });

  // Extract certificate ID from URL (kept in sync with routing)
  const [certificateId, setCertificateId] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/^\/certificate\/(.+)$/i);
      return match ? match[1] : null;
    }
    return null;
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  // Sync state with URL pathname on load and popstate
  useEffect(() => {
    const syncRouteWithLocation = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
      const hash = window.location.hash.replace('#', '').toLowerCase();

      if (path === '/events' || path === '/event' || hash === 'events' || hash === 'event') {
        setCurrentPage('events');
      } else if (path === '/team' || hash === 'team') {
        setCurrentPage('team');
      } else if (path === '/projects' || path === '/project' || hash === 'projects' || hash === 'project') {
        setCurrentPage('projects');
      } else if (window.location.pathname.match(/^\/certificate\/.+/i)) {
        // Extract certificate ID from actual pathname (preserve original case)
        const match = window.location.pathname.match(/^\/certificate\/(.+)$/i);
        setCertificateId(match ? match[1] : null);
        setCurrentPage('certificate');
      } else {
        setCurrentPage('home');
      }
    };

    syncRouteWithLocation();
    window.addEventListener('popstate', syncRouteWithLocation);
    window.addEventListener('hashchange', syncRouteWithLocation);
    return () => {
      window.removeEventListener('popstate', syncRouteWithLocation);
      window.removeEventListener('hashchange', syncRouteWithLocation);
    };
  }, []);

  // Global smooth scrolling with reduced, elegant scroll speed across all pages
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Lenis) {
      const lenis = new window.Lenis({
        lerp: 0.085, // Buttery, slow, luxurious deceleration
        wheelMultiplier: 0.72, // Reduced scroll speed by ~28% across all pages
        touchMultiplier: 1.0,
        smoothWheel: true,
      });

      window.lenisInstance = lenis;

      let rafId;
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        lenis.destroy();
        window.lenisInstance = null;
      };
    }
  }, []);

  const handlePageChange = (page, anchor = null) => {
    setCurrentPage(page);
    let targetPath = '/';
    if (page === 'events') {
      targetPath = '/events';
    } else if (page === 'team') {
      targetPath = '/team';
    } else if (page === 'projects') {
      targetPath = '/projects';
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(el, { offset: -60, duration: 1.2 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  };

  return (
    <div className="cicr-app-root">
      {/* Starting Video Animation Preloader (plays first for all routes) */}
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

      {/* Main App Chrome (Navbar, Routed Page, Footer, Assistant) */}
      {!showPreloader && (
        <>
          {/* Universal Swipe & Multi-Back Exit Guard */}
          <ExitGuard
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
          />

          {/* Fixed Header */}
          <Navbar
            currentPage={currentPage}
            setCurrentPage={handlePageChange}
            onOpenChat={() => setIsChatOpen(true)}
          />

          {/* Main Routed Page Content */}
          <main className="cicr-main-content">
            {currentPage === 'home' && (
              <LandingPage
                setCurrentPage={handlePageChange}
                onOpenChat={() => setIsChatOpen(true)}
              />
            )}
            {currentPage === 'events' && (
              <EventsPage setCurrentPage={handlePageChange} />
            )}
            {currentPage === 'projects' && (
              <ProjectsPage setCurrentPage={handlePageChange} />
            )}
            {currentPage === 'team' && (
              <TeamPage setCurrentPage={handlePageChange} />
            )}
            {currentPage === 'certificate' && (
              <CertificatePage
                certificateId={certificateId}
                setCurrentPage={handlePageChange}
              />
            )}
          </main>

          {/* Footer */}
          <Footer setCurrentPage={handlePageChange} />

          {/* AI Assistant Modal */}
          <AIChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />

          {/* Floating Chatbot Widget in Bottom Right Corner (from previous-code) */}
          <Chatbot />
        </>
      )}
    </div>
  );
}
