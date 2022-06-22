class Vector2 {
    x: number;
    y: number;


    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }




    constructor(x?: number, y?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
    }

    copy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    sub(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    mult(v: Vector2): Vector2 {
        return new Vector2(this.x * v.x, this.y * v.y);
    }

    div(v: Vector2): Vector2 {
        return new Vector2(this.x / v.x, this.y / v.y);
    }

    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    scale(n: number): Vector2 {
        return new Vector2(this.x * n, this.y * n);
    }

    normalize(): Vector2 {
        if (this.length == 0) throw new Error("Can't normalize vector with length 0!");
        let l = this.length
        this.x /= l;
        this.y /= l;
        return this;
    }
}

class Vector3 {
    x: number;
    y: number;
    z: number;


    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }




    constructor(x?: number, y?: number, z?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
    }

    copy(): Vector3 {
        return new Vector3(this.x, this.y, this.z);
    }

    add(v: Vector3): Vector3 {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    mult(v: Vector3): Vector3 {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * this.z);
    }

    div(v: Vector3): Vector3 {
        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    }

    dot(v: Vector3): number {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    cross(v: Vector3): Vector3 {
        return new Vector3(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x)
    }

    scale(n: number): Vector3 {
        return new Vector3(this.x * n, this.y * n, this.z * n);
    }

    normalize(): Vector3 {
        if (this.length == 0) throw new Error("Can't normalize vector with length 0!");
        let l = this.length
        this.x /= l;
        this.y /= l;
        this.z /= l;
        return this;
    }
}

class Vector4 {
    x: number;
    y: number;
    z: number;
    w: number;


    get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }




    constructor(x?: number, y?: number, z?: number, w?: number) {
        this.x = x ?? 0;
        this.y = y ?? 0;
        this.z = z ?? 0;
        this.w = w ?? 0;
    }

    copy(): Vector4 {
        return new Vector4(this.x, this.y, this.z, this.w);
    }

    add(v: Vector4): Vector4 {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }

    sub(v: Vector4): Vector4 {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }

    mult(v: Vector4): Vector4 {
        return new Vector4(this.x * v.x, this.y * v.y, this.z * this.z, this.w * v.w);
    }

    div(v: Vector4): Vector4 {
        return new Vector4(this.x / v.x, this.y / v.y, this.z / v.z, this.w / v.w);
    }

    dot(v: Vector4): number {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    }

    scale(n: number): Vector4 {
        return new Vector4(this.x * n, this.y * n, this.z * n, this.w * n);
    }

    normalize(): Vector4 {
        if (this.length == 0) throw new Error("Can't normalize vector with length 0!");
        let l = this.length
        this.x /= l;
        this.y /= l;
        this.z /= l;
        this.w /= l;
        return this;
    }
}
export { Vector2, Vector3, Vector4 };