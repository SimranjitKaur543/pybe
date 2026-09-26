// Tara, Mithu, and the magical words.
//
// Drawn in a local space where Tara is 300 units tall, origin at the point
// between her feet, facing right. At the scales the story uses her that is
// ~30% of frame height, which is what lets the face and posture actually read.
//
// Structure matters as much as shape: limbs are separate groups that rotate
// about their joints, and every mood is drawn once and revealed by CSS, so a
// scene can change how she feels without redrawing her.

/* ------------------------------------------------------------------ Tara */

const H = 300;
const HEAD_Y = -246;
const HEAD_R = 46;
const SHOULDER_Y = -190;
const HIP_Y = -104;

/** One leg: thigh-to-shin as a single soft shape, plus a slipper. */
function leg(x, cls) {
  return `
  <g class="limb ${cls}">
    <path class="churidar" d="M ${x - 13} ${HIP_Y}
      C ${x - 15} ${HIP_Y + 46} ${x - 13} ${-40} ${x - 11} ${-12}
      L ${x + 11} ${-12}
      C ${x + 13} ${-40} ${x + 15} ${HIP_Y + 46} ${x + 13} ${HIP_Y} Z" />
    <path class="cuff" d="M ${x - 12} -26 L ${x + 12} -26 L ${x + 11} -14 L ${x - 11} -14 Z" />
    <ellipse class="slipper" cx="${x + 3}" cy="-5" rx="19" ry="9" />
  </g>`;
}

/** One arm from the shoulder, hand as a soft round cap. `held` rides in the
 *  hand, so a lantern or megaphone swings with the arm without extra rigging. */
function arm(x, cls, held = '') {
  return `
  <g class="limb ${cls}">
    <path class="sleeve" d="M ${x} ${SHOULDER_Y + 4}
      C ${x + 6} ${SHOULDER_Y + 40} ${x + 8} ${SHOULDER_Y + 66} ${x + 6} ${SHOULDER_Y + 86}
      L ${x - 14} ${SHOULDER_Y + 86}
      C ${x - 16} ${SHOULDER_Y + 62} ${x - 14} ${SHOULDER_Y + 36} ${x - 12} ${SHOULDER_Y + 4} Z" />
    <circle class="skin" cx="${x - 4}" cy="${SHOULDER_Y + 94}" r="12" />
    ${held}
  </g>`;
}

/** A small oil lantern, carried. Hidden until Tara is given it. */
function lanternProp(x, y) {
  return `
  <g class="prop prop-lantern" transform="translate(${x} ${y})">
    <path class="lan-hoop" d="M -16 -4 C -16 -30 16 -30 16 -4" />
    <rect class="lan-cap" x="-19" y="-6" width="38" height="10" rx="4" />
    <path class="lan-glass" d="M -17 4 L 17 4 L 13 44 L -13 44 Z" />
    <circle class="lan-halo" cx="0" cy="24" r="82" />
    <path class="lan-flame" d="M 0 10 C 9 22 7 36 0 36 C -7 36 -9 22 0 10 Z" />
    <rect class="lan-base" x="-16" y="42" width="32" height="9" rx="4" />
  </g>`;
}

/** A brass megaphone, raised to speak to the whole palace. */
function megaphoneProp(x, y) {
  return `
  <g class="prop prop-megaphone" transform="translate(${x} ${y})">
    <path class="meg-body" d="M -6 -14 L -6 14 L 42 34 L 42 -34 Z" />
    <ellipse class="meg-mouth" cx="42" cy="0" rx="9" ry="34" />
    <rect class="meg-grip" x="-20" y="-9" width="16" height="18" rx="6" />
  </g>`;
}

export function tara() {
  return `
<g class="tara pose-idle" data-mood="neutral">
  <ellipse class="shadow" cx="4" cy="2" rx="62" ry="12" />

  <!-- far side limbs sit behind the body -->
  ${leg(-17, 'leg-far')}
  ${arm(-46, 'arm-far')}

  <!-- braid falls behind the shoulder -->
  <g class="braid">
    <path class="hair" d="M -34 ${HEAD_Y + 6}
      C -66 ${HEAD_Y + 40} -64 ${HEAD_Y + 116} -46 ${HEAD_Y + 152}
      L -26 ${HEAD_Y + 146}
      C -44 ${HEAD_Y + 112} -46 ${HEAD_Y + 44} -18 ${HEAD_Y + 16} Z" />
    <circle class="ribbon" cx="-36" cy="${HEAD_Y + 150}" r="11" />
  </g>

  <!-- body -->
  <g class="body">
    <path class="kurta" d="M -32 ${SHOULDER_Y - 6}
      C -48 ${SHOULDER_Y + 22} -50 ${HIP_Y - 20} -54 ${HIP_Y + 16}
      L 54 ${HIP_Y + 16}
      C 50 ${HIP_Y - 20} 44 ${SHOULDER_Y + 22} 32 ${SHOULDER_Y - 6}
      C 18 ${SHOULDER_Y - 18} -18 ${SHOULDER_Y - 18} -32 ${SHOULDER_Y - 6} Z" />
    <path class="kurta-hem" d="M -54 ${HIP_Y + 4} L 54 ${HIP_Y + 4} L 54 ${HIP_Y + 16} L -54 ${HIP_Y + 16} Z" />
    <path class="dupatta" d="M -30 ${SHOULDER_Y - 2}
      C -6 ${SHOULDER_Y + 26} 22 ${SHOULDER_Y + 22} 34 ${SHOULDER_Y + 2}
      C 44 ${SHOULDER_Y + 54} 38 ${HIP_Y + 6} 26 ${HIP_Y + 30}
      L 8 ${HIP_Y + 24}
      C 22 ${HIP_Y - 6} 28 ${SHOULDER_Y + 58} 20 ${SHOULDER_Y + 34}
      C 4 ${SHOULDER_Y + 46} -18 ${SHOULDER_Y + 40} -30 ${SHOULDER_Y + 22} Z" />
  </g>

  <!-- near side limbs -->
  ${leg(17, 'leg-near')}
  ${arm(48, 'arm-near', lanternProp(40, SHOULDER_Y + 104) + megaphoneProp(40, SHOULDER_Y + 96))}

  <!-- head. The hair is a full disc sitting behind a slightly lower, slightly
       forward face disc: that leaves a clean hair rim over the crown. A single
       curved cap never reaches the top of the skull and leaves it bald. -->
  <g class="head">
    <circle class="hair" cx="-2" cy="${HEAD_Y - 6}" r="${HEAD_R + 5}" />
    <circle class="skin" cx="3" cy="${HEAD_Y + 4}" r="${HEAD_R}" />
    <path class="hair" d="M ${-HEAD_R + 2} ${HEAD_Y - 6}
      C ${-HEAD_R + 4} ${HEAD_Y - 34} ${HEAD_R - 6} ${HEAD_Y - 40} ${HEAD_R + 1} ${HEAD_Y - 12}
      C ${HEAD_R - 12} ${HEAD_Y - 26} 4 ${HEAD_Y - 30} -10 ${HEAD_Y - 16}
      C -22 ${HEAD_Y - 6} ${-HEAD_R + 6} ${HEAD_Y + 2} ${-HEAD_R + 2} ${HEAD_Y - 6} Z" />
    <circle class="flower" cx="34" cy="${HEAD_Y - 32}" r="9" />
    <circle class="flower-mid" cx="34" cy="${HEAD_Y - 32}" r="3.8" />

    <g class="face">
      <circle class="blush" cx="-20" cy="${HEAD_Y + 14}" r="10" />
      <circle class="blush" cx="30" cy="${HEAD_Y + 14}" r="10" />

      <g class="eyes">
        <g class="eye">
          <ellipse class="eye-white" cx="-6" cy="${HEAD_Y - 2}" rx="10" ry="12" />
          <circle class="pupil" cx="-4" cy="${HEAD_Y}" r="6" />
          <circle class="glint" cx="-7" cy="${HEAD_Y - 4}" r="2.6" />
        </g>
        <g class="eye">
          <ellipse class="eye-white" cx="22" cy="${HEAD_Y - 2}" rx="10" ry="12" />
          <circle class="pupil" cx="24" cy="${HEAD_Y}" r="6" />
          <circle class="glint" cx="21" cy="${HEAD_Y - 4}" r="2.6" />
        </g>
      </g>

      <!-- every mood is drawn; CSS reveals one -->
      <g class="brows">
        <g class="brow-set" data-for="neutral">
          <path d="M -16 ${HEAD_Y - 20} Q -6 ${HEAD_Y - 26} 4 ${HEAD_Y - 21}" />
          <path d="M 14 ${HEAD_Y - 21} Q 24 ${HEAD_Y - 26} 32 ${HEAD_Y - 20}" />
        </g>
        <g class="brow-set" data-for="curious">
          <path d="M -16 ${HEAD_Y - 22} Q -6 ${HEAD_Y - 30} 4 ${HEAD_Y - 24}" />
          <path d="M 14 ${HEAD_Y - 28} Q 24 ${HEAD_Y - 36} 32 ${HEAD_Y - 27}" />
        </g>
        <g class="brow-set" data-for="surprised">
          <path d="M -17 ${HEAD_Y - 29} Q -6 ${HEAD_Y - 38} 5 ${HEAD_Y - 30}" />
          <path d="M 13 ${HEAD_Y - 30} Q 24 ${HEAD_Y - 38} 33 ${HEAD_Y - 29}" />
        </g>
        <g class="brow-set" data-for="confused">
          <path d="M -16 ${HEAD_Y - 26} Q -6 ${HEAD_Y - 18} 4 ${HEAD_Y - 24}" />
          <path d="M 14 ${HEAD_Y - 30} Q 24 ${HEAD_Y - 37} 32 ${HEAD_Y - 28}" />
        </g>
        <g class="brow-set" data-for="happy">
          <path d="M -16 ${HEAD_Y - 24} Q -6 ${HEAD_Y - 31} 4 ${HEAD_Y - 25}" />
          <path d="M 14 ${HEAD_Y - 25} Q 24 ${HEAD_Y - 31} 32 ${HEAD_Y - 24}" />
        </g>
      </g>

      <g class="mouths">
        <path class="mouth-set" data-for="neutral"   d="M 2 ${HEAD_Y + 24} Q 10 ${HEAD_Y + 30} 18 ${HEAD_Y + 24}" />
        <path class="mouth-set" data-for="curious"   d="M 3 ${HEAD_Y + 23} Q 10 ${HEAD_Y + 31} 17 ${HEAD_Y + 23}" />
        <path class="mouth-set open" data-for="surprised" d="M 10 ${HEAD_Y + 27} m -8 0 a 8 9 0 1 0 16 0 a 8 9 0 1 0 -16 0" />
        <path class="mouth-set" data-for="confused" d="M 2 ${HEAD_Y + 28} Q 10 ${HEAD_Y + 22} 18 ${HEAD_Y + 27}" />
        <path class="mouth-set open" data-for="happy" d="M 0 ${HEAD_Y + 22} Q 10 ${HEAD_Y + 38} 20 ${HEAD_Y + 22} Z" />
      </g>
    </g>
  </g>

  <!-- Mithu rides on her shoulder -->
  <!-- positioning on the OUTER group: the hop animation below sets transform,
       and a CSS transform replaces the SVG attribute rather than composing. -->
  <g class="mithu-perch" transform="translate(46 ${SHOULDER_Y - 14}) scale(0.34)">
    <g class="mithu-hop">${mithu()}</g>
  </g>
</g>`;
}

/* ----------------------------------------------------------------- Mithu */

/** Drawn around his feet, ~150 units tall, facing right. */
export function mithu() {
  return `
<g class="mithu">
  <g class="mithu-tail">
    <path class="tail" d="M -26 -40 L -86 18 L -58 14 L -10 -22 Z" />
  </g>
  <g class="mithu-body">
    <ellipse class="body" cx="0" cy="-54" rx="40" ry="52" />
    <path class="belly" d="M 10 -96 C 34 -80 36 -34 12 -10 C 34 -30 42 -74 10 -96 Z" />
    <g class="mithu-head">
      <circle class="body" cx="14" cy="-112" r="31" />
      <path class="cheek" d="M 30 -104 a 12 10 0 1 0 0.1 0" />
      <path class="beak" d="M 40 -118 C 62 -114 62 -98 40 -96 C 46 -104 46 -110 40 -118 Z" />
      <path class="beak-lower" d="M 40 -100 C 52 -99 52 -94 42 -93 Z" />
      <g class="mithu-eye">
        <circle class="eye-white" cx="22" cy="-120" r="9" />
        <circle class="pupil" cx="24" cy="-119" r="5.2" />
        <circle class="glint" cx="21" cy="-122" r="2.2" />
      </g>
      <path class="crest" d="M 6 -140 C 2 -164 16 -172 24 -160 C 20 -152 14 -146 6 -140 Z" />
    </g>
    <g class="mithu-wing">
      <path class="wing" d="M -2 -84 C -34 -74 -36 -32 -6 -22 C -18 -46 -18 -66 -2 -84 Z" />
    </g>
  </g>
  <g class="mithu-feet">
    <path class="foot" d="M -6 -6 L -6 6 M -16 8 L 6 8" />
  </g>
</g>`;
}

/* ---------------------------------------------------------- magical word */

/**
 * A glowing spoken name. The text is the actual Python name, because the
 * whole lesson is about *where this exact name lives*.
 */
export function magicWord(text, { id = '' } = {}) {
  const w = Math.max(150, text.length * 26 + 70);
  const motes = [
    [-w * 0.34, -34, 0], [w * 0.28, -30, 0.9], [-w * 0.16, 32, 1.7],
    [w * 0.4, 22, 2.4], [0, -44, 1.2], [-w * 0.42, 18, 3.0]
  ];
  return `
<g class="word" ${id ? `data-word="${id}"` : ''}>
  <ellipse class="word-aura" cx="0" cy="0" rx="${w * 0.82}" ry="66" />
  <g class="word-motes">
    ${motes.map(([x, y, d]) => `<circle cx="${x}" cy="${y}" r="3.4" style="animation-delay:${d}s" />`).join('')}
  </g>
  <rect class="word-plate" x="${-w / 2}" y="-33" width="${w}" height="66" rx="33" />
  <text class="word-text" x="0" y="12" text-anchor="middle">${text}</text>
</g>`;
}
