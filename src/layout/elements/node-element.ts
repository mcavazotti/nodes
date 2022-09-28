import { Vector2 } from "../../core/math/vector";
import { BaseNode } from "../../node/definitions";
import { LayoutElement } from "./base-elements";
import { LayoutElementTypes } from "./element-types";
import { ParameterElement } from "./parameter-element";
import { SocketElement } from "./socket-element";

export class NodeElement extends LayoutElement {
    node: BaseNode;
    headerHeight: number;
    labelPosition: Vector2;
    socketLayouts: Map<string, SocketElement>;
    parameterLayouts: ParameterElement[];

    constructor(node: BaseNode, id: string, socketLayouts: Map<string, SocketElement>, parametersLayouts: ParameterElement[], position: Vector2, size: Vector2, bottomRight: Vector2, labelPosition: Vector2, headerHeight: number) {
        super(position, size, bottomRight, id, LayoutElementTypes.node);
        this.node = node;
        this.labelPosition = labelPosition;
        this.headerHeight = headerHeight;
        this.socketLayouts = socketLayouts;
        this.parameterLayouts = parametersLayouts;
    }
}