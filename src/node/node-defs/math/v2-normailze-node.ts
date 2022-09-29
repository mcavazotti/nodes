import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class Vec2NormalizeNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Vector2 Normalize"
        this._input = [
            { label: "Vector", role: "input", type: SocketType.vector2, conection: null, value: new Vector2() },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.vector2, conection: null },
        ];

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }


    code(): string {
        let code = "";

        let vecSocket = this.input[0] as Socket<Vector2>;
        let vec: string = (vecSocket.conection ?
            convertSocketTypes(vecSocket.conection[1], vecSocket.type, getVariableNameForSocket(vecSocket.conection[0])) :
            `vec2${vecSocket.value!.toString(2)}`);

        code = `vec2 ${getVariableNameForSocket(this.output[0].uId!)} = normalize(${vec});`

        return code + "\n";
    }
}