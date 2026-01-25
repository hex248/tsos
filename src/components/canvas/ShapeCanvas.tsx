import type { ShapeState } from "@/types/shape";
import { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import MorphableShape from "./MorphableShape";

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
