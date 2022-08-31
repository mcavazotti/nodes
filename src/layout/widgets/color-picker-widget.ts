import {  ColorRGBA } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { BaseWidget, PivotTypes } from "./base-widget";
import { WidgetTypes } from "./widget-types";

export class ColorPickerWidget extends BaseWidget {
    selectedColor: ColorRGBA;
    
    get size(): Vector2 {
        return new Vector2(100,100);
    }

    constructor(position: Vector2, pivot: PivotTypes, color: ColorRGBA) {
        super(position, pivot, WidgetTypes.colorPicker);
        this.selectedColor = color;
    }
    close(): void {
        console.log("close color picker")
    }

}