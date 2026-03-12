import { Toggle } from "@/components/ui/toggle";
import { colorScale } from "@/constants/colorScale";
import { cn } from "@/lib/utils";
import type { NoteName } from "@/types/music";

const WHITE_KEYS: NoteName[] = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS = [
    { note: "C#", position: 0 },
    { note: "D#", position: 1 },
    { note: "F#", position: 3 },
    { note: "G#", position: 4 },
    { note: "A#", position: 5 },
];

export default function ColorKeyboard({
    value,
    activeColors = [],
    scaleNotes,
    onChange,
}: {
    value: string;
    activeColors?: string[];
    scaleNotes?: NoteName[] | null;
    onChange: (color: string) => void;
}) {
    const colorByNote = new Map(colorScale.map((entry) => [entry.note, entry.color]));
    const normalizedValue = value.toLowerCase();
    const activeColorSet = new Set(activeColors.map((color) => color.toLowerCase()));
    const scaleNoteSet = scaleNotes ? new Set(scaleNotes) : null;
    const showPressedColors = activeColorSet.size > 0;

    return (
        <div className="relative flex w-full select-none">
            {WHITE_KEYS.map((note) => {
                const color = colorByNote.get(note) ?? colorScale[0].color;
                const isActive = showPressedColors
                    ? activeColorSet.has(color.toLowerCase())
                    : color.toLowerCase() === normalizedValue;
                const isDisabled = scaleNoteSet ? !scaleNoteSet.has(note) : false;

                return (
                    <Toggle
                        key={note}
                        pressed={isActive}
                        disabled={isDisabled}
                        onPressedChange={() => onChange(color)}
                        className={cn(
                            "relative flex flex-1 items-end justify-center rounded-none border border-foreground dark:border-background cursor-pointer",
                            "h-36 min-w-0 px-0",
                            note === "C" ? "rounded-l-md" : "",
                            note === "B" ? "rounded-r-md" : "",
                            isActive ? "z-10" : "",
                            isDisabled ? "cursor-not-allowed opacity-45" : "",
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${note}`}
                    >
                        <span
                            className={cn(
                                "mb-2 inline-flex size-6 items-center justify-center rounded-full text-xs font-medium leading-none",
                                "text-black",
                            )}
                            style={
                                isActive
                                    ? {
                                          backgroundColor: ["D", "E"].includes(note) ? "#000000" : "#ffffff",
                                          color: ["D", "E"].includes(note) ? "#ffffff" : "#000000",
                                      }
                                    : {
                                          backgroundColor: color,
                                          color: ["D", "E"].includes(note) ? "#000000" : "#ffffff",
                                      }
                            }
                        >
                            {note}
                        </span>
                    </Toggle>
                );
            })}

            {BLACK_KEYS.map((key) => {
                const color = colorByNote.get(key.note) ?? colorScale[0].color;
                const isActive = showPressedColors
                    ? activeColorSet.has(color.toLowerCase())
                    : color.toLowerCase() === normalizedValue;
                const isDisabled = scaleNoteSet ? !scaleNoteSet.has(key.note) : false;
                const width = 10;

                return (
                    <Toggle
                        key={key.note}
                        size="sm"
                        pressed={isActive}
                        disabled={isDisabled}
                        onPressedChange={() => onChange(color)}
                        className={cn(
                            "absolute top-0 z-20 h-24 rounded-none border border-black min-w-0 px-0 cursor-pointer",
                            isDisabled ? "cursor-not-allowed opacity-45" : "",
                        )}
                        style={{
                            width: `${width}%`,
                            left: `${(key.position + 1) * (100 / WHITE_KEYS.length) - width / 2}%`,
                            backgroundColor: color,
                        }}
                        aria-label={`Select ${key.note}`}
                    >
                        <span className={cn("flex h-full w-full items-end justify-center pb-2")}>
                            <span
                                className={cn(
                                    "inline-flex size-5 items-center justify-center rounded-full text-[10px] font-medium leading-none",
                                    isActive ? "bg-white text-black" : "text-white",
                                )}
                                style={!isActive ? { backgroundColor: color } : undefined}
                            >
                                {key.note}
                            </span>
                        </span>
                    </Toggle>
                );
            })}
        </div>
    );
}
