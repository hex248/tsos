import type { IdeaSoundConfig } from "@/types/shape";

export interface IdeaRecord {
    id: string;
    ownerUserId: string;
    title: string;
    config: IdeaSoundConfig;
    createdAt: Date;
    updatedAt: Date;
}

export interface SerializedIdeaRecord {
    id: string;
    title: string;
    config: IdeaSoundConfig;
    createdAt: string;
    updatedAt: string;
}

export interface LocalDraftRecord {
    localId: string;
    title: string;
    config: IdeaSoundConfig;
    savedAt: string;
    schemaVersion: number;
}
