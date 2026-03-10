import type { Preset } from "@/types/shape";

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

export function mapGrainToNoise(grain: number): number {
    return clamp01(grain / 100);
}

export function mapWobbleToTremoloDepth(wobble: number): number {
    return clamp01(wobble / 100) * 0.85;
}

export function mapWobbleSpeedToHz(speed: number): number {
    return clamp01(speed / 100) * 10;
}

export function mapAttackToSeconds(attack: number): number {
    const min = 0.005;
    const max = 1.2;
    return min + (max - min) * clamp01(attack / 100);
}

export function mapHoldToSeconds(hold: number): number {
    const max = 0.8;
    return max * clamp01(hold / 100);
}

export function mapDecayToSeconds(decay: number): number {
    const min = 0.01;
    const max = 1.5;
    return min + (max - min) * clamp01(decay / 100);
}

export function mapSustainToGain(sustain: number): number {
    return clamp01(sustain / 100);
}

function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}
