/*******
Project 3 Tiles: Water Collection

The purpose of this game is to collect water for the alien 
bob. Use the WASD keys to move bob around the stage and e
enter to restart. 

Author: Chris Whitney
*******/

var GAME_WIDTH = 720;
var GAME_HEIGHT = 400;
var GAME_SCALE = 4;
// var HORIZON_Y = GAME_HEIGHT/GAME_SCALE/2;

var gameport = document.getElementById("gameport");
var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH,
                                           GAME_HEIGHT,
                                           {backgroundColor: 0x99D5FF});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = GAME_SCALE;
stage.scale.y = GAME_SCALE;

// Scene objects get loaded in the ready function
var player;
var world;

// Character movement constants:
var MOVE_LEFT = 1;
var MOVE_RIGHT = 2;
var MOVE_UP = 3;
var MOVE_DOWN = 4;
var MOVE_NONE = 0;

var score;
var obstacles = [];
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
    new_postion.x-= 20;
  }
  if (player.direction == MOVE_RIGHT)
    new_postion.x+= 20;

  if (player.direction == MOVE_UP)
    new_postion.y-= 20;
  
  if (player.direction == MOVE_DOWN)
    new_postion.y+= 20;
  
  //checks world boundariesa
  if(new_postion.x < 20 || new_postion.x > world.worldWidth-40 ||
    new_postion.y < 40 || new_postion.y > world.worldHeight-20){
    createjs.Tween.get(player).to({y:player.y,x:player.x},500).call(move);
  }
  else{
    createjs.Tween.get(player).to({y:new_postion.y,x:new_postion.x},500).call(move);
  }

  // if(rectangle_intersection(player,blocks[1])){
  //   console.log("collsion");
  //   createjs.Tween.get(player).to({x: player.x, y:player.y}, 500).call(move);
  // }
}
// Resarts the game
function restart(){
  stage.removeChild(world);
  score = 0;
  setup();
}

// Keydown events start movement
window.addEventListener("keydown", function (e) {
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
  else if(e.keyCode == 13)
    restart();

  move();
});

// Keyup events end movement
window.addEventListener("keyup", function onKeyUp(e) {
  e.preventDefault();
  if (!player) return;
  player.direction = MOVE_NONE;
});

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

PIXI.loader
  .add('map', 'map.json')
  .add('tileset', 'tileset.png')
  .add('bob', 'player.json')
  .add('circle', 'circle.png')
  .load(setup);

// Sets up the world
function setup() {
  var tu = new TileUtilities(PIXI);
  world = tu.makeTiledWorld("map", "tileset.png");
  stage.addChild(world);
  
  var frames = [];

  for (var i=1; i<=3; i++) {
    frames.push(PIXI.Texture.fromFrame('bob' + i + '.png'));
  }

  player = new PIXI.extras.MovieClip(frames);
  player.scale.x = 0.5;
  player.scale.y = 0.5;
  player.x = 40;
  player.y = 40;
  player.anchor.x = 0.0;
  player.anchor.y = 1.0;
  player.animationSpeed = 0.1;
  player.play();
  score = 0;

  // Find the entity layer
  entity_layer = world.getObject("entities");
  entity_layer.addChild(player);

  for(var i=1; i<=40; i++){
    obs = new PIXI.Sprite(PIXI.Texture.fromFrame("circle.png"));
    obs.scale.x = 0.5;
    obs.scale.y = 0.5;
    obs.x = Math.floor(Math.random() * ((world.worldWidth-40) - 30 + 1)) + 30;
    obs.y = Math.floor(Math.random() * ((world.height-40)- 30 + 1)) + 30;
    obstacles.push(obs);
    entity_layer.addChild(obs);
  }

  player.direction = MOVE_NONE;
  player.moving = false;
  state = state1;
  animate();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  state();
  update_camera();
  renderer.render(stage);
}

var score_container;
function state1(){
  checkCollsion();
  world.removeChild(score_container);
  score_container = new PIXI.Text(score,{font:'10px Arial',fill: "black"});
  score_container.x = player.x;
  score_container.y = player.y;
  world.addChild(score_container);
}

function update_camera() {
  stage.x = -player.x*GAME_SCALE + GAME_WIDTH/2 - player.width/2*GAME_SCALE;
  stage.y = -player.y*GAME_SCALE + GAME_HEIGHT/2 + player.height/2*GAME_SCALE;
  stage.x = -Math.max(0, Math.min(world.worldWidth*GAME_SCALE - GAME_WIDTH, -stage.x));
  stage.y = -Math.max(0, Math.min(world.worldHeight*GAME_SCALE - GAME_HEIGHT, -stage.y));
}

function rectangle_intersection(sprite1,sprite2){

  var l1 = sprite1.x;
  var r1 = sprite1.x + sprite1.width;
  var t1 = sprite1.y;
  var b1 = sprite1.y + sprite1.height;

  var l2 = sprite2.x;
  var r2 = sprite2.x + sprite2.width;
  var t2 = sprite2.y;
  var b2 = sprite2.y + sprite2.height;

  if(l1 < r2 && r1 > l2 && b1 > t2 && t1 < b2){
    return true;
 }
  return false;
}

function checkCollsion(){
  for (i=0; i<obstacles.length; i++){
    if(rectangle_intersection(player,obstacles[i])){
      entity_layer.removeChild(obstacles[i]);
      obstacles.splice(i,1);
      score ++;
    }
  }
}


