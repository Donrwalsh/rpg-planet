import * as LJS from "./littlejs.esm.js";
import * as Game from "./game.js";

export class GameScroll extends LJS.EngineObject {
  constructor(pos) {
    super(pos, LJS.vec2(1), Game.spriteAtlas.scroll);
  }

  update() {
    if (LJS.mouseWasPressed(0))
      if (LJS.isOverlapping(this.pos, this.size, LJS.mousePos)) {
        Game.incrementMana();
      }
  }
}
