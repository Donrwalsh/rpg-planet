/*
    Basic Top-Down Concept Playground
*/

"use strict";

// import LittleJS module
import * as LJS from "../../dist/littlejs.esm.js";
const { vec2, hsl, tile } = LJS;

// load the game level data
export const gameLevelData = await LJS.fetchJSON("gameLevelData.json");

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  const gameTile = (i, size = 16) => LJS.tile(i, size, 0, 1);
  let spriteAtlas = {
    basicGrass: gameTile(0),
    mudThing: gameTile(5),
  };

  let levelSize = vec2(2, 2);

  let tileLayer = new LJS.TileLayer(vec2(), levelSize, LJS.tile(0, 32, 0)); // Don: Point at forest_tiles;

  let layerData = gameLevelData.data;

  for (let x = levelSize.x; x--; )
    for (let y = levelSize.y; y--; ) {
      const tile = layerData[y][x];
      const pos = vec2(x, levelSize.y - 1 - y);
      let direction = LJS.randInt(4);
      let mirror = LJS.randInt(2);
      let color = LJS.randColor(hsl(0, 0, 0.2), hsl(0, 0, 0.8));
      const data = new LJS.TileLayerData(tile, direction, mirror, color);
      tileLayer.setData(pos, data);
    }
  tileLayer.redraw();
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
  ["forest_tiles.png"]
);
