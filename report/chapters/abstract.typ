#let abstract = [
= Abstract

The Shape of Sound is a practice-led project that investigates whether a synesthetic, visual-first interface can make sound synthesis more intuitive without reducing creative depth.

The project responds to a common split in music software: professional tools provide extensive control but often require specialist knowledge, while beginner-friendly tools are accessible but offer limited influence over how sound is actually shaped. It also responds to creative block in more experienced producers by exploring whether an alternative interaction model can make early-stage sound design feel more inviting and exploratory. In response, the project presents a web-based application in which users manipulate visual properties and receive immediate sonic feedback, turning synthesis into a more direct and engaging process.

The study combines iterative design practice, implementation, and reflective analysis. Development moved through multiple stages, including an earlier 2D Konva-based interface submitted at IPD stage, before returning to a final 3D implementation that better supported spatial interaction and expressive manipulation. The completed system uses Next.js for application structure, Three.js for the visual interface, and Tone.js with the Web Audio API for browser-based synthesis. Core mappings connect preset, colour/note, octave, size, roundness, wobble, and envelope behaviour to audible change, while supporting product features such as account-based saving, public idea access, and browser-side WAV/MP3 export extend the tool beyond a purely experimental prototype.

The final artefact is therefore a complete web application rather than only a proof of concept. Functional testing confirmed that the main user-facing flows behaved correctly, including shape-based sound creation, real-time parameter response, scale-aware note input, save/load behaviour, export, and public playback access. A structured user evaluation with five participants, including three beginners and two experienced producers, found consistently positive results. Average ratings were 4/5 for ease of understanding, 4.2/5 for intuitiveness, 4.4/5 for approachability, and 4.6/5 for key-lock usefulness, creative usefulness, and likelihood of reuse. Qualitative feedback highlighted the immediacy of sound exploration and the usefulness of the tool as an idea-generation sketchpad, while also identifying remaining weaknesses in first-use clarity, control-point visibility, and keyboard feedback.

Taken together, these outcomes suggest that a visual-first synthesis interface can reduce perceived complexity while still supporting meaningful creative exploration. The project therefore contributes both a working sound-design tool and a practice-led account of how iterative prototyping can balance accessibility, educational value, and creative depth in music technology. It also shows that visual interaction can function as more than decoration, becoming an organising principle for sound creation itself. Future work is focused on refinement rather than redefining the core concept, with the sequencer positioned explicitly as post-submission development.

/*
Guidance:
- 500 words
- summarise problem statement
- summarise project aims
- provide brief description of methodologies, technologies and algorithms
- provide main solution/results, conclusions and future recommendations
*/

#pagebreak()
]
