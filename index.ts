
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface Tile2 {
  isAir(): boolean;
  isFlux(): boolean;
  isUnbreakable(): boolean;
  isPlayer(): boolean;
  isStone(): boolean;
  isFallingStone(): boolean;
  isBox(): boolean;
  isFallingBox(): boolean;
  isKey1(): boolean;
  isLock1(): boolean;
  isKey2(): boolean;
  isLock2(): boolean;
}

class Air implements Tile2 {
  isAir() { return true; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class Flux implements Tile2 {
  isAir() { return false; }
  isFlux() { return true;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class Unbreakable implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return true;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class Player implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return true;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class Stone implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return true;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class FallingStone implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return true;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class Box implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return true;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class FallingBox implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return true;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return false;}
}

class Key2 implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return true;}
  isLock2() { return false;}
}

class Lock2 implements Tile2 {
  isAir() { return false; }
  isFlux() { return false;}
  isUnbreakable() { return false;}
  isPlayer() { return false;}
  isStone() { return false;}
  isFallingStone() { return false;}
  isBox() { return false;}
  isFallingBox() { return false;}
  isKey1() { return false;}
  isLock1() { return false;}
  isKey2() { return false;}
  isLock2() { return true;}
}

enum RawInput {
  UP, DOWN, LEFT, RIGHT
}

interface Input {
  isRight(): boolean;
  isLeft(): boolean;
  isUp(): boolean;
  isDown(): boolean;
  handle(): void;
}

class Right implements Input {
  isRight() { return true;}
  isLeft() { return false;}
  isUp(): boolean { return false;}
  isDown(): boolean { return false;}
  handle() { moveHorizontal(1); }
}

class Left implements Input {
  isRight() { return false;}
  isLeft() { return true;}
  isUp(): boolean { return false;}
  isDown(): boolean { return false;}
  handle() { moveHorizontal(-1); }
}

class Up implements Input {
  isRight() { return false;}
  isLeft() { return false;}
  isUp(): boolean { return true;}
  isDown(): boolean { return false;}
  handle() { moveVertical(-1); }
}

class Down implements Input {
  isRight() { return false;}
  isLeft() { return false;}
  isUp(): boolean { return false;}
  isDown(): boolean { return true;}
  handle() { moveVertical(1); }
}

let playerx = 1;
let playery = 1;
let map: Tile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let inputs: Input[] = [];

function remove(tile: Tile) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === tile) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx] = new Air();
  map[newy][newx] = new Player();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  if (map[playery][playerx + dx].isFlux()
    || map[playery][playerx + dx].isAir()) {
    moveToTile(playerx + dx, playery);
  } else if ((map[playery][playerx + dx].isStone()
    || map[playery][playerx + dx].isBox())
    && map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
    map[playery][playerx + dx + dx] = map[playery][playerx + dx];
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey1()) {
    remove(RawTile.LOCK1);
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey2()) {
    remove(RawTile.LOCK2);
    moveToTile(playerx + dx, playery);
  }
}

function moveVertical(dy: number) {
  if (map[playery + dy][playerx].isFlux()
    || map[playery + dy][playerx].isAir()) {
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey1()) {
    remove(RawTile.LOCK1);
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey2()) {
    remove(RawTile.LOCK2);
    moveToTile(playerx, playery + dy);
  }
}

function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateTile(x: number, y: number) {
  if ((map[y][x].isStone() || map[y][x].isFallingStone())
    && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingStone();
    map[y][x] = new Air();
  } else if ((map[y][x].isBox() || map[y][x].isFallingBox())
    && map[y + 1][x].isAir()) {
    map[y + 1][x] = new FallingBox();
    map[y][x] = new Air();
  } else if (map[y][x].isFallingStone()) {
    map[y][x] = new Stone();
  } else if (map[y][x].isFallingBox()) {
    map[y][x] = new Box();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(x, y);
    }
  }
}

function update() {
  handleInputs();
  updateMap();
}

function createGraphics() {
  let canvas = document.getElementById("GameCanvas") as HTMLCanvasElement;
  let g = canvas.getContext("2d");

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  let g = createGraphics();
  drawMap(g);
  drawPlayer(g);
}

function drawMap(g: CanvasRenderingContext2D) {
  // Draw map
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      colorOfTile(g, x, y);
      
      if (!map[y][x].isAir() && !map[y][x].isPlayer())
        g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}

function colorOfTile(g: CanvasRenderingContext2D, x: number, y: number) {
  if (map[y][x].isFlux())
    g.fillStyle = "#ccffcc";
  else if (map[y][x].isUnbreakable())
    g.fillStyle = "#999999";
  else if (map[y][x].isStone() || map[y][x].isFallingStone())
    g.fillStyle = "#0000cc";
  else if (map[y][x].isBox() || map[y][x].isFallingBox())
    g.fillStyle = "#8b4513";
  else if (map[y][x].isKey1() || map[y][x].isLock1())
    g.fillStyle = "#ffcc00";
  else if (map[y][x].isKey2() || map[y][x].isLock2())
    g.fillStyle = "#00ccff";
}

function drawPlayer(g: CanvasRenderingContext2D) {
  // Draw player
  g.fillStyle = "#ff0000";
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function gameLoop() {
  let before = Date.now();
  update();
  draw();
  let after = Date.now();
  let frameTime = after - before;
  let sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  gameLoop();
}

const LEFT_KEY = "ArrowLeft";
const UP_KEY = "ArrowUp";
const RIGHT_KEY = "ArrowRight";
const DOWN_KEY = "ArrowDown";
window.addEventListener("keydown", e => {
  if (e.key === LEFT_KEY || e.key === "a") inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === "w") inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === "d") inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === "s") inputs.push(new Down());
});
