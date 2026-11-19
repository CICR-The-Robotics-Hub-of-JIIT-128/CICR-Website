import React, { useState, useEffect, useRef } from 'react';

export default function Preloader({ onComplete }) {
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  const handleFinish = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsFading(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 700);
  };

  useEffect(() => {
    // Lock background scroll while preloader is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Allow keyboard or touch/click anywhere to dismiss if desired
    const handleKeyDown = () => handleFinish();
    window.addEventListener('keydown', handleKeyDown);

    // If video element exists, attempt play; if blocked by browser policy, dismiss immediately
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          handleFinish();
        });
      }
    }

    // Safety timeout: If video stalls or takes long, dismiss gracefully
    const timeout = setTimeout(() => {
      handleFinish();
    }, 8000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className={`cicr-preloader-backdrop ${isFading ? 'preloader-fade-out' : ''}`}
      onClick={handleFinish}
      style={{ cursor: 'pointer' }}
      title="Click anywhere to continue"
      aria-label="CICR Preloader"
    >
      <video
        ref={videoRef}
        src="/preloader.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleFinish}
        onError={handleFinish}
        className="cicr-preloader-video-fullscreen"
      />
    </div>
  );
}
