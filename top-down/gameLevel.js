/*
    Basic Top-Down Concept Playground - Level Generator
*/

"use strict";

import * as LJS from "../../dist/littlejs.esm.js";
import { Color } from "../dist/littlejs.esm.js";
const { vec2, hsl, tile } = LJS;
import * as Game from "./game.js";

export function buildLevel() {
  // destroy all objects
  LJS.engineObjectsDestroy();

  const gameLevelData = Game.gameLevelData;

  const levelTileLookup = {
    grass: 0,
    grassEdge: 1,
  };

  const objectLookup = {
    empty: 0,
    scroll: 1,
  };

  let levelSize = vec2(gameLevelData.width, gameLevelData.height);

  let mapLayer = new LJS.TileLayer(vec2(), levelSize, LJS.tile(0, 32, 0));
  let objectLayer = new LJS.TileLayer(vec2(), levelSize, LJS.tile(0, 32, 1));

  let gameMap = gameLevelData.levelData;
  let objectMap = gameLevelData.objectData;

  for (let x = levelSize.x; x--; )
    for (let y = levelSize.y; y--; ) {
      const gameTile = gameMap[y][x];
      const objectTile = objectMap[y][x];

      const pos = vec2(x, levelSize.y - 1 - y);

      let gameTileIndex;
      let objectTileIndex;

      const terrainAtlas = (x, y) => x + 32 * y;
      const scrollsAndBlocks = (x, y) => x + 16 * y;

      if (gameTile == levelTileLookup.grass) {
        gameTileIndex = terrainAtlas(22, 3);
      }

      if (gameTile == levelTileLookup.grassEdge) {
        if (x == 0 && y == 0) {
          // top left
          gameTileIndex = terrainAtlas(21, 2);
        } else if (x == 0 && y == levelSize.y - 1) {
          // bottom left
          gameTileIndex = terrainAtlas(21, 4);
        } else if (y == 0 && x == levelSize.x - 1) {
          // top right
          gameTileIndex = terrainAtlas(23, 2);
        } else if (y == levelSize.y - 1 && x == levelSize.x - 1) {
          // bottom right
          gameTileIndex = terrainAtlas(23, 4);
        } else if (x == 0) {
          // left wall
          gameTileIndex = terrainAtlas(21, 3);
        } else if (y == 0) {
          // top wall
          gameTileIndex = terrainAtlas(22, 2);
        } else if (x == levelSize.x - 1) {
          // right wall
          gameTileIndex = terrainAtlas(23, 3);
        } else if (y == levelSize.y - 1) {
          // bottom wall
          gameTileIndex = terrainAtlas(22, 4);
        }
      }

      if (objectTile != objectLookup.empty) {
        if (objectTile == objectLookup.scroll) {
          objectTileIndex = scrollsAndBlocks(8, 2);
        }
        const data = new LJS.TileLayerData(objectTileIndex, 0, 0, new Color());
        objectLayer.setData(pos, data);
      }

      //random element for later
      let randomize = false;

      let direction = randomize ? LJS.randInt(4) : 0;
      let mirror = randomize ? LJS.randInt(2) : 0;
      let color = randomize
        ? LJS.randColor(hsl(0, 0, 0.2), hsl(0, 0, 0.8))
        : new Color();
      const data = new LJS.TileLayerData(
        gameTileIndex,
        direction,
        mirror,
        color
      );
      mapLayer.setData(pos, data);
    }
  mapLayer.redraw();
  objectLayer.redraw();
}
