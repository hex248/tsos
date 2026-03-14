import { db } from "@/lib/db";
import { schema } from "@/lib/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

const fallbackAppUrl = "http://localhost:3000";
const baseUrl = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? fallbackAppUrl;

const trustedOrigins = [baseUrl, process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null].filter(
    (value): value is string => Boolean(value),
);

export const auth = betterAuth({
    appName: "The Shape of Sound",
    baseURL: baseUrl,
    secret: process.env.BETTER_AUTH_SECRET ?? "dev-only-placeholder-secret-dev-only-placeholder",
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
        camelCase: true,
    }),
    trustedOrigins,
    disabledPaths: ["/request-password-reset", "/reset-password"],
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()],
    user: {
        deleteUser: {
            enabled: true,
        },
    },
    rateLimit: {
        enabled: true,
        window: 60,
        max: 30,
        storage: "memory",
    },
});
