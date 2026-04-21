#let background = [
= Background

There are three main areas of background research that have informed the development of this project: relevant literature, comparable products, and the tools and techniques explored during development. The literature side covers multisensory interaction, synesthesia, sound symbolism, sonification, human-computer interaction, creativity, creative block, and barriers to learning music production. Together, these areas frame the project as both an interface-design problem and a creative-learning problem. The project review compares tools whose focuses range from accessibility to depth. FL Studio and Ableton are powerful professional environments with high control, but steeper learning curves. Incredibox and Splice Beatmaker represent more accessible visual and web-based experiences, but have much less direct synthesis control. Synesthesia.live is also relevant as a related audio-visual system, even though it maps in the opposite direction to this project. These comparisons help define the gap the project is aiming to fill: a visual-first, web-based synthesis tool that is approachable without becoming toy-like. The technical review reflects the way the project evolved in practice. The development direction began around Next.js, Three.js, and Tone.js, with a move to 2D, with Konva.js. Later reflection led to a return to 3D for the final implementation. The technical review can show not just what tools were used, but why they were adopted.

/*
- overview of all background research conducted for the project:
  - literature about audio synthesis, synesthesia, visual-audio interaction, and human creativity
  - similar apps (fl studio, ableton, incredibox, splice beatmaker)
  - tools (tone.js, web audio api, three.js, konva.js, react, next.js, PostgreSQL)

Guidance:
- literature survey on the topic
- existing similar apps
- critical review of tools, technologies, theories, algos used to tackle similar apps
*/

== Literature Survey

/* multisensory learning */
It has been found that learning often improves when information is presented through multiple sensory modalities rather than a single modality @shams2008benefits. This supports the idea that pairing visual interaction with audio feedback can be more effective than relying solely on traditional synthesis parameters. Multimodal feedback can enhance learning and task understanding @sigrist2013augmented, which helps to frame the project's interface as a feedback-based learning tool rather than just a creative toy. The benefits of multisensory learning are particularly relevant to this project as it aims to support users in learning about sound design through a visual interface that provides immediate audio feedback, providing a multisensory learning experience. It is important that the project can provide a learning experience while remaining engaging and fun, which is supported by the research on multisensory learning benefits.

/* cross-modal correspondence / sound symbolism */
People also make consistent cross-sensory associations between audio qualities such as pitch and visual qualities like size and brightness @spence2011crossmodal, which supports designing perceptually meaningful mappings rather than arbitrary mappings. Sound symbolic associations can make links between sound and perceptual qualities feel intuitive even without true synesthesia @sidhu2018five, which is useful for explaining why users may understand the mappings without needing specialist knowledge or unusual sensory traits. The bouba/kiki effect supports this, showing a robust association between rounded or sharp shapes and different sound qualities across cultures @cwiek2022bouba, which is directly relevant to using shape and roundness as part of audio-visual interaction. The project's use of visual shapes to control timbre can be informed by this research, ensuring that the mappings feel intuitive and engaging for users, even those without a background in music production or sound design. By leveraging these cross-modal correspondences, the project can create a more intuitive and enjoyable user experience, making it easier for users to understand and manipulate sound through visual interaction. It also helps to justify the choice of using shape and visual qualities as a means of controlling sound, as these associations are supported by research and can enhance the user's ability to learn and create with the tool.

/* historical precedent */
Scriabin's clavier à lumières provides an early historical example of mapping musical pitch to colour in performance and composition @wikipedia2025clavier, which gives historical precedent for visual-musical mapping, even if this project extends the idea into interactive sound design. This acts as historical context for the project, showing that the idea of linking visual elements to musical parameters has been explored in various forms for over a century. While Scriabin's instrument focused on pitch-to-colour mapping, this project expands on the concept by exploring more complex timbre control through visual interaction, demonstrating how historical ideas can be reimagined and extended with modern technology and design principles. While it expands the idea into a different domain, the project stays true to the pitch-colour mappings that Scriabin used.

/* emotional engagement */
Multisensory musical experiences can increase positive mood and reduce anxiety compared with audio-only experiences @schwartz2025feeling, which supports the idea that adding a strong visual layer may make music interaction more engaging and less intimidating. Sonification can be understood as sound generated in response to data and interaction rather than only as a final musical output @hermann2011sonification, which helps justify treating visual changes in the interface as sound-generating input. Sonic interaction design proposes that sound is part of the interactivity of a system @rocchesso2009sid, which places the project within interaction design research as well as music production software. Together, these ideas position the project not simply as a music tool, but as an interactive system in which sound plays a crucial role in feedback, meaning, and engagement.

Beginner-focused musical tools need to balance low barriers to entry with expressive potential @mcpherson2019novices, which aligns strongly with the project's aim of supporting both new users and more experienced producers. Creativity support tools should aim for low thresholds, with high ceilings and wide walls @shneiderman2007creativity, which gives a strong HCI basis for making the interface accessible without making it creatively shallow. Visual control of synthesis through natural cross-modal mappings already has research precedent @tsiros2017morpheme, which shows that visual-first synthesis control is an existing research direction rather than a speculative idea. Unique and exploratory musical interfaces can reduce the complexity of synthesis parameter spaces by supporting interaction over raw parameter editing @sramek2023soundtraveller, which supports the move away from parameter-heavy workflows toward exploratory sound design. The emotional engagement focus of the project is vital, as emotion and expression are what drive the creative process. By creating a tool that is not only functional but also emotionally engaging, the project can help users feel more connected to their music and more motivated to explore and create. This is particularly important for beginner users who may feel intimidated by traditional music production software, as the visual layer can make the experience more approachable and enjoyable, encouraging them to experiment and learn without fear of making mistakes or feeling overwhelmed by complex interfaces. While it greatly supports new users, the emotional engagement aspect can also enhance the experience for more experienced producers, providing a fresh and inspiring way to interact with sound that can spark creativity and new ideas.


/*
Guidance:
- 800 words
- initial results of literature survey
- select a research topic or app area related to the project
- use relevant references
*/

== Review of projects

I have reviewed an array of music software and interactive audio-visual tools to understand the current landscape of products that relate to the project's goals. This review includes both professional digital audio workstations (DAWs) and more accessible, web-based music creation tools, as well as a related audio-visual system. The aim is to identify the strengths and weaknesses of these existing products, and to position the project within this landscape by identifying a gap that it can fill.

FL Studio is a powerful DAW that offers high creative depth, detailed sequencing, and mature production workflows. However, it still relies heavily on conventional DAW structures and technical literacy, which can be intimidating for beginners @imageline_flstudio_home_2026 @imageline_flstudio_pianoroll_2026. This makes it a strong contrast case for the project, as it demonstrates that powerful music software can be conceptually dense and difficult for new users to navigate. Ableton Live is another professional DAW that combines clip-based creativity with professional production depth. Where FL Studio is especially associated with detailed sequencing and piano-roll control, Ableton Live is more strongly associated with clip-based experimentation and live-oriented workflows. While it is comparatively more experimental and workflow-oriented than FL Studio, it still operates through established DAW conventions rather than visual-first sound shaping @ableton_live_manual_welcome_2026. This shows that even one of the more intuitive professional tools does not directly solve the problem of making synthesis visually engaging and educational. Both DAWs assume prior knowledge of synthesis and music production, only providing guidance on the software itself. The power is given to the user in the form of complex menus, routing, plugins, and parameter editing. This is great for giving the user control, but leaves them overwhelmed with controls and options. Ableton Live is also relevant because its documentation now foregrounds accessibility features such as screen reader support and high-contrast options @ableton_live_accessibility_manual_2026. This is useful for separating technical accessibility from conceptual accessibility, since a system can be more accessible in one sense while still being difficult for first-time users to understand.

Incredibox is an important precedent for visual-first music creation because it is highly approachable, playful, and immediate, allowing users to make satisfying musical results without needing production knowledge @incredibox_official_2026 @incredibox_schools_2026. Incredibox gives instant reward, and provides an option for low-risk experimentation, making it especially effective for new users who are interested in playing with music and exploring loop creation. However, the depth provided is limited, with a new user having no control over the underlying synthesis parameters, or even given a chance to understand them. This supports the idea that visual immediacy and educational value are possible, but the existing projects make a trade-off: they prioritize ease of use over the ability to deeply manipulate sound. Splice Beatmaker occupies a similar space because it is browser-based, low-friction, and useful for fast musical ideation, but it is sample-centric rather than synthesis-centric @splice_beatmaker_official_2026 @splice_introducing_beatmaker_2016. Splice Beatmaker being browser-based makes it accessible from any device with a web browser. Its value lies in showing how browser-based music tools can support fast idea generation and transition into wider production workflows, even if the creative model is sample-driven. The success of Splice Beatmaker helps position The Shape of Sound as more focused on original sound creation than on loop assembly from pre-made material.

Synesthesia.live is relevant because it treats visual interaction as a serious creative practice and supports advanced audio-reactive visual systems, even though it mainly maps sound into visuals rather than visuals into sound @synesthesia_official_2026 @synesthesia_features_2026. This is important because it demonstrates that visuality in music tools does not have to be superficial. Visual systems can become expressive instruments in their own right, capable of supporting high level creative work. However, Synesthesia.live is ultimately focused on visual performance and audio-reactive output rather than helping users understand or shape sound itself. In this sense, it is not a direct solution to the problem addressed by this project. Its value as a comparison lies in showing that visual interaction can carry real artistic seriousness, while The Shape of Sound inverts the more common audiovisual relationship by using visual interaction as the means of creating and controlling sound.

Together, these products reveal a gap between complex professional tools that offer depth but require significant production literacy, and highly accessible visual tools that remain limited in direct sound design control @imageline_flstudio_home_2026 @ableton_live_manual_welcome_2026 @incredibox_official_2026 @splice_beatmaker_official_2026. This gap is where The Shape of Sound is positioned, as a visual-first and web-based synthesis tool that aims to be approachable without becoming toy-like. The comparisons between the types of existing tools justify the need for a tool that can combine the immediacy of visual interaction with the depth of synthesis control, while also being appealing to users with existing music production experience, not just new users. As shown in @tab-project-comparison, the project occupies a space between beginner-friendly visual immediacy and the deeper synthesis control usually associated with professional tools. By filling this gap, the project can provide a unique and valuable tool for both learning and creative expression in music production.

#figure(
  table(
    columns: (1.6fr, 1.2fr, 1.3fr, 1fr, 1fr, 1.7fr),
    inset: 6pt,
    align: (left, left, left, center, center, left),
    table.header(
      [*Product*],
      [*Platform / type*],
      [*Primary interaction*],
      [*Beginner access*],
      [*Synthesis depth*],
      [*Key relevance to this project*],
    ),
    [FL Studio],
    [Desktop DAW],
    [Pattern, piano-roll, plugin workflow],
    [Low],
    [High],
    [Shows that depth often comes with complexity and a steeper learning curve.],

    [Ableton Live],
    [Desktop DAW],
    [Clip-based and live-oriented workflow],
    [Moderate],
    [High],
    [DAW workflow built on conventional production logic.],

    [Incredibox],
    [Web / app],
    [Visual drag-and-drop loop building],
    [Very high],
    [Low],
    [Demonstrates strong visual immediacy, but limited direct control over sound design.],

    [Splice Beatmaker],
    [Web app],
    [Grid-based sample sequencing],
    [High],
    [Low],
    [Value of low-friction browser creation, sample-driven rather than synthesis-driven.],

    [Synesthesia.live],
    [Desktop audiovisual tool],
    [Audio-reactive visual performance],
    [Moderate],
    [N/A],
    [Visual interaction can be done, but maps in the opposite direction.],

    [The Shape of Sound],
    [Web app],
    [Shape-led visual sound design],
    [High],
    [Moderate],
    [Occupies the space between visual accessibility and meaningful synthesis control.],
  ),
  caption: [Comparison of existing tools and the design space occupied by The Shape of Sound.],
) <tab-project-comparison>

/*
Guidance:
- 800 words
- background research on existing apps related to the project
- advantages and disadvantages of each
- use references
- include a gap analysis table with main features of existing apps and your app
- optionally include a comparison table distinguishing key feature characteristics
*/

== Review of tools, frameworks and techniques

This section reviews the tools, frameworks, and implementation techniques that shaped the development of The Shape of Sound, with a focus on how each choice supported the project's visual, technical, and creative goals. The review is structured around the main technologies used, with discussion of their advantages, limitations, and relevance to the project's aims.

Next.js 15 is most relevant as application infrastructure, giving the project a structured web framework for interface, routing, persistence, and deployment rather than acting as the creative engine itself @vercel_nextjs_docs_2026 @vercel_nextjs15_2024. Next.js provides a solid foundation for building a web application, with features like server-side rendering, API routes, and built-in support for React. However, it is not directly responsible for the core audio-visual interaction design of the project. Its value lies in enabling a well-structured and performant web application that can support the creative features built on top of it. React 19 provides the component and state model for controls, views, and shared interaction logic, but it too does not solve graphics or audio on its own @react_react19_2024. React was essential for organising parameter controls, views, and synchronised interface state, allowing the project to manage a complex interactive UI without losing the modularity needed for iterative development. TypeScript was also important to the project because it provided stronger type safety across UI state, shape parameters, and audio mappings, helping to make the system easier to maintain as it grew in complexity.

Three.js supports the visual-first interface, making 3D form part of the interaction rather than purely decorative presentation @threejs_home_2026 @threejs_manual_2026. Using Three.js introduced extra complexity, but the interactivity of the final result justifies its introduction. Konva.js was a valuable tool as part of the intermediate 2D phase. It supported rapid prototyping, without needing to deal with the added complexity of 3D graphics in the browser @konva_docs_2026. Although the final implementation returned to 3D, Konva proved valuable as an intermediate prototyping stage for simplifying and testing interaction ideas. Its limitation was that it could not support the same sense of spatial richness and sculptural interaction as the final 3D approach.

Tone.js is a Web Audio API wrapper library that provides higher-level abstractions for timing, synths, and effects, making it easier to create complex audio interactions without needing to manage low-level audio nodes directly @tonejs_docs_2026 @tonejs_home_2026. This allowed the project to focus on mapping and interaction design rather than building an audio engine from scratch. However, it is important to note that Tone.js is built on top of the Web Audio API, so the underlying capabilities and constraints of the system still come from native browser audio infrastructure. The Web Audio API therefore remains the true technical foundation of the project's sound engine, even where the higher-level abstractions are used.

Tailwind CSS supported speed and consistency in building the surrounding interface, but it was secondary to the project's actual audiovisual contribution @tailwind_utility_classes_2026. Tailwind primarily supported rapid interface styling, allowing development effort to remain focused on the audiovisual interaction model. It is a useful tool for building a polished interface, but it does not directly contribute to the core creative features of the project. Better Auth is relevant mainly where the project includes accounts and saved work, as it provides infrastructure for user authentication and session management @betterauth_intro_2026. Drizzle ORM in conjunction with Neon's PostgreSQL hosting supports the persistence of user data and saved projects in a flexible and modern way @drizzle_overview_2026 @neon_intro_2026. These tools support user accounts and project persistence, but they remain infrastructure choices rather than central parts of the project's audiovisual interaction design. For exporting sounds, the project uses wasm-media-encoders, which provides a way to encode audio in the browser for export without needing server-side processing @wasm_media_encoders_repo_2026. This is crucial for making the project practical for real creative workflows, as it allows users to export their creations directly from the browser without needing to record the sound themselves. The ability to export is a key part of the project's value proposition, as it allows users to take their creations beyond the live session and use them in other contexts. This makes wasm-media-encoders an important part of the technical stack, as it connects the interactive sound generation to portable output formats that can be used in wider production workflows.

While the previous tools support the wider application, the core behaviour of The Shape of Sound depends on a smaller set of implementation techniques that define how the tool actually works. Visual-to-audio parameter mapping is the most fundamental of these, as it determines how shape properties are connected to synthesis parameters and therefore how the instrument is experienced by the user @hunt2002parameter @tanaka2025mapping. The design of these mappings is crucial, because users need to understand how visual actions affect sound in a way that feels intuitive, learnable, and creatively rewarding. Once these relationships are established, waveform blending and crossfading become important, because audio feedback needs to match visual representation if the instrument is to avoid perceptual jumps @mdn_audioparam_2023 @mdn_linear_ramp_2024. Modulation mapping, such as wobble or tremolo-style behaviour, extends this further by allowing visual movement to become audible behaviour rather than leaving shapes sonically static @tone_tremolo_2026 @mdn_gainnode_2023. In parallel, shape interpolation and morphing support gradual visual transformation, but these changes only become musically convincing when paired with matching sound transformation @alexa2000arap @wolberg1998morphing. Finally, browser-based export workflows are important because a web instrument becomes far more practical when users can record and keep their results rather than only hearing them in-session @mdn_mediarecordingapi_2025 @mdn_createMediaStreamDestination_2025. Taken together, these techniques ensure that The Shape of Sound functions not simply as a visual novelty, but as a coherent instrument whose interaction model is expressive and useful within real creative workflows.

/*
Guidance:
- 800 words
- results of survey on tools, frameworks, and techniques
- technologies chosen for the project
- advantages and disadvantages of programming languages, algorithms, environments, and libraries
- use illustrations, diagrams, and screenshots to support your purpose
*/

]
