class Clickable extends GameObject {

  constructor(x, y, w, h, parent) {
    super(x, y, parent);

    let collider = new RectangleCollider(0, 0, w, h);
    this.addComponent(collider);
  }

  _onClick(x, y) {
    if (!this.active) return;

    let collider = this.getComponent(Collider);
    if (!collider) return false;
    if (collider.doesNotCollide(x, y)) return false;

    this.onClick(x, y);
    return true;
  }

  onClick() {
    return "Method not implemented";
  }

}