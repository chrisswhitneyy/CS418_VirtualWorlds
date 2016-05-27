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

var obstacles;
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
  .add('bob1', 'assets/bob1.png')
  .add('bob', 'assets/player.json')
  .add('circle', 'assets/circle.png')
  .load(setup);

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

  // Find the entity layer
  var entity_layer = world.getObject("entities");
  entity_layer.addChild(player);

  obstacles = [];

  for(var i=1; i<=3; i++){
    obs = new PIXI.Sprite(PIXI.Texture.fromFrame("assets/circle.png"));
    obs.scale.x = 0.5;
    obs.scale.y = 0.5;
    obstacles.push(obs);
    entity_layer.addChild(obs);
  }

  player.direction = MOVE_NONE;
  player.moving = false;
  state = running;
  animate();
}

function animate(timestamp) {
  requestAnimationFrame(animate);
  state();
  update_camera();
  renderer.render(stage);
}

function running(){

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

  if(l1 <= r2 && r1 >= l2 && b1 >= t2 && t1 <= b2){
    console.log("collsion");
    return true;
 }

  return false;
}
