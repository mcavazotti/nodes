import { NodeClass } from "../../node/types/node-classes";
import { SocketType } from "../../node/types/socket-types";

interface NodeStyle {
    bgColor?: string;
    borderStyle?: string;
    fontFace?: string;
    fontSize?: number;
    fontColor?: string;
    textMargin?: number;
    borderThickness?: number;
    headerColors?: Map<NodeClass, string>;
    socketColors?: Map<SocketType, string>;
    socketRadius?: number;
    connectionColor?: string;
    connectionThickness?: number;
    connectionControlPointOffset?:number;
}

const DefaultNodeStyle: NodeStyle = {
    bgColor: "#848484",
    borderStyle: "#000",
    fontFace: "Arial",
    fontSize: 16,
    fontColor: "white",
    textMargin: 3,
    borderThickness: 1,
    headerColors: new Map([[NodeClass.output, "tomato"], [NodeClass.input,"blueviolet" ]]),
    socketColors: new Map([[SocketType.color, "cyan"],[SocketType.vector2,"red"]]),
    socketRadius: 5,
    connectionColor: "#ffffff",
    connectionThickness: 3,
    connectionControlPointOffset: 0.7,
}

export { NodeStyle, DefaultNodeStyle }