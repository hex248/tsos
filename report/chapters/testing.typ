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

/*
Guidance:
- 800 words
- describe how output was tested and why
- discuss how you obtained and used feedback (expert/non-expert users)
*/
]
