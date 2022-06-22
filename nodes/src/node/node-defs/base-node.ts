import { Vector2 } from "../../core/math/vector.js";
import { NodeClass } from "../types/node-classes.js";
import { Socket } from "../types/socket.js";

export abstract class BaseNode {
    protected _label!: string;
    protected _type!: NodeClass;
    protected _input!: Map<Socket, any>;
    protected _output!: Socket[];

    get label() { return this._label };
    get type() { return this._type };
    get input() { return this._input };
    get output() { return this._output };

    position: Vector2;

    constructor(pos: Vector2) {
        this.position = pos;
    }
}