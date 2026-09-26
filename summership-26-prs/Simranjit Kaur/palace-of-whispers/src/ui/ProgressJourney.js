// Where the learner is in the palace.
//
// Deliberately four small lamps and a name, not a progress bar with a
// percentage. The piece is a storybook; a completion meter would import the
// vocabulary of a course platform into a fairy tale. It says where you are and
// what is still ahead, and nothing else.

export const STAGES = [
  { id: 'local',     name: 'Local' },
  { id: 'enclosing', name: 'Enclosing' },
  { id: 'global',    name: 'Global' },
  { id: 'builtin',   name: 'Built-in' }
];

export function journeyMarkup() {
  return `
<nav class="journey" aria-label="Story progress">
  <span class="journey-title">Palace Journey</span>
  <ol class="journey-steps">
    ${STAGES.map((s) => `
      <li class="jstep" data-id="${s.id}">
        <span class="jlamp" aria-hidden="true"></span>
        <span class="jname">${s.name}</span>
      </li>`).join('')}
  </ol>
</nav>`;
}

export class Journey {
  constructor(el) {
    this.el = el;
    this.steps = new Map([...el.querySelectorAll('.jstep')].map((s) => [s.dataset.id, s]));
    this.order = STAGES.map((s) => s.id);
    this.furthest = -1;
  }

  /**
   * The learner has arrived at this part of the palace.
   *
   * MONOTONIC BY CONSTRUCTION. The story does not visit the four scopes in a
   * tidy line — the search scene touches all four at once, and shadowing and
   * UnboundLocalError are Local ideas taught after Global has appeared. Left
   * to the scenes, the indicator lit Built-in and then jumped back to Global,
   * and finished sitting on the wrong lamp. A progress indicator that moves
   * backwards is worse than none, so a request to retreat is ignored here
   * rather than policed at thirty call sites.
   */
  at(id) {
    const i = this.order.indexOf(id);
    if (i < this.furthest) return this;          // never go back
    this.furthest = i;

    for (const [key, step] of this.steps) {
      step.classList.toggle('is-here', key === id);
      if (key === id) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    }
    this.el.classList.add('is-shown');
    return this;
  }

  /**
   * They have seen this one through. Everything before it is marked too: if
   * the story ticks Global, leaving Enclosing unlit behind it would read as a
   * step the learner somehow missed.
   */
  done(id) {
    const upto = this.order.indexOf(id);
    if (upto < 0) return this;
    for (let i = 0; i <= upto; i += 1) {
      const step = this.steps.get(this.order[i]);
      if (!step) continue;
      step.classList.add('is-done');
      step.classList.remove('is-here');
      step.removeAttribute('aria-current');
    }
    return this;
  }

  /** Briefly bring it forward, then let it recede again. */
  async flash(ms = 2600) {
    this.el.classList.add('is-shown', 'is-forward');
    await new Promise((r) => setTimeout(r, ms));
    this.el.classList.remove('is-forward');
    return this;
  }

  reset() {
    this.furthest = -1;
    for (const step of this.steps.values()) {
      step.classList.remove('is-here', 'is-done');
      step.removeAttribute('aria-current');
    }
    this.el.classList.remove('is-shown', 'is-forward');
    return this;
  }
}
