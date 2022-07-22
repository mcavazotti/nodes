import { ColorRGBA } from "../../core/color/color";
import { Vector2 } from "../../core/math/vector";
import { NodeClass } from "../types/node-classes";
import { Socket } from "../types/socket";
import { SocketType } from "../types/socket-types";
import { BaseNode } from "./base-node";
import { convertSocketTypes, getVariableNameForSocket } from "./node-code-helpers";

export class OutputNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.output;
        this._label = "Output"
        this._input = [
            { label: "Color", role: "input", type: SocketType.color, conection: null, value: new ColorRGBA("#000000") },
        ];
        this._output = [];

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    code(): string {
        let code = "gl_FragColor = ";
        let socket = this._input[0] as Socket<ColorRGBA>;
        if (!socket.conection) {
            code += `vec4${socket.value!.toString()}`;
        }
        else {
            code += convertSocketTypes(socket.conection[1], socket.type, getVariableNameForSocket(socket.conection[0]));
        }
        return code + ";\n";
    }
}

