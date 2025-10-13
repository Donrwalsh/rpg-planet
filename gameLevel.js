/*
    Basic Top-Down Concept Playground - Level Generator
*/

"use strict";

import * as LJS from "./littlejs.esm.js";
import { Color } from "./littlejs.esm.js";
const { vec2, hsl, tile } = LJS;
import * as Game from "./game.js";
import * as GameObjects from "./gameObject.js";
import * as GameScroll from "./gameScroll.js";

export function buildLevel() {
  // destroy all objects
  LJS.engineObjectsDestroy();

  const gameLevelData = Game.gameLevelData;
  const levelSize = vec2(gameLevelData.width, gameLevelData.height);

  // Bottom-most layers (Ground)
  const groundTileLookup = {
    empty: 0,
    grass: 1,
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
    growthOne: 6,
    growthTwo: 7,
    growthThree: 8,
    growthFour: 9,
    growthFive: 10,
  };

  let scrollLayer = new LJS.TileCollisionLayer(
    vec2(),
    levelSize,
    LJS.tile(0, 32, 1)
  );

  let objectLayer = new LJS.TileCollisionLayer(
    vec2(),
    levelSize,
    LJS.tile(0, 32, 0)
  );

  let objectMap = gameLevelData.objectData;

  for (let x = levelSize.x; x--; )
    for (let y = levelSize.y; y--; ) {
      const objectTile = objectMap[y][x];

      const pos = vec2(x, levelSize.y - 1 - y);
      const terrainAtlas = (x, y) => x + 32 * y;
      const scrollsAndBlocks = (x, y) => x + 16 * y;

      // New, sparkly approach:
      let groundBottomIndex = getGroundBottomIndex(x, y, levelSize);
      let groundTopIndex = getGroundTopIndex(
        x,
        y,
        groundMap,
        levelSize,
        groundTileLookup
      );

      if (groundBottomIndex) {
        groundBottomLayer.setData(
          pos,
          new LJS.TileLayerData(groundBottomIndex)
        );
      }

      if (groundTopIndex) {
        groundTopLayer.setData(pos, new LJS.TileLayerData(groundTopIndex));
      }

      // Old, worn-down approach:
      let gameTileIndex;
      let objectTileIndex;
      let tileType; //1 is collide, 0 is pass through, 2 is breakable

      let layer;
      if (objectTile != objectLookup.empty) {
        if (objectTile == objectLookup.scroll) {
          new GameScroll.GameScroll(pos.add(vec2(0.5)));
          tileType = 1;
          objectTileIndex = scrollsAndBlocks(8, 2);
          layer = scrollLayer;
        }
        if (objectTile == objectLookup.rock) {
          const objectPos = pos.add(vec2(0.5));
          new GameObjects.Rock(objectPos);
          tileType = 1;
          layer = objectLayer;
          gameTileIndex = terrainAtlas(22, 3);
        }
        if (objectTile == objectLookup.frondBottom) {
          tileType = 1;
          layer = objectLayer;
          objectTileIndex = terrainAtlas(26, 30);
        }
        if (objectTile == objectLookup.frondTop) {
          tileType = 0;
          layer = objectLayer;
          objectTileIndex = terrainAtlas(26, 29);
        }
        if (objectTile == objectLookup.border) {
          tileType = 1;
          layer = scrollLayer;
          objectTileIndex = -1;
        }
        if (objectTile == objectLookup.growthOne) {
          tileType = 1;
          layer = objectLayer;
          objectTileIndex = terrainAtlas(9, 24);
          new GameObjects.Growth(pos.add(vec2(0.5)), 1);
        }
        if (objectTile == objectLookup.growthTwo) {
          tileType = 1;
          layer = objectLayer;
          objectTileIndex = terrainAtlas(9, 25);
          new GameObjects.Growth(pos.add(vec2(0.5)), 2);
        }
        const data = new LJS.TileLayerData(objectTileIndex, 0, 0, new Color());
        layer.setCollisionData(pos, tileType);
        layer.setData(pos, data);
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
    }
  groundBottomLayer.redraw();
  groundTopLayer.redraw();
  scrollLayer.redraw();
  objectLayer.redraw();
}

function getGroundTopIndex(x, y, groundMap, levelSize, groundTileLookup) {
  const terrainAtlas = (b, c) => b + 32 * c;
  const groundTile = groundMap[y][x];

  if (groundTile == groundTileLookup.grass) {
    const grassToBottomLeft =
      y == levelSize.y - 1 ? false : x == 0 ? false : groundMap[y + 1][x - 1];
    const grassBelow =
      y == levelSize.y - 1
        ? false
        : groundMap[y + 1][x] == groundTileLookup.grass;
    const grassToBottomRight =
      y == levelSize.y - 1
        ? false
        : x == levelSize.x - 1
        ? false
        : groundMap[y + 1][x + 1];
    const grassToTheLeft =
      x == 0 ? false : groundMap[y][x - 1] == groundTileLookup.grass;
    const grassToTheRight =
      x == levelSize.x - 1
        ? false
        : groundMap[y][x + 1] == groundTileLookup.grass;
    const grassToTopLeft =
      y == 0
        ? false
        : x == 0
        ? false
        : groundMap[y - 1][x - 1] == groundTileLookup.grass;
    const grassAbove =
      y == 0 ? false : groundMap[y - 1][x] == groundTileLookup.grass;
    const grassToTopRight =
      y == 0
        ? false
        : x == levelSize.x - 1
        ? false
        : groundMap[y - 1][x + 1] == groundTileLookup.grass;

    // not sure about these:
    const emptyToLeft =
      x == 0 ? false : groundMap[y][x - 1] == groundTileLookup.empty;
    const emptyToRight =
      x == levelSize.x - 1
        ? false
        : groundMap[y][x + 1] == groundTileLookup.empty;

    if (!grassBelow) {
      if (!grassToTheLeft) {
        // bottom left
        return terrainAtlas(21, 4);
      } else if (!grassToTheRight) {
        // bottom right
        return terrainAtlas(23, 4);
      } else {
        // bottom
        return terrainAtlas(22, 4);
      }
    } else if (!grassAbove) {
      if (!grassToTheLeft) {
        // top left
        return terrainAtlas(21, 2);
      } else if (!grassToTheRight) {
        // top right
        return terrainAtlas(23, 2);
      } else {
        // top
        return terrainAtlas(22, 2);
      }
    } else if (!grassToBottomLeft && x != 0 && !emptyToLeft) {
      return terrainAtlas(23, 0);
    } else if (!grassToBottomRight && x != levelSize.x - 1 && !emptyToRight) {
      return terrainAtlas(22, 0);
    } else if (!grassToTopLeft && x != 0 && !emptyToLeft) {
      return terrainAtlas(23, 1);
    } else if (!grassToTopRight && x != levelSize.x - 1 && !emptyToRight) {
      return terrainAtlas(22, 1);
    } else {
      if (!grassToTheLeft) {
        // left
        return terrainAtlas(21, 3);
      } else if (!grassToTheRight) {
        // right
        return terrainAtlas(23, 3);
      } else {
        //
        return terrainAtlas(22, 3);
      }
    }
  }
}

function getGroundBottomIndex(x, y, levelSize) {
  const terrainAtlas = (b, c) => b + 32 * c;

  if (y == levelSize.y - 1) {
    if (x == 0) {
      // bottom left
      return terrainAtlas(18, 4);
    } else if (x == levelSize.x - 1) {
      // bottom right
      return terrainAtlas(20, 4);
    } else {
      // bottom
      return terrainAtlas(19, 4);
    }
  } else if (y < levelSize.y - 1 && y > 0) {
    if (x == 0) {
      // left
      return terrainAtlas(18, 3);
    } else if (x == levelSize.x - 1) {
      // right
      return terrainAtlas(20, 3);
    } else {
      // middle
      return terrainAtlas(19, 3);
    }
  } else if (y == 0) {
    if (x == 0) {
      // top left
      return terrainAtlas(18, 2);
    } else if (x == levelSize.x - 1) {
      // top right
      return terrainAtlas(20, 2);
    } else {
      // top
      return terrainAtlas(19, 2);
    }
  }
}
