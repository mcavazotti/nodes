import { Vector, Vector2 } from "../../core/math/vector";
import { SocketInputElement } from "./base-input-element";
import { LayoutElementTypes } from "./element-types";
import { SocketElement } from "./socket-element";

export class VectorInputElement<Type extends Vector> extends SocketInputElement<Type> {
    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, onChange: (c: Type) => void) {
        super(parent, position, size, bottomRight, parent.id + "-input", LayoutElementTypes.colorInput, onChange);
    }
}