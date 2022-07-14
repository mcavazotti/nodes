import { Vector2 } from "../core/math/vector";
import { BaseNode, CoordinateNode, OutputNode } from "./definitions";

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

    moveNodeToFront(node: BaseNode, idx?: number) {
        if (idx === undefined) {
            idx = this._nodes.indexOf(node);
        }
        this._nodes.splice(idx, 1);
        this._nodes.push(node);
        console.log(this._nodes.map((n) => n.label))
    }

}