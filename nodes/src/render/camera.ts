import { Canvas } from "../core/html-interface/canvas.js";
import { InputEventType } from "../core/input/input-events.js";
import { InputHandler } from "../core/input/input-handler.js";
import { MouseInputType } from "../core/input/input-types.js";
import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "../node/node-defs/base-node.js";
import { Socket } from "../node/types/socket.js";
import { BgStyle, DefaultBgStyle } from "./styles/bg-style.js";
import { DefaultNodeStyle, NodeStyle } from "./styles/node-style.js";
import * as primitives from "./primitives.js"
import { ColorRGB } from "../core/color/color.js";
import { Selectable, SelectableType } from "../core/selectable/selectable.js";
import { NodeLayout } from "../layout/node-layout.js";



export class Camera {
    position: Vector2;
    frustrumWidth: number;
    frustrumHeight: number;
    aspectRatio: number;
    zoom: number;

    private inputHandler: InputHandler;
    private moveCamera: boolean = false;
    private mousePos!: Vector2;

    bg: Canvas;
    board: Canvas;

    bgStyle: BgStyle;
    nodeStyle: NodeStyle;

    public get canvasDimention(): Vector2 {
        return new Vector2(this.bg.element.width, this.bg.element.height);
    }


    constructor(bg: Canvas, board: Canvas, position: Vector2 = new Vector2(0, 0), frustrumWidth: number = 10, zoom: number = 1, bgStyle: BgStyle = {}, nodeStyle: NodeStyle = {}) {
        this.inputHandler = InputHandler.getInstance();

        this.position = position;
        this.frustrumWidth = frustrumWidth;
        this.zoom = zoom;

        this.bg = bg;
        this.board = board;

        this.aspectRatio = bg.element.width / bg.element.height;

        this.frustrumHeight = this.frustrumWidth / this.aspectRatio;

        this.bgStyle = {
            ...DefaultBgStyle,
            ...bgStyle
        }

        this.nodeStyle = {
            ...DefaultNodeStyle,
            ...nodeStyle
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
        this.inputHandler.addEventListener(InputEventType.mousewheel, (e) => {
            switch (e.mouseScroll!) {
                case MouseInputType.scrollUp:
                    this.zoom = this.zoom == 1 ? 1 : this.zoom - 1;
                    break;
                case MouseInputType.scrollDown:
                    this.zoom = this.zoom == 20 ? 20 : this.zoom + 1;
                    break;
            }
        });
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
        const relativeOffset = new Vector2(cameraSpacePosition.x * this.frustrumWidth / 2 * this.zoom, cameraSpacePosition.y * this.frustrumHeight / 2 * this.zoom);
        return new Vector2(this.position.x + relativeOffset.x, this.position.y + relativeOffset.y);
    }

    convertUnitToPixel(unit: number, ignoreZoom: boolean = false): number {
        return unit * this.canvasDimention.x / this.frustrumWidth * (ignoreZoom ? 1 : this.zoom);
    }

    convertPixelToUnit(pixel: number, ignoreZoom: boolean = false): number {
        return pixel * this.frustrumWidth * (ignoreZoom ? 1 : this.zoom) / this.canvasDimention.x;
    }

    realPixelSize(size: number) {
        return size / this.zoom;
    }

    renderBackground(): void {
        this.bg.context.fillStyle = this.bgStyle.bgColor!;
        this.bg.context.fillRect(0, 0, this.bg.element.width, this.bg.element.height);
        const bottomLeftCorner = new Vector2(this.position.x - (this.frustrumWidth * this.zoom / 2), this.position.y - (this.frustrumHeight * this.zoom / 2));

        var linePos = this.bgStyle.offset!.copy();

        const deltaX = bottomLeftCorner.x - linePos.x;
        const deltaY = bottomLeftCorner.y - linePos.y;

        const spacing = this.bgStyle.lineSpacing!.scale(Math.pow(2, Math.floor(this.zoom / 5)))

        const verticalLinesRepetitions = deltaX > 0 ? Math.floor(deltaX / spacing.x) : Math.ceil(deltaX / spacing.x);
        const horizontalLinesRepetitions = deltaY > 0 ? Math.floor(deltaY / spacing.y) : Math.ceil(deltaY / spacing.y);
        linePos.x = linePos.x + spacing.x * verticalLinesRepetitions;
        linePos.y = linePos.y + spacing.y * horizontalLinesRepetitions;

        this.bg.context.lineWidth = this.bgStyle.lineThickness!;
        this.bg.context.strokeStyle = this.bgStyle.lineColor!;

        this.bg.context.beginPath();
        while (linePos.x < this.position.x + this.frustrumWidth * this.zoom) {
            this.bg.context.moveTo(this.convertWorldCoordToRaster(linePos).x, 0);

            this.bg.context.lineTo(this.convertWorldCoordToRaster(linePos).x, this.bg.element.height);
            linePos.x += spacing.x;
        }
        while (linePos.y < this.position.y + this.frustrumHeight * this.zoom) {
            this.bg.context.moveTo(0, this.convertWorldCoordToRaster(linePos).y);
            this.bg.context.lineTo(this.bg.element.width, this.convertWorldCoordToRaster(linePos).y);
            linePos.y += spacing.y;
        }
        this.bg.context.stroke();

    }

    private renderNode(nodeLayout: NodeLayout, selected: boolean = false) {
        this.board.context.fillStyle = this.nodeStyle.bgColor!;

        let rasterPos = this.convertWorldCoordToRaster(nodeLayout.position);
        let rasterDim = new Vector2(this.realPixelSize(nodeLayout.size.x), this.realPixelSize(nodeLayout.size.y))

        this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y)

        this.board.context.fillStyle = this.nodeStyle.headerColors!.get(nodeLayout.node.type)!;
        let headerRasterHeight = this.realPixelSize(nodeLayout.headerHeight);
        this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, headerRasterHeight);

        this.board.context.font = `bold ${this.realPixelSize(this.nodeStyle.fontSize!)}px ${this.nodeStyle.fontFace!}`;
        this.board.context.textBaseline = "middle";
        this.board.context.fillStyle = this.nodeStyle.fontColor!;
        let rasterLabelPos = this.convertWorldCoordToRaster(nodeLayout.labelPos);
        this.board.context.fillText(nodeLayout.node.label, rasterLabelPos.x, rasterLabelPos.y);

        if (selected) {
            this.board.context.strokeStyle = this.bgStyle.activeElementLineColor!;
            this.board.context.lineWidth = this.bgStyle.activeElementLineThickness!;
        } else {
            this.board.context.strokeStyle = this.nodeStyle.borderStyle!;
            this.board.context.lineWidth = this.nodeStyle.borderThickness!;
        }
        this.board.context.strokeRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

        let realSocketRadius = this.realPixelSize(this.nodeStyle.socketRadius!);

        this.board.context.textBaseline = "middle";
        this.board.context.font = `${this.realPixelSize(this.nodeStyle.fontSize!)}px ${this.nodeStyle.fontFace!}`;
        for (const socket of nodeLayout.socketLayouts) {
            let color = new ColorRGB(this.nodeStyle.socketColors!.get(socket[1].socket.type)!);
            
            this.board.context.fillStyle = color.toHex();
            primitives.circle(this.board.context, this.convertWorldCoordToRaster(socket[1].postition), realSocketRadius);
            this.board.context.fill();
            this.board.context.strokeStyle = color.scale(0.6).toHex();
            this.board.context.lineWidth = this.nodeStyle.borderThickness!;
            this.board.context.stroke();
            
            this.board.context.textAlign = socket[1].labelAlign;
            this.board.context.fillStyle = this.nodeStyle.fontColor!;
            let rasterSocketLabelPos = this.convertWorldCoordToRaster(socket[1].labelPostion);
            this.board.context.fillText(socket[1].socket.label, rasterSocketLabelPos.x, rasterSocketLabelPos.y);
        }

    }

    renderNodes(nodes: NodeLayout[]) {
        // var socketPositions: Map<string, [Socket, Vector2]> = new Map();

        for (const node of nodes) {
            this.renderNode(node);
        }
    }

    render(nodes?: NodeLayout[]) {
        // console.log(this.canvasDimention.x / this.frustrumWidth * this.zoom)
        // console.log(this.canvasDimention.y / this.frustrumHeight * this.zoom)

        this.renderBackground();
        this.board.context.fillStyle = "#00000000";
        this.board.context.clearRect(0, 0, this.board.element.width, this.board.element.height);


        if (nodes) {
            this.renderNodes(nodes);
        }

        // this.board.context.fillStyle = "tomato";
        // var tl = this.convertWorldCoordToRaster(new Vector2(-1, 1));
        // var br = this.convertWorldCoordToRaster(new Vector2(1, -1));
        // var w = br.x - tl.x
        // var h = br.y - tl.y
        // this.board.context.fillRect(tl.x, tl.y, w, h);

        // this.board.context.fillStyle = "cyan";

        // let center = this.convertWorldCoordToRaster(new Vector2());
        // this.board.context.font = `${Math.floor(30 / this.zoom)}px Arial`
        // this.board.context.textAlign = "center";
        // this.board.context.fillText("Teste", center.x, center.y);


        // tl = this.convertWorldCoordToRaster(new Vector2(this.inputHandler.mousePos.x - 0.1, this.inputHandler.mousePos.y + 0.1));
        // br = this.convertWorldCoordToRaster(new Vector2(this.inputHandler.mousePos.x + 0.1, this.inputHandler.mousePos.y - 0.1));
        // w = br.x - tl.x
        // h = br.y - tl.y
        // this.board.context.fillRect(tl.x, tl.y, w, h);

    }
}