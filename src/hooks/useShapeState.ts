import type { IdeaSoundConfig, ShapeState } from "@/types/shape";
import { useEffect, useRef, useState } from "react";

export const DEFAULT_SOUND_CONFIG: IdeaSoundConfig = {
    preset: "square",
    roundness: 0,
    size: 50, // medium
    wobble: 0,
    wobbleSpeed: 50, // medium
    wobbleRandomness: 50, // medium
    grain: 0, // none
    attack: 0,
    hold: 5,
    decay: 0,
    sustain: 100,
    color: "#FF0000", // red (C)
    octave: 4, // middle octave
    keyRoot: null,
    scaleType: "major",
};

export function createEditorShapeState(
    centerX: number,
    centerY: number,
    initialConfig?: IdeaSoundConfig,
): ShapeState {
    return {
        x: centerX,
        y: centerY,
        ...DEFAULT_SOUND_CONFIG,
        ...initialConfig,
    };
}

export function useShapeState(centerX: number, centerY: number, initialConfig?: IdeaSoundConfig) {
    const [state, setState] = useState<ShapeState>({
        ...createEditorShapeState(centerX, centerY, initialConfig),
    });

    const initialStateRef = useRef<ShapeState>({
        ...createEditorShapeState(centerX, centerY, initialConfig),
    });
    void initialStateRef;

    // update center position when canvas resizes
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            x: centerX,
            y: centerY,
        }));
    }, [centerX, centerY]);

    // beforeunload warning
    // useEffect(() => {
    //     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    //         const hasChanged = JSON.stringify(state) !== JSON.stringify(initialStateRef.current);
    //         if (hasChanged) {
    //             e.preventDefault();
    //         }
    //     };

    //     window.addEventListener("beforeunload", handleBeforeUnload);
    //     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    // }, [state]);

    return [state, setState] as const;
}
