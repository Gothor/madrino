class WallTile extends Selectable {

  constructor(content, value, x, y, w, h, callback, parent) {
    super(content, value, x, y, w, h, callback, parent);
  }

  draw() {
    if (this.selected) {
      noFill();
      stroke(0);
      rect(0, 0, this.dimensions.x, this.dimensions.y);
    }

    super.draw();
  }

}