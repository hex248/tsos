import type { ShapeState } from "@/types/shape";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { OrthographicCamera } from "three";
import MorphableShape from "./MorphableShape";
import ShapeSceneLighting from "./ShapeSceneLighting";

function getDimensions() {
    return {
        width: Math.max(window.innerWidth - 320, 1),
        height: Math.max(window.innerHeight, 1),
    };
}

function CameraSync({ width, height }: { width: number; height: number }) {
    const { camera } = useThree();

    useEffect(() => {
        if (!(camera instanceof OrthographicCamera)) {
            return;
        }

        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();
    }, [camera, width, height]);

    return null;
}

export default function ShapeCanvas({
    state,
    onStateChange,
}: {
    state: ShapeState;
    onStateChange: (state: ShapeState) => void;
}) {
    const [dimensions, setDimensions] = useState(getDimensions);

    useEffect(() => {
        const handleResize = () => {
            setDimensions(getDimensions());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className="relative"
            style={{ width: dimensions.width, height: dimensions.height, touchAction: "none" }}
            aria-label="3d morphable shape canvas"
        >
            <Canvas
                orthographic
                camera={{ position: [0, 0, 1000], zoom: 1, near: 0.1, far: 2500 }}
                dpr={[1, 2]}
                gl={{ antialias: true, powerPreference: "high-performance" }}
            >
                <CameraSync width={dimensions.width} height={dimensions.height} />
                <ShapeSceneLighting />
                <MorphableShape
                    state={state}
                    onStateChange={onStateChange}
                    width={dimensions.width}
                    height={dimensions.height}
                />
            </Canvas>
        </div>
    );
}
