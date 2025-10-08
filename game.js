/*
    RPG Planet
*/

"use strict";

// import LittleJS module
import * as LJS from "./littlejs.esm.js";
import * as GameNpc from "./gameNpc.js";
import * as GameLevel from "./gameLevel.js";
import * as GameObject from "./gameObject.js";
import * as GameKingdom from "./gameKingdom.js";
const { vec2, hsl, tile } = LJS;

// globals
export let gameLevelData, spriteAtlas;

// npcs
let npcs = [];
let redKingdom = new GameKingdom.Kingdom();

///////////////////////////////////////////////////////////////////////////////
async function gameInit() {
  // called once after the engine starts up
  // setup the game

  // load the game level data
  gameLevelData = await LJS.fetchJSON("gameLevelData.json");

  LJS.setTileFixBleedScale(0.3);

  // center the camera
  LJS.setCameraPos(vec2(gameLevelData.width * 0.5, gameLevelData.height * 0.5));
  LJS.setCameraScale(29);

  // // establish sprite atlas
  const gameTile = (i, size = vec2(32)) => LJS.tile(i, size, 0, 0);

  spriteAtlas = {
    rock: gameTile(vec2(26, 25), 32),
  };

  GameLevel.buildLevel();

  npcs.push(redKingdom.generateNPC());

  redKingdom.spawnTimer.set(redKingdom.spawnTime);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state

  if (redKingdom.spawnTimer.elapsed()) {
    npcs.push(redKingdom.generateNPC());
    redKingdom.spawnTimer.set(redKingdom.spawnTime);
  }

  // mouse wheel = zoom
  LJS.setCameraScale(
    LJS.clamp(LJS.cameraScale * (1 - LJS.mouseWheel / 10), 1, 1e3)
  );

  if (LJS.keyWasPressed("KeyW") || LJS.keyWasPressed("ArrowUp"))
    LJS.setCameraPos(vec2(LJS.cameraPos.x, LJS.cameraPos.y + 1));

  if (LJS.keyWasPressed("KeyS") || LJS.keyWasPressed("ArrowDown"))
    LJS.setCameraPos(vec2(LJS.cameraPos.x, LJS.cameraPos.y - 1));

  if (LJS.keyWasPressed("KeyA") || LJS.keyWasPressed("ArrowLeft"))
    LJS.setCameraPos(vec2(LJS.cameraPos.x - 1, LJS.cameraPos.y));

  if (LJS.keyWasPressed("KeyD") || LJS.keyWasPressed("ArrowRight"))
    LJS.setCameraPos(vec2(LJS.cameraPos.x + 1, LJS.cameraPos.y));

  const clickedOnNpc = npcs.find((npc) =>
    // Based on collision square:
    // LJS.isOverlapping(npc.pos, npc.size, LJS.mousePos)
    // Based on sprite (is way too big):
    LJS.isOverlapping(npc.pos.add(LJS.vec2(0, 0.65)), LJS.vec2(2), LJS.mousePos)
  );
  if (clickedOnNpc) {
    console.log(clickedOnNpc);
  }

  if (LJS.mouseWasPressed(0)) {
    // Places on top, which I don't like, but the flooring at least keeps it to a grid.
    new GameObject.Rock(
      vec2(Math.floor(LJS.mousePos.x), Math.floor(LJS.mousePos.y))
    );
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
  [
    "./assets/Atlas/terrain_atlas.png",
    "./assets/submission_daneeklu/ui/scrollsandblocks.png",
    "./assets/lpc-spritesheets/MaleBody.png",
    "./assets/lpc-spritesheets/FemaleBody.png",
    "./assets/lpc-spritesheets/MaleWhiteShirt.png",
    "./assets/lpc-spritesheets/FemaleWhiteShirt.png",
    "./assets/lpc-spritesheets/MaleWhitePants.png",
    "./assets/lpc-spritesheets/FemaleWhitePants.png",
    "./assets/lpc-spritesheets/ShortWhiteHair.png",
    "./assets/lpc-spritesheets/LongWhiteHair.png",
    "./assets/lpc-spritesheets/PonytailWhiteHair.png",
    "./assets/lpc-spritesheets/CurlyWhiteHair.png",
  ]
);
