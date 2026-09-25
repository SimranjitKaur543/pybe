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
,

  // ══ ENCLOSING ═══════════════════════════════════════════════════════════
  // Asked after her own room comes up empty. The learner picks the search
  // ORDER, which is the rule itself — and "straight to the palace" is a real
  // temptation, because it is where the name actually turns out to be. Being
  // right by luck is still the wrong rule.
  lookNext: {
    question: 'It is not in her room. Where should Python look next?',
    options: [
      { value: 'enclosing', label: 'The space just outside', note: 'one step out' },
      { value: 'global',    label: 'Straight to the palace' },
      { value: 'stop',      label: 'Stop looking' }
    ],
    answer: 'enclosing',
    feedback: {
      enclosing: 'Yes — one step out at a time, never a jump.',
      global:    'It IS in the palace. But Python does not skip — it checks the space just outside first.',
      stop:      'Not yet. A name missing from the room is normal; Python keeps looking outward.'
    }
  },

  // ══ BUILT-IN ════════════════════════════════════════════════════════════
  // print has been on screen since the first code panel. The question is not
  // what it does, it is who it belongs to — which is the only thing that makes
  // the outermost ring mean anything.
  whoMadePrint: {
    question: 'And print — who made that one?',
    options: [
      { value: 'python', label: 'Nobody. Python already knew it' },
      { value: 'tara',   label: 'Tara did' },
      { value: 'palace', label: 'The palace holds it' }
    ],
    answer: 'python',
    feedback: {
      python: 'Yes. It was never written here. It is built in.',
      tara:   'She never wrote it — and it worked the very first time she used it.',
      palace: 'Not the palace either. Search the whole file and print is nowhere in it.'
    }
  },

  // ══ GLOBAL ══════════════════════════════════════════════════════════════
  // She has just watched her own copy fail to change anything. The question is
  // what would ACTUALLY change the palace's name — and "say it louder" is the
  // instinct the word global exists to replace.
  changeThePalace: {
    question: "She wants to change the palace’s name, not make another copy. What does she need?",
    options: [
      { value: 'declare', label: "Tell Python she means the palace’s one" },
      { value: 'louder',  label: 'Say it louder' },
      { value: 'again',   label: 'Write it again' }
    ],
    answer: 'declare',
    feedback: {
      declare: 'Exactly. That is what the word global does.',
      louder:  'Volume is not the problem — the room keeps making its own copy however loudly she says it.',
      again:   'Writing it again in her room just makes the same local copy a second time.'
    }
  },

  // Enclosing vs global, as a choice between two real keywords.
  whichReach: {
    code: [
      'def palace():',
      '    name = "Mithu"',
      '',
      '    def room():',
      '        ???  name',
      '        name = "Tara"'
    ],
    question: 'She means the room around her, not the whole palace. Which word?',
    options: [
      { value: 'nonlocal', label: 'nonlocal' },
      { value: 'global',   label: 'global' }
    ],
    answer: 'nonlocal',
    hints: [
      'One of these reaches all the way out to the file. The other stops one step out.'
    ],
    feedback: {
      nonlocal: 'Yes. nonlocal reaches the enclosing room and stops there.',
      global:   'global would skip past the surrounding room and rebind the name at the very top of the file.'
    },
    reveal: 'nonlocal — it reaches the enclosing function, never the module.'
  }
};
