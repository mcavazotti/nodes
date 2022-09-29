import { Vector2, Vector3 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class Vec3BinOpNode extends BaseNode {

    override get label(): string {
        switch (this._parameters[0].value) {
            case '+':
                return "Add";
            case '-':
                return "Subtract";
            case '*':
                return "Multiply";
            case '/':
                return "Divide";
            case 'reflect':
                return "Reflect";
            case 'cross':
                return "Cross Product";
        }
        return this._label;
    }

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Vector3 Binary Op"
        this._input = [
            { label: "Vector", role: "input", type: SocketType.vector3, conection: null, value: new Vector3() },
            { label: "Vector", role: "input", type: SocketType.vector3, conection: null, value: new Vector3() },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.vector3, conection: null },
        ];
        this._parameters = [
            {
                label: "Operation",
                value: "+",
                validValues: ['+', '-', '*', '/', 'reflect', 'cross']
            },
        ]

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    private isFunc(): boolean {
        return ['reflect', 'cross'].includes(this._parameters[0].value)
    }

    code(): string {
        let code = "";

        let v1Socket = this.input[0] as Socket<Vector3>;
        let v1: string = (v1Socket.conection ?
            convertSocketTypes(v1Socket.conection[1], v1Socket.type, getVariableNameForSocket(v1Socket.conection[0])) :
            `vec3${v1Socket.value!.toString(2)}`);

        let v2Socket = this.input[1] as Socket<Vector3>;
        let v2: string = (v2Socket.conection ?
            convertSocketTypes(v2Socket.conection[1], v2Socket.type, getVariableNameForSocket(v2Socket.conection[0])) :
            `vec3${v2Socket.value!.toString(2)}`);

        if (this.isFunc())
            code = `vec3 ${getVariableNameForSocket(this.output[0].uId!)} = ${this._parameters[0].value}(${v1}, ${v2});`
        else
            code = `vec3 ${getVariableNameForSocket(this.output[0].uId!)} = ${v1} ${this._parameters[0].value} ${v2};`

        return code + "\n";
    }
}