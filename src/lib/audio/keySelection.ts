import { NOTE_INDEX_BY_NAME, NOTE_NAMES, type NoteName, type ScaleType } from "@/types/music";

const SCALE_INTERVALS: Record<ScaleType, readonly number[]> = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
};

export function getScaleNotes(root: NoteName, scaleType: ScaleType): NoteName[] {
    const rootIndex = NOTE_INDEX_BY_NAME[root];

    return SCALE_INTERVALS[scaleType].map(
        (interval) => NOTE_NAMES[(rootIndex + interval) % NOTE_NAMES.length],
    );
}

export function isNoteInScale(note: NoteName, root: NoteName, scaleType: ScaleType): boolean {
    return getScaleNotes(root, scaleType).includes(note);
}

export function getDiatonicMappedNote(
    bindingIndex: number,
    root: NoteName,
    scaleType: ScaleType,
    baseOctave: number,
) {
    const scaleNotes = getScaleNotes(root, scaleType);
    const octaveOffset = Math.floor(bindingIndex / scaleNotes.length);

    return {
        note: scaleNotes[bindingIndex % scaleNotes.length],
        octave: baseOctave + octaveOffset,
    };
}
