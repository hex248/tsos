#let design = [
= Design

The design of The Shape of Sound was centred on creating a visual-first web application that could make sound design more intuitive without removing creative depth. The final design needed to support two related aims: accessibility for beginners who may find conventional music software intimidating, and creative usefulness for more experienced producers seeking an alternative workflow for experimentation. For this reason, the system was designed not only as a technical implementation of audio synthesis, but as a carefully structured interaction model in which visual form, interface layout, and sound behaviour work together. This chapter focuses on the final software structure, the conceptual design of the interaction model, the organisation of the interface, and the supporting flows that allow the application to function as a complete product.

At a high level, the final architecture is organised into four connected layers. The first is the application layer, where Next.js structures the web application and its routes, while React manages the surrounding interface and shared state. The second is the visual interaction layer, where Three.js renders and updates the shape-based interface that users manipulate directly. The third is the audio layer, where Tone.js drives synthesis behaviour and responds to changes in the visual state. The fourth is the supporting product layer, where Better Auth, Neon-hosted PostgreSQL, Zod schemas, and wasm-media-encoders support accounts, persistence, validation, and export. Although these supporting systems are important to the delivered product, the core of the design remains the synchronisation between the visual layer and the audio layer, since this relationship defines how the application is experienced by the user.

The central interaction model was designed as a synesthetic interface in which users shape sound by manipulating visual form. Rather than relying only on conventional synthesis controls such as parameter sliders, the design supplements those ideas with a more intuitive layer built around shape, colour, size, roundness, wobble, and pitch-related control. These properties were chosen because they can be understood visually and can be mapped to audible change in ways that feel immediate and expressive, even for users with little prior experience of synthesis. This was especially important for encouraging stronger creative exploration, while also supporting learning and emotional engagement through direct interaction. Features such as key lock further support this model by reducing friction during experimentation, allowing users to explore ideas freely without needing advanced music theory knowledge. Immediate audio feedback was essential to this design, as it allowed each visual change to be understood through hearing as well as sight, reinforcing the relationship between interaction and sound in real time.

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
