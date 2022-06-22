import { Vector2 } from "../core/math/vector.js";

function circle(context: CanvasRenderingContext2D, position: Vector2, radius: number) {
    context.arc(position.x,position.y,radius,0,2*Math.PI);
}