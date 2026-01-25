import { morphPoints } from "@/lib/shapes/morph";
import { generateCirclePoints, generateSquarePoints, generateTrianglePoints } from "@/lib/shapes/points";
import type { ShapeState } from "@/types/shape";
import type { KonvaEventObject } from "konva/lib/Node";
import { useMemo } from "react";
import { Group, Line } from "react-konva";

const SHAPE_RADIUS = 100;
const NUM_POINTS = 64;

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

    const flatPoints = useMemo(() => {
        const presetPoints = (() => {
            switch (state.preset) {
                case "triangle":
                    return generateTrianglePoints(0, 0, SHAPE_RADIUS, NUM_POINTS);
                case "square":
                    return generateSquarePoints(0, 0, SHAPE_RADIUS, NUM_POINTS);
                case "circle":
                    return generateCirclePoints(0, 0, SHAPE_RADIUS, NUM_POINTS);
            }
        })();

        const circlePoints = generateCirclePoints(0, 0, SHAPE_RADIUS, NUM_POINTS);
        const t = state.roundness / 100;
        const morphed = morphPoints(presetPoints, circlePoints, t);

        // flatten to [x1, y1, x2, y2, ...]
        return morphed.flatMap((p) => [p.x, p.y]);
    }, [state.preset, state.roundness]);

    return (
        <Group x={state.x} y={state.y} draggable onDragMove={handleDrag}>
            <Line points={flatPoints} closed fill={state.color} />
        </Group>
    );
}
