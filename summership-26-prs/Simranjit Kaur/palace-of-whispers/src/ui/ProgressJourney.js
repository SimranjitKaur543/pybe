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
  }

  /** The learner has arrived at this part of the palace. */
  at(id) {
    for (const [key, step] of this.steps) {
      step.classList.toggle('is-here', key === id);
      if (key === id) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    }
    this.el.classList.add('is-shown');
    return this;
  }

  /** They have seen this one through. */
  done(id) {
    const step = this.steps.get(id);
    if (step) {
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
    for (const step of this.steps.values()) {
      step.classList.remove('is-here', 'is-done');
      step.removeAttribute('aria-current');
    }
    this.el.classList.remove('is-shown', 'is-forward');
    return this;
  }
}
