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
import { Toggle } from "@/components/ui/toggle";
import { colorScale } from "@/constants/colorScale";
import {
    type ExportFormat,
    createExportFilename,
    downloadExport,
    encodeMp3Mono,
    encodeWavMono,
    renderExportBuffer,
} from "@/lib/audio/export";
import type { ShapeState } from "@/types/shape";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function formatPresetLabel(preset: ShapeState["preset"]) {
    return preset.charAt(0).toUpperCase() + preset.slice(1);
}

function getNoteFromColor(color: string) {
    return (
        colorScale.find((entry) => entry.color.toLowerCase() === color.toLowerCase())?.note ??
        colorScale[0].note
    );
}

export default function ExportDialog({ state }: { state: ShapeState }) {
    const [open, setOpen] = useState(false);
    const [format, setFormat] = useState<ExportFormat>("wav");
    const [applyEnvelope, setApplyEnvelope] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const note = useMemo(() => getNoteFromColor(state.color), [state.color]);

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormat("wav");
        setApplyEnvelope(false);
        setErrorMessage(null);
    }, [open]);

    const handleExport = async () => {
        setIsExporting(true);
        setErrorMessage(null);

        try {
            const buffer = await renderExportBuffer({
                state,
                format,
                applyEnvelope,
            });

            const blob = format === "wav" ? encodeWavMono(buffer) : await encodeMp3Mono(buffer);

            downloadExport({
                blob,
                filename: createExportFilename(state, format, applyEnvelope),
                mimeType: blob.type,
            });

            setOpen(false);
        } catch (error) {
            console.error(error);
            setErrorMessage("Export failed. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-4">
                    <Download className="size-4" />
                    Export Audio
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Audio</DialogTitle>
                    <DialogDescription>
                        Leave envelope off for a dry sample you can shape in your DAW. Turn it on to bake in
                        the current sound shape.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Format</p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={format === "wav" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setFormat("wav")}
                                disabled={isExporting}
                            >
                                WAV
                            </Button>
                            <Button
                                type="button"
                                variant={format === "mp3" ? "default" : "outline"}
                                className="flex-1"
                                onClick={() => setFormat("mp3")}
                                disabled={isExporting}
                            >
                                MP3
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Apply envelope</p>
                            <p className="text-sm text-muted-foreground">
                                Uses the current attack, hold, decay, and sustain settings.
                            </p>
                        </div>
                        <Toggle
                            variant="outline"
                            pressed={applyEnvelope}
                            onPressedChange={setApplyEnvelope}
                            disabled={isExporting}
                            aria-label="Apply envelope to export"
                        >
                            {applyEnvelope ? "On" : "Off"}
                        </Toggle>
                    </div>

                    <div className="rounded-md border bg-muted/20 p-3 text-sm">
                        <p className="font-medium">Exporting</p>
                        <p className="mt-1 text-muted-foreground">
                            {formatPresetLabel(state.preset)} preset, {note}
                            {state.octave}, {format.toUpperCase()}
                        </p>
                    </div>

                    {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
                </div>

                <DialogFooter showCloseButton>
                    <Button type="button" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? "Exporting..." : "Export"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
