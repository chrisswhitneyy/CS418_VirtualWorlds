var gameport = document.getElementById("gameport");

var renderer = PIXI.autoDetectRenderer(400,400,{backgroundColor:0x3344ee});
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var sqaure1 = PIXI.Texture.fromImage("asset.png");
var sqaure2 = PIXI.Texture.fromImage("asset.png");

var sprite = new PIXI.Sprite(sqaure1);
var sprite2 = new PIXI.Sprite(sqaure2);

sprite.anchor.x = 0.5;
sprite.anchor.y = 0.5;

sprite.position.x = 200;
sprite.position.y = 200;

sprite2.anchor.x = 0.5;
sprite2.anchor.y = 0.5;

sprite2.position.x = 100;
sprite2.position.y = 200;

stage.addChild(sprite);
stage.addChild(sprite2);

renderer.render(stage);

function animate(){
  requestAnimationFrame(animate);
  sprite.rotation += 0.05;
  renderer.render(stage);
} 

animate();
