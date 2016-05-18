/*******
CS 413 Project 1-Minimalism

Purpose: To demostrate basic understanding of the core techniologies 
needed for this course, this includes, PIXI.js, bitmap graphics, and
sceen graph organization. 

Each stage has a setup and play function, the setup function is only 
called once to create the sub stages, and the play function is called
repeatly by the gameLoop(). The play function checks and updates 
the main_stage. The gameLoop renders the main_stage.

Note (4/16/16): Major improvements are needed to the collisions 
calculations. 
 
Author: Christopher D. Whitney 
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

//load assets
loader.add("assets/frank-alien.png");
loader.add("assets/rocket.png");
loader.add("assets/background.png");

//loaders calls menu_setup()
loader.load(board_setup);

//vars seen by both setup and play
var alien,rocket,board,state; 

/*Board_setup: This function adds childern elements to the board stage, 
  this includes an star background,an alien, and a rocketship. */
function board_setup(){
    //creates instances of background sprite 
    background = new Sprite(resources["assets/background.png"].texture);
    //adds background to main_stage
    main_stage.addChild(background); 

    // score board
    var score = 0;
    var score_board = new PIXI.Text("Home: " + score + "    Away: 0", {font:"20px Arial", fill:"white"});
    score_board.position.x = 125;
    score_board.position.y = 0;

    board.addChild(score_board);

    //creates instances of alien sprite and adjusts position
    alien = new Sprite(resources["assets/frank-alien.png"].texture);
    alien.y = 96; 
    alien.x = 96;
    //adds alient to board stage
    board.addChild(alien); 
    
    //creates instances of rocket sprite and adjust position
    rocket = new Sprite(resources["assets/rocket.png"].texture);
    rocket.y = 100;
    rocket.x = 200; 
    //sets rockets anchors
    rocket.anchor.x = 0.5;
    rocket.anchor.y = 0.5;
   
    //adds rocket to the board stage
    board.addChild(rocket);
    
    //adds board to main_stage
    main_stage.addChild(board);
    
    //sets state
    state = play_board;
 
    //call gameLoop()
    game_loop();
}

//win_setup: this function sets up the win stage with some text.
function win_setup(){
    //creates instances of win text and adjusts position     
    var text = new Text("You win",{font : '24px Arial', fill : 0xff1010});
    text.x = 200;
    text.y = 200;
    //adds text to win stage
    win.addChild(text); 
    //adds win stage to main_stage
    main_stage.addChild(win);
    //render main_stage
    renderer.render(main_stage);
}
//game_loop
function game_loop(){
    //Loops 60 times per second 
    requestAnimationFrame(game_loop);
    //Update the current game state 
    state(); 
    //Render the stage 
    renderer.render(main_stage);
} 

//play_board: game logic 
function play_board(){ 
    //rotate the rocket
    rocket.rotation += 0.1;
  
    //Collision calculations: needs improvement
    //calculate distance bettwen rocket and alien
    var xdistance = Math.abs(rocket.position.x - alien.position.x); 
    var ydistance = Math.abs(rocket.position.y - alien.position.y);

    if(xdistance < 50 && ydistance < 50){
        board.visible = false;
        win_setup();

    }
}
function createRocket(){



}

function collsionCheck(){
    if (alien.position.x === rocket.position.x && alien.position.y === alien.position.y) {
        createRocket();
        score += 2;
        score_board.setText("Home: " + score + "    Away: 0");
    }

}
//Event handler
function keydownEventHandler(event){
    //left  
    if(event.keyCode == 65){
        alien.position.x -= 5;	  
    }//up
    if(event.keyCode == 87){
        alien.position.y -= 5;
    } //right
    if(event.keyCode == 68){
        alien.position.x += 5;
    }//down
    if(event.keyCode == 83){
        alien.position.y += 5;
    }
    renderer.render(main_stage);
}
