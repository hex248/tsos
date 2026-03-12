import type { NoteName, ScaleType } from "@/types/music";

export type Preset = "triangle" | "square";

export interface ShapeState {
    x: number;
    y: number;
    preset: Preset;
    roundness: number; // 0-100, controls morph from sharp to round
    size: number; // 0-100, controls volume
    wobble: number; // 0-100, shared visual wobble and audio tremolo depth
    wobbleSpeed: number; // 0-100, shared wobble animation and tremolo speed
    wobbleRandomness: number; // 0-100, shared visual and audio noise vs sine blend
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
