import { Vector2 } from "../../core/math/vector";
import { WidgetTypes } from "./widget-types";

export enum PivotTypes {
    undefined = "undefined",
    topLeft = "topLeft",
    topRight = "topRight",
    bottomLeft = "bottomLeft",
    bottomRight = "bottomRight"
}

export abstract class BaseWidget {
    position: Vector2;
    pivot: PivotTypes;
    type: WidgetTypes;
    abstract get size(): Vector2;

    get topLeft(): Vector2 {
        let topLeft: Vector2;
        switch (this.pivot) {
            case PivotTypes.undefined:
                throw Error("Widged has undefined pivot");
            case PivotTypes.topLeft:
                topLeft = this.position.copy();
                break;
            case PivotTypes.topRight:
                topLeft = this.position.sub(new Vector2(this.size.x, 0));
                break;
            case PivotTypes.bottomLeft:
                topLeft = this.position.sub(new Vector2(0,this.size.y));
                break;
            case PivotTypes.bottomRight:
                topLeft = this.position.sub(this.size);
                break;
        }
        return topLeft;
    }
    get bottomRight(): Vector2 {
        return this.topLeft.add(new Vector2(this.size.x, this.size.y));
    }

    protected constructor(pos: Vector2, pivot: PivotTypes, type: WidgetTypes) {
        this.position = pos;
        this.pivot = pivot;
        this.type = type;
    }

    abstract close(): void;
}