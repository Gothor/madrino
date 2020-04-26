class Tile {

  constructor(texture, x, y, width, height, positions, isWall, results) {
    this.sprite = new Sprite(texture, x, y, width, height);
    this.positions = positions.slice(0);
    this.isWall = isWall;
    this.results = results;
  }

  draw(x, y, width, height) {
    this.sprite.draw(x, y, width, height);
  }

}