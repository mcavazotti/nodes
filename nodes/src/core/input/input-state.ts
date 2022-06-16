import { Vector2 } from "../math/vector.js";
import { MouseInputType } from "./input-types.js";

export interface InputState {
    mousePosition?: Vector2;
    mouseButtonDown?: MouseInputType[];
    mouseButtonUp?: MouseInputType[];
    mouseMovement?: Vector2;
}