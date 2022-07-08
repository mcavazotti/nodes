import { Canvas } from "../core/html-interface/canvas.js";
import { InputHandler } from "../input/input-handler.js";
import { Vector2 } from "../core/math/vector.js";
import { BgStyle, DefaultBgStyle } from "./styles/bg-style.js";
import { DefaultNodeStyle, NodeStyle } from "./styles/node-style.js";
import * as primitives from "./primitives.js"
import { ColorRGB } from "../core/color/color.js";
import { NodeElement } from "../layout/layout-elements.js";
import { Context } from "../context/context-manager.js";
import { InputElement } from "../layout/elements/base-input-element.js";
import { SocketType } from "../node/types/socket-types.js";
import { ColorInputElement } from "../layout/elements/color-input-element.js";



export class Camera {
    position: Vector2;
    frustrumWidth: number;
    frustrumHeight: number;
    aspectRatio: number;
    zoom: number;

    bg: Canvas;
    board: Canvas;

    bgStyle: BgStyle;
    nodeStyle: NodeStyle;

    public get canvasDimention(): Vector2 {
        return new Vector2(this.bg.element.width, this.bg.element.height);
    }


    constructor(bg: Canvas, board: Canvas, position: Vector2 = new Vector2(0, 0), frustrumWidth: number = 10, zoom: number = 1, bgStyle: BgStyle = {}, nodeStyle: NodeStyle = {}) {

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

    private renderNode(nodeLayout: NodeElement, selected: boolean = false) {
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
        let rasterLabelPos = this.convertWorldCoordToRaster(nodeLayout.labelPosition);
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
            primitives.circle(this.board.context, this.convertWorldCoordToRaster(socket[1].position), realSocketRadius);
            this.board.context.fill();
            this.board.context.strokeStyle = color.scale(0.6).toHex();
            this.board.context.lineWidth = this.nodeStyle.borderThickness!;
            this.board.context.stroke();

            this.board.context.textAlign = socket[1].labelAlign;
            this.board.context.fillStyle = this.nodeStyle.fontColor!;
            let rasterSocketLabelPos = this.convertWorldCoordToRaster(socket[1].labelPosition);
            this.board.context.fillText(socket[1].socket.label, rasterSocketLabelPos.x, rasterSocketLabelPos.y);
            if (socket[1].input) {
                this.renderInput(socket[1].input, socket[1].socket.type);
            }
        }

    }

    renderNodes(nodes: NodeElement[], context?: Context) {
        // var socketPositions: Map<string, [Socket, Vector2]> = new Map();

        for (const node of nodes) {
            let selected = (!!context && context.activeElement?.id == node.id);
            this.renderNode(node, selected);
        }
    }

    renderInput(input: InputElement<any>, type: SocketType) {
        switch (type) {
            case SocketType.color: {

                let colorInput = input as ColorInputElement;
                this.board.context.fillStyle = colorInput.value.toHex();

                let rasterPos = this.convertWorldCoordToRaster(colorInput.position);
                let rasterDim = new Vector2(this.realPixelSize(colorInput.size.x), this.realPixelSize(colorInput.size.y));
                this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

                this.board.context.strokeStyle = this.nodeStyle.borderStyle!;
                this.board.context.lineWidth = this.nodeStyle.borderThickness!;
                this.board.context.strokeRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
            }
                break;
        }
    }

    renderLayout(nodes: NodeElement[]) {
        this.board.context.fillStyle = "#45bbffaa";
        for (const node of nodes) {
            let rasterPos = this.convertWorldCoordToRaster(node.position);
            let rasterDim = new Vector2(this.realPixelSize(node.size.x), this.realPixelSize(node.size.y))
            this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
        }

        this.board.context.fillStyle = "#ffc745aa";
        for (const node of nodes) {
            for (const socket of node.socketLayouts) {
                let rasterPos = this.convertWorldCoordToRaster(socket[1].topLeft);

                let rasterDim = new Vector2(this.realPixelSize(socket[1].size.x), this.realPixelSize(socket[1].size.y))
                this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
            }
        }
    }

    render(nodes?: NodeElement[], context?: Context) {
        // console.log(nodes?.length)
        // console.log(this.canvasDimention.y / this.frustrumHeight * this.zoom)

        this.renderBackground();
        this.board.context.fillStyle = "#00000000";
        this.board.context.clearRect(0, 0, this.board.element.width, this.board.element.height);


        if (nodes) {
            this.renderNodes(nodes, context);
            // this.renderLayout(nodes);
        }

    }
}