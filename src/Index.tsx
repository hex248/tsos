import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import ColorKeyboard from "@/components/controls/ColorKeyboard";
import OctaveSelector from "@/components/controls/OctaveSelector";
import PresetSelector from "@/components/controls/PresetSelector";
import { Slider } from "@/components/ui/slider";
import { colorScale } from "@/constants/colorScale";
import { useShapeState } from "@/hooks/useShapeState";
import { type PreviewVoice, playPreviewSample, startPreviewVoice, stopPreviewVoice } from "@/lib/audio/synth";
import { useEffect, useRef, useState } from "react";
import Layout from "./Layout";
import { cn } from "./lib/utils";

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
    const activeVoicesRef = useRef<Map<string, { voice: PreviewVoice | null; keys: Set<string> }>>(new Map());
    const keyToNoteRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        const stopAllVoices = () => {
            const entries = Array.from(activeVoicesRef.current.values());
            activeVoicesRef.current.clear();
            keyToNoteRef.current.clear();
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
                    activeVoicesRef.current.set(noteKey, { voice: null, keys: new Set([normalizedKey]) });
                    void startPreviewVoice({
                        preset: prev.preset,
                        roundness: prev.roundness,
                        size: prev.size,
                        grain: prev.grain,
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

                return {
                    ...prev,
                    color,
                };
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
    }, [setState]);

    const sidebarContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Shape</span>
                <PresetSelector value={state.preset} onChange={(preset) => setState({ ...state, preset })} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Note/Colour</span>
                <ColorKeyboard
                    value={state.color}
                    onChange={(color) => {
                        const note =
                            colorScale.find((entry) => entry.color.toLowerCase() === color.toLowerCase())
                                ?.note ?? colorScale[0].note;

                        void playPreviewSample({
                            preset: state.preset,
                            roundness: state.roundness,
                            size: state.size,
                            grain: state.grain,
                            note,
                            octave: state.octave,
                            synthNodes: null,
                        });

                        setState({ ...state, color });
                    }}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Octave</span>
                <OctaveSelector value={state.octave} onChange={(octave) => setState({ ...state, octave })} />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Size</span>
                <Slider
                    value={[state.size]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, size: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span
                    className={cn(
                        "text-sm font-medium",
                        state.preset === "circle" ? "opacity-50 pointer-events-none select-none" : "",
                    )}
                >
                    Roundness
                </span>
                <Slider
                    value={[state.roundness]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, roundness: v })}
                    className={state.preset === "circle" ? "opacity-50 pointer-events-none" : ""}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Wobble</span>
                <Slider
                    value={[state.wobble]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, wobble: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Wobble Speed</span>
                <Slider
                    value={[state.wobbleSpeed]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, wobbleSpeed: v })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Wobble Randomness</span>
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
        <Layout sidebarContent={sidebarContent} waveformColor={state.color}>
            <ShapeCanvas state={state} onStateChange={setState} />
        </Layout>
    );
}

export default Index;
