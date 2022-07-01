import { Vector2 } from "../../core/math/vector.js";
import { NodeSelectable, SelectableType } from "../../core/selectable/selectable.js";
import { NodeClass } from "../types/node-classes.js";
import { Socket } from "../types/socket.js";

export abstract class BaseNode implements NodeSelectable {
    protected _label!: string;
    protected _type!: NodeClass;
    protected _input!: Map<Socket, any>;
    protected _output!: Socket[];
    
    readonly selectableType: SelectableType= SelectableType.node;
    topLeft: Vector2;
    bottonRight: Vector2;

    get label() { return this._label };
    get type() { return this._type };
    get input() { return this._input };
    get output() { return this._output };

    position: Vector2;

    constructor(pos: Vector2) {
        this.position = pos;
        this.topLeft = this.bottonRight = pos;
    }

    hit(pos: Vector2): boolean {
        if (this.topLeft && this.bottonRight)
            return (pos.x >= this.topLeft.x) && (pos.x <= this.bottonRight.x) && (pos.y <= this.topLeft.y) && (pos.y >= this.bottonRight.y);
        else return false;
    }
}