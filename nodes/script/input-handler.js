export class InputHandler {
    constructor() { }
    getInstance() {
        if (!InputHandler.instance) {
            InputHandler.instance = new InputHandler();
        }
        return InputHandler.instance;
    }
}
//# sourceMappingURL=input-handler.js.map