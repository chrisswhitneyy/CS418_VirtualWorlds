/*******
CS 413 Project 1-Minimalism

Purpose: To demostrate basic understanding of the core techniologies 
needed for this course, this includes, PIXI.js, bitmap graphics, and
sceen graph organization. 

Each stage has a setup and play function, the setup function is only 
called once to create the sub stages, and the play function is called
repeatly by the animate(). The play function checks and updates 
the main_stage and renders.

Note (4/16/16): Major improvements are needed to the collisions 
calculations. 
 
Author: Christopher D. Wholeney 
*******/

//Aliases for PIXI.js
var Container = PIXI.Container, 
    Sprite = PIXI.Sprite, 
    Text = PIXI.Text, 
    Texture = PIXI.Texture, 
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources; 

//gets gameport div element
var gameport = document.getElementById("gameport");

//auto detect best render for the browsers
var renderer = autoDetectRenderer(400,400);
//appends renderer view to gameport 
gameport.appendChild(renderer.view); 

//set document event handler
document.addEventListener('keydown',keydownEventHandler);

//game stage
var main_stage = new Container(0x000000, true); //main stage
var board = new Container(); //game board
var win = new Container(); //win text

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

//load assets
loader.add("assets/golf_ball.png");
loader.add("assets/hole.png");
loader.add("assets/background.png");

//loaders calls menu_setup()
loader.load(boardSetup);

//vars seen by both setup and play
var golf_ball,hole,board,holes,hole_board,state; 

//boardSetup: This function adds child elements to the board stage, 
//this includes a grass background,an golf ball, and a hole.
function boardSetup(){
    //creates instances of background sprite 
    background = new Sprite(resources["assets/background.png"].texture);
    //adds background to main_stage
    main_stage.addChild(background); 

    //creates instances of golf_ball sprite and adjusts position
    golf_ball = new Sprite(resources["assets/golf_ball.png"].texture);
    golf_ball.y = 96; 
    golf_ball.x = 96;
    //sets holes anchors
    golf_ball.anchor.x = 0.5;
    golf_ball.anchor.y = 0.5;

    //adds golf_ballt to board stage
    board.addChild(golf_ball); 
    
    //creates instances of hole sprite and initial position
    hole = new Sprite(resources["assets/hole.png"].texture);
    hole.y = 100;
    hole.x = 200; 
    //sets holes anchors
    hole.anchor.x = 0.5;
    hole.anchor.y = 0.5;
   
    //adds hole to the board stage
    board.addChild(hole);

    // hole board
    holes = 0;
    hole_board = new Text("Holes made: " + holes , {font:"20px Arial", fill:"wholee"});
    board.addChild(hole_board);
    
    //adds board to main_stage
    main_stage.addChild(board);
    
    //sets holes to zero 
    holes = 0;
    //sets state
    state = playBoard;
 
    //call animate()
    animate();
}

//winSetup: this function sets up the win stage with some text.
function winSetup(){
    //creates instances of win text and adjusts position     
    var text = new Text("Congrats you won.",{font : '24px Arial', fill : 0x000000});
    //adds text to win stage
    win.addChild(text); 
    //adds win stage to main_stage
    main_stage.addChild(win);
    //render main_stage
    renderer.render(main_stage);
}
//animate: animates, calls state, and renders main_stage
function animate(){
    //Loops 60 times per second 
    requestAnimationFrame(animate);
    //Update the current game state 
    state(); 
    //Render the stage 
    renderer.render(main_stage);
} 

//playBoard: game logic 
function playBoard(){ 
    collsionCheck();
    //rotate the hole
    hole.rotation += 0.1;
    var randnum = Math.random(0,1);
    var new_x = hole.position.x + randnum;
    var new_y = hole.position.y + randnum;

    if(new_x < renderer.width){
	hole.position.x += randnum;
    	console.log("Renderer width = " + renderer.width);
   	console.log("Hole x = " + hole.position.x);
    }
    if(new_y < renderer.height){
    	hole.position.y += Math.random(0,1);
	console.log("Renderer height = " + renderer.height);
	console.log("Hole y = " + hole.position.y);
    }

    golf_ball.rotation += 0.1;

}

//collsionCheck: checks the distances of the hole to the golf ball, 
//if close and total holes made less than five places new hole, 
//if total 5 hide board stage and call winSetup().
function collsionCheck(){

    var xdistance = golf_ball.position.x - hole.position.x;
    var ydistance = golf_ball.position.y - hole.position.y;
    var distance = Math.sqrt(xdistance^2 + ydistance^2);

    if (distance < 7 && holes < 5) {
        placeHole();
        holes += 1;
        hole_board.text = "Holes made: " + holes;
        
    } 
    if (holes == 5){
        board.visible = false;
        winSetup();
    }

}
//placeHole: randomdly places a hole on the board
function placeHole() {
    
    // get random numbers
    var randx = 10 * Math.floor((Math.random() * 39) + 1);
    var randy = 10 * Math.floor((Math.random() * 39) + 1);
  
    // move the hole to random location
    hole.position.x = randx;
    hole.position.y = randy;
}

//Event handler
function keydownEventHandler(e){
    // if statements for WASD and arrow keys to move golf_ball
    //up 
    if (e.keyCode === 87 || e.keyCode === 38) {
        e.preventDefault(); // prevents browser from scrolling when using arrow keys
        if (golf_ball.position.y != 10) { // won't let the ball move off the stage
            golf_ball.position.y -= 10; // move the ball
        }
    }
    //down
    if (e.keyCode === 83 || e.keyCode === 40) {
        e.preventDefault();
        if (golf_ball.position.y != renderer.height - 10) {
            golf_ball.position.y += 10;
        }
    }
    //left
    if (e.keyCode === 65 || e.keyCode === 37) {
        e.preventDefault();
        if (golf_ball.position.x != 10) {
            golf_ball.position.x -= 10;
        }
    }
    //right
    if (e.keyCode === 68 || e.keyCode === 39) {
        e.preventDefault();
        if (golf_ball.position.x != renderer.width - 10) {
            golf_ball.position.x += 10;
        }
    }
    renderer.render(main_stage);
}
