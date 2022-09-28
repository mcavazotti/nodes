import { Vector2 } from "../../core/math/vector";
import { NodeParameter } from "../../node/types/parameter";
import { LayoutElement } from "./base-elements";
import { LayoutElementTypes } from "./element-types";
import { NodeElement } from "./node-element";

export class ParameterElement extends LayoutElement {

    parameter: NodeParameter

    labelPosition: Vector2;
    parent: NodeElement;
    constructor(parameter: NodeParameter, parent: NodeElement, position: Vector2, size: Vector2, bottomRight: Vector2, labelPosition: Vector2) {
        super(position, size, bottomRight, '0', LayoutElementTypes.parameter);
        this.parameter = parameter;
        this.parent = parent;
        this.labelPosition = labelPosition;
    }
}