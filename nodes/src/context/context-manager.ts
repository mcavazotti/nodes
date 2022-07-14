import { Vector2 } from "../core/math/vector";
import { LayoutElement } from "../layout/layout-elements";
import { LayoutManager } from "../layout/layout-manager";
import { ContextType } from "./context-types";

interface Context {
    hover: ContextType;
    hoverElement: LayoutElement | null;
    active: ContextType;
    activeElement: LayoutElement | null;
}

class ContextManager {
    private static instance: ContextManager;
    private _context: Context = {
        hover: ContextType.any,
        active: ContextType.any,
        activeElement: null,
        hoverElement: null
    }
    get context(): Context {
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
        let layout = LayoutManager.getInstance().getLayout();
        if (layout.ui) {
            // TODO: something here 
        }
        if(layout.sockets) {
            for(const socket of layout.sockets) {
                if(this.isInside(worldPointerPos,socket.topLeft,socket.bottomRight)) {
                    this._context.hover = ContextType.socket;
                    this._context.hoverElement = socket;
                    return;
                }
            }
        }

        if (layout.nodes) {
            for (let i = layout.nodes.length-1; i >=0; i--) {
                const node = layout.nodes[i];
                if (this.isInside(worldPointerPos, node.position, node.bottomRight)) {
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

export { ContextManager, Context }