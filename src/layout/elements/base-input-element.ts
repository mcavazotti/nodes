import { Vector2 } from "../../core/math/vector";
import { Socket } from "../../node/types/socket";
import { LayoutElement } from "./base-elements";
import { LayoutElementTypes } from "./element-types";
import { SocketElement } from "./socket-element";

export abstract class SocketInputElement<T> extends LayoutElement {

    private onChange: (val: T) => void;
    get value(): T {
        return (this.parent.socket as Socket<T>).value!;
    }
    set value(v: T) {
        (this.parent.socket as Socket<T>).value = v;
        this.onChange(v);
    }

    parent: SocketElement;

    constructor(parent: SocketElement, position: Vector2, size: Vector2, bottomRight: Vector2, id: string, type: LayoutElementTypes, onChange: (val: T) => void) {
        super(position, size, bottomRight, id, type);
        this.parent = parent;
        this.onChange = onChange;
    }
}