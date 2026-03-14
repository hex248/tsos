"use client";

import { createAuthClient } from "better-auth/react";

const authBaseUrl =
    typeof window === "undefined"
        ? new URL("/api/auth", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").toString()
        : new URL("/api/auth", window.location.origin).toString();

export const authClient = createAuthClient({
    baseURL: authBaseUrl,
});
