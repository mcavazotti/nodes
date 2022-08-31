import { ColorRGBA } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { BaseWidget, PivotTypes } from "../widgets/base-widget";
import { ColorPickerWidget } from "../widgets/color-picker-widget";
import { InputElement } from "./base-input-element";
import { LayoutElementTypes } from "./element-types";
import { SocketElement } from "./socket-element";

export class ColorInputElement extends InputElement<ColorRGBA> {
    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, onChange: (c: ColorRGBA) => void) {
        super(parent, position, size, bottomRight, parent.id + "-input", LayoutElementTypes.colorInput, onChange, (pos, pivot, color: ColorRGBA) => new ColorPickerWidget(pos, pivot, color));
    }
    
    
    generateWidget(position: Vector2, pivot: PivotTypes): BaseWidget {
        return this.widgetGenerator(position,pivot,this.parent.socket.value);
    }
}