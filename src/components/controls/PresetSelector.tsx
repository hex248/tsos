import { Button } from "@/components/ui/button";
import type { Preset } from "@/types/shape";

const presets: { value: Preset; label: string }[] = [
    { value: "triangle", label: "Triangle" },
    { value: "square", label: "Square" },
    { value: "circle", label: "Circle" },
];

export default function PresetSelector({
    value,
    onChange,
}: {
    value: Preset;
    onChange: (preset: Preset) => void;
}) {
    return (
        <div className="flex gap-2">
            {presets.map((preset) => (
                <Button
                    key={preset.value}
                    variant={value === preset.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => onChange(preset.value)}
                >
                    {preset.label}
                </Button>
            ))}
        </div>
    );
}
