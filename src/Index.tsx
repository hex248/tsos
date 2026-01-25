import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import ColorKeyboard from "@/components/controls/ColorKeyboard";
import OctaveSelector from "@/components/controls/OctaveSelector";
import PresetSelector from "@/components/controls/PresetSelector";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { colorScale, noteToFrequency } from "@/constants/colorScale";
import { useAudioContext } from "@/hooks/useAudioContext";
import { useShapeState } from "@/hooks/useShapeState";
import { useSynth } from "@/hooks/useSynth";
import { useWobbleAnimation } from "@/hooks/useWobbleAnimation";
import {
    mapGrainToNoise,
    mapPresetToOscType,
    mapRoundnessToFade,
    mapSizeToGain,
    mapWobbleToDetune,
} from "@/lib/audio/mapping";
import { playPreviewSample } from "@/lib/audio/synth";
import { useEffect, useState } from "react";
import * as Tone from "tone";
import Layout from "./Layout";
import { cn } from "./lib/utils";

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
    const { isMuted, toggleMute } = useAudioContext();
    const synthRef = useSynth();
    const pitchTime = useWobbleAnimation(state.wobbleSpeed);

    useEffect(() => {
        if (!synthRef.current) return;

        const nodes = synthRef.current;
        nodes.oscillatorA.type = mapPresetToOscType(state.preset);
        nodes.crossFade.fade.value = mapRoundnessToFade(state.roundness);
        nodes.gain.gain.value = Tone.dbToGain(mapSizeToGain(state.size));
        const detuneDepth = mapWobbleToDetune(state.wobble);
        const detune = Math.sin(pitchTime * Math.PI * 2) * detuneDepth;
        nodes.oscillatorA.detune.value = detune;
        nodes.oscillatorB.detune.value = detune;

        const note =
            colorScale.find((entry) => entry.color.toLowerCase() === state.color.toLowerCase())?.note ??
            colorScale[0].note;
        const frequency = noteToFrequency(note, state.octave);
        nodes.oscillatorA.frequency.value = frequency;
        nodes.oscillatorB.frequency.value = frequency;

        const grain = mapGrainToNoise(state.grain);
        const noiseDb = grain === 0 ? Number.NEGATIVE_INFINITY : -40 + (-12 - -40) * grain;
        nodes.noise.volume.value = noiseDb;
    }, [
        state.preset,
        state.roundness,
        state.size,
        state.wobble,
        state.grain,
        state.color,
        state.octave,
        synthRef,
        pitchTime,
    ]);

    const sidebarContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Audio</span>
                <Toggle pressed={!isMuted} onPressedChange={toggleMute} variant="outline">
                    {isMuted ? "Unmute" : "Mute"}
                </Toggle>
            </div>
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
                            synthNodes: synthRef.current,
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
        <Layout sidebarContent={sidebarContent}>
            <ShapeCanvas state={state} onStateChange={setState} />
        </Layout>
    );
}

export default Index;
