let gameObjects = [];

let currentCursor = "auto";
let nextCursor;

function resetCursor() {
  nextCursor = "auto";
}

function setCursor(cursor) {
  nextCursor = cursor;
}

let registerGlobalGameObject = object => {
  if (gameObjects.indexOf(object) < 0) {
    gameObjects.push(object);
  }
};

let unregisterGlobalGameObject = object => {
  let i = gameObjects.indexOf(object);
  if (i >= 0) {
    gameObjects.splice(i, 1);
  }
}

class GameObject {

  constructor(x, y, parent) {
    this.setParent(parent);
    this.localPosition = new p5.Vector(x, y);
    this.rotation = 0;
    this.scale = new p5.Vector(1, 1);
    this.components = [];
    this.children = [];
  }

  get globalPosition() {
    if (!this.parent) {
      return new p5.Vector(this.localPosition.x, this.localPosition.y);
    }

    return p5.Vector.add(this.parent.globalPosition, this.localPosition);
  }
  
  addChild(child) {
    child.setParent(null);
    
    child.parent = this;
    this.children.push(child);
    unregisterGlobalGameObject(child);
  }
  
  removeChild(child) {
    let i = this.children.indexOf(child);
    if (i < 0) return;
    
    child.parent = null;
    this.children.splice(i, 1);
    registerGlobalGameObject(child);
  }
  
  setParent(parent) {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    
    if (parent) {
      parent.addChild(this);
    } else {
      registerGlobalGameObject(this);
    }
  }

  addComponent(component) {
    this.components.push(component);
    component.setObject(this);
  }
  
  _draw() {
    push();
    translate(this.localPosition.x, this.localPosition.y);
    
    this.draw();
    
    for (let child of this.children) {
      child._draw();
    }

    pop();
  }

  draw() {
    throw "Method not implemented";
  }

  getComponentByName(name) {
    return this.components.find(c => c.name === name);
  }

  getComponent(type) {
    if (typeof(type) !== "function") {
      return this.components.find(c => typeof(c) === type);
    }

    return this.components.find(c => c instanceof type);
  }

  _onMove(x, y) {
    if (this.onMove) {
      this.onMove(x, y);
    }

    for (let child of this.children) {
      if (child._onMove) child._onMove(x, y);
    }
  }

}

class Component {

  constructor(name) {
    this.name = name;
  }

  setObject(object) {
    this.object = object;
  }

}

class Collider extends Component {

  constructor(name) {
    super(name);
  }

  collides(x, y) {
    throw "Method not implemented";
  }

}

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

class Rectangle extends Component {

  constructor(x, y, w, h) {
    super("Rectangle");
    this.localPosition = new p5.Vector(x, y);
    this.dimensions = new p5.Vector(w, h);
  }

  get globalPosition() {
    if (!this.parent) {
      return new p5.Vector(this.localPosition.x, this.localPosition.y);
    }

    return p5.Vector.add(this.parent.globalPosition, this.localPosition);
  }

  draw() {
    stroke(0);
    fill(150);
    rect(pos.x, pos.y, this.dimensions.x, this.dimensions.y);
  }

}

class Text extends Component {

  constructor(text, x, y, horizontalAlignment, verticalAlignment) {
    super("Text");
    this.text = text;
    this.localPosition = new p5.Vector(x, y);
    this.horizontalAlignment = horizontalAlignment;
    this.verticalAlignment = verticalAlignment;
  }

  get globalPosition() {
    if (!this.parent) {
      return new p5.Vector(this.localPosition.x, this.localPosition.y);
    }

    return p5.Vector.add(this.parent.globalPosition, this.localPosition);
  }

  draw() {
    noStroke();
    fill(0);
    textSize(24);
    textAlign(this.horizontalAlignment, this.verticalAlignment);
    text(this.text, 0, 0);
  }

}

class ImageComponent extends Component {

  constructor(sprite, x, y, w, h) {
    super("ImageComponent");
    this.sprite = sprite;
    this.localPosition = new p5.Vector(x, y);
    this.dimensions = new p5.Vector(w, h);
  }

  draw() {
    fill(255, 0, 0);
    stroke(0);
    this.sprite.draw(0, 0, this.dimensions.x, this.dimensions.y);
  }

}

class Clickable extends GameObject {

  constructor(x, y, w, h, parent) {
    super(x, y, parent);

    let collider = new RectangleCollider(0, 0, w, h);
    this.addComponent(collider);
  }

  _onClick(x, y) {
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

class Button extends Clickable {

  constructor(content, x, y, w, h, callback, parent) {
    super(x, y, w, h, parent);
    this.dimensions = new p5.Vector(w, h);
    this.onClick = callback;
    this.hovered = false;

    // Text
    if (typeof(content) === "string") {
      let rectangle = new Rectangle(0, 0, w, h);
      this.addComponent(rectangle);

      let text = new Text(content, w / 2, h / 2, CENTER, CENTER);
      this.addComponent(text);
    }
    // Sprite
    else if (content instanceof Sprite) {
      let image = new ImageComponent(content, 0, 0, w, h);
      this.addComponent(image);
    }
    // Error
    else {
      throw "Content type not supported";
    }
  }

  onMove(x, y) {
    if (this.getComponent(Collider).collides(x, y)) {
      this.hovered = true;
    } else {
      this.hovered = false;
    }
  }

  draw() {
    let content = this.getComponent(Text) || this.getComponent(ImageComponent);

    if (content instanceof Text) {
      this.getComponent(Rectangle).draw();
    }
    content.draw();

    if (this.hovered) {
      setCursor("pointer");
    }
  }

}

class Sprite {

  constructor(texture, x, y, width, height) {
    this.texture = texture;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(x, y, width, height) {
    push();
    translate(x, y);
    
    image(this.texture, 0, 0, width, height, this.x, this.y, this.width, this.height);

    pop();
  }

}

class SelectableGroup extends GameObject {

  constructor(x, y, selectables) {
    super(x, y);
    
    if (selectables instanceof Array && selectables.every(s => s instanceof Selectable)) {
      for (let selectable of selectables) {
        this.addChild(selectable);
      }
    } else if (selectables instanceof Selectable) {
      this.addChild(selectables);
    } else if (selectables) {
      throw "Selectable group can only contain Selectable objects";
    }
  }

  addChild(selectable) {
    if (selectable instanceof Selectable) {
      super.addChild(selectable);
    } else {
      throw "Selectable group can only contain Selectable objects";
    }
  }

  select(target) {
    for (let selectable of this.selectables) {
      if (selectable === target) {
        selectable.select();
      } else {
        selectable.deselect();
      }
    }
  }

  getSelected() {
    return this.children.find(s => s.selected);
  }

  clearSelection() {
    for (let selectable of this.selectables) {
      selectable.deselect();
    }
  }
  
  draw() {
    noStroke();
    fill(255, 150);

    rect(0, 0, 400, 450, 5);

    // Aides couleurs murs
    noStroke();
    fill(0, 150, 0);
    rect(25, 25, 50, 50);
    fill(210, 150, 0);
    rect(25, 75, 50, 50);
    fill(140, 135, 120);
    rect(25, 125, 50, 50);
    fill(200, 225, 255);
    rect(25, 175, 50, 50);
  
    // Aides couleurs meubles
    noStroke();
    fill(0, 150, 0);
    beginShape();
    vertex(25, 275);
    vertex(75, 275);
    vertex(25, 325);
    endShape();
    fill(210, 150, 0);
    beginShape();
    vertex(75, 275);
    vertex(75, 325);
    vertex(25, 325);
    endShape();
  }
  
  _onClick(x, y) {
    for (let child of this.children) {
      if (!child.selected && child._onClick(x, y)) {
        for (let c of this.children) {
          if (c !== child) {
            c.deselect();
          }
        }
        this._onChange();
        break;
      }
    }
  }
  
  _onChange() {
    if (this.onChange) {
      this.onChange();
    }
  }
  
  get value() {
    let selected = this.getSelected();
    if (selected) {
      return selected.value;
    }
    return null;
  }

}

class Selectable extends Button {

  constructor(content, value, x, y, w, h, callback, parent) {
    super(content, x, y, w, h, callback, parent);
    this.value = value;
    this.selected = false;
    this.onClick = () => {
      this.select();
      if (callback) {
        callback();
      }
    };
  }

  select() {
    this.selected = true;
  }

  deselect() {
    this.selected = false;
  }

  toggle() {
    this.selected = !this.selected;
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

class GridView extends Clickable {
  
  constructor(grid, x, y, w, h, parent) {
    super(x, y, w, h, parent);
    this.grid = grid;
  }

  draw() {
    noStroke();
    fill(255);
    rect(-25, -25, TILE_WIDTH * (8 + 0.25) + 75, TILE_WIDTH * (8 + 0.25) + 75);

    // Border
    stroke(200);
    for (let i = 0; i < this.grid.length + 1; i++) {
      line(0, TILE_WIDTH * (i + 0.25), TILE_WIDTH * (this.grid.length + 0.5), TILE_WIDTH * (i + 0.25));
      line(TILE_WIDTH * (i + 0.25), 0, TILE_WIDTH * (i + 0.25), TILE_WIDTH * (this.grid.length + 0.5));
    }

    // Axis
    stroke(150);
    fill(150)
    ellipse(TILE_WIDTH * 4.25, TILE_WIDTH * 4.25, 5);
    line(0, TILE_WIDTH * 4.25, TILE_WIDTH * (this.grid.length + 0.5), TILE_WIDTH * 4.25);
    line(TILE_WIDTH * 4.25, 0, TILE_WIDTH * 4.25, TILE_WIDTH * (this.grid.length + 0.5));
    line(TILE_WIDTH * 1.25, TILE_WIDTH * 7.25, TILE_WIDTH * 7.25, TILE_WIDTH * 7.25);
    line(TILE_WIDTH * 7.25, TILE_WIDTH * 1.25, TILE_WIDTH * 7.25, TILE_WIDTH * 7.25);
    stroke(0, 150, 0);
    line(TILE_WIDTH * 1.25, TILE_WIDTH * 1.25, TILE_WIDTH * 7.25, TILE_WIDTH * 1.25);
    stroke(150, 0, 0);
    line(TILE_WIDTH * 1.25, TILE_WIDTH * 1.25, TILE_WIDTH * 1.25, TILE_WIDTH * 7.25);

    // Tiles
    translate(TILE_WIDTH / 4, TILE_WIDTH / 4);
    textAlign(CENTER, CENTER);
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        push();
        translate(TILE_WIDTH * x, TILE_WIDTH * y);

        for (let tile of this.grid[y][x]) {
          tile.draw(-TILE_WIDTH / 4, -TILE_WIDTH / 4);
        }

        pop();
      }
    }

    // Preview current tile
    if (mouseX - this.localPosition.x >= TILE_WIDTH / 4 && mouseX - this.localPosition.x < TILE_WIDTH / 4 + TILE_WIDTH * this.grid.length &&
      mouseY - this.localPosition.y >= TILE_WIDTH / 4 && mouseY - this.localPosition.y < TILE_WIDTH / 4 + TILE_WIDTH * this.grid.length) {

      let x = floor((mouseX - this.localPosition.x - TILE_WIDTH / 4) / TILE_WIDTH);
      let y = floor((mouseY - this.localPosition.y - TILE_WIDTH / 4) / TILE_WIDTH);

      push();
      translate(x * TILE_WIDTH, y * TILE_WIDTH);
      tint(255, 100);
      let playedTile = new PlayedTile(tileSelector.value, currentOrientation, currentFlip);
      playedTile.draw(-TILE_WIDTH / 4, -TILE_WIDTH / 4);

      pop();
    }
  }

  onClick(mouseX, mouseY) {
    if (mouseX - this.localPosition.x < TILE_WIDTH / 4 || mouseX - this.localPosition.x >= TILE_WIDTH / 4 + TILE_WIDTH * this.grid.length ||
      mouseY - this.localPosition.y < TILE_WIDTH / 4 || mouseY - this.localPosition.y >= TILE_WIDTH / 4 + TILE_WIDTH * this.grid.length) return;

    let x = floor((mouseX - this.localPosition.x - TILE_WIDTH / 4) / TILE_WIDTH);
    let y = floor((mouseY - this.localPosition.y - TILE_WIDTH / 4) / TILE_WIDTH);

    let playedTile = new PlayedTile(tileSelector.value, currentOrientation, currentFlip);
    this.grid.addMove(x, y, playedTile);
  }
  
}

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
          return new PlayedTile(tiles[t.tile], t.orientation, t.fliped)
        });
      }
    }

    return grid;
  }

}

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

class PlayedTile {

  constructor(tile, orientation, fliped) {
    this.tile = tile;
    this.orientation = ((orientation % 4) + 4) % 4;
    this.fliped = fliped;
  }

  draw(x, y) {
    push();
    translate(x, y);
    scale(SCALE);
    translate(this.tile.sprite.width / 2, this.tile.sprite.height / 2);
    rotate(this.orientation * PI / 2);
    if (this.fliped) {
      scale(1, -1);
    }
    translate(-this.tile.sprite.width / 2, -this.tile.sprite.height / 2);
    this.tile.draw(0, 0, 150, 150);
    pop();
  }

}