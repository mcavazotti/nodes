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

export { Vector2 };