
const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

interface FallingState {
  isFalling(): boolean;
  isResting(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}
class Falling implements FallingState {
  isFalling() {return true; }
  isResting() {return false; }
  moveHorizontal(tile: Tile, dx: number) {}
}
class Resting implements FallingState {
  isFalling() {return false; }
  isResting() {return true; }
  moveHorizontal(tile: Tile, dx: number) {
    if (map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
      map[playery][playerx + dx + dx] = tile;
      moveToTile(playerx + dx, playery);
    }
  }
}

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

interface Tile {
  isAir(): boolean;
  // isFallingStone(): boolean;
  // isFallingBox(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  // isEdible(): boolean;
  // isPushable(): boolean;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  // isStony(): boolean;
  // isBoxy(): boolean;
  // drop(): void;
  // rest(): void;
  // isFalling(): boolean;
  canFall(): boolean;
  update(x: number, y: number): void;
}

class Air implements Tile {
  isAir() { return true; }
  // isFallingStone() { return false; }
  // isFallingBox() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  // isEdible() { return true; }
  // isPushable() { return false; }
  moveHorizontal(dx: number)  {
    moveToTile(playerx + dx, playery);
  }  
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  }
  // isStony() { return false; }
  // isBoxy() { return false; }
  // drop() {}
  // rest() {}
  // isFalling() { return false; }
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Flux implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ccffcc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number)  {
    moveToTile(playerx + dx, playery);
  }
  moveVertical(dy: number) {
    moveToTile(playerx, playery + dy);
  } 
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Unbreakable implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#999999";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {} 
  moveVertical(dy: number) {}
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Player implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {}
  moveHorizontal(dx: number) {} 
  moveVertical(dy: number) {}
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;
  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#0000cc";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    this.fallStrategy.getFalling().moveHorizontal(this, dx);
  }
  moveVertical(dy: number) {}
  canFall() { return true; }
  update(x: number, y: number) {
    this.fallStrategy.update(this, x, y);
  }
}

class Box implements Tile {
  constructor(private falling: FallingState) {}
  isAir() { return false; }
  // isFallingStone() { return false; }
  // isFallingBox() { return this.falling.isFalling(); }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#8b4513";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  // isEdible() { return false; }
  // isPushable() { return true; }
  moveHorizontal(dx: number) {
    this.falling.moveHorizontal(this, dx);
  }
  moveVertical(dy: number) {}
  // isFalling() { return true; }
  canFall() { return true; }
  update(x: number, y: number) {
    if (map[y + 1][x].isAir()) {
      this.falling = new Falling();
      map[y + 1][x] = this;
      map[y][x] = new Air();
    } else if (this.falling.isFalling()) {
      this.falling = new Resting();
    }
  }
}

class Key1 implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  } 
  moveVertical(dy: number) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Lock1 implements Tile {
  isAir() { return false; }
  isLock1() { return true; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#ffcc00";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {} 
  moveVertical(dy: number) {}
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Key2 implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return false; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  } 
  moveVertical(dy: number) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  }
  canFall() { return false; }
  update(x: number, y: number) {}
}

class Lock2 implements Tile {
  isAir() { return false; }
  isLock1() { return false; }
  isLock2() { return true; }
  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = "#00ccff";
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  moveHorizontal(dx: number) {} 
  moveVertical(dy: number) {}
  canFall() { return false; }
  update(x: number, y: number) {}
}

class FallStrategy {
  constructor( private falling: FallingState) {}
  getFalling() { return this.falling; }
  update(tile: Tile, x: number, y: number) {
    if (map[y + 1][x].isAir()) {
      this.falling = new Falling();
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    } else if (this.falling.isFalling()) {
      this.falling = new Resting();
    }
  }
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
  isRight() { return true; }
  isLeft() { return false; }
  isUp(): boolean { return false; }
  isDown(): boolean { return false; }
  handle() { moveHorizontal(1); }
}

class Left implements Input {
  isRight() { return false; }
  isLeft() { return true; }
  isUp(): boolean { return false; }
  isDown(): boolean { return false; }
  handle() { moveHorizontal(-1); }
}

class Up implements Input {
  isRight() { return false; }
  isLeft() { return false; }
  isUp(): boolean { return true; }
  isDown(): boolean { return false; }
  handle() { moveVertical(-1); }
}

class Down implements Input {
  isRight() { return false; }
  isLeft() { return false; }
  isUp(): boolean { return false; }
  isDown(): boolean { return true; }
  handle() { moveVertical(1); }
}

let playerx = 1;
let playery = 1;
let rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

let map: Tile[][];

function assertExhausted(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function transformTile(tile: RawTile) {
  switch (tile) {
    case RawTile.AIR: return new Air();
    case RawTile.FLUX: return new Flux();
    case RawTile.UNBREAKABLE: return new Unbreakable();
    case RawTile.PLAYER: return new Player();
    case RawTile.STONE: return new Stone(new Resting());
    case RawTile.FALLING_STONE: return new Stone(new Falling());
    case RawTile.BOX: return new Box(new Resting());
    case RawTile.FALLING_BOX: return new Box(new Falling());
    case RawTile.KEY1: return new Key1();
    case RawTile.LOCK1: return new Lock1();
    case RawTile.KEY2: return new Key2();
    case RawTile.LOCK2: return new Lock2();
    default: assertExhausted(tile);
  }
}

function transformMap() {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
}

let inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
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
  map[playery][playerx + dx].moveHorizontal(dx);
}

function moveVertical(dy: number) {
  map[playery + dy][playerx].moveVertical(dy);
}

function handleInputs() {
  while (inputs.length > 0) {
    let input = inputs.pop();
    input.handle();
  }
}

function updateTile(x: number, y: number) {
  map[y][x].update(x, y);
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
      //drawTile(g, x, y);
      map[y][x].draw(g, x, y);
    }
  }
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
  transformMap();
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
