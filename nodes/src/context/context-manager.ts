import { Vector2 } from "../core/math/vector.js";
import { LayoutManager } from "../layout/layout-manager.js";
import { ContextType } from "./context-types.js";

interface Context {
    hover: ContextType;
    active: ContextType;
}

class ContextManager {
    private static instance: ContextManager;
    private _context: Context = {
        hover: ContextType.any,
        active: ContextType.any,
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
        if (layout.nodes) {
            for (const node of layout.nodes) {
                if (this.isInside(worldPointerPos, node.position, node.bottomRight)){
                    this._context.hover = ContextType.node;
                    return;
                }
            }
        }
        this._context.hover = ContextType.board;
    }

    private isInside(pos: Vector2, topLeft: Vector2, bottomRight: Vector2): boolean {
        // console.log(topLeft);
        // console.log(pos);
        // console.log(bottomRight);
        return (pos.x >= topLeft.x) && (pos.x <= bottomRight.x) && (pos.y <= topLeft.y) && (pos.y >= bottomRight.y);
    }
}

export { ContextManager, Context }