import { Camera } from "./render/camera.js";
import { Vector2 } from "./core/math/vector.js";
import { InputHandler } from "./core/input/input-handler.js";
import { MouseInputType } from "./core/input/input-types.js";
export class NodeEnviroment {
    constructor(bg, board, input) {
        this.inputHandler = InputHandler.getInstance();
        this.bg = bg;
        this.board = board;
        this.input = input;
        if (!(bg.element.width == board.element.width && bg.element.height == board.element.height))
            throw Error("Canvas elements must have the same size!");
        this.camera = new Camera(this.bg, this.board);
    }
    start() {
        this.camera.render();
        this.input.element.addEventListener("mousemove", (event) => {
            let vec = new Vector2(event.x, event.y);
            let transformedVec = this.camera.convertRasterCoordToWorld(vec);
            // console.log("new")
            console.log(transformedVec);
            this.inputHandler.setState({ mousePosition: transformedVec });
            this.camera.render();
        });
        this.input.element.addEventListener("mousedown", (event) => {
            var mouseButton = null;
            switch (event.button) {
                case 0:
                    mouseButton = MouseInputType.leftButton;
                    break;
                case 1:
                    mouseButton = MouseInputType.middleButton;
                    break;
                case 2:
                    mouseButton = MouseInputType.rightButton;
                    break;
                default:
                    break;
            }
            if (mouseButton != null)
                this.inputHandler.setState({ mouseButtonDown: [mouseButton] });
        });
        this.input.element.addEventListener("mouseup", (event) => {
            var mouseButton = null;
            switch (event.button) {
                case 0:
                    mouseButton = MouseInputType.leftButton;
                    break;
                case 1:
                    mouseButton = MouseInputType.middleButton;
                    break;
                case 2:
                    mouseButton = MouseInputType.rightButton;
                    break;
                default:
                    break;
            }
            if (mouseButton != null)
                this.inputHandler.setState({ mouseButtonUp: [mouseButton] });
        });
    }
}
//# sourceMappingURL=node-env.js.map