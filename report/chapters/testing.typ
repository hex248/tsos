#let testing = [
= Testing

/*
Guidance:
- sufficient test cases to ensure the app meets the requirements and functions correctly
*/

== Functional testing

Functional testing was used to evaluate whether the final application met its main requirements and behaved correctly from the perspective of the user. Because The Shape of Sound is an interactive web application, this testing focused primarily on black-box behaviour: whether core actions produced the expected outputs when used through the interface. The purpose of this stage was to confirm that the implemented features worked reliably across the main user-facing flows, including sound creation, parameter control, key and scale interaction, persistence, export, and access behaviour.

The functional test cases were derived directly from the core requirements established earlier in the project, which allowed the testing process to remain clearly linked to the intended behaviour of the final system. In practice, this meant testing the application through the same actions a user would perform, rather than testing isolated internal functions in abstraction. The emphasis was therefore on requirement coverage and observable behaviour, with each test case checking whether a complete feature or flow performed as expected. This approach was appropriate because the success of the application depends not only on internal correctness, but on whether the implemented features behave consistently and reliably when used through the interface.

Although the testing strategy was mainly black-box in nature, some white-box awareness still informed the choice of test cases. The application contains distinct technical areas such as audiovisual state mapping, authenticated persistence, local draft storage, schema validation, and browser-side export, and knowledge of these internal responsibilities helped determine which user-facing behaviours needed explicit verification. For example, persistence was not treated as a single feature, but as a set of related flows involving browser storage, API routes, validation, ownership checks, and database-backed records. In the same way, export testing needed to cover both the user-facing options in the dialog and the successful production of downloadable output files. This balance kept the tests grounded in real use while still ensuring that implementation-sensitive behaviour was not overlooked.

The tests were carried out in the browser environment in which the application is actually intended to be used. This was important because the system depends on the interaction between UI controls, shared state, browser audio behaviour, authentication state, and file generation rather than on isolated computational output alone. Test cases were therefore performed through the live interface, with both signed-in and signed-out conditions used where relevant. This allowed persistence, guest draft behaviour, public access, and export to be checked in the same environment in which real users would encounter them. Using the running application in this way helped ensure that the results reflected practical system behaviour rather than only isolated code-level correctness.

#figure(
  table(
    columns: (0.6fr, 1.3fr, 2.2fr, 1.8fr, 0.65fr),
    inset: 5pt,
    align: (left, left, left, left, center),
    table.header(
      [*Test*],
      [*Requirement*],
      [*Test case*],
      [*Expected result*],
      [*Result*],
    ),
    [FT-01],
    [Core sound creation],
    [Change shape preset and confirm the sound character updates.],
    [Preset change updates the mapped waveform behaviour.],
    [✓],

    [FT-02],
    [Visual parameter controls],
    [Adjust size, roundness, and wobble controls during playback.],
    [Audio output responds immediately to each control change.],
    [✓],

    [FT-03],
    [Pitch interaction],
    [Select different colours/notes and octave values.],
    [Pitch changes correctly according to note and octave.],
    [✓],

    [FT-04],
    [Key lock / scale],
    [Enable key lock and play notes from the keyboard.],
    [Input is constrained to the selected key and scale.],
    [✓],

    [FT-05],
    [Persistence],
    [Save an idea while authenticated, then reload it.],
    [Saved configuration is restored correctly.],
    [✓],

    [FT-06],
    [Guest draft support],
    [Use the editor while signed out and revisit the draft state.],
    [Local draft remains available for continued use.],
    [✓],

    [FT-07],
    [Export],
    [Export the current sound in WAV and MP3 formats.],
    [Audio file downloads successfully in the selected format.],
    [✓],

    [FT-08],
    [Public access / sharing],
    [Open a saved public idea by URL while not signed in.],
    [Idea loads for playback while editing remains restricted.],
    [✓],
  ),
  caption: [Functional test plan and outcomes for the final application.],
) <tab-functional-test-plan>

The results shown in @tab-functional-test-plan indicate that the main functional requirements of the application were met in the final version of the system. Core sound creation, parameter manipulation, note and scale behaviour, persistence, export, and public access flows all performed as expected when tested through the interface. These results provide evidence that the implemented features behave reliably and that the system is technically capable of supporting its intended use cases. However, it is important to note that functional testing alone does not measure the usability or creative quality of the application. While the features may work correctly from a technical standpoint, this does not necessarily mean that they provide a satisfying or effective user experience. Functional testing was therefore an important step in confirming that later user evaluation could focus on experience and usefulness rather than on unresolved implementation failures.

Functional testing was also carried out iteratively rather than only once at the end of development. As features such as key-lock behaviour, save and load flows, export options, and public idea access were added or refined, the relevant tests were repeated to check that new work had not broken previously working behaviour. This form of regression checking was especially important in a browser-based system where UI changes, state updates, persistence logic, and audio behaviour are closely connected. Running these checks through the live interface also helped confirm that the application behaved correctly in the same environment in which it was intended to be used. In this sense, the functional testing process did not only produce a final set of pass results, but also supported stability throughout development.

/*
Guidance:
- 800 words
- discuss black box and/or white box testing in relation to requirements
- include specific test cases labelled by relevant requirements
- use standard test plan template to document test results
*/

== User testing

User testing was used to evaluate how the final output performed as an interactive creative tool, rather than only as a technically correct application. This was important because the aims of The Shape of Sound go beyond its feature-set: the project is also concerned with whether sound design feels approachable, intuitive, and creatively useful when experienced through a visual interface. For this reason, user testing focused on usability, perceived intuitiveness, approachability, and creative value.

The evaluation involved five participants, consisting of three beginners and two experienced producers. This split was appropriate because the project was designed for two main user groups: users with little or no prior experience of music production, and users who already work with conventional production tools. Beginner participants were important for testing accessibility and first-use clarity, while experienced producers were important for judging whether the application offered meaningful value as a creative workflow rather than only as a simplified educational tool.

Participants were asked to complete a small set of tasks using the live application, including creating a sound, changing the shape and describing the resulting audio change, making a short melody, using the key-lock feature, and exporting the result. After completing these tasks, they filled in a short questionnaire using a five-point scale and written feedback prompts. This approach made it possible to collect both structured results and more reflective comments. The summary below includes the completed responses gathered during this stage of evaluation.

#figure(
  table(
    columns: (0.7fr, 1.2fr, 0.5fr, 0.6fr, 0.9fr, 0.5fr, 0.6fr, 0.9fr),
    inset: 4pt,
    align: (left, left, center, center, center, center, center, center),
    table.header(
      [*Person*],
      [*Experience*],
      [*Easy*],
      [*Intuit.*],
      [*Approach.*],
      [*Key*],
      [*Useful*],
      [*Reusability*],
    ),
    [A], [Beginner], [5], [4], [5], [5], [5], [5],
    [B], [Beginner], [4], [4], [5], [5], [4], [4],
    [C], [Experienced], [4], [5], [4], [4], [5], [5],
    [D], [Beginner], [3], [4], [4], [5], [4], [4],
    [E], [Experienced], [4], [4], [4], [4], [5], [5],
    [AVG], [Mixed], [4.0], [4.2], [4.4], [4.6], [4.6], [4.6],
  ),
  caption: [Summary of user testing questionnaire ratings.],
) <tab-user-testing-ratings>

#figure(
  table(
    columns: (0.6fr, 5fr),
    inset: 4pt,
    align: (left, left),
    table.header(
      [*Person*],
      [*Key feedback*],
    ),
    [A], [Dragging the control points was not always clear, and the keyboard view could better show which notes remain available when key lock is active.],
    [B], [The controls became clearer after experimentation, and the key lock helped make something musical quickly.],
    [C], [The shape interface was useful for exploring sound ideas, but some parameter ranges could be clearer.],
    [D], [The first-use flow was less obvious, but experimentation became easier after understanding the main controls.],
    [E], [The tool felt strongest as a creative sketchpad, though the visual mapping to familiar synth ideas could be clearer.],
  ),
  caption: [Summary of key feedback from user testing.],
) <tab-user-testing-feedback>

The ratings shown in @tab-user-testing-ratings suggest that the application performed well across both beginner and experienced participants. The average scores are consistently high, with approachability, creative usefulness, and reusability all scoring above 4.0, and key-lock receiving the strongest average rating at 4.6. This is significant because it suggests that the system was not only understandable, but also practically useful during melodic experimentation. The slightly lower average for ease of understanding indicates that the interface still requires some onboarding, but the overall pattern suggests that participants were generally able to learn the system quickly and derive value from it. The results also show that the tool was appreciated by both intended user groups, rather than appealing only to beginners or only to experienced producers.

The feedback in @tab-user-testing-feedback provides a more detailed view of where the design is already successful and where it still needs refinement. Positive comments consistently focused on the immediacy of the interaction, the ease of experimenting with sound, and the usefulness of the application as a sketchpad for generating ideas. This aligns well with the project's aim of supporting creative exploration through a visual-first workflow. At the same time, several responses pointed to issues of clarity, particularly around control-point interaction, keyboard visibility during key-lock use, first-use guidance, and the visibility of parameter ranges. These comments suggest that the main remaining weaknesses are not in the core concept itself, but in how clearly the interface communicates that concept to the user. This is valuable because it directs further refinement toward onboarding, clarity, and visual explanation rather than requiring a redesign of the core interaction model.

Taken together, the user testing indicates that The Shape of Sound is already functioning effectively as both an accessible introduction to sound design and a creatively useful experimental tool. The strongest areas appear to be approachability, melodic support through key lock, and the sense of creative usefulness reported by participants. The weaker areas are more closely related to first-use communication and control clarity. As a result, the findings from this stage of testing support the overall direction of the project while also identifying concrete areas for improvement in later refinement.

/*
Guidance:
- 800 words
- describe how output was tested and why
- discuss how you obtained and used feedback (expert/non-expert users)
*/
]
