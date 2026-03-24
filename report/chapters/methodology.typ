#let methodology = [
= Methodology

This project followed an iterative prototyping methodology within a broader practice-led and agile development process. This approach was appropriate because the central challenges of The Shape of Sound were not only technical, but also interactive and experiential, requiring ideas to be tested through repeated design, implementation, and revision. Rather than treating development as a sequence of fixed steps, the project evolved through cycles of prototyping and reflection, allowing the visual-to-audio interaction model to be refined over time. At a higher level, the work still followed clear project stages, including research, requirements elicitation, interface design, core development, and testing.

Alongside this iterative approach, the project was also organised through a higher-level staged plan, represented in the Gantt chart shown in @fig-methodology-gantt. This structure divided the work into clear phases, including research, requirements elicitation, interface design, core development, testing and refinement, and final delivery. The staged plan was useful for setting milestones, managing scope, and maintaining progress across the different phases of the project. However, these phases were not carried out as strictly isolated steps. Instead, each stage involved smaller cycles of experimentation, reflection, and revision, allowing the project to remain agile while still following a clear overall timeline.

#figure(
  image("../figures/gantt.png", width: 100%),
  caption: [High-level project timeline and milestones.],
) <fig-methodology-gantt>

This iterative process is reflected clearly in the design evolution of the project. The initial direction focused on a 3D implementation, as this best matched the ambition of creating a visually expressive interface for sound design. However, during development it became useful to simplify the interaction model through a 2D Konva-based stage, which made it easier to test core ideas such as shape manipulation, mapping behaviour, and overall usability without the added complexity of 3D scene management. Once these interaction principles became clearer, the project returned to a final 3D implementation. This return was not simply a reversal, but the result of iterative refinement, where lessons from the simplified 2D stage informed a more grounded and purposeful 3D design.

UX and UI considerations were especially important in this methodology because the project is centred on the design of an interactive experience rather than a purely technical system. Beginner accessibility was a key goal, meaning that the interface needed to feel intuitive, clear, and easy to learn without prior knowledge of digital audio workstations or synthesis terminology. At the same time, the system also needed to remain meaningful for experienced producers, who would already be familiar with conventional controls such as sliders and knobs. For this reason, the interface was designed not as a replacement for professional tools, but as an alternative workflow that could still support serious creative exploration. Immediate audio-visual feedback was also essential, since users needed to understand the effect of their actions as they manipulated the shape in real time. These considerations influenced the simplification of the interface, the clarity of the visual language, and the design of the mapping model itself.

Testing also took place informally throughout development, rather than being confined to a single final stage. Both beginner users and experienced producers were asked to use the application during different stages of development, and their interactions were observed in order to identify weaknesses in the UI and UX. This allowed practical issues to be addressed as they emerged, making testing part of the iterative design process rather than something applied only after implementation. For example, one user suggested the ability to lock notes into a key so that melodies could be created more easily without drifting out of tune. This feature was later implemented, as it strongly supports the ideation stage of music production and makes the system more approachable for users who may not have strong music theory knowledge. In this way, informal user feedback directly influenced refinements to both the functionality and the usability of the project.

This testing approach is suitable for the project because The Shape of Sound is intended to serve two distinct but related user groups: beginners who need an accessible and unintimidating introduction to sound design, and experienced producers who may value the tool as a fresh creative workflow. Testing with beginner users helps evaluate whether the interface is intuitive, whether the visual mappings make sense without prior technical knowledge, and whether the system reduces the intimidation often associated with traditional music software. Testing with more experienced producers is equally important, as it helps assess whether the tool offers genuine creative value rather than functioning only as a simplified educational exercise. Using both groups therefore reflects the dual aims of the project, allowing the methodology to evaluate not only usability and learnability, but also the broader creative usefulness of the tool.

Overall, this methodology was well suited to the aims of the project because it allowed technical development, interaction design, and user feedback to inform one another throughout the process. The staged plan provided structure and clear milestones, while iterative prototyping made it possible to refine the tool in response to practical findings as development progressed. This was particularly important for a project whose success depended not only on technical implementation, but on whether the interface felt intuitive, expressive, and educational in use. By combining structured planning with iterative design and user-centred evaluation, the methodology supported the development of a tool that could be shaped gradually in relation to both its creative goals and its intended users.

#text(fill: red)[unfinished: this section still needs a more formal testing and evaluation paragraph once the structured testing stage has been completed. also not quite long enough]

/*
- methodology framed as iterative prototyping within a broader staged final-year project structure.
- overall process described as agile in practice, but mapped against a higher-level formal schedule for planning and academic delivery.
- key project stages to discuss:
  - research
  - requirements elicitation
  - UI design
  - core development
  - testing and refinement
  - final delivery
- explain that each stage contained multiple iterations rather than a single one-pass implementation.
- discuss how iterative prototyping suited a practice-led project where design knowledge emerged through making, testing, and revising the artefact.
- include the design evolution as part of the methodology:
  - initial 3D direction
  - move to 2D Konva phase for simplification and testing
  - return to final 3D implementation once interaction ideas were clearer
- UX/UI considerations to mention:
  - beginner accessibility
  - immediate audio-visual feedback
  - reducing intimidation
  - creative exploration
  - visual clarity
  - educational value
- testing methodology should include:
  - usability evaluation
  - user testing with beginners
  - user testing with experienced producers
  - explanation of why these groups were chosen and what each group helps evaluate
- explain why this testing approach is suitable:
  - beginners help evaluate intuitiveness and accessibility
  - experienced producers help evaluate creative usefulness and depth
  - together they reflect the two main intended user groups of the project
- include a note that the formal timeline is represented through a Gantt chart, while the real implementation work progressed through smaller iterative cycles inside those milestones.
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
