import { Vector2 } from "../core/math/vector";
import { BaseNode, CoordinateNode, OutputNode } from "./definitions";
import { Socket } from "./types/socket";

export class NodeEngine{
    
    static instance: NodeEngine;
    private _nodes: BaseNode[];
    get nodes(): BaseNode[] {
        return [...this._nodes];
    } 

    private constructor() {
        this._nodes = [new OutputNode(new Vector2()), new CoordinateNode(new Vector2(-3,0))]
    }

    static getInstance(): NodeEngine {
        if(!NodeEngine.instance) {
            NodeEngine.instance = new NodeEngine();
        }
        return NodeEngine.instance;
    }

    // TODO: this method shouldn't be here
    moveNodeToFront(node: BaseNode, idx?: number) {
        if (idx === undefined) {
            idx = this._nodes.indexOf(node);
        }
        this._nodes.splice(idx, 1);
        this._nodes.push(node);
        // console.log(this._nodes.map((n) => n.label))
    }


    createConnection(socket1: Socket<any>, socket2: Socket<any>) {
        if(socket1.role == socket2.role){
            throw new Error("Can't connect sockets with same role (input/output)");
        }
        let output: Socket<any>;
        let input: Socket<any>;
        if(socket1.role == "input") {
            input = socket1;
            output = socket2;
        } else {
            input = socket2;
            output = socket1;
        }

        // TODO: check socket types
        input.conection = output.uId!;
    }

}