import { ContextManager } from '../context/context-manager';
import { ContextType } from '../context/context-types';
import { Vector2 } from '../core/math/vector';
import { InputEventType } from '../input/input-events';
import { InputHandler } from '../input/input-handler';
import { MouseInputType } from '../input/input-types';
import { InputElement } from '../layout/elements/base-input-element';
import { NodeElement, SocketElement } from '../layout/layout-elements';
import { LayoutManager } from '../layout/layout-manager';
import { PivotTypes } from '../layout/widgets/base-widget';
import { NodeEngine } from '../node/node-engine';
import { Socket } from '../node/types/socket';
import { Camera } from '../render/camera'

export class UiHandler {
    private static instance: UiHandler;

    private camera: Camera | null = null;
    private input: InputHandler;
    private context: ContextManager;
    private layoutManager: LayoutManager;
    private engine: NodeEngine;
    private mousePosition!: Vector2
    private connectSocket: Socket<any> | null = null;

    private constructor() {
        this.input = InputHandler.getInstance();
        this.context = ContextManager.getInstance();
        this.layoutManager = LayoutManager.getInstance();
        this.engine = NodeEngine.getInstance();

        this.input.addEventListener(InputEventType.mousedown, (e, c) => {
            // console.log(c)
            if (e.mouseButtonDown!.includes(MouseInputType.leftButton)) {
                this.context.setActive();
                if (this.context.context.active == ContextType.input) {
                    let inputElement = this.context.context.activeElement as InputElement<any>;
                    this.layoutManager.setActiveWidget(inputElement.generateWidget(e.mouseRawPosition!, PivotTypes.undefined));
                } else {

                    if (this.layoutManager.getLayout().activeWidget && this.context.context.hover != ContextType.widget) {
                        this.layoutManager.removeWidget();
                    }

                    if (this.context.context.active == ContextType.node) {
                        this.layoutManager.moveNodeToFront(this.context.context.activeElement as NodeElement);
                    }
                    if (this.context.context.active == ContextType.socket) {
                        let element = this.context.context.activeElement as SocketElement;
                        if (element.socket.role == "input" && element.socket.conection) {
                            this.connectSocket = this.layoutManager.getLayout().sockets.get(element.socket.conection[0])!.socket;
                            this.engine.removeConnection(element.socket);
                        } else {
                            this.connectSocket = element.socket;
                        }

                        this.layoutManager.generateLayout(undefined, this.connectSocket.uId);
                    }
                }
                this.mousePosition = e.mousePosition!;
            }
        });

        this.input.addEventListener(InputEventType.mouseup, (e, c) => {

            if (this.connectSocket) {
                if (c.hover == ContextType.socket) {
                    try {
                        this.engine.createConnection(this.connectSocket, (c.hoverElement as SocketElement).socket);
                    } catch (e) {
                        console.error(e)
                    }
                }
                this.connectSocket = null;
                this.layoutManager.generateLayout();
            }


        });

        this.input.addEventListener(InputEventType.mousemove, (e, c) => {
            // console.log(c);
            if (e.mouseButtonDown!.includes(MouseInputType.leftButton)) {
                if (this.camera && c.hover == ContextType.board) {
                    this.camera.position = this.camera.position.sub(e.mousePosition!.sub(this.mousePosition));
                }
                if (c.active == ContextType.node && c.activeElement) {
                    let nodeElement = c.activeElement as NodeElement;
                    nodeElement.node.position = nodeElement.node.position.add(e.mouseMovement!);
                    this.layoutManager.generateLayout();
                }
            }


        });

        this.input.addEventListener(InputEventType.mousewheel, (e,c) => {
            if (this.camera && !c.activeWidget) {
                switch (e.mouseScroll!) {
                    case MouseInputType.scrollUp:
                        this.camera.zoom = this.camera.zoom == 1 ? 1 : this.camera.zoom - 1;
                        break;
                    case MouseInputType.scrollDown:
                        this.camera.zoom = this.camera.zoom == 20 ? 20 : this.camera.zoom + 1;
                        break;
                }
                this.translateCameraAfterZoom(e.mousePosition!, e.mouseRawPosition!);
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

    private translateCameraAfterZoom(cursorWorldPos: Vector2, cursorRawPos: Vector2) {
        const newWorldPos = this.camera!.convertRasterCoordToWorld(cursorRawPos);
        const offset = newWorldPos.sub(cursorWorldPos);

        this.camera!.position = this.camera!.position.sub(offset);
    }
}