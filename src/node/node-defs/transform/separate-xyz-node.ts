import { Vector2, Vector3 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class SeparateXYZNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.transform;
        this._label = "Separate X Y Z"
        this._input = [
            { label: "Vector", role: "input", type: SocketType.vector3, conection: null, value: new Vector3(0.0, 0.0) },
        ];
        this._output = [
            { label: "X", role: "output", type: SocketType.float, conection: null },
            { label: "Y", role: "output", type: SocketType.float, conection: null },
            { label: "Z", role: "output", type: SocketType.float, conection: null },
        ];

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    code(): string {
        let socket = this.input[0] as Socket<Vector3>;
        let code = "";
        if (!socket.conection) {
            code = `float ${getVariableNameForSocket(this.output[0].uId!)} = ${socket.value!.x.toFixed(2)};\n`;
            code += `float ${getVariableNameForSocket(this.output[1].uId!)} = ${socket.value!.y.toFixed(2)};\n`;
            code += `float ${getVariableNameForSocket(this.output[2].uId!)} = ${socket.value!.z.toFixed(2)};\n`;
        }
        else {
            code = `float ${getVariableNameForSocket(this.output[0].uId!)} = ${convertSocketTypes(socket.conection[1], socket.type, getVariableNameForSocket(socket.conection[0]))}.x;\n`;
            code += `float ${getVariableNameForSocket(this.output[1].uId!)} = ${convertSocketTypes(socket.conection[1], socket.type, getVariableNameForSocket(socket.conection[0]))}.y;\n`;
            code += `float ${getVariableNameForSocket(this.output[2].uId!)} = ${convertSocketTypes(socket.conection[1], socket.type, getVariableNameForSocket(socket.conection[0]))}.z;\n`;
        }
        return code + "\n";
    }
}