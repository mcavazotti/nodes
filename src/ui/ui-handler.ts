import { ContextManager } from '../context/context-manager';
import { ContextType } from '../context/context-types';
import { ColorRGBA } from '../core/color/color';
import { Vector2, Vector3 } from '../core/math/vector';
import { InputEventType } from '../input/input-events';
import { InputHandler } from '../input/input-handler';
import { MouseInputType } from '../input/input-types';
import { SocketInputElement } from '../layout/elements/base-input-element';
import { ParameterElement } from '../layout/elements/parameter-element';
import { NodeElement, SocketElement } from '../layout/layout-elements';
import { LayoutManager } from '../layout/layout-manager';
import { NodeEngine } from '../node/node-engine';
import { Socket } from '../node/types/socket';
import { SocketType } from '../node/types/socket-types';
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
            if (e.mouseButtonDown!.includes(MouseInputType.leftButton)) {
                // console.log(c)
                this.context.setActive();
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
            } else {
                switch (c.hover) {
                    case ContextType.input: {
                        let prompt = "Insert";
                        switch ((c.hoverElement as SocketInputElement<any>).parent.socket.type) {
                            case SocketType.bool:
                                prompt += " boolean value: \n<\"true\" | \"false\">";
                                break;
                            case SocketType.float:
                                prompt += " numerical value: \n<number>";
                                break;
                            case SocketType.vector2:
                                prompt += " vector value: \n<format: \"(x,y)\">";
                                break;
                            case SocketType.vector3:
                                prompt += " vector value: \n<format: \"(x,y,z)\">";
                                break;
                            case SocketType.vector4:
                                prompt += " vector value: \n<format: \"(x,y,z,w)\">";
                                break;
                            case SocketType.color:
                                prompt += " color value: \n<format: HTML color code (hex or name) OR \"(r,g,b,a)\">";
                                break;
                        }
                        let value: string | null = window.prompt(prompt);
                        if (value !== null) {
                            this.setInputValue(value, (c.hoverElement as SocketInputElement<any>));
                            this.camera!.render(this.layoutManager.getLayout(), c);
                            this.engine.compile();
                        }

                    }
                        break;
                    case ContextType.paramInput: {
                        let paramElement = c.hoverElement as ParameterElement;
                        let prompt = 'Set parameter:\n';
                        if (paramElement.parameter.validValues)
                            prompt += `Valid values: ${paramElement.parameter.validValues.toString()}`;

                        let value: string | null = window.prompt(prompt);
                        if (value !== null) {
                            if (paramElement.parameter.validValues) {
                                if (!paramElement.parameter.validValues.includes(value))
                                    throw Error(`Invalid parameter: ${value}`);
                            }
                            paramElement.parameter.value = value;
                            this.camera!.render(this.layoutManager.getLayout(), c);
                            this.engine.compile();
                        }
                    }
                        break;
                }
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
            if (e.mouseButtonDown) {
                this.camera!.render(this.layoutManager.getLayout(), c);
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
                this.translateCameraAfterZoom(e.mousePosition!, e.mouseRawPosition!);
            }
        });

        this.input.addEventListener(InputEventType.keyUp, (e, c) => {
            switch (e.keyUp!) {
                case 'Delete':
                    if (c.active == ContextType.node) {
                        if (this.engine.deleteNode((c.activeElement as NodeElement).id)) {
                            this.layoutManager.generateLayout();
                            this.camera?.render(this.layoutManager.getLayout(), c);
                        }
                    }
                    this.context.updateContext(c.pointerPosition, new Vector2());
                    break;
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

    private setInputValue(value: string, input: SocketInputElement<any>) {
        switch (input.parent.socket.type) {
            case SocketType.bool:
                switch (value.toLowerCase().trim()) {
                    case 'true':
                        input.value = true;
                        break;
                    case 'false':
                        input.value = false;
                        break;
                    default:
                        throw Error(`Invalid input value: ${value}`);
                }
                break;
            case SocketType.float:
                input.value = Number.parseFloat(value);
                break;
            case SocketType.vector2:
                {
                    let regex: RegExp = /^\((?<x>[-+]?[0-9]*\.?[0-9]+),(?<y>[-+]?[0-9]*\.?[0-9]+)\)$/g;
                    let matches = [...value.matchAll(regex)];
                    if (matches.length != 1)
                        throw Error(`Invalid input value: ${value}`);
                    let x: number = Number.parseFloat(matches[0].groups!.x);
                    let y: number = Number.parseFloat(matches[0].groups!.y);
                    input.value = new Vector2(x, y);
                }
                break;
            case SocketType.vector3:
                {
                    let regex: RegExp = /^\((?<x>[-+]?[0-9]*\.?[0-9]+),(?<y>[-+]?[0-9]*\.?[0-9]+),(?<z>[-+]?[0-9]*\.?[0-9]+)\)$/g;
                    let matches = [...value.matchAll(regex)];
                    if (matches.length != 1)
                        throw Error(`Invalid input value: ${value}`);
                    let x: number = Number.parseFloat(matches[0].groups!.x);
                    let y: number = Number.parseFloat(matches[0].groups!.y);
                    let z: number = Number.parseFloat(matches[0].groups!.z);
                    input.value = new Vector3(x, y, z);
                }
                break;
            case SocketType.color:
                {
                    let regex: RegExp = /^\((?<r>[-+]?[0-9]*\.?[0-9]+),(?<g>[-+]?[0-9]*\.?[0-9]+),(?<b>[-+]?[0-9]*\.?[0-9]+)(,(?<a>[-+]?[0-9]*\.?[0-9]+))?\)$/g;
                    let matches = [...value.matchAll(regex)];
                    if (matches.length == 1) {
                        let r: number = Number.parseFloat(matches[0].groups!.r);
                        let g: number = Number.parseFloat(matches[0].groups!.g);
                        let b: number = Number.parseFloat(matches[0].groups!.b);
                        let a: number = Number.parseFloat(matches[0].groups!.a);
                        input.value = new ColorRGBA(r, g, b, a);
                    }
                    else {
                        if (matches.length > 1)
                            throw Error(`Invalid input value: ${value}`);
                        input.value = new ColorRGBA(value);
                    }
                }
        }
    }
}