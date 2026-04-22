#let design = [
= Design

The design of The Shape of Sound was centred on creating a visual-first web application that could make sound design more intuitive without removing creative depth. The final design needed to support two related aims: accessibility for beginners who may find conventional music software intimidating, and creative usefulness for more experienced producers seeking an alternative workflow for experimentation. For this reason, the system was designed not only as a technical implementation of audio synthesis, but as a carefully structured interaction model in which visual form, interface layout, and sound behaviour work together. This chapter focuses on the final software structure, the conceptual design of the interaction model, the organisation of the interface, and the supporting flows that allow the application to function as a complete product.

At a high level, the final architecture is organised into four connected layers. The first is the application layer, where Next.js structures the web application and its routes, while React manages the surrounding interface and shared state. The second is the visual interaction layer, where Three.js renders and updates the shape-based interface that users manipulate directly. The third is the audio layer, where Tone.js drives synthesis behaviour and responds to changes in the visual state. The fourth is the supporting product layer, where Better Auth, PostgreSQL, Zod schemas, and wasm-media-encoders support accounts, persistence, validation, and export. Although these supporting systems are important to the delivered product, the core of the design remains the synchronisation between the visual layer and the audio layer, since this relationship defines how the application is experienced by the user. This layered structure is summarised in @fig-architecture.

#figure(
  image("../figures/architecture-diagram.png", width: 100%),
  caption: [High-level architecture of The Shape of Sound.],
) <fig-architecture>

The central interaction model was designed as a synesthetic interface in which users shape sound by manipulating visual form. Rather than relying only on conventional synthesis controls such as parameter sliders, the design supplements those ideas with a more intuitive layer built around shape, colour, size, roundness, wobble, and pitch-related control. These properties were chosen because they can be understood visually and can be mapped to audible change in ways that feel immediate and expressive, even for users with little prior experience of synthesis. This was especially important for encouraging stronger creative exploration, while also supporting learning and emotional engagement through direct interaction. Features such as key lock further support this model by reducing friction during experimentation, allowing users to explore ideas freely without needing advanced music theory knowledge. Immediate audio feedback was essential to this design, as it allowed each visual change to be understood through hearing as well as sight, reinforcing the relationship between interaction and sound in real time.

#figure(
  table(
    columns: (1.3fr, 1.5fr, 1.7fr),
    inset: 8pt,
    align: (left, left, left),
    table.header(
      [*Control / property*],
      [*Mapped audio behaviour*],
      [*Design purpose*],
    ),
    [Shape preset],
    [Selects the base oscillator waveform],
    [Gives users an immediate way to choose between different sound characters.],

    [Colour],
    [Selects note / pitch class],
    [Links pitch choice to a visual identity that can be read quickly.],

    [Octave],
    [Shifts pitch register],
    [Allows melodic range to change without altering the main interaction model.],

    [Key / scale lock],
    [Constrains note choice to a selected key and scale],
    [Reduces friction during melodic experimentation and supports beginner accessibility.],

    [Size],
    [Controls output gain / perceived loudness],
    [Makes changes in intensity visually legible.],

    [Roundness],
    [Crossfades toward a smoother sine-based timbre],
    [Connects visual softness with sonic smoothness.],

    [Wobble],
    [Controls tremolo depth],
    [Turns visible movement into audible modulation.],

    [Wobble speed],
    [Controls tremolo rate],
    [Lets motion intensity vary over time rather than remaining static.],

    [Envelope controls],
    [Shape attack, hold, decay, and sustain behaviour],
    [Gives users control over the temporal character of the sound.],
  ),
  caption: [Core interaction mappings used in The Shape of Sound.],
) <tab-core-mappings>

The UI and layout design were organised so that the interactive shape remained the clear focal point of the application. The main visual interface was treated as the centre of the experience, while the surrounding controls were arranged to support sound shaping without overwhelming the user or distracting from the primary interaction. This relationship between the shape view and the control interface was important because the project needed to remain visually clear, easy to approach, and quick to understand, especially for beginners encountering synthesis concepts for the first time. At the same time, the layout also needed to remain useful for experienced producers by allowing fast experimentation, note input, key-lock interaction, and access to supporting functions such as export, settings, and saved work. In this way, the interface design aimed to create a clear visual hierarchy in which the shape remained primary, key controls remained immediately accessible, and secondary product features supported the workflow without competing with the core audiovisual interaction.

The final design was also shaped by a clear process of refinement across multiple stages of development. The initial direction emphasised a 3D interface, as this best reflected the ambition of creating a visually expressive and sculptural interaction model for sound design. During development, however, it became useful to move temporarily into a simpler 2D Konva-based stage, where the project could test interaction clarity, mapping behaviour, and usability without the added complexity of full 3D scene management. This reduced phase was especially valuable for identifying which parts of the design were essential to the user experience and which were only visually ambitious. Once these interaction principles became clearer, the project returned to a final 3D implementation, but with a more grounded sense of purpose. As a result, the final design can be understood not as the product of a single uninterrupted idea, but as an iterative refinement process in which each stage informed the next.

The internal structure of the system was designed around a small number of shared state and data models so that visual behaviour, audio behaviour, and persistence could be consistent. At the centre of the editor is a single shape state object that holds the current sound-design values, including preset, colour, roundness, size, wobble, envelope settings, octave, and scale-related information, while editor-specific values such as rotation and position are handled alongside it. This state is managed centrally and then passed into the main interface components, allowing the visual canvas, control panels, keyboard input, preview behaviour, and export features to remain synchronised. The component structure reflects this organisation: a shared layout frames the application, canvas components handle visual rendering and manipulation, and control components handle parameter input, settings, and supporting actions. Persistence is built on a related but cleaner sound-configuration model, which allows ideas to be saved in a database as user-owned records with titles, timestamps, and validated sound settings, while also supporting local draft storage for unauthenticated use. This separation between interactive editor state, reusable sound configuration, and persisted idea records helps the final design function as both an instrument and a complete web product.

The functional design of the system was organised around a small number of key user flows that reflect the main purpose of the application. The most important of these is the creation of a sound through direct manipulation of the visual shape, where changes to properties such as colour, roundness, size, wobble, octave, and scale settings produce immediate sonic feedback. This core flow is supported by note input and key-lock functionality, allowing users to move from exploratory sound shaping into the creation of short melodic ideas without leaving the main interaction space. Beyond the audiovisual core, the design also includes supporting product flows such as account creation, saving and loading ideas, local draft persistence for unauthenticated use, and export of completed sounds for use outside the application. These flows were designed to remain secondary to the main interaction, so that they extend the usefulness of the tool without disrupting its identity as a visual-first sound design environment.

#figure(
  image("../figures/system-flowchart.png", width: 85%),
  caption: [Main user flow],
) <fig-system-flow>

This flow is visualised in @fig-system-flow, which shows how the user moves from the core shape interaction into note input, scale-aware experimentation, and supporting actions such as saving or exporting.

At the level of interaction technique, the design depends on a set of mappings and transformations that make the system feel coherent as an instrument rather than as a collection of disconnected controls. Visual-to-audio parameter mapping is central to this, since the design only succeeds if changes in shape are translated into sound in ways that feel understandable and expressive. Roundness and waveform behaviour are linked through blending and crossfading, allowing visual smoothness to correspond with smoother sonic character. Wobble introduces a further layer of interaction by turning visible movement into audible modulation, so that the shape feels active rather than static. Shape interpolation and morphing support gradual transformation rather than abrupt switching, helping the visual and sonic behaviour remain continuous. Scale and key-lock design further reduce friction by allowing users to explore melodies more freely without immediately encountering harmonic errors. Taken together, these design decisions ensure that the interaction model remains learnable for beginners while still providing enough depth to support more exploratory and musically meaningful use.

Taken as a whole, the final design addresses the main requirements of the project by combining accessibility, immediate feedback, creative usefulness, and practical workflow support within a single system. The visual-first interaction model responds directly to the goal of reducing intimidation for beginners, while the depth of the mapping and sound-shaping system helps preserve value for more experienced users. Supporting features such as persistence, account functionality, and export extend the design beyond a self-contained experiment, allowing the application to function as a complete product rather than only a prototype. In this way, the design of The Shape of Sound is not only a response to technical needs, but also a direct response to the educational, creative, and experiential aims established earlier in the project.

/*
Guidance:
- 1200 words
- describe final software structure
- use diagrams where necessary
- discuss issues relevant to high-level architecture, infrastructure, conceptual diagrams, user interfaces, functionality, algorithm development, and content creation
- discuss how the above address project requirements
- use appropriate design methods for project
- extend design to include implementation details not included in IPD
- use UML, including class and sequence diagrams
- use ui design methodology for predominantly ux-based projects
- include flowcharts, storyboard, and prototypes
- use the most appropriate diagrams to depict implementation clearly
*/
]
