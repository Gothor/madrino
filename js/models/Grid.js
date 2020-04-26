class Grid extends Array {

  constructor(size) {
    super(size);
    for (let y = 0; y < this.length; y++) {
      this[y] = Array(8);
      for (let x = 0; x < this[y].length; x++) {
        this[y][x] = [];
      }
    }

    this.moves = [];
  }

  cancelLastMove() {
    if (this.moves.length <= 0) return;

    let move = this.moves.pop();
    this[move.y][move.x].pop();

    this.toLocalStorage();
  }

  addMove(x, y, tile) {
    this[y][x].push(tile);
    this.moves.push({ x, y });

    this.toLocalStorage();
  }

  toLocalStorage() {
    let g = Array(this.length);
    for (let y = 0; y < this.length; y++) {
      g[y] = Array(this[y].length);
      for (let x = 0; x < this[y].length; x++) {
        g[y][x] = this[y][x].map(t => {
          return {
            tile: tiles.indexOf(t.tile),
            orientation: t.orientation,
            fliped: t.fliped
          };
        });
      }
    }

    localStorage.setItem("grid", JSON.stringify(g));
  }

  static fromLocalStorage() {
    let lsGrid = localStorage.getItem("grid");
    if (!lsGrid) return null;

    lsGrid = JSON.parse(lsGrid);

    let grid = new Grid(lsGrid.length);
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        grid[y][x] = lsGrid[y][x].map(t => {
          return new PlayedTile(tiles[t.tile], 0, 0, t.orientation, t.fliped)
        });
      }
    }

    return grid;
  }

}