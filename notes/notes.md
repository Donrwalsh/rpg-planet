# Notes

Bare bones starter. I used some tutorials and guidance from the LittleJS repo to get this together. Run the app then click anywhere on the screen and a blue square shows up. It moves to the left until it hits a wall and then stops. Nifty.

Clicking a bunch spawns many boxes and their physics is not exactly what I want. Ideally there'd be collision with the walls (and ceiling and floor) and then a different kind of collision when running into other boxes. Maybe none at all? I feel like there should be something to showcase how many boxes are active in a given cluster rather than the end result of just piling on the same box space eventually. So, a task is to learn more about how physics works.

Otherwise, I have plans for rpg elements to happen in this hallway: boxes attacking the wall until it crumbles and such. Plenty of time for that. Though, maybe it'd be worth looking into how I might pull sprites in to better graphically represent all this? Ok, so that's two tasks that'll branch out from here.

- [ ] Learn more about the physics engine
- [x] Sprites? How that interplays with physics and representing my current, simple ideas.

Went looking for some free assets and found something called LPC which has the art style that I'm looking for and seems to be somewhat standardized. I produced a standard sprite sheet for the male character and downloaded it into my project. I'm still calling it `download.png` rather than updating `tiles.png` for now. Got it from https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator which seems really awesome, even though the LPC itself doesn't exist anymore.

I got my example app reading from the tile sheet properly (though it seems like it'll be tricky to eventually have a bunch of these, but I'll figure that out later). Furthermore the page wghere I generated this thing has some helpful previews that work to isolate which sprites I'm actually after. I used the Animation example to get the generic male character to walk left and it looks great! This is a good spot for a checkpoint commit.

But before I do that, I played around some more with the spritesheet generator. I'm not sure how I'm supposed to make use of this? If I, say, wanted a varied collection of sprites to generate I guess I need a full sprite sheet for each? There seems to be something where I can export just the items and just the characters so maybe I can fuss with that later. In addition, the only 'action' attacks that are properly animated in the way that I'd expect are spaced differently and are much larger than the other sprites. Interesting.

I can export just the walk and slash animations (and I guess the death animation, but that only faces the camera for some reason) and so maybe this is the method I'd use to reduce the amount of space eaten up by assets. At least, that's what makes the most sense for now.

- [ ] Take what I learned about sprites and apply them to the blue boxes. Walking animation while strolling and then attack animation once it reaches the wall. Just do one npc to start with.
- [ ] Look back into the sprite atlas now that I know how this works kinda

So here's what I'm thinking: You've got the sprites themselves which are one representation of the npc, but then also the shapes that can serve as their collision portion and be positioned as a sort of central 'shadow' point underneath the feet. This should create a cool grouping effect and I can also use different shapes to represent different classes of npcs!

It is functional for a single npc, but gets weird when there are multiple. Granted, the offsetting bit is working with the ceiling having collision, but the floor doesn't and when I tried to add a random selection between up or down it didn't work quite right. Also there appears to be some bouncing happening off the wall and other npcs. Pretty pleased with how this is looking. The blue square could be more at the feet, but it's also pretty cool centered as is currently.

### 9/24/25

First things first, I migrated my work into a folder named `hallway` so I can work on separate aspects of the app if/when I choose to.

The next thing I'd like to work on is establishing the core NPC class contract. The immediate thing that comes to mind is movement. I'm currently establishing the npc with static movement that is then adjusted as certain events occur (collision). Rather than this, I'd like the NPC itself to be in charge of its own movement. So the replacement for the current behavior is some sort of algorithm wherein the NPC looks at its environment enough to understand what its movement protocol is and then executes it, repeating this until it dies or the game ends. So to start, let's update things so it's not a mouse click that spawns a square but instead an npc that spawns automatically so I can observe its behavior swiftly.

Ok, my code is a mess so I'm going to clean it up a bit too. I worked this for a while. There is unfortunately no 'is currently colliding' check that I can plug into to decide if the npc should be attacking or walking. So I set it up like this: The NPC proceeds until it can't move anymore. At which point it assumes that it has been impeded by some sort of object that it can attack (a safe assumption since the wall is the only thing it can run into right now). Next, while in the attacking state the NPC gets a different animation and a timer is set. Once that timer is elapsed, an attack is executed and then I check to see if the target was destroyed. If it was, then attacking is turned off and the NPC begins moving again. If not, the timer resets and another attack is queued.

To test this out, I added attackSpeed and attackDamage to the NPC. I also added a raw HP value to the wall, and enough variables to track its present health. With that, I let the app run and an NPC spawns, approaches the wall, kills it, and proceeds to the left. Bingo, that's a pretty nice checkpoint!

Alright, I did some more on this. I updated the floor so that it exists in the same way as the ceiling (this was relevant for collisions) and then made the wall slightly larger to avoid some weird squeeze-through behavior I was seeing. This took a lot of tinkering, but I wanted to get the behavior in place of the multiple npcs 'crowding' a stop-point. Firstly, the collision is based on the geometric shape behind the sprite, which was what I wanted so that's good. Secondly, I can actually know what game element the sprite is colliding with via some clever logic on the collision checking function. Though, this caused an issue with npcs never de-spawning due to the lack of an `attacking` check on the logic that sets up the attack timer: When there are a lot of npcs crowded into a single spot they are constantly re-triggering that collision and therefore resetting the attack timer without ever executing an attack. That would've been a tricky one to track down.

Anyway, the way it works is that when an NPC collides with anything it'll decide what to do based on what it ran into (added the `!attacking` check here ~ and then refactored my logic to account for the fact that I need that check for all of these). If it collides with a ceiling or floor it will continue moving in the same direction but it will invert gravity, thus 'bouncing' off the ceiling or floor (this locks me into a collision-bound hallway but I don't mind that at least right now). If the npc runs into a wall, it'll stop moving and start attacking (this existed before this commit). Lastly, if it collides with another NPC it will attempt to adjust its position. It does so by setting a timer so that only one adjustment happens at once (otherwise, since the collision will still be happening the sprite just stutters as it switches back and forth indefinitely) and then it attempts to perform an adjustment. The adjustment amounts to randomly deciding between up or down and then setting the npc on that path. So it's very similar to the 'bouncing' off the ceiling or floor, but the random nature adds some character to how all the npcs try to crowd around a smaller space to attack. Overall, I'm pleased with how this looks and feels in its current form. There's the occasional rogue npc that likes to slide off to the right, but it happens pretty sparingly and only when I absolutely inundate the screen with npcs. The small amount of screen space that I'm using here means that I can pretty easily crowd all the available hallway space with blocking npcs, at which point new NPCs do crazy things, sometimes completely breaking free of my hallway. So I added logic that kills an NPC after they perform an attack (imagine spiked walls or something) and even with no death animation I like the behavior of how new NPCs fill in the blanks when their predecessors fall.

Then I did a slight adjustment to the way I calculate sprite time so that they aren't all taking the same system time calculation and so it avoids all the sprites syncing up. I also, as part of this work, adjusted the positioning of the collision box so that it makes a decent base for the sprite itself. This required two different calculations based on the static or active sprite selection.

### 9/26/25

**Current Tasks**:

- [ ] Learn more about the physics engine
  - [ ] An apparent next task would be to create **Field** where the NPC is an `EngineObject` but the floor is part of the level. The single NPC's behavior is based on the environment around it. Feet need to be on the ground to move forward and movement stops when there is something attackable within melee (touch range to start, think super basic starter NPC). Consider adding the scroll element to end the game.

Spent some time yesterday learning about physics. Now I'm going to work on the **Field** concept.

One thing that's been on my mind as I work on this is the game's camera. I'm working with a static camera for now, but the vision that I'm working off of has a side-scrolling camera that is under control by the player so they can work with a much larger level and move from one side to the other. Gestures to move the camera? Not sure how it'd work on desktop...

The plan is to establish a basic NPC class with this task. So not going to be considering bells and whistles RE: stats. Just going to focus on movement and core behavior right now.

`LJS.mousePos` is not globally available as you might think. `npc.js` reports it as `vec2(0, 0)` unless it's passed in from `game.js`. Curious. Anyway, now that the mouse position is being read correctly, I have it so that wherever you click on the screen a blue box appears. Dope. Now let's get gravity to act on them.

Ok, so getting gravity to act on the blue squares is no issue. Getting the tileset to behave appropriately with gravity is causing me trouble. The minimal way that the tileset is generated seems to be causing troubles with me wanting my x-index to start at -20. Oh well, I'm going to just stick with the 0,0 origin for now so I don't waste any more time with this when I don't even have a solid concept of how I want screen positioning to behave.

Blue boxes appear wherever I click and accelerate up to max speed and then proceed as such until they inevitably fall off the left edge. Nice.

### 9/27/25

I've built a chessboard out of grass.

Right now we've got ourselves a JSON file that does the same thing in two ways. It records the size of the board (8x8 in our case) and then holds a data representation of that board which is just all zeroes for now indicating grass. These two values must agree with each other since I'm having trouble deciding which direction to go here, either procedural or explicit. Anyway, The solid 8x8 green blob looked meh, so I added borders to it. I suppose this is just a fizzbuzz situation and it'll be helpful to have everything separated out like this due to the fact that these are also the cells that will need some sort of special behavior for being the barrier of the world.

https://opengameart.org/content/lpc-tile-atlas
https://opengameart.org/content/lpc-tile-atlas2

Ok, I landed on the explicit approach. I'm treating grass and grassEdge as different. No need to hardcode the different tile selection based on position, that can be handled by the js code somewhere. Looking at things, I don't like having all of this in `game.js` and I think I'll follow the example of establishing a `gameLevel.js`. Probably do that next actually.

### 9/29/25

Moving level rendering logic out of `game.js` and into the new `gameLevel.js`. I don't know how to use the sprite Atlas TBH. Maybe I'm muddying things with how I'm deriving the sprite to render based on the indicated tile + positioning logic. Anyway. I'm also running into an issue with wondering how I get multiple sprites on the screen when they come from different sources. Seems like I need another layer entirely?

Haha ok 8x8 has no center square, so I upped it to 9x9 in order to be able to place the scroll in the center. My initial idea was to slap a distinct number into the existing map but that causes problems because the scroll then replaces the grass square. Since the scroll doesn't occupy the entire square, this leads to transparency causing the cohesion of the field to break. So I figured I'd like to draw grass and a scroll on that one square. That seemed fine, but there doesn't seem to be a way to render both of them in a single square. Also, I ran into issues with plucking a graphic from a different source file since the TileLayer itself is defined very early on and this definition is what carries the sourceData file designation.

Ok, so we're dealing with layers, right? The original `gameLevelData.json` approach from the platformer example used two different layers: one for background and one for foreground. Isn't that kinda what I'm doing here? So I broke it out into two different layers: the map layer and the object layer. Not super sold on this just yet, seeing as the scroll isn't necessarily an 'object' in game terms, but for now I think it's sufficient. In fact, this worked really well. Now I essentially iterate over two different maps - drawing the grass in the same way that I did before. Then while iterating I also consult a second map that contains just a single value for the scroll and pulls from a different tilesheet. Ah shoot, so this means I can't draw something like trees over my grass since those come from the same sprite sheet. I guess there's nothing stopping me from having as many layers as I want?

Ok, I tried this out by tossing a mushroom and a frond onto a new layer called 'tree layer'. So I can get this to do whatever I want, but the layers are going to profilerate based on needing to pull from a different sprite sheet and when I need to render things on top of one another. Granted, this exploration is probably going to be replaced with actually establishing gameObjects which can be rendered above these tileLayers without any issue, but it's nice to know how to handle what's going on here for the future. Adding three things that take up 4 squares makes the map feel very small. I'm also not centered on the screen. I think I'll tinker with those next since I'm spending some time in this space for a while.

The platformer example had exactly what I was looking for with some logic in `gameUpdate()` that zoomed in or out based on mouse-wheel scrolling. From that I built out a pretty basic camera control scheme that just steps the camera around based on WASD or arrow key inputs. This is choppy but gets me the ability to position the camera as needed for now. I can zoom down to where the scroll fills the entire screen or down to where the entire map fits on maybe 5x5 pixels or something. Definitely going to need to adjust these later.

Ok, let's dive into getting an NPC onto the screen. First things first, I have a core NPC class that I was working on in Field and Hallway. Let's explore how I'd want to port that over. I like the field version as an informative structure. I built a basic Npc class representation and then spawned it at `(2, 2)` which indicates the lower-left position of the square, so this spawns it in the bottom-left corner of the third from the bottom and third from the left. Ultimately that doesn't really matter right now but it's interesting to consider the subtle differences between what a pair of coordinates means depending on context even in this simple game. Ok anyway, the first thing my npc needs to do is choose a random 2d direction. Got that working, now I need collision.

I want to collide with the edge, but this presents a problem because it looks like I need to actually define the layer that I'll be using as one that has collision. Hm. I messed around with the layers a bit. Now the mapLayer is just a tileLayer while the object and tree layers have collision. I gave collision to the borders, the mushroom and the bottom half of the frond. As I watch the three colored squares move around on the screen, I'm not super pleased with the movement as it exists but I admit that it is probably good enough for now so rather than get distracted by fine-tuning behavior that I don't even know how I want to use it yet I'll instead shift my attention to adding in the sprites for the movement that exists right now.

Last note though: I made two basic behaviors for my npcs: the first is to establish an initial heading which should only occur when the square is completely motionless at the start of the game. The second is to accelerate up to their speed if they happen to be moving slower than it. This second one is not working quite right but I'm not going to fuss with it all that much just yet. I think it has to do with maintaining direction? I'm just arbitrarily choosing x or y and adding their accel value until speed is met.

Oh yeah, one other thing I want to mention: Since I chose spots for the NPCs to spawn that may have a collidable object, there's a situation where if they choose to move in a direction that doesn't escape them from the collision of the object they're on top of then they can just stroll right off the game map. Helpful info probably, and this overlap thing I'll want to avoid during initial setup since collision should then prevent it from being an issue after the fact.

Things to do:

- [x] Make NPCs identifiable by mouse click/hover.
  - [ ] I have a console log for now, but maybe some on-screen indicator?
  - [ ] This seems actually somewhat tricky to get to work exactly with the sprites. Will need to revisit this later to clean it up I think.
- [x] Make them move around the screen.
- [x] Let's get a bigger field to work with.
- [x] For god's sake, give them some clothes!
- [ ] NPC Stat readout on screen.

Proposed Init Sequence:

- [x] Randomly determine gender
- [ ] Faction from param (represented by color for now)
- [ ] Class is Pleb (do other classes later)

Movement:
So I need to care about facing, right? It's based on the velocity of the element in question so I just need to find a way to define the four quadrants. Pulled this off in a basic form on the gameNpc class. Movement looks pretty nice so I'm gonna go around clean up my work and snapshot here.

Collision:
So my NPCs are walking through one another. I'm ok with this. I don't think NPCs should implicitly apply physics on each other when they can just resolve all that through 'combat'. Anyway, time for lunch!

Second half of the day:

Ok check this out. It occurs to me that I have all the necessary bits to build a compelling map. I have the tiles, the ability to place tiles as part of the map and then also the ability to decide where NPCs spawn. There's some other stuff to solve to fill in the complete 'game' blanks, but I like the idea to pivoting to building a more interesting map to populate with NPCs and go from there. So! Onward to interesting map ideas. Probably gonna put together a new notes file for this.

I like a 36x60 map.

Played around with color modulation on pants and shirt. White works best as a base color. I stress-tested it and hit problems with upwards of 500 NPCs. Should be good for a while!

I want a rock. This rock is a game object and it can be destroyed. This will require a lot of things:

- Rock as a game object with hp and other such attributes.
- NPC ability to 'attack' a rock. This represents a non-walking state for NPCs. This caused me to learn more about raycasting which is pretty sweet. I have a very basic ray being sent in the direction the NPC is facing. Once this ray intersects with a rock, the NPC stops moving and switches to a combat idle animation.

Awesome. This is doing what I want it to do. The NPC will, once they see an object they want to attack, move towards that object until they are within range at which point they'll start attacking via sprite animation. I'm not crazy happy with how the sprites look but it's a timing thing, not a positioning one.

### 9/30/25

This morning I woke up tired of looking at a static green map. I'm not feeling particularly generatively-creative, so I'm going to gather some example images that fit what I'm going for - the pinterest approach.

I'm not really finding all that much, but two pictures caught my eye at the very least for working on some basic arrangement.

Ok, so pivoting real quick to consider strategic layout. I'm doing some chatting with an AI to better understand tower-defense concepts and I gotta say it's very useful. (https://copilot.microsoft.com/shares/4WDjbjbvxWFz9i7BF51T6) One thing I'm noticing is a general adherence to the convention that the NPCs follow a predictable path in tower defense games and I guess my version doesn't really follow that convention. Maybe it should?

Ok, let's be creative for a second. Suppose the factions drop to two instead of three. Then the issue of strategic layout becomes kinda simple, put a straight line down the center of the screen and split the layout in two. There are three main 'levels' to the map: The bottom of the screen is an open ended 'path' that leads off into either direction: the spawn point for both factions. At the center is a crossroads. The center part of the map is a forest/field that presents as an unkempt offshoot of the road but it holds a secret. . . The top of the map is the scroll shrine with tactical paths leading to the scroll. Nice, I like the way this looks in my head. Let's build it!

- [ ] First I need a road.
  - [ ] Just kidding, first I need a revisit to the gameLevel layering thinking.

From the perspective of a road, I just need the 'ground' layer to be able to hold two tiles: One for the sprite representing the ground and then another for the tile representing growth like grass on the ground that should be placed on top of the ground. My current understanding is that this means I create two Tile Layers. I won't always need to populate the bottom one if the top one covers the entire square. Let me double-check my thinking on this because if I could somehow place two sprites onto the same layer then I'd prefer to do that.

I like what I'm cooking up here. I can't think of a way to order the ground map sprites, so I'm just going to set it up to be sequential working from bottom left right and then upward like coordinates. I'll rearrange later.

Ok, I've made some progress building it this way but I don't think I'm going to continue on this path. I can add logic that determines which of the edges/corners to choose based on surrounding information freeing me up to just indicate: ground and grass and then the logic takes care of the rest.

Yeah, so for the core ground layer I don't even need to worry about the map since I'm going to be placing the same thing everywhere. Maybe with some random decoration later, but this version of getGroundBottomIndex feels clean.

Next idea is to establish a movement situation for the NPCs that simulates a realistic everyday hustle & bustle. What I came up with is pretty cool. There's a path that's created by establishing a sequence of positions in the world and the next location in the path. each time the NPC needs a place to walk towards, it will find the nearest location in the sequence to itself and then move in a direction towards the next step in the sequence with a bit of random turning and normalized by their speed. Slick.

Looks pretty goofy without any collision between the NPCs at 1/sec. At 5/sec it looks pretty dang realistic, especially when I start mixing in additional paths. Sweet, I should do that next. Or maybe get the despawning working.

- [x] Make a 2nd path.
  - [x] Reconsider the data structure of the 'thing' object? (_added this to kingdom class for now_)
- [x] Make 'spawn' and 'despawn' points for the NPCs. Maybe just need one spawn point object? Could designate where an npc is eligible to despawn. . .
  - Since this requires collision, I'm probably best off fussing with the additional layers before I work the spawning/despawning tie-in to NPCs. But, I'll think on it some more first.

### 10/07/25

Added a favicon of a treasure chest. looticons > LootIcons_png > transparent > chest_t_01. Then I used https://favicon.io/favicon-converter/ before realizing I already had the png I needed and I used the 32x32 version of it. Looks good enough for now IMO.

### 10/08/25

I've got three working paths (so six in practice) that cover the full ABC combinatrics of entrances and exits. I added another loop on the path to make it sensible for NPCs leaving from ~(24, 1) will have a way to take the center path. Letting the app run and watching the chaos of movement is really pleasing right now!

- [ ] I don't like the magic number usage in my new drawing functions, but I'm not going to get too distracted by it right now.

Feeling a bit uneasy about how I'm managing facing. There were some moments where the hair and the rest of the sprite would desync and it turned out to just be some incomplete code, but given that all these different animations are sometimes locked behind particular action profiles that can be hard to induce, perhaps I could use some sort of debug view to show all the sprite combinations that might show up in game?

### 10/10/25

Working on improving the raycast logic. I can remove sightRange from the left/right raycast calc because I'm normalizing the vector length by that value anyway. It occurred to me that the simplest way to do this is to create 3 vectors and then just rotate them based on facing. Handily, the scheme I'm using for facing fits nicely into a quick calculation to produce the right amount of 90 degree turns based on the int that represents facing. I had a few issues with seemingly equivalent code producing different results, but eventually landed on something that smells pretty nice!

As part of this work I also shifted the origin of these rays to be closer to the NPCs face which is hardly noticeable right now unless you're actually reviewing the raycast lines themselves, but I figure this will promote more realistic gameplay down the line.
