import * as LJS from "./littlejs.esm.js";
import * as Game from "./game.js";
const { vec2, hsl, rgb, Timer } = LJS;

export class GameObject extends LJS.EngineObject {
  constructor(pos, size, tileInfo) {
    super(pos, size, tileInfo, 0);
    this.hp = 0;
    this.damageTimer = new Timer();
  }

  update() {
    super.update();
  }

  damage(damage, damagingObject) {
    LJS.ASSERT(damage >= 0);
    if (this.isDead()) return 0;

    const newHealth = LJS.max(this.hp - damage, 0);
    if (!newHealth) this.kill(damagingObject);

    // set new health and return amount damaged
    return this.hp - (this.hp = newHealth);
  }

  isDead() {
    return this.hp <= 0;
  }
  kill(damagingObject) {
    this.destroy();
  }
}

export class Growth extends LJS.EngineObject {
  constructor(pos, stage) {
    super(pos, LJS.vec2(1));
    this.size = LJS.vec2(1);
    this.stage = stage;
    this.type = "growth";
  }

  lookup = [
    0,
    Game.spriteAtlas.growthOne,
    Game.spriteAtlas.growthTwo,
    Game.spriteAtlas.growthThree,
    Game.spriteAtlas.growthFour,
    Game.spriteAtlas.growthFive,
  ];

  render() {
    if (this.stage > 0) {
      LJS.drawTile(this.pos, LJS.vec2(1), this.lookup[this.stage]);
    }
  }

  grow() {
    if (this.stage < 5) {
      this.stage++;
    }
  }
}

export class Rock extends GameObject {
  constructor(pos) {
    super(pos, LJS.vec2(1), Game.spriteAtlas.rock);
    this.hp = 1;
    this.size = LJS.vec2(1);
    this.setCollision();
    this.mass = 0;
  }

  render() {
    if (!this.isDead()) {
      LJS.drawTile(this.pos, LJS.vec2(1), this.tileInfo);
    }
  }
}
