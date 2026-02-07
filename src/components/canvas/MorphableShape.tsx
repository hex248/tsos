import { useWobbleAnimation } from "@/hooks/useWobbleAnimation";
import { screenToWorld } from "@/lib/canvas/coordinates";
import { createShapeGeometry } from "@/lib/shapes/extrude";
import { morphPoints } from "@/lib/shapes/morph";
import { generateCirclePoints, generateSquarePoints, generateTrianglePoints } from "@/lib/shapes/points";
import { applyWobble } from "@/lib/shapes/wobble";
import type { ShapeState } from "@/types/shape";
import { useEffect, useMemo } from "react";
import { useShapeDrag3D } from "./useShapeDrag3D";

const NUM_POINTS = 512;

export default function MorphableShape({
    state,
    onStateChange,
    width,
    height,
}: {
    state: ShapeState;
    onStateChange: (state: ShapeState) => void;
    width: number;
    height: number;
}) {
    const time = useWobbleAnimation(state.wobbleSpeed);

    // Map size (0-100) to radius (20-200)
    const radius = 20 + (state.size / 100) * 180;

    const morphedPoints = useMemo(() => {
        const presetPoints = (() => {
            switch (state.preset) {
                case "triangle":
                    return generateTrianglePoints(0, 0, radius, NUM_POINTS);
                case "square":
                    return generateSquarePoints(0, 0, radius, NUM_POINTS);
                case "circle":
                    return generateCirclePoints(0, 0, radius, NUM_POINTS);
            }
        })();

        const circlePoints = generateCirclePoints(0, 0, radius, NUM_POINTS);
        const t = state.roundness / 100;
        return morphPoints(presetPoints, circlePoints, t);
    }, [state.preset, state.roundness, radius]);

    const wobbledPoints = useMemo(() => {
        const wobbleAmount = state.wobble * 0.3; // scale wobble to reasonable range
        const randomness = state.wobbleRandomness / 100;
        return applyWobble(morphedPoints, time, wobbleAmount, randomness);
    }, [morphedPoints, time, state.wobble, state.wobbleRandomness]);

    const depth = Math.max(radius * 1.5, 60);

    const geometry = useMemo(
        () =>
            createShapeGeometry({
                preset: state.preset,
                points: wobbledPoints,
                depth,
                roundness: state.roundness,
                time,
                wobble: state.wobble,
                randomness: state.wobbleRandomness / 100,
            }),
        [state.preset, state.roundness, wobbledPoints, depth, time, state.wobble, state.wobbleRandomness],
    );

    useEffect(() => {
        return () => geometry.dispose();
    }, [geometry]);

    const dragHandlers = useShapeDrag3D({
        width,
        height,
        state,
        onStateChange,
    });

    const world = screenToWorld(state.x, state.y, width, height);

    return (
        <mesh
            geometry={geometry}
            position={[world.x, world.y, 0]}
            rotation={[0.62, -0.52, 0.14]}
            castShadow
            receiveShadow
            onPointerDown={dragHandlers.handlePointerDown}
            onPointerMove={dragHandlers.handlePointerMove}
            onPointerUp={dragHandlers.handlePointerUp}
            onPointerCancel={dragHandlers.handlePointerCancel}
        >
            <meshPhysicalMaterial
                color={state.color}
                roughness={0.9}
                metalness={0.03}
                clearcoat={0.14}
                clearcoatRoughness={0.68}
            />
        </mesh>
    );
}
