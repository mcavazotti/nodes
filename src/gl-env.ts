export class GlEnviroment {
    canvas: HTMLCanvasElement;
    gl: WebGL2RenderingContext;
    positionBuffer: WebGLBuffer;

    private vertexShaderSrc = `
    attribute vec2 aVertexPos;
    
    void main() {
        gl_Position = vec4(aVertexPos,0,1);
    }
    `;

    readonly uniforms: string[] = [
        "vec2 uResolution;"
    ];

    private vertexShader: WebGLShader;
    private fragmentShader?: WebGLShader;
    private program?: WebGLProgram;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        let gl = this.canvas.getContext("webgl2");
        if (!gl)
            throw Error("WebGL 2 not supported in this browser");

        this.gl = gl;

        this.positionBuffer = gl.createBuffer()!;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        const positions = [
            1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            -1.0, -1.0,
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this.vertexShader = this.loadShader(this.gl.VERTEX_SHADER, this.vertexShaderSrc);

    }

    private loadShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);

        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            let error = Error(`An error occurred compiling the shader: ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            throw error;
        }

        return shader;
    }

    private createProgram() {
        if (this.program)
            this.gl.deleteProgram(this.program);

        if (this.fragmentShader) {
            this.program = this.gl.createProgram()!;
            this.gl.attachShader(this.program, this.vertexShader);
            this.gl.attachShader(this.program, this.fragmentShader);
            this.gl.linkProgram(this.program);
            if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
                let error = Error(`Unable to initialize the shader program: ${this.gl.getProgramInfoLog(this.program)}`);
                delete this.program;
                throw error;
            }
        }
    }

    render() {
        if (!this.program)
            throw Error("Program not loaded");


        let vertexPosition = this.gl.getAttribLocation(this.program, 'aVertexPos');
        
        let uResPosition = this.gl.getUniformLocation(this.program,"uResolution");
        this.gl.uniform2f(uResPosition,this.canvas.width!,this.canvas.height!);

        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(vertexPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(vertexPosition);
        this.gl.useProgram(this.program);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    refreshProgram(fragShaderSrc: string) {
        console.log(fragShaderSrc)
        this.fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragShaderSrc);
        this.createProgram();
        this.render();
    }
}