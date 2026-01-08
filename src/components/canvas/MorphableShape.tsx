import { Circle } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { ShapeState } from "@/types/shape";

export default function MorphableShape({
    state,
    onStateChange,
}: {
    state: ShapeState;
    onStateChange: (state: ShapeState) => void;
}) {
    const handleDrag = (e: KonvaEventObject<DragEvent>) => {
        onStateChange({
            ...state,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    return (
        <Circle x={state.x} y={state.y} radius={100} fill={state.color} draggable onDragMove={handleDrag} />
    );
}
