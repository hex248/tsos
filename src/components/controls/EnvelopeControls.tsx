import { Slider } from "@/components/ui/slider";

type EnvelopeValues = {
    attack: number;
    hold: number;
    decay: number;
    sustain: number;
};

export default function EnvelopeControls({
    values,
    onChange,
    onCommit,
}: {
    values: EnvelopeValues;
    onChange: (next: EnvelopeValues) => void;
    onCommit: (next: EnvelopeValues) => void;
}) {
    const width = 320;
    const height = 120;
    const padding = 8;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    const attackTime = Math.max(0.01, values.attack / 100);
    const holdTime = values.hold / 100;
    const decayTime = Math.max(0.01, values.decay / 100);
    const tailTime = 0.25;
    const totalTime = attackTime + holdTime + decayTime + tailTime;

    const x0 = padding;
    const x1 = x0 + (attackTime / totalTime) * plotWidth;
    const x2 = x1 + (holdTime / totalTime) * plotWidth;
    const x3 = x2 + (decayTime / totalTime) * plotWidth;
    const x4 = width - padding;

    const baselineY = height - padding;
    const peakY = padding;
    const sustainY = baselineY - (values.sustain / 100) * plotHeight;

    const points = `${x0},${baselineY} ${x1},${peakY} ${x2},${peakY} ${x3},${sustainY} ${x4},${sustainY}`;

    return (
        <div className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-md border bg-muted/20 p-2">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" aria-hidden="true">
                    <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2.5} />
                </svg>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Start</span>
                    <Slider
                        value={[values.attack]}
                        min={0}
                        max={100}
                        onValueChange={([attack]) => onChange({ ...values, attack })}
                        onValueCommit={([attack]) => onCommit({ ...values, attack })}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Peak</span>
                    <Slider
                        value={[values.hold]}
                        min={0}
                        max={100}
                        onValueChange={([hold]) => onChange({ ...values, hold })}
                        onValueCommit={([hold]) => onCommit({ ...values, hold })}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Fade</span>
                    <Slider
                        value={[values.decay]}
                        min={0}
                        max={100}
                        onValueChange={([decay]) => onChange({ ...values, decay })}
                        onValueCommit={([decay]) => onCommit({ ...values, decay })}
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">Body</span>
                    <Slider
                        value={[values.sustain]}
                        min={0}
                        max={100}
                        onValueChange={([sustain]) => onChange({ ...values, sustain })}
                        onValueCommit={([sustain]) => onCommit({ ...values, sustain })}
                    />
                </div>
            </div>
        </div>
    );
}
