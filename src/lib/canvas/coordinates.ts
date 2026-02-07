export interface WorldPoint {
    x: number;
    y: number;
}

export function screenToWorld(x: number, y: number, width: number, height: number): WorldPoint {
    return {
        x: x - width / 2,
        y: height / 2 - y,
    };
}

export function worldToScreen(x: number, y: number, width: number, height: number): WorldPoint {
    return {
        x: x + width / 2,
        y: height / 2 - y,
    };
}
