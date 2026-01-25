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

const PREVIEW_ATTACK = 0.02;
const PREVIEW_DURATION = 0.2;
const PREVIEW_CLEANUP = 0.05;

export async function playPreviewSample(options: PreviewOptions) {
    const destination = Tone.getDestination();
    const wasMuted = destination.mute;

    if (wasMuted) {
        await Tone.start();
        destination.mute = false;
    }

    const previousGain = wasMuted && options.synthNodes ? options.synthNodes.gain.gain.value : null;
    if (wasMuted && options.synthNodes) {
        options.synthNodes.gain.gain.value = 0;
    }

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

            if (wasMuted) {
                destination.mute = true;
            }

            if (previousGain !== null && options.synthNodes) {
                options.synthNodes.gain.gain.value = previousGain;
            }
        },
        (stopAt - now) * 1000,
    );
}
