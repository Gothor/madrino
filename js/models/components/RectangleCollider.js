class RectangleCollider extends Collider {

  constructor(x, y, w, h) {
    super("RectangleCollider");
    this.localPosition = new p5.Vector(x, y);
    this.dimensions = new p5.Vector(w, h);
  }

  get globalPosition() {
    if (!this.object) {
      throw "Component not attached to an object";
    }

    return p5.Vector.add(this.object.globalPosition, this.localPosition);
  }

  doesNotCollide(x, y) {
    let pos = this.globalPosition;
    return x < pos.x || x >= pos.x + this.dimensions.x ||
      y < pos.y || y >= pos.y + this.dimensions.y;
  }

  collides(x, y) {
    return !this.doesNotCollide(x, y);
  }

}