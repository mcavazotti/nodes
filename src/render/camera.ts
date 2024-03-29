import { Canvas } from "../core/html-interface/canvas";
import { Vector, Vector2 } from "../core/math/vector";
import { BgStyle, DefaultBgStyle } from "./styles/bg-style";
import { DefaultNodeStyle, NodeStyle } from "./styles/node-style";
import * as primitives from "./primitives"
import { ColorRGB } from "../core/color/color";
import { NodeElement } from "../layout/layout-elements";
import { SocketInputElement } from "../layout/elements/base-input-element";
import { SocketType } from "../node/types/socket-types";
import { ColorInputElement } from "../layout/elements/color-input-element";
import { LayoutData } from "../layout/layout-data";
import { ContextData } from "../context/context-data";
import { VectorInputElement } from "../layout/elements/vector-input-element";
import { NumberInputElement } from "../layout/elements/number-input-element";


/**
 * Class responsible for drawing on the canvas and converting coordinates between world space and raster space
 */
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

    /**
     * 
     * @param bg Background canvas layer
     * @param board Board canvas layer
     * @param position Camera position
     * @param frustrumWidth Camera's frustrum width
     * @param zoom Zoom level
     * @param bgStyle Custom background style
     * @param nodeStyle Custom node style
     */
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

    /**
     * Converts world space lenght to pixel length
     * 
     * @param unit Length in world space units
     * @param ignoreZoom 
     * @returns Length in pixels (scaled to zoom or not)
     */
    convertUnitToPixel(unit: number, ignoreZoom: boolean = false): number {
        return unit * this.canvasDimention.x / this.frustrumWidth * (ignoreZoom ? 1 : this.zoom);
    }

    /**
     * Converts pixel length to world units
     * 
     * @param pixel Length in pixels
     * @param ignoreZoom 
     * @returns Length in world units (scaled to zoom or not)
     */
    convertPixelToUnit(pixel: number, ignoreZoom: boolean = false): number {
        return pixel * this.frustrumWidth * (ignoreZoom ? 1 : this.zoom) / this.canvasDimention.x;
    }

    /**
     * Scales pixel length to zoom
     * 
     * @param size Pixel length
     * @returns Real pixel length after applying zoom
     */
    realPixelSize(size: number) {
        return size / this.zoom;
    }

    /**
     * Renders background on the background layer canvas
     */
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

    /**
     * Draws a single node on the board layer
     * 
     * @param nodeLayout 
     * @param selected Flag to draw highlight
     */
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
        this.board.context.textAlign = "left";
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
            this.board.context.strokeStyle = color.scale(0.6).toHex();
            this.board.context.lineWidth = this.nodeStyle.borderThickness!;
            primitives.circle(this.board.context, this.convertWorldCoordToRaster(socket[1].position), realSocketRadius);
            this.board.context.fill();
            this.board.context.stroke();

            this.board.context.textAlign = socket[1].labelAlign;
            this.board.context.fillStyle = this.nodeStyle.fontColor!;
            let rasterSocketLabelPos = this.convertWorldCoordToRaster(socket[1].labelPosition);
            this.board.context.fillText(socket[1].socket.label, rasterSocketLabelPos.x, rasterSocketLabelPos.y);
            if (socket[1].input) {
                this.renderInput(socket[1].input, socket[1].socket.type);
                this.board.context.font = `${this.realPixelSize(this.nodeStyle.fontSize!)}px ${this.nodeStyle.fontFace!}`;
            }
        }

        this.board.context.lineWidth = this.nodeStyle.borderThickness!;
        this.board.context.strokeStyle = this.nodeStyle.innerBorderStyle!;
        for (const parameter of nodeLayout.parameterLayouts) {
            this.board.context.textBaseline = "middle";
            this.board.context.font = `${this.realPixelSize(this.nodeStyle.fontSize!)}px ${this.nodeStyle.fontFace!}`;
            this.board.context.textAlign = "left";
            let rasterLabelPos = this.convertWorldCoordToRaster(parameter.labelPosition);
            this.board.context.fillText(parameter.parameter.label, rasterLabelPos.x, rasterLabelPos.y);

            let rasterPos = this.convertWorldCoordToRaster(parameter.position);
            let rasterDim = new Vector2(this.realPixelSize(parameter.size.x), this.realPixelSize(parameter.size.y));

            this.board.context.fillStyle = this.nodeStyle.innerBgColor!;
            this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
            this.board.context.strokeRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

            this.board.context.font = `normal ${this.realPixelSize(this.nodeStyle.fontSize! * 0.8)}px ${this.nodeStyle.fontFace!}`;
            this.board.context.textBaseline = "middle";
            this.board.context.fillStyle = this.nodeStyle.fontColor!;
            this.board.context.textAlign = "center";


            let rasterNumberPos = new Vector2(rasterPos.x + rasterDim.x / 2, rasterPos.y + rasterDim.y / 2);

            let value = parameter.parameter.value!;
            this.board.context.fillText(value.toString(), rasterNumberPos.x, rasterNumberPos.y);
        }
    }

    /**
     * Draws all the nodes on the board layer. It's a wrapper function for `renderNode`
     * 
     * @param nodes List of node elements
     * @param context ContextData used to find selected node, if any
     */
    renderNodes(nodes: NodeElement[], context?: ContextData) {
        // var socketPositions: Map<string, [Socket, Vector2]> = new Map();

        for (const node of nodes) {
            let selected = (!!context && context.activeElement?.id == node.id);
            this.renderNode(node, selected);
        }
    }

    /**
     * Draws connections between sockets on the board layer
     * 
     * @param connections List of tuples that represents the position of the connected sockets
     */
    renderConnections(connections: [Vector2, Vector2][]) {
        for (const connection of connections) {
            this.board.context.strokeStyle = this.nodeStyle.connectionColor!;
            this.board.context.lineWidth = this.nodeStyle.connectionThickness!;
            let middlePoint1: Vector2;
            let middlePoint2: Vector2;

            if (connection[0].sub(connection[1]).length < this.nodeStyle.connectionControlPointOffset!) {
                middlePoint1 = connection[0];
                middlePoint2 = connection[1];
            }
            else {
                middlePoint1 = connection[0].add(new Vector2(this.nodeStyle.connectionControlPointOffset!, 0));
                middlePoint2 = connection[1].add(new Vector2(-this.nodeStyle.connectionControlPointOffset!, 0));
            }

            let controlPoints: [Vector2, Vector2, Vector2, Vector2] = [
                this.convertWorldCoordToRaster(connection[0]),
                this.convertWorldCoordToRaster(middlePoint1),
                this.convertWorldCoordToRaster(middlePoint2),
                this.convertWorldCoordToRaster(connection[1]),
            ];
            primitives.cubicBelzier(this.board.context, controlPoints);
            this.board.context.stroke();
        }
    }

    /**
     * Draws the input element on the board layer.
     * 
     * It should aways draw over the nodes.
     * 
     * @param input Input element. It's specific type is infered based on the next parameter
     * @param type Type of input
     */
    renderInput(input: SocketInputElement<any>, type: SocketType) {
        switch (type) {
            case SocketType.color: {

                let colorInput = input as ColorInputElement;
                this.board.context.fillStyle = colorInput.value.toHex();

                let rasterPos = this.convertWorldCoordToRaster(colorInput.position);
                let rasterDim = new Vector2(this.realPixelSize(colorInput.size.x), this.realPixelSize(colorInput.size.y));
                this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

                this.board.context.strokeStyle = this.nodeStyle.innerBorderStyle!;
                this.board.context.lineWidth = this.nodeStyle.borderThickness!;
                this.board.context.strokeRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
            }
                break;
            case SocketType.float: {
                let numberInput = input as NumberInputElement;
                this.board.context.strokeStyle = this.nodeStyle.innerBorderStyle!;
                this.board.context.lineWidth = this.nodeStyle.borderThickness!;

                let rasterPos = this.convertWorldCoordToRaster(numberInput.position);
                let rasterDim = new Vector2(this.realPixelSize(numberInput.size.x), this.realPixelSize(numberInput.size.y));

                this.board.context.fillStyle = this.nodeStyle.innerBgColor!;
                this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
                this.board.context.strokeRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

                this.board.context.font = `normal ${this.realPixelSize(this.nodeStyle.fontSize! * 0.8)}px ${this.nodeStyle.fontFace!}`;
                this.board.context.textBaseline = "middle";
                this.board.context.fillStyle = this.nodeStyle.fontColor!;
                this.board.context.textAlign = "center";


                let rasterNumberPos = new Vector2(rasterPos.x + rasterDim.x / 2, rasterPos.y + rasterDim.y / 2);

                let value = numberInput.parent.socket.value!;
                this.board.context.fillText(value.toString(), rasterNumberPos.x, rasterNumberPos.y);
            }
                break;
            case SocketType.vector2:
            case SocketType.vector3:
            case SocketType.vector4: {
                let vectorInput = input as VectorInputElement<Vector>;
                this.board.context.strokeStyle = this.nodeStyle.innerBorderStyle!;
                this.board.context.lineWidth = this.nodeStyle.borderThickness!;

                let rasterPos = this.convertWorldCoordToRaster(vectorInput.position);
                let rasterDim = new Vector2(this.realPixelSize(vectorInput.size.x), this.realPixelSize(vectorInput.size.y));

                this.board.context.fillStyle = this.nodeStyle.innerBgColor!;
                this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

                this.board.context.beginPath();
                this.board.context.moveTo(rasterPos.x, rasterPos.y);
                this.board.context.lineTo(rasterPos.x + rasterDim.x, rasterPos.y);
                this.board.context.lineTo(rasterPos.x + rasterDim.x, rasterPos.y + rasterDim.y);
                this.board.context.lineTo(rasterPos.x, rasterPos.y + rasterDim.y);
                this.board.context.closePath();

                for (let i = 0; i < vectorInput.value.size; i++) {
                    this.board.context.moveTo(rasterPos.x, rasterPos.y + (rasterDim.y / vectorInput.value.size) * i);
                    this.board.context.lineTo(rasterPos.x + rasterDim.x, rasterPos.y + (rasterDim.y / vectorInput.value.size) * i);
                }
                this.board.context.stroke();

                this.board.context.font = `normal ${this.realPixelSize(this.nodeStyle.fontSize! * 0.8)}px ${this.nodeStyle.fontFace!}`;
                this.board.context.textBaseline = "middle";
                this.board.context.fillStyle = this.nodeStyle.fontColor!;
                this.board.context.textAlign = "center";

                for (let i = 0; i < vectorInput.value.size; i++) {
                    let value = vectorInput.value.v[i];
                    let rasterNumberPos = new Vector2(rasterPos.x + rasterDim.x / 2, rasterPos.y + (rasterDim.y / (vectorInput.value.size * 2)) * (i * 2 + 1));

                    this.board.context.fillText(value.toString(), rasterNumberPos.x, rasterNumberPos.y);
                }


            }
                break;
        }
    }


    /**
     * Draws semitransparent layout boxes. Used for debugging purposes
     * 
     * @param nodes List of node elements
     */
    renderLayout(nodes: NodeElement[]) {
        this.board.context.fillStyle = "#45bbffaa";
        for (const node of nodes) {
            let rasterPos = this.convertWorldCoordToRaster(node.position);
            let rasterDim = new Vector2(this.realPixelSize(node.size.x), this.realPixelSize(node.size.y));
            this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);
        }

        for (const node of nodes) {
            for (const socket of node.socketLayouts) {
                this.board.context.fillStyle = "#ffc745aa";
                let socketElement = socket[1];
                let rasterPos = this.convertWorldCoordToRaster(socketElement.topLeft);
                let rasterDim = new Vector2(this.realPixelSize(socketElement.size.x), this.realPixelSize(socketElement.size.y));
                this.board.context.fillRect(rasterPos.x, rasterPos.y, rasterDim.x, rasterDim.y);

                if (socketElement.input) {
                    let input = socketElement.input;

                    let inputRasterPos = this.convertWorldCoordToRaster(input.position);
                    let inputRasterSize = new Vector2(this.realPixelSize(input.size.x), this.realPixelSize(input.size.y));
                    this.board.context.fillRect(inputRasterPos.x, inputRasterPos.y, inputRasterSize.x, inputRasterSize.y);
                }
            }
        }
    }

    /**
     * Renders the node editor, its UI and its board
     * @param layout
     * @param context 
     */
    render(layout: LayoutData, context?: ContextData) {

        this.renderBackground();
        this.board.context.fillStyle = "#00000000";
        this.board.context.clearRect(0, 0, this.board.element.width, this.board.element.height);

        if (layout.connections) {
            this.renderConnections(layout.connections);
        }
        if (layout.nodes) {
            this.renderNodes(layout.nodes, context);
            // this.renderLayout(layout.nodes);
        }
        if (layout.newConnection && context) {
            this.renderConnections([[layout.newConnection[0] ?? context.pointerPosition, layout.newConnection[1] ?? context.pointerPosition]])
        }

    }
}