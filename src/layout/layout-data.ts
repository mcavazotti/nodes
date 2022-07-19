import { Vector2 } from "../core/math/vector";
import { NodeElement } from "./layout-elements";

export interface LayoutData {
    nodes: NodeElement[];
    connections: [Vector2, Vector2][];
    newConnection: [Vector2 | null, Vector2 | null] | null;
}