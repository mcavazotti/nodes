import { NodeClass } from "../../node/types/node-classes.js";
import { SocketType } from "../../node/types/socket-types.js";

interface NodeStyle {
    bgColor?: string;
    borderStyle?: string;
    fontFace?: string;
    fontSize?: number;
    fontColor?: string;
    textMargin?: number;
    headerColors?: Map<NodeClass, string>;
    socketColors?: Map<SocketType, string>;
    socketRadius?: number;
}

const DefaultNodeStyle: NodeStyle = {
    bgColor: "#848484",
    borderStyle: "#000",
    fontFace: "Arial",
    fontSize: 16,
    fontColor: "white",
    textMargin: 3,
    headerColors: new Map([[NodeClass.output, "tomato"]]),
    socketColors: new Map([[SocketType.color, "cyan"],[SocketType.vector3,"teal"]]),
    socketRadius: 5,
}

export { NodeStyle, DefaultNodeStyle }