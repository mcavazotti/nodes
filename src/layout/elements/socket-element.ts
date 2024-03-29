import { Vector2 } from "../../core/math/vector";
import { Socket } from "../../node/types/socket";
import { LayoutElement } from "./base-elements";
import { SocketInputElement } from "./base-input-element";
import { LayoutElementTypes } from "./element-types";
import { NodeElement } from "./node-element";

export class SocketElement extends LayoutElement {
    socket: Socket<any>
    topLeft: Vector2;
    labelPosition: Vector2;
    labelAlign: "left" | "right";
    parent: NodeElement;
    input?: SocketInputElement<any>;

    constructor(socket: Socket<any>, id: string, parent: NodeElement, position: Vector2, size: Vector2, topLeft: Vector2, bottomRight: Vector2, labelPosition: Vector2, labelAlign: "left" | "right") {
        super(position, size, bottomRight, id, LayoutElementTypes.socket);
        this.socket = socket;
        this.parent = parent;
        this.topLeft = topLeft;
        this.labelPosition = labelPosition;
        this.labelAlign = labelAlign;
    }
}