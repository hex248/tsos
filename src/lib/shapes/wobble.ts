import { noise2D } from "@/lib/noise";
import type { Point } from "./points";

// apply noise-based displacement to points. this gives a wobble effect. points are displaced radially
export function applyWobble(
    points: Point[],
    time: number,
    amount: number,
    randomness: number,
    noiseScale = 0.5,
): Point[] {
    if (amount === 0) return points;

    return points.map((point, i) => {
        const noiseX = i * noiseScale;
        const noiseY = time;
        const noiseValue = noise2D(noiseX, noiseY);
        const sineValue = Math.sin(time * 2 + i * noiseScale);
        const blended = sineValue * (1 - randomness) + noiseValue * randomness;
        const displacement = blended * amount;

        const angle = Math.atan2(point.y, point.x);

        return {
            x: point.x + Math.cos(angle) * displacement,
            y: point.y + Math.sin(angle) * displacement,
        };
    });
}
