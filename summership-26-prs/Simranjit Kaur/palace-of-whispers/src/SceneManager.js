// The SceneManager owns the stage: one SVG, one continuous world, one camera,
// and the actors living in it. Scenes are choreography run against this stage —
// the stage is never torn down and rebuilt between beats, which is precisely
// what stops the piece becoming a slideshow.

import { Camera } from './engine/Camera.js';
import { Actor } from './engine/Actor.js';
import { CodeSpell } from './engine/CodeSpell.js';
import { tween, ease, REDUCED, newRun, currentGeneration, togglePause, resume, clockDebug } from './engine/anim.js';
import { tara as taraArt } from './art/cast.js';
import { defs } from './art/parts.js';
import { palaceNight, heroClipDef, HERO } from './art/scenes/palaceNight.js';
import { spark as sparkArt, sparkWord, titleMotes } from './art/spark.js';
import { playStory, scenes } from './scenes.js';

export const VIEW = { width: 1600, height: 900 };

/** A drifting spark. Position is JS; its shimmer and trail are CSS. */
class Spark {
  constructor(el) {
    this.el = el;
    this.x = 0;
    this.y = 0;
    this.scale = 1;
    this.apply();
  }
  apply() {
    this.el.setAttribute(
      'transform',
      `translate(${this.x} ${this.y}) scale(${this.scale})`
    );
  }
  at(x, y) {
    this.x = x;
    this.y = y;
    this.apply();
    return this;
  }
  setScale(s) {
    this.scale = s;
    this.apply();
    return this;
  }
  /**
   * Rewrite what this word says, resizing its plate to match. The element is
   * never replaced — same node, new value — so its glow, drift and particle
   * trail carry across the change instead of restarting.
   */
  setText(text) {
    const t = this.el.querySelector('.sw-text');
    if (!t) return this;
    t.textContent = text;
    const w = Math.max(190, text.length * 34 + 96);
    const plate = this.el.querySelector('.sw-plate');
    const aura = this.el.querySelector('.sw-aura');
    if (plate) { plate.setAttribute('x', -w / 2); plate.setAttribute('width', w); }
    if (aura) aura.setAttribute('rx', w * 0.78);
    return this;
  }

  /** A value changing, with a beat of transformation rather than a swap. */
  async morphTo(text, { duration = 900 } = {}) {
    this.el.classList.add('is-morphing');
    await tween({ duration: duration / 2, easing: ease.in, onUpdate: () => {} });
    this.setText(text);
    await tween({ duration: duration / 2, easing: ease.out, onUpdate: () => {} });
    this.el.classList.remove('is-morphing');
    return this;
  }

  scaleTo(to, { duration = 900, easing = ease.inOut } = {}) {
    const from = this.scale;
    return tween({
      duration,
      easing,
      onUpdate: (t) => {
        this.scale = from + (to - from) * t;
        this.apply();
      }
    });
  }
  moveTo(x, y, { duration = 1400, easing = ease.inOut } = {}) {
    const fx = this.x;
    const fy = this.y;
    return tween({
      duration,
      easing,
      onUpdate: (t) => {
        this.x = fx + (x - fx) * t;
        this.y = fy + (y - fy) * t;
        this.apply();
      }
    });
  }
}

function svgEl(markup, cls) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  if (cls) g.setAttribute('class', cls);
  g.innerHTML = markup;
  return g;
}

export function mountStory(root) {
  root.innerHTML = `
    <div class="stage">
      <svg class="stage-svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}"
           preserveAspectRatio="xMidYMid slice" role="img"
           aria-label="A palace at night. A girl and her parrot watch a glowing word appear.">
        ${defs()}
        <defs>${heroClipDef()}</defs>
        <g class="world">${palaceNight()}</g>
      </svg>

      <div class="ui">
        <svg class="title-svg" viewBox="0 0 ${VIEW.width} ${VIEW.height}"
             preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <g class="title-group" transform="translate(800 648)">
            ${titleMotes()}
            <text class="title-main" x="0" y="0" text-anchor="middle">The Palace of Whispers</text>
            <text class="title-sub"  x="0" y="76" text-anchor="middle">A story about where words live</text>
            <text class="title-sub2" x="0" y="76" text-anchor="middle">Python scope, told as a story.</text>
          </g>
        </svg>
      </div>

      <!-- The film used to open straight into the metaphor, so for three
           minutes a viewer had no idea it was about Python at all. These two
           lines say what is being taught BEFORE the story that illustrates it,
           and they play over the sky drift that was empty anyway. -->
      <p class="narration" data-for="premise">In Python, a <em>function</em> is a room.</p>
      <p class="narration" data-for="premise2">A <em>variable</em> you make inside it stays inside it.</p>
      <p class="narration" data-for="premise3">This is a story about where variables live.</p>
      <p class="narration" data-for="far">Some words don't travel far.</p>
      <p class="narration" data-for="born">Some variables belong only to the place where they were born.</p>
      <p class="narration" data-for="names">Python gives these places names. They are called <em>scopes</em>.</p>
      <p class="narration" data-for="wider">A variable can be found in a wider place too.</p>
      <p class="narration" data-for="hides">A nearer variable hides a wider one with the same name.</p>
      <p class="narration" data-for="speak">Then you must speak to the palace.</p>
      <p class="narration" data-for="nonlocal">And if you mean the surrounding room, Python has <em>nonlocal</em>.</p>
      <p class="narration" data-for="claimed">But Tara had already claimed that name for her room.</p>
      <p class="narration" data-for="lookedthere">Python looked for it there.</p>
      <p class="narration" data-for="rules">Don't worry. Python has rules for where it looks for a name.</p>
      <p class="narration" data-for="legb">It looks Local, then Enclosing, then Global, then Built-in &mdash; and stops at the first match.</p>
      <p class="narration" data-for="builtin">Names like <em>print</em> live in the outermost ring. Python finds them last, and always.</p>
      <p class="narration" data-for="readassign">Reading a name looks outward. Assigning one creates it right here.</p>
      <p class="narration" data-for="shadowbuiltin">Shadow a built-in name, and you lose the built-in.</p>
      <p class="narration" data-for="bridge">You meet this every time you write a function.</p>
      <p class="narration" data-for="assignrule">Assigning to a name makes it local &mdash; unless you say <em>global</em> or <em>nonlocal</em>.</p>
      <p class="narration" data-for="fourplaces">Four places. One order. Every time.</p>
      <p class="narration" data-for="lookout">Tara didn't create a name here, so Python can look outward.</p>
      <p class="narration" data-for="assigns">Because the function assigns to <em>name</em>, Python treats it as local.</p>
      <p class="narration" data-for="novalue">But the local name has no value yet.</p>
      <p class="narration" data-for="freshcall">Each function call gets its own local space.</p>
      <p class="narration" data-for="begins">Now you know where Python begins its search.</p>
      <p class="narration" data-for="whenever">Whenever I use a name&hellip;</p>
      <p class="narration" data-for="belong">&hellip;Python asks: where does it belong?</p>
      <p class="narration" data-for="whichscope">Ask: which scope am I in?</p>
      <p class="narration" data-for="beginssearch">That is where Python begins its search.</p>

      <div class="code-air"><pre class="ca-lines"></pre></div>

      <button class="pausebtn" type="button" aria-label="Pause the story" aria-pressed="false">
        <span class="pause-icon" aria-hidden="true">&#10073;&#10073;</span>
        <span class="play-icon" aria-hidden="true">&#9654;</span>
      </button>
      <button class="replay" type="button" aria-label="Replay the story from the beginning">
        <span class="replay-icon" aria-hidden="true">&#8635;</span>
        <span class="replay-label">Replay the story</span>
      </button>
    </div>`;

  const world = root.querySelector('.world');
  const camera = new Camera(world, VIEW);
  const slot = root.querySelector('.tara-slot');

  // Tara and the spark live inside the room portal, so they share room-space.
  const taraWrap = svgEl(taraArt());
  slot.appendChild(taraWrap);
  const tara = new Actor(taraWrap, { x: 60, y: 420, scale: 1, facing: 'left' });

  const sparkSlot = svgEl(sparkArt() + sparkWord('laddoo'), 'spark-slot');
  slot.appendChild(sparkSlot);
  const spark = new Spark(sparkSlot);
  spark.at(520, -300);

  // The word Tara herself whispers. A second object, so the first one can stay
  // in the room while hers is the one that runs into the wall.
  const hersSlot = svgEl(sparkArt() + sparkWord('chameli'), 'spark-slot hers');
  slot.appendChild(hersSlot);
  const hers = new Spark(hersSlot);
  hers.at(0, 0).setScale(0.06);

  const code = new CodeSpell(root.querySelector('.code-air'));

  const stage = {
    root,
    camera,
    tara,
    spark,
    hers,
    code,
    ui: root.querySelector('.ui')
  };

  const run = () => {
    // stop whatever is still playing before touching any shared state
    newRun();
    // reset anything the previous run latched on
    root.querySelector('.hero-window').classList.remove('is-open', 'is-passed');
    root.querySelector('.portal').classList.remove('is-inside');
    sparkSlot.classList.remove('is-live', 'is-word', 'is-dimmed');
    hersSlot.classList.remove('is-live', 'is-word', 'is-bouncing', 'is-straining', 'is-fading');
    hers.at(0, 0).setScale(0.06);
    root.querySelector('.room').classList.remove('wall-felt');
    root.querySelector('.room-door').classList.remove('is-noticed');
    root.querySelector('.tara').classList.remove('mithu-alert');
    root.querySelector('.wall-ripple').classList.remove('is-hit');
    root.querySelector('.room-door').classList.remove('is-open');
    root.querySelector('.portal').classList.remove('show-shell');
    root.querySelector('.layer-glows').classList.remove('is-live');
    root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-lit'));
    root.querySelectorAll('.mlabel').forEach((g) => g.classList.remove('is-named'));
    root.querySelector('.ask-prompt').classList.remove('is-offered', 'is-taken');
    root.querySelector('.ask-speech').classList.remove('is-spoken');
    root.querySelector('.q-motes').classList.remove('is-asking');
    root.querySelector('.courtyard').classList.remove('is-hushed');
    hersSlot.classList.remove('is-homebound', 'is-beckoning', 'is-inner', 'is-shadowing', 'is-touched');
    sparkSlot.classList.remove('is-outer', 'is-answering', 'is-shadowed', 'is-touched');
    hers.setText('chameli');
    spark.setText('laddoo');
    root.querySelector('.reach').classList.remove('show-global', 'show-nonlocal', 'show-shadow');
    root.querySelectorAll('.lg').forEach((g) => g.classList.remove('is-probing', 'is-empty', 'is-found'));
    root.querySelectorAll('.mlabel').forEach((g) => g.classList.remove('is-inline'));
    root.querySelector('.layer-glows').classList.remove('is-searching');
    root.querySelector('.tara').classList.remove('has-lantern', 'has-megaphone', 'mithu-away');
    hersSlot.classList.remove('is-hollow', 'is-claimed', 'is-hollow-pulse', 'is-clearing');
    root.querySelector('.trails').classList.remove('show-out', 'show-local', 'show-blocked', 'is-barred');
    root.querySelector('.error-spell').classList.remove('is-cast');
    root.querySelector('.perch-stand').classList.remove('is-up');
    root.querySelector('.shadow-tag .mlabel').classList.remove('is-named');
    root.querySelector('.stage').classList.remove('is-darkened');
    code.clear({ duration: 0 });
    code.undock();
    root.querySelector('.tara').classList.remove('looks-out', 'mithu-nods');
    root.querySelector('.portal').classList.remove('is-warming');
    root.querySelectorAll('.is-waking').forEach((w) => w.classList.remove('is-waking'));
    root.querySelectorAll('.is-fading').forEach((w) => w.classList.remove('is-fading'));
    hersSlot.classList.remove('is-settled', 'is-rising', 'is-star');
    sparkSlot.classList.remove('is-settled');
    root.querySelector('.layer-glows').classList.remove('is-soft');
    root.querySelector('.replay').classList.remove('is-offered');
    // a replay while paused would start a story whose clock is stopped
    resume();
    root.querySelector('.stage').classList.remove('is-paused');
    const pb = root.querySelector('.pausebtn');
    pb.classList.remove('is-paused');
    pb.setAttribute('aria-pressed', 'false');
    pb.setAttribute('aria-label', 'Pause the story');
    stage.ui.classList.remove('is-ending');
    delete stage.ui.dataset.line;
    stage.ui.classList.remove('show-title', 'show-sub', 'show-line');
    tara.at(60, 420);
    tara.facing = 'left';
    tara.apply();
    spark.x = 520;
    spark.y = -300;
    spark.apply();
    camera.unfollow();
    playStory(stage);
  };

  // ── pause ───────────────────────────────────────────────────────────────
  // Stopping the clock freezes tweens and holds; the class stops CSS
  // animations, which run on their own timeline the clock cannot reach.
  const pauseBtn = root.querySelector('.pausebtn');
  const stageEl = root.querySelector('.stage');

  const setPaused = (on) => {
    stageEl.classList.toggle('is-paused', on);
    pauseBtn.classList.toggle('is-paused', on);
    pauseBtn.setAttribute('aria-pressed', String(on));
    pauseBtn.setAttribute('aria-label', on ? 'Resume the story' : 'Pause the story');
  };

  pauseBtn.addEventListener('click', () => setPaused(togglePause()));

  // Space is what everyone reaches for, but it is also how a keyboard user
  // activates whatever they have focused — including the story's one
  // interaction, which is an SVG <g role="button">. Testing for HTMLElement
  // missed it (an SVG element is not an HTMLElement), so pressing Space on the
  // prompt both took the offer AND paused the story, leaving a keyboard user
  // frozen with no clue why. Match anything that behaves like a control.
  addEventListener('keydown', (e) => {
    if (e.code !== 'Space' && e.key !== ' ') return;
    const t = e.target;
    if (t instanceof Element &&
        (t.closest('button') || t.getAttribute('role') === 'button' || t.isContentEditable)) return;
    e.preventDefault();
    setPaused(togglePause());
  });

  root.querySelector('.replay').addEventListener('click', run);

  // With reduced motion every camera journey is skipped and we land on the
  // state this section exists to deliver: the palace open, its layers lit and
  // named, and the word still sitting in the room it was spoken in. Nothing
  // the animation was teaching is lost — only the travelling.
  if (REDUCED) {
    root.querySelector('.hero-window').classList.add('is-open', 'is-passed');
    root.querySelector('.portal').classList.add('is-inside', 'show-shell');
    root.querySelector('.room-door').classList.add('is-open');

    // the word never left her room
    hersSlot.classList.add('is-live', 'is-word', 'is-homebound');
    hers.at(-620, -240).setScale(1);
    sparkSlot.classList.add('is-live', 'is-word');
    spark.at(470, -330);

    // she is out in the courtyard, where it is not
    tara.at(1760, 420);
    tara.express('confused');

    // the layers, already named
    root.querySelector('.layer-glows').classList.add('is-live');
    root.querySelectorAll('.lg').forEach((g) => g.classList.add('is-lit'));
    root.querySelectorAll('.mlabel').forEach((g) => g.classList.add('is-named'));

    // and the outcome this section exists to show: the same name in two
    // places, holding two different values
    hers.setText('TARA');
    hersSlot.classList.add('is-inner');
    hers.at(-560, -300);
    spark.setText('MITHU');
    sparkSlot.classList.add('is-outer');
    spark.at(1900, -1180);

    camera.set({
      x: HERO.x + 980 * HERO.scale,
      y: HERO.y + -940 * HERO.scale,
      zoom: camera.zoomToFitWidth(1760)
    });
    // The code half of the lesson is not motion, so none of it is dropped
    // here. Without this, a reduced-motion viewer would lose everything the
    // docked panel teaches and be left with the pictures alone.
    code.dock();
    code.write([
      'name = "Mithu"',
      '',
      'def room():',
      '    name = "Tara"',
      '    print(name)'
    ], { stagger: 0 });
    code.note(0, 'Global — the palace name');
    code.note(3, 'assigning makes a NEW local name');
    code.note(4, 'finds the local one first');

    stage.ui.dataset.line = 'names';
    stage.ui.classList.add('show-line');
  } else {
    run();
  }

  // Dev-only: lets a single scene be replayed without sitting through the ones
  // before it. Stripped from production builds by Vite.
  if (import.meta.env.DEV) window.__palace = { stage, scenes, run, currentGeneration, newRun, clockDebug, togglePause };

  return stage;
}
