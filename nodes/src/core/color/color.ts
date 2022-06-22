import { Vector3, Vector4 } from "../math/vector.js";

class ColorRGB extends Vector3 {
    constructor(r: number, g: number, b: number) {
        super(r, g, b);
    }

    get r(): number {
        return this.x;
    }
    set r(r: number) {
        this.x = r;
    }

    get g(): number {
        return this.y;
    }
    set g(g: number) {
        this.y = g;
    }

    get b(): number {
        return this.z;
    }
    set b(b: number) {
        this.z = b;
    }

}

class ColorRGBA extends Vector4 {
    constructor(r: number, g: number, b: number, a: number) {
        super(r, g, b, a);
    }

    get r(): number {
        return this.x;
    }
    set r(r: number) {
        this.x = r;
    }

    get g(): number {
        return this.y;
    }
    set g(g: number) {
        this.y = g;
    }

    get b(): number {
        return this.z;
    }
    set b(b: number) {
        this.z = b;
    }

    get a(): number {
        return this.z;
    }
    set a(a: number) {
        this.z = a;
    }

}

export { ColorRGB, ColorRGBA }