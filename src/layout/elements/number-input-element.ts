import { Vector2 } from "../../core/math/vector";
import { SocketInputElement } from "./base-input-element";
import { LayoutElementTypes } from "./element-types";
import { SocketElement } from "./socket-element";

export class NumberInputElement extends SocketInputElement<number> {
    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, onChange: (c: number) => void) {
        super(parent, position, size, bottomRight, parent.id + "-input", LayoutElementTypes.colorInput, onChange);
    }
}