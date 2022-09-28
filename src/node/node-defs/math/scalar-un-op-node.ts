import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class ScalarUnOpNode extends BaseNode {

    override get label(): string {
        switch (this._parameters[0].value) {
            case 'sqrt':
                return "Square Root";
            case 'exp':
                return "Exponential";

        }
        return this._label;
    }

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Scalar Binary Op"
        this._input = [
            { label: "Number", role: "input", type: SocketType.float, conection: null, value: 0 },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.float, conection: null },
        ];
        this._parameters = [
            {
                label: "Operation",
                value: "sqrt",
                validValues: ['sqrt', 'exp']
            },
        ]

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    code(): string {
        let code = "";

        let soket = this.input[0] as Socket<number>;
        let num: string = (soket.conection ?
            convertSocketTypes(soket.conection[1], soket.type, getVariableNameForSocket(soket.conection[0])) :
            soket.value!.toFixed(2));

        code = `float ${getVariableNameForSocket(this.output[0].uId!)} = ${this._parameters[0].value}(${num});`

        return code + "\n";
    }
}