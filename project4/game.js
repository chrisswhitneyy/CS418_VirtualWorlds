/*****
Project 4: Mars Zombies

The year is 2075 and humanity has begun to colonize mars,however,
this is the not the first time life has landed...life that has
been causing mutations within the colonizers. These mutations
cause the colonizers to turn green and desire flesh. Now you must
use your lasers to kill the mars zombies! To move us the A and D key.
To shoot use the space bar.

Author: Christopher D. Whitney
******/
const GAME_HEIGHT = 400;
const GAME_WIDTH = 800;
const GAME_SCALE = 1;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(GAME_WIDTH,GAME_HEIGHT,{backgroundColor: 0x000000});

gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

// Character movement constants
const MOVE_NONE = 0;
const MOVE_LEFT = 1;
const MOVE_RIGHT = 2;
const FIRE = 3;

// Sub stages and state vars
var menuStage;
var levelStage;
var state;
var listenerType;

// Menu var
var selector;

// Game vars
var world;
var player;
var lasers;
var zombies;
var bonuses;
var emitter;

// The move function starts or continues movement of the player
function move() {
  if(!player) return;

  var new_postion = new PIXI.Sprite(player.texture);
  new_postion.x = player.x;
  new_postion.y = player.y;

  if (player.direction == MOVE_NONE) {
    player.texture = new PIXI.Texture.fromFrame('marsman2.png');
    player.moving = false;
    return;
  }

  player.moving = true;
  player.texture = new PIXI.Texture.fromFrame('marsman2.png');

  if (player.direction == MOVE_LEFT)
    new_postion.x-= 40;
  if (player.direction == MOVE_RIGHT)
    new_postion.x+= 40;
  if(player.direction == FIRE){
    player.texture = new PIXI.Texture.fromFrame('marsman1.png');
    shoot(player.lasernum);
  }
  // tween player to new position
  createjs.Tween.get(player).to({y:new_postion.y,x:new_postion.x},500,createjs.Ease.linear).call(move);
}
// The move function starts or continues movement of the zombies
function moveZombies(speed){
  if(!zombies) return;
  for (i=0; i<zombies.length;i++){
    if(zombies[i].lastmoved == speed*25){
      createjs.Tween.get(zombies[i]).to({x:zombies[i].x -= speed*5},speed,createjs.Ease.easeInElastic);
      zombies[i].lastmoved = 0;
    }
    zombies[i].lastmoved ++;
  }

}
// Generates and move player lasers
function shoot(n) {
  if(!levelStage) return;
  if(!player.visible) return;

  for(i=0; i<n; i++){
    // Inits laser circle graphics
    var laser = new PIXI.Graphics();
    laser.beginFill(0xe74c3c);
    // X and Y offset to players hand
    laser.drawCircle(player.x+45,player.y+95,4);
    laser.endFill();
    levelStage.addChild(laser);
    createjs.Tween.removeTweens(laser.position);
    createjs.Tween.get(laser.position).to({x: laser.x+1000}, 400+i*40);
    sound = PIXI.audioManager.getAudio("assets/shot.mp3");
    sound.play();

    lasers.push(laser);
  }
}
// Moves menu selctor
function moveSelector(y){
  if (!selector) return;
  createjs.Tween.removeTweens(selector.position);
  createjs.Tween.get(selector.position).to({y: 10 + y}, 500, createjs.Ease.bounceOut);
}

var menu = StateMachine.create({
  initial: {state: 'play', event: 'init'},
  error: function() {},
  events: [
    {name: "down", from: "play", to: "tutorial"},
    {name: "down", from: "tutorial", to: "tutorial"},
    {name: "up", from: "play", to: "play"},
    {name: "up", from: "tutorial", to: "play"},
    {name: "up", from: "credits", to: "tutorial"}],
  callbacks: {
    onplay: function() { moveSelector(0); },
    ontutorial: function() { moveSelector(50*1); }
  }
});

function onKeyDown(e){
  e.preventDefault();
  switch (listenerType) {
    case "menu":
      if (e.keyCode == 87) // W key
        menu.up();
      if (e.keyCode == 83) // S key
        menu.down();
      if (e.keyCode == 13){ // Enter key
        menuStage.visible = false;
        switch (menu.current) {
          case "play":
            level1Setup();
            break;
          case "credits":
            creditsSetup();
            break;
          case "tutorial":
            level0Setup();
            break;
          default: return;
        }
      }
      break;
    case "play":
      if (!player) return;
      if (player.moving) return;
      if (e.repeat == true) return;

      player.direction = MOVE_NONE;

      if (e.keyCode == 87)
        player.direction = JUMP;
      else if (e.keyCode == 65)
        player.direction = MOVE_LEFT;
      else if (e.keyCode == 68)
        player.direction = MOVE_RIGHT;
      else if (e.keyCode == 32)
        player.direction = FIRE;
      else if (e.keyCode == 13)
        restart();
      move();
      break;
    default: return;
  }
}
function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
};


listenerType = "menu";
window.addEventListener("keydown",onKeyDown);
window.addEventListener("keyup",onKeyUp);

PIXI.loader
  .add("assets/level0map","assets/level0map.json")
  .add("assets/level1map","assets/level1map.json")
  .add("assets/level2map","assets/level2map.json")
  .add("assets/level3map","assets/level3map.json")
  .add("assets/shot.mp3","assets/shot.mp3")
  .add("assets/powerup.mp3","assets/powerup.mp3")
  .add("assets/zombiehit.mp3","assets/zombiehit.mp3")
  .add("assets/tileset.png","assets/tileset.png")
  .add("assets/assets.json","assets/assets.json")
  .add("gamefont.fnt","assets/gamefont.fnt")
  .add("assets/particle.png","assets/particle.png")
  .load(menuSetup);

/*****
Setup functions: These functions create a given stage and
adds all the Sprites that will appear. These functions then
call animate. Optionally one can set the variable state eqaul
a running state function which will be called everything animation
is called.
******/


// Setup function for the menu
function menuSetup(){

  menuStage = new PIXI.Container();

  emitter = new PIXI.particles.Emitter(
    menuStage,

    // I downloaded the image from http://pixijs.github.io/pixi-particles-editor/
    [PIXI.Texture.fromImage("assets/particle.png")],
    // Emitter configuration; This was copied and pasted from the file
    // downloaded from http://pixijs.github.io/pixi-particles-editor/
    {
  	"alpha": {
  		"start": 1,
  		"end": 0.7
  	},
  	"scale": {
  		"start": 1,
  		"end": 0.01,
  		"minimumScaleMultiplier": 20
  	},
  	"color": {
  		"start": "#382400",
  		"end": "#470101"
  	},
  	"speed": {
  		"start": 100,
  		"end": 100
  	},
  	"acceleration": {
  		"x": 0,
  		"y": 0
  	},
  	"startRotation": {
  		"min": 0,
  		"max": 360
  	},
  	"rotationSpeed": {
  		"min": 0,
  		"max": 0
  	},
  	"lifetime": {
  		"min": 0.2,
  		"max": 0.8
  	},
  	"blendMode": "add",
  	"frequency": 0.001,
  	"emitterLifetime": -1,
  	"maxParticles": 500,
  	"pos": {
  		"x": 0,
  		"y": 0
  	},
  	"addAtBack": false,
  	"spawnType": "circle",
  	"spawnCircle": {
  		"x": 0,
  		"y": 0,
  		"r": 0
  	}
  });

  var text = new PIXI.extras.BitmapText("Mars Zombies", {font: "75px gamefont"});
  text.position.x = 45;
  text.position.y = 10;
  menuStage.addChild(text);

  text = new PIXI.extras.BitmapText("Credited by\nChristopher\nWhitney", {font: "15px gamefont"});
  text.position.x = 350;
  text.position.y = 300;
  menuStage.addChild(text);

  options = new PIXI.extras.BitmapText("play\ntutorial", {font: "45px gamefont"});
  options.position.x = 45;
  options.position.y = 120;
  menuStage.addChild(options);

  selector = new PIXI.Graphics();
  selector.beginFill(0xe74c3c);
  selector.drawCircle(options.x,options.y+15,10);
  selector.endFill();
  menuStage.addChild(selector);

  stage.addChild(menuStage);

  emitter.emit = true;
  emitter.update(0, 200);

  animate();

}
// Setup function for the level0/tutorial
function level0Setup(){
  listenerType = "play";
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("assets/level0map", "assets/tileset.png");
  stage.addChild(world);

  levelStage = new PIXI.Container();

  var text = new PIXI.extras.BitmapText("Press\nA to move left\nD to move right\nspace to shoot", {font: "15px gamefont"});
  text.position.x = 45;
  text.position.y = 10;
  levelStage.addChild(text);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("marsman2.png"));
  player.x = 10;
  player.y = 165;
  player.scale.x = 2;
  player.scale.y = 2;
  player.health = 5;
  player.won = false;
  player.lasernum = 1;
  levelStage.addChild(player);

  // Init lasers and zombies list
  lasers = [];
  zombies = [];
  // Spans two zombies
  spanZombies(2);
  world.addChild(levelStage);

  state = level0;
  animate();
}
function level1Setup(){
  listenerType = "play";
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("assets/level1map", "assets/tileset.png");
  stage.addChild(world);

  levelStage = new PIXI.Container();

  bonus = new PIXI.Sprite(PIXI.Texture.fromFrame("bonus.png"));
  bonus.x = 400;
  bonus.y = 290;
  bonus.type = "shootImprovement";
  levelStage.addChild(bonus);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("marsman2.png"));
  player.x = 10;
  player.y = 165;
  player.scale.x = 2;
  player.scale.y = 2;
  player.health = 5;
  player.won = false;
  player.lasernum = 1;
  levelStage.addChild(player);

  // Init lists
  lasers = [];
  zombies = [];
  bonuses = [bonus];

  // Spans intial two zombies
  spanZombies(2);
  levelStage.numspans = 1;
  levelStage.maxspans = 2;
  levelStage.spancounter = 0;

  world.addChild(levelStage);

  state = level1;
  animate();
}
function level2setup(){

  stage.removeChild(world);

  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("assets/level2map", "assets/tileset.png");
  stage.addChild(world);

  levelStage = new PIXI.Container();

  bonus = new PIXI.Sprite(PIXI.Texture.fromFrame("bonus.png"));
  bonus.x = 400;
  bonus.y = 290;
  bonus.type = "shootImprovement";
  levelStage.addChild(bonus);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("marsman2.png"));
  player.x = 10;
  player.y = 165;
  player.scale.x = 2;
  player.scale.y = 2;
  player.health = 5;
  player.won = false;
  player.lasernum = 2;

  levelStage.addChild(player);

  // Init lasers and zombies list
  lasers = [];
  zombies = [];
  bonuses = [bonus];
  // Spans intial two zombies
  spanZombies(3);
  levelStage.numspans = 1;
  levelStage.maxspans = 4;
  levelStage.spancounter = 0;


  world.addChild(levelStage);

  state = level2;
  animate();
}
function level3setup(){

  stage.removeChild(world);

  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("assets/level3map", "assets/tileset.png");
  stage.addChild(world);

  levelStage = new PIXI.Container();

  bonus = new PIXI.Sprite(PIXI.Texture.fromFrame("bonus.png"));
  bonus.x = 200;
  bonus.y = 290;
  bonus.type = "shootImprovement";
  levelStage.addChild(bonus);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("marsman2.png"));
  player.x = 10;
  player.y = 165;
  player.scale.x = 2;
  player.scale.y = 2;
  player.health = 5;
  player.won = false;
  player.lasernum = 1;

  levelStage.addChild(player);

  // Init lasers and zombies list
  lasers = [];
  zombies = [];
  bonuses = [bonus];
  // Spans intial two zombies
  spanZombies(4);
  levelStage.numspans = 1;
  levelStage.maxspans = 5;
  levelStage.spancounter = 0;

  world.addChild(levelStage);

  state = level3;
  animate();
}
function level3setup(){

  stage.removeChild(world);

  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("assets/level3map", "assets/tileset.png");
  stage.addChild(world);

  levelStage = new PIXI.Container();

  bonus = new PIXI.Sprite(PIXI.Texture.fromFrame("bonus.png"));
  bonus.x = 200;
  bonus.y = 290;
  bonus.type = "shootImprovement";
  levelStage.addChild(bonus);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("marsman2.png"));
  player.x = 10;
  player.y = 165;
  player.scale.x = 2;
  player.scale.y = 2;
  player.health = 5;
  player.won = false;
  player.lasernum = 1;

  levelStage.addChild(player);

  // Init lasers and zombies list
  lasers = [];
  zombies = [];
  bonuses = [bonus];
  // Spans intial two zombies
  spanZombies(4);
  levelStage.numspans = 1;
  levelStage.maxspans = 5;
  levelStage.spancounter = 0;

  world.addChild(levelStage);

  state = level3;
  animate();
}

function looseSetup(){
  var text = new PIXI.extras.BitmapText("You've been eaten!\nPress enter to return to play again", {font: "10px gamefont"});
  text.position.x = player.x-35;
  text.position.y = player.y;
  levelStage.addChild(text);
  animate();
}
function winSetup(){

  var text = new PIXI.extras.BitmapText("Congrats you won!\nPress enter to return to play again", {font: "10px gamefont"});
  text.x = player.x + 35;
  text.y = player.y;

  stage.addChild(text);
  state = win;
  animate();
}


function animate(timestamp){
  requestAnimationFrame(animate);
  if(player)update_camera();
  if(state)state();
  if(emitter) {
    emitter.updateSpawnPos(50,10);
  }

  renderer.render(stage);
}

/*****
Running State Functions: These functions are called every time
animate is called and is where the game logic is located.
*****/

//Level0/tutorial running state functions
function level0(){
  laserCollsionCheck();
  if(checkWin()) winSetup();
  zombieCollsionCheck();
  moveZombies(1);
}
function level1(){
  laserCollsionCheck();
  if(checkEndLevel() && checkWin()){
    level2setup();
  }
  bonusesCollsionCheck();
  zombieCollsionCheck();
  moveZombies(1);
  if(levelStage.spancounter == 100
    && levelStage.maxspans != levelStage.numspans){
    spanZombies(3);
    levelStage.numspans++;
    levelStage.spancounter = 0;
    return;
  }
  levelStage.spancounter++;
}
function level2(){
  laserCollsionCheck();
  if(checkEndLevel() && checkWin()){
    level3setup();
  }
  bonusesCollsionCheck();
  zombieCollsionCheck();
  moveZombies(2);
  if(levelStage.spancounter == 100
    && levelStage.maxspans != levelStage.numspans){
    spanZombies(4);
    levelStage.numspans++;
    levelStage.spancounter = 0;
    return;
  }
  levelStage.spancounter++;
}
function level3(){
  laserCollsionCheck();
  if(checkEndLevel() && checkWin()){
    winSetup();
  }
  bonusesCollsionCheck();
  zombieCollsionCheck();
  moveZombies(2);
  if(levelStage.spancounter == 50
    && levelStage.maxspans != levelStage.numspans){
    spanZombies(5);
    levelStage.numspans++;
    levelStage.spancounter = 0;
    return;
  }
  levelStage.spancounter++;
}
function win(){}

// Updates the stages x and y so that the player moves through
// the world.
function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

// Checks if any lasers collided with a zombie
// If the zombies is zero it is remove from the stage
// and true else false
function laserCollsionCheck(){
  if(!lasers || !zombies) return;
  //loops through all the lasers and zombies
  for (i=0;i<lasers.length;i++){
    for(j=0;j<zombies.length;j++){
      if(!lasers[i]) return;
      if(lasers[i].x >= zombies[j].x- zombies[j].width){
        zombies[j].health --;
        if(zombies[j].health==0){
          levelStage.removeChild(zombies[j]);
          zombies.splice(j,1);
          levelStage.removeChild(lasers[i]);
          lasers.splice(i,1);
          hit = PIXI.audioManager.getAudio("assets/zombiehit.mp3");
          hit.play();

          return true;
        }
        zombies[j].texture = new PIXI.Texture.fromFrame('zoombie4.png');
        levelStage.removeChild(lasers[i]);
        lasers.splice(i,1);

        hit = PIXI.audioManager.getAudio("assets/zombiehit.mp3");
        hit.play();
      }
    }
  }
  if(zombies.length == 0){
    player.won = true;
  }
  return false;
}
// Returns true if zombie collsion and player still alive.
// If collsion and playes health is zero then it calls the
// looseSetup
function zombieCollsionCheck(){
  if(!zombies || !player) return;
  for(i=0;i<zombies.length;i++){
    if(player.x >= zombies[i].x - zombies[i].width){
      player.health --;
      if(player.health == 0) {
        player.visible = false;
        looseSetup();
      }
      return true;
    }
  }
  return false;
}
// Detects players collsion with a bonus box
function bonusesCollsionCheck(){
  if(!player || !bonuses) return;
  for (i=0; i<bonuses.length; i++){
    if(player.x >= bonuses[i].x - bonuses[i].width){
      switch (bonuses[i].type) {
        case "shootImprovement":
          player.lasernum = 4;
          bonuses[i].visible = false;
          bonuses.splice(i,1);
          powerup = PIXI.audioManager.getAudio("assets/powerup.mp3");
          powerup.play();
          break;
        default:

      }
    }
  }
}
function checkWin(){
  if(player.won){
    return true;
  }
  return false;
}

function checkEndLevel(){
  if (player.x - player.width > GAME_WIDTH + 100){
    return true;
  }
  return false;
}

// Spans zombie at the end of the world and
// pushes them onto the zombie array.
function spanZombies(n,x){
  var randnum = Math.floor((Math.random() * 800) + 400);
  for (i=1; i<=n; i++){
    var zombie = new PIXI.Sprite(PIXI.Texture.fromFrame("zoombie1.png"));
    var frames = [];
    for (var j=1; j<=3; j++) {
      frames.push(PIXI.Texture.fromFrame('zoombie' + j + '.png'));
    }
    zombie = new PIXI.extras.MovieClip(frames);
    zombie.position.x = randnum + (i*80);
    zombie.position.y = 330;
    zombie.scale.x = 2;
    zombie.scale.y = 2;
    zombie.health = 2;
    zombie.lastmoved = 0;
    zombie.anchor.x = 0.0;
    zombie.anchor.y = 1.0;
    zombie.animationSpeed = 0.1;
    zombie.play();
    zombies.push(zombie);
    levelStage.addChild(zombie);
  }
}

function restart(){
  levelStage.removeChild(player);
  stage.removeChild(world);
  stage.removeChild(levelStage);
  level1Setup();
}
