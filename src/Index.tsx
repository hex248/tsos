import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import PresetSelector from "@/components/controls/PresetSelector";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { useAudioContext } from "@/hooks/useAudioContext";
import { useShapeState } from "@/hooks/useShapeState";
import { useSynth } from "@/hooks/useSynth";
import { mapGrainToNoise, mapPresetToOscType, mapRoundnessToFade, mapSizeToGain } from "@/lib/audio/mapping";
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

    useEffect(() => {
        if (!synthRef.current) return;

        const nodes = synthRef.current;
        nodes.oscillatorA.type = mapPresetToOscType(state.preset);
        nodes.crossFade.fade.value = mapRoundnessToFade(state.roundness);
        nodes.gain.gain.value = Tone.dbToGain(mapSizeToGain(state.size));

        const grain = mapGrainToNoise(state.grain);
        const noiseDb = grain === 0 ? Number.NEGATIVE_INFINITY : -40 + (-12 - -40) * grain;
        nodes.noise.volume.value = noiseDb;
    }, [state.preset, state.roundness, state.size, state.grain, synthRef]);

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
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Noise</span>
                <Slider
                    value={[state.grain]}
                    min={0}
                    max={100}
                    onValueChange={([v]) => setState({ ...state, grain: v })}
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
