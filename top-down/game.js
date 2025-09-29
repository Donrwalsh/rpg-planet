/*
    Basic Top-Down Concept Playground
*/

"use strict";

// import LittleJS module
import * as LJS from "../../dist/littlejs.esm.js";
import * as GameLevel from "./gameLevel.js";
const { vec2, hsl, tile } = LJS;

// globals
export let gameLevelData;

///////////////////////////////////////////////////////////////////////////////
async function gameInit() {
  // called once after the engine starts up
  // setup the game

  // load the game level data
  gameLevelData = await LJS.fetchJSON("gameLevelData.json");

  // // establish sprite atlas
  // const gameTile = (i, size = 32) => LJS.tile(i, size, 0, 1);
  // let spriteAtlas = {
  //   grass: gameTile(0),
  // };

  GameLevel.buildLevel();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {
  // called every frame at 60 frames per second
  // handle input and update the game state
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
  ["./Atlas/terrain_atlas.png", "./submission_daneeklu"]
);
