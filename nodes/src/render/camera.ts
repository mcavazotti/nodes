import { Canvas } from "../core/html-interface/canvas.js";
import { InputEventType } from "../core/input/input-events.js";
import { InputHandler } from "../core/input/input-handler.js";
import { InputState } from "../core/input/input-state.js";
import { MouseInputType } from "../core/input/input-types.js";
import { Vector2 } from "../core/math/vector.js";

export interface CameraBGOptions {
    bgColor?: string,
    lineColor?: string,
    lineThickness?: number,
    lineSpacing?: Vector2,
    offset?: Vector2
}

export class Camera {
    position: Vector2;
    frustrumWidth: number;
    frustrumHeight: number;
    aspectRatio: number;
    zoom: number;

    private inputHandler: InputHandler;
    private moveCamera: boolean = false;
    private mousePos!: Vector2;

    bgOptions: CameraBGOptions;

    bg: Canvas;
    board: Canvas;


    public get canvasDimention(): Vector2 {
        return new Vector2(this.bg.element.width, this.bg.element.height);
    }


    constructor(bg: Canvas, board: Canvas, position: Vector2 = new Vector2(0, 0), frustrumWidth: number = 10, zoom: number = 1, bgOpts: CameraBGOptions = {}) {
        this.inputHandler = InputHandler.getInstance();

        this.position = position;
        this.frustrumWidth = frustrumWidth;
        this.zoom = zoom;

        this.bg = bg;
        this.board = board;

        this.aspectRatio = bg.element.width / bg.element.height;

        this.frustrumHeight = this.frustrumWidth / this.aspectRatio;

        this.bgOptions = {
            bgColor: "#5d667a",
            lineColor: "#00000044",
            lineThickness: 1,
            lineSpacing: new Vector2(1, 1),
            offset: new Vector2(0, 0),
            ...bgOpts
        }

        this.inputHandler.addEventListener(InputEventType.mousedown, (e) => {
            // console.log(e);
            this.moveCamera = e.mouseButtonDown!.indexOf(MouseInputType.leftButton) != -1;
            this.mousePos = e.mousePosition!;
        });
        this.inputHandler.addEventListener(InputEventType.mouseup, (e) => {
            // console.log(e);
            this.moveCamera = e.mouseButtonDown!.indexOf(MouseInputType.leftButton) != -1;
        });
        this.inputHandler.addEventListener(InputEventType.mousemove, (e) => {
            if (this.moveCamera) {
                this.position = this.position.sub(e.mousePosition!.sub(this.mousePos));
                // console.log(e.mouseMovement);
                // console.log(this.position);
            }
        })
    }

    convertWorldCoordToRaster(vec: Vector2): Vector2 {
        const relativeOffset = vec.sub(this.position);
        const cameraSpacePosition = relativeOffset.div(new Vector2(this.frustrumWidth * this.zoom, this.frustrumHeight * this.zoom));
        const canvasCenter = this.canvasDimention.scale(0.5);
        const rasterOffset = cameraSpacePosition.mult(this.canvasDimention);
        const rasterCoord = new Vector2(canvasCenter.x + rasterOffset.x, canvasCenter.y - rasterOffset.y);

        return rasterCoord;
    }

    convertRasterCoordToWorld(vec: Vector2): Vector2 {
        const cameraSpacePosition = new Vector2((vec.x - this.canvasDimention.x / 2) / (this.canvasDimention.x / 2), -(vec.y - this.canvasDimention.y / 2) / (this.canvasDimention.y / 2));
        const relativeOffset = new Vector2(cameraSpacePosition.x * this.frustrumWidth/2 * this.zoom, cameraSpacePosition.y * this.frustrumHeight/2 * this.zoom);
        return new Vector2(this.position.x + relativeOffset.x, this.position.y + relativeOffset.y);
    }

    renderBackground(): void {
        this.bg.context.fillStyle = this.bgOptions.bgColor!;
        this.bg.context.fillRect(0, 0, this.bg.element.width, this.bg.element.height);
        const topLeftCorner = new Vector2(this.position.x - (this.frustrumWidth * this.zoom / 2), this.position.y + (this.frustrumHeight * this.zoom / 2));

        var linePos = this.bgOptions.offset!.copy();

        const deltaX = topLeftCorner.x - linePos.x;
        const deltaY = topLeftCorner.x - linePos.y;
        const verticalLinesRepetitions = deltaX > 0 ? Math.floor(deltaX / this.bgOptions.lineSpacing!.x) : Math.ceil(deltaX / this.bgOptions.lineSpacing!.x);
        const horizontalLinesRepetitions = deltaY > 0 ? Math.floor(deltaY / this.bgOptions.lineSpacing!.y) : Math.ceil(deltaY / this.bgOptions.lineSpacing!.y);
        linePos.x = linePos.x + this.bgOptions.lineSpacing!.x * verticalLinesRepetitions;
        linePos.y = linePos.y + this.bgOptions.lineSpacing!.y * horizontalLinesRepetitions;

        this.bg.context.lineWidth = this.bgOptions.lineThickness!;
        this.bg.context.strokeStyle = this.bgOptions.lineColor!;

        this.bg.context.beginPath();
        while (linePos.x < this.position.x + this.frustrumWidth) {
            this.bg.context.moveTo(this.convertWorldCoordToRaster(linePos).x, 0);
            this.bg.context.lineTo(this.convertWorldCoordToRaster(linePos).x, this.bg.element.height);
            linePos.x += this.bgOptions.lineSpacing!.x;
        }
        while (linePos.y < this.position.y + this.frustrumHeight) {
            this.bg.context.moveTo(0, this.convertWorldCoordToRaster(linePos).y);
            this.bg.context.lineTo(this.bg.element.width, this.convertWorldCoordToRaster(linePos).y);
            linePos.y += this.bgOptions.lineSpacing!.y;
        }
        this.bg.context.stroke();

    }

    render() {
        this.renderBackground();
        
        this.board.context.fillStyle = "#00000000";
        this.board.context.clearRect(0, 0, this.board.element.width, this.board.element.height);
        this.board.context.fillStyle = "tomato";
        var tl = this.convertWorldCoordToRaster(new Vector2(-1, 1));
        var br = this.convertWorldCoordToRaster(new Vector2(1, -1));
        var w = br.x - tl.x
        var h = br.y - tl.y
        this.board.context.fillRect(tl.x, tl.y, w,h );
        
        this.board.context.fillStyle = "cyan";

        tl = this.convertWorldCoordToRaster(new Vector2(this.inputHandler.mousePos.x-0.1, this.inputHandler.mousePos.y+0.1));
        br = this.convertWorldCoordToRaster(new Vector2(this.inputHandler.mousePos.x + 0.1, this.inputHandler.mousePos.y - 0.1));
        w = br.x - tl.x
        h = br.y - tl.y
        this.board.context.fillRect(tl.x, tl.y, w, h);

    }
}