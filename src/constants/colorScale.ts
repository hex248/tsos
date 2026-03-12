import { NOTE_INDEX_BY_NAME, type NoteName } from "@/types/music";

export type ColorNote = {
    note: NoteName;
    color: string;
    label: string;
};

export const colorScale: ColorNote[] = [
    { note: "C", color: "#ff0000", label: "C" },
    { note: "C#", color: "#caa3ff", label: "C#" },
    { note: "D", color: "#ffff00", label: "D" },
    { note: "D#", color: "#5b5f8b", label: "D#" },
    { note: "E", color: "#dff8ff", label: "E" },
    { note: "F", color: "#8b1a0e", label: "F" },
    { note: "F#", color: "#18bffb", label: "F#" },
    { note: "G", color: "#ff7a00", label: "G" },
    { note: "G#", color: "#ff00ff", label: "G#" },
    { note: "A", color: "#39c52a", label: "A" },
    { note: "A#", color: "#8a8a8a", label: "A#" },
    { note: "B", color: "#0c2bff", label: "B" },
];

export function noteToFrequency(note: NoteName, octave: number): number {
    const semitone = NOTE_INDEX_BY_NAME[note];
    const midi = (octave + 1) * 12 + semitone;
    return 440 * 2 ** ((midi - 69) / 12);
}
