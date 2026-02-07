import { useWobbleAnimation } from "@/hooks/useWobbleAnimation";
import { screenToWorld } from "@/lib/canvas/coordinates";
import { createShapeGeometry } from "@/lib/shapes/extrude";
import { morphPoints } from "@/lib/shapes/morph";
import { generateCirclePoints, generateSquarePoints, generateTrianglePoints } from "@/lib/shapes/points";
import { applyWobble } from "@/lib/shapes/wobble";
import type { ShapeState } from "@/types/shape";
import { useEffect, useMemo } from "react";

const NUM_POINTS = 512;
const SHAPE_ROTATION: [number, number, number] = [0.62, -0.52, 0.14];

export default function MorphableShape({
    state,
    shapeX,
    shapeY,
    canvasWidth,
    canvasHeight,
}: {
    state: ShapeState;
    shapeX: number;
    shapeY: number;
    canvasWidth: number;
    canvasHeight: number;
}) {
    const time = useWobbleAnimation(state.wobbleSpeed);

    // Map size (0-100) to radius (20-200)
    const radius = 20 + (state.size / 100) * 180;

    const morphedPoints = useMemo(() => {
        const presetPoints =
            state.preset === "triangle"
                ? generateTrianglePoints(0, 0, radius, NUM_POINTS)
                : generateSquarePoints(0, 0, radius, NUM_POINTS);

        const circlePoints = generateCirclePoints(0, 0, radius, NUM_POINTS);
        const t = state.roundness / 100;
        return morphPoints(presetPoints, circlePoints, t);
    }, [state.preset, state.roundness, radius]);

    const wobbledPoints = useMemo(() => {
        const wobbleAmount = state.wobble * 0.3;
        const randomness = state.wobbleRandomness / 100;
        return applyWobble(morphedPoints, time, wobbleAmount, randomness);
    }, [morphedPoints, time, state.wobble, state.wobbleRandomness]);

    const depth = useMemo(() => {
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;

        for (const point of morphedPoints) {
            if (point.x < minX) {
                minX = point.x;
            }
            if (point.x > maxX) {
                maxX = point.x;
            }
            if (point.y < minY) {
                minY = point.y;
            }
            if (point.y > maxY) {
                maxY = point.y;
            }
        }

        const width = maxX - minX;
        const height = maxY - minY;
        return Math.max((width + height) / 2, 1);
    }, [morphedPoints]);

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

    const world = screenToWorld(shapeX, shapeY, canvasWidth, canvasHeight);

    return (
        <group position={[world.x, world.y, 0]} rotation={SHAPE_ROTATION}>
            <mesh geometry={geometry} castShadow receiveShadow>
                <meshPhysicalMaterial
                    color={state.color}
                    roughness={0.9}
                    metalness={0.03}
                    clearcoat={0.14}
                    clearcoatRoughness={0.68}
                />
            </mesh>
        </group>
    );
}
