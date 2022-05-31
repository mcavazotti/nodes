import { NodeEnviroment } from "./node-env.js";
export function main() {
    const background = document.getElementById("canvas-bg");
    const bgContext = background.getContext("2d");
    const board = document.getElementById("canvas-board");
    const boardContext = board.getContext("2d");
    const nodes = new NodeEnviroment({ element: background, context: bgContext }, { element: board, context: boardContext });
}
//# sourceMappingURL=main.js.map