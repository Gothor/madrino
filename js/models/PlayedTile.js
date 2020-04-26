class PlayedTile {

  constructor(tile, w, h, orientation, fliped) {
    this.tile = tile;
    this.orientation = ((orientation % 4) + 4) % 4;
    this.fliped = fliped;
    this.dimensions = new p5.Vector(w, h);
  }

  draw(x, y) {
    push();
    translate(x, y);
    translate(this.dimensions.x / 2, this.dimensions.y / 2);
    rotate(this.orientation * PI / 2);
    if (this.fliped) {
      scale(1, -1);
    }
    translate(-this.dimensions.x / 2, -this.dimensions.y / 2);
    this.tile.draw(0, 0, this.dimensions.x, this.dimensions.y);
    pop();
  }

}