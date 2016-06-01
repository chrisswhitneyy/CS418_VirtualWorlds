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

var player;
var ball;
var world;

// Character movement constants
var MOVE_NONE = 0;
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;

// Other actions
var JUMP = 3;
var FIRE = 4;

// The move function starts or continues movement
function move() {
  var new_postion = new PIXI.Sprite(player.texture);
  new_postion.x = player.x;
  new_postion.y = player.y;
  new_postion.height = player.height;
  new_postion.width = player.width;

  if (player.direction == MOVE_NONE) {
    player.texture = new PIXI.Texture.fromFrame('golfer1.png');
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
    //new_postion.y-=10;
    player.texture = new PIXI.Texture.fromFrame('golfer2.png');
    //createjs.Tween.get(ball).to({y:new_postion.y+225,x:new_postion.x},500,createjs.Ease.linear).call(move);
  }
  if(player.direction == JUMP){
    player.texture = new PIXI.Texture.fromFrame('golfer3.png');

  }

  // collsion detection

  // tween to new position
  createjs.Tween.get(player).to({y:new_postion.y,x:new_postion.x},500,createjs.Ease.linear).call(move);
  //c reatejs.Tween.get(ball).to({y:new_postion.y+player.height,x:new_postion.x},500,createjs.Ease.linear).call(move);


}

// Keydown events start movement
window.addEventListener("keydown",function onKeydown (e) {
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
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;

});


PIXI.loader
  .add("map1","assets/map1.json")
  .add("assets/tileset.png","assets/tileset.png")
  .add("assets/assets.json","assets/assets.json")
  .load(trainingSetup);

function trainingSetup(){
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map1", "assets/tileset.png");
  stage.addChild(world);

  // var text = new PIXI.Text("play\ninstructions\ncredits", {font: "16px Desyrel"});
  // text.position.x = 26;
  // text.position.y = 10;
  // world.addChild(text);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("golfer1.png"));
  player.x = -70;
  player.y = 200;
  world.addChild(player);

  ball = new PIXI.Sprite(PIXI.Texture.fromFrame("golf_ball.png"));
  ball.x = 20;
  ball.y = 200;
  ball.scale.x = 0.5;
  ball.scale.y = 0.5;
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
