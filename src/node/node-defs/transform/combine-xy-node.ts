import { Vector2 } from "../../../core/math/vector";
import { NodeClass } from "../../types/node-classes";
import { Socket } from "../../types/socket";
import { SocketType } from "../../types/socket-types";
import { BaseNode } from "../base-node";
import { convertSocketTypes, getVariableNameForSocket } from "../node-code-helpers";

export class CombineXYNode extends BaseNode {

    constructor(pos: Vector2) {
        super(pos);
        this._type = NodeClass.transform;
        this._label = "Combine X Y"
        this._input = [
            { label: "X", role: "input", type: SocketType.float, conection: null, value: 0 },
            { label: "Y", role: "input", type: SocketType.float, conection: null, value: 0 },
        ];
        this._output = [
            { label: "Vector", role: "output", type: SocketType.vector2, conection: null },
        ];

        this.setSocketsId();
    }

    definitions(): [string, string][] {
        return [];
    }

    code(): string {
        let code = "";

        let xSocket = this.input[0] as Socket<number>;
        let xComponent: string = (xSocket.conection ?
            convertSocketTypes(xSocket.type, xSocket.conection[1], getVariableNameForSocket(xSocket.conection[0])) :
            xSocket.value!.toString());

        let ySocket = this.input[1] as Socket<number>;
        let yComponent: string = (ySocket.conection ?
            convertSocketTypes(ySocket.type, ySocket.conection[1], getVariableNameForSocket(ySocket.conection[0])) :
            ySocket.value!.toString());

        code = `vec2 ${getVariableNameForSocket(this.output[0].uId!)} = vec2(${xComponent}, ${yComponent});`

        return code + "\n";
    }
}