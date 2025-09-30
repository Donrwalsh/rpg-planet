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
  constructor(color, path, missionCompleteCallback) {
    let pos = path[0];
    let size = LJS.vec2(0.5);
    super(pos, size);

    this.pos = path[0].copy();
    this.missionCompleteCallback = (x) => missionCompleteCallback(x);

    this.path = path;
    this.destination = path[path.length - 1];

    this.gender = LJS.randInt(2);

    this.stat_strength = 1 + LJS.randInt(2);
    this.stat_speed = 1 + LJS.randInt(2);
    this.stat_smarts = 1 + LJS.randInt(2);
    this.stat_senses = 1 + LJS.randInt(2);

    this.speed = 0.02 + 0.001 * this.stat_speed;
    this.attentionSpan = 2.5 - this.stat_smarts * 0.05;
    this.sightRange = 2 + 0.1 * this.stat_senses;
    this.sightWidth = 0.25 + 0.01 * this.stat_senses;

    this.color = color;
    this.occupied = false;
    this.target;
    this.facing;

    // This is still wonky
    this.reach = 2;

    this.attackSpeed = 2;
    this.attackTimer = new Timer();
    this.walkTimer = new Timer();

    this.name = {
      [LJS.RED]: "red",
      [LJS.YELLOW]: "yellow",
      [LJS.BLUE]: "blue",
    }[this.color];

    this.setCollision();
  }

  getFirstObjectSeen() {
    let seenObjects;
    if (this.getFacing() == 0) {
      // This works like a charm but is pretty unwieldy. Would love to generalize it further.
      let baseRaycastVector = this.pos.add(LJS.vec2(0, this.sightRange));
      let leftRaycastVector = this.pos.add(
        LJS.vec2(
          -1 * this.sightWidth * this.sightRange,
          (1 - this.sightWidth) * this.sightRange
        ).normalize(this.sightRange)
      );
      let rightRaycastVector = this.pos.add(
        LJS.vec2(
          this.sightWidth * this.sightRange,
          (1 - this.sightWidth) * this.sightRange
        ).normalize(this.sightRange)
      );

      seenObjects = LJS.engineObjectsRaycast(this.pos, baseRaycastVector)
        .concat(LJS.engineObjectsRaycast(this.pos, leftRaycastVector))
        .concat(LJS.engineObjectsRaycast(this.pos, rightRaycastVector));
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
    // this.getFirstObjectSeen();
    if (this.attackTimer.isSet() && this.target.hp == 0) {
      this.occupied = false;
      this.attackTimer.unset();
      this.walkTimer.unset();
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

        this.occupied = true;

        this.walkTimer.set(this.attentionSpan);

        let smallestDistance = 100; //arbitrary high value
        let nearestPathPoint;

        this.path.forEach((point) => {
          if (point.distance(this.pos) < smallestDistance) {
            smallestDistance = point.distance(this.pos);
            nearestPathPoint = point;
          }
        });

        if (nearestPathPoint == this.destination) {
          console.log("I did it!");
          this.missionCompleteCallback(1);
          this.destroy();
          return;
        }

        this.velocity = this.path[this.path.indexOf(nearestPathPoint) + 1]
          .copy()
          .subtract(this.pos)
          .normalize()
          .rotate(LJS.rand(-0.2, 0.2))
          .multiply(vec2(this.speed));

        this.renderWalk();
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
    // console.log(o);
  }

  getTilePos(action, dir) {
    return atlas[action].tilePos.add(LJS.vec2(0, 64 * dir));
  }

  getFrames(action) {
    return atlas[action].frames;
  }
}
