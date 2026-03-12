import { colorScale, noteToFrequency } from "@/constants/colorScale";
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
import type { NoteName } from "@/types/music";
import type { ShapeState } from "@/types/shape";
import * as Tone from "tone";
import { createMp3Encoder } from "wasm-media-encoders";

export type ExportFormat = "wav" | "mp3";

export type ExportRequest = {
    state: ShapeState;
    format: ExportFormat;
    applyEnvelope: boolean;
};

export type ExportResult = {
    blob: Blob;
    filename: string;
    mimeType: string;
};

const EXPORT_CHANNELS = 1;
const EXPORT_SAMPLE_RATE = 44_100;
const DRY_SUSTAIN_DURATION = 0.25;
const DRY_FADE_DURATION = 0.01;
const ENVELOPED_SUSTAIN_DURATION = 0.12;
const ENVELOPED_RELEASE_DURATION = 0.08;
const MP3_BITRATE = 192;

export async function renderExportBuffer(request: ExportRequest): Promise<AudioBuffer> {
    const note = getNoteFromColor(request.state.color);
    const frequency = noteToFrequency(note, request.state.octave);
    const duration = getRenderDuration(request.state, request.applyEnvelope);

    const rendered = await Tone.Offline(
        () => {
            const oscillatorA = new Tone.Oscillator({ type: mapPresetToOscType(request.state.preset) });
            const oscillatorB = new Tone.Oscillator({ type: "sine" });
            const crossFade = new Tone.CrossFade(mapRoundnessToFade(request.state.roundness));
            const noise = new Tone.Noise({ type: "white" });
            const gain = new Tone.Gain(0);

            oscillatorA.connect(crossFade.a);
            oscillatorB.connect(crossFade.b);
            crossFade.connect(gain);
            noise.connect(gain);
            gain.toDestination();

            oscillatorA.frequency.value = frequency;
            oscillatorB.frequency.value = frequency;

            const grain = mapGrainToNoise(request.state.grain);
            const noiseDb = grain === 0 ? Number.NEGATIVE_INFINITY : -40 + (-12 - -40) * grain;
            noise.volume.value = noiseDb;

            const peak = Tone.dbToGain(mapSizeToGain(request.state.size));

            if (request.applyEnvelope) {
                const attackTime = mapAttackToSeconds(request.state.attack);
                const holdTime = mapHoldToSeconds(request.state.hold);
                const decayTime = mapDecayToSeconds(request.state.decay);
                const sustainLevel = mapSustainToGain(request.state.sustain);
                const attackEnd = attackTime;
                const holdEnd = attackEnd + holdTime;
                const decayEnd = holdEnd + decayTime;
                const releaseStart = decayEnd + ENVELOPED_SUSTAIN_DURATION;

                gain.gain.setValueAtTime(0, 0);
                gain.gain.linearRampToValueAtTime(peak, attackEnd);
                gain.gain.linearRampToValueAtTime(peak, holdEnd);
                gain.gain.linearRampToValueAtTime(peak * sustainLevel, decayEnd);
                gain.gain.setValueAtTime(peak * sustainLevel, releaseStart);
                gain.gain.linearRampToValueAtTime(0, duration);
            } else {
                gain.gain.setValueAtTime(peak, 0);
                gain.gain.setValueAtTime(peak, DRY_SUSTAIN_DURATION);
                gain.gain.linearRampToValueAtTime(0, duration);
            }

            oscillatorA.start(0);
            oscillatorB.start(0);
            noise.start(0);

            oscillatorA.stop(duration);
            oscillatorB.stop(duration);
            noise.stop(duration);
        },
        duration,
        EXPORT_CHANNELS,
        EXPORT_SAMPLE_RATE,
    );

    const audioBuffer = rendered.get();
    if (!audioBuffer) {
        throw new Error("offline render did not return an audio buffer");
    }

    return audioBuffer;
}

export function encodeWavMono(buffer: AudioBuffer): Blob {
    const channelData = buffer.getChannelData(0);
    const pcmLength = channelData.length * 2;
    const wavBuffer = new ArrayBuffer(44 + pcmLength);
    const view = new DataView(wavBuffer);

    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + pcmLength, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, pcmLength, true);

    for (let index = 0; index < channelData.length; index += 1) {
        const sample = Math.max(-1, Math.min(1, channelData[index]));
        const pcm = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(44 + index * 2, Math.round(pcm), true);
    }

    return new Blob([wavBuffer], { type: "audio/wav" });
}

export async function encodeMp3Mono(buffer: AudioBuffer): Promise<Blob> {
    const encoder = await createMp3Encoder();
    const channelData = buffer.getChannelData(0);

    encoder.configure({
        bitrate: MP3_BITRATE,
        channels: 1,
        outputSampleRate: EXPORT_SAMPLE_RATE,
        sampleRate: EXPORT_SAMPLE_RATE,
    });

    const chunks: Uint8Array[] = [];
    const encoded = encoder.encode([channelData]);
    if (encoded.length > 0) {
        chunks.push(new Uint8Array(encoded));
    }

    const finalized = encoder.finalize();
    if (finalized.length > 0) {
        chunks.push(new Uint8Array(finalized));
    }

    return new Blob([concatChunks(chunks) as BlobPart], { type: "audio/mpeg" });
}

export function downloadExport(result: ExportResult) {
    const objectUrl = URL.createObjectURL(result.blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = result.filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
    }, 0);
}

export function createExportFilename(
    state: ShapeState,
    format: ExportFormat,
    applyEnvelope: boolean,
): string {
    const note = getNoteFromColor(state.color);
    const preset = state.preset.toLowerCase();
    const noteSlug = note.replace("#", "-sharp");
    const envelopeSuffix = applyEnvelope ? "enveloped" : "dry";

    return `the-shape-of-sound-${preset}-${noteSlug}${state.octave}-${envelopeSuffix}.${format}`;
}

function getNoteFromColor(color: string): NoteName {
    return (
        colorScale.find((entry) => entry.color.toLowerCase() === color.toLowerCase())?.note ??
        colorScale[0].note
    );
}

function getRenderDuration(state: ShapeState, applyEnvelope: boolean): number {
    if (!applyEnvelope) {
        return DRY_SUSTAIN_DURATION + DRY_FADE_DURATION;
    }

    return (
        mapAttackToSeconds(state.attack) +
        mapHoldToSeconds(state.hold) +
        mapDecayToSeconds(state.decay) +
        ENVELOPED_SUSTAIN_DURATION +
        ENVELOPED_RELEASE_DURATION
    );
}

function writeAscii(view: DataView, offset: number, value: string) {
    for (let index = 0; index < value.length; index += 1) {
        view.setUint8(offset + index, value.charCodeAt(index));
    }
}

function concatChunks(chunks: Uint8Array[]): Uint8Array {
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;

    for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
    }

    return result;
}
