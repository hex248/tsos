import type { ShapeState } from "@/types/shape";
import type { ViewMode } from "@/types/viewMode";
import { useEffect, useMemo, useRef, useState } from "react";

type ControlKind = "size" | "roundness" | "wobble";

interface DragState {
    control: ControlKind;
    startX: number;
    startY: number;
    startValue: number;
    pointerId: number;
}

interface DragFeedback {
    value: number;
    delta: number;
}

const CONTROL_META: Record<ControlKind, { label: string; hint: string }> = {
    size: {
        label: "Size",
        hint: "Drag up/right to increase",
    },
    roundness: {
        label: "Roundness",
        hint: "Drag down/left to increase",
    },
    wobble: {
        label: "Wobble",
        hint: "Drag down/left to increase",
    },
};

function clampRange(value: number) {
    return Math.max(0, Math.min(100, value));
}

function getControlValue(state: ShapeState, control: ControlKind): number {
    switch (control) {
        case "size":
            return state.size;
        case "roundness":
            return state.roundness;
        case "wobble":
            return state.wobble;
    }
}

function setControlValue(state: ShapeState, control: ControlKind, value: number): ShapeState {
    const next = clampRange(value);
    switch (control) {
        case "size":
            return { ...state, size: next };
        case "roundness":
            return { ...state, roundness: next };
        case "wobble":
            return { ...state, wobble: next };
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
    const [hoveredControl, setHoveredControl] = useState<ControlKind | null>(null);
    const [focusedControl, setFocusedControl] = useState<ControlKind | null>(null);
    const [activeControl, setActiveControl] = useState<ControlKind | null>(null);
    const [dragFeedback, setDragFeedback] = useState<DragFeedback | null>(null);

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
            const direction = drag.control === "size" ? 1 : -1;
            const nextValue = drag.startValue + delta * sensitivity * direction;
            const current = stateRef.current;
            const nextState = setControlValue(current, drag.control, nextValue);
            const clampedValue = getControlValue(nextState, drag.control);

            setDragFeedback({
                value: clampedValue,
                delta,
            });

            if (getControlValue(current, drag.control) !== getControlValue(nextState, drag.control)) {
                onStateChange(nextState);
            }
        };

        const handlePointerUp = () => {
            dragStateRef.current = null;
            setActiveControl(null);
            setDragFeedback(null);
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
                disabled: false,
            },
            {
                control: "wobble" as const,
                x: shapeX - handleDistance,
                y: shapeY,
                color: "#D8B4FE",
                disabled: false,
            },
        ],
        [shapeX, shapeY, handleDistance],
    );

    if (mode !== "edit") {
        return null;
    }

    return (
        <fieldset className="pointer-events-none absolute inset-0 z-20 m-0 border-0 p-0">
            <legend className="sr-only">Shape control points</legend>
            {controls.map((control) => (
                <div
                    key={control.control}
                    className="pointer-events-none absolute"
                    style={{
                        left: `${control.x}px`,
                        top: `${control.y}px`,
                        transform: "translate(-50%, -50%)",
                        zIndex:
                            hoveredControl === control.control ||
                            focusedControl === control.control ||
                            activeControl === control.control
                                ? 30
                                : 10,
                    }}
                >
                    <button
                        type="button"
                        className="pointer-events-auto absolute left-1/2 top-1/2 z-20 inline-flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
                        style={{
                            backgroundColor: control.color,
                            opacity: control.disabled ? 0.4 : 1,
                            cursor: control.disabled
                                ? "not-allowed"
                                : activeControl === control.control
                                  ? "grabbing"
                                  : "grab",
                        }}
                        disabled={control.disabled}
                        aria-disabled={control.disabled}
                        aria-label={`${CONTROL_META[control.control].label} control, ${Math.round(getControlValue(state, control.control))}%`}
                        onPointerEnter={() => setHoveredControl(control.control)}
                        onPointerLeave={() =>
                            setHoveredControl((current) => (current === control.control ? null : current))
                        }
                        onFocus={() => setFocusedControl(control.control)}
                        onBlur={() =>
                            setFocusedControl((current) => (current === control.control ? null : current))
                        }
                        onKeyDown={(event) => {
                            if (control.disabled) {
                                return;
                            }

                            const step = event.shiftKey ? 10 : 2;
                            let delta = 0;
                            if (event.key === "ArrowUp" || event.key === "ArrowRight") {
                                delta = control.control === "size" ? step : -step;
                            } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
                                delta = control.control === "size" ? -step : step;
                            }

                            if (delta === 0) {
                                return;
                            }

                            event.preventDefault();
                            const current = stateRef.current;
                            const next = setControlValue(
                                current,
                                control.control,
                                getControlValue(current, control.control) + delta,
                            );
                            onStateChange(next);
                        }}
                        onPointerDown={(event) => {
                            if (control.disabled) {
                                return;
                            }

                            event.preventDefault();
                            event.stopPropagation();
                            event.currentTarget.setPointerCapture(event.pointerId);

                            const startValue = getControlValue(stateRef.current, control.control);
                            dragStateRef.current = {
                                control: control.control,
                                startX: event.clientX,
                                startY: event.clientY,
                                startValue,
                                pointerId: event.pointerId,
                            };
                            setActiveControl(control.control);
                            setDragFeedback({ value: startValue, delta: 0 });
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
                            setActiveControl(null);
                            setDragFeedback(null);
                        }}
                    >
                        <span className="text-xs font-semibold leading-none text-black/75">
                            {control.control === "size" ? "S" : control.control === "roundness" ? "R" : "W"}
                        </span>
                    </button>

                    {hoveredControl === control.control ||
                    focusedControl === control.control ||
                    activeControl === control.control ? (
                        <div className="pointer-events-none absolute z-30 -top-18 left-1/2 -translate-x-1/2 rounded-md border border-border/70 bg-background/95 px-2 py-1 text-[11px] leading-tight text-foreground shadow-sm whitespace-nowrap">
                            <div className="font-medium">{CONTROL_META[control.control].label}</div>
                            <>
                                <div>
                                    {Math.round(
                                        activeControl === control.control && dragFeedback
                                            ? dragFeedback.value
                                            : getControlValue(state, control.control),
                                    )}
                                    %
                                </div>
                                <div className="text-muted-foreground">
                                    {CONTROL_META[control.control].hint}
                                </div>
                            </>
                        </div>
                    ) : null}
                </div>
            ))}

            <div className="sr-only" aria-live="polite">
                {activeControl && dragFeedback
                    ? `${CONTROL_META[activeControl].label} ${Math.round(dragFeedback.value)} percent`
                    : ""}
            </div>
        </fieldset>
    );
}
