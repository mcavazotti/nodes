import { Vector2 } from "../core/math/vector.js";
import { MouseInputType } from "./input-types.js";

export interface InputState {
    mousePosition?: Vector2;
    mouseRawPosition?: Vector2;
    mouseButtonDown?: MouseInputType[];
    mouseButtonUp?: MouseInputType[];
    mouseMovement?: Vector2;
    mouseScroll?: MouseInputType.scrollDown | MouseInputType.scrollUp | null;
}