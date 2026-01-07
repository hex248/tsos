import { Stage, Layer, Circle } from "react-konva";
import { useEffect, useState } from "react";

function Index() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // canvas fills the available space (accounting for sidebar width of 320px)
    const canvasWidth = dimensions.width - 320;
    const canvasHeight = dimensions.height;

    return (
        <>
            <Stage width={canvasWidth} height={canvasHeight} className="">
                <Layer>
                    <Circle x={canvasWidth / 2} y={canvasHeight / 2} radius={100} fill="#68d436" draggable />
                </Layer>
            </Stage>
        </>
    );
}

export default Index;
