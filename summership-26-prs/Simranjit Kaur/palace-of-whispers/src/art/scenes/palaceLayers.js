// The palace as nested architecture, and the four names for its layers.
//
// ── Accuracy notes, which drive the drawing ────────────────────────────────
//
// • These are NOT four permanent rings. They are rooms, and the highlight is a
//   glow over real architecture that is already there.
//
// • The Enclosing layer is CONDITIONAL. Its glow is drawn to spread *outward
//   from Tara's room*, so it reads as "this space counts because her room was
//   built inside it" — not as a ring that always exists. It is also the only
//   layer whose label carries a qualifier.
//
// • The reveal starts at the WORD in her room, never at Tara. Python scope
//   depends on where a name was written, not on who is standing near it, so
//   the light must come from the word's birthplace and travel outward.

import { ROOM } from './taraRoom.js';
import { COURT } from './courtyard.js';

const SHELL = { x0: -1560, x1: 3520, roofY: -1320, baseY: 1010 };

/** The kingdom beyond the palace: sky, stars, hills. Layer 4's subject. */
export function kingdom() {
  return `
<g class="kingdom">
  <rect class="kd-sky" x="-6000" y="-4200" width="16000" height="7600" />
  <g class="kd-stars is-still">
    ${[[-3200, -2600], [-2400, -1800], [-1000, -3000], [600, -2400], [2200, -2900],
       [4200, -2000], [5400, -2700], [-4200, -1400], [3400, -3300], [1400, -3400],
       [-2000, -3400], [4800, -1200]]
      .map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${18 + (i % 3) * 8}" style="animation-delay:${i * 0.5}s" />`)
      .join('')}
  </g>
  <circle class="kd-moon" cx="-2900" cy="-2500" r="210" />
  <path class="kd-hills" d="M -6000 1180 Q -3600 780 -1400 1120 Q 900 1420 3200 1060 Q 6200 700 10000 1160
    L 10000 3400 L -6000 3400 Z" />
  <path class="kd-hills far" d="M -6000 980 Q -3000 600 -600 940 Q 1800 1240 4400 860 Q 7400 520 10000 960
    L 10000 3400 L -6000 3400 Z" />
</g>`;
}

/** The palace shell that encloses both the room and the courtyard. Layer 3. */
export function palaceShell() {
  const { x0, x1, roofY, baseY } = SHELL;
  return `
<g class="shell">
  <path class="shell-roof" d="M ${x0 - 140} ${roofY + 250} L ${(x0 + x1) / 2} ${roofY - 210}
    L ${x1 + 140} ${roofY + 250} L ${x1 + 140} ${roofY + 330} L ${x0 - 140} ${roofY + 330} Z" />
  <rect class="shell-wall" x="${x0}" y="${roofY + 300}" width="220" height="${baseY - roofY - 300}" />
  <rect class="shell-wall" x="${x1 - 220}" y="${roofY + 300}" width="220" height="${baseY - roofY - 300}" />
  <rect class="shell-band" x="${x0 - 60}" y="${roofY + 300}" width="${x1 - x0 + 120}" height="46" />
  <rect class="shell-base" x="${x0 - 200}" y="${baseY}" width="${x1 - x0 + 400}" height="150" />
  <g class="shell-windows">
    ${[-1460, -1380, 3380, 3440].map((wx, i) =>
      `<rect class="shell-lit" x="${wx}" y="${roofY + 520 + (i % 2) * 190}" width="52" height="104" rx="24"
             style="animation-delay:${i * 0.9}s" />`).join('')}
  </g>
</g>`;
}

/**
 * The four highlight regions, each tracing real architecture.
 * Hidden until a scene lights them one at a time.
 */
export function layerGlows() {
  const r = { x0: -1200, x1: 540, y0: -640, y1: ROOM.floorY + 120 };
  const c = { x0: COURT.x0 - 20, x1: COURT.x1 + 20, y0: -800, y1: COURT.floorY + 200 };
  const s = { x0: SHELL.x0 - 80, x1: SHELL.x1 + 80, y0: SHELL.roofY - 160, y1: SHELL.baseY + 90 };

  return `
<g class="layer-glows">
  <!-- 1 · her room -->
  <g class="lg lg-local">
    <rect class="lg-fill"   x="${r.x0}" y="${r.y0}" width="${r.x1 - r.x0}" height="${r.y1 - r.y0}" rx="26" />
    <rect class="lg-stroke" x="${r.x0}" y="${r.y0}" width="${r.x1 - r.x0}" height="${r.y1 - r.y0}" rx="26" />
  </g>

  <!-- 2 · the courtyard. Drawn growing OUT of the room, because it only counts
          as an enclosing space by virtue of the room sitting inside it. -->
  <g class="lg lg-enclosing">
    <rect class="lg-fill"   x="${c.x0}" y="${c.y0}" width="${c.x1 - c.x0}" height="${c.y1 - c.y0}" rx="30" />
    <rect class="lg-stroke" x="${c.x0}" y="${c.y0}" width="${c.x1 - c.x0}" height="${c.y1 - c.y0}" rx="30" />
    <path class="lg-link" d="M ${r.x1} ${ROOM.floorY - 200} L ${c.x0} ${ROOM.floorY - 200}" />
  </g>

  <!-- 3 · the whole palace -->
  <g class="lg lg-global">
    <rect class="lg-fill"   x="${s.x0}" y="${s.y0}" width="${s.x1 - s.x0}" height="${s.y1 - s.y0}" rx="46" />
    <rect class="lg-stroke" x="${s.x0}" y="${s.y0}" width="${s.x1 - s.x0}" height="${s.y1 - s.y0}" rx="46" />
  </g>

  <!-- 4 · everything beyond it -->
  <g class="lg lg-builtin">
    <rect class="lg-stroke outer" x="${s.x0 - 900}" y="${s.y0 - 820}"
          width="${s.x1 - s.x0 + 1800}" height="${s.y1 - s.y0 + 1700}" rx="120" />
  </g>
</g>`;
}

/**
 * A name the palace reveals. Gathers out of particles; no card, no definition.
 * `note` is used once, for the qualifier Enclosing needs to stay truthful.
 */
export function magicLabel(id, text, x, y, note = '') {
  const motes = [[-150, -30, 0], [140, -44, 0.6], [-60, 46, 1.2], [110, 40, 1.8], [10, -62, 0.9]];
  return `
<g class="mlabel mlabel-${id}" transform="translate(${x} ${y})">
  <g class="ml-motes">
    ${motes.map(([mx, my, d]) =>
      `<circle r="7" style="--mx:${mx}px; --my:${my}px; animation-delay:${d}s" />`).join('')}
  </g>
  <path class="ml-rule" d="M -172 52 Q 0 74 172 52" />
  <text class="ml-text" x="0" y="0" text-anchor="middle">${text}</text>
  ${note ? `<text class="ml-note" x="0" y="112" text-anchor="middle">${note}</text>` : ''}
</g>`;
}
