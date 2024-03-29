import { Canvas } from "../core/html-interface/canvas";
import { Vector2, Vector3, Vector4 } from "../core/math/vector";
import { BaseNode } from "../node/definitions";
import { NodeEngine } from "../node/node-engine";
import { SocketType } from "../node/types/socket-types";
import { Camera } from "../render/camera";
import { SocketInputElement } from "./elements/base-input-element";
import { ColorInputElement } from "./elements/color-input-element";
import { LayoutElementTypes } from "./elements/element-types";
import { NumberInputElement } from "./elements/number-input-element";
import { ParameterElement } from "./elements/parameter-element";
import { VectorInputElement } from "./elements/vector-input-element";
import { LayoutData } from "./layout-data";
import { NodeElement, SocketElement } from "./layout-elements";



export class LayoutManager {
    private static instance: LayoutManager;
    private activeCamera: Camera | null = null;

    private engine: NodeEngine;

    private canvas: Canvas;

    private nodeElements: NodeElement[] = [];
    private socketElements: Map<string, SocketElement> = new Map();
    private connections: [Vector2, Vector2][] = [];
    private newConnection: [Vector2 | null, Vector2 | null] | null = null;

    private constructor() {
        let canvasElement = document.createElement("canvas");
        let canvasContext = canvasElement.getContext("2d")!;

        this.canvas = { element: canvasElement, context: canvasContext };

        this.engine = NodeEngine.getInstance();
    }

    public static getInstance(activeCamera?: Camera): LayoutManager {
        if (!LayoutManager.instance) {
            LayoutManager.instance = new LayoutManager();
        }
        if (activeCamera) {
            LayoutManager.instance.activeCamera = activeCamera;
        }
        return LayoutManager.instance;
    }

    getLayout(): LayoutData {
        // console.log(this.nodeElements.length)
        return {
            nodes: [...this.nodeElements],
            connections: this.connections,
            newConnection: this.newConnection,
            sockets: this.socketElements,

            // ui: [],
        };
    }

    moveNodeToFront(node: NodeElement, idx?: number) {
        if (idx === undefined) {
            idx = this.nodeElements.indexOf(node);
        }
        this.nodeElements.splice(idx, 1);
        this.nodeElements.push(node);
        this.engine.moveNodeToFront(node.node);
    }
    setActiveCamera(camera: Camera) {
        this.activeCamera = camera;
    }

    generateLayout(nodes?: BaseNode[], newConnectionOrigin: string | null = null) {
        // console.log("generateLayout")
        this.nodeElements = [];
        this.connections = [];
        this.newConnection = null;
        this.socketElements.clear();

        if (!nodes)
            nodes = this.engine.nodes;
        for (const node of nodes) {


            if (!this.activeCamera) {
                throw Error("No active camera set");
            }

            var layout: NodeElement = {
                node: node,
                id: node.uId,
                position: node.position,
                headerHeight: 0,
                labelPosition: new Vector2(),
                size: new Vector2(),
                bottomRight: new Vector2(),
                socketLayouts: new Map<string, SocketElement>(),
                parameterLayouts: [],
                type: LayoutElementTypes.node
            };

            this.canvas.context.font = `${this.activeCamera.nodeStyle.fontSize! + 2}px ${this.activeCamera.nodeStyle.fontFace!}`;

            const headerLabelMeasurement = this.canvas.context.measureText(node.label)
            const textHeight = headerLabelMeasurement.fontBoundingBoxDescent + headerLabelMeasurement.fontBoundingBoxAscent;

            layout.headerHeight = textHeight + 2 * this.activeCamera.nodeStyle.textMargin!.y;

            layout.labelPosition = layout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin!.x, true), -(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin!.y + headerLabelMeasurement.actualBoundingBoxAscent, true))));

            let longestText = headerLabelMeasurement.width;

            for (const socket of node.input) {
                let textSize = this.canvas.context.measureText(socket.label).width;
                if (textSize > longestText) longestText = textSize;
            }
            for (const socket of node.output) {
                let textSize = this.canvas.context.measureText(socket.label).width;
                if (textSize > longestText) longestText = textSize;
            }

            const boxWidth = Math.max(longestText + 50 + 2 * this.activeCamera.nodeStyle.textMargin!.x, 120);

            var offset = layout.headerHeight + textHeight;

            for (const socket of node.output) {
                let socketLayout: SocketElement = {
                    socket: socket,
                    parent: layout,
                    id: socket.uId!,
                    position: node.position.sub(new Vector2(-this.activeCamera.convertPixelToUnit(boxWidth, true), this.activeCamera.convertPixelToUnit(offset, true))),
                    labelPosition: new Vector2(),
                    labelAlign: "right",
                    topLeft: new Vector2(),
                    bottomRight: new Vector2(),
                    size: new Vector2(),
                    type: LayoutElementTypes.socket
                };
                socketLayout.labelPosition = socketLayout.position.sub(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin!.x, true), 0));
                let realRadius = this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.socketRadius!, true);
                socketLayout.topLeft = socketLayout.position.add(new Vector2(-realRadius, realRadius));
                socketLayout.bottomRight = socketLayout.position.add(new Vector2(realRadius, -realRadius));
                socketLayout.size = new Vector2(2 * this.activeCamera.nodeStyle.socketRadius!, 2 * this.activeCamera.nodeStyle.socketRadius!);

                layout.socketLayouts.set(socket.uId!, socketLayout);
                this.socketElements.set(socket.uId!, socketLayout);
                offset += this.activeCamera.nodeStyle.textMargin!.y + textHeight;

                if (newConnectionOrigin && newConnectionOrigin == socket.uId!) {
                    this.newConnection = [socketLayout.position, null];
                }
            }

            for (const parameter of node.parameters) {
                let labelPos = node.position.add(new Vector2(this.activeCamera!.convertPixelToUnit(this.activeCamera!.nodeStyle.textMargin!.x, true), - this.activeCamera!.convertPixelToUnit(offset, true)));
                let inputPos = labelPos.sub(new Vector2(0, this.activeCamera.convertPixelToUnit(textHeight / 2 + this.activeCamera.nodeStyle.textMargin!.y, true)));
                let size = new Vector2(boxWidth - this.activeCamera!.nodeStyle.textMargin!.x * 2, (textHeight * 0.8 + 5));
                let parameterElement = new ParameterElement(
                    parameter,
                    layout,
                    inputPos,
                    size,
                    inputPos.add(new Vector2(this.activeCamera!.convertPixelToUnit(size.x, true), -this.activeCamera!.convertPixelToUnit(size.y, true))),
                    labelPos
                );
                layout.parameterLayouts.push(parameterElement);
                offset += textHeight * 2 + this.activeCamera.nodeStyle.textMargin!.y * 2.5
            }

            for (const socket of node.input) {
                let socketLayout: SocketElement = {
                    socket: socket,
                    id: socket.uId!,
                    parent: layout,
                    position: node.position.sub(new Vector2(0, this.activeCamera.convertPixelToUnit(offset, true))),
                    labelPosition: new Vector2(),
                    labelAlign: "left",
                    topLeft: new Vector2(),
                    bottomRight: new Vector2(),
                    size: new Vector2(),
                    type: LayoutElementTypes.socket
                };
                socketLayout.labelPosition = socketLayout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin!.x, true), 0));
                let realRadius = this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.socketRadius!, true);
                socketLayout.topLeft = socketLayout.position.add(new Vector2(-realRadius, realRadius));
                socketLayout.bottomRight = socketLayout.position.add(new Vector2(realRadius, -realRadius));
                socketLayout.size = new Vector2(2 * this.activeCamera.nodeStyle.socketRadius!, 2 * this.activeCamera.nodeStyle.socketRadius!);

                layout.socketLayouts.set(socket.uId!, socketLayout);
                this.socketElements.set(socket.uId!, socketLayout);

                if (!socket.conection) {
                    offset += this.activeCamera.nodeStyle.textMargin!.y + textHeight / 2;
                    let inputLayoutReturnVal = this.generateInputLayout(socketLayout, offset, textHeight);
                    socketLayout.input = inputLayoutReturnVal[0];
                    offset = inputLayoutReturnVal[1];
                } else {
                    offset += this.activeCamera.nodeStyle.textMargin!.y + textHeight;

                }

                if (newConnectionOrigin && newConnectionOrigin == socket.uId!) {
                    this.newConnection = [null, socketLayout.position];
                }
            }

            let boxHeight = offset;
            layout.size = new Vector2(boxWidth, boxHeight);
            layout.bottomRight = layout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(boxWidth, true), -this.activeCamera.convertPixelToUnit(boxHeight, true)));
            this.nodeElements.push(layout);
        }

        for (const socketId of this.socketElements.keys()) {
            const socket = this.socketElements.get(socketId)!;
            if (socket.socket.conection) {
                // console.log(socket)
                // console.log(socketLayouts.get(socket.socket.conection))
                this.connections.push([this.socketElements.get(socket.socket.conection[0])!.position, socket.position]);
            }
        }
    }

    private generateInputLayout(element: SocketElement, offset: number, textHeight: number): [SocketInputElement<any>, number] {
        let pos = element.parent.position.add(new Vector2(this.activeCamera!.convertPixelToUnit(this.activeCamera!.nodeStyle.textMargin!.x, true), - this.activeCamera!.convertPixelToUnit(offset, true)));
        switch (element.socket.type) {
            case SocketType.color:
                {
                    let colorInput = new ColorInputElement(
                        element,
                        pos,
                        new Vector2(30, 20),
                        pos.add(new Vector2(this.activeCamera!.convertPixelToUnit(30, true), -this.activeCamera!.convertPixelToUnit(20, true))),
                        (c) => {
                            // TODO
                        }
                    );

                    return [colorInput, offset + colorInput.size.y + textHeight];
                }
            case SocketType.float:
                {
                    let vectorInput = new NumberInputElement(
                        element,
                        pos,
                        new Vector2(50, (textHeight * 0.8 + 5)),
                        pos.add(new Vector2(this.activeCamera!.convertPixelToUnit(50, true), -this.activeCamera!.convertPixelToUnit((textHeight * 0.8 + 5), true))),
                        (v) => {
                            // TODO

                        }
                    );
                    return [vectorInput, offset + vectorInput.size.y + textHeight];
                }
            case SocketType.vector2:
                {
                    let vectorInput = new VectorInputElement<Vector2>(
                        element,
                        pos,
                        new Vector2(50, (textHeight * 0.8 + 5) * 2),
                        pos.add(new Vector2(this.activeCamera!.convertPixelToUnit(50, true), -this.activeCamera!.convertPixelToUnit((textHeight * 0.8 + 5) * 2, true))),
                        (v) => {
                            // TODO

                        }
                    );
                    return [vectorInput, offset + vectorInput.size.y + textHeight];
                }
            case SocketType.vector3:
                {
                    let vectorInput = new VectorInputElement<Vector3>(
                        element,
                        pos,
                        new Vector2(50, (textHeight * 0.8 + 5) * 3),
                        pos.add(new Vector2(this.activeCamera!.convertPixelToUnit(50, true), -this.activeCamera!.convertPixelToUnit((textHeight * 0.8 + 5) * 3, true))),
                        (v) => {
                            // TODO

                        }
                    );
                    return [vectorInput, offset + vectorInput.size.y + textHeight];
                }
            case SocketType.vector4:
                {
                    let vectorInput = new VectorInputElement<Vector4>(
                        element,
                        pos,
                        new Vector2(50, (textHeight * 0.8 + 5) * 4),
                        pos.add(new Vector2(this.activeCamera!.convertPixelToUnit(50, true), -this.activeCamera!.convertPixelToUnit((textHeight * 0.8 + 5) * 4, true))),
                        (v) => {
                            // TODO

                        }
                    );
                    return [vectorInput, offset + vectorInput.size.y + textHeight];
                }
            default:
                throw Error(`Unkown socket type: ${element.socket.type} `)
        }
    }
}
