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
var world;

// Character movement constants
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_NONE = 0;

PIXI.loader
  .add("map","assets/map.json")
  .add("assets/tileset.png","assets/tileset.png")
  .add("assets/player.png","assets/player.png")
  .load(setup);

function setup(){
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map", "assets/tileset.png");
  stage.addChild(world);

  var text = new PIXI.Text("play\ninstructions\ncredits", {font: "16px Desyrel"});
  text.position.x = 26;
  text.position.y = 10;
  world.addChild(text);

  player = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/player.png"));
  world.addChild(player);

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
