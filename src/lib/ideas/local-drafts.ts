"use client";

import { createIdeaTitle, localDraftSchema } from "@/lib/ideas/schema";
import type { LocalDraftRecord } from "@/types/idea";
import type { IdeaSoundConfig } from "@/types/shape";

export const LOCAL_DRAFTS_STORAGE_KEY = "tsos-local-drafts:v1";
export const LOCAL_DRAFT_SCHEMA_VERSION = 1;

function getStorage() {
    if (typeof window === "undefined") {
        return null;
    }

    return window.localStorage;
}

export function loadLocalDrafts() {
    const storage = getStorage();

    if (!storage) {
        return [] as LocalDraftRecord[];
    }

    const rawValue = storage.getItem(LOCAL_DRAFTS_STORAGE_KEY);

    if (!rawValue) {
        return [] as LocalDraftRecord[];
    }

    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
            return [] as LocalDraftRecord[];
        }

        return parsed
            .map((draft) => localDraftSchema.safeParse(draft))
            .filter((result) => result.success)
            .map((result) => result.data)
            .sort((left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime())
            .slice(0, 1);
    } catch {
        return [] as LocalDraftRecord[];
    }
}

export function saveLocalDrafts(drafts: LocalDraftRecord[]) {
    const storage = getStorage();

    if (!storage) {
        return;
    }

    const normalizedDrafts = [...drafts]
        .sort((left, right) => new Date(right.savedAt).getTime() - new Date(left.savedAt).getTime())
        .slice(0, 1);

    storage.setItem(LOCAL_DRAFTS_STORAGE_KEY, JSON.stringify(normalizedDrafts));
}

export function createLocalDraftRecord(config: IdeaSoundConfig, title?: string): LocalDraftRecord {
    return {
        localId: crypto.randomUUID(),
        title: title?.trim() || createIdeaTitle(config),
        config,
        savedAt: new Date().toISOString(),
        schemaVersion: LOCAL_DRAFT_SCHEMA_VERSION,
    };
}

export function removeLocalDraftsById(drafts: LocalDraftRecord[], importedLocalIds: string[]) {
    const importedIdSet = new Set(importedLocalIds);
    return drafts.filter((draft) => !importedIdSet.has(draft.localId));
}
