import { Vector2 } from "../core/math/vector";
import { LayoutElement } from "../layout/layout-elements";
import { ContextType } from "./context-types";

export interface ContextData {
    hover: ContextType;
    hoverElement: LayoutElement | null;
    active: ContextType;
    activeElement: LayoutElement | null;
    pointerPosition: Vector2;
}