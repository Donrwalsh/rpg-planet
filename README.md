# Notes

Bare bones starter. I used some tutorials and guidance from the LittleJS repo to get this together. Run the app then click anywhere on the screen and a blue square shows up. It moves to the left until it hits a wall and then stops. Nifty.

Clicking a bunch spawns many boxes and their physics is not exactly what I want. Ideally there'd be collision with the walls (and ceiling and floor) and then a different kind of collision when running into other boxes. Maybe none at all? I feel like there should be something to showcase how many boxes are active in a given cluster rather than the end result of just piling on the same box space eventually. So, a task is to learn more about how physics works.

Otherwise, I have plans for rpg elements to happen in this hallway: boxes attacking the wall until it crumbles and such. Plenty of time for that. Though, maybe it'd be worth looking into how I might pull sprites in to better graphically represent all this? Ok, so that's two tasks that'll branch out from here.

- [ ] Learn more about the physics engine
- [x] Sprites? How that interplays with physics and representing my current, simple ideas.

Went looking for some free assets and found something called LPC which has the art style that I'm looking for and seems to be somewhat standardized. I produced a standard sprite sheet for the male character and downloaded it into my project. I'm still calling it `download.png` rather than updating `tiles.png` for now. Got it from https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator which seems really awesome, even though the LPC itself doesn't exist anymore.

I got my example app reading from the tile sheet properly (though it seems like it'll be tricky to eventually have a bunch of these, but I'll figure that out later). Furthermore the page where I generated this thing has some helpful previews that work to isolate which sprites I'm actually after. I used the Animation example to get the generic male character to walk left and it looks great! This is a good spot for a checkpoint commit.

But before I do that, I played around some more with the spritesheet generator. I'm not sure how I'm supposed to make use of this? If I, say, wanted a varied collection of sprites to generate I guess I need a full sprite sheet for each? There seems to be something where I can export just the items and just the characters so maybe I can fuss with that later. In addition, the only 'action' attacks that are properly animated in the way that I'd expect are spaced differently and are much larger than the other sprites. Interesting.

I can export just the walk and slash animations (and I guess the death animation, but that only faces the camera for some reason) and so maybe this is the method I'd use to reduce the amount of space eaten up by assets. At least, that's what makes the most sense for now.

- [ ] Take what I learned about sprites and apply them to the blue boxes. Walking animation while strolling and then attack animation once it reaches the wall.
