class GridView extends Clickable {
  
  constructor(grid, x, y, w, h, parent) {
    super(x, y, w, h, parent);
    this.dimensions = new p5.Vector(w, h);

    this.grid = grid;
    this.tileWidth = (this.dimensions.x - 40) / (this.grid.length + 0.5);

    for (let row of grid) {
      for (let cell of row) {
        for (let tile of cell) {
          tile.dimensions.x = this.tileWidth * 1.5;
          tile.dimensions.y = this.tileWidth * 1.5;
        }
      }
    }
  }

  draw() {
    noStroke();
    fill(255);
    rect(0, 0, this.dimensions.x, this.dimensions.y);

    translate(20, 20);

    // Border
    stroke(200);
    for (let i = 0; i < this.grid.length + 1; i++) {
      line(0, this.tileWidth * (i + 0.25), this.tileWidth * (this.grid.length + 0.5), this.tileWidth * (i + 0.25));
      line(this.tileWidth * (i + 0.25), 0, this.tileWidth * (i + 0.25), this.tileWidth * (this.grid.length + 0.5));
    }

    // Axis
    stroke(150);
    fill(150)
    ellipse(this.tileWidth * 4.25, this.tileWidth * 4.25, 5);
    line(0, this.tileWidth * 4.25, this.tileWidth * (this.grid.length + 0.5), this.tileWidth * 4.25);
    line(this.tileWidth * 4.25, 0, this.tileWidth * 4.25, this.tileWidth * (this.grid.length + 0.5));
    line(this.tileWidth * 1.25, this.tileWidth * 7.25, this.tileWidth * 7.25, this.tileWidth * 7.25);
    line(this.tileWidth * 7.25, this.tileWidth * 1.25, this.tileWidth * 7.25, this.tileWidth * 7.25);
    stroke(0, 150, 0);
    line(this.tileWidth * 1.25, this.tileWidth * 1.25, this.tileWidth * 7.25, this.tileWidth * 1.25);
    stroke(150, 0, 0);
    line(this.tileWidth * 1.25, this.tileWidth * 1.25, this.tileWidth * 1.25, this.tileWidth * 7.25);

    // Tiles
    translate(this.tileWidth / 4, this.tileWidth / 4);
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        push();
        translate(this.tileWidth * x, this.tileWidth * y);

        for (let tile of this.grid[y][x]) {
          tile.draw(-this.tileWidth / 4, -this.tileWidth / 4, this.tileWidth * 1.5, this.tileWidth * 1.5);
        }

        pop();
      }
    }

    // Preview current tile
    if (mouseX - 20 - this.localPosition.x >= this.tileWidth / 4 && mouseX - 20 - this.localPosition.x < this.tileWidth / 4 + this.tileWidth * this.grid.length &&
      mouseY - 20 - this.localPosition.y >= this.tileWidth / 4 && mouseY - 20 - this.localPosition.y < this.tileWidth / 4 + this.tileWidth * this.grid.length) {

      let x = floor((mouseX - 20 - this.localPosition.x - this.tileWidth / 4) / this.tileWidth);
      let y = floor((mouseY - 20 -this.localPosition.y - this.tileWidth / 4) / this.tileWidth);

      push();
      translate(x * this.tileWidth, y * this.tileWidth);
      tint(255, 100);
      let playedTile = new PlayedTile(tileSelector.getSelected().value, this.tileWidth * 1.5, this.tileWidth * 1.5, currentOrientation, currentFlip);
      playedTile.draw(-this.tileWidth / 4, -this.tileWidth / 4);

      pop();
    }
  }

  onClick(mouseX, mouseY) {
    if (mouseX - 20 - this.localPosition.x < this.tileWidth / 4 || mouseX - 20 - this.localPosition.x >= this.tileWidth / 4 + this.tileWidth * this.grid.length ||
      mouseY - 20 - this.localPosition.y < this.tileWidth / 4 || mouseY - 20 - this.localPosition.y >= this.tileWidth / 4 + this.tileWidth * this.grid.length) return;

    let x = floor((mouseX - 20 - this.localPosition.x - this.tileWidth / 4) / this.tileWidth);
    let y = floor((mouseY - 20 - this.localPosition.y - this.tileWidth / 4) / this.tileWidth);

    let playedTile = new PlayedTile(tileSelector.getSelected().value, this.tileWidth * 1.5, this.tileWidth * 1.5, currentOrientation, currentFlip);
    this.grid.addMove(x, y, playedTile);
  }
  
}