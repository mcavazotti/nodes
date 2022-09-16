import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class SqrtNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Square Root"
        this._input = [
            { label: "Number", role: "input", type: SocketType.float, conection: null, value: 0 },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.float, conection: null },
        ];

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    code(): string {
        let code = "";

        let soket = this.input[0] as Socket<number>;
        let num: string = (soket.conection ?
            convertSocketTypes(soket.type, soket.conection[1], getVariableNameForSocket(soket.conection[0])) :
            soket.value!.toFixed(2));

        code = `float ${getVariableNameForSocket(this.output[0].uId!)} = sqrt(${num});`

        return code + "\n";
    }
}