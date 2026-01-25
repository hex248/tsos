export interface Point {
    x: number;
    y: number;
}

const DEFAULT_NUM_POINTS = 64;

export function generateCirclePoints(
    cx: number,
    cy: number,
    radius: number,
    numPoints: number = DEFAULT_NUM_POINTS,
): Point[] {
    const points: Point[] = [];
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
        });
    }
    return points;
}

// points distributed along the three edges with higher density near corners for rounding
export function generateTrianglePoints(
    cx: number,
    cy: number,
    radius: number,
    numPoints: number = DEFAULT_NUM_POINTS,
): Point[] {
    const vertices = [
        { x: cx, y: cy - radius }, // top
        { x: cx + radius * Math.cos(Math.PI / 6), y: cy + radius * Math.sin(Math.PI / 6) }, // bottom right
        { x: cx - radius * Math.cos(Math.PI / 6), y: cy + radius * Math.sin(Math.PI / 6) }, // bottom left
    ];

    return distributePointsAlongPolygon(vertices, numPoints);
}

// points distributed along the four edges with higher density near corners for rounding
export function generateSquarePoints(
    cx: number,
    cy: number,
    radius: number,
    numPoints: number = DEFAULT_NUM_POINTS,
): Point[] {
    // rotate 45 degrees so a flat edge is at bottom
    const angle = -Math.PI / 4;
    const vertices = [
        { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }, // right
        { x: cx + radius * Math.cos(angle + Math.PI / 2), y: cy + radius * Math.sin(angle + Math.PI / 2) }, // bottom
        { x: cx + radius * Math.cos(angle + Math.PI), y: cy + radius * Math.sin(angle + Math.PI) }, // left
        {
            x: cx + radius * Math.cos(angle + (3 * Math.PI) / 2),
            y: cy + radius * Math.sin(angle + (3 * Math.PI) / 2),
        }, // top
    ];

    return distributePointsAlongPolygon(vertices, numPoints);
}

// points distributed along X edges
function distributePointsAlongPolygon(vertices: Point[], numPoints: number): Point[] {
    const points: Point[] = [];
    const numEdges = vertices.length;
    const pointsPerEdge = Math.floor(numPoints / numEdges);
    const remainder = numPoints % numEdges;

    for (let i = 0; i < numEdges; i++) {
        const start = vertices[i];
        const end = vertices[(i + 1) % numEdges];
        // distribute remainder points to first edges
        const edgePoints = pointsPerEdge + (i < remainder ? 1 : 0);

        for (let j = 0; j < edgePoints; j++) {
            const t = j / edgePoints;
            points.push({
                x: start.x + (end.x - start.x) * t,
                y: start.y + (end.y - start.y) * t,
            });
        }
    }

    return points;
}
