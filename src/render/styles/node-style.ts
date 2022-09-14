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
    innerBgColor: "#a5a584",
    borderStyle: "#000",
    innerBorderStyle: "#333",
    fontFace: "Arial",
    fontSize: 16,
    fontColor: "white",
    textMargin: 3,
    borderThickness: 1,
    headerColors: new Map([
        [NodeClass.output, "tomato"], 
        [NodeClass.input,"blueviolet" ],
        [NodeClass.transform,"darkgreen" ],
    ]),
    socketColors: new Map([
        [SocketType.color, "cyan"],
        [SocketType.vector2,"red"],
        [SocketType.float,"orange"],
    ]),
    socketRadius: 5,
    connectionColor: "#ffffff",
    connectionThickness: 3,
    connectionControlPointOffset: 0.7,
}

export { NodeStyle, DefaultNodeStyle }