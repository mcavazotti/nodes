import { Vector2 } from "../../core/math/vector";
import { NodeClass } from "../types/node-classes";
import { NodeParameter } from "../types/parameter";
import { Socket } from "../types/socket";

export abstract class BaseNode {
    protected _label!: string;
    protected _type!: NodeClass;
    protected _input!: Socket<any>[];
    protected _output!: Socket<any>[];
    protected _parameters!: NodeParameter[];

    private static idCounter: number = 0;

    get label() { return this._label };
    get type() { return this._type };
    get input() { return this._input };
    get output() { return this._output };
    get parameters() { return this._parameters ?? [] };
    readonly uId: string;

    position: Vector2;

    constructor(pos: Vector2) {
        this.uId = `n-${BaseNode.idCounter.toString().padStart(4, '0')}`;
        BaseNode.idCounter++;
        this.position = pos;
    }

    protected setSocketsId() {
        let id = 0;
        for (const socket of this._input) {
            socket.uId = `${this.uId}-i-${id.toString().padStart(4, '0')}`;
            id++;
        }

        for (const socket of this._output) {
            socket.uId = `${this.uId}-o-${id.toString().padStart(4, '0')}`;
            id++;
        }
    }

    abstract code(): string;
    abstract definitions(): [string, string][];

}