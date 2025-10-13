import * as LJS from "./littlejs.esm.js";
import * as Game from "./game.js";
import * as GameObjects from "./gameObject.js";

export class GameScroll extends LJS.EngineObject {
  constructor(pos) {
    super(pos, LJS.vec2(1), Game.spriteAtlas.scroll);
    this.type = "scroll";
  }

  update() {
    if (LJS.mouseWasPressed(0))
      if (LJS.isOverlapping(this.pos, this.size, LJS.mousePos)) {
        Game.incrementMana();
        console.log("this.pos = " + this.pos);
        let newVec = LJS.vec2(LJS.randInt(3), LJS.randInt(3));
        console.log("newVec = " + newVec);
        console.log(this.pos.subtract(LJS.vec2(1)).add(newVec));
        console.log(
          LJS.engineObjectsCollect(
            this.pos.subtract(LJS.vec2(1)).add(newVec),
            LJS.vec2(1)
          )
        );

        let objectsAtPos = LJS.engineObjectsCollect(
          this.pos.subtract(LJS.vec2(1)).add(newVec),
          LJS.vec2(1)
        );

        let growthObjectsAtPos = objectsAtPos.filter(
          (found) => found.type == "growth"
        );

        if (growthObjectsAtPos.length) {
          growthObjectsAtPos.map((fg) => fg.grow());
        } else {
          console.log("no growth found");
          if (objectsAtPos.length == 0) {
            console.log(this.pos.subtract(LJS.vec2(1)).add(newVec));
            new GameObjects.Growth(
              this.pos.subtract(LJS.vec2(1)).add(newVec),
              1
            );
          }
        }
      }
  }
}
