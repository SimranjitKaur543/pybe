# The Palace of Whispers — Python Scope, Discovered Rather Than Explained

An interactive animated storybook that teaches Python's **LEGB scope rules** through
Tara, a girl in a palace, and Mithu, the parrot on her shoulder.

**Live:** https://simranjitkaur543.github.io/pybe/

Everything on screen is drawn in code as inline SVG. There are no image files, no video,
no sprite sheets, and no runtime dependencies — the whole thing is Vite plus vanilla
JavaScript.

## What it teaches

The four scopes, in the order Python searches them, plus the parts learners actually get
wrong:

| In the palace | In Python |
|---|---|
| Tara's room | **Local** — inside one function |
| The courtyard her room sits in | **Enclosing** — a function written inside another |
| The palace | **Global** — the top level of the file |
| The kingdom beyond it | **Built-in** — names Python already knows, like `print` |

It also covers shadowing, `global`, `nonlocal`, a fresh local space per call, shadowing a
built-in, and `UnboundLocalError`.

Three things the story is careful to get right, because the metaphor is only worth using
if it is true:

- **Scope is lexical, not dynamic.** The reveal always starts at the *word*, never at
  Tara, because a name belongs to where it was written and not to whoever is standing
  near it.
- **Enclosing scope is conditional.** It only exists when a function is written inside
  another, so it is drawn growing out of her room rather than as a permanent ring.
- **`UnboundLocalError` is decided before the code runs.** The room claims the name the
  moment it is written, so the failed read is a consequence the viewer has already
  watched happen.

## How the experience flows

The learner drives it. Each concept follows the same loop:

**Experience → Question → Choice → Consequence → Concept → Python**

- **~30s** — the first action. Tara does not whisper until the learner says so.
- **~1:10** — *"What should she do with her secret?"* Keeping it in the room loops her
  back to the same wall, which is the point.
- **~2:00** — *"Her secret did not answer out here. Where is it?"* asked **before** the
  reveal. "It followed her out" is offered as a real option, because that misconception
  is what the story exists to correct.
- Later, two predictions on real Python — shadowing, then `UnboundLocalError` — each with
  a 💡 hint that narrows the search without giving the answer.

No answer is ever called wrong. Feedback says what actually happened and where to look,
and a wrong prediction re-offers the question. There are no points, lives, badges or
leaderboards.

## Tech stack

- **Vite** + vanilla JavaScript (ES modules)
- **Inline SVG**, animated with CSS and a small tweening engine
- **No runtime dependencies**

## Project structure

```
palace-of-whispers/
├── index.html
├── style.css                 palette, layout, shared keyframes
└── src/
    ├── SceneManager.js       builds the stage ONCE; never torn down between beats
    ├── scenes.js             the scene chain + the opening
    ├── scenes/               choreography, one file per beat
    ├── engine/
    │   ├── Camera.js         one continuous camera over one world
    │   ├── Actor.js          poses, walk cycles, expressions
    │   ├── anim.js           tweens, the story clock, run generations
    │   ├── Ask.js            choices, predictions, hints
    │   └── CodeSpell.js      the code panel
    ├── art/                  pure functions returning SVG
    ├── story/beats.js        every question the story asks, in one place
    └── ui/                   progress journey
```

## Running it locally

```bash
cd palace-of-whispers
npm install
npm run dev
```

Then open the printed URL. `npm run build` produces the static site in `dist/`.

## Accessibility and responsiveness

- Works at 375px through desktop, with no horizontal scrolling. Choices stack full-width
  on phones rather than shrinking the desktop row.
- Full keyboard support, visible focus rings, and 44px+ touch targets.
- **Pause** (button or <kbd>Space</kbd>) stops a story clock, so tweens freeze and the
  holds between beats stop counting down — the story resumes where it stopped.
- `prefers-reduced-motion` is honoured in all stylesheets; the piece renders its final
  state and keeps the whole code lesson rather than dropping it.
- Narration is mirrored into an `aria-live` region so the lesson is audible to screen
  readers.

## Notes for reviewers

A few decisions worth knowing about, and the reasoning:

- **The camera never cuts.** The stage is built once and the camera flies from the sky,
  through the window, into the room as one continuous move. This is what keeps it a film
  rather than a slideshow, and it is the constraint most of the code exists to protect.
- **Questions are not modal.** They sit low in the frame while the palace keeps moving
  behind them. A centred dialog box would turn the film into a quiz with a picture behind
  it.
- **The concept is named after it is felt.** The story opens by saying plainly that a
  function is a room and that this is about where variables live, then lets the learner
  discover the consequences before any scope is named.

### Known limitations

- Runtime is about seven minutes end to end; Mithu's lesson still re-teaches in code two
  things the story already showed in pictures.
- Tara's character design is the weakest visual element and is the next thing worth
  redoing.
