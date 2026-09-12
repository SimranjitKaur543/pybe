// SCENE 1 — THE WHISPER
//
// Continues straight out of the opening; the camera never cuts and the room is
// never rebuilt. The whole sequence exists to make three things visible without
// a word of explanation:
//
//   1. Tara made a word.
//   2. The word lives in this room.
//   3. The word cannot get out.
//
// Point 3 is why the word BOUNCES rather than vanishing. A thing that simply
// disappears reads as "it broke". A thing that hits something and rebounds
// reads as "there is a wall there" — which is the actual idea.

import { ease, wait, parallel } from '../engine/anim.js';
import { ROOM } from '../art/scenes/taraRoom.js';
import { inRoom, INSIDE_ZOOM } from '../roomSpace.js';

const MOUTH = { x: 26, y: 176 };  // offset from Tara's origin to her mouth
const WALL_X = ROOM.wallX;

export async function whisper(stage) {
  const { camera, tara, spark, hers, ui, root } = stage;
  const room = root.querySelector('.room');
  const ripple = root.querySelector('.wall-ripple');

  // ── 0. let the title go ─────────────────────────────────────────────────
  // It belongs to the opening. Fading it here rather than in the opening keeps
  // scene 0 untouched, and the world carries on moving underneath it.
  if (ui.classList.contains('show-title')) {
    ui.classList.add('title-out');
    await wait(1200);
    ui.classList.remove('show-title', 'show-sub', 'title-out');
  }

  // ── 1. the first word drifts aside; hers is about to be the subject ──────
  spark.moveTo(470, -330, { duration: 2100, easing: ease.inOut });
  root.querySelector('.spark-slot').classList.add('is-dimmed');

  await camera.to({ ...inRoom(tara.x - 30, 150), zoom: camera.fitRoom(1569), duration: 2000 });
  tara.express('curious');
  await wait(700);

  // ── 2. she leans in and whispers ────────────────────────────────────────
  await camera.to({ ...inRoom(tara.x + 10, 70), zoom: camera.fitRoom(1067), duration: 2000 });
  await wait(500);

  tara.setPose('whisper');
  await wait(700);

  // the word is born at her mouth: a speck first, then it opens out
  hers.at(tara.x + MOUTH.x, tara.y - MOUTH.y).setScale(0.06);
  hers.el.classList.add('is-live');
  await wait(300);
  await hers.scaleTo(1, { duration: 1000, easing: ease.back });
  hers.el.classList.add('is-word');
  await wait(600);

  tara.setPose('idle');
  tara.express('happy');

  // ── 3. it floats up and wanders the room; she watches, then follows ─────
  await parallel(
    hers.moveTo(tara.x + 120, tara.y - 330, { duration: 2000, easing: ease.out }),
    camera.to({ ...inRoom(tara.x + 60, -60), zoom: camera.fitRoom(1356), duration: 2000 })
  );
  await wait(500);

  tara.express('curious');
  camera.follow(hers, { map: (x, y) => inRoom(x, y), offsetY: 60, lag: 0.035 });

  await hers.moveTo(-180, -400, { duration: 2000, easing: ease.inOut });
  await hers.moveTo(-430, -250, { duration: 2000, easing: ease.inOut });

  // she goes after it
  await parallel(
    tara.walkTo(-320, { speed: 200 }),
    hers.moveTo(-700, -320, { duration: 2000, easing: ease.inOut })
  );

  // ── 4. the wall ─────────────────────────────────────────────────────────
  // first attempt: it drifts into the wall and is thrown back
  await hers.moveTo(WALL_X, -300, { duration: 1800, easing: ease.in });

  ripple.setAttribute('transform', `translate(${WALL_X - 20} -300)`);
  ripple.classList.remove('is-hit');
  void ripple.getBoundingClientRect();
  ripple.classList.add('is-hit');
  hers.el.classList.add('is-bouncing');
  camera.shake(9);

  await hers.moveTo(WALL_X + 250, -350, { duration: 700, easing: ease.out });
  hers.el.classList.remove('is-bouncing');

  camera.unfollow();
  await camera.to({ ...inRoom(-520, -190), zoom: camera.fitRoom(1455), duration: 1200 });
  tara.express('surprised');
  await wait(700);

  // second attempt: slower, more deliberate — and this time it gives out
  tara.express('curious');
  camera.follow(hers, { map: (x, y) => inRoom(x, y), offsetY: 40, lag: 0.03 });
  await hers.moveTo(WALL_X + 30, -270, { duration: 2000, easing: ease.inOut });

  ripple.classList.remove('is-hit');
  void ripple.getBoundingClientRect();
  ripple.setAttribute('transform', `translate(${WALL_X - 10} -270)`);
  ripple.classList.add('is-hit');
  hers.el.classList.add('is-straining');
  camera.shake(5);
  await wait(900);

  hers.el.classList.add('is-fading');
  await wait(1300);
  hers.el.classList.remove('is-live', 'is-word', 'is-straining', 'is-fading');

  // ── 5. her reaction — the point of the whole scene ──────────────────────
  camera.unfollow();
  await camera.to({ ...inRoom(-560, -60), zoom: camera.fitRoom(1379), duration: 1800 });

  tara.express('confused');
  await wait(800);

  // she walks to the wall and puts a hand on it
  await tara.walkTo(-760, { speed: 150 });
  await tara.face('left');
  tara.setPose('touch');
  room.classList.add('wall-felt');
  await wait(1400);

  // Mithu notices before she does
  root.querySelector('.tara').classList.add('mithu-alert');
  await wait(1000);

  // then she looks the other way — toward the door
  tara.setPose('idle');
  await tara.face('right');
  tara.express('curious');
  // Pull back far enough to hold BOTH her and the door in one frame: the shot
  // has to say "she is in here, that is the way out" without a cut.
  await camera.to({ ...inRoom(-420, -40), zoom: camera.fitRoom(1905), duration: 2000 });
  await wait(500);

  // the door: shut, and plainly not where the word went
  root.querySelector('.room-door').classList.add('is-noticed');
  await wait(1100);

  // ── 6. the only line in the scene ───────────────────────────────────────
  ui.classList.add('show-line');
  await wait(4000);
  ui.classList.remove('show-line');

  room.classList.remove('wall-felt');
  root.querySelector('.tara').classList.remove('mithu-alert');
  root.querySelector('.room-door').classList.remove('is-noticed');
  await wait(400);
}
