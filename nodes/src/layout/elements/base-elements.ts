import { Vector2 } from "../../core/math/vector.js";

export abstract class LayoutElement {
    position: Vector2;
    size: Vector2;
    bottomRight: Vector2;
    id: string;

    constructor(position: Vector2, size: Vector2, bottomRight: Vector2, id: string) {
        this.position = position;
        this.size = size;
        this.bottomRight = bottomRight;
        this.id = id;
    }
}
