// Pieces used by the error and the explanation.
//
// Nothing here is a console, an editor or a card. The code is written in the
// air with the same glow the magical words use, and the error arrives as
// cracked light and smoke rather than a stack trace.

import { mithu } from './cast.js';

/** Mithu on a perch, for the one scene where he does the teaching. */
export function perchedMithu() {
  return `
<g class="perch-stand">
  <rect class="perch-post" x="-9" y="-250" width="18" height="250" rx="9" />
  <rect class="perch-bar"  x="-92" y="-262" width="184" height="16" rx="8" />
  <ellipse class="perch-foot" cx="0" cy="4" rx="74" ry="17" />
  <g class="perch-bird" transform="translate(0 -262) scale(0.62)">
    ${mithu()}
  </g>
</g>`;
}

/**
 * The error: cracked letters and rising smoke.
 * Deliberately wordless apart from the name of the thing itself.
 */
export function errorSpell() {
  return `
<g class="error-spell">
  <g class="err-smoke">
    ${[[-300, 0, 0], [-120, -40, 0.5], [80, 20, 1.0], [260, -30, 1.5], [-40, 60, 0.8], [190, 70, 1.9]]
      .map(([x, y, d]) => `<ellipse cx="${x}" cy="${y}" rx="150" ry="70" style="animation-delay:${d}s" />`)
      .join('')}
  </g>
  <g class="err-shards">
    ${[[-380, -90], [-190, 110], [40, -130], [250, 90], [420, -60], [-60, 140]]
      .map(([x, y], i) => `<path d="M ${x} ${y} l 26 -46 l 20 52 z" style="animation-delay:${i * 0.14}s" />`)
      .join('')}
  </g>
  <text class="err-text" x="0" y="0" text-anchor="middle">UnboundLocalError</text>
  <path class="err-crack" d="M -430 46 L -300 20 L -170 58 L -30 14 L 110 56 L 250 18 L 430 50" />
</g>`;
}

/** The container the code is written into, plus the light that traces it. */
export function codeSpell() {
  return `
<g class="code-spell">
  <g class="cs-glow"><ellipse cx="0" cy="0" rx="700" ry="330" /></g>
  <g class="cs-lines"></g>
</g>`;
}

/**
 * Trails that show where a read goes: outward to the palace, or stopped dead
 * at the room's own boundary because the room already owns the name.
 */
export function readTrails() {
  return `
<g class="trails">
  <path class="read-out"   pathLength="100" d="M -360 -260 C 260 -780 1080 -1120 1800 -1160" />
  <path class="read-local" pathLength="100" d="M -360 -250 C -430 -300 -500 -320 -560 -308" />
  <path class="read-blocked" pathLength="100" d="M -360 -260 C -250 -300 -150 -330 -40 -344" />
  <g class="block-wall">
    <path class="bw-line" d="M 20 -520 L 20 -60" />
    <g class="bw-sparks">
      ${[-380, -280, -180].map((y, i) =>
        `<circle cx="20" cy="${y}" r="12" style="animation-delay:${i * 0.18}s" />`).join('')}
    </g>
  </g>
</g>`;
}
