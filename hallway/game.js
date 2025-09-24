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
let wall;
let ceiling;
let floor;

class Npc extends EngineObject {
  constructor() {
    super(vec2(15, LJS.rand(-0.75, 0.75)), vec2(0.2)); // first is position of spawn, 2nd is size of blue square
    this.color = rgb(0.071, 0.145, 0.8);
    this.attackSpeed = 1;
    this.attackDamage = 1;

    this.timer = new Timer();

    this.adjustingTimer = new Timer();
    this.adjustTime = 3;

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
    if (!this.attacking) {
      if (o == wall) {
        this.startAttacking(o);
        this.gravityScale = 0;
      } else if (o == floor || o == ceiling) {
        this.gravityScale = this.gravityScale * -1;
      } else if (
        // implied that o is an npc
        !this.adjustingTimer.isSet() ||
        !this.adjustingTimer.active()
      ) {
        this.gravityScale = this.gravityScale * LJS.randSign();
        this.adjustingTimer.set(this.adjustTime);
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
        // this.destroy(); //simulate spike walls:
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
      const frame = (this.getAliveTime() * 4) % 8 | 0;
      let tilePos = vec2(64, 576); // position of tile in pixels
      let tileSize = vec2(64, 64); // size of tile in pixels

      LJS.drawTile(
        this.pos.add(vec2(0, 0.7)),
        vec2(2),
        new LJS.TileInfo(tilePos, tileSize).frame(frame)
      );
    } else {
      const frame = (this.getAliveTime() * 4) % 6 | 0;
      let tilePos = vec2(0, 3600); // position of tile in pixels
      let tileSize = vec2(128, 128); // size of tile in pixels
      LJS.drawTile(
        this.pos.add(vec2(0, 0.2)),
        vec2(4),
        new LJS.TileInfo(tilePos, tileSize).frame(frame)
      );
    }
  }
}

class Wall extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5, 4));

    this.maxHp = 50;
    this.hp = 50;

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

class Floor extends LJS.EngineObject {
  constructor(pos) {
    super(pos.add(vec2(-1)), vec2(100, 0.5));
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
  LJS.setGravity(vec2(0, -0.01));
  wall = new Wall(LJS.cameraPos);
  ceiling = new Ceiling(LJS.cameraPos);
  floor = new Floor(LJS.cameraPos);
  npc = new Npc(); // create an NPC
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
  if (LJS.mouseWasPressed(0)) {
    new Npc();
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
