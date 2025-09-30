/*
    Basic Top-Down Concept Playground - Level Generator
*/

"use strict";

import * as LJS from "../../dist/littlejs.esm.js";
import { Color } from "../dist/littlejs.esm.js";
const { vec2, hsl, tile } = LJS;
import * as Game from "./game.js";
import * as GameObjects from "./gameObject.js";

export function buildLevel() {
  // destroy all objects
  LJS.engineObjectsDestroy();

  const gameLevelData = Game.gameLevelData;
  const levelSize = vec2(gameLevelData.width, gameLevelData.height);

  // Bottom-most layers (Ground)
  const groundTileLookup = {
    bottomLeftRoad: 0,
    bottomRoad: 1,
    bottomRightRoad: 2,
    leftRoad: 3,
    road: 4,
    rightRoad: 5,
    roadGrassFlat: 6,

    // grass: 400,
    // grassEdge: 500,
    // grassStreetMix: 600,
  };

  const groundMap = gameLevelData.groundData;
  let groundBottomLayer = new LJS.TileLayer(
    vec2(),
    levelSize,
    LJS.tile(0, 32, 0),
    vec2(1),
    -2
  );
  let groundTopLayer = new LJS.TileLayer(
    vec2(),
    levelSize,
    LJS.tile(0, 32, 0),
    vec2(1),
    -1
  );

  const objectLookup = {
    empty: 0,
    scroll: 1,
    rock: 2,
    frondTop: 3,
    frondBottom: 4,
    border: 5,
  };

  let objectLayer = new LJS.TileCollisionLayer(
    vec2(),
    levelSize,
    LJS.tile(0, 32, 1)
  );

  let treeLayer = new LJS.TileCollisionLayer(
    vec2(),
    levelSize,
    LJS.tile(0, 32, 0)
  );

  let objectMap = gameLevelData.objectData;

  for (let x = levelSize.x; x--; )
    for (let y = levelSize.y; y--; ) {
      const groundTile = groundMap[y][x];
      const objectTile = objectMap[y][x];

      const pos = vec2(x, levelSize.y - 1 - y);
      const terrainAtlas = (x, y) => x + 32 * y;
      const scrollsAndBlocks = (x, y) => x + 16 * y;

      // Ground Layer
      let groundBottomIndex;
      let groundTopIndex;

      switch (groundTile) {
        case groundTileLookup.bottomLeftRoad:
          groundBottomIndex = terrainAtlas(18, 4);
          break;
        case groundTileLookup.bottomRoad:
          groundBottomIndex = terrainAtlas(19, 4);
          break;
        case groundTileLookup.bottomRightRoad:
          groundBottomIndex = terrainAtlas(20, 4);
          break;
        case groundTileLookup.leftRoad:
          groundBottomIndex = terrainAtlas(18, 3);
          break;
        case groundTileLookup.road:
        case groundTileLookup.roadGrassFlat:
          groundBottomIndex = terrainAtlas(19, 3);
          break;
        case groundTileLookup.rightRoad:
          groundBottomIndex = terrainAtlas(20, 3);
          break;
      }

      switch (groundTile) {
        case groundTileLookup.roadGrassFlat:
          groundTopIndex = terrainAtlas(22, 4);
          break;
      }

      if (groundBottomIndex) {
        groundBottomLayer.setData(
          pos,
          new LJS.TileLayerData(groundBottomIndex)
        );
      }

      if (groundTopIndex) {
        groundTopLayer.setData(pos, new LJS.TileLayerData(groundTopIndex));
      }

      // let gameTileIndex;
      // let objectTileIndex;
      // let tileType; //1 is collide, 0 is pass through, 2 is breakable

      // if (groundTile == levelTileLookup.grass) {
      //   gameTileIndex = terrainAtlas(22, 3);
      // }

      // if (groundTile == levelTileLookup.grassEdge) {
      //   if (x == 0 && y == 0) {
      //     // top left
      //     gameTileIndex = terrainAtlas(21, 2);
      //   } else if (x == 0 && y == levelSize.y - 1) {
      //     // bottom left
      //     gameTileIndex = terrainAtlas(21, 4);
      //   } else if (y == 0 && x == levelSize.x - 1) {
      //     // top right
      //     gameTileIndex = terrainAtlas(23, 2);
      //   } else if (y == levelSize.y - 1 && x == levelSize.x - 1) {
      //     // bottom right
      //     gameTileIndex = terrainAtlas(23, 4);
      //   } else if (x == 0) {
      //     // left wall
      //     gameTileIndex = terrainAtlas(21, 3);
      //   } else if (y == 0) {
      //     // top wall
      //     gameTileIndex = terrainAtlas(22, 2);
      //   } else if (x == levelSize.x - 1) {
      //     // right wall
      //     gameTileIndex = terrainAtlas(23, 3);
      //   } else if (y == levelSize.y - 1) {
      //     // bottom wall
      //     gameTileIndex = terrainAtlas(22, 4);
      //   }
      // }

      // let layer;
      // if (objectTile != objectLookup.empty) {
      //   if (objectTile == objectLookup.scroll) {
      //     tileType = 1;
      //     objectTileIndex = scrollsAndBlocks(8, 2);
      //     layer = objectLayer;
      //   }
      //   if (objectTile == objectLookup.rock) {
      //     const objectPos = pos.add(vec2(0.5));
      //     new GameObjects.Rock(objectPos);
      //     tileType = 1;
      //     layer = treeLayer;
      //     gameTileIndex = terrainAtlas(22, 3);
      //   }
      //   if (objectTile == objectLookup.frondBottom) {
      //     tileType = 1;
      //     layer = treeLayer;
      //     objectTileIndex = terrainAtlas(26, 30);
      //   }
      //   if (objectTile == objectLookup.frondTop) {
      //     tileType = 0;
      //     layer = treeLayer;
      //     objectTileIndex = terrainAtlas(26, 29);
      //   }
      //   if (objectTile == objectLookup.border) {
      //     tileType = 1;
      //     layer = objectLayer;
      //     objectTileIndex = -1;
      //   }
      //   const data = new LJS.TileLayerData(objectTileIndex, 0, 0, new Color());
      //   layer.setCollisionData(pos, tileType);
      //   layer.setData(pos, data);
      // }

      // //random element for later
      // let randomize = false;

      // let direction = randomize ? LJS.randInt(4) : 0;
      // let mirror = randomize ? LJS.randInt(2) : 0;
      // let color = randomize
      //   ? LJS.randColor(hsl(0, 0, 0.2), hsl(0, 0, 0.8))
      //   : new Color();
      // const data = new LJS.TileLayerData(
      //   gameTileIndex,
      //   direction,
      //   mirror,
      //   color
      // );
      // mapLayer.setData(pos, data);
    }
  groundBottomLayer.redraw();
  groundTopLayer.redraw();
  objectLayer.redraw();
  treeLayer.redraw();
}
