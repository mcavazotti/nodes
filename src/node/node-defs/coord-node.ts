import { ColorRGBA } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { NodeClass } from "../types/node-classes";
import { SocketType } from "../types/socket-types";
import { BaseNode } from "./base-node";
import { getVariableNameForSocket } from "./node-code-helpers";

export class CoordinateNode extends BaseNode {
    
    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.input;
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
    
    definitions(): [string, string][] {
        return []
    }

    code(): string {
        return `vec2 ${getVariableNameForSocket(this.output[0].uId!)} = gl_FragCoord.xy / uResolution;\n`;
    }
}