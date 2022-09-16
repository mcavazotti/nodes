import { BaseNode } from "../node/definitions";

interface CompilationData {
    definitions: Map<string, string>;
    visitedNode: Set<string>;
    visiting: Set<string>;
    mainCode: string;
}

function compileShader(nodes: Map<string, BaseNode>, outputId: string, uniforms: string[]): string {

    let data: CompilationData = {
        definitions: new Map(),
        visitedNode: new Set(),
        visiting: new Set(),
        mainCode: ""
    };
    transverseNodes(nodes.get(outputId)!, nodes, data);
    let finalCode = "precision mediump float;\n";

    for (const uniform of uniforms) {
        finalCode += uniform;
        finalCode += "\n";
    }

    for (const definition of data.definitions.values()) {
        finalCode += definition;
        finalCode += "\n";
    }

    finalCode += "void main() {\n" +
        `${data.mainCode}` +
        "}";

    console.log(finalCode)
    return finalCode;
}

function transverseNodes(node: BaseNode, nodes: Map<string, BaseNode>, compilationData: CompilationData) {
    console.log(node.label)
    if (compilationData.visitedNode.has(node.uId))
        return;

    if (compilationData.visiting.has(node.uId))
        throw Error("Cycle detected");

    compilationData.visiting.add(node.uId);

    for (const input of node.input) {
        if (input.conection)
            transverseNodes(nodes.get(getNodeIdFromSocketId(input.conection[0]))!, nodes, compilationData);
    }

    for (const definition of node.definitions()) {
        if (!compilationData.definitions.has(definition[0])) {
            compilationData.definitions.set(definition[0], definition[1]);
        }
    }

    compilationData.visiting.delete(node.uId);
    compilationData.visitedNode.add(node.uId);
    compilationData.mainCode += node.code();
}

function getNodeIdFromSocketId(id: string): string {
    return id.match(/(n-\d{4})/)![0];
}

export { compileShader, transverseNodes, CompilationData };