/*******
CS 413 Project 2 Puzzles - Wacky Golf

Purpose: To create a compelling game that incoprates, sounds, spritesheets,
tweening,js classes,and sceen graphs using Pixi.js. Each stage has it own
setup and run function, the setup function places all the spirites and the
run functions do all the win/loose logic. The level classes is used to setup 
and maintain a level. This classe includes properites, including a stage and 
the golf ball, along with methods used for collsion detection.  

Author: Christopher D. Whiteny 
*******/

//Aliases for PIXI.js
var Container = PIXI.Container, 
    Sprite = PIXI.Sprite, 
    Text = PIXI.Text, 
    Texture = PIXI.Texture,
    Point = PIXI.Point, 
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
var loose_stage = new Container();
var credit_stage = new Container();
var win = new Container(); //win text

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

//load assets
loader.add("assets/background.png");
loader.add("assets/golf_ball1.png");
loader.add("assets/sound/theme.mp3");

loader.load(titleSetup);

/********
Stage setup functions: A setup function for each stage is called 
before animating and handling input. Since spirites and other 
elements are needed by the run functions they are declared before.
********/

//title setup
var title,golf_ball,music;
function titleSetup(){
   background = new Sprite(resources["assets/background.png"].texture);
   main_stage.addChild(background);

   music = PIXI.audioManager.getAudio("assets/sound/theme.mp3");
   music.loop = true;
   music.play();

   title = new Text("Wacky Golf",{font:'50px Arial',fill: "black"}); 
   
   title.y = 150;
   title_stage.addChild(title);

   golf_ball = new Sprite(resources["assets/golf_ball1.png"].texture);

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
var play_button,credits_button,instruction_button,mute_button,unmute_button;
function menuSetup(){
  
  createjs.Tween.get(title.position).to({x:0,y:0},700,createjs.Ease.bounceOut);
  
  play_button = new Sprite();
  credits_button = new Sprite();
  instruction_button = new Sprite();
  mute_button = new Sprite();
  unmute_button = new Sprite();
  
  play_text = new Text("Play",{font:'20px Arial',fill: "black"});
  credits_text = new Text("Credits",{font:'20px Arial',fill: "black"});
  instruction_text = new Text("Instructions",{font:'20px Arial',fill: "black"});
  mute_text = new Text("Mute audio",{font:'20px Arial',fill: "black"});
  unmute_text = new Text("Unmute audio",{font:'20px Arial',fill: "black"});

  play_button.addChild(play_text);
  credits_button.addChild(credits_text);
  instruction_button.addChild(instruction_text);
  mute_button.addChild(mute_text);
  unmute_button.addChild(unmute_text);
  unmute_button.visible = false;
  
  play_button.interactive = true; 
  credits_button.interactive = true;
  instruction_button.interactive = true;
  mute_button.interactive = true;
  unmute_button.interactive = true;

  play_button.x = 10;
  play_button.y = 200;

  instruction_button.x = 10;
  instruction_button.y = 240;

  credits_button.x = 10;
  credits_button.y = 280;

  mute_button.x = 250;
  mute_button.y = 350;

  unmute_button.x = 250;
  unmute_button.y = 350;

  menu_stage.addChild(play_button); 
  menu_stage.addChild(credits_button);
  menu_stage.addChild(instruction_button);
  menu_stage.addChild(mute_button);
  menu_stage.addChild(unmute_button);
  main_stage.addChild(menu_stage);
  
  document.addEventListener("click", menuClickHandler());
  
  state = menuRun;
  animate();
}

//load assets
loader.add("assets/hole1.png");
loader.add("assets/obstacle.png");

//level0Setup 
var current_level,board,holes,state; 
function level0Setup(){

    var stage = new Container();
    var obstacles = new Container();
    current_level = new level(0,obstacles,null,stage,golf_ball);

    //adds golf_ballt to level stage
    stage.addChild(golf_ball); 

    current_level.placeGolfBall(20,120);
    current_level.placeHole(380,380);

    current_level.placeObsticale(240,220,0);
    current_level.placeObsticale(60,290,0);

    current_level.placeText("Introduction to Controlls: \n Use the WASD or arrow keys \n to move the golf ball into \n the hole",10,10);

    //adds board to main_stage
    main_stage.addChild(stage);

    //set document event handler
    document.addEventListener('keydown',keydownEventHandler);
    
    //sets state
    state = level0Run;
 
    //call animate()
    animate();
}

loader.add("assets/putter_asset.json");
var collector;
function level1Setup(){

  var stage = new Container();
  var obstacles = new Container();
  collector = new Container();
  current_level = new level(1,obstacles,collector,stage,golf_ball);

  current_level.placeText("Level 1", 0, 0);
  current_level.placeGolfBall(20,40);
  current_level.placeHole(380,380);
  current_level.placeCollector(200,200);

  main_stage.addChild(stage);

  //set document event handler
  document.addEventListener('keydown',keydownEventHandler);

  //sets state
  state = level1Run;
 
  //call animate()
  animate();
}
function level2Setup(){
  var stage = new Container();
  var obstacles = new Container();
  collector = new Container();
  current_level = new level(2,obstacles,collector,stage,golf_ball);

  current_level.placeText("Level 2", 0, 0);
  current_level.placeGolfBall(380,20);
  current_level.placeHole(20,380);
  current_level.placeCollector(200,200);
  current_level.placeObsticale(0,100,0);

  main_stage.addChild(stage);

  //set document event handler
  document.addEventListener('keydown',keydownEventHandler);

  //sets state
  state = level2Run;
 
  //call animate()
  animate();

}
function level3Setup(){
  var stage = new Container();
  var obstacles = new Container();
  collector = new Container();
  current_level = new level(3,obstacles,collector,stage,golf_ball);

  current_level.placeText("Level 3", 0, 0);
  current_level.placeGolfBall(40,20);
  current_level.placeHole(20,380);
  current_level.placeCollector(200,200);
  current_level.placeObsticale(20,100,0);
  current_level.placeObsticale(240,100,0);

  main_stage.addChild(stage);

  //set document event handler
  document.addEventListener('keydown',keydownEventHandler);

  //sets state
  state = level3Run;
 
  //call animate()
  animate();

}

//winSetup
function winSetup(){
    win.visible = true;
    document.addEventListener('keydown',keydownEventHandler);
    //creates instances of win text and adjusts position     
    var text = new Text("Congrats you won.",{font : '24px Arial', fill : 0x000000});
    //adds text to win stage
    win.addChild(text); 
    //adds win stage to main_stage
    main_stage.addChild(win);
}
//loose1Setup
function loose1Setup(){
  loose_stage.visible = true;
  //set document event handler
  document.addEventListener('keydown',keydownEventHandler);
  var text = new Text("You loose. \nPress enter to restart",{font : '24px Arial', fill : 0x000000});
  loose_stage.addChild(text);
  main_stage.addChild(loose_stage);
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

  document.addEventListener("click", backButtonHandler);
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
  document.addEventListener("click", backButtonHandler);
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
function level0Run(){ 
  golf_ball.rotation += 0.005;
  if(current_level.checkWin()){
    main_stage.removeChild(current_level.stage);
    title_stage.visible = true;
    menu_stage.visible = true;
  }
}
function level1Run(){
  golf_ball.rotation += 0.005;
  current_level.moveCollector(0.09,0);

  if(current_level.checkWin()){
    current_level.visible = false;
    main_stage.removeChild(current_level.stage);
    level2Setup();
  }
  if(current_level.checkLoss()){
    current_level.visible = false;
    main_stage.removeChild(current_level.stage);
    current_level.golf_ball.x = 20;
    current_level.golf_ball.y = 20;
    loose1Setup();
  }
}
function level2Run(){
  golf_ball.rotation += 0.005;
  current_level.moveCollector(0.1,0);

  if(current_level.checkWin()){
    current_level.visible = false;
    main_stage.removeChild(current_level.stage);
    level3Setup();
  }
  if(current_level.checkLoss()){
    current_level.visible = false;
    main_stage.removeChild(current_level.stage);
    current_level.golf_ball.x = 20;
    current_level.golf_ball.y = 20;
    loose1Setup();
  }
}
function level3Run(){
  golf_ball.rotation += 0.005;
  current_level.moveCollector(0.15,0);

  if(current_level.checkWin()){
    current_level.visible = false;
    main_stage.removeChild(current_level.stage);
    winSetup();
  }
  if(current_level.checkLoss()){
    current_level.visible = false;
    main_stage.removeChild(current_level.stage);
    current_level.golf_ball.x = 20;
    current_level.golf_ball.y = 20;
    loose1Setup();
  }
}

function creditRun(){}
function instructionRun(){}

/*******
Classes: 
********/

//level: a general class used by all the different 
//instances of level. 
function level(diffuclty,obstacles,collector,stage,golf_ball){
  
  this.diffuclty = diffuclty;
  this.stage = stage;
  this.golf_ball = golf_ball;
  this.obstacles = obstacles;
  this.collector = collector;
  this.hole;
  this.text;

  this.placeObsticale = function placessObsticale(x,y,rotation_amount){
    var obstacle = new Sprite(resources["assets/obstacle.png"].texture);
    obstacle.x = x;
    obstacle.y = y;
    obstacle.rotation += rotation_amount;
    this.obstacles.addChild(obstacle);
    this.stage.addChild(obstacles);
  }
  this.placeCollector = function placeCollector(x,y){
    var frames = [];
    for (var i=1; i<=3; i++) {
      frames.push(PIXI.Texture.fromFrame('putter' + i + '.png'));
    }
    this.collector = new PIXI.extras.MovieClip(frames);
    this.collector.scale.x = 0.8;
    this.collector.scale.y = 0.8;
    this.collector.x = x;
    this.collector.y = y;
    this.collector.animationSpeed = 0.1;
    this.collector.play();
    this.stage.addChild(this.collector);

  }
  this.placeHole= function placeHole(x,y){
    this.hole = new Sprite(resources["assets/hole1.png"].texture);
    this.hole.x = x;
    this.hole.y = y;
    this.hole.anchor.x = 0.5;
    this.hole.anchor.y = 0.5;
    this.stage.addChild(this.hole);
  }
  this.placeGolfBall = function placeGolfBall(x,y){
    //creates instances of golf_ball sprite and adjusts position
    this.golf_ball.x = x;
    this.golf_ball.y = y; 
    //sets holes anchors
    this.golf_ball.anchor.x = 0.5;
    this.golf_ball.anchor.y = 0.5;
    this.stage.addChild(this.golf_ball);
  }
  this.checkWin = function checkWin(){
    var newLeft = this.golf_ball.x - this.golf_ball.width/2;
    var newDown = this.golf_ball.y - this.golf_ball.width/2;
    var newUp = this.golf_ball.y - this.golf_ball.height/2 - this.golf_ball.width/4;
    var holeRight = this.hole.x - this.golf_ball.width/2 - this.golf_ball.width/4;
    var holeUp = this.hole.y - this.hole.height;
    var holeLeft = this.hole.x + this.hole.width - this.golf_ball.width/4;
    var holeDown = this.hole.y + this.hole.height/2;

    if(newLeft <= holeLeft && newUp <= holeDown 
        && newLeft >= holeRight && newDown >= holeUp){
        return true;
    }
    return false;
  }
  
  this.collsionCheck = function collsionCheck(new_position){
    var typeCollsion = false;
    //Checks for collsion with the obstacles
    var obstacles_children = obstacles.children;
    var newLeft = new_position.x - this.golf_ball.width/2;
    var newDown = new_position.y - this.golf_ball.width/2;
    var newUp = new_position.y - this.golf_ball.height/2 - this.golf_ball.width/4;
    for(i=0;i<obstacles_children.length; i++){
      var obstacleRight = obstacles_children[i].x - this.golf_ball.width/2 - this.golf_ball.width/4;
      var obstacleUp = obstacles_children[i].y - obstacles_children[i].height;
      var obstacleLeft = obstacles_children[i].x + obstacles_children[i].width - this.golf_ball.width/4;
      var obstacleDown = obstacles_children[i].y + obstacles_children[i].height/2;

      if(newLeft <= obstacleLeft && newUp <= obstacleDown 
        && newLeft >= obstacleRight && newDown >= obstacleUp){
        typeCollsion=true;
      }
    }
    
    return typeCollsion;
  }
  this.checkLoss = function checkLoss(){
    var collectorLeft = Math.round(this.collector.x) - this.collector.width/2;
    var collectorRight = Math.round(this.collector.x) + this.collector.width/2;
    var collectorUp = Math.round(this.collector.y);
    var collectorDown = Math.round(this.collector.y) + this.collector.height;

    var ballLeft = this.golf_ball.x - this.golf_ball.width/2;
    var ballRight = this.golf_ball.x + this.golf_ball.width/2;
    var ballUp = this.golf_ball.y - this.golf_ball.height/2;
    var ballDown = this.golf_ball.y + this.golf_ball.height/2;

    if(ballLeft<=collectorRight && ballRight >= collectorLeft
      && ballUp <= collectorDown && ballDown >= collectorUp){
      return true;
    }
    return false;
    
  }  
  this.moveCollector = function moveCollector(xspeed,yspeed){
    this.collector.x = Math.abs((this.collector.x + xspeed)%400);
    this.collector.y = Math.abs((this.collector.y + yspeed)%400);
  }
  this.placeText = function placeText(text,x,y){
    this.text = new Text(text,{font:'20px Arial',fill: "black"});
    this.text.x = x;
    this.text.y = y;
    this.stage.addChild(this.text);
  }
}
/*******
Event handlers: 
********/
function menuClickHandler(event){

    var play_new_text = new Text("Play",{font:'20px Arial',fill: "white"});
    var play_old_text = new Text("Play",{font:'20px Arial',fill: "black"});
    var credits_new_text = new Text("Credits",{font:'20px Arial',fill: "white"});
    var credits_old_text = new Text("Credits",{font:'20px Arial',fill: "black"});
    var instruction_new_text = new Text("Instructions",{font:'20px Arial',fill: "white"});
    var instruction_old_text = new Text("Instructions",{font:'20px Arial',fill: "black"});
    var mute_text = new Text("Mute text",{font:'20px Arial',fill: "black"});
    var unmute_text = new Text("Unmute text",{font:'20px Arial',fill: "black"});


    //Play button handler
		play_button.click = function(data){
			// click!
      title_stage.visible = false;
      menu_stage.visible = false;
      level1Setup();
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
      level0Setup();
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

    mute_button.click = function(data){
      unmute_button.visible = true;
      mute_button.visible = false;
      music.manager.mute();
    }
    unmute_button.click = function(data){
      //unmute_button.visible = false;
      
      music.manager.unmute();
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

function keydownEventHandler(event){
    event.preventDefault(); //prevents default key behavior, scrolling
    
    var new_position = new Point(golf_ball.x,golf_ball.y);
    var old_position = new Point(golf_ball.x,golf_ball.y);
    
    //up 
    if (event.keyCode === 87 || event.keyCode === 38) {
      if(new_position.y != 10){
        new_position.y = golf_ball.y - 10;
        new_position.x = golf_ball.x;
      }
    }
    //down
    if (event.keyCode === 83 || event.keyCode === 40){ 
      if(new_position.y != renderer.height-10) {
        new_position.y = golf_ball.y + 10;
        new_position.x = golf_ball.x;
      }
    }
    //left
    if (event.keyCode === 65 || event.keyCode === 37){ 
      if(new_position.x != 10) {
        new_position.x = golf_ball.x - 10;
        new_position.y = golf_ball.y;
      }
    }
    //right
    if (event.keyCode === 68 || event.keyCode === 39){ 
      if (new_position.x != renderer.width-10){  
        new_position.x = golf_ball.x + 10;
        new_position.y = golf_ball.y;
      }
    }
    if(event.keyCode === 13){
      console.log("enter hit");
      loose_stage.visible = false;
      win.visible = false;
      level1Setup();
    }
    //checks for collsions
    if(!current_level.collsionCheck(new_position)){
      golf_ball.x = new_position.x;
      golf_ball.y = new_position.y;
    }
    renderer.render(main_stage);
}