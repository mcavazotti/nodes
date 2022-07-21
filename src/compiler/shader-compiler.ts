import { BaseNode } from "../node/definitions";

function compileShader(nodes: Map<string, BaseNode>, outputId: string): string {
    return `
    void main() {
        gl_FragColor = vec4(0.9,0.2,0.5,1.0);
    }
    `;
}

export {compileShader};