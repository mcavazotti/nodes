import { ColorRGB } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { InputElement } from "./base-input-element";
import { LayoutElementTypes } from "./element-types";
import { SocketElement } from "./socket-element";

export class ColorInputElement extends InputElement<ColorRGB> {
    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, onChange: (c: ColorRGB) => void) {
        super(parent, position, size, bottomRight, parent.id + "-input", LayoutElementTypes.colorInput, onChange);
    }
}