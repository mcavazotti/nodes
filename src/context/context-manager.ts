import { Vector2 } from "../core/math/vector";
import { LayoutManager } from "../layout/layout-manager";
import { ContextData } from "./context-data";
import { ContextType } from "./context-types";



export class ContextManager {
    private static instance: ContextManager;
    private _context: ContextData = {
        hover: ContextType.any,
        active: ContextType.any,
        activeElement: null,
        hoverElement: null,
        pointerPosition: new Vector2(),
        hoverWidget: null,
        activeWidget: null
    }
    get context(): ContextData {
        return { ...this._context };
    }

    private constructor() {

    }

    public static getInstance(): ContextManager {
        if (!ContextManager.instance) {
            ContextManager.instance = new ContextManager();
        }

        return ContextManager.instance;
    }

    updateContext(worldPointerPos: Vector2, rasterPointerPos: Vector2) {
        // console.log("updateContext")
        let layout = LayoutManager.getInstance().getLayout();
        this._context.pointerPosition = worldPointerPos;

        if (layout.activeWidget) {
            this._context.activeWidget = layout.activeWidget;
            if (this.isInside(rasterPointerPos, layout.activeWidget.topLeft, layout.activeWidget.bottomRight, true)) {
                console.log("inside widget")
                this._context.hover = ContextType.widget;
                this._context.hoverElement = null;
                this._context.hoverWidget = layout.activeWidget;
                return
            } else {
                this._context.hoverWidget = layout.activeWidget;
            }
        } else {
            this._context.activeWidget = null;

        }

        if (layout.nodes) {
            for (let i = layout.nodes.length - 1; i >= 0; i--) {
                const node = layout.nodes[i];


                for (const socket of node.socketLayouts.values()) {
                    if (this.isInside(worldPointerPos, socket.topLeft, socket.bottomRight)) {
                        // console.log("on Socket")
                        // console.log(worldPointerPos)
                        this._context.hover = ContextType.socket;
                        this._context.hoverElement = socket;
                        return;
                    }
                    if (socket.input) {
                        if (this.isInside(worldPointerPos, socket.input.position, socket.input.bottomRight)) {
                            this._context.hover = ContextType.input;
                            this._context.hoverElement = socket.input;
                            return;
                        }
                    }
                }
                if (this.isInside(worldPointerPos, node.position, node.bottomRight)) {
                    // console.log("on Node")
                    // console.log(worldPointerPos)
                    this._context.hover = ContextType.node;
                    this._context.hoverElement = node;
                    return;
                }
            }
        }
        this._context.hover = ContextType.board;
        this._context.hoverElement = null;
    }

    setActive() {
        this._context.activeElement = this._context.hoverElement;
        this._context.active = this._context.hover;
    }

    private isInside(pos: Vector2, topLeft: Vector2, bottomRight: Vector2, raster: boolean = false): boolean {
        let tmp1 = (pos.x >= topLeft.x);
        let tmp2 = (pos.x <= bottomRight.x);
        let tmp3 = raster?(pos.y >= topLeft.y):(pos.y <= topLeft.y);
        let tmp4 = raster?(pos.y <= bottomRight.y):(pos.y >= bottomRight.y);
        return tmp1 && tmp2 && tmp3 && tmp4;
    }
}