import { CompilationData, compileShader, transverseNodes } from "../compiler/shader-compiler";
import { Vector2 } from "../core/math/vector";
import { BaseNode, OutputNode, } from "./definitions";
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

    private uniforms: string[] = [];

    setListener(func: ((fs: string) => void)) {
        this.onCompileListener = func;
        this.compile();
    }

    setUniforms(uniforms: string[]) {
        this.uniforms = uniforms;
    }

    private constructor() {
        this.outputNode = new OutputNode(new Vector2(2,0));
        this._nodes.set(this.outputNode.uId, this.outputNode);


        this._nodeArray.push(this.outputNode);

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
        input.conection = [output.uId!, output.type];
        try {
            let data: CompilationData = {
                definitions: new Map(),
                visitedNode: new Set(),
                visiting: new Set(),
                mainCode: ""
            };
            let id = output.uId!.match(/.*(?=-o-)/)![0];
            let node = this._nodes.get(id)!;
            transverseNodes(node, this._nodes, data);
            this.compile();
        } catch (e) {
            input.conection = null;
            console.error(e);
        }
    }

    removeConnection(socket: Socket<any>) {
        socket.conection = null;
        this.compile();
    }

    createNode(node:BaseNode) {
        this._nodes.set(node.uId,node);
        this._nodeArray.push(node);
    }

    deleteNode(id: string): boolean {
        if (id == this.outputNode.uId)
            return false;

        for (let node of this._nodes.values()) {
            for (let socket of node.input) {
                if (socket.conection != null && socket.conection[0].match(/.*(?=-o-)/)![0] == id)
                    socket.conection = null;
            }
        }
        this._nodes.delete(id);
        this._nodeArray = this._nodeArray.filter((n) => n.uId != id);
        this.compile();
        return true;
    }

    compile() {
        if (this.onCompileListener) {
            this.onCompileListener(compileShader(this._nodes, this.outputNode.uId, this.uniforms));
        }
    }


}