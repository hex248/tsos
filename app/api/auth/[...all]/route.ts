import { auth } from "@/lib/auth/auth";
import { applyRateLimit } from "@/lib/server/rate-limit";
import { toNextJsHandler } from "better-auth/next-js";

const authHandler = async (request: Request) => {
    const pathname = new URL(request.url).pathname;
    const rateLimitResponse = applyRateLimit(request, {
        bucket: `auth:${pathname}:${request.method}`,
        limit: 20,
        windowMs: 60_000,
    });

    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    return auth.handler(request);
};

export const { GET, POST } = toNextJsHandler(authHandler);
