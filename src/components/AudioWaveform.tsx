import { useEffect, useRef } from "react";
import * as Tone from "tone";

export default function AudioWaveform({ color }: { color?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyzerRef = useRef<Tone.Waveform | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        // create analyzer and connect to destination
        const analyzer = new Tone.Waveform(512);
        Tone.getDestination().connect(analyzer);
        analyzerRef.current = analyzer;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        // Animation loop
        const draw = () => {
            if (!canvas || !ctx || !analyzerRef.current) return;

            const values = analyzerRef.current.getValue();
            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;

            ctx.clearRect(0, 0, width, height);

            let strokeColor = color || "#caa3ff";
            if (!color) {
                const computedStyle = getComputedStyle(canvas);
                const primaryColor = computedStyle.getPropertyValue("--primary") || "210 100% 50%";
                
                // Convert HSL to RGB for canvas
                const hslMatch = primaryColor.match(/(\d+)\s+(\d+)%\s+(\d+)%/);
                
                if (hslMatch) {
                    const h = Number.parseInt(hslMatch[1]);
                    const s = Number.parseInt(hslMatch[2]) / 100;
                    const l = Number.parseInt(hslMatch[3]) / 100;
                    
                    // HSL to RGB conversion
                    const c = (1 - Math.abs(2 * l - 1)) * s;
                    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
                    const m = l - c / 2;
                    
                    let r = 0;
                    let g = 0;
                    let b = 0;
                    
                    if (h >= 0 && h < 60) {
                        r = c; g = x; b = 0;
                    } else if (h >= 60 && h < 120) {
                        r = x; g = c; b = 0;
                    } else if (h >= 120 && h < 180) {
                        r = 0; g = c; b = x;
                    } else if (h >= 180 && h < 240) {
                        r = 0; g = x; b = c;
                    } else if (h >= 240 && h < 300) {
                        r = x; g = 0; b = c;
                    } else {
                        r = c; g = 0; b = x;
                    }
                    
                    strokeColor = `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`;
                }
            }

            ctx.beginPath();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;

            const sliceWidth = width / values.length;
            let x = 0;

            for (let i = 0; i < values.length; i++) {
                const value = values[i] as number;
                // multiplied amplitude for more prominent visualisation
                const amplifiedValue = Math.max(-1, Math.min(1, value * 5));
                const y = ((amplifiedValue + 1) / 2) * height;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.stroke();

            animationFrameRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (analyzerRef.current) {
                analyzerRef.current.dispose();
            }
            window.removeEventListener("resize", updateCanvasSize);
        };
    }, [color]);

    return (
        <div className="w-full h-20 rounded-lg border bg-card/50 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ display: "block" }}
            />
        </div>
    );
}
