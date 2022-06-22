import { Vector2 } from "../../core/math/vector.js";

interface BgStyle {
    bgColor?: string,
    lineColor?: string,
    lineThickness?: number,
    lineSpacing?: Vector2,
    offset?: Vector2
}

const DefaultBgStyle: BgStyle = {
    bgColor: "#5d667a",
    lineColor: "#00000044",
    lineThickness: 1,
    lineSpacing: new Vector2(1, 1),
    offset: new Vector2(0, 0),
};

export {BgStyle, DefaultBgStyle}