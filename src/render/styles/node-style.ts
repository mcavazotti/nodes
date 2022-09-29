import { Vector2 } from "../../core/math/vector";
import { NodeClass } from "../../node/types/node-classes";
import { SocketType } from "../../node/types/socket-types";

/**
 * Style definitions used by the `Camera` to render nodes, sockets and connections
 */
interface NodeStyle {
    bgColor?: string;
    innerBgColor?: string;
    borderStyle?: string;
    innerBorderStyle?: string;
    fontFace?: string;
    fontSize?: number;
    fontColor?: string;
    textMargin?: Vector2;
    borderThickness?: number;
    headerColors?: Map<NodeClass, string>;
    socketColors?: Map<SocketType, string>;
    socketRadius?: number;
    connectionColor?: string;
    connectionThickness?: number;
    connectionControlPointOffset?: number;
}

const DefaultNodeStyle: NodeStyle = {
    bgColor: "#848484",
    innerBgColor: "#a5a584",
    borderStyle: "#000",
    innerBorderStyle: "#333",
    fontFace: "Arial",
    fontSize: 16,
    fontColor: "white",
    textMargin: new Vector2(8,5),
    borderThickness: 1,
    headerColors: new Map([
        [NodeClass.output, "tomato"],
        [NodeClass.input, "blueviolet"],
        [NodeClass.transform, "darkgreen"],
        [NodeClass.mathOp, "teal"],
    ]),
    socketColors: new Map([
        [SocketType.color, "cyan"],
        [SocketType.vector2, "red"],
        [SocketType.vector3, "green"],
        [SocketType.float, "orange"],
        [SocketType.bool, "yellow"],
    ]),
    socketRadius: 5,
    connectionColor: "#ffffff",
    connectionThickness: 3,
    connectionControlPointOffset: 0.7,
}

export { NodeStyle, DefaultNodeStyle }