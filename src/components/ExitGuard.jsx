import React, { useState, useEffect, useRef } from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

/**
 * Universal Exit & Swipe Guard for Mobile, Tablet & Desktop devices.
 * 
 * Prevents accidental closure of the website when users swipe horizontally
 * (right-to-left or left-to-right) or press the system/browser back button.
 * Requires 3 deliberate attempts within 2.5 seconds before allowing exit.
 */
export default function ExitGuard({ currentPage, setCurrentPage }) {
  const [toastMessage, setToastMessage] = useState(null);
  const exitAttempts = useRef(0);
  const lastAttemptTime = useRef(0);
  const toastTimeout = useRef(null);
  const isAllowingExit = useRef(false);
  const currentPageRef = useRef(currentPage);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    // Ensure the history stack has our guard barrier once on initial mount
    try {
      window.history.pushState({ cicrExitGuard: true, time: Date.now() }, '', window.location.href);
    } catch {
      // Ignore security restrictions in restricted iframes
    }

    const handlePopState = (e) => {
      // If user is allowing genuine exit on 3rd attempt, let it pass
      if (isAllowingExit.current) {
        return;
      }

      const activePage = currentPageRef.current;

      // If user is currently on an inner route (/team, /event, /projects, /register),
      // back action safely navigates back to Home without closing the web app!
      if (activePage && activePage !== 'home') {
        setCurrentPage('home');
        try {
          window.history.pushState({ cicrExitGuard: true }, '', '/');
        } catch {}
        return;
      }

      // User is on the home page and triggered back/swipe-back
      const now = Date.now();
      if (now - lastAttemptTime.current < 2500) {
        exitAttempts.current += 1;
      } else {
        exitAttempts.current = 1;
      }
      lastAttemptTime.current = now;

      if (exitAttempts.current < 3) {
        // Prevent accidental closing by re-pushing our guard barrier
        try {
          window.history.pushState({ cicrExitGuard: true }, '', window.location.href);
        } catch {}

        const remaining = 3 - exitAttempts.current;
        const msg = `Swipe or press back ${remaining} more time${remaining === 1 ? '' : 's'} to exit`;

        setToastMessage(msg);
        if (toastTimeout.current) clearTimeout(toastTimeout.current);
        toastTimeout.current = setTimeout(() => {
          setToastMessage(null);
        }, 2200);
      } else {
        // User deliberately swiped/pressed back 3 times in a row -> Allow clean exit
        setToastMessage('Exiting website...');
        isAllowingExit.current = true;
        setTimeout(() => {
          window.history.back();
        }, 150);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [setCurrentPage]);

  // Touch gesture edge shielding to prevent accidental browser tab closures on mobile
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (!e.touches || !e.touches[0]) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;

      // Never intercept gestures near the top navbar area
      if (touchStartY < 75) return;

      // Intercept touches that start within 25px of the device screen edges
      const isScreenEdge = touchStartX < 25 || touchStartX > window.innerWidth - 25;
      if (isScreenEdge && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  if (!toastMessage) return null;

  return (
    <div className="cicr-exit-shield-toast" role="alert" aria-live="assertive">
      <div className="exit-shield-toast-pill">
        <ShieldAlert size={16} className="exit-shield-icon" />
        <span className="exit-shield-text">{toastMessage}</span>
      </div>
    </div>
  );
}
