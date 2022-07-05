import { Vector2 } from "../../core/math/vector.js";
import { NodeClass } from "../types/node-classes.js";
import { Socket } from "../types/socket.js";

export abstract class BaseNode {
    protected _label!: string;
    protected _type!: NodeClass;
    protected _input!: Map<Socket, any>;
    protected _output!: Socket[];

    private static idCounter: number = 0;
    
    get label() { return this._label };
    get type() { return this._type };
    get input() { return this._input };
    get output() { return this._output };
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
            socket[0].uId = `n-${this.uId.toString().padStart(4, '0')}-i-${id.toString().padStart(4, '0') }`;
        }
        
        for (const socket of this._output) {
            socket.uId = `n-${this.uId.toString().padStart(4, '0')}-o-${id.toString().padStart(4, '0') }`;
        }
    }

}