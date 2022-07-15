import { Vector2 } from "../core/math/vector";

function circle(context: CanvasRenderingContext2D, position: Vector2, radius: number) {
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
}

function cubicBelzier(context: CanvasRenderingContext2D, controlPoints: [Vector2, Vector2, Vector2, Vector2]) {
    context.beginPath();
    context.moveTo(controlPoints[0].x, controlPoints[0].y);
    context.bezierCurveTo(
        controlPoints[1].x, controlPoints[1].y,
        controlPoints[2].x, controlPoints[2].y,
        controlPoints[3].x, controlPoints[3].y
    );
}

export { circle, cubicBelzier }