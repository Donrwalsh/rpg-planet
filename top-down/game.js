/*
    Basic Top-Down Concept Playground
*/

"use strict";

// import LittleJS module
import * as LJS from "../../dist/littlejs.esm.js";
import { Color } from "../dist/littlejs.esm.js";
const { vec2, hsl, tile } = LJS;

// load the game level data
export const gameLevelData = await LJS.fetchJSON("gameLevelData.json");

///////////////////////////////////////////////////////////////////////////////
function gameInit() {
  // called once after the engine starts up
  // setup the game
  const gameTile = (i, size = 32) => LJS.tile(i, size, 0, 1);
  let spriteAtlas = {
    grass: gameTile(0),
  };

  let tileLookup = {
    grass: 0,
    grassEdge: 1,
  };

  let levelSize = vec2(gameLevelData.width, gameLevelData.height);

  let tileLayer = new LJS.TileLayer(vec2(), levelSize, LJS.tile(0, 32, 0));

  let layerData = gameLevelData.data;

  for (let x = levelSize.x; x--; )
    for (let y = levelSize.y; y--; ) {
      const tile = layerData[y][x];

      const pos = vec2(x, levelSize.y - 1 - y);

      let tileIndex;

      const terrainAtlas = (x, y) => x + 32 * y;

      if (tile == tileLookup.grass) {
        tileIndex = 118;
      }

      if (tile == tileLookup.grassEdge) {
        if (x == 0 && y == 0) {
          // top left
          tileIndex = terrainAtlas(21, 2);
        } else if (x == 0 && y == levelSize.y - 1) {
          // bottom left
          tileIndex = terrainAtlas(21, 4);
        } else if (y == 0 && x == levelSize.x - 1) {
          // top right
          tileIndex = terrainAtlas(23, 2);
        } else if (y == levelSize.y - 1 && x == levelSize.x - 1) {
          // bottom right
          tileIndex = terrainAtlas(23, 4);
        } else if (x == 0) {
          // left wall
          tileIndex = terrainAtlas(21, 3);
        } else if (y == 0) {
          // top wall
          tileIndex = terrainAtlas(22, 2);
        } else if (x == levelSize.x - 1) {
          // right wall
          tileIndex = terrainAtlas(23, 3);
        } else if (y == levelSize.y - 1) {
          // bottom wall
          tileIndex = terrainAtlas(22, 4);
        }
      }

      //random element for later
      let randomize = false;

      let direction = randomize ? LJS.randInt(4) : 0;
      let mirror = randomize ? LJS.randInt(2) : 0;
      let color = randomize
        ? LJS.randColor(hsl(0, 0, 0.2), hsl(0, 0, 0.8))
        : new Color();
      const data = new LJS.TileLayerData(tileIndex, direction, mirror, color);
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
  ["./Atlas/terrain_atlas.png"]
);
