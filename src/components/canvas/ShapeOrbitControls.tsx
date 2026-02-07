import type { ViewMode } from "@/types/viewMode";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrthographicCamera, type Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const DEFAULT_CAMERA_POSITION = { x: 0, y: 0, z: 1000 };
const DEFAULT_CAMERA_ZOOM = 1;

export default function ShapeOrbitControls({ mode, target }: { mode: ViewMode; target: Vector3 }) {
    const { camera, gl } = useThree();
    const controlsRef = useRef<OrbitControls | null>(null);
    const targetRef = useRef(target);

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
        targetRef.current = target;
    }, [target]);

    useEffect(() => {
        if (!controlsRef.current) {
            return;
        }

        camera.position.set(DEFAULT_CAMERA_POSITION.x, DEFAULT_CAMERA_POSITION.y, DEFAULT_CAMERA_POSITION.z);
        camera.rotation.set(0, 0, 0);
        camera.up.set(0, 1, 0);

        if (camera instanceof OrthographicCamera) {
            camera.zoom = DEFAULT_CAMERA_ZOOM;
            camera.updateProjectionMatrix();
        }

        controlsRef.current.target.copy(targetRef.current);
        controlsRef.current.enabled = mode === "view";
        controlsRef.current.update();
    }, [camera, mode]);

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
