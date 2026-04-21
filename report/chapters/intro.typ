#let intro = [
= Introduction

The Shape of Sound is a practice-led project exploring a visual approach to audio synthesis through interactive shape manipulation. The project addresses two linked issues in music software: accessibility barriers for beginners and limited creative flexibility in many simplified tools. The primary purpose is education, the project is designed to help new users understand synthesis through direct visual interaction and immediate feedback, rather than being overwhelmed with technical jargon. The secondary purpose is creative support for experienced users by offering an alternative workflow for rapid idea generation. The project is positioned as HCI work, linking interface design choices to creative and learning outcomes.

== Problem Statement

Studies of contemporary music artists identify "musician's block" as a common phenomenon @nair2025musiciansblock, often linked to music-making anxiety and challenges within the creative process. As shown in @fig-top-music-production-struggles, the top self-reported struggle is not knowing "where to start". This is particularly common for beginners, who often find themselves overwhelmed by the technical complexity of music software, with a steep learning curve that requires understanding abstract concepts before engaging in creative expression. For many new users, this complexity is not only about the number of available features, but about the way those features are presented. Concepts such as waveform, envelope, modulation, routing, and timbre are often introduced through unfamiliar terms and parameter-heavy interfaces, requiring users to learn technical language before they feel able to make something expressive. This can make early interaction feel more like studying software than creating music. As a result, the first experience of sound design is often shaped by uncertainty and hesitation rather than curiosity and experimentation. Even experienced producers can get stuck in creative blocks when they use the same environment repeatedly @karanyi2023creativeblock, leading to stagnation and reduced motivation. This problem is not limited to beginners. Experienced producers may have the technical skills to work fluently within established digital audio workstations, but this familiarity can also make their creative process repetitive. When the same tools, menus, and workflows are used repeatedly, the process of sound design can become predictable rather than exploratory. In this context, a different interaction model is valuable not because it replaces professional tools, but because it can interrupt routine and create space for fresh ideas to emerge.

From my own research, I found that \~66% of beginners surveyed felt that music production software seems too complicated or intimidating (see @fig-daw-complicated). This is a significant barrier to entry, and it highlights the need for more accessible tools that can help users learn and create without being overwhelmed by technical details. It is often discussed that it takes around 10,000 hours of deliberate practice to achieve mastery in a field @gladwell2008, but this can be discouraging for beginners who may not have the time or resources to invest in such a long learning process. These barriers can also limit who feels able to participate in music production at all, narrowing access to creative technology for those who do not already have the confidence, time, or background knowledge to engage with complex software. One possible response to these barriers is to make sound design more visually legible. A visual-first interface can give users an immediate sense of cause and effect, allowing them to explore sound through shape, colour, movement, and spatial change rather than through technical terminology alone. This does not remove the complexity of synthesis itself, but it may make that complexity easier to approach by grounding it in direct interaction and immediate feedback. These barriers therefore suggest a need for more intuitive, engaging, and accessible approaches to early-stage sound design that support both learning and sustained creative engagement.

#figure(
  image("../figures/top-music-production-struggles.webp", width: 100%),
  caption: [Top self-reported music production struggles from an EDMProd survey of 1000+ producers @edmprod2019struggles.],
) <fig-top-music-production-struggles>

#figure(
  image("../figures/DAWs-complicated.png", width: 100%),
  caption: [Results of my beginner survey on music production, "Have you ever felt that music production software seems too complicated or intimidating".],
) <fig-daw-complicated>

/*
Guidance:
- 500 words
- background on the problem
- justify need for the app
- use references to support statements
- stats
- illustrations
- diagrams
- figures
*/

== Aims and objectives

// aims
The Shape of Sound addresses the need for a more intuitive, engaging and accessible approach to early-stage sound design, by providing a simple starting point and a visual method of sound creation, with the aim of reducing barriers to entry while supporting creative expression for both beginners and experienced producers. The project aims to achieve this by developing a web-based application that allows users to manipulate visual properties of a shape and receive immediate sonic feedback, turning synthesis into a more exploratory and engaging process. The project also aims to assess the effectiveness of this approach through user testing and evaluation, with the goal of demonstrating that a synesthetic, visual-first interface can make sound synthesis more intuitive without reducing creative depth and technical possibilities.

// objectives

A key objective is to investigate how visual properties of a shape can be meaningfully mapped to audio synthesis parameters, drawing on ideas from synesthesia, multisensory experience, and accessible music making. This will involve exploring the visual attributes of shapes (e.g. size, color, shape, movement) and how they can correspond to sound parameters (e.g. gain, pitch, waveform, modulation) in a way that is intuitive, interactive and engaging to users. The project will take form as a web application that allows users to manipulate visual properties of a shape and receive immediate sonic feedback, turning synthesis into an exploratory and novel process, hoping to prove that the visual-first model can reduce the perceived complexity of music production and synthesis as a whole. It should make core sound design concepts more approachable for beginners. The project will also explore how viable a visual-first approach to music production technology can be. This will be evaluated through user testing and reflective analysis, with the goal of demonstrating that a new interface can make audio synthesis more intuitive without harming the creative potential of the tool. Identifying the strengths, limitations, and future development opportunities of the approach will be a key contribution to practice-based HCI research, with the potential to influence innovation in music technology design and education. 

/*
Guidance:
- 300 words
- aims: a few sentences to describe the purpose and intention of the app
- aims: what is the point of developing the app?
- aims: what do you wish to achieve with the app?
- objectives: individual steps you will take to fulfill the above aims
*/
]
