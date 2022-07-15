import { Vector2 } from "../core/math/vector";
import { MouseInputType } from "./input-types";

export interface InputState {
    mousePosition?: Vector2;
    mouseRawPosition?: Vector2;
    mouseButtonDown?: MouseInputType[];
    mouseButtonUp?: MouseInputType[];
    mouseMovement?: Vector2;
    mouseScroll?: MouseInputType.scrollDown | MouseInputType.scrollUp | null;
}