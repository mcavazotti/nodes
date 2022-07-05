import { ColorRGBA } from "../../core/color/color.js";
import { Vector2 } from "../../core/math/vector.js";
import { NodeClass } from "../types/node-classes.js";
import { Socket } from "../types/socket.js";
import { SocketType } from "../types/socket-types.js";
import { BaseNode } from "./base-node.js";

export class OutputNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.output;
        this._label = "Output"
        this._input = new Map([[{ label: "Color", type: SocketType.color, conection: null }, new ColorRGBA(0, 0, 0, 1)]]);
        this._output = [];
    }

}