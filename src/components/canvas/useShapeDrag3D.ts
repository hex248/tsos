import { screenToWorld, worldToScreen } from "@/lib/canvas/coordinates";
import type { ShapeState } from "@/types/shape";
import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Plane, Vector3 } from "three";

interface UseShapeDrag3DProps {
    width: number;
    height: number;
    state: ShapeState;
    onStateChange: (state: ShapeState) => void;
}

export function useShapeDrag3D({ width, height, state, onStateChange }: UseShapeDrag3DProps) {
    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef(new Vector3(0, 0, 0));
    const dragPlane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);
    const stateRef = useRef(state);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        const pointerTarget = event.nativeEvent.target;
        if (
            pointerTarget &&
            "setPointerCapture" in pointerTarget &&
            typeof pointerTarget.setPointerCapture === "function"
        ) {
            pointerTarget.setPointerCapture(event.pointerId);
        }

        const intersection = new Vector3();
        if (!event.ray.intersectPlane(dragPlane, intersection)) {
            return;
        }

        const world = screenToWorld(stateRef.current.x, stateRef.current.y, width, height);
        dragOffsetRef.current.set(world.x - intersection.x, world.y - intersection.y, 0);
        isDraggingRef.current = true;
    };

    const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
        if (!isDraggingRef.current) {
            return;
        }

        event.stopPropagation();

        const intersection = new Vector3();
        if (!event.ray.intersectPlane(dragPlane, intersection)) {
            return;
        }

        const nextX = intersection.x + dragOffsetRef.current.x;
        const nextY = intersection.y + dragOffsetRef.current.y;
        const nextScreen = worldToScreen(nextX, nextY, width, height);
        const currentState = stateRef.current;

        onStateChange({
            ...currentState,
            x: nextScreen.x,
            y: nextScreen.y,
        });
    };

    const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation();
        const pointerTarget = event.nativeEvent.target;
        if (
            pointerTarget &&
            "releasePointerCapture" in pointerTarget &&
            typeof pointerTarget.releasePointerCapture === "function"
        ) {
            pointerTarget.releasePointerCapture(event.pointerId);
        }
        isDraggingRef.current = false;
    };

    const handlePointerCancel = () => {
        isDraggingRef.current = false;
    };

    return {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handlePointerCancel,
    };
}
