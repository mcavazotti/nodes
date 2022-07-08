import { ColorRGB } from "../../core/color/color.js";
import { Vector2 } from "../../core/math/vector.js";
import { InputElement } from "./base-input-element.js";
import { SocketElement } from "./socket-element.js";

export class ColorInputElement extends InputElement<ColorRGB> {
    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, onChange:(c: ColorRGB)=>void) {
        super(parent, position, size, bottomRight, parent.id + "-input",onChange);
    }
}