class TileSelector extends GameObject {

  constructor(x, y, w, h, selectables) {
    super(x, y, selectables);
    this.dimensions = new p5.Vector(w, h);

    this.selectableGroup = new SelectableGroup(selectables);

    let greenDie = new Sprite(greenDieImage, 0, 0, 290, 290);
    let yellowDie = new Sprite(yellowDieImage, 0, 0, 290, 290);
    let greyDie = new Sprite(greyDieImage, 0, 0, 290, 290);
    let blueDie = new Sprite(blueDieImage, 0, 0, 290, 290);
    this.wallDice = [greenDie, yellowDie, greyDie, blueDie];
  }

  addItem(item) {
    this.selectableGroup.addItem(item);
    this.addChild(item);
  }

  getSelected() {
    return this.selectableGroup.getSelected();
  }

  selectRandomWalls() {
    let results = [];

    for (let i = 0; i < 4; i++) {
      results.push(Math.ceil(Math.random() * 6));
    }

    this.selectWalls(results);
  }

  selectWalls(results) {
    let walls = [];

    let colors = ['v', 'j', 'g', 'b'];
    for (let i = 0; i < colors.length; i++) {
      let result = results[i] + colors[i];
      let wall = this.children.find(child => {
        let tile = child.value;
        // TODO Get rid of this walls.includes(child) and create a Dice model
        return tile.isWall && !walls.includes(child) && tile.results.includes(result);
      });
      walls.push(wall);
    }

    this.setAvailableWalls(walls);
  }

  setAvailableWalls(walls) {
    for (let wall of this.children) {
      wall.active = walls.includes(wall);
    }
    walls[0].select();

    let dieSize = this.dimensions.y / 3 - 20;
    let gutter = dieSize;

    let origX = (this.dimensions.x - (dieSize * this.wallDice.length + gutter * (this.wallDice.length - 1))) / 2;

    for (let i = 0; i < walls.length; i++) {
      walls[i].setPosition(origX + (dieSize + gutter) * i, this.dimensions.y / 3);
      walls[i].setDimensions(dieSize, dieSize);
    }
  }
  
  draw() {
    let dieSize = this.dimensions.y / 3 - 20;
    let spriteSize = dieSize * (290 / 150);
    let margin = (spriteSize - dieSize) / 2;
    let gutter = dieSize;

    push();
    translate((this.dimensions.x - (dieSize * this.wallDice.length + gutter * (this.wallDice.length - 1))) / 2, 10);
    textAlign(CENTER, CENTER);
    textSize(32);
    noStroke();
    fill(255);
    for (let i = 0; i < this.wallDice.length; i++) {
      let die = this.wallDice[i];
      push();

      // Draw die
      translate((dieSize + gutter) * i - margin, 0 - margin);
      die.draw(0, 0, spriteSize, spriteSize);

      // Draw text
      translate(margin + dieSize / 2, margin + dieSize / 2);
      text((i + 1).toString(), 0, dieSize / 20);

      pop();
    }
    pop();
  }

}