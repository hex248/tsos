export type Preset = "triangle" | "square" | "circle";

export interface ShapeState {
    x: number;
    y: number;
    preset: Preset;
    roundness: number; // 0-100, controls morph from preset to circle
    size: number; // 0-100, controls volume
    wobble: number; // 0-100, visual wobble amount
    wobbleSpeed: number; // 0-100, wobble animation speed
    grain: number; // 0-100, noise mix
    color: string; // hex color from clavier keyboard
    octave: number; // 1-8, frequency multiplier
}
