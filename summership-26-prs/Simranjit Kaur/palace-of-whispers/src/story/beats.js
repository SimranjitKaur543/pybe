// Everything the story ASKS the learner, in one place.
//
// Kept apart from the scenes on purpose: a scene file should read as
// choreography — walk here, light that, hold — and rewording a question should
// never mean opening a file full of camera moves. It also means all the
// wording can be read end to end, which is the only way to notice that the
// story has started lecturing.
//
// Rules the wording follows:
//   · A question is one line. It sits under a moving palace; nobody reads a
//     paragraph there.
//   · No option is "wrong". Every answer gets a reply that explains what
//     actually happens, because the misconception IS the lesson — a learner
//     who thinks the word followed her outside is holding exactly the belief
//     this story exists to correct.
//   · Feedback never says "Wrong". It says what happened and why.

export const beats = {
  // The first interaction, deliberately about 25 seconds in rather than 60.
  // One option, not two: there is nothing to decide yet, and offering a fake
  // dilemma this early would teach the learner that the choices are decoration.
  // What it establishes is the contract — nothing happens until you act.
  readyToWhisper: {
    question: 'Tara has a secret word she wants to try.',
    options: [
      { value: 'go', label: 'Let her whisper it', note: 'and see where it goes' }
    ]
  },

  // ── LOCAL ───────────────────────────────────────────────────────────────
  // Asked while she is still holding the word, before anything is named.
  // The point is not the decision — both paths reach the courtyard — it is
  // that the learner chose to take it outside, so the failure that follows is
  // theirs to explain rather than something the film did to them.
  whatToDo: {
    question: 'Tara has whispered a secret. What should she do?',
    options: [
      { value: 'outside', label: 'Take it outside', note: 'see if it follows' },
      { value: 'stay',    label: 'Keep it in the room', note: 'say it again' }
    ]
  },

  // Asked after the courtyard gives her nothing back. This is the prediction
  // the whole Local idea turns on.
  whereDidItGo: {
    question: 'Her secret did not answer out here. Where is it?',
    options: [
      { value: 'room',      label: 'Still in her room' },
      { value: 'followed',  label: 'It followed her out' },
      { value: 'gone',      label: 'It disappeared' }
    ],
    answer: 'room',
    feedback: {
      room:     'Exactly. It never left the room it was made in.',
      followed: 'Almost — that is what it feels like. Watch where it actually is.',
      gone:     'Not gone. Look back at the room she came from.'
    }
  }
};
