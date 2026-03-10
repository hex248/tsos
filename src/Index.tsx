import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import ColorKeyboard from "@/components/controls/ColorKeyboard";
import EnvelopeControls from "@/components/controls/EnvelopeControls";
import OctaveSelector from "@/components/controls/OctaveSelector";
import PresetSelector from "@/components/controls/PresetSelector";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { colorScale } from "@/constants/colorScale";
import { useShapeState } from "@/hooks/useShapeState";
import { type PreviewVoice, playPreviewSample, startPreviewVoice, stopPreviewVoice } from "@/lib/audio/synth";
import type { ViewMode } from "@/types/viewMode";
import { Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Layout from "./Layout";

const KEY_NOTE_BINDINGS = [
    { key: "z", note: "C", octaveOffset: -1 },
    { key: "x", note: "C#", octaveOffset: -1 },
    { key: "c", note: "D", octaveOffset: -1 },
    { key: "v", note: "D#", octaveOffset: -1 },
    { key: "b", note: "E", octaveOffset: -1 },
    { key: "n", note: "F", octaveOffset: -1 },
    { key: "m", note: "F#", octaveOffset: -1 },
    { key: ",", note: "G", octaveOffset: -1 },
    { key: ".", note: "G#", octaveOffset: -1 },
    { key: "a", note: "A", octaveOffset: -1 },
    { key: "s", note: "A#", octaveOffset: -1 },
    { key: "d", note: "B", octaveOffset: -1 },
    { key: "f", note: "C", octaveOffset: 0 },
    { key: "g", note: "C#", octaveOffset: 0 },
    { key: "h", note: "D", octaveOffset: 0 },
    { key: "j", note: "D#", octaveOffset: 0 },
    { key: "k", note: "E", octaveOffset: 0 },
    { key: "l", note: "F", octaveOffset: 0 },
    { key: ";", note: "F#", octaveOffset: 0 },
    { key: "'", note: "G", octaveOffset: 0 },
    { key: "q", note: "G#", octaveOffset: 0 },
    { key: "w", note: "A", octaveOffset: 0 },
    { key: "e", note: "A#", octaveOffset: 0 },
    { key: "r", note: "B", octaveOffset: 0 },
    { key: "t", note: "C", octaveOffset: 1 },
    { key: "y", note: "C#", octaveOffset: 1 },
    { key: "u", note: "D", octaveOffset: 1 },
    { key: "i", note: "D#", octaveOffset: 1 },
    { key: "o", note: "E", octaveOffset: 1 },
    { key: "p", note: "F", octaveOffset: 1 },
    { key: "[", note: "F#", octaveOffset: 1 },
    { key: "]", note: "G", octaveOffset: 1 },
    { key: "1", note: "G#", octaveOffset: 1 },
    { key: "2", note: "A", octaveOffset: 1 },
    { key: "3", note: "A#", octaveOffset: 1 },
    { key: "4", note: "B", octaveOffset: 1 },
    { key: "5", note: "C", octaveOffset: 2 },
    { key: "6", note: "C#", octaveOffset: 2 },
    { key: "7", note: "D", octaveOffset: 2 },
    { key: "8", note: "D#", octaveOffset: 2 },
    { key: "9", note: "E", octaveOffset: 2 },
    { key: "0", note: "F", octaveOffset: 2 },
    { key: "-", note: "F#", octaveOffset: 2 },
    { key: "=", note: "G", octaveOffset: 2 },
];

const KEY_NOTE_MAP = new Map(KEY_NOTE_BINDINGS.map((binding) => [binding.key, binding]));
const COLOR_BY_NOTE = new Map(colorScale.map((entry) => [entry.note, entry.color]));
const MIN_OCTAVE = 1;
const MAX_OCTAVE = 8;

function clampOctave(value: number) {
    return Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, value));
}

function canToggleModeWithTab(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) {
        return true;
    }

    if (target.closest('[role="dialog"], [data-slot="dialog-content"]')) {
        return false;
    }

    const tagName = target.tagName.toLowerCase();
    if (
        target.isContentEditable ||
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        tagName === "button"
    ) {
        return false;
    }

    if (target.closest("a, button, [role='button'], [role='slider'], [role='tab']")) {
        return false;
    }

    return true;
}

function parseHexColor(color: string) {
    const normalized = color.replace("#", "");

    return {
        red: Number.parseInt(normalized.slice(0, 2), 16),
        green: Number.parseInt(normalized.slice(2, 4), 16),
        blue: Number.parseInt(normalized.slice(4, 6), 16),
    };
}

function mixColors(colors: string[]) {
    if (colors.length === 0) {
        throw new Error("cannot mix an empty color list");
    }

    const totals = colors.reduce(
        (accumulator, color) => {
            const rgb = parseHexColor(color);

            return {
                red: accumulator.red + rgb.red,
                green: accumulator.green + rgb.green,
                blue: accumulator.blue + rgb.blue,
            };
        },
        { red: 0, green: 0, blue: 0 },
    );

    return `#${Math.round(totals.red / colors.length)
        .toString(16)
        .padStart(2, "0")}${Math.round(totals.green / colors.length)
        .toString(16)
        .padStart(2, "0")}${Math.round(totals.blue / colors.length)
        .toString(16)
        .padStart(2, "0")}`;
}

function Index() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth - 320,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth - 320,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const [state, setState] = useShapeState(centerX, centerY);
    const [viewMode, setViewMode] = useState<ViewMode>("edit");
    const [activeKeyboardColors, setActiveKeyboardColors] = useState<string[]>([]);
    const activeVoicesRef = useRef<
        Map<string, { voice: PreviewVoice | null; keys: Set<string>; color: string }>
    >(new Map());
    const keyToNoteRef = useRef<Map<string, string>>(new Map());

    const toggleMode = useCallback(() => {
        setViewMode((prev) => (prev === "view" ? "edit" : "view"));
    }, []);

    const syncActiveKeyboardColors = useCallback(() => {
        setActiveKeyboardColors(Array.from(activeVoicesRef.current.values(), (entry) => entry.color));
    }, []);

    const displayedColor = activeKeyboardColors.length > 0 ? mixColors(activeKeyboardColors) : state.color;

    useEffect(() => {
        const stopAllVoices = () => {
            const entries = Array.from(activeVoicesRef.current.values());
            activeVoicesRef.current.clear();
            keyToNoteRef.current.clear();
            setActiveKeyboardColors([]);
            for (const entry of entries) {
                if (entry.voice) {
                    stopPreviewVoice(entry.voice, null);
                }
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }

            if (event.key === "Tab") {
                if (canToggleModeWithTab(event.target)) {
                    event.preventDefault();
                    toggleMode();
                }
                return;
            }

            const target = event.target;
            if (target instanceof HTMLElement) {
                const tagName = target.tagName.toLowerCase();
                if (
                    target.isContentEditable ||
                    tagName === "input" ||
                    tagName === "textarea" ||
                    tagName === "select"
                ) {
                    return;
                }
            }

            const normalizedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            const binding = KEY_NOTE_MAP.get(normalizedKey);
            if (!binding) {
                return;
            }

            setState((prev) => {
                const targetOctave = clampOctave(prev.octave + binding.octaveOffset);
                const color = COLOR_BY_NOTE.get(binding.note) ?? prev.color;
                const noteKey = `${binding.note}${targetOctave}`;

                keyToNoteRef.current.set(normalizedKey, noteKey);
                const existingEntry = activeVoicesRef.current.get(noteKey);
                if (existingEntry) {
                    existingEntry.keys.add(normalizedKey);
                } else {
                    activeVoicesRef.current.set(noteKey, {
                        voice: null,
                        keys: new Set([normalizedKey]),
                        color,
                    });
                    void startPreviewVoice({
                        preset: prev.preset,
                        roundness: prev.roundness,
                        size: prev.size,
                        grain: prev.grain,
                        attack: prev.attack,
                        hold: prev.hold,
                        decay: prev.decay,
                        sustain: prev.sustain,
                        wobble: prev.wobble,
                        wobbleSpeed: prev.wobbleSpeed,
                        wobbleRandomness: prev.wobbleRandomness,
                        note: binding.note,
                        octave: targetOctave,
                        synthNodes: null,
                    }).then((voice) => {
                        const entry = activeVoicesRef.current.get(noteKey);
                        if (!entry) {
                            stopPreviewVoice(voice, null);
                            return;
                        }

                        entry.voice = voice;
                        if (entry.keys.size === 0) {
                            activeVoicesRef.current.delete(noteKey);
                            stopPreviewVoice(voice, null);
                        }
                    });
                }

                syncActiveKeyboardColors();

                return prev;
            });
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const normalizedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key;
            const noteKey = keyToNoteRef.current.get(normalizedKey);
            if (!noteKey) {
                return;
            }

            keyToNoteRef.current.delete(normalizedKey);
            const entry = activeVoicesRef.current.get(noteKey);
            if (!entry) {
                return;
            }

            entry.keys.delete(normalizedKey);
            if (entry.keys.size === 0) {
                activeVoicesRef.current.delete(noteKey);
                if (entry.voice) {
                    stopPreviewVoice(entry.voice, null);
                }
            }

            syncActiveKeyboardColors();
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", stopAllVoices);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("blur", stopAllVoices);
            stopAllVoices();
        };
    }, [setState, syncActiveKeyboardColors, toggleMode]);

    const modeToggleButton = (
        <Button
            variant={viewMode === "edit" ? "default" : "outline"}
            size="sm"
            className="rounded-full px-4"
            onClick={toggleMode}
            aria-pressed={viewMode === "edit"}
            aria-label={`Switch to ${viewMode === "view" ? "edit" : "view"} mode`}
        >
            Mode: {viewMode === "view" ? "View" : "Edit"}
        </Button>
    );

    const sidebarContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Shape</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                The oscillator waveform. Square = square wave, Triangle = sawtooth. Use
                                Roundness to morph toward a smoother tone (sine wave).
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <PresetSelector value={state.preset} onChange={(preset) => setState({ ...state, preset })} />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Note/Colour</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Inspired by the clavier a lumieres, a light keyboard that linked notes to
                                colour.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <ColorKeyboard
                    value={displayedColor}
                    activeColors={activeKeyboardColors}
                    onChange={(color) => {
                        const note =
                            colorScale.find((entry) => entry.color.toLowerCase() === color.toLowerCase())
                                ?.note ?? colorScale[0].note;

                        void playPreviewSample({
                            preset: state.preset,
                            roundness: state.roundness,
                            size: state.size,
                            grain: state.grain,
                            attack: state.attack,
                            hold: state.hold,
                            decay: state.decay,
                            sustain: state.sustain,
                            wobble: state.wobble,
                            wobbleSpeed: state.wobbleSpeed,
                            wobbleRandomness: state.wobbleRandomness,
                            note,
                            octave: state.octave,
                            synthNodes: null,
                        });

                        setState({ ...state, color });
                    }}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Octave</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Raises or lowers the pitch by octaves.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <OctaveSelector value={state.octave} onChange={(octave) => setState({ ...state, octave })} />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Size</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Controls how loud the sound is (gain).</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.size]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, size: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Roundness</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Blends the sound from sharp to smooth (100% roundness is a sine wave, 0%
                                roundness is the shape/wave you selected).
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.roundness]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, roundness: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Sound Shape</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Controls AHDS envelope stages: attack time, hold duration, decay time, and
                                sustain level.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <EnvelopeControls
                    values={{
                        attack: state.attack,
                        hold: state.hold,
                        decay: state.decay,
                        sustain: state.sustain,
                    }}
                    onChange={(envelope) => setState({ ...state, ...envelope })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Wobble</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Controls tremolo depth by modulating volume over time.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.wobble]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, wobble: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Wobble Speed</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Controls tremolo rate in Hz.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.wobbleSpeed]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, wobbleSpeed: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Wobble Randomness</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Blends the tremolo from smooth periodic motion toward more irregular movement.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.wobbleRandomness]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, wobbleRandomness: v })}
                />
            </div>
        </div>
    );

    return (
        <Layout
            sidebarContent={sidebarContent}
            waveformColor={displayedColor}
            viewportLeftOverlay={modeToggleButton}
        >
            <ShapeCanvas
                state={{ ...state, color: displayedColor }}
                onStateChange={setState}
                mode={viewMode}
            />
        </Layout>
    );
}

export default Index;
