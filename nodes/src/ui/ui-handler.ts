import { ContextManager } from '../context/context-manager.js';
import { ContextType } from '../context/context-types.js';
import { Vector2 } from '../core/math/vector.js';
import { InputEventType } from '../input/input-events.js';
import { InputHandler } from '../input/input-handler.js';
import { MouseInputType } from '../input/input-types.js';
import { NodeElement } from '../layout/layout-elements.js';
import { LayoutManager } from '../layout/layout-manager.js';
import { Camera } from '../render/camera.js'

export class UiHandler {
    private static instance: UiHandler;

    private camera: Camera | null = null;
    private input: InputHandler;
    private context: ContextManager;
    private layoutManager: LayoutManager;
    private mousePosition!: Vector2

    private constructor() {
        this.input = InputHandler.getInstance();
        this.context = ContextManager.getInstance();
        this.layoutManager = LayoutManager.getInstance();

        this.input.addEventListener(InputEventType.mousedown, (e, c) => {
            console.log("down")
            if (e.mouseButtonDown!.includes(MouseInputType.leftButton)) {
                this.context.setActive();
                this.mousePosition = e.mousePosition!;
            }
        });

        this.input.addEventListener(InputEventType.mousemove, (e, c) => {
            if (e.mouseButtonDown!.includes(MouseInputType.leftButton)) {
                if (this.camera && !c.activeElement) {
                    this.camera.position = this.camera.position.sub(e.mousePosition!.sub(this.mousePosition));
                }
                if (c.active == ContextType.node && c.activeElement) {
                    let nodeElement = c.activeElement as NodeElement;
                    nodeElement.node.position = nodeElement.node.position.add(e.mouseMovement!);
                    this.layoutManager.generateLayout();
                }
            }

        });

        this.input.addEventListener(InputEventType.mousewheel, (e) => {
            if (this.camera) {
                switch (e.mouseScroll!) {
                    case MouseInputType.scrollUp:
                        this.camera.zoom = this.camera.zoom == 1 ? 1 : this.camera.zoom - 1;
                        break;
                    case MouseInputType.scrollDown:
                        this.camera.zoom = this.camera.zoom == 20 ? 20 : this.camera.zoom + 1;
                        break;
                }
            }
        });
    }

    public static getInstance(camera?: Camera): UiHandler {
        if (!UiHandler.instance) {
            UiHandler.instance = new UiHandler();
        }
        if (camera) {
            UiHandler.instance.camera = camera;
        }
        return UiHandler.instance;
    }

    setActiveCamera(camera: Camera) {
        this.camera = camera;
    }
}