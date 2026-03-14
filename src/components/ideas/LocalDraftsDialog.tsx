"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { LocalDraftRecord } from "@/types/idea";
import { FolderOpen } from "lucide-react";
import { useState } from "react";

export default function LocalDraftsDialog({
    drafts,
    currentDraftId,
    onLoad,
    onRename,
    onDelete,
}: {
    drafts: LocalDraftRecord[];
    currentDraftId: string | null;
    onLoad: (draft: LocalDraftRecord) => void;
    onRename: (localId: string, title: string) => void;
    onDelete: (localId: string) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-4">
                    <FolderOpen className="size-4" />
                    Drafts ({drafts.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Local drafts</DialogTitle>
                    <DialogDescription>
                        These drafts stay in this browser until you sign in and they are imported into your
                        account.
                    </DialogDescription>
                </DialogHeader>

                {drafts.length === 0 ? (
                    <div className="rounded-md border bg-muted/20 p-4 text-sm text-muted-foreground">
                        No local drafts yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {drafts.map((draft) => (
                            <div
                                key={draft.localId}
                                className="space-y-3 rounded-md border bg-muted/20 p-3 sm:flex sm:items-center sm:gap-3 sm:space-y-0"
                            >
                                <div className="min-w-0 flex-1 space-y-2">
                                    <input
                                        type="text"
                                        value={draft.title}
                                        onChange={(event) => onRename(draft.localId, event.target.value)}
                                        className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                        aria-label="Draft title"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Saved {new Date(draft.savedAt).toLocaleString()}
                                        {currentDraftId === draft.localId ? " • currently loaded" : ""}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            onLoad(draft);
                                            setOpen(false);
                                        }}
                                    >
                                        Load
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onDelete(draft.localId)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <DialogFooter showCloseButton />
            </DialogContent>
        </Dialog>
    );
}
