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
  },

  // ── PREDICTION 1 · shadowing ────────────────────────────────────────────
  // Placed the moment before the story shows it. "Mithu" is the belief that
  // assigning inside a function changes the outer name, which is the single
  // most common misreading of this code — so it is offered as a real option.
  shadowPredict: {
    code: [
      'name = "Mithu"',
      '',
      'def room():',
      '    name = "Tara"',
      '    print(name)',
      '',
      'room()'
    ],
    question: 'What does this print?',
    options: [
      { value: 'Tara',  label: 'Tara' },
      { value: 'Mithu', label: 'Mithu' },
      { value: 'error', label: 'An error' }
    ],
    answer: 'Tara',
    hints: [
      'Look at where each name was made.',
      'Is Tara inside the room, or outside it, when she reads it?'
    ],
    feedback: {
      Tara:  'Yes. Inside the room, her own name is the nearer one.',
      Mithu: 'Almost. The palace still says Mithu — but Tara made her own copy inside.',
      error: 'No error here. Both names exist; the question is which one is nearer.'
    },
    reveal: 'It prints Tara. The name made inside the room hides the one outside it.'
  },

  // ── PREDICTION 2 · UnboundLocalError ────────────────────────────────────
  // The hardest idea in the topic, and the one worth making them commit to.
  // "Mithu" is the intuitive answer and it is wrong for a reason the story has
  // spent five minutes building: the room claims the name before it runs.
  errorPredict: {
    code: [
      'name = "Mithu"',
      '',
      'def room():',
      '    print(name)',
      '    name = "Tara"',
      '',
      'room()'
    ],
    question: 'And this one?',
    options: [
      { value: 'error', label: 'An error' },
      { value: 'Mithu', label: 'Mithu' },
      { value: 'Tara',  label: 'Tara' }
    ],
    answer: 'error',
    hints: [
      'Python reads the whole room before it runs a single line of it.',
      'The room assigns to name somewhere. What does that make the name, everywhere in the room?'
    ],
    feedback: {
      error: 'Yes — UnboundLocalError. The room owns the name before it has a value.',
      Mithu: 'That is the trap. Because the room assigns to name lower down, it never looks outside at all.',
      Tara:  'Not yet — that line has not run when print is reached.'
    },
    reveal: 'It raises UnboundLocalError: the room claimed name the moment it was written, so there is nothing outside to fall back to.'
  }
};
