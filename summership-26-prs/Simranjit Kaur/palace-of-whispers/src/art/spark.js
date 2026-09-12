// The mote that becomes a word.
//
// It is one object throughout: a bare spark first, which later blooms open to
// reveal lettering. Keeping it as a single element is what lets it keep its
// trail and its drift across the transformation — it is never swapped out.

/** A drifting spark with a comet trail. */
export function spark() {
  return `
<g class="spark">
  <g class="spark-trail">
    <circle class="t1" r="7" /><circle class="t2" r="5.5" />
    <circle class="t3" r="4" /><circle class="t4" r="2.8" />
  </g>
  <circle class="spark-halo" r="66" />
  <circle class="spark-core" r="11" />
  <g class="spark-rays">
    <rect x="-1.6" y="-30" width="3.2" height="18" rx="1.6" />
    <rect x="-1.6" y="12"  width="3.2" height="18" rx="1.6" />
    <rect x="-30" y="-1.6" width="18" height="3.2" rx="1.6" />
    <rect x="12"  y="-1.6" width="18" height="3.2" rx="1.6" />
  </g>
</g>`;
}

/**
 * The word the spark becomes. Hidden until the bloom, and deliberately given
 * no explanation — the viewer should only wonder what it is.
 */
export function sparkWord(text) {
  const w = Math.max(190, text.length * 30 + 84);
  return `
<g class="spark-word" aria-hidden="true">
  <ellipse class="sw-aura" cx="0" cy="0" rx="${w * 0.78}" ry="74" />
  <rect class="sw-plate" x="${-w / 2}" y="-38" width="${w}" height="76" rx="38" />
  <text class="sw-text" x="0" y="14" text-anchor="middle">${text}</text>
  <g class="sw-motes">
    ${[[-w * 0.4, -28, 0], [w * 0.34, -34, 0.8], [-w * 0.2, 36, 1.6],
       [w * 0.44, 26, 2.3], [6, -52, 1.1], [-w * 0.46, 14, 2.9]]
      .map(([x, y, d]) => `<circle cx="${x}" cy="${y}" r="3.6" style="animation-delay:${d}s" />`)
      .join('')}
  </g>
</g>`;
}

/** Particles that gather to form the title, then scatter. */
export function titleMotes(count = 26) {
  let n = 777;
  const rand = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  return `<g class="title-motes">${Array.from({ length: count }, () => {
    const a = rand() * Math.PI * 2;
    const dist = 300 + rand() * 620;
    return `<circle r="${2 + rand() * 3.2}"
      style="--fx:${(Math.cos(a) * dist).toFixed(1)}px; --fy:${(Math.sin(a) * dist * 0.6).toFixed(1)}px;
             animation-delay:${(rand() * 1.1).toFixed(2)}s" />`;
  }).join('')}</g>`;
}
