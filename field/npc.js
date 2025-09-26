"use strict";

// import LittleJS module
import * as LJS from "../dist/littlejs.esm.js";
const { EngineObject, vec2, mousePos, rgb, abs } = LJS;
import * as Game from "./game.js"; // Odd how this doesn't cause circular dependency?

export class Npc extends EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5));
    this.pos = pos;
    this.color = rgb(0.071, 0.145, 0.8); // blue

    this.maxSpeed = 0.2;
    this.accel = 0.01;

    this.friction = 1; // override global default of 0.8 to reduce drag.
    this.setCollision();
  }

  render() {
    if (this.groundObject && abs(this.velocity.x) < this.maxSpeed) {
      this.velocity = this.velocity.add(vec2(-1 * this.accel, 0));
    }
    LJS.drawRect(this.pos, this.size, this.color);
  }
}
