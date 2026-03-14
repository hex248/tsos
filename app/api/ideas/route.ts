import { getRequestSession } from "@/lib/auth/server";
import { createIdeaRecord, listIdeasForOwner } from "@/lib/ideas/repository";
import { createIdeaSchema, serializeIdeaRecord } from "@/lib/ideas/schema";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { NextResponse } from "next/server";

function unauthorized() {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
}

export async function GET(request: Request) {
    const session = await getRequestSession(request);

    if (!session) {
        return unauthorized();
    }

    const ideas = await listIdeasForOwner(session.user.id);

    return NextResponse.json({
        ideas: ideas.map(serializeIdeaRecord),
    });
}

export async function POST(request: Request) {
    const rateLimitResponse = applyRateLimit(request, {
        bucket: "ideas:create",
        limit: 15,
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
    const parsed = createIdeaSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ message: "Invalid idea payload." }, { status: 400 });
    }

    const idea = await createIdeaRecord({
        ownerUserId: session.user.id,
        title: parsed.data.title,
        config: parsed.data.config,
    });

    return NextResponse.json(
        {
            idea: serializeIdeaRecord(idea),
        },
        { status: 201 },
    );
}
