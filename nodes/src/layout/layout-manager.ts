import { Canvas } from "../core/html-interface/canvas";
import { Vector2 } from "../core/math/vector";
import { BaseNode } from "../node/definitions";
import { NodeEngine } from "../node/node-engine";
import { SocketType } from "../node/types/socket-types";
import { Camera } from "../render/camera";
import { InputElement } from "./elements/base-input-element";
import { ColorInputElement } from "./elements/color-input-element";
import { LayoutElementTypes } from "./elements/element-types";
import { NodeElement, SocketElement } from "./layout-elements";

interface LayoutData {
    nodes: NodeElement[];
    connections: [Vector2, Vector2][];
    newConnection: [Vector2 | null, Vector2 | null] | null;
}

class LayoutManager {
    private static instance: LayoutManager;
    private activeCamera: Camera | null = null;

    private engine: NodeEngine;

    private canvas: Canvas;

    private nodeElements: NodeElement[] = [];
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
            // sockets: this.nodeElements.map((n) => Array.from(n.socketLayouts.values())).reduce((acc, val) => acc.concat(val), []),

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
        console.log("generateLayout")
        this.nodeElements = [];
        this.connections = [];
        this.newConnection = null;
        const socketLayouts = new Map<string, SocketElement>();

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
                type: LayoutElementTypes.node
            };

            this.canvas.context.font = `${this.activeCamera.nodeStyle.fontSize! + 2}px ${this.activeCamera.nodeStyle.fontFace!}`;

            const headerLabelMeasurement = this.canvas.context.measureText(node.label)
            const textHeight = headerLabelMeasurement.fontBoundingBoxDescent + headerLabelMeasurement.fontBoundingBoxAscent;

            layout.headerHeight = textHeight + 2 * this.activeCamera.nodeStyle.textMargin!;

            layout.labelPosition = layout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin!, true), -(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin! + headerLabelMeasurement.actualBoundingBoxAscent, true))));

            let longestText = headerLabelMeasurement.width;

            for (const socket of node.input) {
                let textSize = this.canvas.context.measureText(socket.label).width;
                if (textSize > longestText) longestText = textSize;
            }
            for (const socket of node.output) {
                let textSize = this.canvas.context.measureText(socket.label).width;
                if (textSize > longestText) longestText = textSize;
            }

            const boxWidth = Math.max(longestText + 50 + 2 * this.activeCamera.nodeStyle.textMargin!, 120);

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
                socketLayout.labelPosition = socketLayout.position.sub(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin! + this.activeCamera.nodeStyle.socketRadius!, true), 0));
                let realRadius = this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.socketRadius!, true);
                socketLayout.topLeft = socketLayout.position.add(new Vector2(-realRadius, realRadius));
                socketLayout.bottomRight = socketLayout.position.add(new Vector2(realRadius, -realRadius));
                socketLayout.size = new Vector2(2 * this.activeCamera.nodeStyle.socketRadius!, 2 * this.activeCamera.nodeStyle.socketRadius!);

                layout.socketLayouts.set(socket.uId!, socketLayout);
                socketLayouts.set(socket.uId!, socketLayout);
                offset += this.activeCamera.nodeStyle.textMargin! + textHeight;

                if (newConnectionOrigin && newConnectionOrigin == socket.uId!) {
                    this.newConnection = [socketLayout.position, null];
                }
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
                socketLayout.labelPosition = socketLayout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin! + this.activeCamera.nodeStyle.socketRadius!, true), 0));
                let realRadius = this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.socketRadius!, true);
                socketLayout.topLeft = socketLayout.position.add(new Vector2(-realRadius, realRadius));
                socketLayout.bottomRight = socketLayout.position.add(new Vector2(realRadius, -realRadius));
                socketLayout.size = new Vector2(2 * this.activeCamera.nodeStyle.socketRadius!, 2 * this.activeCamera.nodeStyle.socketRadius!);

                layout.socketLayouts.set(socket.uId!, socketLayout);
                socketLayouts.set(socket.uId!, socketLayout);

                if (!socket.conection) {
                    offset += this.activeCamera.nodeStyle.textMargin! + textHeight / 2;
                    let inputLayoutReturnVal = this.generateInputLayout(socketLayout, offset, textHeight);
                    socketLayout.input = inputLayoutReturnVal[0];
                    offset = inputLayoutReturnVal[1];
                } else {
                    offset += this.activeCamera.nodeStyle.textMargin! + textHeight;

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

        for (const socketId of socketLayouts.keys()) {
            const socket = socketLayouts.get(socketId)!;
            if (socket.socket.conection) {
                // console.log(socket)
                // console.log(socketLayouts.get(socket.socket.conection))
                this.connections.push([socketLayouts.get(socket.socket.conection)!.position, socket.position]);
            }
        }
    }

    private generateInputLayout(element: SocketElement, offset: number, textHeight: number): [InputElement<any>, number] {
        switch (element.socket.type) {
            case SocketType.color:
            case SocketType.vector2:
                let pos = element.parent.position.add(new Vector2(this.activeCamera!.convertPixelToUnit(this.activeCamera!.nodeStyle.textMargin! + this.activeCamera!.nodeStyle.socketRadius!, true), - this.activeCamera!.convertPixelToUnit(offset, true)));
                let colorInput = new ColorInputElement(
                    element,
                    pos,
                    new Vector2(30, 20),
                    pos.add(new Vector2(this.activeCamera!.convertPixelToUnit(60, true), -this.activeCamera!.convertPixelToUnit(40, true))),
                    (c) => {
                        // TODO
                    }
                );

                return [colorInput, offset + colorInput.size.y + textHeight];
                break;
            default:
                throw Error(`Unkown socket type: ${element.socket.type} `)
        }
    }
}

export { LayoutManager, LayoutData };