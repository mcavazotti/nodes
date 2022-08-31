import { GlEnviroment } from "./gl-env";
import { NodeEnviroment } from "./node-env";

export function main() {
    const background = document.getElementById("canvas-bg") as HTMLCanvasElement;
    const bgContext = background.getContext("2d")!;

    const board = document.getElementById("canvas-board") as HTMLCanvasElement;
    const boardContext = board.getContext("2d")!;

    const ui = document.getElementById("canvas-ui") as HTMLCanvasElement;
    const uiContext = ui.getContext("2d")!;

    const input = document.getElementById("canvas-input") as HTMLCanvasElement;
    const inputContext = input.getContext("2d")!;

    const gl = new GlEnviroment("canvas-output");
    const nodes = new NodeEnviroment(
        { element: background, context: bgContext },
        { element: board, context: boardContext },
        { element: ui, context: uiContext },
        { element: input, context: inputContext }, gl.uniforms, (fragShader) => {
            gl.refreshProgram(fragShader);
        });

    nodes.start();

}