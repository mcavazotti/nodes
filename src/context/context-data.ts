import { Vector2 } from "../core/math/vector";
import { LayoutElement } from "../layout/layout-elements";
import { BaseWidget } from "../layout/widgets/base-widget";
import { ContextType } from "./context-types";

export interface ContextData {
    hover: ContextType;
    hoverElement: LayoutElement | null;
    hoverWidget: BaseWidget | null;
    active: ContextType;
    activeElement: LayoutElement | null;
    activeWidget: BaseWidget | null;
    pointerPosition: Vector2;
}