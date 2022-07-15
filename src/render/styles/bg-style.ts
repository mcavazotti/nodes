import { Vector2 } from "../../core/math/vector";

interface BgStyle {
    bgColor?: string,
    lineColor?: string,
    lineThickness?: number,
    lineSpacing?: Vector2,
    offset?: Vector2,
    activeElementLineColor?: string,
    activeElementLineThickness?: number,
}

const DefaultBgStyle: BgStyle = {
    bgColor: "#5d667a",
    lineColor: "#00000044",
    lineThickness: 1,
    lineSpacing: new Vector2(1, 1),
    offset: new Vector2(0, 0),
    activeElementLineColor: '#faee9d',
    activeElementLineThickness: 3,
};

export {BgStyle, DefaultBgStyle}