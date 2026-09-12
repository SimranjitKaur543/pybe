// The palace at night — the exterior half of the world.
//
// World coordinates, all present at once: sky at the top, palace on the ground
// at y=900, and Tara's window at (HERO.x, HERO.y) with her room mounted inside
// it as a scaled portal. The camera travels across this; nothing is swapped.

import { dome, chhatri, litWindow, arcade, pillar, motes } from '../parts.js';
import { taraRoom } from './taraRoom.js';
import { courtyard, askPrompt, askSpeech, questionMotes } from './courtyard.js';
import { kingdom, palaceShell, layerGlows, magicLabel } from './palaceLayers.js';
import { perchedMithu, errorSpell, readTrails } from '../lessonBits.js';

export const HERO = { x: 1600, y: 300, w: 380, h: 520, scale: 0.225 };
export const GROUND_Y = 980;

const STARS = (() => {
  let n = 12345;
  const rand = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: 44 }, () => ({
    x: -1400 + rand() * 5000,
    y: -1500 + rand() * 1900,
    r: 1.6 + rand() * 3.4,
    d: (rand() * 6).toFixed(2),
    layer: rand() < 0.4 ? 'far' : 'near'
  }));
})();

function cloud(x, y, s, delay, dur) {
  return `<g class="cloud" style="animation-delay:${delay}s; animation-duration:${dur}s"
     transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="0" rx="200" ry="40" />
    <ellipse cx="-110" cy="14" rx="120" ry="30" />
    <ellipse cx="116" cy="16" rx="140" ry="34" />
    <ellipse cx="20" cy="-24" rx="96" ry="32" />
  </g>`;
}

function flag(x, y, h, delay) {
  return `<g class="flagpole-g">
    <rect class="flagpole" x="${x - 3}" y="${y - h}" width="6" height="${h + 26}" rx="3" />
    <circle class="flagpole" cx="${x}" cy="${y - h - 5}" r="6" />
    <path class="pennant" style="animation-delay:${delay}s"
      d="M ${x + 3} ${y - h + 2} L ${x + 44} ${y - h + 14} L ${x + 3} ${y - h + 26} Z" />
  </g>`;
}

export function palaceNight() {
  return `
<g class="sky-group">
  <rect x="-2600" y="-1900" width="8000" height="3400" fill="url(#nightSky)" />
  <circle cx="620" cy="-960" r="430" fill="url(#moonGlow)" />
  <circle class="moon" cx="620" cy="-960" r="104" />
  <circle class="moon-crater" cx="586" cy="-990" r="18" />
  <circle class="moon-crater" cx="650" cy="-930" r="12" />
  <circle class="moon-crater" cx="638" cy="-1004" r="9" />

  <g class="stars far">
    ${STARS.filter((s) => s.layer === 'far')
      .map((s, i) => `<circle class="${i % 2 ? 'still' : ''}" cx="${s.x}" cy="${s.y}" r="${s.r * 0.7}" style="animation-delay:${s.d}s" />`)
      .join('')}
  </g>
  <g class="stars near">
    ${STARS.filter((s) => s.layer === 'near')
      .map((s, i) => `<circle class="${i % 2 ? 'still' : ''}" cx="${s.x}" cy="${s.y}" r="${s.r}" style="animation-delay:${s.d}s" />`)
      .join('')}
  </g>

  <g class="clouds">
    ${cloud(-900, -1180, 1.1, 0, 96)}
    ${cloud(-1700, -760, 0.8, 16, 122)}
    ${cloud(-500, -420, 1.35, 40, 148)}
    ${cloud(-2100, -1420, 0.9, 62, 134)}
  </g>
</g>

<!-- distant ridges -->
<g class="ridge far-ridge">
  <path d="M -2600 780 Q -1400 600 -400 760 Q 600 900 1600 720 Q 2700 540 4000 760 L 4000 1500 L -2600 1500 Z" />
</g>
<g class="ridge near-ridge">
  <path d="M -2600 900 Q -1200 800 -200 900 Q 900 1000 2000 880 Q 3100 780 4000 900 L 4000 1500 L -2600 1500 Z" />
</g>

<!-- the palace -->
<g class="palace">
  <!-- outer wings -->
  <rect class="stone" x="880" y="700" width="200" height="${GROUND_Y - 700}" rx="6" />
  ${chhatri(980, 700, 74, 58)}
  <rect class="stone" x="2120" y="700" width="200" height="${GROUND_Y - 700}" rx="6" />
  ${chhatri(2220, 700, 74, 58)}
  ${arcade(906, 800, 2, 56, 150, 44, 'lit')}
  ${arcade(2146, 800, 2, 56, 150, 44, 'lit')}

  <!-- flanking towers -->
  <rect class="stone" x="1120" y="420" width="112" height="${GROUND_Y - 420}" rx="6" />
  ${dome(1176, 420, 132, 108)}
  <rect class="stone" x="1968" y="420" width="112" height="${GROUND_Y - 420}" rx="6" />
  ${dome(2024, 420, 132, 108)}
  ${flag(1176, 306, 62, 0)}
  ${flag(2024, 306, 62, 1.3)}

  <!-- great hall -->
  <rect class="stone" x="1220" y="520" width="760" height="${GROUND_Y - 520}" rx="8" />
  <rect class="stone-band" x="1258" y="486" width="684" height="42" rx="14" />
  ${dome(1600, 486, 330, 260)}
  ${flag(1600, 180, 74, 0.7)}
  ${chhatri(1320, 486, 66, 54)}
  ${chhatri(1880, 486, 66, 54)}
  ${pillar(1300, 640, GROUND_Y)}
  ${pillar(1900, 640, GROUND_Y)}

  <!-- ordinary lit windows, staggered so the palace breathes -->
  ${arcade(1254, 700, 2, 58, 160, 52, 'lit')}
  ${arcade(1830, 700, 2, 58, 160, 52, 'lit')}
  ${litWindow(1148, 560, 48, 120, 2.1)}
  ${litWindow(1996, 560, 48, 120, 0.8)}
  ${litWindow(1560, 180, 74, 130, 1.6)}

  <!-- plinth -->
  <rect class="plinth" x="820" y="${GROUND_Y - 28}" width="1560" height="40" rx="8" />
</g>

<rect class="ground" x="-2600" y="${GROUND_Y}" width="8000" height="900" />

<!-- ─────────── Tara's window: the way in ─────────── -->
<g class="hero-window">
  <!-- warm light spilling out before we can see inside -->
  <ellipse class="hero-glow" cx="${HERO.x}" cy="${HERO.y}" rx="520" ry="560" />

  <!-- the room, mounted inside the opening and clipped to it -->
  <g class="portal" clip-path="url(#heroClip)">
    <g transform="translate(${HERO.x} ${HERO.y}) scale(${HERO.scale})">
      <!-- Behind everything, and only shown once the camera clears the roof. -->
      <g class="outer-world">
        ${kingdom()}
        ${palaceShell()}
      </g>
      ${courtyard()}
      ${taraRoom()}
      <g class="tara-slot"></g>
      ${layerGlows()}
      <g class="magic-labels">
        ${magicLabel('local',     'Local',     -330, -900)}
        ${magicLabel('enclosing', 'Enclosing', 1870, -1120, 'because her room sits inside it')}
        ${magicLabel('global',    'Global',    980,  -1760)}
        ${magicLabel('builtin',   'Built-in',  980,  -2520)}
      </g>
      ${readTrails()}
      ${perchedMithu()}
      ${errorSpell()}
      <g class="shadow-tag">
        ${magicLabel('shadow', 'shadowing', -300, -900)}
      </g>

      <!-- magic that travels between spaces -->
      <g class="reach">
        <!-- global: from her room out to the palace-level name -->
        <path class="global-beam" d="M -380 -300 C 300 -900 1100 -1180 1820 -1180" />
        <!-- nonlocal: only as far as the immediately surrounding space -->
        <path class="nonlocal-link" d="M -380 -160 C 100 -420 500 -520 940 -520" />
        <text class="nonlocal-tag" x="940" y="-566" text-anchor="middle">nonlocal</text>
      </g>

      <!-- last, so the one clickable thing in the story is never covered -->
      <g class="court-ui">
        ${askPrompt()}
        ${askSpeech()}
        ${questionMotes()}
      </g>
    </g>
  </g>

  <!-- frame and shutters sit over the opening -->
  <g class="hero-frame">
    <path class="frame-stone" d="M ${HERO.x - HERO.w / 2 - 26} ${HERO.y + HERO.h / 2 + 20}
      L ${HERO.x - HERO.w / 2 - 26} ${HERO.y - 70}
      Q ${HERO.x - HERO.w / 2 - 26} ${HERO.y - HERO.h / 2 - 60} ${HERO.x} ${HERO.y - HERO.h / 2 - 86}
      Q ${HERO.x + HERO.w / 2 + 26} ${HERO.y - HERO.h / 2 - 60} ${HERO.x + HERO.w / 2 + 26} ${HERO.y - 70}
      L ${HERO.x + HERO.w / 2 + 26} ${HERO.y + HERO.h / 2 + 20}
      L ${HERO.x + HERO.w / 2} ${HERO.y + HERO.h / 2 + 20}
      L ${HERO.x + HERO.w / 2} ${HERO.y - 70}
      Q ${HERO.x + HERO.w / 2} ${HERO.y - HERO.h / 2 - 20} ${HERO.x} ${HERO.y - HERO.h / 2 - 44}
      Q ${HERO.x - HERO.w / 2} ${HERO.y - HERO.h / 2 - 20} ${HERO.x - HERO.w / 2} ${HERO.y - 70}
      L ${HERO.x - HERO.w / 2} ${HERO.y + HERO.h / 2 + 20} Z" />
    <rect class="frame-sill" x="${HERO.x - HERO.w / 2 - 44}" y="${HERO.y + HERO.h / 2 + 12}"
          width="${HERO.w + 88}" height="30" rx="12" />
  </g>

  <g class="shutter shutter-l">
    <rect x="${HERO.x - HERO.w / 2}" y="${HERO.y - HERO.h / 2 - 30}"
          width="${HERO.w / 2}" height="${HERO.h + 50}" rx="6" />
    <rect class="shutter-slat" x="${HERO.x - HERO.w / 2 + 16}" y="${HERO.y - 130}" width="${HERO.w / 2 - 32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${HERO.x - HERO.w / 2 + 16}" y="${HERO.y - 60}" width="${HERO.w / 2 - 32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${HERO.x - HERO.w / 2 + 16}" y="${HERO.y + 10}" width="${HERO.w / 2 - 32}" height="10" rx="5" />
  </g>
  <g class="shutter shutter-r">
    <rect x="${HERO.x}" y="${HERO.y - HERO.h / 2 - 30}"
          width="${HERO.w / 2}" height="${HERO.h + 50}" rx="6" />
    <rect class="shutter-slat" x="${HERO.x + 16}" y="${HERO.y - 130}" width="${HERO.w / 2 - 32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${HERO.x + 16}" y="${HERO.y - 60}" width="${HERO.w / 2 - 32}" height="10" rx="5" />
    <rect class="shutter-slat" x="${HERO.x + 16}" y="${HERO.y + 10}" width="${HERO.w / 2 - 32}" height="10" rx="5" />
  </g>
</g>

${motes(3, 14, { x: 700, y: 200, w: 1800, h: 800 })}`;
}

/** Clip that keeps the room inside the window until we fly through it. */
export function heroClipDef() {
  return `<clipPath id="heroClip">
    <path d="M ${HERO.x - HERO.w / 2} ${HERO.y + HERO.h / 2 + 20}
      L ${HERO.x - HERO.w / 2} ${HERO.y - 70}
      Q ${HERO.x - HERO.w / 2} ${HERO.y - HERO.h / 2 - 20} ${HERO.x} ${HERO.y - HERO.h / 2 - 44}
      Q ${HERO.x + HERO.w / 2} ${HERO.y - HERO.h / 2 - 20} ${HERO.x + HERO.w / 2} ${HERO.y - 70}
      L ${HERO.x + HERO.w / 2} ${HERO.y + HERO.h / 2 + 20} Z" />
  </clipPath>`;
}
