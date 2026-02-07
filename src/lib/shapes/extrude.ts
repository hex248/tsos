import { noise2D } from "@/lib/noise";
import type { Point } from "@/lib/shapes/points";
import type { Preset } from "@/types/shape";
import { type BufferGeometry, MathUtils, Vector3 } from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

const MIN_POINT_COUNT = 3;
const MAX_CONTOUR_POINTS = 192;
const LAYER_COUNT = 40;

interface ShapeGeometryOptions {
    preset: Preset;
    points: Point[];
    depth: number;
    roundness: number;
    time: number;
    wobble: number;
    randomness: number;
}

function sampleContour(points: Point[], targetCount: number): Point[] {
    if (points.length <= targetCount) {
        return points;
    }

    const step = points.length / targetCount;
    const sampled: Point[] = [];
    for (let i = 0; i < targetCount; i++) {
        sampled.push(points[Math.floor(i * step)]);
    }
    return sampled;
}

function getSphereScale(zT: number): number {
    return Math.sqrt(Math.max(0, 1 - zT * zT));
}

function getBaseScale(preset: Preset, zT: number): number {
    if (preset === "triangle") {
        const u = (zT + 1) / 2;
        return 1 - u;
    }

    return 1;
}

export function createShapeGeometry({
    preset,
    points,
    depth,
    roundness,
    time,
    wobble,
    randomness,
}: ShapeGeometryOptions): BufferGeometry {
    if (points.length < MIN_POINT_COUNT) {
        throw new Error(`Expected at least ${MIN_POINT_COUNT} points, got ${points.length}`);
    }

    const contour = sampleContour(points, MAX_CONTOUR_POINTS);
    const halfDepth = depth / 2;
    const s = MathUtils.clamp(roundness / 100, 0, 1);
    const randomnessT = MathUtils.clamp(randomness, 0, 1);
    const zWobbleAmount = wobble * 0.18;
    const hullPoints: Vector3[] = [];

    for (let layer = 0; layer <= LAYER_COUNT; layer++) {
        const zT = (layer / LAYER_COUNT) * 2 - 1;
        const z = zT * halfDepth;

        const baseScale = getBaseScale(preset, zT);
        const sphereScale = getSphereScale(zT);
        const layerScale = MathUtils.lerp(baseScale, sphereScale, s);

        if (layerScale <= 0.0001) {
            continue;
        }

        for (let i = 0; i < contour.length; i++) {
            const point = contour[i];
            const phase = time * 2.2 + i * 0.27 + layer * 0.39;
            const sineValue = Math.sin(phase);
            const noiseValue = noise2D(i * 0.15, layer * 0.12 + time * 0.9);
            const blend = MathUtils.lerp(sineValue, noiseValue, randomnessT);
            const zOffset = blend * zWobbleAmount * layerScale;

            hullPoints.push(new Vector3(point.x * layerScale, point.y * layerScale, z + zOffset));
        }
    }

    hullPoints.push(new Vector3(0, 0, halfDepth));
    hullPoints.push(new Vector3(0, 0, -halfDepth));

    const geometry = new ConvexGeometry(hullPoints);
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
}
