import * as LJS from "../dist/littlejs.esm.js";
const { vec2, hsl, rgb, Timer } = LJS;

const atlas = {
  spellcast: { tilePos: LJS.vec2(0, 0), frames: 7 },
  walk: { tilePos: LJS.vec2(0, 512), frames: 9 },
  slash: { tilePos: LJS.vec2(0, 768), frames: 6 },
  idle: { tilePos: LJS.vec2(0, 1280), frames: 2 },
  combatIdle: { tilePos: LJS.vec2(0, 2688), frames: 2 },
};

export class NPC extends LJS.EngineObject {
  constructor(pos, color) {
    let size = LJS.vec2(0.5);
    super(pos, size);
    this.pos = pos;
    this.color = color;
    this.occupied = false;
    this.target;
    this.facing;

    this.reach = 1;

    this.attackSpeed = 2;
    this.attackTimer = new Timer();
    this.walkTimer = new Timer();

    this.gender = LJS.randInt(2);

    this.name = {
      [LJS.RED]: "red",
      [LJS.YELLOW]: "yellow",
      [LJS.BLUE]: "blue",
    }[this.color];

    this.speed = 0.025;
    this.accel = 0.001;
    // this.accelChance = 0.4;
    this.sightRange = 5;
    this.sightWidth = 3;
    this.setCollision();
  }

  getFirstObjectSeen() {
    let seenObjects;
    if (this.getFacing() == 0) {
      seenObjects = LJS.engineObjectsRaycast(
        this.pos,
        this.pos.add(LJS.vec2(0, this.sightRange))
      );
    }
    if (this.getFacing() == 1) {
      seenObjects = LJS.engineObjectsRaycast(
        this.pos,
        this.pos.add(LJS.vec2(-1 * this.sightRange, 0))
      );
    }
    if (this.getFacing() == 2) {
      seenObjects = LJS.engineObjectsRaycast(
        this.pos,
        this.pos.add(LJS.vec2(0, -1 * this.sightRange))
      );
    }
    if (this.getFacing() == 3) {
      seenObjects = LJS.engineObjectsRaycast(
        this.pos,
        this.pos.add(LJS.vec2(this.sightRange, 0))
      );
    }
    return seenObjects
      .filter((object) => object != this)
      .sort((a, b) => this.pos.distance(a.pos) - this.pos.distance(b.pos))[0];
  }

  unoccupied() {
    return !this.occupied;
  }

  render() {
    if (this.attackTimer.isSet() && this.target.isDead()) {
      this.occupied = false;
      this.attackTimer.unset();
      this.walkTimer.unset();
      // const randY = Math.floor(LJS.rand(0, this.speed) * 1000) / 1000;
      // const randX = this.speed - randY;
      // //   console.log(
      // //     `${this.name} is not moving. Establishing initial heading of (${randX}, ${randY})`
      // //   );
      // this.velocity.y = LJS.randSign() * randY;
      // this.velocity.x = LJS.randSign() * randX;
    }

    if (this.walkTimer.isSet()) {
      this.renderWalk();
      if (this.walkTimer.elapsed()) {
        this.occupied = false;
      }
    }

    if (this.unoccupied()) {
      if (this.getFirstObjectSeen()?.hp > 0) {
        this.target = this.getFirstObjectSeen();
        this.facing = this.getFacing();
        this.occupied = true;
        this.velocity = this.target.pos
          .subtract(this.pos)
          .normalize(this.speed);
      } else {
        // LJS.drawRect(this.pos, this.size, this.color);
        let things = [
          {
            tilePos: vec2(1, 1),
            nextTile: vec2(3, 3),
          },
          {
            tilePos: vec2(3, 3),
            nextTile: vec2(5, 5),
          },
          {
            tilePos: vec2(5, 5),
            nextTile: vec2(7, 7),
          },
          {
            tilePos: vec2(7, 7),
            nextTile: vec2(9, 7),
          },
          {
            tilePos: vec2(9, 7),
            nextTile: vec2(11, 7),
          },
          {
            tilePos: vec2(11, 7),
            nextTile: vec2(13, 7),
          },
          {
            tilePos: vec2(13, 7),
            nextTile: vec2(15, 7),
          },
          {
            tilePos: vec2(15, 7),
            nextTile: vec2(17, 7),
          },
          {
            tilePos: vec2(17, 7),
            nextTile: vec2(18, 7),
          },
          {
            tilePos: vec2(18, 7),
            nextTile: vec2(20, 5),
          },
          {
            tilePos: vec2(20, 5),
            nextTile: vec2(22, 3),
          },
          {
            tilePos: vec2(22, 3),
            nextTile: vec2(24, 1),
          },
        ];
        this.occupied = true;

        this.walkTimer.set(2);

        let smallestDistance = 100; //arbitrary high value
        let nearestThing;

        things.forEach((thing) => {
          if (thing.tilePos.distance(this.pos) < smallestDistance) {
            smallestDistance = thing.tilePos.distance(this.pos);
            nearestThing = thing;
          }
        });

        this.velocity = nearestThing.nextTile
          .subtract(this.pos)
          .normalize()
          .rotate(LJS.rand(-0.2, 0.2))
          .multiply(vec2(this.speed));
        // // Choose a random direction.
        // // abs of both vector values should = npc speed.
        // const randY = Math.floor(LJS.rand(0, this.speed) * 1000) / 1000;
        // const randX = this.speed - randY;
        // //   console.log(
        // //     `${this.name} is not moving. Establishing initial heading of (${randX}, ${randY})`
        // //   );
        // this.velocity.y = LJS.randSign() * randY;
        // this.velocity.x = LJS.randSign() * randX;

        // Just assumed to be walking all the time:
        this.renderWalk();

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
    } else if (this.target) {
      if (this.pos.distance(this.target.pos) <= this.reach) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.renderSlash();
        if (!this.attackTimer.isSet()) {
          this.attackTimer.set(this.attackSpeed);
        }
        if (this.attackTimer.elapsed()) {
          this.target.damage(1);
          this.attackTimer.set(this.attackSpeed);
        }
      } else {
        this.renderCombatIdle();
        this.velocity = this.target.pos
          .subtract(this.pos)
          .normalize(this.speed);
      }
    }
  }

  getFacing() {
    //0 is Up, 1 is Left, 2 is Down, 3 is Right
    // Will cause errors if a case is missed.
    let direction;

    if (this.velocity.y > 0) {
      if (LJS.abs(this.velocity.y) >= LJS.abs(this.velocity.x)) {
        direction = 0;
      } else {
        direction = this.velocity.x > 0 ? 3 : 1;
      }
    }

    if (this.velocity.y <= 0) {
      if (LJS.abs(this.velocity.y) >= LJS.abs(this.velocity.x)) {
        direction = 2;
      } else {
        direction = this.velocity.x > 0 ? 3 : 1;
      }
    }

    return direction;
  }

  renderSlash() {
    let tilePos = this.getTilePos("slash", this.facing);
    let tileSize = LJS.vec2(64, 64);

    // sprite:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 2 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("slash") | 0
      )
    );
    //shirt:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 4 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("slash") | 0
      ),
      this.color
    );
    // pants:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 6 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("slash") | 0
      ),
      LJS.GRAY
    );
    // hair:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 8).frame(
        (this.getAliveTime() * 3) % this.getFrames("slash") | 0
      ),
      LJS.BLACK
    );
  }

  renderCombatIdle() {
    let tilePos = this.getTilePos("combatIdle", this.facing);
    let tileSize = LJS.vec2(64, 64);

    // sprite:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 2 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("combatIdle") | 0
      )
    );
    //shirt:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 4 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("combatIdle") | 0
      ),
      this.color
    );
    // pants:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 6 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("combatIdle") | 0
      ),
      LJS.GRAY
    );
    // hair:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 8).frame(
        (this.getAliveTime() * 3) % this.getFrames("combatIdle") | 0
      ),
      LJS.BLACK
    );
  }

  renderWalk() {
    let tilePos = this.getTilePos("walk", this.getFacing());
    let tileSize = LJS.vec2(64, 64);

    // sprite:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 2 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("walk") | 0
      )
    );
    //shirt:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 4 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("walk") | 0
      ),
      this.color
    );
    // pants:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 6 + this.gender).frame(
        (this.getAliveTime() * 3) % this.getFrames("walk") | 0
      ),
      LJS.GRAY
    );
    // hair:
    LJS.drawTile(
      this.pos.add(LJS.vec2(0, 0.65)),
      LJS.vec2(2),
      new LJS.TileInfo(tilePos, tileSize, 8).frame(
        (this.getAliveTime() * 3) % this.getFrames("walk") | 0
      ),
      LJS.BLACK
    );
  }

  collideWithObject(o) {
    // if (o.hp > 1) {
    //   console.log("potato");
    // }
  }

  getTilePos(action, dir) {
    return atlas[action].tilePos.add(LJS.vec2(0, 64 * dir));
  }

  getFrames(action) {
    return atlas[action].frames;
  }
}
