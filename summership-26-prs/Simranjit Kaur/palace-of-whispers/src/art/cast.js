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

// Tara, matched to the reference art: a magenta kurta over an orange
// under-top, gold at the hem, waist and jewellery, and two plaits falling
// forward over her shoulders.
//
// Proportions follow the reference too. She was a 46-unit head on a 300-unit
// body — 31%, which is toddler proportion and no amount of facial detail talks
// you out of it. She is now 38 units, about a quarter of her height: still
// frankly storybook, but a child rather than an infant.
const H = 300;
const HEAD_R = 38;
const HEAD_Y = -258;
const CHIN_Y = HEAD_Y + HEAD_R;
const SHOULDER_Y = -204;
const HIP_Y = -112;

/** One leg. The skirt covers the thigh, so this is shin, ankle and slipper. */
function leg(x, cls) {
  return `
  <g class="limb ${cls}">
    <path class="churidar" d="M ${x - 8} ${HIP_Y + 54}
      C ${x - 9} -52 ${x - 8} -30 ${x - 7} -13
      L ${x + 7} -13
      C ${x + 8} -30 ${x + 9} -52 ${x + 8} ${HIP_Y + 54} Z" />
    <path class="slipper" d="M ${x - 12} -2
      C ${x - 14} -13 ${x - 6} -16 ${x + 3} -15
      C ${x + 13} -14 ${x + 19} -10 ${x + 17} -2
      C ${x + 15} 1 ${x - 10} 1 ${x - 12} -2 Z" />
    <ellipse class="slipper-strap" cx="${x + 2}" cy="-12" rx="8" ry="3" />
  </g>`;
}

/** One arm: an orange sleeve to the wrist, a gold bangle, then the hand. */
function arm(x, cls, held = '') {
  const L = 80;
  return `
  <g class="limb ${cls}">
    <path class="sleeve" d="M ${x} ${SHOULDER_Y + 2}
      C ${x + 7} ${SHOULDER_Y + 30} ${x + 8} ${SHOULDER_Y + 52} ${x + 6} ${SHOULDER_Y + L - 12}
      L ${x - 12} ${SHOULDER_Y + L - 12}
      C ${x - 14} ${SHOULDER_Y + 50} ${x - 12} ${SHOULDER_Y + 28} ${x - 10} ${SHOULDER_Y + 2} Z" />
    <rect class="bangle" x="${x - 13}" y="${SHOULDER_Y + L - 14}" width="19" height="7" rx="3" />
    <circle class="skin" cx="${x - 3}" cy="${SHOULDER_Y + L + 1}" r="9.5" />
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
  <ellipse class="shadow" cx="4" cy="2" rx="54" ry="10" />

  <!-- The far ARM sits behind the body. The far LEG does not: the skirt now
       ends above the knee, so a leg drawn behind it is hidden completely and
       she stands on one visible shin. -->
  ${arm(-44, 'arm-far')}

  <!-- neck -->
  <path class="skin neck" d="M -10 ${SHOULDER_Y + 6} L 15 ${SHOULDER_Y + 6}
    L 13 ${CHIN_Y - 6} L -8 ${CHIN_Y - 6} Z" />

  <!-- body: a sleeveless magenta kurta over the orange under-top, flaring into
       a skirt with a gold hem. The reference reads as three bands of colour
       top to bottom, and that banding is most of what makes it legible at the
       size she is usually on screen. -->
  <g class="body">
    <path class="kurta" d="M -26 ${SHOULDER_Y - 2}
      C -38 ${SHOULDER_Y + 26} -40 ${HIP_Y - 40} -42 ${HIP_Y - 6}
      L 42 ${HIP_Y - 6}
      C 40 ${HIP_Y - 40} 38 ${SHOULDER_Y + 26} 26 ${SHOULDER_Y - 2}
      C 14 ${SHOULDER_Y - 14} -14 ${SHOULDER_Y - 14} -26 ${SHOULDER_Y - 2} Z" />

    <!-- the V of the neckline, with a gold chain sitting in it -->
    <path class="kurta-vee" d="M -13 ${SHOULDER_Y - 8}
      C -7 ${SHOULDER_Y + 16} 9 ${SHOULDER_Y + 16} 15 ${SHOULDER_Y - 8}" />
    <path class="necklace" d="M -16 ${SHOULDER_Y + 2} C -8 ${SHOULDER_Y + 24} 10 ${SHOULDER_Y + 24} 18 ${SHOULDER_Y + 2}" />
    <circle class="pendant" cx="1" cy="${SHOULDER_Y + 26}" r="4.2" />

    <!-- gold waist band -->
    <path class="sash" d="M -42 ${HIP_Y - 8} L 42 ${HIP_Y - 8} L 42 ${HIP_Y + 8} L -42 ${HIP_Y + 8} Z" />

    <!-- the skirt, flared, with the gold hem the reference gives it -->
    <path class="skirt" d="M -42 ${HIP_Y + 6}
      C -50 ${HIP_Y + 26} -55 ${HIP_Y + 44} -57 ${HIP_Y + 58}
      C -28 ${HIP_Y + 70} 30 ${HIP_Y + 70} 57 ${HIP_Y + 58}
      C 55 ${HIP_Y + 44} 50 ${HIP_Y + 26} 42 ${HIP_Y + 6} Z" />
    <path class="skirt-pleat" d="M -20 ${HIP_Y + 12} L -25 ${HIP_Y + 60}" />
    <path class="skirt-pleat" d="M 2 ${HIP_Y + 12} L 2 ${HIP_Y + 64}" />
    <path class="skirt-pleat" d="M 24 ${HIP_Y + 12} L 29 ${HIP_Y + 60}" />
    <path class="kurta-hem" d="M -57 ${HIP_Y + 58}
      C -28 ${HIP_Y + 70} 30 ${HIP_Y + 70} 57 ${HIP_Y + 58}
      C 57 ${HIP_Y + 72} 57 ${HIP_Y + 72} 57 ${HIP_Y + 72}
      C 30 ${HIP_Y + 84} -28 ${HIP_Y + 84} -57 ${HIP_Y + 72} Z" />
  </g>

  <!-- near side limbs -->
  ${leg(-17, 'leg-far')}
  ${leg(15, 'leg-near')}
  ${arm(46, 'arm-near', lanternProp(36, SHOULDER_Y + 88) + megaphoneProp(36, SHOULDER_Y + 80))}

  <!-- Both plaits, falling FORWARD over her shoulders as in the reference.
       Drawn after the body so they lie on top of it, and inside one .braid
       group so the existing sway and bounce animations move them together. -->
  <g class="braid">
    <path class="hair" d="M -30 ${HEAD_Y + 18}
      C -44 ${HEAD_Y + 40} -46 ${HEAD_Y + 74} -40 ${HEAD_Y + 104}
      L -22 ${HEAD_Y + 100}
      C -28 ${HEAD_Y + 72} -26 ${HEAD_Y + 44} -16 ${HEAD_Y + 26} Z" />
    <circle class="ribbon" cx="-31" cy="${HEAD_Y + 106}" r="6.5" />
    <path class="hair" d="M 32 ${HEAD_Y + 18}
      C 46 ${HEAD_Y + 40} 48 ${HEAD_Y + 74} 42 ${HEAD_Y + 104}
      L 24 ${HEAD_Y + 100}
      C 30 ${HEAD_Y + 72} 28 ${HEAD_Y + 44} 18 ${HEAD_Y + 26} Z" />
    <circle class="ribbon" cx="33" cy="${HEAD_Y + 106}" r="6.5" />
  </g>

  <!-- Head. The hair is a rounded mass with a centre parting, not a disc a few
       units larger than the face — that only ever shows as a thin rim and
       reads as a swimming cap. -->
  <g class="head">
    <path class="hair" d="M -40 ${HEAD_Y + 6}
      C -44 ${HEAD_Y - 34} -20 ${HEAD_Y - 54} 2 ${HEAD_Y - 54}
      C 26 ${HEAD_Y - 54} 46 ${HEAD_Y - 32} 44 ${HEAD_Y + 8}
      C 43 ${HEAD_Y + 26} 40 ${HEAD_Y + 36} 34 ${HEAD_Y + 46}
      L -30 ${HEAD_Y + 46}
      C -37 ${HEAD_Y + 34} -40 ${HEAD_Y + 22} -40 ${HEAD_Y + 6} Z" />

    <!-- ears, with the gold drops the reference hangs from them -->
    <ellipse class="skin ear" cx="-37" cy="${HEAD_Y + 6}" rx="7" ry="9" />
    <ellipse class="skin ear" cx="41" cy="${HEAD_Y + 6}" rx="7" ry="9" />
    <circle class="earring" cx="-37" cy="${HEAD_Y + 18}" r="3.6" />
    <circle class="earring" cx="41" cy="${HEAD_Y + 18}" r="3.6" />

    <circle class="skin" cx="2" cy="${HEAD_Y}" r="${HEAD_R}" />

    <!-- the parting: two sweeps meeting at the centre -->
    <path class="hair" d="M -38 ${HEAD_Y + 2}
      C -41 ${HEAD_Y - 26} -22 ${HEAD_Y - 46} 2 ${HEAD_Y - 46}
      C 0 ${HEAD_Y - 30} -8 ${HEAD_Y - 22} -22 ${HEAD_Y - 14}
      C -31 ${HEAD_Y - 8} -36 ${HEAD_Y - 3} -38 ${HEAD_Y + 2} Z" />
    <path class="hair" d="M 42 ${HEAD_Y + 2}
      C 44 ${HEAD_Y - 26} 26 ${HEAD_Y - 46} 2 ${HEAD_Y - 46}
      C 6 ${HEAD_Y - 30} 16 ${HEAD_Y - 22} 29 ${HEAD_Y - 14}
      C 37 ${HEAD_Y - 8} 40 ${HEAD_Y - 3} 42 ${HEAD_Y + 2} Z" />

    <!-- bindi -->
    <circle class="bindi" cx="2" cy="${HEAD_Y - 20}" r="3.4" />

    <g class="face">
      <circle class="blush" cx="-20" cy="${HEAD_Y + 13}" r="8" />
      <circle class="blush" cx="24" cy="${HEAD_Y + 13}" r="8" />

      <!-- Large round eyes with a lid line and two highlights, which is what
           gives the reference its warmth. The old 10x12 ovals on a wider head
           were the single biggest reason she read as a cheap sticker. -->
      <g class="eyes">
        <g class="eye">
          <ellipse class="eye-white" cx="-12" cy="${HEAD_Y - 2}" rx="9" ry="10.5" />
          <circle class="pupil" cx="-11" cy="${HEAD_Y - 1}" r="6.4" />
          <circle class="glint" cx="-14" cy="${HEAD_Y - 5}" r="2.6" />
          <circle class="glint small" cx="-8" cy="${HEAD_Y + 3}" r="1.3" />
          <path class="lash" d="M -22 ${HEAD_Y - 8} C -18 ${HEAD_Y - 14} -6 ${HEAD_Y - 14} -3 ${HEAD_Y - 7}" />
        </g>
        <g class="eye">
          <ellipse class="eye-white" cx="16" cy="${HEAD_Y - 2}" rx="9" ry="10.5" />
          <circle class="pupil" cx="17" cy="${HEAD_Y - 1}" r="6.4" />
          <circle class="glint" cx="14" cy="${HEAD_Y - 5}" r="2.6" />
          <circle class="glint small" cx="20" cy="${HEAD_Y + 3}" r="1.3" />
          <path class="lash" d="M 7 ${HEAD_Y - 7} C 10 ${HEAD_Y - 14} 22 ${HEAD_Y - 14} 26 ${HEAD_Y - 8}" />
        </g>
      </g>

      <path class="nose" d="M 2 ${HEAD_Y + 8} q 3.6 3 0 5.2" />

      <!-- every mood is drawn once; CSS reveals one -->
      <g class="brows">
        <g class="brow-set" data-for="neutral">
          <path d="M -22 ${HEAD_Y - 17} Q -12 ${HEAD_Y - 23} -3 ${HEAD_Y - 18}" />
          <path d="M 7 ${HEAD_Y - 18} Q 16 ${HEAD_Y - 23} 26 ${HEAD_Y - 17}" />
        </g>
        <g class="brow-set" data-for="curious">
          <path d="M -22 ${HEAD_Y - 18} Q -12 ${HEAD_Y - 26} -3 ${HEAD_Y - 20}" />
          <path d="M 7 ${HEAD_Y - 24} Q 16 ${HEAD_Y - 32} 26 ${HEAD_Y - 23}" />
        </g>
        <g class="brow-set" data-for="surprised">
          <path d="M -23 ${HEAD_Y - 25} Q -12 ${HEAD_Y - 34} -2 ${HEAD_Y - 26}" />
          <path d="M 6 ${HEAD_Y - 26} Q 16 ${HEAD_Y - 34} 27 ${HEAD_Y - 25}" />
        </g>
        <g class="brow-set" data-for="confused">
          <path d="M -22 ${HEAD_Y - 22} Q -12 ${HEAD_Y - 14} -3 ${HEAD_Y - 20}" />
          <path d="M 7 ${HEAD_Y - 26} Q 16 ${HEAD_Y - 33} 26 ${HEAD_Y - 24}" />
        </g>
        <g class="brow-set" data-for="happy">
          <path d="M -22 ${HEAD_Y - 20} Q -12 ${HEAD_Y - 27} -3 ${HEAD_Y - 21}" />
          <path d="M 7 ${HEAD_Y - 21} Q 16 ${HEAD_Y - 27} 26 ${HEAD_Y - 20}" />
        </g>
      </g>

      <g class="mouths">
        <path class="mouth-set" data-for="neutral"   d="M -6 ${HEAD_Y + 21} Q 2 ${HEAD_Y + 27} 10 ${HEAD_Y + 21}" />
        <path class="mouth-set" data-for="curious"   d="M -5 ${HEAD_Y + 20} Q 2 ${HEAD_Y + 28} 9 ${HEAD_Y + 20}" />
        <path class="mouth-set open" data-for="surprised" d="M 2 ${HEAD_Y + 24} m -6 0 a 6 7 0 1 0 12 0 a 6 7 0 1 0 -12 0" />
        <path class="mouth-set" data-for="confused" d="M -6 ${HEAD_Y + 25} Q 2 ${HEAD_Y + 19} 10 ${HEAD_Y + 24}" />
        <path class="mouth-set open" data-for="happy" d="M -8 ${HEAD_Y + 19} Q 2 ${HEAD_Y + 33} 12 ${HEAD_Y + 19} Z" />
      </g>
    </g>
  </g>

  <!-- Mithu rides on her shoulder. Positioning lives on the OUTER group: the
       hop animation sets transform, and a CSS transform replaces the SVG
       attribute rather than composing with it. -->
  <g class="mithu-perch" transform="translate(44 ${SHOULDER_Y - 10}) scale(0.28)">
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
