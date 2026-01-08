import { Stage, Layer } from "react-konva";
import { useEffect, useState } from "react";
import MorphableShape from "./MorphableShape";
import type { ShapeState } from "@/types/shape";

export default function ShapeCanvas({
    state,
    onStateChange,
}: {
    state: ShapeState;
    onStateChange: (state: ShapeState) => void;
}) {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth - 320, // account for sidebar
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

    return (
        <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
                <MorphableShape state={state} onStateChange={onStateChange} />
            </Layer>
        </Stage>
    );
}
