/*
    Basic Field Concept Playground
*/

"use strict";

// import LittleJS module
import * as LJS from "../dist/littlejs.esm.js";
import * as NPC from "./npc.js";
const {
  vec2,
  TileCollisionLayer,
  TileLayerData,
  GREEN,
  setCameraPos,
  TileInfo,
} = LJS;
const { Npc } = NPC;

export let spriteAtlas;
let repeatSpawnTimer = new LJS.Timer();

///////////////////////////////////////////////////////////////////////////////

function gameInit() {
  LJS.gravity.y = -0.01;
  // Establish a stack of 3 green blocks with collision as the field
  const pos = vec2();
  const tileLayer = new TileCollisionLayer(
    pos,
    vec2(256),
    new TileInfo(pos, vec2(16), 1)
  );

  setCameraPos(vec2(20, 0));

  for (pos.x = tileLayer.size.x; pos.x--; )
    for (pos.y = tileLayer.size.y; pos.y--; ) {
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
  if (LJS.mouseWasPressed(0)) {
    new Npc(LJS.mousePos);
  }
  if (LJS.mouseIsDown(1) || LJS.mouseIsDown("KeyZ")) {
    const isSet = repeatSpawnTimer.isSet();
    if (!isSet || repeatSpawnTimer.elapsed()) {
      // spawn continuously after a delay
      isSet || repeatSpawnTimer.set(0.5);
      new Npc(LJS.mousePos);
    }
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
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
LJS.engineInit(
  gameInit,
  gameUpdate,
  gameUpdatePost,
  gameRender,
  gameRenderPost,
  ["sprite_sheet.png", "tiles.png", "axe-walk-left.png"]
);
