import { getRequestSession } from "@/lib/auth/server";
import { deleteIdeaRecord, getIdeaById, updateIdeaRecord } from "@/lib/ideas/repository";
import { serializeIdeaRecord, updateIdeaSchema } from "@/lib/ideas/schema";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { NextResponse } from "next/server";

function unauthorized() {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
}

function notFound() {
    return NextResponse.json({ message: "Idea not found." }, { status: 404 });
}

export async function GET(request: Request, context: { params: Promise<{ ideaId: string }> }) {
    const { ideaId } = await context.params;
    const record = await getIdeaById(ideaId);

    if (!record) {
        return notFound();
    }

    const session = await getRequestSession(request);

    return NextResponse.json({
        idea: serializeIdeaRecord(record),
        isOwner: session?.user.id === record.ownerUserId,
    });
}

export async function PATCH(request: Request, context: { params: Promise<{ ideaId: string }> }) {
    const rateLimitResponse = applyRateLimit(request, {
        bucket: "ideas:update",
        limit: 20,
        windowMs: 60_000,
    });

    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    const session = await getRequestSession(request);

    if (!session) {
        return unauthorized();
    }

    const body = await request.json().catch(() => null);
    const parsed = updateIdeaSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid idea payload." }, { status: 400 });
    }

    const { ideaId } = await context.params;
    const updated = await updateIdeaRecord({
        ideaId,
        ownerUserId: session.user.id,
        title: parsed.data.title,
        config: parsed.data.config,
    });

    if (!updated) {
        return notFound();
    }

    return NextResponse.json({
        idea: serializeIdeaRecord(updated),
    });
}

export async function DELETE(request: Request, context: { params: Promise<{ ideaId: string }> }) {
    const rateLimitResponse = applyRateLimit(request, {
        bucket: "ideas:delete",
        limit: 10,
        windowMs: 60_000,
    });

    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    const session = await getRequestSession(request);

    if (!session) {
        return unauthorized();
    }

    const { ideaId } = await context.params;
    const deleted = await deleteIdeaRecord(ideaId, session.user.id);

    if (!deleted) {
        return notFound();
    }

    return new NextResponse(null, { status: 204 });
}
