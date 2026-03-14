import { colorScale } from "@/constants/colorScale";
import type { IdeaRecord, LocalDraftRecord, SerializedIdeaRecord } from "@/types/idea";
import { NOTE_NAMES, SCALE_TYPES } from "@/types/music";
import type { EditorShapeState, IdeaSoundConfig } from "@/types/shape";
import { z } from "zod";

const presetSchema = z.enum(["triangle", "square"]);
const hexColorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, "invalid colour");
const boundedPercentSchema = z.number().min(0).max(100);
const octaveSchema = z.number().int().min(1).max(8);
const noteNameSchema = z.enum(NOTE_NAMES);
const scaleTypeSchema = z.enum(SCALE_TYPES);

export const ideaSoundConfigSchema = z.object({
    preset: presetSchema,
    roundness: boundedPercentSchema,
    size: boundedPercentSchema,
    wobble: boundedPercentSchema,
    wobbleSpeed: boundedPercentSchema,
    wobbleRandomness: boundedPercentSchema,
    grain: boundedPercentSchema,
    attack: boundedPercentSchema,
    hold: boundedPercentSchema,
    decay: boundedPercentSchema,
    sustain: boundedPercentSchema,
    color: hexColorSchema,
    octave: octaveSchema,
    keyRoot: noteNameSchema.nullable(),
    scaleType: scaleTypeSchema,
});

export const localDraftSchema = z.object({
    localId: z.string().min(1),
    title: z.string().min(1).max(120),
    config: ideaSoundConfigSchema,
    savedAt: z.string().datetime(),
    schemaVersion: z.number().int().min(1),
});

export const localDraftsPayloadSchema = z.object({
    drafts: z.array(localDraftSchema).max(50),
});

export const createIdeaSchema = z.object({
    title: z.string().trim().min(1).max(120).optional(),
    config: ideaSoundConfigSchema,
});

export const updateIdeaSchema = z
    .object({
        title: z.string().trim().min(1).max(120).optional(),
        config: ideaSoundConfigSchema.optional(),
    })
    .refine((value) => value.title !== undefined || value.config !== undefined, {
        message: "at least one field must be provided",
    });

export function getNoteFromColor(color: string) {
    return (
        colorScale.find((entry) => entry.color.toLowerCase() === color.toLowerCase())?.note ??
        colorScale[0].note
    );
}

export function createIdeaTitle(config: IdeaSoundConfig) {
    const preset = config.preset.charAt(0).toUpperCase() + config.preset.slice(1);
    return `${preset} ${getNoteFromColor(config.color)}${config.octave}`;
}

export function toIdeaSoundConfig(state: EditorShapeState): IdeaSoundConfig {
    return {
        preset: state.preset,
        roundness: state.roundness,
        size: state.size,
        wobble: state.wobble,
        wobbleSpeed: state.wobbleSpeed,
        wobbleRandomness: state.wobbleRandomness,
        grain: state.grain,
        attack: state.attack,
        hold: state.hold,
        decay: state.decay,
        sustain: state.sustain,
        color: state.color,
        octave: state.octave,
        keyRoot: state.keyRoot,
        scaleType: state.scaleType,
    };
}

export function applyIdeaSoundConfig(
    currentState: EditorShapeState,
    config: IdeaSoundConfig,
): EditorShapeState {
    return {
        ...currentState,
        ...config,
    };
}

export function serializeIdeaRecord(record: IdeaRecord): SerializedIdeaRecord {
    return {
        id: record.id,
        title: record.title,
        config: record.config,
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    };
}

export function serializeLocalDraftRecord(record: LocalDraftRecord) {
    return {
        ...record,
    };
}
