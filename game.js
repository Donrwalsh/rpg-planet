/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

("use strict");

// import LittleJS module
import * as LJS from "../../dist/littlejs.esm.js";
const { vec2, hsl, tile, rgb, Timer, GRAY, Box2dObject, box2d } = LJS;

// globals
let wall;
let square;
let groundObject;
let ceilingObject;

class Square extends LJS.EngineObject {
  constructor(pos, time) {
    super(vec2(15, 0), vec2(0.5));
    this.color = rgb(0.071, 0.145, 0.8);

    this.velocity = vec2(-0.1, 0); // give square some movement
    this.velocity.normalize(0.01);

    this.time = time;
    this.timer = new Timer();

    this.setCollision();
  }

  collideWithObject(o) {
    if (o == wall) {
      this.velcotiy = vec2();
      this.timer.set(this.time);
    } else if (o == square) {
      this.velocity = vec2(-0.1, 0.1);
    }

    return true;
  }

  render() {
    LJS.drawRect(this.pos, this.size, this.color);
    // if (this.timer.isSet()) {
    //   LJS.drawTextOverlay(
    //     this.timer.getPercent().toFixed(2),
    //     this.pos.add(vec2(0, 1)),
    //     2
    //   );
    // }
  }
}

class Wall extends LJS.EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5, 1.5));

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

  ceilingObject = new LJS.Box2dObject(
    vec2(-8),
    vec2(),
    0,
    0,
    LJS.GRAY,
    LJS.box2d.bodyTypeStatic
  );
  ceilingObject.addBox(vec2(100, 0.5), vec2(9));

  wall = new Wall(LJS.cameraPos);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state

  if (LJS.mouseWasPressed(0)) {
    // spawn new ball if there is no ball and left mouse pressed
    square = new Square(LJS.cameraPos, 1); // create a square
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
  ["tiles.png"]
);
