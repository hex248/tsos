import { noteToFrequency } from "@/constants/colorScale";
import { mapGrainToNoise, mapPresetToOscType, mapRoundnessToFade, mapSizeToGain } from "@/lib/audio/mapping";
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
};

const PREVIEW_ATTACK = 0.02;
const PREVIEW_DURATION = 0.2;
const PREVIEW_CLEANUP = 0.05;
const PREVIEW_RELEASE = 0.08;

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
    const stopAt = now + PREVIEW_DURATION + PREVIEW_CLEANUP;

    previewGain.gain.setValueAtTime(0, now);
    previewGain.gain.linearRampToValueAtTime(peak, now + PREVIEW_ATTACK);
    previewGain.gain.linearRampToValueAtTime(0, now + PREVIEW_DURATION);

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

    previewGain.gain.setValueAtTime(0, now);
    previewGain.gain.linearRampToValueAtTime(peak, now + PREVIEW_ATTACK);

    oscillatorA.start(now);
    oscillatorB.start(now);
    noise.start(now);

    return {
        oscillatorA,
        oscillatorB,
        crossFade,
        noise,
        gain: previewGain,
    };
}

export function stopPreviewVoice(voice: PreviewVoice, synthNodes: SynthNodes | null) {
    const now = Tone.now();
    const stopAt = now + PREVIEW_RELEASE + PREVIEW_CLEANUP;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.linearRampToValueAtTime(0, now + PREVIEW_RELEASE);

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
