/*
    Basic Hallway Concept Playground
*/

("use strict");

// import LittleJS module
import * as LJS from "../../dist/littlejs.esm.js";
const { EngineObject, vec2, rgb, Timer } = LJS;

// globals
let npc; // working with a single npc for now
let debug = true;

// globals-old
let wall;
let ceiling;
let groundObject;
let ceilingObject;

class Npc extends EngineObject {
  constructor() {
    super(vec2(20, 0), vec2(0.5)); // first is position of spawn, 2nd is size of blue square
    this.color = rgb(0.071, 0.145, 0.8);
    this.attackSpeed = 1;
    this.attackDamage = 1;

    this.timer = new Timer();

    this.attacking = false;
    this.target;

    this.setCollision();
  }

  startAttacking(o) {
    this.velocity = vec2(); // stop moving
    this.timer.set(this.attackSpeed);
    this.attacking = true;
    this.target = o;
  }

  collideWithObject(o) {
    if (o == wall) {
      this.startAttacking(o);
    } else {
      if (this.spawnTime < o.spawnTime) {
        this.velocity = vec2(0.1, LJS.randSign() * 0.2);
      }
    }

    return true;
  }

  render() {
    if (this.timer.elapsed() && this.attacking) {
      // TODO: include some sort of range check
      this.target.hp -= this.attackDamage;
      if (this.target.destroyed || this.target.hp == 0 || this.target.hp < 0) {
        this.attacking = false;
      } else {
        this.timer.set(this.attackSpeed);
      }
    }
    if (debug) {
      LJS.drawRect(this.pos, this.size, this.color);
    }

    if (!this.attacking) {
      this.velocity = vec2(-0.1, 0); // standard movement expressed here
      this.velocity.normalize(0.01); // seemingly has no effect?
    }

    if (!this.attacking) {
      const pos = vec2(3, 0.1);
      const frame = (LJS.time * 4) % 8 | 0;
      let tilePos = vec2(64, 576); // position of tile in pixels
      let tileSize = vec2(64, 64); // size of tile in pixels

      LJS.drawTile(
        this.pos,
        vec2(2),
        new LJS.TileInfo(tilePos, tileSize).frame(frame)
      );
    } else {
      const frame = (LJS.time * 4) % 6 | 0;
      let tilePos = vec2(0, 3600); // position of tile in pixels
      let tileSize = vec2(128, 128); // size of tile in pixels
      LJS.drawTile(
        this.pos.add(vec2(0, -0.5)),
        vec2(4),
        new LJS.TileInfo(tilePos, tileSize).frame(frame)
      );
    }
  }
}

class Wall extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5, 1.5));

    this.maxHp = 5;
    this.hp = 5;

    this.setCollision();
    this.mass = 0;
  }

  update() {
    if (this.hp == 0 || this.hp < 0) {
      this.destroy();
    }
  }
}

class Ceiling extends LJS.EngineObject {
  constructor(pos) {
    super(pos.add(vec2(1)), vec2(100, 0.5));
    this.color = LJS.GRAY;

    this.setCollision();
    this.mass = 0;
  }
}

///////////////////////////////////////////////////////////////////////////////
async function gameInit() {
  await LJS.box2dInit();
  // called once after the engine starts up
  // setup the game
  groundObject = new LJS.Box2dObject(
    vec2(-8),
    vec2(),
    0,
    0,
    LJS.GRAY,
    LJS.box2d.bodyTypeStatic
  );
  groundObject.addBox(vec2(100, 0.5), vec2(7));
  groundObject.collideSolidObjects = true;

  wall = new Wall(LJS.cameraPos);
  ceiling = new Ceiling(LJS.cameraPos);
  npc = new Npc(); // create an NPC
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
  if (LJS.mouseWasPressed(0)) {
    wall.destroy();
  }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
  // called after physics and objects are updated
  // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
  // called before objects are rendered
  // draw any background effects that appear behind objects
  // LJS.drawRect(vec2(0, 0), vec2(100), LJS.GRAY); // draw background

  {
    // animate using multiple frames
    // const pos = vec2(-5, 2 * LJS.abs(Math.sin(LJS.time * 2 * LJS.PI)));
    const pos = vec2(3, 0.1);

    // these values are for walking:
    // const frame = (LJS.time * 4) % 8 | 0;
    // let tilePos = vec2(64, 576); // position of tile in pixels
    // let tileSize = vec2(64, 64); // size of tile in pixels

    // these values are for attacking:
    // const frame = (LJS.time * 4) % 6 | 0;
    // let tilePos = vec2(0, 3600); // position of tile in pixels
    // let tileSize = vec2(128, 128); // size of tile in pixels

    // LJS.drawTile(
    //   pos,
    //   vec2(4),
    //   new LJS.TileInfo(tilePos, tileSize).frame(frame)
    // );
  }

  // Modified form of the whole sprite sheet:

  // let pos = vec2(0, 0); // world position to draw
  // let size = vec2(15); // world size of the tile
  // let color = hsl(0, 0, 1); // color to multiply the tile by
  // let tilePos = vec2(0, 576); // top left corner of tile in pixels
  // let tileSize = vec2(64, 64); // size of tile in pixels
  // let tileInfo = new LJS.TileInfo(tilePos, tileSize); // tile info

  // LJS.drawTile(pos, size, tileInfo, color);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {
  // called after objects are rendered
  // draw effects or hud that appear above all objects
  // LJS.drawTextScreen("Hello World!", LJS.mainCanvasSize.scale(0.5), 80);
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
LJS.engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  ["download (1).png"]
);
