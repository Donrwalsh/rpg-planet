"use strict";

// import LittleJS module
import * as LJS from "../dist/littlejs.esm.js";
const { EngineObject, vec2, mousePos, RED, abs } = LJS;
import * as Game from "./game.js"; // Odd how this doesn't cause circular dependency?

export class Npc extends EngineObject {
  constructor(pos) {
    super(pos, vec2(0.5));
    this.pos = pos;
    this.color = RED;

    this.maxSpeed = 0.1;
    this.accel = 0.001;
    this.accelChance = 0.4;

    this.jumpChanceWalk = 0.02;
    this.jumpChanceRun = 0.03;
    this.jumpPower = 0.1;

    this.friction = 1; // override global default of 0.8 to reduce drag.
    this.setCollision();
  }

  shouldAccel() {
    return this.velocity.x > 0 || LJS.rand(0, 1) < this.accelChance;
  }

  render() {
    LJS.drawRect(this.pos, this.size, this.color);

    // Walking
    if (this.groundObject && abs(this.velocity.x) < this.maxSpeed) {
      if (this.shouldAccel()) {
        this.velocity = this.velocity.add(vec2(-1 * this.accel, 0));
      }
      this.renderWalk();
      if (
        this.velocity.x > 0.5 * this.maxSpeed &&
        LJS.rand(0, 1) < this.jumpChanceWalk
      ) {
        this.velocity.y = this.jumpPower;
      }
    }

    // Running
    if (this.groundObject && abs(this.velocity.x) >= this.maxSpeed) {
      this.velocity.x = this.maxSpeed * -1;
      this.renderRun();
      if (LJS.rand(0, 1) < this.jumpChanceRun) {
        this.velocity.y = this.jumpPower * 2;
      }
    }

    if (!this.groundObject && this.velocity.y < 0) {
      this.renderFall();
    }

    if (!this.groundObject && this.velocity.y > 0) {
      this.renderJump();
    }

    if (this.groundObject) {
    }
  }

  renderJump() {
    let tilePos = vec2(192, 1728);
    let tileSize = vec2(64, 64);
    LJS.drawTile(
      this.pos.add(vec2(0, 0.2)),
      vec2(2),
      new LJS.TileInfo(tilePos, tileSize).frame(0)
    );
  }

  renderFall() {
    let tilePos = vec2(256, 1728);
    let tileSize = vec2(64, 64);
    LJS.drawTile(
      this.pos.add(vec2(0, 0.2)),
      vec2(2),
      new LJS.TileInfo(tilePos, tileSize).frame(0)
    );
  }

  renderRun() {
    let tilePos = vec2(0, 576);
    let tileSize = vec2(64, 64);

    LJS.drawTile(
      this.pos.add(vec2(0, 0.2)),
      vec2(2),
      new LJS.TileInfo(tilePos, tileSize).frame(
        (this.getAliveTime() * 2) % 8 | 0
      )
    );
  }

  renderWalk() {
    let tilePos = vec2(0, 0);
    let tileSize = vec2(64, 64);

    LJS.drawTile(
      this.pos.add(vec2(0, 0.2)),
      vec2(2),
      new LJS.TileInfo(tilePos, tileSize).frame(
        (this.getAliveTime() * 3) % 9 | 0
      )
    );
    //Axe
    LJS.drawTile(
      this.pos.add(vec2(0, 0.2)),
      vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 2).frame(
        (this.getAliveTime() * 3) % 9 | 0
      )
    );
  }
}
