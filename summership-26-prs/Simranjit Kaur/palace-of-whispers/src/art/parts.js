// Reusable palace architecture.
//
// Every piece is a pure function of geometry, so the same arch can be a doorway
// in Tara's room and a gate in the outer wall. Scenes compose these rather than
// hand-drawing shapes, which keeps the world visually continuous as the camera
// travels through it.

/** Onion dome with finial, base centred on (cx, y). */
export function dome(cx, y, w, h, cls = 'stone') {
  const half = w / 2;
  return `<g class="${cls}">
    <path d="M ${cx - half} ${y}
             C ${cx - half} ${y - h * 0.5} ${cx - half * 0.62} ${y - h * 0.8} ${cx} ${y - h}
             C ${cx + half * 0.62} ${y - h * 0.8} ${cx + half} ${y - h * 0.5} ${cx + half} ${y} Z" />
    <rect x="${cx - 3}" y="${y - h - 28}" width="6" height="30" rx="3" />
    <circle cx="${cx}" cy="${y - h - 34}" r="7" />
  </g>`;
}

/** A pointed Mughal arch as a closed path — use as opening, niche or doorway. */
export function archPath(x, y, w, h) {
  const r = w / 2;
  const cx = x + r;
  return `M ${x} ${y + h}
          L ${x} ${y + r * 0.72}
          Q ${x} ${y} ${cx} ${y - r * 0.28}
          Q ${x + w} ${y} ${x + w} ${y + r * 0.72}
          L ${x + w} ${y + h} Z`;
}

export function arch(x, y, w, h, cls = 'arch') {
  return `<path class="${cls}" d="${archPath(x, y, w, h)}" />`;
}

/** A lit window. `delay` staggers the flicker so a wall of them breathes. */
export function litWindow(x, y, w, h, delay = 0) {
  return `<path class="lit-window" style="animation-delay:${delay}s" d="${archPath(x, y, w, h)}" />`;
}

/** A row of arches — colonnade, window bank, or gallery. */
export function arcade(x, y, count, w, h, gap, kind = 'arch') {
  const draw = kind === 'lit' ? litWindow : arch;
  return Array.from({ length: count }, (_, i) =>
    kind === 'lit'
      ? draw(x + i * (w + gap), y, w, h, (i * 0.83) % 5)
      : draw(x + i * (w + gap), y, w, h)
  ).join('');
}

/** Carved pillar with capital and base. */
export function pillar(cx, top, bottom, w = 30) {
  const half = w / 2;
  return `<g class="stone">
    <rect x="${cx - half}" y="${top}" width="${w}" height="${bottom - top}" rx="4" />
    <rect x="${cx - half - 9}" y="${top - 14}" width="${w + 18}" height="16" rx="5" />
    <rect x="${cx - half - 11}" y="${bottom - 14}" width="${w + 22}" height="16" rx="5" />
  </g>`;
}

/** The little open pavilion that tops Rajput roofs. */
export function chhatri(cx, y, w, h) {
  const half = w / 2;
  return `<g class="stone">
    <rect x="${cx - half}" y="${y - 7}" width="${w}" height="8" rx="4" />
    <rect x="${cx - half + 5}" y="${y - h}" width="6" height="${h - 7}" />
    <rect x="${cx + half - 11}" y="${y - h}" width="6" height="${h - 7}" />
  </g>${dome(cx, y - h, w * 0.9, h * 0.7)}`;
}

/** Drifting dust and firefly motes — the ambient layer that keeps frames alive. */
export function motes(seed = 0, count = 18, area = { x: 0, y: 0, w: 1600, h: 900 }) {
  let n = seed * 9301 + 49297;
  const rand = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  return `<g class="motes">${Array.from({ length: count }, () => {
    const x = area.x + rand() * area.w;
    const y = area.y + rand() * area.h;
    const r = 2 + rand() * 2.6;
    const d = (rand() * 9).toFixed(2);
    const dur = (7 + rand() * 7).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" style="animation-delay:${d}s; animation-duration:${dur}s" />`;
  }).join('')}</g>`;
}

/** A soft cone of lamplight falling from a window or lamp. */
export function lightShaft(x, y, w, h, spread = 2.6) {
  const cx = x + w / 2;
  return `<path class="light-shaft" d="M ${x} ${y} L ${x + w} ${y}
    L ${cx + (w * spread) / 2} ${y + h} L ${cx - (w * spread) / 2} ${y + h} Z" />`;
}

/** Shared gradient and filter defs. Include once per stage. */
export function defs() {
  return `
<defs>
  <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#140a2c" />
    <stop offset="45%"  stop-color="#2a1550" />
    <stop offset="76%"  stop-color="#5d2a5c" />
    <stop offset="100%" stop-color="#8d4463" />
  </linearGradient>
  <radialGradient id="moonGlow">
    <stop offset="0%"   stop-color="rgba(255,226,167,0.45)" />
    <stop offset="100%" stop-color="rgba(255,226,167,0)" />
  </radialGradient>
  <radialGradient id="wordGlow">
    <stop offset="0%"   stop-color="rgba(255,222,150,0.85)" />
    <stop offset="52%"  stop-color="rgba(255,198,110,0.32)" />
    <stop offset="100%" stop-color="rgba(255,198,110,0)" />
  </radialGradient>
  <radialGradient id="lampGlow">
    <stop offset="0%"   stop-color="rgba(255,210,122,0.42)" />
    <stop offset="100%" stop-color="rgba(255,210,122,0)" />
  </radialGradient>
  <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(255,212,137,0.30)" />
    <stop offset="100%" stop-color="rgba(255,212,137,0)" />
  </linearGradient>
</defs>`;
}
