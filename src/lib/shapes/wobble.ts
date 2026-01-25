import { noise2D } from "@/lib/noise";
import type { Point } from "./points";

// apply noise-based displacement to points. this gives a wobble effect. points are displaced radially
export function applyWobble(points: Point[], time: number, amount: number, noiseScale = 0.5): Point[] {
    if (amount === 0) return points;

    return points.map((point, i) => {
        // use point index and time for noise input
        const noiseX = i * noiseScale;
        const noiseY = time;
        const displacement = noise2D(noiseX, noiseY) * amount;

        const angle = Math.atan2(point.y, point.x);

        return {
            x: point.x + Math.cos(angle) * displacement,
            y: point.y + Math.sin(angle) * displacement,
        };
    });
}
