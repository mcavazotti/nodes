import { Vector2 } from "../math/vector.js";
import { InputEventType } from "./input-events.js";
import { InputState } from "./input-state.js";

export class InputHandler {
    private static instance: InputHandler;
    private eventListeners: Map<InputEventType, ((e: InputState) => void)[]>;
    private inputState: InputState;

    
    public get mousePos() : Vector2 {
        return this.inputState.mousePosition!.copy();
    }
    

    private constructor() {
        this.eventListeners = new Map();
        this.inputState = {
            mousePosition: new Vector2(),
            mouseMovement: new Vector2(),
            mouseButtonDown: []
        };
    }

    public static getInstance(): InputHandler {
        if (!InputHandler.instance) {
            InputHandler.instance = new InputHandler();
        }

        return InputHandler.instance;
    }

    public addEventListener(type: InputEventType, func: (e: InputState) => void) {
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
                func(data);
            }
        }
    }

    public setState(state: InputState) {
        for (const key in state) {
            switch (key) {
                case 'mousePosition':
                    // console.log('old')
                    // console.log(this.inputState.mouseMovement)
                    // console.log('new')
                    // console.log(state[key])
                    this.inputState.mouseMovement = state[key]!.sub(this.inputState.mousePosition!);
                    this.inputState.mousePosition = state[key];
                    this.fireEvent(InputEventType.mousemove, {
                        ...this.inputState,
                        mouseMovement: this.inputState.mouseMovement!.copy(),
                        mousePosition: this.inputState.mousePosition!.copy()
                    })
                    break;
                case 'mouseButtonDown':
                    for (const button of state[key]!) {
                        if (this.inputState.mouseButtonDown!.indexOf(button) == -1)
                            this.inputState.mouseButtonDown!.push(button);
                    }
                    this.fireEvent(InputEventType.mousedown, {
                        ...this.inputState,
                        mouseMovement: this.inputState.mouseMovement!.copy(),
                        mousePosition: this.inputState.mousePosition!.copy()
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
                        mouseMovement: this.inputState.mouseMovement!.copy(),
                        mousePosition: this.inputState.mousePosition!.copy()
                    })
                default:
                    break;
            }
        }
    }
}