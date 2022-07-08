import { Vector2 } from "../../core/math/vector.js";
import { Socket } from "../../node/types/socket.js";
import { LayoutElement, NodeElement } from "../layout-elements.js";
import { InputElement } from "./base-input-element.js";

export class SocketElement extends LayoutElement {
    socket: Socket<any>
    topLeft: Vector2;
    labelPosition: Vector2;
    labelAlign: "left" | "right";
    parent: NodeElement;
    input?: InputElement<any>;

    constructor(socket: Socket<any>, id: string, parent: NodeElement, position: Vector2, size: Vector2, topLeft: Vector2, bottomRight: Vector2, labelPosition: Vector2, labelAlign: "left" | "right") {
        super(position, size, bottomRight, id);
        this.socket = socket;
        this.parent = parent;
        this.topLeft = topLeft;
        this.labelPosition = labelPosition;
        this.labelAlign = labelAlign;
    }
}