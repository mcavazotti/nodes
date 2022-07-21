import { compileShader } from "../compiler/shader-compiler";
import { Vector2 } from "../core/math/vector";
import { BaseNode, CoordinateNode, OutputNode } from "./definitions";
import { Socket } from "./types/socket";

export class NodeEngine {

    static instance: NodeEngine;

    private onCompileListener?: ((fs: string) => void);
    private _nodes: Map<string, BaseNode> = new Map();
    private _nodeArray: BaseNode[] = [];
    private outputNode: OutputNode;
    get nodes(): BaseNode[] {
        return [...this._nodeArray];
    }

    setListener(func: ((fs: string) => void)) {
        this.onCompileListener = func;
        this.compile();
    }

    private constructor() {
        this.outputNode = new OutputNode(new Vector2());
        this._nodes.set(this.outputNode.uId, this.outputNode);
        let coord = new CoordinateNode(new Vector2(-3, 0));
        this._nodes.set(coord.uId, coord);
        this._nodeArray.push(this.outputNode, coord);
        
    }

    static getInstance(): NodeEngine {
        if (!NodeEngine.instance) {
            NodeEngine.instance = new NodeEngine();
        }
        return NodeEngine.instance;
    }

    // TODO: this method shouldn't be here
    moveNodeToFront(node: BaseNode, idx?: number) {
        if (idx === undefined) {
            idx = this._nodeArray.indexOf(node);
        }
        this._nodeArray.splice(idx, 1);
        this._nodeArray.push(node);
        // console.log(this._nodes.map((n) => n.label))
    }


    createConnection(socket1: Socket<any>, socket2: Socket<any>) {
        if (socket1.role == socket2.role) {
            throw new Error("Can't connect sockets with same role (input/output)");
        }
        let output: Socket<any>;
        let input: Socket<any>;
        if (socket1.role == "input") {
            input = socket1;
            output = socket2;
        } else {
            input = socket2;
            output = socket1;
        }

        // TODO: check socket types
        input.conection = output.uId!;
        this.compile();
    }

    removeConnection(socket: Socket<any>) {
        socket.conection = null;
        this.compile();
    }

    compile() {
        if (this.onCompileListener) {
            this.onCompileListener(compileShader(this._nodes, this.outputNode.uId));
        }
    }


}