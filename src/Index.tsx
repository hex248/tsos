import { useEffect, useState } from "react";
import ShapeCanvas from "@/components/canvas/ShapeCanvas";
import { useShapeState } from "@/hooks/useShapeState";
import Layout from "./Layout";

function Index() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth - 320,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth - 320,
                height: window.innerHeight,
            });
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const [state, setState] = useShapeState(centerX, centerY);

    return (
        <Layout sidebarContent={<>controls here</>}>
            <ShapeCanvas state={state} onStateChange={setState} />
        </Layout>
    );
}

export default Index;
