export default function ShapeSceneLighting() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[220, 240, 280]} intensity={1.05} />
            <directionalLight position={[-180, -120, 180]} intensity={0.35} />
        </>
    );
}
