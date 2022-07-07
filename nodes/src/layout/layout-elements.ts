import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "../node/node-defs/base-node.js";
import { Socket } from "../node/types/socket.js";



interface SocketElement {
    socket: Socket
    postition: Vector2;
    topLeft: Vector2;
    size: Vector2;
    bottomRight: Vector2;
    labelPostion: Vector2;
    labelAlign: "left"|"right";
}

interface NodeElement {
    node: BaseNode;
    position: Vector2;
    headerHeight: number;
    labelPos: Vector2;
    size: Vector2;
    bottomRight: Vector2;
    socketLayouts: Map<string,SocketElement>;
}

export {NodeElement, SocketElement};