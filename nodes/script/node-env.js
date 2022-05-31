import { Camera } from "./render/camera.js";
export class NodeEnviroment {
    constructor(bg, board) {
        this.bg = bg;
        this.board = board;
        if (!(bg.element.width == board.element.width && bg.element.height == board.element.height))
            throw Error("Canvas elements must have the same size!");
        this.camera = new Camera(this.bg, this.board);
        this.camera.renderBackground();
    }
}
//# sourceMappingURL=node-env.js.map