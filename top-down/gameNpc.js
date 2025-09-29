import * as LJS from "../dist/littlejs.esm.js";

export class NPC extends LJS.EngineObject {
  constructor(pos, color) {
    let size = LJS.vec2(0.5);
    super(pos, size);
    this.pos = pos;
    this.color = color;

    this.name = {
      [LJS.RED]: "red",
      [LJS.YELLOW]: "yellow",
      [LJS.BLUE]: "blue",
    }[this.color];

    this.speed = 0.03;
    this.accel = 0.001;
    this.accelChance = 0.4;
    this.setCollision();
  }

  render() {
    LJS.drawRect(this.pos, this.size, this.color);
    if (this.velocity.x == 0 && this.velocity.y == 0) {
      // Choose a random direction.
      // abs of both vector values should = npc speed.
      const randY = Math.floor(LJS.rand(0, this.speed) * 1000) / 1000;
      const randX = this.speed - randY;
      //   console.log(
      //     `${this.name} is not moving. Establishing initial heading of (${randX}, ${randY})`
      //   );
      this.velocity.y = LJS.randSign() * randY;
      this.velocity.x = LJS.randSign() * randX;
    }

    if (LJS.abs(this.velocity.x) + LJS.abs(this.velocity.x) < this.speed) {
      //   console.log(
      //     `${this.name} is moving too slow: (${this.velocity.x}, ${this.velocity.y})`
      //   );
      let coinFlip = LJS.randInt(2);
      if (coinFlip) {
        let velocitySign = this.velocity.x > 0 ? 1 : -1;
        this.velocity.x = this.velocity.x + this.accel * velocitySign;
      } else {
        let velocitySign = this.velocity.y > 0 ? 1 : -1;
        this.velocity.y = this.velocity.y + this.accel * velocitySign;
      }
    }
  }

  collideWithObject(o) {
    // console.log(o);
  }
}
