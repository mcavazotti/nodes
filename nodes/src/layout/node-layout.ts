import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "../node/node-defs/base-node.js";
import { Socket } from "../node/types/socket.js";
import { NodeStyle } from "../render/styles/node-style.js";

interface SocketLayout {
    socket: Socket
    postition: Vector2;
    labelPostion: Vector2;
    labelAlign: "left"|"right";
}

interface NodeLayout {
    node: BaseNode;
    position: Vector2;
    headerHeight: number;
    labelPos: Vector2;
    size: Vector2;
    socketLayouts: Map<string,SocketLayout>;
}

export {NodeLayout, SocketLayout};