var monkey, bananagrp, bg, invground, obs, stonegrp, monkeycol, speed;

var monkeyimg, bananaimg, bgimg, obsimg, collided;

var score, gamestate, PLAY, END, INITIAL, col;

function preload() {

  monkeyimg = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");

  bgimg = loadImage("jungle.jpg");

  bananaimg = loadImage("banana.png");

  obsimg = loadImage("stone.png");
  
  collided = loadImage("Monkey_05.png");

}

function setup() {
  createCanvas(600, 400);

 

  //invisible ground
  invground = createSprite(width / 2, 390, width, 10);
  invground.visible = false;

  //monkey
  monkey = createSprite(80, 340);
  monkey.addAnimation("collided",collided);
  monkey.addAnimation("monkeyimg", monkeyimg);
  
  monkey.scale = 0.13;

  //score
  SurvivalTime = 0;

  //gamestates
  gamestate = 1;
  PLAY = 1;
  END = 0;

  //groups for obstacle and bananas
  bananagrp = createGroup();
  stonegrp = createGroup();

  //default speed
  speed = -8;

  //var for collision
  col = 0;
}

function draw() {
  background("green");


  //gamestate=PLAY
  if (gamestate === PLAY) {
    
    monkey.changeAnimation("monkeyimg");

   
   

    //JUMP
    if (keyWentDown("space") && monkey.collide(invground)) {
      monkey.velocityY = -20;
    }

    //gravity
    monkey.velocityY = monkey.velocityY + 1;

    //spawn bananas and obstacles
    bananas();
    obstacles();

    //score
    SurvivalTime = SurvivalTime + Math.round((getFrameRate() / 30));

  }

  //collide
  monkey.collide(invground);

  //Gamestate=END
  if (gamestate === END) {
   

    stonegrp.setVelocityXEach(0);
    stonegrp.setLifetimeEach(-1);

    bananagrp.setVelocityXEach(0);
    bananagrp.setLifetimeEach(-1);

    monkey.velocityY = 0;
    
    monkey.changeAnimation("collided",collided);

  }

  //restart
  if (keyWentDown("r") && gamestate === END) {
    stonegrp.destroyEach();
    bananagrp.destroyEach();
    score = 0;
    gamestate = PLAY;
    speed = -6;
    monkey.scale = 0.13;
    col = 0;
  }

  //monkey touches banana group
  if (monkey.isTouching(bananagrp)) {
    bananagrp.destroyEach();
    speed = speed - 0.5;
    monkey.scale = monkey.scale + 0.02;
    score = score + 20;
    col = 0;

  }

  //Increase monkey's scale periodically
  if (score % 100 === 0) {
    monkey.scale = monkey.scale + 0.01;
  }

  //End the game if monkey touches the stone twice
  if (col === 2) {
    gamestate = END;
  }

  //monkey touches the stones
  if (stonegrp.isTouching(monkey)) {
    stonegrp.destroyEach();
    monkey.scale = 0.13;
    score = score - 100;
    col += 1;
  }

  drawSprites();

  //If gamestate is End, add text
  if (gamestate === END) {

    fill(250);
    textSize(22);
    stroke(0);
    strokeWeight(2);
    text("Game Over!", width / 2 - width / 10, height / 2);
    
  }

  fill("Black");
  textSize(22);
  stroke("white");
  strokeWeight(2);
  text("SurvivalTime: " + SurvivalTime, 40, height / 8);
}