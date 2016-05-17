/********
CS 413 Project 1 Minimalism: Frank the Alien 

Purpose: To demonstrate a basic understanding of the core techniologies
for this course these include, PIXIE.js, bitmap graphics, git, and scene
graph organization. 

Author: Christopher D. Whitney    
*********/

//Gets gameport element from document
var gameport = document.getElementById("gameport");

//Creates best render for browser
var renderer = PIXI.autoDetectRenderer(400,400,{backgroundColor:0x3344ee});

//Appends the render view to the gameport element
gameport.appendChild(renderer.view);

//Creates main stage container
var stage = new PIXI.Container();
//Aliases
var loader = PIXI.loader;
var resources = PIXI.loader.resources;
var Sprite = PIXI.Sprite;

loader.add("assets/frank-alien.png").load(setup);

var alien, state;

function setup(){
    alien_sprite = new Sprite();	
}

renderer.render(stage);
function gameLoop(){
  requestAnimationFrame(gameLoop);
  renderer.render(stage);
} 

gameLoop();
