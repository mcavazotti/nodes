import { Camera } from "./render/camera";
import { Canvas } from "./core/html-interface/canvas";
import { Vector2 } from "./core/math/vector";
import { InputHandler } from "./input/input-handler";
import { MouseInputType } from "./input/input-types";
import { NodeEngine } from "./node/node-engine";
import { LayoutManager } from "./layout/layout-manager";
import { UiHandler } from "./ui/ui-handler";
import { ContextManager } from "./context/context-manager";


/**
 * Class that represents the node editor, with all of its functionalities.
 */
export class NodeEnviroment {
    /** Layer used to render the background */
    private bg: Canvas;
    /** Layer used to render all the nodes and their connections */
    private board: Canvas;
    /** Layer used to render UI elements */
    private ui: Canvas;
    /** Layer used to capture user interactions. It should be on top of all of the other canvas elements */
    private input: Canvas;
    private camera: Camera;
    private inputHandler: InputHandler;
    private engine: NodeEngine;
    private layoutManager: LayoutManager;
    private uiHandler: UiHandler
    private contextManager: ContextManager;

    /**
     * 
     * @param bg Canvas for background layer
     * @param board Canvas for board layer
     * @param input Canvas to capture user interaction. Should be on top of other canvas
     * @param uniforms Uniforms available for the shader
     * @param onCompile Callback for when the fragment shader source code is generated
     */
    constructor(bg: Canvas, board: Canvas, ui: Canvas, input: Canvas, uniforms: string[], onCompile:((fs:string)=> void)) {
        this.inputHandler = InputHandler.getInstance();
        this.engine = NodeEngine.getInstance();
        this.engine.setListener(onCompile);
        this.engine.setUniforms(uniforms);
        this.bg = bg;
        this.board = board;
        this.ui = ui;
        this.input = input;
        
        if (!(bg.element.width == board.element.width && bg.element.height == board.element.height))
        throw Error("Canvas elements must have the same size!");
        
        this.camera = new Camera(this.bg, this.board, this.ui);
        this.layoutManager = LayoutManager.getInstance(this.camera);
        this.uiHandler = UiHandler.getInstance(this.camera);
        this.contextManager = ContextManager.getInstance();

    }

    /**
     * Starts the node editor.
     * 
     * The editor is reactive, that means that it only responds to user interaction. This interaction is captured through HTMLElement's `addEventListener`.
     * 
     * Besides setting up the listeners in the input canvas, it also processes the events and sends them to the InputHandler.
     * 
     * This method also calls `Camera.render()` on specific types of events.
     */
    start() {
        this.layoutManager.generateLayout(this.engine.nodes);
        this.camera.render(this.layoutManager.getLayout(),this.contextManager.context );

        this.input.element.addEventListener("contextmenu", (event) => {
            event.preventDefault();
        });

        this.input.element.addEventListener("mousemove", (event) => {
            let rect = this.input.element.getBoundingClientRect()
            let vec = new Vector2(event.clientX - rect.left, event.clientY - rect.top);
            let transformedVec = this.camera.convertRasterCoordToWorld(vec);

            this.inputHandler.setState({ mousePosition: transformedVec, mouseRawPosition: vec });
            this.camera.render(this.layoutManager.getLayout(), this.contextManager.context);
        });

        this.input.element.addEventListener("mousedown", (event) => {

            var mouseButton: MouseInputType | null = null;

            switch (event.button) {
                case 0:
                    mouseButton = MouseInputType.leftButton;
                    break;
                case 1:
                    mouseButton = MouseInputType.middleButton;
                    break;
                case 2:
                    mouseButton = MouseInputType.rightButton;
                    break;

                default:
                    break;
            }
            if (mouseButton != null){
                this.inputHandler.setState({ mouseButtonDown: [mouseButton] })
                this.camera.render(this.layoutManager.getLayout(), this.contextManager.context);   
            }
        });

        this.input.element.addEventListener("mouseup", (event) => {

            var mouseButton: MouseInputType | null = null;

            switch (event.button) {
                case 0:
                    mouseButton = MouseInputType.leftButton;
                    break;
                case 1:
                    mouseButton = MouseInputType.middleButton;
                    break;
                case 2:
                    mouseButton = MouseInputType.rightButton;
                    break;

                default:
                    break;
            }
            if (mouseButton != null)
                this.inputHandler.setState({ mouseButtonUp: [mouseButton] })
        });

        this.input.element.addEventListener("wheel", (event) => {
            let wheelDirection = event.deltaY < 0 ? MouseInputType.scrollUp: MouseInputType.scrollDown;
            this.inputHandler.setState({mouseScroll: wheelDirection});

            this.camera.render(this.layoutManager.getLayout(), this.contextManager.context);

        });
    }

}
