import { ColorRGBA } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { NodeClass } from "../types/node-classes";
import { SocketType } from "../types/socket-types";
import { BaseNode } from "./base-node";

export class CoordinateNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.output;
        this._label = "Coordinates"
        this._input = [];
        this._output = [{
            label: "Coordinates",
            role: "output",
            conection: null,
            type: SocketType.vector2,
        }];

        this.setSocketsId();
    }

}