import { Vector2 } from "../math/vector.js";

enum SelectableType {
    node
}

interface Selectable {
    readonly selectableType: SelectableType;
    hit(position:Vector2):boolean
}

interface NodeSelectable extends Selectable {
    readonly selectableType: SelectableType.node;
    topLeft: Vector2;
    bottonRight: Vector2;
}

export {Selectable, SelectableType, NodeSelectable};