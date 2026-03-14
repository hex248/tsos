"use client";

import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import ColorKeyboard from "@/components/controls/ColorKeyboard";
import EnvelopeControls from "@/components/controls/EnvelopeControls";
import ExportDialog from "@/components/controls/ExportDialog";
import KeySelector from "@/components/controls/KeySelector";
import OctaveSelector from "@/components/controls/OctaveSelector";
import PresetSelector from "@/components/controls/PresetSelector";
import TutorialDialog from "@/components/controls/TutorialDialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { colorScale } from "@/constants/colorScale";
import { useShapeState } from "@/hooks/useShapeState";
import { getDiatonicMappedNote, getScaleNotes, isNoteInScale } from "@/lib/audio/keySelection";
import { type PreviewVoice, playPreviewSample, startPreviewVoice, stopPreviewVoice } from "@/lib/audio/synth";
import { createLocalDraftRecord, loadLocalDrafts, saveLocalDrafts } from "@/lib/ideas/local-drafts";
import {
    applyIdeaSoundConfig,
    createIdeaTitle,
    getNoteFromColor,
    toIdeaSoundConfig,
} from "@/lib/ideas/schema";
import type { NoteName, ScaleType } from "@/types/music";
import type { IdeaSoundConfig, ShapeState } from "@/types/shape";
import type { ViewMode } from "@/types/viewMode";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
] as { key: string; note: NoteName; octaveOffset: number }[];

type KeyNoteBinding = (typeof KEY_NOTE_BINDINGS)[number];
type EditorPageMode = "root" | "public" | "edit";
type IndexedKeyNoteBinding = KeyNoteBinding & { index: number };

interface IndexProps {
    pageMode?: EditorPageMode;
    initialConfig?: IdeaSoundConfig;
    initialTitle?: string;
    ideaId?: string;
    isAuthenticated?: boolean;
}

const KEY_NOTE_MAP = new Map<string, IndexedKeyNoteBinding>(
    KEY_NOTE_BINDINGS.map((binding, index) => [binding.key, { ...binding, index }]),
);
const COLOR_BY_NOTE = new Map(colorScale.map((entry) => [entry.note, entry.color]));
const MIN_OCTAVE = 1;
const MAX_OCTAVE = 8;
const TUTORIAL_STORAGE_KEY = "tsos-tutorial-seen";

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

function getColorForNote(note: NoteName) {
    return COLOR_BY_NOTE.get(note) ?? colorScale[0].color;
}

function getStateWithKeySelection(
    currentState: ShapeState,
    keyRoot: NoteName | null,
    scaleType: ScaleType,
): ShapeState {
    if (!keyRoot) {
        return {
            ...currentState,
            keyRoot: null,
            scaleType: "major",
        };
    }

    const nextState = {
        ...currentState,
        keyRoot,
        scaleType,
    };

    const currentNote = getNoteFromColor(currentState.color);
    if (isNoteInScale(currentNote, keyRoot, scaleType)) {
        return nextState;
    }

    return {
        ...nextState,
        color: getColorForNote(keyRoot),
    };
}

function getMappedKeyboardNote(binding: IndexedKeyNoteBinding, currentState: ShapeState) {
    if (!currentState.keyRoot) {
        return {
            note: binding.note,
            octave: clampOctave(currentState.octave + binding.octaveOffset),
        };
    }

    const mappedNote = getDiatonicMappedNote(
        binding.index,
        currentState.keyRoot,
        currentState.scaleType,
        clampOctave(currentState.octave - 1),
    );

    return {
        note: mappedNote.note,
        octave: clampOctave(mappedNote.octave),
    };
}

function formatPercent(value: number) {
    return `${Math.round(value)}%`;
}

export default function Index({
    pageMode = "root",
    initialConfig,
    initialTitle,
    ideaId,
    isAuthenticated = false,
}: IndexProps) {
    const router = useRouter();
    const isReadOnly = pageMode === "public";
    const isEditIdeaPage = pageMode === "edit";
    const isRootPage = pageMode === "root";

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

    const [state, setState] = useShapeState(centerX, centerY, initialConfig);
    const stateRef = useRef(state);
    const [viewMode, setViewMode] = useState<ViewMode>(isReadOnly ? "view" : "edit");
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [activeKeyboardColors, setActiveKeyboardColors] = useState<string[]>([]);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPersisting, setIsPersisting] = useState(false);
    const [ideaTitle, setIdeaTitle] = useState(initialTitle ?? "");
    const [isGuestIdeaHydrated, setIsGuestIdeaHydrated] = useState(!(isRootPage && !isAuthenticated));
    const activeVoicesRef = useRef<
        Map<string, { voice: PreviewVoice | null; keys: Set<string>; color: string }>
    >(new Map());
    const keyToNoteRef = useRef<Map<string, string>>(new Map());
    const guestIdeaLocalIdRef = useRef<string | null>(null);

    stateRef.current = state;

    useEffect(() => {
        if (isReadOnly || !isRootPage) {
            return;
        }

        try {
            if (!localStorage.getItem(TUTORIAL_STORAGE_KEY)) {
                setIsTutorialOpen(true);
            }
        } catch {
            setIsTutorialOpen(true);
        }
    }, [isReadOnly, isRootPage]);

    useEffect(() => {
        if (!isRootPage || isAuthenticated) {
            setIsGuestIdeaHydrated(true);
            return;
        }

        const [storedIdea] = loadLocalDrafts();
        if (storedIdea) {
            guestIdeaLocalIdRef.current = storedIdea.localId;
            setState((previousState) => applyIdeaSoundConfig(previousState, storedIdea.config));
        }

        setIsGuestIdeaHydrated(true);
    }, [isAuthenticated, isRootPage, setState]);

    useEffect(() => {
        if (!isRootPage || isAuthenticated || !isGuestIdeaHydrated) {
            return;
        }

        const nextIdea = createLocalDraftRecord(toIdeaSoundConfig(state));

        if (guestIdeaLocalIdRef.current) {
            nextIdea.localId = guestIdeaLocalIdRef.current;
        } else {
            guestIdeaLocalIdRef.current = nextIdea.localId;
        }

        saveLocalDrafts([nextIdea]);
    }, [isAuthenticated, isGuestIdeaHydrated, isRootPage, state]);

    const toggleMode = useCallback(() => {
        if (isReadOnly) {
            return;
        }

        setViewMode((prev) => (prev === "view" ? "edit" : "view"));
    }, [isReadOnly]);

    const handleTutorialOpenChange = useCallback((open: boolean) => {
        setIsTutorialOpen(open);

        if (!open) {
            try {
                localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
            } catch {}
        }
    }, []);

    const syncActiveKeyboardColors = useCallback(() => {
        setActiveKeyboardColors(Array.from(activeVoicesRef.current.values(), (entry) => entry.color));
    }, []);

    const playStatePreview = useCallback((previewState: ShapeState) => {
        void playPreviewSample({
            preset: previewState.preset,
            roundness: previewState.roundness,
            size: previewState.size,
            grain: previewState.grain,
            attack: previewState.attack,
            hold: previewState.hold,
            decay: previewState.decay,
            sustain: previewState.sustain,
            wobble: previewState.wobble,
            wobbleSpeed: previewState.wobbleSpeed,
            wobbleRandomness: previewState.wobbleRandomness,
            note: getNoteFromColor(previewState.color),
            octave: previewState.octave,
            synthNodes: null,
        });
    }, []);

    const playAutoPreviewIfIdle = useCallback(
        (previewState: ShapeState) => {
            if (activeVoicesRef.current.size > 0) {
                return;
            }

            playStatePreview(previewState);
        },
        [playStatePreview],
    );

    const handleKeyRootChange = useCallback(
        (keyRoot: NoteName | null) => {
            setState((previousState) =>
                getStateWithKeySelection(previousState, keyRoot, previousState.scaleType),
            );
        },
        [setState],
    );

    const handleScaleTypeChange = useCallback(
        (scaleType: ScaleType) => {
            setState((previousState) =>
                getStateWithKeySelection(previousState, previousState.keyRoot, scaleType),
            );
        },
        [setState],
    );

    const scaleNotes = state.keyRoot ? getScaleNotes(state.keyRoot, state.scaleType) : null;
    const displayedColor = activeKeyboardColors.length > 0 ? mixColors(activeKeyboardColors) : state.color;
    const currentConfig = toIdeaSoundConfig(state);
    const publicTitle = initialTitle ?? createIdeaTitle(currentConfig);

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
                if (!isReadOnly && canToggleModeWithTab(event.target)) {
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

            const currentState = stateRef.current;
            const mappedNote = getMappedKeyboardNote(binding, currentState);
            const color = getColorForNote(mappedNote.note);
            const noteKey = `${mappedNote.note}${mappedNote.octave}`;

            setState((previousState) =>
                previousState.color === color ? previousState : { ...previousState, color },
            );

            keyToNoteRef.current.set(normalizedKey, noteKey);
            const existingEntry = activeVoicesRef.current.get(noteKey);
            if (existingEntry) {
                existingEntry.keys.add(normalizedKey);
                syncActiveKeyboardColors();
                return;
            }

            activeVoicesRef.current.set(noteKey, {
                voice: null,
                keys: new Set([normalizedKey]),
                color,
            });
            syncActiveKeyboardColors();

            void startPreviewVoice({
                preset: currentState.preset,
                roundness: currentState.roundness,
                size: currentState.size,
                grain: currentState.grain,
                attack: currentState.attack,
                hold: currentState.hold,
                decay: currentState.decay,
                sustain: currentState.sustain,
                wobble: currentState.wobble,
                wobbleSpeed: currentState.wobbleSpeed,
                wobbleRandomness: currentState.wobbleRandomness,
                note: mappedNote.note,
                octave: mappedNote.octave,
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
    }, [isReadOnly, setState, syncActiveKeyboardColors, toggleMode]);

    const handleCreateIdea = useCallback(async () => {
        setIsPersisting(true);
        setStatusMessage(null);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/ideas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    config: toIdeaSoundConfig(state),
                }),
            });

            if (!response.ok) {
                throw new Error("save failed");
            }

            const payload = (await response.json()) as {
                idea: {
                    id: string;
                };
            };

            router.push(`/ideas/${payload.idea.id}/edit`);
        } catch {
            setErrorMessage("This idea could not be saved right now.");
        } finally {
            setIsPersisting(false);
        }
    }, [router, state]);

    const handleUpdateIdea = useCallback(async () => {
        if (!ideaId) {
            return;
        }

        const trimmedTitle = ideaTitle.trim() || publicTitle;

        setIsPersisting(true);
        setStatusMessage(null);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/ideas/${ideaId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: trimmedTitle,
                    config: toIdeaSoundConfig(state),
                }),
            });

            if (!response.ok) {
                throw new Error("update failed");
            }

            setIdeaTitle(trimmedTitle);
            setStatusMessage("Saved idea changes.");
        } catch {
            setErrorMessage("This idea could not be updated right now.");
        } finally {
            setIsPersisting(false);
        }
    }, [ideaId, ideaTitle, publicTitle, state]);

    const modeToggleButton = !isReadOnly ? (
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
    ) : null;

    const controlsSidebarContent = (
        <div className="flex flex-col gap-4">
            {isEditIdeaPage ? (
                <div className="space-y-2 rounded-md border bg-muted/20 p-3">
                    <p className="text-sm font-medium">Idea title</p>
                    <input
                        type="text"
                        value={ideaTitle}
                        onChange={(event) => setIdeaTitle(event.target.value)}
                        className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        placeholder="Idea title"
                    />
                    <div className="flex gap-2">
                        <Button asChild type="button" variant="outline" size="sm">
                            <Link href={`/ideas/${ideaId}`}>Open Public View</Link>
                        </Button>
                    </div>
                </div>
            ) : null}

            {isRootPage && !isAuthenticated ? (
                <div className="space-y-2 rounded-md border bg-muted/20 p-3 text-sm">
                    <p className="font-medium">Create an account to keep this idea</p>
                    <p className="text-muted-foreground">
                        This browser keeps your current sound while you explore. Sign in or register to move
                        it into your account and keep it shareable by URL.
                    </p>
                    <div className="flex gap-2">
                        <Button asChild type="button" variant="outline" size="sm">
                            <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild type="button" size="sm">
                            <Link href="/register">Register</Link>
                        </Button>
                    </div>
                </div>
            ) : null}

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

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Shape</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                The oscillator waveform. Square = square wave, Triangle = sawtooth. Use
                                Roundness to morph toward a smoother tone.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <PresetSelector
                    value={state.preset}
                    onChange={(preset) => {
                        if (preset === state.preset) {
                            return;
                        }

                        const nextState = { ...state, preset };
                        playAutoPreviewIfIdle(nextState);
                        setState(nextState);
                    }}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Note/Colour</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
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
                    scaleNotes={scaleNotes}
                    onChange={(color) => {
                        const nextState = { ...state, color };
                        playStatePreview(nextState);
                        setState(nextState);
                    }}
                />
            </div>
            <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-start gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">Octave</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="size-3.5 cursor-help text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Raises or lowers the pitch by octaves.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <OctaveSelector
                        value={state.octave}
                        onChange={(octave) => setState({ ...state, octave })}
                    />
                </div>
                <KeySelector
                    root={state.keyRoot}
                    scaleType={state.scaleType}
                    onRootChange={handleKeyRootChange}
                    onScaleTypeChange={handleScaleTypeChange}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Size</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Controls how loud the sound is.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.size]}
                    min={0}
                    max={100}
                    onValueChange={([value]) => setState({ ...state, size: value })}
                    onValueCommit={([size]) => playAutoPreviewIfIdle({ ...state, size })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Roundness</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Blends the sound from sharp to smooth. 100% roundness becomes a sine wave.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <Slider
                    value={[state.roundness]}
                    min={0}
                    max={100}
                    onValueChange={([value]) => setState({ ...state, roundness: value })}
                    onValueCommit={([roundness]) => playAutoPreviewIfIdle({ ...state, roundness })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Sound Shape</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
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
                    onCommit={(envelope) => playAutoPreviewIfIdle({ ...state, ...envelope })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Wobble</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
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
                    onValueChange={([value]) => setState({ ...state, wobble: value })}
                    onValueCommit={([wobble]) => playAutoPreviewIfIdle({ ...state, wobble })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Wobble Speed</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
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
                    onValueChange={([value]) => setState({ ...state, wobbleSpeed: value })}
                    onValueCommit={([wobbleSpeed]) => playAutoPreviewIfIdle({ ...state, wobbleSpeed })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Wobble Randomness</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
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
                    onValueChange={([value]) => setState({ ...state, wobbleRandomness: value })}
                    onValueCommit={([wobbleRandomness]) =>
                        playAutoPreviewIfIdle({ ...state, wobbleRandomness })
                    }
                />
            </div>
        </div>
    );

    const readOnlySidebarContent = (
        <div className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold">{publicTitle}</h2>
                <p className="text-sm text-muted-foreground">
                    This idea is public by URL. Playback and export stay enabled, but editing is disabled.
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">Note/Colour</span>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-3.5 cursor-help text-muted-foreground" />
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
                    scaleNotes={scaleNotes}
                    onChange={(color) => {
                        const nextState = { ...state, color };
                        playStatePreview(nextState);
                        setState(nextState);
                    }}
                />
            </div>

            <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-start gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">Octave</span>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="size-3.5 cursor-help text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Raises or lowers the pitch by octaves.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <OctaveSelector
                        value={state.octave}
                        onChange={(octave) => setState({ ...state, octave })}
                    />
                </div>
                <KeySelector
                    root={state.keyRoot}
                    scaleType={state.scaleType}
                    onRootChange={handleKeyRootChange}
                    onScaleTypeChange={handleScaleTypeChange}
                />
            </div>

            <div className="space-y-3 rounded-md border bg-muted/20 p-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Preset</span>
                    <span className="capitalize">{state.preset}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Note</span>
                    <span>
                        {getNoteFromColor(state.color)}
                        {state.octave}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Key</span>
                    <span>{state.keyRoot ? `${state.keyRoot} ${state.scaleType}` : "Chromatic"}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Size</span>
                    <span>{formatPercent(state.size)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Roundness</span>
                    <span>{formatPercent(state.roundness)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Grain</span>
                    <span>{formatPercent(state.grain)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Wobble</span>
                    <span>{formatPercent(state.wobble)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Wobble Speed</span>
                    <span>{formatPercent(state.wobbleSpeed)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Wobble Randomness</span>
                    <span>{formatPercent(state.wobbleRandomness)}</span>
                </div>
            </div>

            <div className="space-y-2 rounded-md border bg-muted/20 p-3 text-sm">
                <p className="font-medium">Envelope</p>
                <div className="flex items-center justify-between gap-4">
                    <span>Attack</span>
                    <span>{formatPercent(state.attack)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span>Hold</span>
                    <span>{formatPercent(state.hold)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span>Decay</span>
                    <span>{formatPercent(state.decay)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <span>Sustain</span>
                    <span>{formatPercent(state.sustain)}</span>
                </div>
            </div>
        </div>
    );

    const actionButtons = (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {isRootPage && isAuthenticated ? (
                <Button
                    type="button"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={handleCreateIdea}
                    disabled={isPersisting}
                >
                    {isPersisting ? "Saving..." : "Save Idea"}
                </Button>
            ) : null}
            {isEditIdeaPage ? (
                <Button
                    type="button"
                    size="sm"
                    className="rounded-full px-4"
                    onClick={handleUpdateIdea}
                    disabled={isPersisting}
                >
                    {isPersisting ? "Saving..." : "Save Changes"}
                </Button>
            ) : null}
            <ExportDialog state={state} />
        </div>
    );

    return (
        <Layout
            sidebarContent={isReadOnly ? readOnlySidebarContent : controlsSidebarContent}
            waveformColor={displayedColor}
            viewportTopLeftOverlay={
                isRootPage ? (
                    <TutorialDialog open={isTutorialOpen} onOpenChange={handleTutorialOpenChange} />
                ) : null
            }
            viewportLeftOverlay={modeToggleButton}
            viewportRightOverlay={actionButtons}
        >
            <ShapeCanvas
                state={{ ...state, color: displayedColor }}
                onStateChange={isReadOnly ? () => undefined : setState}
                mode={isReadOnly ? "view" : viewMode}
            />
        </Layout>
    );
}
