class Vector2 {
    constructor(x, y) {
        this.x = x !== null && x !== void 0 ? x : 0;
        this.y = y !== null && y !== void 0 ? y : 0;
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    copy() {
        return new Vector2(this.x, this.y);
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mult(v) {
        return new Vector2(this.x * v.x, this.y * v.y);
    }
    div(v) {
        return new Vector2(this.x / v.x, this.y / v.y);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    scale(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    normalize() {
        if (this.length == 0)
            throw new Error("Can't normalize vector with length 0!");
        let l = this.length;
        this.x /= l;
        this.y /= l;
        return this;
    }
}
export { Vector2 };
//# sourceMappingURL=vector.js.map