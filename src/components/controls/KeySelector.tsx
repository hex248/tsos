import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NOTE_NAMES, type NoteName, type ScaleType } from "@/types/music";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const NONE_VALUE = "none";

function formatScaleType(scaleType: ScaleType) {
    return scaleType.charAt(0).toUpperCase() + scaleType.slice(1);
}

function handlePointerOnlySelectKeyDown(event: ReactKeyboardEvent) {
    if (event.key === "Tab" || event.key === "Escape") {
        return;
    }

    event.preventDefault();
}

export default function KeySelector({
    root,
    scaleType,
    onRootChange,
    onScaleTypeChange,
}: {
    root: NoteName | null;
    scaleType: ScaleType;
    onRootChange: (root: NoteName | null) => void;
    onScaleTypeChange: (scaleType: ScaleType) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Key</span>
            <Select
                value={root ?? NONE_VALUE}
                onValueChange={(value) => onRootChange(value === NONE_VALUE ? null : (value as NoteName))}
            >
                <SelectTrigger aria-label="Select key root" onKeyDownCapture={handlePointerOnlySelectKeyDown}>
                    <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent onKeyDownCapture={handlePointerOnlySelectKeyDown}>
                    <SelectItem value={NONE_VALUE}>None</SelectItem>
                    {NOTE_NAMES.map((note) => (
                        <SelectItem key={note} value={note}>
                            {note}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {root ? (
                <Select value={scaleType} onValueChange={(value) => onScaleTypeChange(value as ScaleType)}>
                    <SelectTrigger
                        aria-label="Select scale type"
                        onKeyDownCapture={handlePointerOnlySelectKeyDown}
                    >
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent onKeyDownCapture={handlePointerOnlySelectKeyDown}>
                        <SelectItem value="major">{formatScaleType("major")}</SelectItem>
                        <SelectItem value="minor">{formatScaleType("minor")}</SelectItem>
                    </SelectContent>
                </Select>
            ) : null}
        </div>
    );
}
