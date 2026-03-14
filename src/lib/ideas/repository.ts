import "server-only";

import { db } from "@/lib/db";
import { idea } from "@/lib/db/schema";
import { createIdeaTitle } from "@/lib/ideas/schema";
import type { IdeaRecord } from "@/types/idea";
import type { IdeaSoundConfig } from "@/types/shape";
import { and, desc, eq } from "drizzle-orm";

function toIdeaRecord(record: typeof idea.$inferSelect): IdeaRecord {
    return {
        id: record.id,
        ownerUserId: record.ownerUserId,
        title: record.title,
        config: record.config,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
    };
}

export async function listIdeasForOwner(ownerUserId: string) {
    const records = await db
        .select()
        .from(idea)
        .where(eq(idea.ownerUserId, ownerUserId))
        .orderBy(desc(idea.updatedAt));

    return records.map(toIdeaRecord);
}

export async function getIdeaById(ideaId: string) {
    const [record] = await db.select().from(idea).where(eq(idea.id, ideaId)).limit(1);
    return record ? toIdeaRecord(record) : null;
}

export async function getIdeaByIdForOwner(ideaId: string, ownerUserId: string) {
    const [record] = await db
        .select()
        .from(idea)
        .where(and(eq(idea.id, ideaId), eq(idea.ownerUserId, ownerUserId)))
        .limit(1);

    return record ? toIdeaRecord(record) : null;
}

export async function createIdeaRecord({
    ownerUserId,
    title,
    config,
}: {
    ownerUserId: string;
    title?: string;
    config: IdeaSoundConfig;
}) {
    const now = new Date();
    const [record] = await db
        .insert(idea)
        .values({
            id: crypto.randomUUID(),
            ownerUserId,
            title: title?.trim() || createIdeaTitle(config),
            config,
            createdAt: now,
            updatedAt: now,
        })
        .returning();

    return toIdeaRecord(record);
}

export async function updateIdeaRecord({
    ideaId,
    ownerUserId,
    title,
    config,
}: {
    ideaId: string;
    ownerUserId: string;
    title?: string;
    config?: IdeaSoundConfig;
}) {
    const [record] = await db
        .update(idea)
        .set({
            ...(title !== undefined
                ? {
                      title: title.trim(),
                  }
                : {}),
            ...(config !== undefined
                ? {
                      config,
                  }
                : {}),
            updatedAt: new Date(),
        })
        .where(and(eq(idea.id, ideaId), eq(idea.ownerUserId, ownerUserId)))
        .returning();

    return record ? toIdeaRecord(record) : null;
}

export async function deleteIdeaRecord(ideaId: string, ownerUserId: string) {
    const deleted = await db
        .delete(idea)
        .where(and(eq(idea.id, ideaId), eq(idea.ownerUserId, ownerUserId)))
        .returning({ id: idea.id });

    return deleted.length > 0;
}
