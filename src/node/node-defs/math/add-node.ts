import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class AddNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Add"
        this._input = [
            { label: "Number", role: "input", type: SocketType.float, conection: null, value: 0 },
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

        let num1Socket = this.input[0] as Socket<number>;
        let num1: string = (num1Socket.conection ?
            convertSocketTypes(num1Socket.type, num1Socket.conection[1], getVariableNameForSocket(num1Socket.conection[0])) :
            num1Socket.value!.toFixed(2));

        let num2Socket = this.input[1] as Socket<number>;
        let num2: string = (num2Socket.conection ?
            convertSocketTypes(num2Socket.type, num2Socket.conection[1], getVariableNameForSocket(num2Socket.conection[0])) :
            num2Socket.value!.toFixed(2));

        code = `float ${getVariableNameForSocket(this.output[0].uId!)} = ${num1} + ${num2};`

        return code + "\n";
    }
}