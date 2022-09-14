import { Vector2 } from "../core/math/vector";
import { ContextType } from "../context/context-types";
import { InputEventType } from "./input-events";
import { InputState } from "./input-state";
import { ContextManager } from "../context/context-manager";
import { ContextData } from "../context/context-data";

export class InputHandler {
    private static instance: InputHandler;
    private eventListeners: Map<InputEventType, ((e: InputState, c: ContextData) => void)[]>;
    private inputState: InputState;
    private context: ContextManager;


    public get mousePos(): Vector2 {
        return this.inputState.mousePosition!.copy();
    }


    private constructor() {
        this.eventListeners = new Map();
        this.inputState = {
            mousePosition: new Vector2(),
            mouseMovement: new Vector2(),
            mouseButtonDown: [],
            mouseScroll: null,
            keysDown: new Set()
        };
        this.context = ContextManager.getInstance();
    }

    public static getInstance(): InputHandler {
        if (!InputHandler.instance) {
            InputHandler.instance = new InputHandler();
        }

        return InputHandler.instance;
    }

    public addEventListener(type: InputEventType, func: (e: InputState, c: ContextData) => void, focus: ContextType = ContextType.any, activeContext: ContextType = ContextType.any) {
        if (this.eventListeners.has(type)) {
            let listeners = this.eventListeners.get(type)!;
            listeners.push(func);
            this.eventListeners.set(type, listeners);
        } else {
            this.eventListeners.set(type, [func]);
        }
    }

    public fireEvent(type: InputEventType, data: InputState) {
        if (this.eventListeners.has(type)) {
            for (const func of this.eventListeners.get(type)!) {
                func(data, this.context.context);
            }
        }
    }

    public setState(state: InputState) {
        this.inputState.mouseScroll = null;
        for (const key in state) {
            switch (key) {
                case 'mousePosition':
                    this.inputState.mouseMovement = state.mousePosition!.sub(this.inputState.mousePosition!);
                    this.inputState.mousePosition = state.mousePosition;
                    this.inputState.mouseRawPosition = state.mouseRawPosition;
                    this.context.updateContext(state.mousePosition!, state.mouseRawPosition!);
                    // console.log(this.context.context.hover);
                    this.fireEvent(InputEventType.mousemove, {
                        ...this.inputState,
                    })
                    break;
                case 'mouseButtonDown':
                    for (const button of state[key]!) {
                        if (this.inputState.mouseButtonDown!.indexOf(button) == -1)
                            this.inputState.mouseButtonDown!.push(button);
                    }
                    this.fireEvent(InputEventType.mousedown, {
                        ...this.inputState,
                    })
                    break;
                case 'mouseButtonUp':
                    for (const button of state[key]!) {
                        let idx = this.inputState.mouseButtonDown!.indexOf(button);
                        if (idx != -1)
                            this.inputState.mouseButtonDown!.splice(idx, 1);
                    }
                    this.fireEvent(InputEventType.mouseup, {
                        ...this.inputState,
                    })
                case 'mouseScroll':
                    this.inputState.mouseScroll = state.mouseScroll;
                    this.fireEvent(InputEventType.mousewheel, { ...this.inputState });
                default:
                    break;
            }
        }
    }

    public keyDown(key: string) {
        this.inputState.keysDown!.add(key);
        this.fireEvent(InputEventType.keyDown, { ...this.inputState })
    }
    public keyUp(key: string) {
        this.inputState.keysDown!.delete(key);
        this.fireEvent(InputEventType.keyUp, { ...this.inputState, keyUp: key })
    }
}