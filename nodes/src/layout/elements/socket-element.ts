import { Vector2 } from "../../core/math/vector.js";
import { Socket } from "../../node/types/socket.js";
import { LayoutElement } from "../layout-elements.js";

export class SocketElement extends LayoutElement {
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