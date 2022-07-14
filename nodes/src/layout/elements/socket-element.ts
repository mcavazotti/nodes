import { Vector2 } from "../../core/math/vector";
import { Socket } from "../../node/types/socket";
import { LayoutElement, NodeElement } from "../layout-elements";
import { InputElement } from "./base-input-element";
import { LayoutElementTypes } from "./element-types";

export class SocketElement extends LayoutElement {
    socket: Socket<any>
    topLeft: Vector2;
    labelPosition: Vector2;
    labelAlign: "left" | "right";
    parent: NodeElement;
    input?: InputElement<any>;

    constructor(socket: Socket<any>, id: string, parent: NodeElement, position: Vector2, size: Vector2, topLeft: Vector2, bottomRight: Vector2, labelPosition: Vector2, labelAlign: "left" | "right") {
        super(position, size, bottomRight, id, LayoutElementTypes.socket);
        this.socket = socket;
        this.parent = parent;
        this.topLeft = topLeft;
        this.labelPosition = labelPosition;
        this.labelAlign = labelAlign;
    }
}