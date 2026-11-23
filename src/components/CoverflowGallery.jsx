import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Authentic CICR Moments for the 3D Diaries Gallery (including Drive uploads)
const GALLERY_ITEMS = [
  {
    id: 1,
    image: '/gallery/drive/drive-moment-3-akansha-img_1270.jpg',
    fallbackBg: 'linear-gradient(145deg, #071528 0%, #0e274a 100%)'
  },
  {
    id: 2,
    image: '/gallery/drive/drive-moment-5-akansha-img_2805.jpg',
    fallbackBg: 'linear-gradient(145deg, #220610 0%, #3a0d1e 100%)'
  },
  {
    id: 3,
    image: '/gallery/drive/drive-moment-6-akansha-img_6165.jpg',
    fallbackBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)'
  },
  {
    id: 4,
    image: '/gallery/drive/drive-moment-7-akansha-img_6166.jpg',
    fallbackBg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 5,
    image: '/gallery/drive/drive-moment-9-akshita-crawlathon_bot.jpg',
    fallbackBg: 'linear-gradient(145deg, #172554 0%, #1e3a8a 100%)'
  },
  {
    id: 6,
    image: '/gallery/drive/drive-moment-11-akshita-drono_war_course.jpg',
    fallbackBg: 'linear-gradient(145deg, #2e1065 0%, #4c1d95 100%)'
  },
  {
    id: 7,
    image: '/gallery/drive/drive-moment-12-akshita-drono_war_grp.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)'
  },
  {
    id: 8,
    image: '/gallery/drive/drive-moment-13-akshita-ivy.jpg',
    fallbackBg: 'linear-gradient(145deg, #14532d 0%, #166534 100%)'
  },
  {
    id: 9,
    image: '/gallery/drive/drive-moment-15-akshita-roorke_grp_photo.jpg',
    fallbackBg: 'linear-gradient(145deg, #022c22 0%, #064e3b 100%)'
  },
  {
    id: 10,
    image: '/gallery/drive/drive-moment-16-akshita-w1__6_.jpg',
    fallbackBg: 'linear-gradient(145deg, #051a16 0%, #0a2f27 100%)'
  },
  {
    id: 11,
    image: '/gallery/drive/drive-moment-17-arohan-img_20260428_163820.jpg',
    fallbackBg: 'linear-gradient(145deg, #160724 0%, #2a0f42 100%)'
  },
  {
    id: 12,
    image: '/gallery/drive/drive-moment-20-arohan-img_20260502_125357.jpg',
    fallbackBg: 'linear-gradient(145deg, #061c14 0%, #0d3426 100%)'
  },
  {
    id: 13,
    image: '/gallery/drive/drive-moment-22-gourav-img20260502114728.jpg',
    fallbackBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)'
  },
  {
    id: 14,
    image: '/gallery/drive/drive-moment-23-gourav-img20260502114802.jpg',
    fallbackBg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 15,
    image: '/gallery/drive/drive-moment-24-gourav-img20260502115733.jpg',
    fallbackBg: 'linear-gradient(145deg, #18181b 0%, #27272a 100%)'
  },
  {
    id: 16,
    image: '/gallery/drive/drive-moment-25-gourav-img20260502122535_01.jpg',
    fallbackBg: 'linear-gradient(145deg, #172554 0%, #1e3a8a 100%)'
  },
  {
    id: 17,
    image: '/gallery/drive/drive-moment-28-kshitika-dronotics.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)'
  },
  {
    id: 18,
    image: '/gallery/drive/drive-moment-29-kshitika-img_1199.jpg',
    fallbackBg: 'linear-gradient(145deg, #14532d 0%, #166534 100%)'
  },
  {
    id: 19,
    image: '/gallery/drive/drive-moment-30-kshitika-workshop_ak.jpg',
    fallbackBg: 'linear-gradient(145deg, #3b0764 0%, #581c87 100%)'
  },
  {
    id: 20,
    image: '/gallery/drive/drive-moment-31-kshitika-workshop_akg.jpg',
    fallbackBg: 'linear-gradient(145deg, #022c22 0%, #064e3b 100%)'
  },
  {
    id: 21,
    image: '/gallery/drive/drive-moment-32-mahak-20260503_171252.jpg',
    fallbackBg: 'linear-gradient(145deg, #051a16 0%, #0a2f27 100%)'
  },
  {
    id: 22,
    image: '/gallery/drive/drive-moment-33-mahak-img_1089.jpg',
    fallbackBg: 'linear-gradient(145deg, #160724 0%, #2a0f42 100%)'
  },
  {
    id: 23,
    image: '/gallery/drive/drive-moment-34-mahak-img_1152.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c140d 0%, #2f2015 100%)'
  },
  {
    id: 24,
    image: '/gallery/drive/drive-moment-35-mahak-img_1184.jpg',
    fallbackBg: 'linear-gradient(145deg, #071528 0%, #0e274a 100%)'
  },
  {
    id: 25,
    image: '/gallery/drive/drive-moment-36-mahak-img_2871.jpg',
    fallbackBg: 'linear-gradient(145deg, #061c14 0%, #0d3426 100%)'
  },
  {
    id: 26,
    image: '/gallery/drive/drive-moment-37-mahak-img_2942.jpg',
    fallbackBg: 'linear-gradient(145deg, #220610 0%, #3a0d1e 100%)'
  },
  {
    id: 27,
    image: '/gallery/drive/drive-moment-38-mahak-img_2961.jpg',
    fallbackBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)'
  },
  {
    id: 28,
    image: '/gallery/drive/drive-moment-39-mahak-img_9267.jpg',
    fallbackBg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 29,
    image: '/gallery/drive/drive-moment-40-mahak-img_20260717_152439.jpg',
    fallbackBg: 'linear-gradient(145deg, #18181b 0%, #27272a 100%)'
  },
  {
    id: 30,
    image: '/gallery/drive/drive-moment-41-mahak-img_20261029_124401080.jpg',
    fallbackBg: 'linear-gradient(145deg, #172554 0%, #1e3a8a 100%)'
  },
  {
    id: 31,
    image: '/gallery/drive/drive-moment-42-mahak-img-20260505-wa0032.jpg',
    fallbackBg: 'linear-gradient(145deg, #042f2e 0%, #115e59 100%)'
  },
  {
    id: 32,
    image: '/gallery/drive/drive-moment-43-palash-bot.jpg',
    fallbackBg: 'linear-gradient(145deg, #2e1065 0%, #4c1d95 100%)'
  },
  {
    id: 33,
    image: '/gallery/drive/drive-moment-44-palash-dsc04808.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)'
  },
  {
    id: 34,
    image: '/gallery/drive/drive-moment-45-palash-dsc04885.jpg',
    fallbackBg: 'linear-gradient(145deg, #14532d 0%, #166534 100%)'
  },
  {
    id: 35,
    image: '/gallery/drive/drive-moment-46-palash-img-20260508-wa0066.jpg',
    fallbackBg: 'linear-gradient(145deg, #3b0764 0%, #581c87 100%)'
  },
  {
    id: 36,
    image: '/gallery/drive/drive-moment-47-palash-roorkee_group_photo.jpg',
    fallbackBg: 'linear-gradient(145deg, #022c22 0%, #064e3b 100%)'
  },
  {
    id: 37,
    image: '/gallery/drive/drive-moment-48-pulkit-copy_of_img_4507.jpg',
    fallbackBg: 'linear-gradient(145deg, #051a16 0%, #0a2f27 100%)'
  },
  {
    id: 38,
    image: '/gallery/drive/drive-moment-49-pulkit-copy_of_img_4508.jpg',
    fallbackBg: 'linear-gradient(145deg, #160724 0%, #2a0f42 100%)'
  },
  {
    id: 39,
    image: '/gallery/drive/drive-moment-50-pulkit-img_1166.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c140d 0%, #2f2015 100%)'
  },
  {
    id: 40,
    image: '/gallery/drive/drive-moment-51-pulkit-img_1178.jpg',
    fallbackBg: 'linear-gradient(145deg, #071528 0%, #0e274a 100%)'
  },
  {
    id: 41,
    image: '/gallery/drive/drive-moment-52-pulkit-img_5532.jpg',
    fallbackBg: 'linear-gradient(145deg, #061c14 0%, #0d3426 100%)'
  },
  {
    id: 42,
    image: '/gallery/drive/drive-moment-53-pulkit-img_9265.jpg',
    fallbackBg: 'linear-gradient(145deg, #220610 0%, #3a0d1e 100%)'
  },
  {
    id: 43,
    image: '/gallery/drive/drive-moment-54-pulkit-img_20260921_132407060_hdr.jpg',
    fallbackBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)'
  },
  {
    id: 44,
    image: '/gallery/drive/drive-moment-55-pulkit-img20260717125641.jpg',
    fallbackBg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 45,
    image: '/gallery/drive/drive-moment-56-pulkit-pxl_20261029_071928694.jpg',
    fallbackBg: 'linear-gradient(145deg, #18181b 0%, #27272a 100%)'
  },
  {
    id: 46,
    image: '/gallery/drive/drive-moment-57-pulkit-pxl_20261029_081009260.jpg',
    fallbackBg: 'linear-gradient(145deg, #172554 0%, #1e3a8a 100%)'
  },
  {
    id: 47,
    image: '/gallery/drive/drive-moment-58-tushar-copy_of_img_4508.jpg',
    fallbackBg: 'linear-gradient(145deg, #042f2e 0%, #115e59 100%)'
  },
  {
    id: 48,
    image: '/gallery/drive/drive-moment-59-tushar-img_20261029_123715058.jpg',
    fallbackBg: 'linear-gradient(145deg, #2e1065 0%, #4c1d95 100%)'
  },
  {
    id: 49,
    image: '/gallery/drive/drive-moment-60-tushar-img_20261029_123732378.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)'
  },
  {
    id: 50,
    image: '/gallery/drive/drive-moment-61-tushar-img20260503150238_01.jpg',
    fallbackBg: 'linear-gradient(145deg, #14532d 0%, #166534 100%)'
  },
  {
    id: 51,
    image: '/gallery/drive/drive-moment-62-utsavi-img_1272.jpg',
    fallbackBg: 'linear-gradient(145deg, #3b0764 0%, #581c87 100%)'
  },
  {
    id: 52,
    image: '/gallery/drive/drive-moment-63-utsavi-img_20261029_123949369.jpg',
    fallbackBg: 'linear-gradient(145deg, #022c22 0%, #064e3b 100%)'
  },
  {
    id: 53,
    image: '/gallery/drive/drive-moment-64-utsavi-img-20260503-wa0021.jpg',
    fallbackBg: 'linear-gradient(145deg, #051a16 0%, #0a2f27 100%)'
  },
  {
    id: 54,
    image: '/gallery/drive/drive-moment-65-utsavi-img20260502115733.jpg',
    fallbackBg: 'linear-gradient(145deg, #160724 0%, #2a0f42 100%)'
  },
  {
    id: 55,
    image: '/gallery/drive/drive-moment-66-utsavi-img20260503113225.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c140d 0%, #2f2015 100%)'
  },
  {
    id: 56,
    image: '/gallery/drive/drive-moment-67-utsavi-img20260503121725.jpg',
    fallbackBg: 'linear-gradient(145deg, #071528 0%, #0e274a 100%)'
  },
  {
    id: 57,
    image: '/gallery/drive/drive-moment-68-utsavi-img20260503122918.jpg',
    fallbackBg: 'linear-gradient(145deg, #061c14 0%, #0d3426 100%)'
  },
  {
    id: 58,
    image: '/gallery/cicr-moment-1.jpg',
    fallbackBg: 'linear-gradient(145deg, #220610 0%, #3a0d1e 100%)'
  },
  {
    id: 59,
    image: '/gallery/cicr-moment-2.jpg',
    fallbackBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)'
  },
  {
    id: 60,
    image: '/gallery/cicr-moment-3.jpg',
    fallbackBg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 61,
    image: '/gallery/cicr-moment-5.jpg',
    fallbackBg: 'linear-gradient(145deg, #18181b 0%, #27272a 100%)'
  },
  {
    id: 62,
    image: '/gallery/cicr-moment-6.jpg',
    fallbackBg: 'linear-gradient(145deg, #172554 0%, #1e3a8a 100%)'
  },
  {
    id: 63,
    image: '/gallery/cicr-moment-7.jpg',
    fallbackBg: 'linear-gradient(145deg, #042f2e 0%, #115e59 100%)'
  },
  {
    id: 64,
    image: '/gallery/cicr-moment-8.jpg',
    fallbackBg: 'linear-gradient(145deg, #2e1065 0%, #4c1d95 100%)'
  },
  {
    id: 65,
    image: '/gallery/cicr-moment-9.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c1917 0%, #292524 100%)'
  },
  {
    id: 66,
    image: '/gallery/cicr-moment-10.jpg',
    fallbackBg: 'linear-gradient(145deg, #14532d 0%, #166534 100%)'
  },
  {
    id: 67,
    image: '/gallery/cicr-moment-11.jpg',
    fallbackBg: 'linear-gradient(145deg, #3b0764 0%, #581c87 100%)'
  },
  {
    id: 68,
    image: '/gallery/cicr-moment-12.jpg',
    fallbackBg: 'linear-gradient(145deg, #022c22 0%, #064e3b 100%)'
  },
  {
    id: 69,
    image: '/gallery/cicr-moment-13.jpg',
    fallbackBg: 'linear-gradient(145deg, #051a16 0%, #0a2f27 100%)'
  },
  {
    id: 70,
    image: '/gallery/cicr-moment-14.jpg',
    fallbackBg: 'linear-gradient(145deg, #160724 0%, #2a0f42 100%)'
  },
  {
    id: 71,
    image: '/gallery/cicr-moment-15.jpg',
    fallbackBg: 'linear-gradient(145deg, #1c140d 0%, #2f2015 100%)'
  },
  {
    id: 72,
    image: '/gallery/cicr-moment-16.jpg',
    fallbackBg: 'linear-gradient(145deg, #071528 0%, #0e274a 100%)'
  },
  {
    id: 73,
    image: '/gallery/cicr-moment-17.jpg',
    fallbackBg: 'linear-gradient(145deg, #061c14 0%, #0d3426 100%)'
  },
  {
    id: 74,
    image: '/gallery/cicr-moment-18.jpg',
    fallbackBg: 'linear-gradient(145deg, #220610 0%, #3a0d1e 100%)'
  },
  {
    id: 75,
    image: '/gallery/cicr-moment-19.jpg',
    fallbackBg: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 100%)'
  },
  {
    id: 76,
    image: '/gallery/cicr-moment-20.jpg',
    fallbackBg: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
  },
  {
    id: 77,
    image: '/gallery/cicr-moment-21.jpg',
    fallbackBg: 'linear-gradient(145deg, #18181b 0%, #27272a 100%)'
  },
  {
    id: 78,
    image: '/gallery/cicr-moment-22.jpg',
    fallbackBg: 'linear-gradient(145deg, #172554 0%, #1e3a8a 100%)'
  }
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Continuous piecewise 3D curve interpolation
function getInterpolatedValues(absD, isMobile) {
  const points = [
    { d: 0, x: 0, z: isMobile ? 40 : 80, rot: 0, scale: isMobile ? 1.05 : 1.1, bright: 1.05, opacity: 1 },
    { d: 1, x: isMobile ? 175 : 230, z: isMobile ? -40 : -45, rot: isMobile ? 38 : 42, scale: isMobile ? 0.85 : 0.88, bright: 0.75, opacity: 1 },
    { d: 2, x: isMobile ? 310 : 415, z: -90, rot: isMobile ? 44 : 48, scale: 0.78, bright: 0.55, opacity: 1 },
    { d: 3, x: isMobile ? 430 : 580, z: -130, rot: isMobile ? 48 : 52, scale: 0.68, bright: 0.42, opacity: 1 },
    { d: 3.5, x: isMobile ? 500 : 700, z: -160, rot: isMobile ? 50 : 54, scale: 0.60, bright: 0.30, opacity: 0 }
  ];

  if (absD >= 3.5) {
    return { x: 700, z: -160, rot: 54, scale: 0.6, bright: 0.3, opacity: 0, hidden: true };
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    if (absD >= p1.d && absD <= p2.d) {
      const t = (absD - p1.d) / (p2.d - p1.d);
      return {
        x: lerp(p1.x, p2.x, t),
        z: lerp(p1.z, p2.z, t),
        rot: lerp(p1.rot, p2.rot, t),
        scale: lerp(p1.scale, p2.scale, t),
        bright: lerp(p1.bright, p2.bright, t),
        opacity: lerp(p1.opacity, p2.opacity, t),
        hidden: false
      };
    }
  }

  return { x: 0, z: 80, rot: 0, scale: 1.1, bright: 1.05, opacity: 1, hidden: false };
}

export default function CoverflowGallery() {
  const [overlayIndex, setOverlayIndex] = useState(null);
  const total = GALLERY_ITEMS.length;

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const offsetRef = useRef(2.0);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isMobileRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(2.0);
  const hasDragged = useRef(false);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= 768;
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update card DOM transforms directly for silky 60fps continuous floating
  const applyCardTransforms = useCallback((offset) => {
    const isMobile = isMobileRef.current;
    for (let i = 0; i < total; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      let diff = (i - offset) % total;
      while (diff > total / 2) diff -= total;
      while (diff < -total / 2) diff += total;

      const absD = Math.abs(diff);
      const sign = diff < 0 ? -1 : 1;
      const values = getInterpolatedValues(absD, isMobile);

      if (values.hidden || values.opacity <= 0) {
        el.style.transform = `translateX(${sign * values.x}px) translateZ(${values.z}px) scale(${values.scale})`;
        el.style.zIndex = '0';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.visibility = 'hidden';
      } else {
        const finalX = sign * values.x;
        const finalRotY = -sign * values.rot;

        el.style.transform = `translateX(${finalX.toFixed(2)}px) translateZ(${values.z.toFixed(2)}px) rotateY(${finalRotY.toFixed(2)}deg) scale(${values.scale.toFixed(3)})`;
        el.style.zIndex = String(Math.round(35 - absD * 5));
        el.style.opacity = String(values.opacity);
        el.style.visibility = 'visible';
        el.style.pointerEvents = 'auto';
        el.style.filter = `brightness(${values.bright.toFixed(2)})`;

        // Highlight center active card with glowing orange border
        if (absD < 0.45) {
          el.classList.add('is-active-center');
        } else {
          el.classList.remove('is-active-center');
        }
      }
    }
  }, [total]);

  // Continuous animation loop using requestAnimationFrame (NO interval delays)
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const tick = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isHoveredRef.current && !isDraggingRef.current && overlayIndex === null) {
        // Continuous drift towards right:
        // Decreasing offset moves all cards smoothly towards the right (+x)
        const speed = 0.48; // Faster continuous flow (~2s per card)
        offsetRef.current -= delta * speed;

        // Infinite circular wrap
        while (offsetRef.current < 0) offsetRef.current += total;
        while (offsetRef.current >= total) offsetRef.current -= total;

        applyCardTransforms(offsetRef.current);
      }

      animId = requestAnimationFrame(tick);
    };

    // Initial positioning
    applyCardTransforms(offsetRef.current);
    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [applyCardTransforms, overlayIndex, total]);

  // Pointer drag controls (mouse / trackpad)
  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isDraggingRef.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    hasDragged.current = false;
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const diffPx = dragStartX.current - e.clientX;
    if (Math.abs(diffPx) > 5) {
      hasDragged.current = true;
      const stepPx = isMobileRef.current ? 175 : 230;
      offsetRef.current = dragStartOffset.current + diffPx / stepPx;
      while (offsetRef.current < 0) offsetRef.current += total;
      while (offsetRef.current >= total) offsetRef.current -= total;
      applyCardTransforms(offsetRef.current);
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasDragged.current = false;
    }, 60);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      isDraggingRef.current = true;
      dragStartX.current = e.touches[0].clientX;
      dragStartOffset.current = offsetRef.current;
      hasDragged.current = false;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || !e.touches || !e.touches[0]) return;
    const diffPx = dragStartX.current - e.touches[0].clientX;
    if (Math.abs(diffPx) > 5) {
      hasDragged.current = true;
      const stepPx = 175;
      offsetRef.current = dragStartOffset.current + diffPx / stepPx;
      while (offsetRef.current < 0) offsetRef.current += total;
      while (offsetRef.current >= total) offsetRef.current -= total;
      applyCardTransforms(offsetRef.current);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasDragged.current = false;
    }, 60);
  };

  // Overlay Controls
  const closeOverlay = useCallback(() => {
    setOverlayIndex(null);
  }, []);

  const handleOverlayPrev = useCallback(() => {
    setOverlayIndex((prev) => {
      if (prev === null) return 0;
      const nextIdx = prev === 0 ? total - 1 : prev - 1;
      offsetRef.current = nextIdx;
      applyCardTransforms(nextIdx);
      return nextIdx;
    });
  }, [total, applyCardTransforms]);

  const handleOverlayNext = useCallback(() => {
    setOverlayIndex((prev) => {
      if (prev === null) return 0;
      const nextIdx = prev === total - 1 ? 0 : prev + 1;
      offsetRef.current = nextIdx;
      applyCardTransforms(nextIdx);
      return nextIdx;
    });
  }, [total, applyCardTransforms]);

  // Lock body scroll and listen for Escape / Arrow keys when overlay is active
  useEffect(() => {
    if (overlayIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeOverlay();
      } else if (e.key === 'ArrowLeft') {
        handleOverlayPrev();
      } else if (e.key === 'ArrowRight') {
        handleOverlayNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [overlayIndex, closeOverlay, handleOverlayPrev, handleOverlayNext]);

  return (
    <section
      className="coverflow-gallery-section"
      id="gallery"
      tabIndex={0}
      aria-label="3D Photo Gallery"
    >
      <div id="wings" style={{ position: 'relative', top: '-80px' }} />
      <div id="fleet" style={{ position: 'relative', top: '-80px' }} />

      <div className="coverflow-wrapper">
        {/* Section Heading: CICR Diaries. with cool serif italic font & gradient underline */}
        <div className="gallery-header-clean">
          <h2 className="gallery-title-wrapper">
            <span className="gallery-accent-serif">
              CICR Diaries<span className="gallery-dot">.</span>
              <svg
                viewBox="0 0 280 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="gallery-underline-svg"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M4 14 C 60 4, 130 4, 190 9 S 250 16, 276 8"
                  stroke="url(#gallery-gradient-white-mix)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gallery-gradient-white-mix" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="25%" stopColor="#f472b6" />
                    <stop offset="65%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#38bdf8" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
        </div>

        {/* 3D Coverflow Stage with continuous floating motion */}
        <div
          ref={stageRef}
          className="coverflow-stage"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          style={{ touchAction: 'pan-y', overscrollBehaviorX: 'contain' }}
        >
          {/* 3D Cards Track */}
          <div className="coverflow-track">
            {GALLERY_ITEMS.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => (cardRefs.current[idx] = el)}
                className="coverflow-card"
                onClick={() => {
                  if (!hasDragged.current) {
                    setOverlayIndex(idx);
                  }
                }}
              >
                <img
                  src={item.image}
                  alt={`CICR Diary Moment ${idx + 1}`}
                  className="coverflow-card-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.style.background = item.fallbackBg;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Image Overlay Modal */}
      {overlayIndex !== null && GALLERY_ITEMS[overlayIndex] && (
        <div
          className="gallery-overlay-backdrop"
          onClick={closeOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview Overlay"
        >
          <div
            className="gallery-overlay-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              className="gallery-overlay-close-btn"
              onClick={closeOverlay}
              aria-label="Close image overlay"
            >
              <X size={20} />
            </button>

            {/* Navigation buttons (loops circular) */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  className="gallery-overlay-nav-btn prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOverlayPrev();
                  }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  className="gallery-overlay-nav-btn next"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOverlayNext();
                  }}
                  aria-label="Next image"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            {/* Overlay Image Box */}
            <div className="gallery-overlay-img-box">
              <img
                src={GALLERY_ITEMS[overlayIndex].image}
                alt={`CICR Diary Moment ${overlayIndex + 1}`}
                className="gallery-overlay-image"
              />
            </div>

            {/* Indicator / Counter */}
            <div className="gallery-overlay-footer">
              <span className="gallery-overlay-badge">CICR Diaries</span>
              <span className="gallery-overlay-counter">
                {overlayIndex + 1} / {total}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
