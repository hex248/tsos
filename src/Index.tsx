import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import PresetSelector from "@/components/controls/PresetSelector";
import { Slider } from "@/components/ui/slider";
import { useShapeState } from "@/hooks/useShapeState";
import { useEffect, useState } from "react";
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

    const sidebarContent = (
        <div className="flex flex-col gap-4">
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
        </div>
    );

    return (
        <Layout sidebarContent={sidebarContent}>
            <ShapeCanvas state={state} onStateChange={setState} />
        </Layout>
    );
}

export default Index;
