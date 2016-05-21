/*******
CS 413 Project 2 - Puzzles

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

//game stages
var main_stage = new Container(0x000000, true); //main stage
var board = new Container(); //game board
var title_stage = new Container(); //title stage
var menu_stage = new Container(); //menu stage
var instruction_stage = new Container(); //instruction stage
var credit_stage = new Container();
var win = new Container(); //win text

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

//load assets
loader.add("assets/background.png");
loader.add("assets/golf_ball.png");

loader.load(titleSetup);

/********
Stage setup functions: A setup function for each stage is called 
before animating and handling input. Since spirites and other 
elements are needed by the run functions they are declared before.
********/

//title setup
var title,golf_ball;
function titleSetup(){
   background = new Sprite(resources["assets/background.png"].texture);
   main_stage.addChild(background);

   title = new Text("Wacky Golf",{font:'50px Arial',fill: "black"}); 
   
   title.y = 150;
   title_stage.addChild(title);

   golf_ball = new Sprite(resources["assets/golf_ball.png"].texture);

   golf_ball.y = 220;
   golf_ball.x = 330;
   golf_ball.anchor.x = 0.5;
   golf_ball.anchor.y = 0.5;

   title_stage.addChild(golf_ball);

   main_stage.addChild(title_stage); 
   state = titleRun;
   animate();
}

//menu setup
var play_button,credits_button,instruction_button;
function menuSetup(){
  
  createjs.Tween.get(title.position).to({x:0,y:0},700,createjs.Ease.bounceOut);
  
  play_button = new Sprite();
  credits_button = new Sprite();
  instruction_button = new Sprite();
  
  play_text = new Text("Play",{font:'20px Arial',fill: "black"});
  credits_text = new Text("Credits",{font:'20px Arial',fill: "black"});
  instruction_text = new Text("Instructions",{font:'20px Arial',fill: "black"});

  play_button.addChild(play_text);
  credits_button.addChild(credits_text);
  instruction_button.addChild(instruction_text);

  play_button.interactive = true; 
  credits_button.interactive = true;
  instruction_button.interactive = true;

  play_button.x = 10;
  play_button.y = 200;

  instruction_button.x = 10;
  instruction_button.y = 240;

  credits_button.x = 10;
  credits_button.y = 280;

  menu_stage.addChild(play_button); 
  menu_stage.addChild(credits_button);
  menu_stage.addChild(instruction_button);
  main_stage.addChild(menu_stage);
  
  document.addEventListener("click", menuClickHandler());
  
  state = menuRun;
  animate();
}

//load assets
loader.add("assets/hole1.png");
//boardSetup 
var board,holes,hole_board,state; 
function boardSetup(){
    //set document event handler
    document.addEventListener('keydown',keydownEventHandler);

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
    hole = new Sprite(resources["assets/hole1.png"].texture);
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

//winSetup
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
//instructionSetup
var back_button;
function instructionSetup(){
  var text = new Text("Use the WASD or arrow keys \n to move the golf ball into the hole",{font:'25px Arial',fill: "black"});
  instruction_stage.addChild(text);
  
  back_button = new Sprite();
  back_text = new Text("Back to Main Menu",{font:'20px Arial',fill: "black"});
  back_button.interactive = true;
  back_button.addChild(back_text);
  back_button.y = 300;
  instruction_stage.addChild(back_button);

  document.addEventListener("click", backButtonHandler());
  main_stage.addChild(instruction_stage);
  state = instructionRun;
  animate();
}
//creditSetup
function creditSetup(){
  var text = new Text("Credited by Christopher Whitney",{font:'25px Arial',fill: "black"});
  text.y = 150;
  credit_stage.addChild(text);

  back_button = new Sprite();
  back_text = new Text("Back to Main Menu",{font:'20px Arial',fill: "black"});
  back_button.interactive = true;
  back_button.addChild(back_text);
  back_button.y = 300;
  credit_stage.addChild(back_button);

  main_stage.addChild(credit_stage);
  document.addEventListener("click", backButtonHandler());
  state = creditRun;
  animate();
}


/********
Animate: request animation frame, calls state function, and 
renders main_stage
********/
function animate(){
    //Loops 60 times per second 
    requestAnimationFrame(animate);
    //Update the current game state 
    state(); 
    //Render the stage 
    renderer.render(main_stage);
} 

/********
Run functions: 
********/
function titleRun(){
    window.setTimeout(menuSetup,1000);
}
function menuRun(){
  golf_ball.rotation += 0.005;
}
function playBoard(){ 
  collsionCheck();
}
function creditRun(){

}
function instructionRun(){

}

/*******
Classes: 
********/

//level: a general class used by all the different 
//instances of level. 
function level = function(){
  this.diffuclty = 0;
  this.numberHole = 0;
  this.stage = new Container();

  this.placeObsticale = function placeObsticale(x,y){
    
  }
  this.placeCollector = function placeCollector(x,y){
    
  }
  this.placeHole= function placeHole(x,y){
    
  }
  this.checkCollsion = function checkCollsion(){

  }
  this.checkWin = function checkWin(){

  }


}
/*******
Event handlers: 
********/
function keydownEventHandler(e){
  e.preventDefault(); //prevents default key behavior, scrolling
  var new_x, new_y
  // if statements for WASD and arrow keys to move golf_ball
  //up 
  if (e.keyCode === 87 || e.keyCode === 38) {
    new_y = golf_ball.position.y - 10;
    if (new_y > 10) {
      golf_ball.position.y = new_y; //new y position
    }
  }
    
  //down
  if (e.keyCode === 83 || e.keyCode === 40) {
    new_y = golf_ball.position.y + 10;
    if (new_y < renderer.height - 10) {
      golf_ball.position.y = new_y;
    }
  }
  
  //left
  if (e.keyCode === 65 || e.keyCode === 37) {
    new_x = golf_ball.position.x - 10;
	  if (new_x > 10) {
      golf_ball.position.x = new_x;
    }
  }
    //right
    if (e.keyCode === 68 || e.keyCode === 39) {
      new_x = golf_ball.position.x + 10;
      if (new_x < renderer.width - 10) {
        golf_ball.position.x = new_x;
      }
    }
    
    //createjs.Tween.get(golf_ball.position).to({x: new_x, y: new_y},100);
    renderer.render(main_stage);
}

function menuClickHandler(event){

    var play_new_text = new Text("Play",{font:'20px Arial',fill: "white"});
    var play_old_text = new Text("Play",{font:'20px Arial',fill: "black"});
    var credits_new_text = new Text("Credits",{font:'20px Arial',fill: "white"});
    var credits_old_text = new Text("Credits",{font:'20px Arial',fill: "black"});
    var instruction_new_text = new Text("Instructions",{font:'20px Arial',fill: "white"});
    var instruction_old_text = new Text("Instructions",{font:'20px Arial',fill: "black"});

    //Play button handler
		play_button.click = function(data){
			// click!
      title_stage.visible = false;
      menu_stage.visible = false;
      boardSetup();
		}
    // set the mouseover callback..
    play_button.mouseover = function(data){
      this.isOver = true;
      play_button.removeChildAt(0);
      play_button.addChild(play_new_text);
    }
    play_button.mouseout = function(data){
      this.isOver = false;
      play_button.removeChildAt(0);
      play_button.addChild(play_old_text);
    }

    credits_button.click = function(data){
      title_stage.visible = false;
      menu_stage.visible = false;
      credit_stage.visible = true;
      creditSetup();
    }
    credits_button.mouseover = function(data){
      this.isOver = true;
      credits_button.removeChildAt(0);
      credits_button.addChild(credits_new_text);
    }
    credits_button.mouseout = function(data){
      this.isOver = false;
      credits_button.removeChildAt(0);
      credits_button.addChild(credits_old_text);
    }
    
    instruction_button.click = function(data){
      title_stage.visible = false; 
      menu_stage.visible = false;
      instruction_stage.visible = true;
      instructionSetup();
    }
    instruction_button.mouseover = function(data){
      this.isOver = true;
      instruction_button.removeChildAt(0);
      instruction_button.addChild(instruction_new_text);
    }
    instruction_button.mouseout = function(data){
      this.isOver = false;
      instruction_button.removeChildAt(0);
      instruction_button.addChild(instruction_old_text);
    }
}

function backButtonHandler(event){
  new_text = new Text("Back to Main Menu",{font:'20px Arial',fill: "white"});
  old_text = new Text("Back to Main Menu",{font:'20px Arial',fill: "black"});

  back_button.mouseover = function(data){
    this.isOver = true;
    back_button.removeChildAt(0);
    back_button.addChild(new_text);
  }
  back_button.mouseout = function(data){
    this.isOver = false;
    back_button.removeChildAt(0);
    back_button.addChild(old_text);
  }
  back_button.click = function(data){
    credit_stage.visible = false;
    instruction_stage.visible = false;
    title_stage.visible = true;
    menu_stage.visible = true;
  }
}

/********
Helper functions
********/
//collsionCheck: checks the distances of the hole to the golf ball, 
//if close and total holes made less than five places new hole, 
//if total 5 hide board stage and call winSetup().
function collsionCheck(){

    var xdistance = golf_ball.position.x - hole.position.x;
    var ydistance = golf_ball.position.y - hole.position.y;
    var distance = Math.sqrt(xdistance^2 + ydistance^2);

    if (distance < 3 && holes < 5) {
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
    
    //new x and y position with randnum
    var new_x = hole.position.x + randx;
    var new_y = hole.position.y + randy;
   
    if(new_x <= renderer.width && new_y <= renderer.height){
      hole.position.x = new_x; 
      hole.position.y = new_y;
    }
    //createjs.Tween.get(hole.position).to({x: new_x, y: new_y},100,createjs.Ease.bounceOut);
}

