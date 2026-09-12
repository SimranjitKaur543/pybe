// The courtyard — the open space beyond Tara's door.
//
// Drawn in ROOM-SPACE, on the same floor line as her room and immediately to
// the right of it, so she can simply walk out. Nothing is re-parented and no
// coordinate system changes: that is what keeps the move continuous.

import { arch, archPath, arcade, pillar, chhatri, motes, lightShaft } from '../parts.js';
import { ROOM } from './taraRoom.js';

export const COURT = {
  x0: 560,
  x1: 3180,
  floorY: ROOM.floorY,
  centreX: 1840,
  askX: 1760        // where Tara stands to ask
};

/** One tier of falling water, animated by CSS. */
function fountain(cx, baseY) {
  return `
<g class="fountain">
  <ellipse class="water-pool" cx="${cx}" cy="${baseY}" rx="260" ry="66" />
  <path class="basin" d="M ${cx - 270} ${baseY - 6} Q ${cx} ${baseY + 74} ${cx + 270} ${baseY - 6}
    L ${cx + 250} ${baseY - 40} L ${cx - 250} ${baseY - 40} Z" />
  <rect class="basin" x="${cx - 34}" y="${baseY - 210}" width="68" height="175" rx="16" />
  <ellipse class="basin-top" cx="${cx}" cy="${baseY - 212}" rx="132" ry="32" />
  <ellipse class="water-top" cx="${cx}" cy="${baseY - 216}" rx="112" ry="24" />
  <g class="jets">
    ${[-86, -44, 0, 44, 86].map((dx, i) => `
      <path class="jet" style="animation-delay:${(i * 0.23).toFixed(2)}s"
        d="M ${cx + dx} ${baseY - 226} Q ${cx + dx * 1.5} ${baseY - 150} ${cx + dx * 1.9} ${baseY - 46}" />`).join('')}
  </g>
  <g class="ripples">
    <ellipse class="rp r1" cx="${cx}" cy="${baseY + 6}" rx="60" ry="16" />
    <ellipse class="rp r2" cx="${cx}" cy="${baseY + 6}" rx="60" ry="16" />
    <ellipse class="rp r3" cx="${cx}" cy="${baseY + 6}" rx="60" ry="16" />
  </g>
</g>`;
}

/** A potted plant with leaves that sway. */
function plant(x, baseY, s = 1) {
  return `
<g class="plant" transform="translate(${x} ${baseY}) scale(${s})">
  <path class="pot" d="M -52 0 L 52 0 L 38 92 L -38 92 Z" />
  <rect class="pot-rim" x="-60" y="-16" width="120" height="22" rx="9" />
  <g class="fronds">
    <path class="frond" d="M 0 -10 C -70 -40 -96 -120 -58 -176 C -30 -126 -14 -64 0 -10 Z" />
    <path class="frond" d="M 0 -10 C 64 -46 92 -126 52 -180 C 26 -126 12 -62 0 -10 Z" />
    <path class="frond" d="M 0 -10 C -26 -86 -8 -166 20 -200 C 24 -136 12 -66 0 -10 Z" />
  </g>
</g>`;
}

/** Hanging lantern on a chain. */
function lantern(x, topY, dropY, delay = 0) {
  return `
<g class="court-lantern" style="animation-delay:${delay}s">
  <line class="chain" x1="${x}" y1="${topY}" x2="${x}" y2="${dropY}" />
  <path class="lantern-shell" d="M ${x - 40} ${dropY} L ${x + 40} ${dropY}
    L ${x + 26} ${dropY + 84} L ${x - 26} ${dropY + 84} Z" />
  <rect class="lantern-cap" x="${x - 46}" y="${dropY - 14}" width="92" height="18" rx="7" />
  <circle class="lantern-glow" cx="${x}" cy="${dropY + 40}" r="26" />
</g>`;
}

export function courtyard() {
  const { x0, x1, floorY, centreX } = COURT;
  const backTop = -760;

  return `
<g class="courtyard">
  <!-- open sky above the courtyard -->
  <rect class="court-sky" x="${x0}" y="-1180" width="${x1 - x0}" height="${-backTop + 1180 - 0}" />
  <g class="court-stars">
    ${[[820, -1040], [1180, -930], [1520, -1090], [1980, -960], [2420, -1050], [2760, -900],
       [1340, -1150], [2180, -1130], [2960, -1000]]
      .map(([x, y], i) => `<circle class="${i % 3 ? 'still' : ''}" cx="${x}" cy="${y}" r="${i % 2 ? 6 : 8}" style="animation-delay:${i * 0.7}s" />`)
      .join('')}
  </g>
  <circle class="court-moon" cx="2560" cy="-1010" r="96" />

  <!-- back wall, gallery and arcade -->
  <rect class="court-wall" x="${x0}" y="${backTop}" width="${x1 - x0}" height="${floorY - backTop}" />
  <rect class="court-band" x="${x0}" y="${backTop}" width="${x1 - x0}" height="34" />

  <!-- upper balconies -->
  <g class="balconies">
    ${[900, 1500, 2100, 2700].map((bx, i) => `
      <g class="balcony">
        <rect class="balcony-floor" x="${bx - 130}" y="${backTop + 300}" width="260" height="26" rx="8" />
        <rect class="balcony-rail"  x="${bx - 124}" y="${backTop + 236}" width="248" height="16" rx="7" />
        ${[0, 1, 2, 3, 4].map((j) => `<rect class="baluster" x="${bx - 112 + j * 54}" y="${backTop + 250}" width="13" height="52" rx="5" />`).join('')}
        <path class="balcony-arch" d="${archPath(bx - 96, backTop + 60, 192, 178)}" />
        <g class="court-curtain" style="animation-delay:${i * 0.8}s">
          <path d="M ${bx - 92} ${backTop + 64} L ${bx - 30} ${backTop + 64} C ${bx - 38} ${backTop + 140} ${bx - 34} ${backTop + 200} ${bx - 26} ${backTop + 236} L ${bx - 92} ${backTop + 238} Z" />
        </g>
      </g>`).join('')}
  </g>

  <!-- ground-level arcade -->
  <g class="court-arcade">
    ${[760, 1180, 2500, 2920].map((ax) => `
      <path class="court-niche" d="${archPath(ax - 110, floorY - 430, 220, 430)}" />`).join('')}
    ${pillar(970, floorY - 470, floorY, 46)}
    ${pillar(2710, floorY - 470, floorY, 46)}
  </g>

  <!-- moonlight falling into the open court -->
  ${lightShaft(1420, backTop + 40, 300, floorY - backTop - 40, 1.9)}
  ${lightShaft(2260, backTop + 40, 240, floorY - backTop - 40, 1.7)}

  <!-- lanterns -->
  ${lantern(1300, backTop + 40, -190, 0)}
  ${lantern(2380, backTop + 40, -250, 1.1)}
  ${lantern(1820, backTop + 40, -330, 0.55)}

  <!-- floor -->
  <rect class="court-floor" x="${x0}" y="${floorY}" width="${x1 - x0}" height="560" />
  <g class="court-tiles">
    ${Array.from({ length: 13 }, (_, i) => `<rect x="${x0 + i * 200}" y="${floorY}" width="5" height="560" />`).join('')}
    ${Array.from({ length: 4 }, (_, i) => `<rect x="${x0}" y="${floorY + 90 + i * 120}" width="${x1 - x0}" height="5" />`).join('')}
  </g>
  <rect class="court-step" x="${x0}" y="${floorY - 14}" width="${x1 - x0}" height="18" rx="6" />

  ${fountain(centreX, floorY - 30)}

  ${plant(760, floorY, 1)}
  ${plant(2980, floorY, 1.1)}
  ${plant(1140, floorY, 0.78)}
  ${plant(2620, floorY, 0.86)}

  ${motes(41, 12, { x: x0, y: -760, w: x1 - x0, h: 1200 })}
</g>`;
}

/**
 * The prompt that appears in the air — the story's only interactive moment.
 * Deliberately shaped like something the palace offers, not a UI button.
 */
export function askPrompt() {
  return `
<g class="ask-prompt" role="button" tabindex="0" aria-label="Ask for the secret">
  <ellipse class="ask-aura" cx="0" cy="0" rx="330" ry="120" />
  <rect class="ask-hit" x="-360" y="-130" width="720" height="260" rx="130" />
  <g class="ask-motes">
    ${[[-210, -46, 0], [190, -62, 0.8], [-120, 58, 1.6], [240, 40, 2.2], [40, -86, 1.2], [-260, 18, 2.8]]
      .map(([x, y, d]) => `<circle cx="${x}" cy="${y}" r="5" style="animation-delay:${d}s" />`).join('')}
  </g>
  <path class="ask-underline" d="M -196 46 Q 0 74 196 46" />
  <text class="ask-text" x="0" y="12" text-anchor="middle">Ask for the secret</text>
</g>`;
}

/** Her spoken question, as a glow rather than a speech bubble. */
export function askSpeech() {
  return `
<g class="ask-speech">
  <ellipse class="speech-aura" cx="0" cy="0" rx="420" ry="118" />
  <text class="speech-text" x="0" y="10" text-anchor="middle">Where is my secret?</text>
</g>`;
}

/** Question marks that rise, find nothing, and dissolve. */
export function questionMotes() {
  const spots = [[-230, 30, 0], [-90, -40, 0.35], [70, 10, 0.7], [220, -30, 1.05], [-10, 70, 1.4], [160, 80, 1.75]];
  return `
<g class="q-motes">
  ${spots.map(([x, y, d]) => `
    <text class="q" x="${x}" y="${y}" text-anchor="middle" style="animation-delay:${d}s">?</text>`).join('')}
</g>`;
}
