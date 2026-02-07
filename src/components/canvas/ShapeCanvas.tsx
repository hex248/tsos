import { screenToWorld } from "@/lib/canvas/coordinates";
import type { ShapeState } from "@/types/shape";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { OrthographicCamera, Vector3 } from "three";
import MorphableShape from "./MorphableShape";
import ShapeOrbitControls from "./ShapeOrbitControls";
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
}: {
    state: ShapeState;
}) {
    const [dimensions, setDimensions] = useState(getDimensions);

    useEffect(() => {
        const handleResize = () => {
            setDimensions(getDimensions());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const orbitTarget = useMemo(() => {
        const world = screenToWorld(state.x, state.y, dimensions.width, dimensions.height);
        return new Vector3(world.x, world.y, 0);
    }, [state.x, state.y, dimensions.width, dimensions.height]);

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
                <ShapeOrbitControls target={orbitTarget} />
                <MorphableShape state={state} width={dimensions.width} height={dimensions.height} />
            </Canvas>
        </div>
    );
}
