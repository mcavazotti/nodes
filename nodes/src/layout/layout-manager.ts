import { Canvas } from "../core/html-interface/canvas.js";
import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "../node/node-defs/base-node.js";
import { Camera } from "../render/camera.js";
import { NodeElement, SocketElement } from "./layout-elements.js";

export class LayoutManager {
    private static instance: LayoutManager;
    private activeCamera: Camera | null = null;

    private canvas: Canvas;

    private nodeElements: NodeElement[] = [];

    private constructor() {
        let canvasElement = document.createElement("canvas");
        let canvasContext = canvasElement.getContext("2d")!;
        this.canvas = { element: canvasElement, context: canvasContext };
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

    getLayout() {
        return {
            nodes: [...this.nodeElements],
            ui: [],
        };
    }

    setActiveCamera(camera: Camera) {
        this.activeCamera = camera;
    }

    generateLayout(nodes: BaseNode[]) {
        this.nodeElements = []
        for (const node of nodes) {


            if (!this.activeCamera) {
                throw Error("No active camera set");
            }

            var layout: NodeElement = {
                node: node,
                position: node.position,
                headerHeight: 0,
                labelPos: new Vector2(),
                size: new Vector2(),
                bottomRight: new Vector2(),
                socketLayouts: new Map<string, SocketElement>()
            };

            this.canvas.context.font = `${this.activeCamera.nodeStyle.fontSize! + 2}px ${this.activeCamera.nodeStyle.fontFace!}`;

            const headerLabelMeasurement = this.canvas.context.measureText(node.label)
            const textHeight = headerLabelMeasurement.fontBoundingBoxDescent + headerLabelMeasurement.fontBoundingBoxAscent;

            layout.headerHeight = textHeight + 2 * this.activeCamera.nodeStyle.textMargin!;

            layout.labelPos = layout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin!, true), -(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin! + headerLabelMeasurement.actualBoundingBoxAscent, true))));

            let longestText = headerLabelMeasurement.width;

            for (const socket of node.input) {
                let textSize = this.canvas.context.measureText(socket[0].label).width;
                if (textSize > longestText) longestText = textSize;
            }
            for (const socket of node.output) {
                let textSize = this.canvas.context.measureText(socket.label).width;
                if (textSize > longestText) longestText = textSize;
            }

            const boxWidth = longestText + 50 + 2 * this.activeCamera.nodeStyle.textMargin!;

            var offset = layout.headerHeight + textHeight;

            for (const socket of node.output) {
                let socketLayout: SocketElement = {
                    socket: socket,
                    postition: node.position.sub(new Vector2(-this.activeCamera.convertPixelToUnit(boxWidth, true), this.activeCamera.convertPixelToUnit(offset, true))),
                    labelPostion: new Vector2(),
                    labelAlign: "right",
                    topLeft: new Vector2(),
                    bottomRight: new Vector2(),
                    size: new Vector2()
                };
                socketLayout.labelPostion = socketLayout.postition.sub(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin! + this.activeCamera.nodeStyle.socketRadius!, true), 0));
                let realRadius = this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.socketRadius!, true);
                socketLayout.topLeft = socketLayout.postition.add(new Vector2(-realRadius, realRadius));
                socketLayout.size = new Vector2(2 * this.activeCamera.nodeStyle.socketRadius!, 2 * this.activeCamera.nodeStyle.socketRadius!);

                layout.socketLayouts.set(socket.uId!, socketLayout);
                offset += this.activeCamera.nodeStyle.textMargin! + textHeight;
            }

            for (const socket of node.input) {
                let socketLayout: SocketElement = {
                    socket: socket[0],
                    postition: node.position.sub(new Vector2(0, this.activeCamera.convertPixelToUnit(offset, true))),
                    labelPostion: new Vector2(),
                    labelAlign: "left",
                    topLeft: new Vector2(),
                    bottomRight: new Vector2(),
                    size: new Vector2(),
                };
                socketLayout.labelPostion = socketLayout.postition.add(new Vector2(this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.textMargin! + this.activeCamera.nodeStyle.socketRadius!, true), 0));
                let realRadius = this.activeCamera.convertPixelToUnit(this.activeCamera.nodeStyle.socketRadius!, true);
                socketLayout.topLeft = socketLayout.postition.add(new Vector2(-realRadius, realRadius));
                socketLayout.size = new Vector2(2 * this.activeCamera.nodeStyle.socketRadius!, 2 * this.activeCamera.nodeStyle.socketRadius!);

                layout.socketLayouts.set(socket[0].uId!, socketLayout);
                offset += this.activeCamera.nodeStyle.textMargin! + textHeight;
            }

            let boxHeight = offset;
            layout.size = new Vector2(boxWidth, boxHeight);
            layout.bottomRight = layout.position.add(new Vector2(this.activeCamera.convertPixelToUnit(boxWidth, true), -this.activeCamera.convertPixelToUnit(boxHeight, true)));
            this.nodeElements.push(layout);
        }
    }


}