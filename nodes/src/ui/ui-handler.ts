import { ContextManager } from '../context/context-manager.js';
import { ContextType } from '../context/context-types.js';
import { InputEventType } from '../input/input-events.js';
import { InputHandler } from '../input/input-handler.js';
import { Camera } from '../render/camera.js'

export class UiHandler {
    private static instance: UiHandler;

    private camera: Camera | null = null;
    private input: InputHandler;
    private context: ContextManager;

    private constructor() {
        this.input = InputHandler.getInstance();
        this.context = ContextManager.getInstance();

        this.input.addEventListener(InputEventType.mousedown, (e, c) => {
            console.log('aqui')
            this.context.setActive();

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