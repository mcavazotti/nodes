import { Camera } from "./render/camera.js";
import { Vector2 } from "./types/vector.js";
export class NodeEnviroment {
    constructor(bg, board) {
        this.bg = bg;
        this.board = board;
        if (!(bg.element.width == board.element.width && bg.element.height == board.element.height))
            throw Error("Canvas elements must have the same size!");
        this.camera = new Camera(this.bg, this.board);
        this.camera.renderBackground();
        this.board.element.addEventListener("mousemove", (event) => {
            console.log(event);
            let vec = new Vector2(event.x, event.y);
            console.log(this.camera.convertRasterCoordToWorld(vec));
        });
    }
}
//# sourceMappingURL=node-env.js.map