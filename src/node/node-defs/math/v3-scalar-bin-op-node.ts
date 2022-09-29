import { Vector2, Vector3 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class Vec3ScalarBinOpNode extends BaseNode {

    override get label(): string {
        switch (this._parameters[0].value) {
            case '*':
                return "Scale";
        }
        return this._label;
    }

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Vector3 Scalar Binary Op"
        this._input = [
            { label: "Vector", role: "input", type: SocketType.vector3, conection: null, value: new Vector3() },
            { label: "Vector", role: "input", type: SocketType.float, conection: null, value: 0 },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.vector3, conection: null },
        ];
        this._parameters = [
            {
                label: "Operation",
                value: "*",
                validValues: ['*']
            },
        ]

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }


    code(): string {
        let code = "";

        let v1Socket = this.input[0] as Socket<Vector2>;
        let v1: string = (v1Socket.conection ?
            convertSocketTypes(v1Socket.conection[1], v1Socket.type, getVariableNameForSocket(v1Socket.conection[0])) :
            `vec3${v1Socket.value!.toString(2)}`);

        let num2Socket = this.input[1] as Socket<number>;
        let num2: string = (num2Socket.conection ?
            convertSocketTypes(num2Socket.conection[1], num2Socket.type, getVariableNameForSocket(num2Socket.conection[0])) :
            num2Socket.value!.toFixed(2));

        code = `vec3 ${getVariableNameForSocket(this.output[0].uId!)} = ${v1} ${this._parameters[0].value} ${num2};`

        return code + "\n";
    }
}