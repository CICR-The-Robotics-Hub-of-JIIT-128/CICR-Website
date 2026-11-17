import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import TeamPage from './pages/TeamPage';
import RegistrationPage from './pages/RegistrationPage';
import ProjectsPage from './pages/ProjectsPage';
import EventsPage from './pages/EventsPage';
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
      if (path === '/register' || path === '/registration' || path === '/registrations' || hash === 'register' || hash === 'registrations') return 'registrations';
    }
    return 'home';
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
      } else if (path === '/register' || path === '/registration' || path === '/registrations' || hash === 'register' || hash === 'registrations') {
        setCurrentPage('registrations');
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

  const handlePageChange = (page, anchor = null) => {
    setCurrentPage(page);
    let targetPath = '/';
    if (page === 'events') {
      targetPath = '/events';
    } else if (page === 'team') {
      targetPath = '/team';
    } else if (page === 'projects') {
      targetPath = '/projects';
    } else if (page === 'registrations') {
      targetPath = '/register';
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }

    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="cicr-app-root">
      {/* Starting Video Animation Preloader */}
      {showPreloader && (
        <Preloader onComplete={() => setShowPreloader(false)} />
      )}

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
        {currentPage === 'registrations' && (
          <RegistrationPage setCurrentPage={handlePageChange} />
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
    </div>
  );
}
