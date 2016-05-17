/********
CS 413 Project 1 Minimalism: Frank the Alien 

Purpose: To demonstrate a basic understanding of the core techniologies
for this course these include, PIXIE.js, bitmap graphics, git, and scene
graph organization. 

Author: Christopher D. Whitney    
*********/

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Get gameport div from document
var gameport = document.getElementById("gameport");

//Creates stage container
var stage = new Container();

//Get best render for browser
var renderer = autoDetectRenderer(400, 400,{backgroundColor:0x3344ee});

//Appends renderer view to gameport
gameport.appendChild(renderer.view);

//loads in alien asset and call setup
loader
  .add("assets/frank-alien.png")
  .load(setup);

//Define any variables that are used in more than one function
var alien, state;

function setup() {
  //Create the `alien` sprite 
  alien = new Sprite(resources["assets/frank-alien.png"].texture);
  alien.y = 96; 
  alien.vx = 0;
  alien.vy = 0;
  stage.addChild(alien);
  //Capture the keyboard arrow keys
  var left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  //Left arrow key `press` method
  left.press = function() {
    //Change the alien's velocity when the key is pressed
    alien.vx = -5;
    alien.vy = 0;
  };
  //Left arrow key `release` method
  left.release = function() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the alien isn't moving vertically:
    //Stop the alien
    if (!right.isDown && alien.vy === 0) {
      alien.vx = 0;
    }
  };
  //Up
  up.press = function() {
    alien.vy = -5;
    alien.vx = 0;
  };
  up.release = function() {
    if (!down.isDown && alien.vx === 0) {
      alien.vy = 0;
    }
  };
  //Right
  right.press = function() {
    alien.vx = 5;
    alien.vy = 0;
  };
  right.release = function() {
    if (!left.isDown && alien.vy === 0) {
      alien.vx = 0;
    }
  };
  //Down
  down.press = function() {
    alien.vy = 5;
    alien.vx = 0;
  };
  down.release = function() {
    if (!up.isDown && alien.vx === 0) {
      alien.vy = 0;
    }
  };
  //Set the game state
  state = play;
 
  //Start the game loop
  gameLoop();
}
function gameLoop(){
  //Loop this function 60 times per second
  requestAnimationFrame(gameLoop);
  //Update the current game state
  state();
  //Render the stage
  renderer.render(stage);
}
function play() {
  //Use the alien's velocity to make it move
  alien.x += alien.vx;
  alien.y += alien.vy
}
//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}