import type { SynthNodes } from "@/lib/audio/synth";
import { createSynth, disposeSynth } from "@/lib/audio/synth";
import { useEffect, useRef } from "react";

export function useSynth() {
    const synthRef = useRef<SynthNodes | null>(null);

    useEffect(() => {
        synthRef.current = createSynth();

        return () => {
            if (synthRef.current) {
                disposeSynth(synthRef.current);
                synthRef.current = null;
            }
        };
    }, []);

    return synthRef;
}
