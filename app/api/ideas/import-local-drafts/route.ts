import { getRequestSession } from "@/lib/auth/server";
import { createIdeaRecord } from "@/lib/ideas/repository";
import { localDraftsPayloadSchema } from "@/lib/ideas/schema";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const rateLimitResponse = applyRateLimit(request, {
        bucket: "ideas:import-local-drafts",
        limit: 5,
        windowMs: 60_000,
    });

    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    const session = await getRequestSession(request);

    if (!session) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = localDraftsPayloadSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid draft payload." }, { status: 400 });
    }

    const importedLocalIds: string[] = [];
    const failedDrafts: Array<{ localId: string; message: string }> = [];

    for (const draft of parsed.data.drafts) {
        try {
            await createIdeaRecord({
                ownerUserId: session.user.id,
                title: draft.title,
                config: draft.config,
            });
            importedLocalIds.push(draft.localId);
        } catch {
            failedDrafts.push({
                localId: draft.localId,
                message: "This draft could not be imported.",
            });
        }
    }

    return NextResponse.json({
        importedLocalIds,
        failedDrafts,
    });
}
