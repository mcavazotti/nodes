import { Vector2 } from "../types/vector.js";
export class Camera {
    constructor(bg, board, position = new Vector2(0, 0), frustrumWidth = 10, zoom = 1, bgOpts = {}) {
        this.position = position;
        this.frustrumWidth = frustrumWidth;
        this.zoom = zoom;
        this.bg = bg;
        this.board = board;
        this.aspectRatio = bg.element.width / bg.element.height;
        this.frustrumHeight = this.frustrumWidth / this.aspectRatio;
        this.bgOptions = Object.assign({ bgColor: "#5d667a", lineColor: "#00000044", lineThickness: 1, lineSpacing: new Vector2(1, 1), offset: new Vector2(0, 0) }, bgOpts);
    }
    get canvasDimention() {
        return new Vector2(this.bg.element.width, this.bg.element.height);
    }
    convertWorldCoordToRaster(vec) {
        const relativeOffset = vec.sub(this.position);
        const cameraSpacePosition = relativeOffset.div(new Vector2(this.frustrumWidth * this.zoom, this.frustrumHeight * this.zoom));
        const canvasCenter = this.canvasDimention.scale(0.5);
        const rasterOffset = cameraSpacePosition.mult(this.canvasDimention);
        const rasterCoord = new Vector2(canvasCenter.x + rasterOffset.x, canvasCenter.y - rasterOffset.y);
        return rasterCoord;
    }
    convertRasterCoordToWorld(vec) {
        const cameraSpacePosition = new Vector2((vec.x - this.canvasDimention.x / 2) / (this.canvasDimention.x / 2), (vec.y - this.canvasDimention.y / 2) / (this.canvasDimention.y / 2));
        const relativeOffset = new Vector2(cameraSpacePosition.x * this.frustrumWidth * this.zoom, cameraSpacePosition.y * this.frustrumHeight * this.zoom);
        return new Vector2(this.position.x + relativeOffset.x, this.position.y - relativeOffset.y);
    }
    renderBackground() {
        this.bg.context.fillStyle = this.bgOptions.bgColor;
        this.bg.context.fillRect(0, 0, this.bg.element.width, this.bg.element.height);
        const topLeftCorner = new Vector2(this.position.x - (this.frustrumWidth * this.zoom / 2), this.position.y + (this.frustrumHeight * this.zoom / 2));
        var linePos = this.bgOptions.offset.copy();
        const deltaX = topLeftCorner.x - linePos.x;
        const deltaY = topLeftCorner.x - linePos.y;
        const verticalLinesRepetitions = deltaX > 0 ? Math.floor(deltaX / this.bgOptions.lineSpacing.x) : Math.ceil(deltaX / this.bgOptions.lineSpacing.x);
        const horizontalLinesRepetitions = deltaY > 0 ? Math.floor(deltaY / this.bgOptions.lineSpacing.y) : Math.ceil(deltaY / this.bgOptions.lineSpacing.y);
        linePos.x = linePos.x + this.bgOptions.lineSpacing.x * verticalLinesRepetitions;
        linePos.y = linePos.y + this.bgOptions.lineSpacing.y * horizontalLinesRepetitions;
        this.bg.context.lineWidth = this.bgOptions.lineThickness;
        this.bg.context.strokeStyle = this.bgOptions.lineColor;
        this.bg.context.beginPath();
        while (linePos.x < this.position.x + this.frustrumWidth) {
            this.bg.context.moveTo(this.convertWorldCoordToRaster(linePos).x, 0);
            this.bg.context.lineTo(this.convertWorldCoordToRaster(linePos).x, this.bg.element.height);
            linePos.x += this.bgOptions.lineSpacing.x;
        }
        while (linePos.y < this.position.y + this.frustrumHeight) {
            this.bg.context.moveTo(0, this.convertWorldCoordToRaster(linePos).y);
            this.bg.context.lineTo(this.bg.element.width, this.convertWorldCoordToRaster(linePos).y);
            linePos.y += this.bgOptions.lineSpacing.y;
        }
        this.bg.context.stroke();
    }
}
//# sourceMappingURL=camera.js.map