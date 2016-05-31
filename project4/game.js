/*****
Project 4:
******/

var GAME_HEIGHT = 600;
var GAME_WIDTH = 400;
var GAME_SCALE = 1;

var gameport = document.getElementById("gameport");
var renderer = PIXI.autoDetectRenderer(GAME_WIDTH,GAME_HEIGHT,{backgroundColor: 0x000000});

gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

var player;
var ball;
var world;

// Character movement constants
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var FIRE = 5;
var MOVE_NONE = 0;

// The move function starts or continues movement
function move() {
  var new_postion = new PIXI.Sprite(player.texture);
  new_postion.x = player.x;
  new_postion.y = player.y;
  new_postion.height = player.height;
  new_postion.width = player.width;

  if (player.direction == MOVE_NONE) {
    player.moving = false;
    return;
  }

  player.moving = true;

  if (player.direction == MOVE_LEFT) {
    new_postion.x-= 40;
  }
  if (player.direction == MOVE_RIGHT)
    new_postion.x+= 40;

  if (player.direction == MOVE_UP)
    new_postion.y-= 40;

  if (player.direction == MOVE_DOWN)
    new_postion.y+= 40;

  if(player.direction == FIRE){
    new_postion.y-=10;
    createjs.Tween.get(player).to({y:new_postion.y+player.height,x:new_postion.x},500,createjs.Ease.linear);
    createjs.Tween.get(ball).to({y:new_postion.y+225,x:new_postion.x},500,createjs.Ease.linear).call(move);
  }

  // collsion detection

  // tween to new position
  createjs.Tween.get(player).to({y:new_postion.y,x:new_postion.x},500,createjs.Ease.linear);
  createjs.Tween.get(ball).to({y:new_postion.y+player.height,x:new_postion.x},500,createjs.Ease.linear).call(move);

    //}
}

// Keydown events start movement
window.addEventListener("keydown",function onKeydown (e) {
  e.preventDefault();
  if (!player) return;
  if (player.moving) return;
  if (e.repeat == true) return;

  player.direction = MOVE_NONE;

  if (e.keyCode == 87)
    player.direction = MOVE_UP;
  else if (e.keyCode == 83)
    player.direction = MOVE_DOWN;
  else if (e.keyCode == 65)
    player.direction = MOVE_LEFT;
  else if (e.keyCode == 68)
    player.direction = MOVE_RIGHT;
  else if (e.keyCode == 32)
    player.direction = FIRE;
  //else if(e.keyCode == 13)
    //restart();
    console.log(e.keyCode)
  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
});



PIXI.loader
  .add("map","assets/map.json")
  .add("assets/tileset.png","assets/tileset.png")
  .add("assets/player.png","assets/player.png")
  .add("assets/golf_ball.png","assets/golf_ball.png")
  .load(menuSetup);

function menuSetup(){
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map", "assets/tileset.png");
  stage.addChild(world);

  var text = new PIXI.Text("play\ninstructions\ncredits", {font: "16px Desyrel"});
  text.position.x = 26;
  text.position.y = 10;
  world.addChild(text);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/player.png"));
  player.x = 40;
  player.y = 80;
  world.addChild(player);

  ball = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/golf_ball.png"));
  ball.x = player.x;
  ball.y = player.y + player.height;
  world.addChild(ball);

  // state function reference
  state = state1;
  animate();
}

function state1(){

}
function animate(timestamp){
  requestAnimationFrame(animate);
  state();
  update_camera();
  renderer.render(stage);
}

function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}
