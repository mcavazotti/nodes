import { Canvas } from "../core/html-interface/canvas.js";
import { Vector2 } from "../core/math/vector.js";
import { BaseNode } from "../node/node-defs/base-node.js";
import { Camera } from "../render/camera.js";
import { NodeLayout, SocketLayout } from "./node-layout.js";

export class LayoutGenerator {
    private static instance: LayoutGenerator;

    private canvas: Canvas;

    private constructor() {
        let canvasElement = document.createElement("canvas");
        let canvasContext = canvasElement.getContext("2d")!;
        this.canvas = { element: canvasElement, context: canvasContext };
    }

    public static getInstance(): LayoutGenerator {
        if (!LayoutGenerator.instance) {
            LayoutGenerator.instance = new LayoutGenerator();
        }

        return LayoutGenerator.instance;
    }

    generateLayout(node: BaseNode, camera: Camera): NodeLayout {
        var layout: NodeLayout = {
            node: node,
            position: node.position,
            headerHeight: 0,
            labelPos: new Vector2(),
            size: new Vector2(),
            socketLayouts: new Map<string, SocketLayout>()
        };

        this.canvas.context.font = `${camera.nodeStyle.fontSize! + 2}px ${camera.nodeStyle.fontFace!}`;

        const headerLabelMeasurement = this.canvas.context.measureText(node.label)
        const textHeight = headerLabelMeasurement.fontBoundingBoxDescent + headerLabelMeasurement.fontBoundingBoxAscent;

        layout.headerHeight = textHeight + 2 * camera.nodeStyle.textMargin!;

        layout.labelPos = layout.position.add(new Vector2(camera.convertPixelToUnit(camera.nodeStyle.textMargin!, true), -(camera.convertPixelToUnit(camera.nodeStyle.textMargin! + headerLabelMeasurement.actualBoundingBoxAscent, true))));

        let longestText = headerLabelMeasurement.width;

        for (const socket of node.input) {
            let textSize = this.canvas.context.measureText(socket[0].label).width;
            if (textSize > longestText) longestText = textSize;
        }
        for (const socket of node.output) {
            let textSize = this.canvas.context.measureText(socket.label).width;
            if (textSize > longestText) longestText = textSize;
        }

        const boxWidth = longestText + 50 + 2 * camera.nodeStyle.textMargin!;

        var offset = layout.headerHeight + textHeight;

        for (const socket of node.output) {
            let socketLayout: SocketLayout = {
                socket: socket,
                postition: node.position.sub(new Vector2(-camera.convertPixelToUnit(boxWidth, true), camera.convertPixelToUnit(offset, true))),
                labelPostion: new Vector2(),
                labelAlign: "right"
            };
            socketLayout.labelPostion = socketLayout.postition.sub(new Vector2(camera.convertPixelToUnit(camera.nodeStyle.textMargin! + camera.nodeStyle.socketRadius!, true), 0));

            layout.socketLayouts.set(socket.uId, socketLayout);
            offset += camera.nodeStyle.textMargin! + textHeight;
        }

        for (const socket of node.input) {
            let socketLayout: SocketLayout = {
                socket: socket[0],
                postition: node.position.sub(new Vector2(0, camera.convertPixelToUnit(offset, true))),
                labelPostion: new Vector2(),
                labelAlign: "left"
            };
            socketLayout.labelPostion = socketLayout.postition.add(new Vector2(camera.convertPixelToUnit(camera.nodeStyle.textMargin! + camera.nodeStyle.socketRadius!, true), 0));

            layout.socketLayouts.set(socket[0].uId, socketLayout);
            offset += camera.nodeStyle.textMargin! + textHeight;
        }

        let boxHeight = offset;
        layout.size = new Vector2(boxWidth, boxHeight);

        return layout;
    }
}