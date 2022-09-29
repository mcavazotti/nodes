import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class ScalarBinBoolOpNode extends BaseNode {

    override get label(): string {
        switch (this._parameters[0].value) {
            case '<':
                return "Less Than";
            case '<=':
                return "Less Equal";
            case '>':
                return "Greater Than";
            case '>=':
                return "Greater Equal";
            case '==':
                return "Equal";
            case '!=':
                return "Not Equal";
        }
        return this._label;
    }

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Scalar Binary Op"
        this._input = [
            { label: "Number", role: "input", type: SocketType.float, conection: null, value: 0 },
            { label: "Number", role: "input", type: SocketType.float, conection: null, value: 0 },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.bool, conection: null },
        ];
        this._parameters = [
            {
                label: "Operation",
                value: "<",
                validValues: ['<', '<=', '>', '>=', '==', '!=']
            },
        ]

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    code(): string {
        let code = "";

        let num1Socket = this.input[0] as Socket<number>;
        let num1: string = (num1Socket.conection ?
            convertSocketTypes(num1Socket.conection[1], num1Socket.type, getVariableNameForSocket(num1Socket.conection[0])) :
            num1Socket.value!.toFixed(2));

        let num2Socket = this.input[1] as Socket<number>;
        let num2: string = (num2Socket.conection ?
            convertSocketTypes(num2Socket.conection[1], num2Socket.type, getVariableNameForSocket(num2Socket.conection[0])) :
            num2Socket.value!.toFixed(2));


        code = `bool ${getVariableNameForSocket(this.output[0].uId!)} = ${num1} ${this._parameters[0].value} ${num2};`

        return code + "\n";
    }
}