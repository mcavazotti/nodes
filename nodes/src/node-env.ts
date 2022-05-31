import { Camera } from "./render/camera.js";
import { Canvas } from "./types/canvas.js";
import { Vector2 } from "./types/vector.js";

export class NodeEnviroment {
    bg: Canvas;
    board: Canvas;
    camera: Camera;

    constructor(bg: Canvas, board: Canvas) {
        this.bg = bg;
        this.board = board;

        if (!(bg.element.width == board.element.width && bg.element.height == board.element.height))
            throw Error("Canvas elements must have the same size!");

        this.camera = new Camera(this.bg, this.board);

        this.camera.renderBackground();
    }
}
