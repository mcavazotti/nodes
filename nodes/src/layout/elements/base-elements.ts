import { Vector2 } from "../../core/math/vector";
import { LayoutElementTypes } from "./element-types";

export abstract class LayoutElement {
    position: Vector2;
    size: Vector2;
    bottomRight: Vector2;
    id: string;
    readonly type: LayoutElementTypes;

    constructor(position: Vector2, size: Vector2, bottomRight: Vector2, id: string, type: LayoutElementTypes) {
        this.position = position;
        this.size = size;
        this.bottomRight = bottomRight;
        this.id = id;
        this.type = type;
    }
}
