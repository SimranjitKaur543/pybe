# Product File: The Palace of Whispers

## Overview

**The Palace of Whispers** is a frontend-only interactive animated storybook that teaches
Python variable scope (LEGB). It is built with Vite and vanilla JavaScript, with every
visual drawn in code as inline SVG — no image files, no video, no runtime dependencies.

The learner follows Tara, a girl in a palace, as she discovers that a word spoken in her
room cannot be heard outside it. Scope is the most spatial idea in beginner Python, which
is why it suits animation: the movement *is* the explanation.

**Live:** https://simranjitkaur543.github.io/pybe/

## Pedagogical Features

* **Discovery before explanation.** Each concept follows Experience → Question → Choice →
  Consequence → Concept → Python. The learner watches a word fail to travel before the
  word "Local" is ever used.
* **The learner drives the story.** The first action happens about thirty seconds in, and
  the story does not advance until they act. Choices branch: keeping the secret in the
  room loops Tara back to the same wall.
* **Predictions before reveals.** Two beats ask what real Python will do — shadowing, and
  `UnboundLocalError` — while the wrong answer still looks obvious. The misconception is
  offered as a real option because correcting it is the lesson.
* **Hints that guide rather than answer.** Revealed one at a time; the last one still
  stops short of stating the result.
* **No punishment.** No points, lives, badges or leaderboards. A wrong prediction
  explains what actually happens and offers the question again; after two attempts it
  simply explains.
* **Correctness held as a constraint.** Lexical (not dynamic) scope, conditional
  enclosing scope, and compile-time determination of `UnboundLocalError` are each
  encoded in how the animation behaves, not just in the wording.

## Technical Architecture

### 1. One stage, one continuous camera
`SceneManager.js` builds the stage once and never tears it down. Scenes are async
functions that issue camera moves and class changes against that live stage, so the
camera can fly from the sky, through a window, into a room without a cut. This is the
constraint most of the codebase exists to protect — it is what keeps the piece a film
rather than a slideshow.

### 2. The scaled portal
The room is mounted inside the hero window at 0.225 scale and clipped to the window
opening, so approaching the window and entering the room are the same continuous motion.
The clip is dropped only once the frame has left the viewport.

### 3. Run generations
Replaying mid-scene would otherwise leave two scenes driving the same camera. A
generation counter means every in-flight wait and tween from a superseded run simply
never resolves, permanently suspending the old scene.

### 4. A story clock
Everything that measures time reads one clock rather than `performance.now()`. Pausing
stops it, so tweens freeze and the holds between beats stop counting down. This also
removed a desync in which browser-throttled animation fell behind still-running timers
when the tab was hidden.

### 5. Interaction primitives (`engine/Ask.js`)
`choose()`, `predict()`, `say()` and `react()` all build on the same pattern: a scene
awaits a promise the learner resolves. Handlers register with a cancellation registry so
Replay tears down any open question. While a question is open the scenery desaturates
and Tara turns to attend to it — without the world freezing.

### 6. Resolution-independent framing
`zoomToFitWidth()` and `fitRoom()` measure the actual visible area, so the same shot
holds the same content at any aspect ratio rather than being cropped on narrow screens.

## Accessibility

Keyboard navigable with visible focus, 44px+ targets, no horizontal scroll at 375px,
`prefers-reduced-motion` honoured throughout, pause on <kbd>Space</kbd>, and narration
mirrored into an `aria-live` region so the lesson is audible to screen readers.

## Known Limitations

* Runtime is roughly seven minutes; the final lesson still repeats two things the story
  has already shown.
* Tara's character design is the weakest visual element.
* Enclosing, Global and Built-in are currently taught more by narration and diagram than
  by the learner-driven loop used for Local.
