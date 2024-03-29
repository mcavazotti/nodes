import { Vector2 } from "../core/math/vector";
import { NodeElement } from "../layout/layout-elements";
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
        pointerPosition: new Vector2()
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

        if (!layout.nodes || (this._context.active == ContextType.node && !layout.nodes.map(n => n.id).includes((this._context.activeElement as (NodeElement | null))?.id!))) {
            this._context.active = ContextType.any;
            this._context.activeElement = null;
        }

        if (layout.nodes) {
            for (let i = layout.nodes.length - 1; i >= 0; i--) {
                const node = layout.nodes[i];

                for (const parameter of node.parameterLayouts) {
                    if (this.isInside(worldPointerPos, parameter.position, parameter.bottomRight)) {
                        this._context.hover = ContextType.paramInput;
                        this._context.hoverElement = parameter;
                        return;
                    }
                }

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

    private isInside(pos: Vector2, topLeft: Vector2, bottomRight: Vector2): boolean {
        // console.log(topLeft);
        // console.log(pos);
        // console.log(bottomRight);
        return (pos.x >= topLeft.x) && (pos.x <= bottomRight.x) && (pos.y <= topLeft.y) && (pos.y >= bottomRight.y);
    }
}