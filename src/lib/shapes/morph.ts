import type { Point } from "./points";

// lerps each point pair by factor t
export function morphPoints(fromPoints: Point[], toPoints: Point[], t: number): Point[] {
    if (fromPoints.length !== toPoints.length) {
        throw new Error(
            `Point arrays must have the same length. Got ${fromPoints.length} and ${toPoints.length}`,
        );
    }

    return fromPoints.map((from, i) => {
        const to = toPoints[i];
        return {
            x: from.x + (to.x - from.x) * t,
            y: from.y + (to.y - from.y) * t,
        };
    });
}
