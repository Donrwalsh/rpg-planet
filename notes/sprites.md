### 9/26/25

These notes cover work prior to this day in a catchup sort of way.

I found something called the Liberated Pixel Cup while exploring OpenGameArt for game assets. All the sprites for this cup seem to be somewhat uniform hin that they have different assets that you can swap out. This seems like it will enable the ability for as much variety as I like, but there are some gaps in my understanding of how everything works here that are preventing me from seeing that just yet. As in, I think I need a distinct set of sprites for each NPC that I render? Not super concerned about this yet but I'll toss something on TODO to look into it I guess.

Anyway, that leads me to this utility: https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator. There are a few awesome aspects of this that I want to call out:

- First of all, the preview immediately renders the sprite. I've found this useful for determining the location of sprites in the provided sprite sheet (which isn't labeled, but the Preivew is (??)) as well as using the rendered sprite as guidance for if I'm implementing my display correctly. More on this when I talk about the pickaxe attack animation.
- Next is the actual, intended function of this tool: It can spit out custom sprite sheets. Now, I haven't messed with this all that much because I'd need a way to stitch the output together as they come in small files for each animation. This is great, because there's a lot on the sprite sheet that I don't plan to use. LittleJS supports massive sprite sheets, so I know there's space to fit what I want to do here (for suitably reasonable representations of what I want to do).
- Worth mentioning is that there is just a ton of variety. I'm probably going to spend some time jotting down which sections are worth paying attention to as I build my first sprite.

## First Sprite

Ok. I need a core starter NPC that represents a generic peasant.

- Body Type, I like Male, Female and Muscular. Teen maybe but it's very thin. Child is headless lol and the presence of pregnant may be interesting for showing data RE: lineage system? idk.

- Skip Shadow and Body color. I can do those myself with LJS.

- Zombie and skeleton are interesting but don't modify the head.

- Wounds are interesting. Arm is hard to see at all. Brain and Ribs are kinda cool.

- Tails are nifty. Wings are flashier. Could maybe be something here to toss on as part of something else, idk.

- **Wings are awesome**. However they don't seem to animate or have any sort of 'flying' action. I noticed just now that there's a **run animation** which is really cool to know about.

  - Just wanted to mention that there's a decent amount of variety here. Feathered Wings for holy type stuff, Bat/Lizard Wings for other lanes and Pixie/Monarch wings. Lots of cool possibility here.

- Body - Lizard has some big dragonborn potential. It's just wings and a tail, but it's part of body so I guess all the other gear and customization should be compatible.

- Now onto the clothes. Actually I'm taking a detour.

The repo for this site https://github.com/liberatedpixelcup/Universal-LPC-Spritesheet-Character-Generator?tab=readme-ov-file is pretty cool. I'm learning more about the LPC through this and it seems that this project compiles together all the different submissions to the cup that are available, so I don't need to spend any time looking at opengameart.org or stuff like that (for npc sprites, I mean). I can also export the description of the sprite I'm building and since this is going to get kinda intricate, I figure I'll spend some time establishing a process and strategy for that.

I had a really cool idea that the color of the outfit could indicate class early on. So I'm going to make a red warrior based on the red-STR, blue-INT, green-DEX concept. Might mess with that later. Could introduce some color theory. . .

Let's go even further with this and consider how these items that I'm messing with are essentially equipment slots for the NPCs. So maybe come at it from that way.

Warrior NPC:

| Item Slot | Equipment   |
| --------- | ----------- |
| Weapon    | Empty       |
| Head      | Empty       |
| Hands     | Empty       |
| Body      | Red Shirt   |
| Pants     | Black Pants |
| Boots     | Empty       |

Here's the JSON export:

{
"bodyTypeName": "male",
"url": "https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/#?body=Body_color_light&head=Human_male_light&clothes=Shortsleeve_Polo_red&wrists=none_Cuffs&legs=Pantaloons_black&shoes=none_Basic_Boots&hair=Plain_light_brown",
"spritesheets": "https://liberatedpixelcup.github.io/Universal-LPC-Spritesheet-Character-Generator/spritesheets/",
"version": 1,
"datetime": "9/26/2025, 1:47:08 PM",
"credits": [
{
"fileName": "body/bodies/male/light.png",
"licenses": "OGA-BY 3.0,CC-BY-SA 3.0,GPL 3.0",
"authors": "bluecarrot16,JaidynReiman,Benjamin K. Smith (BenCreating),Evert,Eliza Wyatt (ElizaWy),TheraHedwig,MuffinElZangano,Durrani,Johannes Sjölund (wulax),Stephen Challener (Redshrike)",
"urls": "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles,https://opengameart.org/content/lpc-medieval-fantasy-character-sprites,https://opengameart.org/content/lpc-male-jumping-animation-by-durrani,https://opengameart.org/content/lpc-runcycle-and-diagonal-walkcycle,https://opengameart.org/content/lpc-revised-character-basics,https://opengameart.org/content/lpc-be-seated,https://opengameart.org/content/lpc-runcycle-for-male-muscular-and-pregnant-character-bases-with-modular-heads,https://opengameart.org/content/lpc-jump-expanded,https://opengameart.org/content/lpc-character-bases",
"notes": "see details at https://opengameart.org/content/lpc-character-bases; 'Thick' Male Revised Run/Climb by JaidynReiman (based on ElizaWy's LPC Revised)"
},
{
"fileName": "head/heads/human/male/light.png",
"licenses": "OGA-BY 3.0,CC-BY-SA 3.0,GPL 3.0",
"authors": "bluecarrot16,Benjamin K. Smith (BenCreating),Stephen Challener (Redshrike)",
"urls": "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles,https://opengameart.org/content/lpc-character-bases",
"notes": "original head by Redshrike, tweaks by BenCreating, modular version by bluecarrot16"
},
{
"fileName": "hair/plain/adult/light_brown.png",
"licenses": "OGA-BY 3.0,CC-BY-SA 3.0,GPL 3.0",
"authors": "JaidynReiman,Manuel Riecke (MrBeast),Joe White",
"urls": "https://opengameart.org/content/liberated-pixel-cup-lpc-base-assets-sprites-map-tiles,https://opengameart.org/content/ponytail-and-plain-hairstyles,https://opengameart.org/content/lpc-expanded-hair",
"notes": ""
},
{
"fileName": "torso/clothes/shortsleeve/shortsleeve_polo/male/red.png",
"licenses": "OGA-BY 3.0",
"authors": "ElizaWy,JaidynReiman,Stephen Challener (Redshrike),Johannes Sjölund (wulax)",
"urls": "http://opengameart.org/content/lpc-revised-character-basics,https://github.com/ElizaWy/LPC/tree/main/Characters/Clothing,https://opengameart.org/content/lpc-expanded-sit-run-jump-more,https://opengameart.org/content/lpc-expanded-simple-shirts",
"notes": "original by ElizaWy; spellcast/thrust/shoot/hurt/male adapted from original by JaidynReiman"
},
{
"fileName": "legs/pantaloons/male/black.png",
"licenses": "OGA-BY 3.0,GPL 2.0,GPL 3.0,CC-BY-SA 3.0",
"authors": "Nila122,JaidynReiman,Johannes Sjölund (wulax),Stephen Challener (Redshrike)",
"urls": "https://opengameart.org/content/lpc-pirates,https://opengameart.org/content/more-lpc-clothes-and-hair,https://opengameart.org/content/lpc-expanded-pants",
"notes": "Original bases by Redshrike, thrust/shoot bases by Wulax, Original Pantaloons by Nila122, climb/jump/run/sit/emotes/revised combat by JaidynReiman"
}
],
"layers": [
{
"fileName": "body/bodies/male/light.png",
"zPos": 10,
"parentName": "body",
"name": "Body_color",
"variant": "light",
"supportedAnimations": "spellcast,thrust,walk,slash,shoot,hurt,watering,idle,jump,run,sit,emote,climb,combat,1h_slash,1h_backslash,1h_halfslash"
},
{
"fileName": "legs/pantaloons/male/black.png",
"zPos": 20,
"parentName": "legs",
"name": "Pantaloons",
"variant": "black",
"supportedAnimations": "spellcast,thrust,walk,slash,shoot,hurt,watering,idle,jump,run,sit,emote,climb,combat,1h_slash,1h_backslash,1h_halfslash"
},
{
"fileName": "torso/clothes/shortsleeve/shortsleeve_polo/male/red.png",
"zPos": 35,
"parentName": "clothes",
"name": "Shortsleeve_Polo",
"variant": "red",
"supportedAnimations": "spellcast,thrust,walk,slash,shoot,hurt,watering,idle,jump,run,sit,emote,climb,combat,1h_slash,1h_backslash,1h_halfslash"
},
{
"fileName": "head/heads/human/male/light.png",
"zPos": 100,
"parentName": "head",
"name": "Human_male",
"variant": "light",
"supportedAnimations": "spellcast,thrust,walk,slash,shoot,hurt,watering,idle,jump,run,sit,emote,climb,combat,1h_slash,1h_backslash,1h_halfslash"
},
{
"fileName": "hair/plain/adult/light_brown.png",
"zPos": 120,
"parentName": "hair",
"name": "Plain",
"variant": "light brown",
"supportedAnimations": "spellcast,thrust,walk,slash,shoot,hurt,watering,idle,jump,run,sit,emote,climb,combat,1h_slash,1h_backslash,1h_halfslash"
}
]
}

### Animation

So I've already played with this using some code from an example but let's have at it again. It occurs to me that I should probably chip away at establishing a repeatable process for procuring a sprite somewhat soon. I'll toss a todo up on that but I might end up going a different way? I mean, how does the generator handle it? anyway.

Working on cropping the smaller files (obtained by doing split by animation only) which I included in the nearby folder. Since the height is always 64 pixels this is really easy to be precise with. I took the four that I need for the warrior and used them to make a sprite sheet.

Was thinking I might be in a bind here for multiple warriors since I haven't quite figured out how to handle multiple melee mobs. But then. . . jumping! I have some ideas how this might work and I think that's a great way to solve this particular issue for now.

Ok, so I'm going to bring over the same movement animation that I used previously so I'm going to go ahead and checkpoint here.

Cool. So I've got some stuff brewing here, but I'm getting tired of clicking all the time to spawn one dude. Gonna add some auto-spawning next. I'm a fan of the movement as it works right now. Jumping adds an interesting element here. I'm not using all of the jump sprites but I think this is sufficient for now.

I'm interested in adding some variety here. I think it'll be a fun endeavor to throw in representations of the other two starter npc classes so I can play with variation on their behavior.

Fussed with using two different source files and got it working. That's absolutely huge! Time to move on to making distinct NPCs with different behavior sets.

Ok, I see how this works. I can render the sprite in pieces. Let's go.

Starting to think that this would be more interesting if I took full advantage of the LPC structure.
