export function getSafeRedirectPath(nextPath: string | null | undefined, fallback = "/settings") {
    if (!nextPath || !nextPath.startsWith("/")) {
        return fallback;
    }

    if (nextPath.startsWith("//")) {
        return fallback;
    }

    return nextPath;
}
