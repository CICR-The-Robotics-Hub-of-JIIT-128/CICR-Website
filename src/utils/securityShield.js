/**
 * CICR Security & Anti-Tamper Shield
 * Protects client application against DevTools inspection, console tampering,
 * right-click source viewing, and reverse engineering attempts.
 */

export function initSecurityShield() {
  if (typeof window === 'undefined') return;

  // 1. Disable Right-Click Context Menu (Prevents "Inspect", "View Page Source")
  document.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  // 2. Disable DevTools Keyboard Shortcuts Across Windows, Mac, Linux
  window.addEventListener(
    'keydown',
    (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key ? e.key.toUpperCase() : '';
      const keyCode = e.keyCode || e.which;

      // F12 key (Chrome, Firefox, Edge, Safari DevTools)
      if (key === 'F12' || keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + Shift + I (Inspect)
      // Ctrl + Shift + J (Console)
      // Ctrl + Shift + C (Inspect Element)
      // Ctrl + Shift + K (Firefox Web Console)
      // Ctrl + Shift + E (Network Tab)
      if (isCtrlOrCmd && isShift) {
        if (
          ['I', 'J', 'C', 'K', 'E'].includes(key) ||
          [73, 74, 67, 75, 69].includes(keyCode)
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Ctrl + U (View Page Source)
      if (isCtrlOrCmd && (key === 'U' || keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Ctrl + S (Save Page HTML)
      if (isCtrlOrCmd && (key === 'S' || keyCode === 83)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    },
    { capture: true }
  );

  // 3. Prevent dragging images to open source
  document.addEventListener(
    'dragstart',
    (e) => {
      if (e.target && e.target.nodeName === 'IMG') {
        e.preventDefault();
        return false;
      }
    },
    { capture: true }
  );

  // 4. Neutralize and clear console access
  const clearAndWarn = () => {
    try {
      if (typeof console.clear === 'function') {
        console.clear();
      }
    } catch {}
  };

  const noop = () => {};
  try {
    ['log', 'info', 'warn', 'error', 'debug', 'dir', 'table', 'trace'].forEach((method) => {
      if (window.console && typeof window.console[method] === 'function') {
        window.console[method] = noop;
      }
    });
  } catch {}

  // Periodic console flush
  setInterval(clearAndWarn, 2000);

  // 5. Active Anti-Debugger Trap for unauthorized menu inspection
  setInterval(() => {
    try {
      const startTime = performance.now();
      (function() { return false; }['constructor']('debugger')());
      if (performance.now() - startTime > 100) {
        clearAndWarn();
      }
    } catch {}
  }, 1000);
}
