"use client";

import { authClient } from "@/lib/auth/client";
import { loadLocalDrafts, removeLocalDraftsById, saveLocalDrafts } from "@/lib/ideas/local-drafts";
import { useEffect, useRef, useState } from "react";

export default function SessionDraftImportBridge() {
    const { data: session, isPending } = authClient.useSession();
    const [notice, setNotice] = useState<string | null>(null);
    const attemptedImportKeyRef = useRef<string | null>(null);

    useEffect(() => {
        if (isPending || !session?.user.id) {
            return;
        }

        const drafts = loadLocalDrafts();
        if (drafts.length === 0) {
            return;
        }

        const attemptKey = `${session.user.id}:${drafts.map((draft) => draft.localId).join(",")}`;
        if (attemptedImportKeyRef.current === attemptKey) {
            return;
        }

        attemptedImportKeyRef.current = attemptKey;

        void fetch("/api/ideas/import-local-drafts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ drafts }),
        })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("import failed");
                }

                return response.json() as Promise<{
                    importedLocalIds: string[];
                    failedDrafts: Array<{ localId: string; message: string }>;
                }>;
            })
            .then((result) => {
                const remainingDrafts = removeLocalDraftsById(drafts, result.importedLocalIds);
                saveLocalDrafts(remainingDrafts);

                if (result.failedDrafts.length > 0 && result.importedLocalIds.length > 0) {
                    setNotice(
                        "Imported your browser idea into your account. Some local data could not be imported.",
                    );
                    return;
                }

                if (result.failedDrafts.length > 0) {
                    setNotice("Your browser idea could not be imported right now.");
                    return;
                }

                if (result.importedLocalIds.length > 0) {
                    setNotice("Imported your browser idea into your account.");
                }
            })
            .catch(() => {
                setNotice("Your browser idea could not be imported right now.");
            });
    }, [isPending, session?.user.id]);

    useEffect(() => {
        if (!notice) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setNotice(null);
        }, 5000);

        return () => window.clearTimeout(timeoutId);
    }, [notice]);

    if (!notice) {
        return null;
    }

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 max-w-sm rounded-md border bg-card px-4 py-3 text-sm shadow-lg">
            {notice}
        </div>
    );
}
