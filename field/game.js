/*
    Little JS Hello World Demo
    - Just prints "Hello World!"
    - A good starting point for new projects
*/

"use strict";

// import LittleJS module
import * as LJS from "../dist/littlejs.esm.js";
const { vec2, TileCollisionLayer, TileLayerData, GREEN } = LJS;

///////////////////////////////////////////////////////////////////////////////

function gameInit() {
  // Establish a stack of 3 green blocks with collision as the field
  // create tile layer
  const pos = vec2();
  const tileLayer = new TileCollisionLayer(pos.add(vec2(-20, 0)), vec2(256));
  for (pos.x = tileLayer.size.x; pos.x--; )
    for (pos.y = tileLayer.size.y; pos.y--; ) {
      // check if tile should be solid
      // const levelHeight = pos.x < 9 ? 2 : ((pos.x / 4) | 0) ** 3.1 % 7;
      const levelHeight = 2;
      if (pos.y > levelHeight) continue;

      // set tile data
      tileLayer.setData(pos, new TileLayerData(1, 1, true, GREEN));
      tileLayer.setCollisionData(pos);
    }
  tileLayer.redraw(); // redraw tile layer with new data
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
