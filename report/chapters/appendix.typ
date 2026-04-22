#let appendix = [
#pagebreak()
= Appendix

#set heading(outlined: false)

== Project Links

- Demonstration video: https://www.youtube.com/watch?v=WYEJD3cmSd8
- GitHub repository: https://www.github.com/hex248/tsos
- Live application: https://tsos.ob248.com/

== User Testing Materials

The appendix below includes the user-testing form used during evaluation, followed by anonymised summaries of the completed responses. Participant names from the raw files have been replaced with participant labels in order to keep the appendix consistent with the anonymity principles described elsewhere in the report.

=== User Testing Form Template

- Project: The Shape of Sound
- Participant details recorded:
  - date
  - participant ID
  - experience level (beginner / experienced producer)
- Task checklist:
  - create a sound you find interesting
  - change the shape and describe what changes in the sound
  - create a short melody
  - use key lock
  - export the result
- Rating questions (1-5):
  - how easy was the interface to understand?
  - did the visual controls make sound design feel more intuitive?
  - did the tool feel approachable rather than intimidating?
  - did the key-lock feature help you create in-tune ideas more easily?
  - did the tool feel creatively useful?
  - would you use this tool again for experimentation or idea generation?
- Written feedback prompts:
  - what was most confusing?
  - what was most enjoyable?
  - what would you improve?
  - any additional comments?

=== Completed Response: Participant A

- Date: 06/03/26
- Experience: Beginner
- Tasks completed: all tasks completed
- Ratings:
  - ease of understanding: 5
  - intuitiveness: 4
  - approachability: 5
  - key-lock usefulness: 5
  - creative usefulness: 5
  - reuse / experimentation: 5
- Most confusing: The directions that you must drag the control points is not always clear.
- Most enjoyable: Creating fun melodies from the sound I have been working on.
- Improvement suggested: Improve the keyboard visual. It is not very clear what keys are available when a key lock is selected.

=== Completed Response: Participant B

- Date: 07/03/26
- Experience: Beginner
- Tasks completed: all tasks completed
- Ratings:
  - ease of understanding: 4
  - intuitiveness: 4
  - approachability: 5
  - key-lock usefulness: 5
  - creative usefulness: 4
  - reuse / experimentation: 4
- Most confusing: At first I was not sure what each control changed until I tried them a few times.
- Most enjoyable: Seeing the shape change while the sound changed with it.
- Improvement suggested: Make the labels or tooltips more obvious on first use.
- Additional comment: The key lock helped me make something musical very quickly.

=== Completed Response: Participant C

- Date: 07/03/26
- Experience: Experienced producer
- Tasks completed: all tasks completed
- Ratings:
  - ease of understanding: 4
  - intuitiveness: 5
  - approachability: 4
  - key-lock usefulness: 4
  - creative usefulness: 5
  - reuse / experimentation: 5
- Most confusing: I wanted to understand a bit more clearly how roundness and wobble relate to the synth behaviour.
- Most enjoyable: Using the visual shape as a fast way to explore sound ideas without opening a full DAW workflow.
- Improvement suggested: I would like a clearer visual indication of what parameter range I am currently working in.

=== Completed Response: Participant D

- Date: 08/03/26
- Experience: Beginner
- Tasks completed: all tasks completed except creating a short melody
- Ratings:
  - ease of understanding: 3
  - intuitiveness: 4
  - approachability: 4
  - key-lock usefulness: 5
  - creative usefulness: 4
  - reuse / experimentation: 4
- Most confusing: I was not sure what to do first when I opened the app.
- Most enjoyable: Trying different shapes and hearing the sound change straight away.
- Improvement suggested: Make the initial tutorial more thorough.
- Additional comment: Once I understood the main controls it became much easier to experiment.

=== Completed Response: Participant E

- Date: 08/03/26
- Experience: Experienced producer
- Tasks completed: all tasks completed
- Ratings:
  - ease of understanding: 4
  - intuitiveness: 4
  - approachability: 4
  - key-lock usefulness: 4
  - creative usefulness: 5
  - reuse / experimentation: 5
- Most confusing: I wanted a slightly clearer sense of how some of the visual controls map to more familiar synthesis concepts.
- Most enjoyable: The interface made it easy to discover unusual timbres quickly without stopping to think in a traditional signal-flow way.
- Improvement suggested: I would improve the visual feedback around pitch and scale behaviour so it is easier to scan while experimenting.
- Additional comment: This feels strongest as a creative sketchpad or sound-idea generator that could sit alongside a DAW workflow.

== Code Extracts

The following excerpts are real code taken from the implemented project. They are included here as supporting material rather than as substitutes for the main implementation discussion in the report.

=== Shape State Model and Editor State Construction

Source: `src/hooks/useShapeState.ts` and `src/types/shape.ts`

```ts
export interface EditorShapeState extends IdeaSoundConfig {
    x: number;
    y: number;
}

export type ShapeState = EditorShapeState;

export function createEditorShapeState(
    centerX: number,
    centerY: number,
    initialConfig?: IdeaSoundConfig,
): ShapeState {
    return {
        x: centerX,
        y: centerY,
        ...DEFAULT_SOUND_CONFIG,
        ...initialConfig,
    };
}
```

=== Synthesis Node Setup

Source: `src/lib/audio/synth.ts`

```ts
export function createSynth(): SynthNodes {
    const oscillatorA = new Tone.Oscillator({ type: "sawtooth" });
    const oscillatorB = new Tone.Oscillator({ type: "sine" });
    const crossFade = new Tone.CrossFade(0);
    const noise = new Tone.Noise({ type: "white" });
    const gain = new Tone.Gain(0.5);

    oscillatorA.connect(crossFade.a);
    oscillatorB.connect(crossFade.b);
    crossFade.connect(gain);
    noise.connect(gain);
    gain.toDestination();

    oscillatorA.start();
    oscillatorB.start();
    noise.start();

    return {
        oscillatorA,
        oscillatorB,
        crossFade,
        noise,
        gain,
    };
}
```

=== Envelope Scheduling in Preview Playback

Source: `src/lib/audio/synth.ts`

```ts
const peak = Tone.dbToGain(mapSizeToGain(options.size));
const attackTime = mapAttackToSeconds(options.attack);
const holdTime = mapHoldToSeconds(options.hold);
const decayTime = mapDecayToSeconds(options.decay);
const sustainLevel = mapSustainToGain(options.sustain);

const attackEnd = now + attackTime;
const holdEnd = attackEnd + holdTime;
const decayEnd = holdEnd + decayTime;
const releaseStart = decayEnd + PREVIEW_SUSTAIN_DURATION;

envelopeGain.gain.setValueAtTime(0, now);
envelopeGain.gain.linearRampToValueAtTime(peak, attackEnd);
envelopeGain.gain.linearRampToValueAtTime(peak, holdEnd);
envelopeGain.gain.linearRampToValueAtTime(sustainGain, decayEnd);
envelopeGain.gain.setValueAtTime(sustainGain, releaseStart);
envelopeGain.gain.linearRampToValueAtTime(0, releaseStart + PREVIEW_RELEASE);
```
]
