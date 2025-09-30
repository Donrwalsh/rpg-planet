## 9/23/25

- [ ] Learn more about the physics engine
  - [ ] An apparent next task would be to create **Field** where the NPC is an `EngineObject` but the floor is part of the level. The single NPC's behavior is based on the environment around it. Feet need to be on the ground to move forward and movement stops when there is something attackable within melee (touch range to start, think super basic starter NPC). Consider adding the scroll element to end the game.
- [x] Sprites? How that interplays with physics and representing my current, simple ideas.
- [x]d Take what I learned about sprites and apply them to the blue boxes. Walking animation while strolling and then attack animation once it reaches the wall. Just do one npc to start with.
- [ ] Look back into the sprite atlas now that I know how this works kinda

## 9/24/25

- [ ] Could use an example of how to spread code across multiple js files.
- [ ] Add a range check to the basic npc attack.
- [ ] Would be cool to show some damage numbers on screen.
- [x] How about changing around the way sprites are chosen so that they don't all sync up?
- [ ] How about adding multiple walls?
- [ ] Let's update the current only sprite to be more generic and starter than it is currently. Maybe no weapon for the absolute lack of range.

### 9/26/25

- [ ] Learn more about the LPC sprites that I'm using. Start with the specific terms of the cup.
- [ ] Explore animation guides: https://github.com/ElizaWy/LPC/tree/f07f7f5892e67c932c68f70bb04472f2c64e46bc/Characters/_%20Guides%20&%20Palettes/Animation%20Guides
- [ ] Embrace https://lpc.opengameart.org/static/LPC-Style-Guide/build/index.html#
- [ ] Need a repeatable process for early times of exporting stuff from the generator by hand.
- [ ] Learn about crediting these assets that I'm going to be using.

### 9/29/25

- [ ] expand sight-raycasting to be more than just a straight line ahead.
  - [ ] This will probably require some sort of trig =(
- [ ] Adding stuff like the player's mana and on-screen indicators for NPC data and spellcasting shenanigans.
- [ ] gameLevel is looking great, but its whole layering situation is a mess. I have some physical notes about how I might make this better but they are underneath stuff.
- [ ] Clean up the Frond stuff in gameLevel and the gameLevelData.
- [ ] Make the scroll a touchable object and tie it to the game finishing.
- [ ] The 'state' system of the NPCs is rather primitive right now. Certainly needs to be expanded, considering a priority system to guide decision-making.
- [ ] NPCs should spawn differently. Could establish some stand-in for an actual respawn mechanic. Timer-driven spawns with spawn-points.
- [ ] So NPCs have acceleration, but you can't really notice it at all. This is a symptom of doing everything one frame at a time. Gotta keep that in mind for balancing concepts.
- [ ] Rendering uses a lot of repeated code for the different 'slots'.
- [ ] Is rendering slow because of how I'm doing it?
