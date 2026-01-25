import { Button } from "@/components/ui/button";

const MIN_OCTAVE = 1;
const MAX_OCTAVE = 8;

export default function OctaveSelector({
    value,
    onChange,
}: {
    value: number;
    onChange: (octave: number) => void;
}) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onChange(Math.max(MIN_OCTAVE, value - 1))}>
                -
            </Button>
            <span className="text-sm font-medium tabular-nums">{value}</span>
            <Button variant="ghost" size="sm" onClick={() => onChange(Math.min(MAX_OCTAVE, value + 1))}>
                +
            </Button>
        </div>
    );
}
