const server = 'https://tranquil-sierra-03589.herokuapp.com/';
// const server = 'http://tranquil-sierra-03589.herokuapp.com';
// const server = 'http://localhost:5000/';
// const server = 'http://192.168.0.22:5000/';
let socket = io.connect(server);

let role = null;

const roleElement = document.getElementById('role');
const diceRollerElement = document.getElementById('rollDice');
const diceResultsElement = document.getElementById('diceResults');

socket.on('role', newRole => {
    role = newRole;
    console.log('role:' + (role === 0 ? 'admin' : 'player'));
});
socket.on('diceResults', results => {
    tileSelector.selectWalls(results);
});














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
let gridView;
let greenDieImage

function preload() {
  let configLoaded = data => {
    config = JSON.parse(data.join(""));
  };

  tilesTexture = loadImage("img/madrino.png");
  loadStrings("config.json", configLoaded);
  
  backgroundImage = loadImage("img/madrino_background.png");

  greenDieImage = loadImage("img/green-die.png");
  yellowDieImage = loadImage("img/yellow-die.png");
  greyDieImage = loadImage("img/grey-die.png");
  blueDieImage = loadImage("img/blue-die.png");
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

  let gridSize = Math.min(height * 0.75 - 40, width - 40);
  let gridX = (width - gridSize) / 2;
  let gridY = (height * 0.75 - gridSize) / 2;
  gridView = new GridView(grid, gridX, gridY, gridSize, gridSize);

  tileSelector = new TileSelector(gridX - 20, height * 0.75, gridSize + 40, height * 0.25);
  tileSelector.on('change', () => {
    currentFlip = false;
    currentOrientation = 0;
  });
  // Walls
  let colors = ['v', 'j', 'g', 'b'];
  for (let c = 0; c < colors.length; c++) {
    let color = colors[c];
    for (let i = 1; i <= 6; i++) {
      let tile = tiles.find(t => t.isWall && t.results.find(r => r === i + color));
      let button = new WallTile(tile.sprite, tile, 75 + (i - 1) * 50, 25 + c * 50, 50, 50);
      tileSelector.addItem(button);
    }
  }

  // Facilities
  let facilities = tiles.filter(t => !t.isWall);
  for (let i = 1; i <= 6; i++) {
    let tilesFound = facilities.filter(t => t.results.find(r => r === i + 'v'));
    let x = 75 + floor((i-1) / 3) * 100;
    let y = 275 + ((i-1) % 3) * 50;
    for (let j = 0; j < tilesFound.length; j++) {
      let button = new WallTile(tilesFound[j].sprite, tilesFound[j], x + j * 50, y, 50, 50);
      tileSelector.addItem(button);
    }
  }

  tileSelector.selectRandomWalls();
}

function draw() {
  resetCursor();
  
  image(backgroundImage, 0, 0, width, height, 0, 0, 1000, 1000);

  textAlign(LEFT, TOP);
  text("Espace : Symétrie\nClic droit : Rotation\nRetour arrière : Annuler le dernier mouvement\nÉchap : Vider le plan", 0, 0);

  for (let object of gameObjects) {
    object._draw();
  }

  if (currentCursor != nextCursor) {
    document.body.style.cursor = nextCursor;
    currentCursor = nextCursor;
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
    for (let object of gameObjects) {
      if (object._onClick) {
        object._onClick(mouseX, mouseY);
      }
    }
  }
}

function mouseMoved() {
  for (let object of gameObjects) {
    if (object._onMove) {
      object._onMove(mouseX, mouseY);
    }
  }
}

function keyPressed() {
  if (key === " ") {
    currentFlip = !currentFlip;
  } else if (key === "Backspace") {
    grid.cancelLastMove();
  } else if (key === "Escape") {
    grid = new Grid(8);
    gridView.grid = grid;
  } else if (key === "r" && role === 0) {
    // tileSelector.selectRandomWalls();
    socket.emit('rollDice');
  }
}