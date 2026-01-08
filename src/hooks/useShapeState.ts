import { useState, useEffect, useRef } from "react";
import type { ShapeState } from "@/types/shape";

const DEFAULT_STATE: ShapeState = {
    x: 0,
    y: 0,
    preset: "circle",
    roundness: 100, // full circle
    size: 50, // medium
    wobble: 20, // subtle
    wobbleSpeed: 50, // medium
    grain: 0, // none
    color: "#FF0000", // red (C)
    octave: 4, // middle octave
};

export function useShapeState(centerX: number, centerY: number) {
    const [state, setState] = useState<ShapeState>({
        ...DEFAULT_STATE,
        x: centerX,
        y: centerY,
    });

    const initialStateRef = useRef<ShapeState>({
        ...DEFAULT_STATE,
        x: centerX,
        y: centerY,
    });

    // update center position when canvas resizes
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            x: centerX,
            y: centerY,
        }));
    }, [centerX, centerY]);

    // beforeunload warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasChanged = JSON.stringify(state) !== JSON.stringify(initialStateRef.current);
            if (hasChanged) {
                e.preventDefault();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [state]);

    return [state, setState] as const;
}
