let tilesTexture;
let tiles;
const POSITIONS = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
  center: 4
};
let initialTileWidth;
let initialTilePadding;
const TILE_WIDTH = 75;
const SCALE = TILE_WIDTH / 100;
const GRID_SIZE = 8;

let grid;
let config;
let currentOrientation = 0;
let currentFlip = false;
let tileSelector;
let backgroundImage;

function preload() {
  let configLoaded = data => {
    config = JSON.parse(data.join(""));
  };

  tilesTexture = loadImage("madrino.png");
  loadStrings("config.json", configLoaded);
  
  backgroundImage = loadImage("madrino_background.png");
}

function setup() {
  createCanvas(innerWidth, innerHeight);

  tiles = [];
  for (let desc of config.tiles) {
    let positions = desc.positions.map(p => POSITIONS[p]);
    let tile = new Tile(tilesTexture, desc.x, desc.y, config.tileWidth, config.tileHeight, positions, desc.type === "wall", desc.results);
    tiles.push(tile);
  }

  grid = Grid.fromLocalStorage();
  if (!grid) {
    grid = new Grid(8);
  }

  tileSelector = new SelectableGroup();
  tileSelector.onChange = () => {
    currentFlip = false;
    currentOrientation = 0;
  };
  // Walls
  let colors = ['v', 'j', 'g', 'b'];
  for (let c = 0; c < colors.length; c++) {
    let color = colors[c];
    for (let i = 1; i <= 6; i++) {
      let tile = tiles.find(t => t.isWall && t.results.find(r => r === i + color));
      let button = new Selectable(tile.sprite, tile, 750 + (i - 1) * 50, c * 50, 50, 50);
      tileSelector.addChild(button);
    }
  }

  // Facilities
  let facilities = tiles.filter(t => !t.isWall);
  for (let i = 1; i <= 6; i++) {
    let tilesFound = facilities.filter(t => t.results.find(r => r === i + 'v'));
    let x = 750 + floor((i-1) / 3) * 100;
    let y = 250 + ((i-1) % 3) * 50;
    for (let j = 0; j < tilesFound.length; j++) {
      let button = new Selectable(tilesFound[j].sprite, tilesFound[j], x + j * 50, y, 50, 50);
      tileSelector.addChild(button);
    }
  }
  tileSelector.children[0].select();
}

function draw() {
  background(220);
  
  image(backgroundImage, 0, 0, width, height, 0, 0, 1000, 1000);

  grid.draw();

  // Aides couleurs murs
  noStroke();
  fill(0, 150, 0);
  rect(700, 0, 50, 50);
  fill(210, 150, 0);
  rect(700, 50, 50, 50);
  fill(140, 135, 120);
  rect(700, 100, 50, 50);
  fill(200, 225, 255);
  rect(700, 150, 50, 50);

  // Aides couleurs meubles
  noStroke();
  fill(0, 150, 0);
  beginShape();
  vertex(700, 250);
  vertex(750, 250);
  vertex(700, 300);
  endShape();
  fill(210, 150, 0);
  beginShape();
  vertex(750, 250);
  vertex(750, 300);
  vertex(700, 300);
  endShape();

  for (let object of gameObjects) {
    object._draw();
  }
}

document.addEventListener("contextmenu", e => {
  e.preventDefault();
  return false;
});

function mousePressed() {
  if (mouseButton === RIGHT) {
    currentOrientation = (currentOrientation + 1) % 4;
  } else if (mouseButton === LEFT) {
    grid.onClick(mouseX, mouseY);

    for (let object of gameObjects) {
      if (object._onClick) {
        object._onClick(mouseX, mouseY);
      }
    }
  }
}

function keyPressed() {
  if (key === " ") {
    currentFlip = !currentFlip;
  } else if (key === "Backspace") {
    grid.cancel();
  } else if (key === "Escape") {
    grid = new Grid(8);
  }
}