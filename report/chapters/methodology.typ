#let methodology = [
= Methodology

This project followed an iterative prototyping methodology within a broader practice-led and agile development process. This approach was appropriate because the central challenges of The Shape of Sound were not only technical, but also interactive and experiential, requiring ideas to be tested through repeated design, implementation, and revision. Rather than treating development as a sequence of fixed steps, the project evolved through cycles of prototyping and reflection, allowing the visual-to-audio interaction model to be refined over time. At a higher level, the work still followed clear project stages, including research, requirements elicitation, interface design, core development, and testing.

Alongside this iterative approach, the project was also organised through a higher-level staged plan, represented in the Gantt chart shown in @fig-methodology-gantt. This structure divided the work into clear phases, including research, requirements elicitation, interface design, core development, testing and refinement, and final delivery. The staged plan was useful for setting milestones, managing scope, and maintaining progress across the different phases of the project. However, these phases were not carried out as strictly isolated steps. Instead, each stage involved smaller cycles of experimentation, reflection, and revision, allowing the project to remain agile while still following a clear overall timeline.

#figure(
  image("../figures/gantt.png", width: 100%),
  caption: [High-level project timeline and milestones.],
) <fig-methodology-gantt>

This iterative process is reflected clearly in the design evolution of the project. The initial direction focused on a 3D implementation, as this best matched the ambition of creating a visually expressive interface for sound design. However, during development it became useful to simplify the interaction model through a 2D Konva-based stage, which made it easier to test core ideas such as shape manipulation, mapping behaviour, and overall usability without the added complexity of 3D scene management. Once these interaction principles became clearer, the project returned to a final 3D implementation. This return was not simply a reversal, but the result of iterative refinement, where lessons from the simplified 2D stage informed a more grounded and purposeful 3D design.

/*
ux/ui was important because:
- the project is focused on creating an interactive experience
- beginner accessibility was a key goal. the interface needs to be intuitive and easy to learn
- experienced producers who use it will be familiar with dials and sliders to control their sounds,
- beginners may not have experience with DAWs, so it must be approachable
- it has to be unintimidating
- the goal is for users to learn, so the interface needs to be clear and informative
these considerations influenced interface simplification and mapping choices
*/

/*
Guidance:
- 1000 words
- life cycle stages of project, methodology, and development techniques
- include examples such as a gantt chart and agile key steps/milestones
- discuss implementation of project
- considerations for ux/ui
- testing methodology
- discuss why chosen testing methodology is suitable for this project
- even if using agile, include a high-level waterfall plan with key milestones
*/
]
