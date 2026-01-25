import type { Preset } from "@/types/shape";

export function mapPresetToOscType(preset: Preset): "sawtooth" | "square" | "sine" {
    switch (preset) {
        case "triangle":
            return "sawtooth";
        case "square":
            return "square";
        case "circle":
            return "sine";
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

export function mapGrainToNoise(grain: number): number {
    return clamp01(grain / 100);
}

export function mapWobbleToDetune(wobble: number): number {
    const maxCents = 50;
    return clamp01(wobble / 100) * maxCents;
}

function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}
