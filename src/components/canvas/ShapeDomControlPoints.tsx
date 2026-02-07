import type { ShapeState } from "@/types/shape";
import type { ViewMode } from "@/types/viewMode";
import { useEffect, useMemo, useRef } from "react";

type ControlKind = "size" | "roundness";

interface DragState {
    control: ControlKind;
    startX: number;
    startY: number;
    startValue: number;
    pointerId: number;
}

function clampRange(value: number) {
    return Math.max(0, Math.min(100, value));
}

function getControlValue(state: ShapeState, control: ControlKind): number {
    switch (control) {
        case "size":
            return state.size;
        case "roundness":
            return state.roundness;
    }
}

function setControlValue(state: ShapeState, control: ControlKind, value: number): ShapeState {
    const next = clampRange(value);
    switch (control) {
        case "size":
            return { ...state, size: next };
        case "roundness":
            return { ...state, roundness: next };
    }
}

export default function ShapeDomControlPoints({
    mode,
    state,
    onStateChange,
    shapeX,
    shapeY,
}: {
    mode: ViewMode;
    state: ShapeState;
    onStateChange: (state: ShapeState) => void;
    shapeX: number;
    shapeY: number;
}) {
    const stateRef = useRef(state);
    const dragStateRef = useRef<DragState | null>(null);

    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            const drag = dragStateRef.current;
            if (!drag) {
                return;
            }

            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;
            const delta = dx - dy;
            const sensitivity = drag.control === "size" ? 0.16 : 0.2;
            const nextValue = drag.startValue + delta * sensitivity;
            const current = stateRef.current;
            const nextState = setControlValue(current, drag.control, nextValue);

            if (getControlValue(current, drag.control) !== getControlValue(nextState, drag.control)) {
                onStateChange(nextState);
            }
        };

        const handlePointerUp = () => {
            dragStateRef.current = null;
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
        window.addEventListener("pointercancel", handlePointerUp);
        window.addEventListener("blur", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
            window.removeEventListener("blur", handlePointerUp);
        };
    }, [onStateChange]);

    const radius = 20 + (state.size / 100) * 180;
    const handleDistance = radius + Math.max(radius * 0.08, 12) * 2.4;

    const controls = useMemo(
        () => [
            {
                control: "size" as const,
                x: shapeX + handleDistance,
                y: shapeY,
                color: "#6EE7B7",
                disabled: false,
            },
            {
                control: "roundness" as const,
                x: shapeX,
                y: shapeY - handleDistance,
                color: "#93C5FD",
                disabled: state.preset === "circle",
            },
        ],
        [shapeX, shapeY, handleDistance, state.preset],
    );

    if (mode !== "edit") {
        return null;
    }

    return (
        <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            {controls.map((control) => (
                <button
                    key={control.control}
                    type="button"
                    className="pointer-events-auto absolute size-5 rounded-full border border-white/60 shadow-sm"
                    style={{
                        left: `${control.x}px`,
                        top: `${control.y}px`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: control.color,
                        opacity: control.disabled ? 0.4 : 1,
                        cursor: control.disabled ? "not-allowed" : "grab",
                    }}
                    disabled={control.disabled}
                    onPointerDown={(event) => {
                        if (control.disabled) {
                            return;
                        }

                        event.preventDefault();
                        event.stopPropagation();
                        event.currentTarget.setPointerCapture(event.pointerId);
                        dragStateRef.current = {
                            control: control.control,
                            startX: event.clientX,
                            startY: event.clientY,
                            startValue: getControlValue(stateRef.current, control.control),
                            pointerId: event.pointerId,
                        };
                    }}
                    onPointerUp={(event) => {
                        const drag = dragStateRef.current;
                        if (!drag) {
                            return;
                        }

                        if (event.currentTarget.hasPointerCapture(drag.pointerId)) {
                            event.currentTarget.releasePointerCapture(drag.pointerId);
                        }
                        dragStateRef.current = null;
                    }}
                />
            ))}
        </div>
    );
}
