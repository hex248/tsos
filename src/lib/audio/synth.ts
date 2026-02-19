import { noteToFrequency } from "@/constants/colorScale";
import {
    mapAttackToSeconds,
    mapDecayToSeconds,
    mapGrainToNoise,
    mapHoldToSeconds,
    mapPresetToOscType,
    mapRoundnessToFade,
    mapSizeToGain,
    mapSustainToGain,
} from "@/lib/audio/mapping";
import type { Preset } from "@/types/shape";
import * as Tone from "tone";

export type SynthNodes = {
    oscillatorA: Tone.Oscillator;
    oscillatorB: Tone.Oscillator;
    crossFade: Tone.CrossFade;
    noise: Tone.Noise;
    gain: Tone.Gain;
};

export function createSynth(): SynthNodes {
    const oscillatorA = new Tone.Oscillator({ type: "sawtooth" });
    const oscillatorB = new Tone.Oscillator({ type: "sine" });
    const crossFade = new Tone.CrossFade(0);
    const noise = new Tone.Noise({ type: "white" });
    const gain = new Tone.Gain(0.5);

    oscillatorA.connect(crossFade.a);
    oscillatorB.connect(crossFade.b);
    crossFade.connect(gain);
    noise.connect(gain);
    gain.toDestination();

    oscillatorA.start();
    oscillatorB.start();
    noise.start();

    return {
        oscillatorA,
        oscillatorB,
        crossFade,
        noise,
        gain,
    };
}

export function disposeSynth(nodes: SynthNodes) {
    nodes.oscillatorA.stop();
    nodes.oscillatorB.stop();
    nodes.noise.stop();

    nodes.oscillatorA.dispose();
    nodes.oscillatorB.dispose();
    nodes.crossFade.dispose();
    nodes.noise.dispose();
    nodes.gain.dispose();
}

type PreviewOptions = {
    preset: Preset;
    roundness: number;
    size: number;
    grain: number;
    attack: number;
    hold: number;
    decay: number;
    sustain: number;
    note: string;
    octave: number;
    synthNodes: SynthNodes | null;
};

export type PreviewVoice = {
    oscillatorA: Tone.Oscillator;
    oscillatorB: Tone.Oscillator;
    crossFade: Tone.CrossFade;
    noise: Tone.Noise;
    gain: Tone.Gain;
    minReleaseAt: number;
};

const PREVIEW_CLEANUP = 0.05;
const PREVIEW_RELEASE = 0.08;
const PREVIEW_SUSTAIN_DURATION = 0.12;

type PreviewSharedState = {
    destination: ReturnType<typeof Tone.getDestination>;
    wasMuted: boolean;
    previousGain: number | null;
    activeCount: number;
    sessionId: number;
    startPromise: Promise<void> | null;
};

const previewSharedState: PreviewSharedState = {
    destination: Tone.getDestination(),
    wasMuted: false,
    previousGain: null,
    activeCount: 0,
    sessionId: 0,
    startPromise: null,
};

async function acquirePreviewShared(synthNodes: SynthNodes | null) {
    previewSharedState.activeCount += 1;

    if (previewSharedState.activeCount === 1) {
        previewSharedState.sessionId += 1;
        const sessionId = previewSharedState.sessionId;
        const destination = Tone.getDestination();
        previewSharedState.destination = destination;
        previewSharedState.wasMuted = destination.mute;
        previewSharedState.previousGain =
            previewSharedState.wasMuted && synthNodes ? synthNodes.gain.gain.value : null;

        if (previewSharedState.wasMuted) {
            previewSharedState.startPromise = Tone.start().then(() => {
                if (previewSharedState.activeCount > 0 && previewSharedState.sessionId === sessionId) {
                    destination.mute = false;
                    if (synthNodes) {
                        synthNodes.gain.gain.value = 0;
                    }
                }
            });
        } else {
            previewSharedState.startPromise = Promise.resolve();
        }
    }

    if (previewSharedState.startPromise) {
        await previewSharedState.startPromise;
    }
}

function releasePreviewShared(synthNodes: SynthNodes | null) {
    previewSharedState.activeCount = Math.max(0, previewSharedState.activeCount - 1);

    if (previewSharedState.activeCount === 0) {
        if (previewSharedState.wasMuted) {
            previewSharedState.destination.mute = true;
        }

        if (previewSharedState.previousGain !== null && synthNodes) {
            synthNodes.gain.gain.value = previewSharedState.previousGain;
        }
    }
}

export async function playPreviewSample(options: PreviewOptions) {
    await acquirePreviewShared(options.synthNodes);

    const previewGain = new Tone.Gain(0);
    const crossFade = new Tone.CrossFade(mapRoundnessToFade(options.roundness));
    const oscillatorA = new Tone.Oscillator({ type: mapPresetToOscType(options.preset) });
    const oscillatorB = new Tone.Oscillator({ type: "sine" });
    const noise = new Tone.Noise({ type: "white" });

    oscillatorA.connect(crossFade.a);
    oscillatorB.connect(crossFade.b);
    crossFade.connect(previewGain);
    noise.connect(previewGain);
    previewGain.toDestination();

    const frequency = noteToFrequency(options.note, options.octave);
    oscillatorA.frequency.value = frequency;
    oscillatorB.frequency.value = frequency;

    const grain = mapGrainToNoise(options.grain);
    const noiseDb = grain === 0 ? Number.NEGATIVE_INFINITY : -40 + (-12 - -40) * grain;
    noise.volume.value = noiseDb;

    const now = Tone.now();
    const peak = Tone.dbToGain(mapSizeToGain(options.size));
    const attackTime = mapAttackToSeconds(options.attack);
    const holdTime = mapHoldToSeconds(options.hold);
    const decayTime = mapDecayToSeconds(options.decay);
    const sustainLevel = mapSustainToGain(options.sustain);

    const attackEnd = now + attackTime;
    const holdEnd = attackEnd + holdTime;
    const decayEnd = holdEnd + decayTime;
    const releaseStart = decayEnd + PREVIEW_SUSTAIN_DURATION;
    const stopAt = releaseStart + PREVIEW_RELEASE + PREVIEW_CLEANUP;
    const sustainGain = peak * sustainLevel;

    previewGain.gain.setValueAtTime(0, now);
    previewGain.gain.linearRampToValueAtTime(peak, attackEnd);
    previewGain.gain.linearRampToValueAtTime(peak, holdEnd);
    previewGain.gain.linearRampToValueAtTime(sustainGain, decayEnd);
    previewGain.gain.setValueAtTime(sustainGain, releaseStart);
    previewGain.gain.linearRampToValueAtTime(0, releaseStart + PREVIEW_RELEASE);

    oscillatorA.start(now);
    oscillatorB.start(now);
    noise.start(now);
    oscillatorA.stop(stopAt);
    oscillatorB.stop(stopAt);
    noise.stop(stopAt);

    window.setTimeout(
        () => {
            oscillatorA.dispose();
            oscillatorB.dispose();
            crossFade.dispose();
            noise.dispose();
            previewGain.dispose();

            releasePreviewShared(options.synthNodes);
        },
        (stopAt - now) * 1000,
    );
}

export async function startPreviewVoice(options: PreviewOptions): Promise<PreviewVoice> {
    await acquirePreviewShared(options.synthNodes);

    const previewGain = new Tone.Gain(0);
    const crossFade = new Tone.CrossFade(mapRoundnessToFade(options.roundness));
    const oscillatorA = new Tone.Oscillator({ type: mapPresetToOscType(options.preset) });
    const oscillatorB = new Tone.Oscillator({ type: "sine" });
    const noise = new Tone.Noise({ type: "white" });

    oscillatorA.connect(crossFade.a);
    oscillatorB.connect(crossFade.b);
    crossFade.connect(previewGain);
    noise.connect(previewGain);
    previewGain.toDestination();

    const frequency = noteToFrequency(options.note, options.octave);
    oscillatorA.frequency.value = frequency;
    oscillatorB.frequency.value = frequency;

    const grain = mapGrainToNoise(options.grain);
    const noiseDb = grain === 0 ? Number.NEGATIVE_INFINITY : -40 + (-12 - -40) * grain;
    noise.volume.value = noiseDb;

    const now = Tone.now();
    const peak = Tone.dbToGain(mapSizeToGain(options.size));
    const attackTime = mapAttackToSeconds(options.attack);
    const holdTime = mapHoldToSeconds(options.hold);
    const decayTime = mapDecayToSeconds(options.decay);
    const sustainLevel = mapSustainToGain(options.sustain);

    const attackEnd = now + attackTime;
    const holdEnd = attackEnd + holdTime;
    const decayEnd = holdEnd + decayTime;

    previewGain.gain.setValueAtTime(0, now);
    previewGain.gain.linearRampToValueAtTime(peak, attackEnd);
    previewGain.gain.linearRampToValueAtTime(peak, holdEnd);
    previewGain.gain.linearRampToValueAtTime(peak * sustainLevel, decayEnd);

    oscillatorA.start(now);
    oscillatorB.start(now);
    noise.start(now);

    return {
        oscillatorA,
        oscillatorB,
        crossFade,
        noise,
        gain: previewGain,
        minReleaseAt: decayEnd,
    };
}

export function stopPreviewVoice(voice: PreviewVoice, synthNodes: SynthNodes | null) {
    const now = Tone.now();
    const releaseAt = Math.max(now, voice.minReleaseAt);
    const stopAt = releaseAt + PREVIEW_RELEASE + PREVIEW_CLEANUP;

    const releaseStartValue = voice.gain.gain.getValueAtTime(releaseAt);
    voice.gain.gain.cancelScheduledValues(releaseAt);
    voice.gain.gain.setValueAtTime(releaseStartValue, releaseAt);
    voice.gain.gain.linearRampToValueAtTime(0, releaseAt + PREVIEW_RELEASE);

    voice.oscillatorA.stop(stopAt);
    voice.oscillatorB.stop(stopAt);
    voice.noise.stop(stopAt);

    window.setTimeout(
        () => {
            voice.oscillatorA.dispose();
            voice.oscillatorB.dispose();
            voice.crossFade.dispose();
            voice.noise.dispose();
            voice.gain.dispose();
            releasePreviewShared(synthNodes);
        },
        (stopAt - now) * 1000,
    );
}
