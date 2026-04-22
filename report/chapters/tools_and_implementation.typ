#let tools_and_implementation = [
= Tools and Implementation

== Tools used and justification

The implementation of The Shape of Sound required a stack that could support a visual-first interface, real-time browser-based sound synthesis, and the wider infrastructure of a complete web product. For this reason, the tools used in the project were chosen not only for technical capability, but also for how well they supported accessibility, creative exploration, persistence, and export.

The frontend application was built with Next.js, React 19, and TypeScript. Next.js was suitable because the project needed more than a self-contained interaction demo: it also required routing, API endpoints, account-related functionality, persistence flows, and a clear application structure around the audiovisual core @vercel_nextjs_docs_2026. React supported the project through its component model and state management patterns, making it easier to organise interactive controls, shared state, and the overall layout of the interface @react_react19_2024. TypeScript added stronger type safety across shape state, audio mappings, persistence models, and API data, helping the system remain maintainable as its complexity increased @typescript_docs. This part of the stack also aligned well with my existing experience in React-based web development, which reduced the need for unnecessary framework learning.

For visual interaction, the final system uses Three.js to render the main shape interface in 3D. This was an important choice because the project depends on visual form being central to the interaction model, and a 3D environment allows the shape to feel more spatial and expressive than a flatter 2D presentation @threejs_manual_2026. During development, a 2D Konva-based phase was also explored as a way to simplify the interface and test interaction ideas more quickly @konva_docs_2026. That stage was useful for clarifying usability and mapping behaviour, but the final return to Three.js made it possible to recover the visual richness that better matched the intended identity of the project.

For audio, the project uses Tone.js alongside the native Web Audio API. Tone.js was a practical choice because it provides higher-level abstractions for synthesis, timing, and musical behaviour, making it possible to build and test sound features more quickly than would have been practical with raw browser audio code alone @tonejs_docs_2026. This was especially helpful because the main challenge of the project was not building a synthesis engine from first principles, but designing meaningful mappings between visual interaction and sound. At the same time, the Web Audio API remains the technical foundation of the audio system, since Tone.js still depends on browser-native audio infrastructure @w3c_webaudio11_2024.

Several supporting tools were also used to turn the project into a complete product rather than only an interaction prototype. Tailwind CSS supported rapid and consistent interface styling @tailwind_utility_classes_2026. Better Auth handled authentication and session management, while Drizzle ORM, PostgreSQL, and Neon provided the persistence layer for saved ideas and user data @betterauth_intro_2026 @drizzle_overview_2026 @neon_intro_2026. Zod was used to validate schemas and request payloads @zod_docs, and wasm-media-encoders made browser-generated sounds portable beyond the live session through export @wasm_media_encoders_repo_2026. Although these tools were not the centre of the project's creative contribution, they were justified because they supported the final product scope and improved the reliability and usability of the system.

This part of the project involved a mixture of existing skills and new learning. Prior experience with React-based web development, TypeScript, and general full-stack application structure made it possible to work confidently with the broader application framework. However, the project also required deeper development in browser-based audio, visual interaction design, shape-to-sound mapping, and browser-side export. This combination of familiar tools and new technical challenges was appropriate for the project, as it kept the implementation feasible while still supporting genuine skill development.

/*
Guidance:
- 500 words
- tools: programming language, environment, frameworks, libraries
- justify choices with references to use case and requirements
- state existing skills development and any new skills acquired for the project
*/

== Implementation

This section explains how the final system was implemented through the main use cases of the application, rather than describing the codebase file by file. The focus is on how the core interaction model, persistence features, and export workflow were translated into working code, and how these implementation decisions reflect the design choices discussed in the previous chapter.

The most important use case is the creation and shaping of a sound through direct interaction with the visual editor. This behaviour is centred on a shared shape state model that stores the current sound-design values, including preset, colour, roundness, size, wobble, envelope settings, octave, and scale information. In practice, this means that the same state can drive both the visible behaviour of the shape and the audible behaviour of the synthesizer, keeping the interaction model coherent. When a user changes a control, such as the preset selector, colour keyboard, or roundness slider, the editor updates the shared state and then either triggers or prepares a preview sound using the current mapped values. The canvas, control panel, and preview audio are therefore synchronised through the same state rather than treated as separate systems. This is important because the implementation needs to preserve the central design goal of immediate audio-visual feedback: a change in the interface must feel like a change in the instrument itself, not a delayed or disconnected update.

At the audio level, these state values are not used directly. Instead, they are translated through a set of mapping functions into synthesizer behaviour that Tone.js can apply consistently across preview and export. The selected preset determines the base oscillator type, roundness controls the crossfade toward a smoother sine-based tone, and size is converted into gain so that visual scale affects perceived loudness. Envelope values are mapped into attack, hold, decay, and sustain timings, while wobble and wobble speed become tremolo depth and rate. In this way, the implementation keeps a clear separation between user-facing controls and low-level sound behaviour: users interact with meaningful visual properties, while the synthesizer receives the mapped values needed to produce coherent audio output.

A simplified example of this mapping layer is shown below:

```ts
export function mapPresetToOscType(preset: Preset): "sawtooth" | "square" {
    switch (preset) {
        case "triangle":
            return "sawtooth";
        case "square":
            return "square";
    }
}

export function mapRoundnessToFade(roundness: number): number {
    return clamp01(roundness / 100);
}

export function mapSizeToGain(size: number): number {
    const minDb = -30;
    const maxDb = -6;
    const t = clamp01(size / 100);
    return minDb + (maxDb - minDb) * t;
}

function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}

```

In practice, preview playback is built around a small collection of audio nodes that are assembled each time a note or sample is played. The implementation creates a primary oscillator, a secondary sine oscillator, a crossfade node, and gain stages for envelope shaping and tremolo behaviour. This structure is important because it mirrors the design of the interaction model: the shape preset selects the main oscillator character, and roundness blends it toward a smoother sine tone. The resulting signal then passes through gain stages that apply the envelope and modulation behaviour before reaching the output. Each part of the signal chain therefore reflects a clear aspect of the user-facing design, and the same implementation pattern can be reused when previewing notes, holding sustained playback, or rendering exports.

A simplified version of the central state model is shown below:

```ts
export type Preset = "triangle" | "square";

export interface IdeaSoundConfig {
    preset: Preset;
    roundness: number; // 0-100, controls morph from sharp to round
    size: number; // 0-100, controls volume
    wobble: number; // 0-100, shared visual wobble and tremolo depth
    wobbleSpeed: number; // 0-100, shared animation and tremolo speed
    wobbleRandomness: number;
    grain: number; // 0-100, noise mix
    attack: number; // 0-100, envelope attack time
    hold: number; // 0-100, envelope hold time
    decay: number; // 0-100, envelope decay time
    sustain: number; // 0-100, envelope sustain level
    color: string; // hex color from clavier keyboard
    octave: number; // 1-8, frequency multiplier
    keyRoot: NoteName | null;
    scaleType: ScaleType;
}

export interface EditorShapeState extends IdeaSoundConfig {
    x: number;
    y: number;
}
```

Another important use case is note input and scale-aware interaction. The editor supports direct note entry through both the colour keyboard and mapped computer-keyboard controls, allowing users to move beyond single note exploration into short melodic ideas. In this part of the implementation, colour is not only a visual choice but also a pitch selection system, since each colour corresponds to a note. The key-lock and scale-selection features extend this by remapping note input so that users can stay within a chosen major or minor scale. This reduces friction during composition, particularly for beginners who may not have strong music theory knowledge, while still remaining useful for experienced producers during rapid ideation. In implementation terms, this behaviour is handled through scale-note generation, note-in-scale checks, and diatonic remapping of keyboard input, allowing the interface to preserve musical constraints without interrupting the nature of the interaction.

```text
if key lock is off:
  play the selected note and octave directly
else:
  generate notes in the selected scale
  remap keyboard input to the nearest scale note position
  play the remapped note within the current octave range
```

Persistence is implemented through two related flows: local drafts for unauthenticated users and database-backed `Idea` records for authenticated users. While exploring the editor on the root page, users who are not signed in can still have their current sound preserved through a lightweight local draft system stored in the browser. Once authenticated, users can create, update, load, and delete saved ideas through API routes backed by validated request schemas and database persistence. This implementation is important because it allows the product to remain approachable for casual experimentation while still supporting longer-term ownership and reuse of work. In practice, the sound editor state is converted into a reusable sound-configuration object, validated with Zod, and then either stored locally or sent through the ideas API for persistence in PostgreSQL. This means the same core sound representation can move across guest use, authenticated saving, public viewing, and later editing without needing separate implementations for each mode.

In implementation terms, this flow is split deliberately between client-side convenience and server-side persistence. Local drafts are stored through a small browser storage layer, where the current sound configuration is converted into a lightweight draft record, validated against a schema, sorted by save time, and limited to the most recent draft. This keeps casual use simple while preventing local draft storage from expanding unnecessarily. For authenticated users, persistence moves through the API layer, where requests are validated with Zod before the database is touched, and ownership is checked before records can be updated or deleted. The server exposes separate routes for listing ideas, creating new records, reading a public or owned record, updating existing ideas, deleting them, and importing local drafts after sign-in. This separation is valuable because it means guest experimentation, authenticated ownership, and public sharing can all be supported through the same underlying sound configuration model, while still preserving clear boundaries between temporary local state and durable saved data.

A snippet showing the persisted `Idea` schema is shown below:

```ts
export const idea = pgTable("ideas", {
  id: uuid("id").primaryKey(),
  ownerUserId: text("owner_user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull(),
  config: jsonb("config").$type<IdeaSoundConfig>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).notNull(),
}, (table) => ({
  ownerUpdatedIndex: index("ideas_owner_updated_idx").on(table.ownerUserId, table.updatedAt),
}));
```

The final user-facing flow is export, which allows the generated sound to move beyond live interaction in the browser and into wider music-making workflows. This was implemented through an export dialog that lets the user choose format and whether the current envelope settings should be applied. Under the hood, the current state is rendered offline into an audio buffer rather than being recorded from live playback, which produces a cleaner and more controlled export path. The resulting buffer is then encoded as WAV or MP3 and downloaded directly in the browser. This implementation is important because it turns the application from a purely exploratory interface into a practical creative tool, allowing users to keep and reuse the sounds they create. In this way, export is not only a convenience feature, but part of how the application supports real ideation and integration with broader production workflows.

The choice to render offline rather than record the live output was important because it keeps the export pipeline deterministic and independent of playback conditions in the browser. Instead of capturing whatever happens to be playing in real time, the implementation reconstructs the current sound state in an offline render, applies the selected note, waveform blend, gain, and optional envelope, and then generates a fresh audio buffer specifically for export. This makes the result more predictable and avoids issues that could arise from live preview behaviour, timing differences, or muted output. The export dialog also exposes practical options that reflect different producer workflows: WAV is useful as an uncompressed format, MP3 offers a smaller portable file, and the option to apply or omit the current envelope lets users choose between a shaped sound or a drier sample that can be processed later in another environment. This means the export system is closely tied to the project's goal of supporting creativity beyond the browser session, not just technically producing a file.

Across these use cases, several shared implementation techniques appear repeatedly. Visual-to-audio mapping functions translate editor values such as preset, roundness, size, and wobble into synthesis behaviour, allowing the code to keep the interaction model consistent across preview, playback, and export. Crossfading and parameter automation are used so that visual changes can produce smooth sonic transitions rather than abrupt jumps, while tremolo-style modulation makes visible movement audibly active. Validation also plays an important role, as Zod schemas are used to keep saved idea payloads consistent before they are written to persistence layers or exposed through API responses. Where requests modify stored data, server-side rate limiting is also applied so that persistence features remain more robust and less open to abuse. These shared techniques are important because they allow the system to behave consistently across different features, while keeping the core experience of the instrument coherent for the user.

One important implementation decision was to isolate the mapping logic into a dedicated layer rather than embedding it directly into UI components or synthesis setup code. Functions such as preset-to-waveform mapping, roundness-to-crossfade mapping, size-to-gain mapping, and wobble-to-tremolo mapping make it possible for the same interaction rules to be reused whenever sound is previewed, played, or exported. This helps preserve consistency across the system and makes the code easier to reason about, because the visual editor does not need to know the low-level audio values required by the synthesizer. In a similar way, crossfading and parameter automation are used to preserve continuity between visual and sonic change, so that smooth changes in the shape correspond to smooth changes in timbre or amplitude rather than abrupt jumps.

Validation and request protection form another shared layer of implementation. Zod schemas are used to describe the expected shape of saved sound configurations, local draft payloads, and API requests, which means invalid data can be rejected before it reaches persistence or public responses. This is especially important in a system where the same sound configuration must move across browser state, local drafts, authenticated records, and exports. Server-side rate limiting is applied to write-heavy routes such as create, update, delete, and local-draft import, which helps keep these features more robust in practice. Although these techniques are less visible than the audiovisual interaction itself, they are essential in making the final application reliable and coherent as a product rather than only as a prototype.

Not all parts of the implementation were invented from scratch, and it is important to distinguish custom project logic from standard technical patterns. The application uses established approaches taken from official documentation and common library usage for areas such as Next.js route handlers, Drizzle schema design, browser audio handling, and export workflows. In these cases, the code follows recognised implementation patterns because they are reliable and appropriate to the tools being used. The more original contribution of the project lies in how these established technologies were combined with a custom interaction model, especially in the shape-to-sound mappings, the synchronisation of visual and audio behaviour, and the design of a visual-first synthesis workflow.

Taken together, the implementation reflects the main aims of the project by turning the design into a system that is interactive, understandable, and practically usable. The code does not only support real-time audiovisual behaviour, but also persistence, export, and multiple modes of use across guest and authenticated interaction. Organising the implementation by use case makes it clear that the application was built around what users need to do with the system, rather than around isolated technical components. In this way, the implementation supports the project's broader goals of accessibility, creative exploration, and usable browser-based sound design.

/*
Guidance:
- 2500 words
- explain implementation of main code by use case
- pseudocode
- snippets of code
- highlight code that is adopted/adapted and give original sources
- make references to design documentation where appropriate
*/
]
