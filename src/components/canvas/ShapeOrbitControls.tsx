import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function ShapeOrbitControls({ target }: { target: Vector3 }) {
    const { camera, gl } = useThree();
    const controlsRef = useRef<OrbitControls | null>(null);

    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.rotateSpeed = 0.75;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.update();

        controlsRef.current = controls;

        return () => {
            controls.dispose();
            controlsRef.current = null;
        };
    }, [camera, gl]);

    useEffect(() => {
        if (!controlsRef.current) {
            return;
        }

        controlsRef.current.target.copy(target);
        controlsRef.current.update();
    }, [target]);

    useFrame(() => {
        controlsRef.current?.update();
    });

    return null;
}
