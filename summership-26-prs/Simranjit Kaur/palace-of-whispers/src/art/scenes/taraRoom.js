// Tara's room — the interior seen through (and then from inside) her window.
//
// Drawn in its own space with the ORIGIN AT THE WINDOW CENTRE, because the room
// is mounted inside the window opening as a scaled portal. That is what lets
// the camera fly from the sky, through the glass, into the room without a cut.

import { litWindow, arch, motes } from '../parts.js';

export const ROOM = {
  floorY: 420,
  windowW: 380,
  windowH: 520,
  taraX: 60,
  // The far wall a spoken word cannot cross, and the door it never reaches.
  wallX: -1090,
  doorX: 390
};

export function taraRoom() {
  const { floorY } = ROOM;
  return `
<g class="room">
  <!-- back wall and floor -->
  <rect class="room-wall" x="-1180" y="-620" width="1700" height="${floorY + 620}" />
  <rect class="room-floor" x="-1180" y="${floorY}" width="1700" height="520" />
  <rect class="room-skirting" x="-1180" y="${floorY - 16}" width="1700" height="20" />

  <!-- wall niches -->
  <g class="room-niche">
    ${arch(-1020, 40, 130, 300, 'niche')}
    ${arch(-840, 40, 130, 300, 'niche')}
  </g>

  <!-- rug -->
  <ellipse class="rug" cx="-320" cy="${floorY + 150}" rx="520" ry="98" />
  <ellipse class="rug-in" cx="-320" cy="${floorY + 150}" rx="380" ry="66" />

  <!-- bed -->
  <g class="bed">
    <rect class="bed-frame" x="-1080" y="${floorY - 30}" width="520" height="150" rx="16" />
    <rect class="bed-sheet" x="-1060" y="${floorY - 64}" width="480" height="60" rx="26" />
    <rect class="bed-pillow" x="-1044" y="${floorY - 104}" width="160" height="70" rx="32" />
    <rect class="bed-post" x="-1090" y="${floorY - 250}" width="26" height="240" rx="12" />
    <circle class="bed-knob" cx="-1077" cy="${floorY - 258}" r="18" />
  </g>

  <!-- bookshelf and books -->
  <g class="shelf">
    <rect class="shelf-board" x="-560" y="${floorY - 216}" width="250" height="16" rx="6" />
    <rect class="book b1" x="-548" y="${floorY - 292}" width="34" height="78" rx="5" />
    <rect class="book b2" x="-508" y="${floorY - 278}" width="28" height="64" rx="5" />
    <rect class="book b3" x="-474" y="${floorY - 300}" width="36" height="86" rx="5" />
    <rect class="book b4" x="-432" y="${floorY - 268}" width="26" height="54" rx="5" />
    <rect class="book b5" x="-400" y="${floorY - 286}" width="32" height="72" rx="5" />
  </g>

  <!-- little table with the oil lamp -->
  <g class="lamp-table">
    <rect class="table-top" x="-320" y="${floorY - 130}" width="200" height="18" rx="8" />
    <rect class="table-leg" x="-296" y="${floorY - 112}" width="18" height="112" rx="7" />
    <rect class="table-leg" x="-164" y="${floorY - 112}" width="18" height="112" rx="7" />
    <g class="lamp">
      <circle class="lamp-halo" cx="-220" cy="${floorY - 196}" r="230" fill="url(#lampGlow)" />
      <path class="lamp-dish" d="M -272 ${floorY - 134} Q -220 ${floorY - 104} -168 ${floorY - 134}
        L -180 ${floorY - 158} L -260 ${floorY - 158} Z" />
      <g class="lamp-flame">
        <path class="flame-outer" d="M -220 ${floorY - 232} C -196 ${floorY - 198} -200 ${floorY - 158} -220 ${floorY - 158}
          C -240 ${floorY - 158} -244 ${floorY - 198} -220 ${floorY - 232} Z" />
        <path class="flame-inner" d="M -220 ${floorY - 206} C -210 ${floorY - 190} -212 ${floorY - 168} -220 ${floorY - 168}
          C -228 ${floorY - 168} -230 ${floorY - 190} -220 ${floorY - 206} Z" />
      </g>
    </g>
  </g>

  <!-- hanging lanterns -->
  <g class="hang-lantern l1">
    <line class="cord" x1="-700" y1="-620" x2="-700" y2="-300" />
    <path class="lantern-body" d="M -736 -300 L -664 -300 L -648 -236 L -700 -206 L -752 -236 Z" />
    <circle class="lantern-core" cx="-700" cy="-256" r="16" />
  </g>
  <g class="hang-lantern l2">
    <line class="cord" x1="-460" y1="-620" x2="-460" y2="-380" />
    <path class="lantern-body" d="M -490 -380 L -430 -380 L -418 -328 L -460 -302 L -502 -328 Z" />
    <circle class="lantern-core" cx="-460" cy="-344" r="13" />
  </g>

  <!-- the window we came through -->
  <g class="room-window">
    <path class="window-night" d="M -190 260 L -190 -110
      Q -190 -330 0 -390 Q 190 -330 190 -110 L 190 260 Z" />
    <g class="window-stars">
      <circle cx="-96" cy="-160" r="4" /><circle cx="40" cy="-250" r="3.2" />
      <circle cx="118" cy="-80" r="3.6" /><circle cx="-40" cy="-40" r="2.8" />
    </g>
    <circle class="window-moon" cx="106" cy="-200" r="42" />
    <rect class="window-sill" x="-232" y="252" width="464" height="26" rx="10" />
    <rect class="window-mullion" x="-8" y="-380" width="16" height="640" />
    <rect class="window-mullion" x="-190" y="-20" width="380" height="14" />
  </g>

  <!-- curtains, always breathing -->
  <g class="curtain curtain-left">
    <path d="M -400 -420 L -196 -420 C -214 -180 -206 60 -190 300 L -400 320 Z" />
  </g>
  <g class="curtain curtain-right">
    <path d="M 400 -420 L 196 -420 C 214 -180 206 60 190 300 L 400 320 Z" />
  </g>
  <g class="curtain-rod"><rect x="-420" y="-436" width="840" height="18" rx="9" /></g>

  <!-- The door: the way out that the word never manages to take.
       The leaf, its panels and the knob are wrapped in one group so they swing
       together on the hinge; door-void is the dark of the corridor behind,
       which is what actually reads as "open" once the leaf moves off it. -->
  <g class="room-door">
    <rect class="door-frame" x="264" y="-140" width="252" height="${floorY + 140}" rx="10" />
    <rect class="door-void"  x="280" y="-124" width="220" height="${floorY + 124}" rx="8" />
    <g class="door-swing">
      <rect class="door-leaf"  x="280" y="-124" width="220" height="${floorY + 124}" rx="8" />
      <rect class="door-panel" x="306" y="-92"  width="168" height="150" rx="6" />
      <rect class="door-panel" x="306" y="86"   width="168" height="190" rx="6" />
      <circle class="door-knob" cx="470" cy="200" r="13" />
    </g>
  </g>

  <!-- where a word strikes the far wall; positioned and triggered from a scene -->
  <g class="wall-ripple">
    <circle class="wr r1" r="30" /><circle class="wr r2" r="30" /><circle class="wr r3" r="30" />
  </g>

  <!-- dust in the lamplight -->
  ${motes(21, 8, { x: -900, y: -400, w: 1300, h: 800 })}
</g>`;
}
