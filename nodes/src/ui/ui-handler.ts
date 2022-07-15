import { ContextManager } from '../context/context-manager';
import { ContextType } from '../context/context-types';
import { Vector2 } from '../core/math/vector';
import { InputEventType } from '../input/input-events';
import { InputHandler } from '../input/input-handler';
import { MouseInputType } from '../input/input-types';
import { LayoutElementTypes } from '../layout/elements/element-types';
import { NodeElement, SocketElement } from '../layout/layout-elements';
import { LayoutManager } from '../layout/layout-manager';
import { NodeEngine } from '../node/node-engine';
import { Socket } from '../node/types/socket';
import { Camera } from '../render/camera'

export class UiHandler {
    private static instance: UiHandler;

    private camera: Camera | null = null;
    private input: InputHandler;
    private context: ContextManager;
    private layoutManager: LayoutManager;
    private mousePosition!: Vector2
    private connectSocket: Socket<any> | null = null;

    private constructor() {
        this.input = InputHandler.getInstance();
        this.context = ContextManager.getInstance();
        this.layoutManager = LayoutManager.getInstance();

        this.input.addEventListener(InputEventType.mousedown, (e, c) => {
            if (e.mouseButtonDown!.includes(MouseInputType.leftButton)) {
                this.context.setActive();
                if (this.context.context.active == ContextType.node) {
                    this.layoutManager.moveNodeToFront(this.context.context.activeElement as NodeElement);
                }
                if (this.context.context.active == ContextType.socket) {
                    this.connectSocket = (this.context.context.activeElement as SocketElement).socket;
                    this.layoutManager.generateLayout(undefined, this.context.context.activeElement!.id);
                }
                this.mousePosition = e.mousePosition!;
            }
        });

        this.input.addEventListener(InputEventType.mouseup, (e, c) => {

            if (this.connectSocket) {
                if(c.hover == ContextType.socket){
                    NodeEngine.getInstance().createConnection(this.connectSocket,(c.hoverElement as SocketElement).socket);
                }
                this.connectSocket = null;
                this.layoutManager.generateLayout();
            }


        });

        this.input.addEventListener(InputEventType.mousemove, (e, c) => {
            // console.log(c);
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