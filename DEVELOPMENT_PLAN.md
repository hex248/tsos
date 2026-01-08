# TSOS Development Plan

A synth visualizer where the shape _is_ the sound.

## Overview

The user manipulates a morphable shape that directly controls audio synthesis parameters. The shape can morph between triangle (sawtooth), square, and circle (sine) waveforms, with additional controls for wobble, grain, size (volume), and color (pitch via Clavier à lumières).

---

## Tech Stack

| Purpose              | Library                              |
| -------------------- | ------------------------------------ |
| Canvas & Interaction | `react-konva`, `konva`               |
| Audio Synthesis      | `tone`                               |
| Noise Generation     | `simplex-noise`                      |
| UI Components        | `shadcn/ui` (button, slider, toggle) |

---

## Shape ↔ Sound Mapping

| Shape Property | Sound Parameter       | Range                    |
| -------------- | --------------------- | ------------------------ |
| `preset`       | Oscillator A type     | sawtooth / square / sine |
| `roundness`    | Crossfade A↔B         | 0-100 (preset → sine)    |
| `size`         | Gain (volume)         | 0-100                    |
| `wobble`       | Visual only (for now) | 0-100                    |
| `wobbleSpeed`  | Animation speed       | 0-100                    |
| `grain`        | Noise mix             | 0-100                    |
| `color`        | Frequency (via note)  | Hue → Note → Hz          |
| `octave`       | Frequency multiplier  | 1-8                      |

---

## File Structure

```
src/
├── components/
│   ├── canvas/
│   │   ├── ShapeCanvas.tsx         # Konva Stage wrapper
│   │   ├── MorphableShape.tsx      # Shape with animated wobble
│   │   └── ControlPoint.tsx        # Draggable handle (Phase 8)
│   ├── controls/
│   │   ├── ControlsSidebar.tsx     # Main controls container
│   │   ├── PresetSelector.tsx      # Triangle/Square/Circle buttons
│   │   ├── ColorKeyboard.tsx       # Clavier à lumières (12 keys)
│   │   └── OctaveSelector.tsx      # "- 5 +" control
│   ├── ui/                         # shadcn (auto-generated)
│   └── Layout.tsx                  # Sidebar + canvas flex layout
├── lib/
│   ├── shapes/
│   │   ├── points.ts               # Generate N points per preset
│   │   ├── morph.ts                # Lerp between point arrays
│   │   └── wobble.ts               # Noise displacement per frame
│   ├── audio/
│   │   ├── synth.ts                # Tone.js setup
│   │   ├── mapping.ts              # State → synth params
│   │   └── colorToFrequency.ts     # Hue → Hz
│   └── noise.ts                    # Simplex instance
├── hooks/
│   ├── useShapeState.ts            # Shape params + beforeunload
│   ├── useSynth.ts                 # Tone.js lifecycle
│   ├── useWobbleAnimation.ts       # RAF loop
│   └── useAudioContext.ts          # Mute/unmute handling
├── types/
│   └── shape.ts
├── constants/
│   └── colorScale.ts               # Scriabin mapping
├── App.tsx
├── App.css                         # Existing theme (preserved)
├── Index.tsx
└── main.tsx
```

---

## Phase 1: Project Setup

**Goal:** Install dependencies, configure shadcn without breaking existing theme, create basic layout shell.

### Tasks

- [x] Install `react-konva`, `konva`, `tone`, `simplex-noise`
- [x] Initialize shadcn (neutral base, no CSS overwrite)
- [x] Add shadcn components: `button`, `slider`, `toggle`
- [x] Create `types/shape.ts` with `ShapeState` interface
- [x] Create `Layout.tsx` - sidebar (fixed width) + canvas area (flex-1)
- [x] Update `Index.tsx` to use Layout
- [x] Verify existing dark theme still works

### Deliverables

- App renders with sidebar and empty canvas area
- No visual regressions from theme

---

## Phase 2: Shape State & Canvas

**Goal:** Render a draggable shape on canvas, wire up basic state management.

### Tasks

- [x] Create `useShapeState.ts` hook with default values
- [x] Add `beforeunload` warning when state has changed
- [x] Create `ShapeCanvas.tsx` - Konva Stage that fills container
- [x] Create `MorphableShape.tsx` - renders a simple circle for now
- [x] Make shape draggable, update state on drag end
- [x] Display current x/y in sidebar (debug, remove later)

### Deliverables

- Draggable circle on canvas
- Leave page warning works
- State updates on drag

---

## Phase 3: Shape Generation & Morphing

**Goal:** Generate point-based shapes, implement roundness morphing between presets and circle.

### Tasks

- [ ] Create `lib/shapes/points.ts`:
  - `generateCirclePoints(cx, cy, radius, numPoints)`
  - `generateTrianglePoints(cx, cy, radius, numPoints)` - points clustered at vertices
  - `generateSquarePoints(cx, cy, radius, numPoints)` - points clustered at corners
- [ ] Create `lib/shapes/morph.ts`:
  - `morphPoints(fromPoints, toPoints, t)` - lerp each point
- [ ] Update `MorphableShape.tsx` to render as closed `Line` path
- [ ] Create `PresetSelector.tsx` with 3 shadcn buttons
- [ ] Add roundness `Slider` to sidebar
- [ ] Wire preset + roundness to shape rendering

### Deliverables

- Shape visually morphs from triangle/square → circle
- Preset buttons switch base shape
- Roundness slider smoothly interpolates

---

## Phase 4: Wobble Animation

**Goal:** Add animated noise displacement to shape edges for organic feel.

### Tasks

- [ ] Create `lib/noise.ts` - export shared simplex instance
- [ ] Create `lib/shapes/wobble.ts`:
  - `applyWobble(points, time, amount, noiseScale)` - displace points using noise
- [ ] Create `useWobbleAnimation.ts` - RAF loop, tracks elapsed time
- [ ] Update `MorphableShape.tsx` to apply wobble each frame
- [ ] Add wobble amount slider to sidebar
- [ ] Add wobble speed slider to sidebar

### Deliverables

- Shape edges animate organically
- Wobble amount controls displacement intensity
- Wobble speed controls animation rate

---

## Phase 5: Audio Foundation

**Goal:** Set up Tone.js synth with dual oscillators and crossfade, wire to shape state.

### Tasks

- [ ] Create `lib/audio/synth.ts`:
  - Dual oscillators (A = preset type, B = sine)
  - CrossFade node between them
  - Noise generator for grain
  - Master gain node
  - `createSynth()`, `disposeSynth()` functions
- [ ] Create `useSynth.ts` - lifecycle management, returns synth controls
- [ ] Create `useAudioContext.ts` - handles mute/unmute and Tone.start()
- [ ] Create `lib/audio/mapping.ts`:
  - `mapPresetToOscType(preset)` → 'sawtooth' | 'square' | 'sine'
  - `mapRoundnessToFade(roundness)` → 0-1
  - `mapSizeToGain(size)` → decibels
  - `mapGrainToNoise(grain)` → 0-1
- [ ] Add mute/unmute toggle button to sidebar (or top bar)
- [ ] Wire `preset` → oscillator A type
- [ ] Wire `roundness` → crossfade
- [ ] Wire `size` → gain

### Deliverables

- Sound plays when unmuted
- Preset changes oscillator type
- Roundness crossfades to sine
- Size controls volume

---

## Phase 6: Color Keyboard & Pitch

**Goal:** Implement Clavier à lumières color picker and wire to oscillator frequency.

### Tasks

- [ ] Create `constants/colorScale.ts`:
  - Scriabin's color-note mapping (or custom)
  - Array of 12 `{ note, color, label }` objects
- [ ] Create `lib/audio/colorToFrequency.ts`:
  - `noteToFrequency(note, octave)` → Hz
  - `colorToNote(hue)` → nearest note
- [ ] Create `ColorKeyboard.tsx`:
  - 12 colored keys in a row
  - Click to select, shows current selection
- [ ] Create `OctaveSelector.tsx`:
  - "-" button, octave number, "+" button
  - Range 1-8
- [ ] Wire color + octave → oscillator frequency
- [ ] Update shape fill color to match selected color

### Deliverables

- Color keyboard selects pitch
- Octave selector shifts range
- Shape color matches audio pitch
- Frequency updates in real-time

---

## Phase 7: Grain & Polish

**Goal:** Add grain texture to shape and audio, polish UI.

### Tasks

- [ ] Wire `grain` state → noise generator volume in synth
- [ ] Add grain slider to sidebar
- [ ] Add visual grain effect to shape:
  - Option A: Canvas noise pattern overlay
  - Option B: Perturb fill with noise texture
  - Option C: Speckle effect on shape
- [ ] Polish sidebar layout (group related controls)
- [ ] Add labels to all sliders
- [ ] Ensure responsive behavior (sidebar collapses or scrolls on small screens)
- [ ] Test all parameter combinations

### Deliverables

- Grain affects both audio and visual
- Clean, organized UI
- All controls labeled and functional

---

## Phase 8: Future-Proofing (Groundwork)

**Goal:** Lay foundation for direct shape manipulation via control points.

### Tasks

- [ ] Create `ControlPoint.tsx` - small draggable circle
- [ ] Add `controlPoints` array to `ShapeState` (optional, nullable)
- [ ] Document control point architecture in code comments
- [ ] Create disabled/hidden "Edit Points" toggle
- [ ] Sketch out how control points would modify the base shape

### Deliverables

- Control point component exists but is not active
- Architecture supports future direct manipulation
- Clear documentation for next iteration

---

## Default State

```ts
const defaultState: ShapeState = {
  x: centerX, // center of canvas
  y: centerY, // center of canvas
  preset: "circle",
  roundness: 100, // full circle
  size: 50, // medium
  wobble: 20, // subtle
  wobbleSpeed: 50, // medium
  grain: 0, // none
  color: "#FF0000", // red (C)
  octave: 4, // middle octave
};
```

---

## Audio Signal Chain

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  ┌──────────────┐                                       │
│  │ Oscillator A │──┐                                    │
│  │ (preset)     │  │    ┌────────────┐                 │
│  └──────────────┘  ├───▶│ CrossFade  │──┐              │
│                    │    │ (roundness)│  │              │
│  ┌──────────────┐  │    └────────────┘  │  ┌────────┐  │
│  │ Oscillator B │──┘                    ├─▶│  Gain  │─▶ OUT
│  │ (sine)       │                       │  │ (size) │  │
│  └──────────────┘                       │  └────────┘  │
│                                         │              │
│  ┌──────────────┐                       │              │
│  │    Noise     │───────────────────────┘              │
│  │   (grain)    │                                      │
│  └──────────────┘                                      │
│                                                         │
│  Frequency: colorToFrequency(color, octave)            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Notes

- **User gesture required:** Tone.js needs `Tone.start()` after a user click. The unmute button handles this.
- **Performance:** Wobble animation runs at 60fps. May need throttling if complex.
- **Color keyboard:** Single octave (12 keys). Octave selector shifts the entire range.
- **Preserve theme:** shadcn must not overwrite `App.css`. Use `cssVariables: false` or merge carefully.

---

## Ready to Start?

Begin with **Phase 1** when ready. Each phase builds on the previous and results in a working (if incomplete) application.
