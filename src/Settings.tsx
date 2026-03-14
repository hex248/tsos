"use client";

import Layout from "@/Layout";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import type { SerializedIdeaRecord } from "@/types/idea";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function Settings({
    ideas,
}: {
    ideas: SerializedIdeaRecord[];
}) {
    const router = useRouter();
    const [ideaState, setIdeaState] = useState(ideas);
    const [deletePassword, setDeletePassword] = useState("");
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isBusy, setIsBusy] = useState(false);

    const sortedIdeas = useMemo(
        () =>
            [...ideaState].sort(
                (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
            ),
        [ideaState],
    );

    const handleRename = async (ideaId: string, title: string) => {
        const trimmedTitle = title.trim();
        if (!trimmedTitle) {
            return;
        }

        setStatusMessage(null);
        setErrorMessage(null);

        const response = await fetch(`/api/ideas/${ideaId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: trimmedTitle,
            }),
        });

        if (!response.ok) {
            setErrorMessage("That idea could not be renamed right now.");
            return;
        }

        const payload = (await response.json()) as {
            idea: SerializedIdeaRecord;
        };

        setIdeaState((current) => current.map((idea) => (idea.id === ideaId ? payload.idea : idea)));
        setStatusMessage("Updated idea title.");
    };

    const handleDeleteIdea = async (ideaId: string) => {
        const confirmed = window.confirm("Delete this idea permanently?");
        if (!confirmed) {
            return;
        }

        setStatusMessage(null);
        setErrorMessage(null);

        const response = await fetch(`/api/ideas/${ideaId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            setErrorMessage("That idea could not be deleted right now.");
            return;
        }

        setIdeaState((current) => current.filter((idea) => idea.id !== ideaId));
        setStatusMessage("Deleted idea.");
    };

    const handleSignOut = async () => {
        setIsBusy(true);
        setStatusMessage(null);
        setErrorMessage(null);

        const { error } = await authClient.signOut();

        if (error) {
            setErrorMessage(error.message || "We could not sign you out.");
            setIsBusy(false);
            return;
        }

        router.replace("/");
        router.refresh();
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Delete your account and all saved ideas permanently?");

        if (!confirmed) {
            return;
        }

        setIsBusy(true);
        setStatusMessage(null);
        setErrorMessage(null);

        const { error } = await authClient.deleteUser({
            password: deletePassword || undefined,
            callbackURL: window.location.origin,
        });

        if (error) {
            setErrorMessage(error.message || "Your account could not be deleted.");
            setIsBusy(false);
            return;
        }

        router.replace("/");
        router.refresh();
    };

    return (
        <Layout
            sidebarContent={
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold">Account</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your session, saved ideas, and account removal.
                        </p>
                    </div>

                    {statusMessage ? (
                        <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-900 dark:text-emerald-100">
                            {statusMessage}
                        </div>
                    ) : null}
                    {errorMessage ? (
                        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                            {errorMessage}
                        </div>
                    ) : null}

                    <div className="rounded-md border bg-muted/20 p-3 text-sm">
                        <p className="font-medium">Session</p>
                        <p className="mt-1 text-muted-foreground">
                            Sign out on this device when you are done.
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-3 w-full"
                            onClick={handleSignOut}
                            disabled={isBusy}
                        >
                            Sign out
                        </Button>
                    </div>

                    <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                        <p className="font-medium text-destructive">Delete account</p>
                        <p className="mt-1 text-muted-foreground">
                            This permanently removes your account and all public idea URLs.
                        </p>
                        <label htmlFor="delete-password" className="mt-3 block text-sm font-medium">
                            Current password
                        </label>
                        <input
                            id="delete-password"
                            type="password"
                            value={deletePassword}
                            onChange={(event) => setDeletePassword(event.target.value)}
                            className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                            autoComplete="current-password"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            className="mt-3 w-full"
                            onClick={handleDeleteAccount}
                            disabled={isBusy}
                        >
                            Delete account
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="mx-auto w-full max-w-4xl space-y-4 p-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold">My ideas</h2>
                    <p className="text-sm text-muted-foreground">
                        Open, rename, or delete your saved public ideas.
                    </p>
                </div>

                {sortedIdeas.length === 0 ? (
                    <div className="rounded-md border bg-card p-6 text-sm text-muted-foreground">
                        You have not saved any ideas yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedIdeas.map((idea) => (
                            <div key={idea.id} className="space-y-3 rounded-md border bg-card p-4 shadow-sm">
                                <div className="space-y-2">
                                    <label htmlFor={`idea-title-${idea.id}`} className="text-sm font-medium">
                                        Title
                                    </label>
                                    <input
                                        id={`idea-title-${idea.id}`}
                                        type="text"
                                        value={idea.title}
                                        onChange={(event) =>
                                            setIdeaState((current) =>
                                                current.map((entry) =>
                                                    entry.id === idea.id
                                                        ? { ...entry, title: event.target.value }
                                                        : entry,
                                                ),
                                            )
                                        }
                                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Updated {new Date(idea.updatedAt).toLocaleString()}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Button asChild type="button" size="sm">
                                        <Link href={`/ideas/${idea.id}/edit`}>Edit</Link>
                                    </Button>
                                    <Button asChild type="button" variant="outline" size="sm">
                                        <Link href={`/ideas/${idea.id}`}>Public View</Link>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRename(idea.id, idea.title)}
                                    >
                                        Save Title
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteIdea(idea.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
