import { ColorRGBA } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { NodeClass } from "../types/node-classes";
import { SocketType } from "../types/socket-types";
import { BaseNode } from "./base-node";

export class OutputNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.output;
        this._label = "Output"
        this._input = [
            { label: "Color", role:"input", type: SocketType.color, conection: null, value: new ColorRGBA("#000000") },
        ];
        this._output = [];

        this.setSocketsId();
    }

}