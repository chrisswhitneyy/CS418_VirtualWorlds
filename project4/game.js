/*****
******/

var GAME_HEIGHT = 720;
var GAME_WIDTH = 400;
var GAME_SCALE = 4;

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
  .add("assets/map1.json","map1")
  .add("assets/tileset.png","tileset")
  .load(setup);
function setup(){

}
function state1(){

}
function animate(timestamp){
  requestAnimationFrame(animate);
  state();
  update_camera();
  renderer.render(stage);
}

function update_camera(){

}
