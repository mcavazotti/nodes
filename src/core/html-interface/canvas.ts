/**
 * Interface that links a HTML canvas element to it's rendering context 
 */
export interface Canvas {
    element: HTMLCanvasElement,
    context: CanvasRenderingContext2D
}