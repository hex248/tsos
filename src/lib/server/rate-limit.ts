import { NextResponse } from "next/server";

interface RateLimitOptions {
    bucket: string;
    limit: number;
    windowMs: number;
}

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

declare global {
    // eslint-disable-next-line no-var
    var __tsosRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

function getStore() {
    if (!globalThis.__tsosRateLimitStore) {
        globalThis.__tsosRateLimitStore = new Map();
    }

    return globalThis.__tsosRateLimitStore;
}

function getClientAddress(request: Request) {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) {
        return forwardedFor.split(",")[0]?.trim() ?? "unknown";
    }

    return request.headers.get("x-real-ip") ?? "unknown";
}

export function applyRateLimit(request: Request, options: RateLimitOptions) {
    const store = getStore();
    const now = Date.now();
    const key = `${options.bucket}:${getClientAddress(request)}`;
    const existing = store.get(key);

    if (!existing || existing.resetAt <= now) {
        store.set(key, {
            count: 1,
            resetAt: now + options.windowMs,
        });
        return null;
    }

    if (existing.count >= options.limit) {
        return NextResponse.json(
            {
                message: "Too many requests. Please try again later.",
            },
            {
                status: 429,
                headers: {
                    "Retry-After": String(Math.ceil((existing.resetAt - now) / 1000)),
                },
            },
        );
    }

    existing.count += 1;
    store.set(key, existing);

    return null;
}
