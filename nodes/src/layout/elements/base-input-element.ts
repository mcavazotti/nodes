import { Vector2 } from "../../core/math/vector";
import { Socket } from "../../node/types/socket";
import { LayoutElement } from "./base-elements";
import { SocketElement } from "./socket-element";

export abstract class InputElement<T> extends LayoutElement {
    private _value: T;
    private onChange: (val: T) => void;
    get value(): T {
        return this._value;
    }
    set value(v: T) {
        this._value = v;
        this.onChange(v);
    }

    parent: SocketElement;

    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, id: string, onChange: (val: T) => void) {
        super(position, size, bottomRight, id);
        this.parent = parent;
        this._value = (parent.socket as Socket<T>).value!;
        this.onChange = onChange;
    }
}