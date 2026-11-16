/**
 * Instant Cyberpunk Avatar Generator (Zero-Network Latency)
 * Produces crisp, high-resolution vector SVGs in 0ms without external HTTP dependencies.
 */
export function generateInstantAvatar(name, domain = 'Technical', size = 256) {
  const cleanName = (name || 'Member').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  let initials = 'CI';
  if (parts.length >= 2) {
    initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1 && parts[0].length >= 2) {
    initials = parts[0].slice(0, 2).toUpperCase();
  } else if (parts.length === 1) {
    initials = parts[0][0].toUpperCase();
  }

  // Domain-based obsidian cyber color palette:
  let grad1 = '#ff601c';
  let grad2 = '#ea580c';
  let borderGrad1 = '#ff601c';
  let borderGrad2 = '#f59e0b';
  let bgGradient = '#0d131f';

  if (domain === 'Technical') {
    grad1 = '#38bdf8'; // Electric Cyan
    grad2 = '#0284c7';
    borderGrad1 = '#38bdf8';
    borderGrad2 = '#818cf8';
    bgGradient = '#0a1526';
  } else if (domain === 'Management') {
    grad1 = '#ff7a30'; // Solar Orange
    grad2 = '#ea580c';
    borderGrad1 = '#ff7a30';
    borderGrad2 = '#f59e0b';
    bgGradient = '#1a0e08';
  } else if (domain === 'Creative' || domain === 'PR/Creative') {
    grad1 = '#f472b6'; // Vibrant Pink
    grad2 = '#db2777';
    borderGrad1 = '#f472b6';
    borderGrad2 = '#a855f7';
    bgGradient = '#190a18';
  } else if (domain === 'Faculty Coordinator' || domain === 'Faculty') {
    grad1 = '#fbbf24'; // Amber Gold
    grad2 = '#d97706';
    borderGrad1 = '#fbbf24';
    borderGrad2 = '#f59e0b';
    bgGradient = '#181205';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="${grad1}"/>
      </linearGradient>
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${borderGrad1}"/>
        <stop offset="100%" stop-color="${borderGrad2}"/>
      </linearGradient>
      <radialGradient id="meshBg" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="${grad2}" stop-opacity="0.32"/>
        <stop offset="65%" stop-color="${bgGradient}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="#06080e" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="${size / 2}" fill="url(#meshBg)"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 3}" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.5"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="url(#textGrad)" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" font-weight="800" font-size="${Math.round(size * 0.38)}px" letter-spacing="1.5px">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

