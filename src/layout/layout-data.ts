import { Vector2 } from "../core/math/vector";
import { NodeElement, SocketElement } from "./layout-elements";
import { BaseWidget } from "./widgets/base-widget";

export interface LayoutData {
    nodes: NodeElement[];
    connections: [Vector2, Vector2][];
    newConnection: [Vector2 | null, Vector2 | null] | null;
    sockets: Map<string, SocketElement>;
    activeWidget: BaseWidget | null;
}