import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class Vec2BinOpNode extends BaseNode {

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
        }
        return this._label;
    }

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.mathOp;
        this._label = "Vector2 Binary Op"
        this._input = [
            { label: "Vector", role: "input", type: SocketType.vector2, conection: null, value: new Vector2() },
            { label: "Vector", role: "input", type: SocketType.vector2, conection: null, value: new Vector2() },
        ];
        this._output = [
            { label: "Result", role: "output", type: SocketType.vector2, conection: null },
        ];
        this._parameters = [
            {
                label: "Operation",
                value: "+",
                validValues: ['+', '-', '*', '/', 'reflect']
            },
        ]

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    private isFunc(): boolean {
        return ['reflect'].includes(this._parameters[0].value)
    }

    code(): string {
        let code = "";

        let v1Socket = this.input[0] as Socket<Vector2>;
        let v1: string = (v1Socket.conection ?
            convertSocketTypes(v1Socket.conection[1], v1Socket.type, getVariableNameForSocket(v1Socket.conection[0])) :
            `vec2${v1Socket.value!.toString(2)}`);

        let v2Socket = this.input[1] as Socket<Vector2>;
        let v2: string = (v2Socket.conection ?
            convertSocketTypes(v2Socket.conection[1], v2Socket.type, getVariableNameForSocket(v2Socket.conection[0])) :
            `vec2${v2Socket.value!.toString(2)}`);

        if (this.isFunc())
            code = `vec2 ${getVariableNameForSocket(this.output[0].uId!)} = ${this._parameters[0].value}(${v1}, ${v2});`
        else
            code = `vec2 ${getVariableNameForSocket(this.output[0].uId!)} = ${v1} ${this._parameters[0].value} ${v2};`

        return code + "\n";
    }
}