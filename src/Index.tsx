import { Stage, Layer, Circle } from "react-konva";

const STAGE_SIZE = 0.6;
const ASPECT_RATIO = 4 / 3;

function Index() {
    return (
        <Stage
            width={window.innerWidth * STAGE_SIZE * ASPECT_RATIO}
            height={window.innerWidth * STAGE_SIZE}
            className="border rounded-lg"
        >
            <Layer>
                <Circle
                    x={(window.innerWidth * STAGE_SIZE * ASPECT_RATIO) / 2}
                    y={(window.innerWidth * STAGE_SIZE) / 2}
                    radius={100}
                    fill="#68d436"
                    draggable
                />
            </Layer>
        </Stage>
    );
}

export default Index;
