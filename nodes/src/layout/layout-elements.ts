import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "../node/node-defs/base-node.js";
import { Socket } from "../node/types/socket.js";

abstract class LayoutElement {
    position: Vector2;
    size: Vector2;
    bottomRight: Vector2;
    id: string;

    constructor(position: Vector2, size: Vector2, bottomRight: Vector2, id: string) {
        this.position = position;
        this.size = size;
        this.bottomRight = bottomRight;
        this.id = id;
    }
}

class SocketElement extends LayoutElement {
    socket: Socket
    topLeft: Vector2;
    labelPosition: Vector2;
    labelAlign: "left" | "right";

    constructor(socket: Socket, id: string, position: Vector2, size: Vector2, topLeft: Vector2, bottomRight: Vector2, labelPosition: Vector2, labelAlign: "left" | "right") {
        super(position, size, bottomRight, id);
        this.socket = socket;
        this.topLeft = topLeft;
        this.labelPosition = labelPosition;
        this.labelAlign = labelAlign;
    }
}

class NodeElement extends LayoutElement {
    node: BaseNode;
    headerHeight: number;
    labelPosition: Vector2;
    socketLayouts: Map<string, SocketElement>;

    constructor(node: BaseNode, id: string, socketLayouts: Map<string, SocketElement>, position: Vector2, size: Vector2, bottomRight: Vector2, labelPosition: Vector2, headerHeight: number) {
        super(position, size, bottomRight, id);
        this.node = node;
        this.labelPosition = labelPosition;
        this.headerHeight = headerHeight;
        this.socketLayouts = socketLayouts;
    }
}


export { LayoutElement, NodeElement, SocketElement };