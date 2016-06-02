/*****
Project 4:
******/

var GAME_HEIGHT = 400;
var GAME_WIDTH = 400;
var GAME_SCALE = 1;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(GAME_WIDTH,GAME_HEIGHT,{backgroundColor: 0x000000});

gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

var world;
var menuStage;
var levelStage;
var state;

var selector;
var player;
var lasers;
var zombie;

// Character movement constants
var MOVE_NONE = 0;
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var FIRE = 3;

// The move function starts or continues movement
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

  if (player.direction == MOVE_LEFT) {
    new_postion.x-= 40;
  }
  if (player.direction == MOVE_RIGHT)
    new_postion.x+= 40;
  if(player.direction == FIRE){
    player.texture = new PIXI.Texture.fromFrame('marsman1.png');
    shoot();
  }
  // collsion detection

  // tween to new position
  createjs.Tween.get(player).to({y:new_postion.y,x:new_postion.x},500,createjs.Ease.linear).call(move);
  //c reatejs.Tween.get(ball).to({y:new_postion.y+player.height,x:new_postion.x},500,createjs.Ease.linear).call(move);
}
function moveZombie(){
  if(!zombie) return;
  //createjs.Tween.get(zombie).to({x:zombie.x -= 20},createjs.Ease.linear);
}

function shoot() {
  if(levelStage){
    var laser = new PIXI.Graphics();
    laser.beginFill(0xe74c3c);
    laser.drawCircle(player.x+45,player.y+95,4);
    laser.endFill();
    levelStage.addChild(laser);
    createjs.Tween.removeTweens(laser.position);
    createjs.Tween.get(laser.position).to({x: laser.x+800}, 4000);
    lasers.push(laser);
  }
}

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
    {name: "down", from: "tutorial", to: "credits"},
    {name: "down", from: "credits", to: "credits"},
    {name: "up", from: "play", to: "play"},
    {name: "up", from: "tutorial", to: "play"},
    {name: "up", from: "credits", to: "tutorial"}],
  callbacks: {
    onplay: function() { moveSelector(0); },
    ontutorial: function() { moveSelector(37*1); },
    oncredits: function() { moveSelector(37*2); }
  }
});

function menuOnKeyDown(e){
  if (e.keyCode == 87) // W key
    menu.up();
  if (e.keyCode == 83) // S key
    menu.down();
  if (e.keyCode == 13){ // Enter key
    menuStage.visible = false;
    switch (menu.current) {
      case "play":
        level1Setup();
      case "credits":
        creditsSetup();
      case "tutorial":
        level0Setup();
      default:
        return;
    }

  }

}

function playOnKeydown (e) {
  e.preventDefault();
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
  //else if(e.keyCode == 13)
    //restart();
  move();
}
function playOnKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;

};

window.addEventListener("keydown",menuOnKeyDown);

PIXI.loader
  .add("map1","assets/map1.json")
  .add("assets/tileset.png","assets/tileset.png")
  .add("assets/assets.json","assets/assets.json")
  .add("gamefont.fnt","gamefont.fnt")
  .load(menuSetup);

function menuSetup(){
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map1", "assets/tileset.png");
  stage.addChild(world);

  menuStage = new PIXI.Container();

  var text = new PIXI.extras.BitmapText("play\ntutorial\ncredits", {font: "35px gamefont"});
  text.position.x = 45;
  text.position.y = 10;
  menuStage.addChild(text);

  selector = new PIXI.Sprite(PIXI.Texture.fromFrame("golf_ball.png"));
  selector.x = 10;
  selector.y = 10;
  menuStage.addChild(selector);

  stage.addChild(menuStage);

  animate();

}
function level0Setup(){
  // Removes menu event listener
  window.removeEventListener("keydown",menuOnKeyDown);

  // Keyup events end movement
  window.addEventListener("keyup",playOnKeyUp);
  window.addEventListener("keydown",playOnKeydown);

  levelStage = new PIXI.Container();

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("marsman2.png"));
  player.x = 10;
  player.y = 165;
  player.scale.x = 2;
  player.scale.y = 2;
  levelStage.addChild(player);

  zombie = new PIXI.Sprite(PIXI.Texture.fromFrame("zoombie1.png"));
  zombie.x = renderer.width;
  zombie.y = 165;
  zombie.scale.x = 2;
  zombie.scale.y = 2;
  levelStage.addChild(zombie);

  lasers = [];

  world.addChild(levelStage);
  state = level1;
  animate();
}

function animate(timestamp){
  requestAnimationFrame(animate);
  if(player)update_camera();
  if(state) state();
  renderer.render(stage);
}
var numCalls = 0;
function level1(){
  if(numCalls == 150){
    moveZombie();
    numCalls = 0;
  }
  numCalls ++;
  laserCollsionCheck();
}

function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
function laserCollsionCheck(){
  if(!lasers || !zombie) return;
  for (i=0;i<lasers.length;i++){
    if(lasers[i].x >= zombie.x){
      lasers.splice(i,1);
      levelStage.removeChild(zombie);
      return true;
    }
  }
  return false;
}
