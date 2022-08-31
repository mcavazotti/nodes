import { Vector2 } from "../../core/math/vector";
import { Socket } from "../../node/types/socket";
import { BaseWidget, PivotTypes } from "../widgets/base-widget";
import { LayoutElement } from "./base-element";
import { LayoutElementTypes } from "./element-types";
import { SocketElement } from "./socket-element";

export abstract class InputElement<T> extends LayoutElement {
    private _value: T;
    private onChange: (val: T) => void;
    protected widgetGenerator: (postition: Vector2, pivot: PivotTypes, ...data: any ) =>BaseWidget;
    get value(): T {
        return this._value;
    }
    set value(v: T) {
        this._value = v;
        this.onChange(v);
    }

    parent: SocketElement;

    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, id: string, type: LayoutElementTypes, onChange: (val: T) => void, widgetGenerator: (postition: Vector2, pivot: PivotTypes, ...data: any ) =>BaseWidget) {
        super(position, size, bottomRight, id, type);
        this.parent = parent;
        this._value = (parent.socket as Socket<T>).value!;
        this.onChange = onChange;
        this.widgetGenerator = widgetGenerator; 
    }

    abstract generateWidget(position: Vector2, pivot: PivotTypes): BaseWidget;
}