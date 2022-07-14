import { Vector2 } from "../../core/math/vector";
import { BaseNode } from "../../node/definitions";
import { LayoutElement, SocketElement } from "../layout-elements";

export class NodeElement extends LayoutElement {
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