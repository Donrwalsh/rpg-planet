import * as LJS from "../../dist/littlejs.esm.js";
import * as GameNpc from "./gameNpc.js";
const { vec2, hsl, tile } = LJS;

export class Kingdom extends LJS.EngineObject {
  constructor(color) {
    super(LJS.vec2(0), LJS.vec2(0));
    this.color = color;
    this.exp = 0;
    this.spawnTime = 2;
    this.spawnTimer = new LJS.Timer(this.spawnTime);
  }

  generateNPC() {
    return new GameNpc.NPC(LJS.RED, this.getRandomPath(), (x) =>
      this.gainExp(x)
    );
  }

  getRandomPath() {
    const missions = [
      [
        vec2(1, 1),
        vec2(2, 2),
        vec2(4, 4),
        vec2(6, 6),
        vec2(8, 7),
        vec2(9, 7),
        vec2(11, 7),
        vec2(13, 7),
        vec2(15, 7),
        vec2(17, 7),
        vec2(18, 7),
        vec2(20, 5),
        vec2(22, 3),
        vec2(23, 1),
      ],
    ];
    let possiblePaths = missions
      .map((mission) => mission.map((point) => point.copy()))
      .concat(missions.map((mission) => mission.reverse()));
    let randomlyChosenPath = possiblePaths[LJS.randInt(possiblePaths.length)];
    return randomlyChosenPath.map((vector) => vector.copy());
  }

  gainExp(x) {
    this.exp += x;
    console.log(`gained ${x} exp`);
  }
}
