import { useEffect, useRef, useState } from "react";

// requestAnimationFrame loop that tracks elapsed time for wobble animation
export function useWobbleAnimation(speed: number): number {
    const [time, setTime] = useState(0);
    const rafRef = useRef<number>(0);
    const lastFrameRef = useRef<number>(0);

    useEffect(() => {
        if (speed === 0) {
            return;
        }

        const animate = (timestamp: number) => {
            if (lastFrameRef.current === 0) {
                lastFrameRef.current = timestamp;
            }

            const delta = timestamp - lastFrameRef.current;
            lastFrameRef.current = timestamp;

            // speed 50 = 1x, speed 100 = 2x, speed 0 = 0x
            const speedMultiplier = speed / 50;
            setTime((t) => t + (delta / 1000) * speedMultiplier);

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            lastFrameRef.current = 0;
        };
    }, [speed]);

    return time;
}
