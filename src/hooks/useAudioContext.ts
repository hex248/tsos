import { useCallback, useEffect, useState } from "react";
import { getDestination, start } from "tone";

export function useAudioContext() {
    const [isMuted, setIsMuted] = useState(true);
    const destination = getDestination();

    useEffect(() => {
        destination.mute = true;

        return () => {
            destination.mute = true;
        };
    }, [destination]);

    const toggleMute = useCallback(async () => {
        if (isMuted) {
            await start();
            destination.mute = false;
            setIsMuted(false);
            return;
        }

        destination.mute = true;
        setIsMuted(true);
    }, [destination, isMuted]);

    return {
        isMuted,
        toggleMute,
    };
}
