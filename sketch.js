var gameStates = "start";
var score = 0;
var gameOver;
var restart;
var wall
var page = "home";
function preload() {
  mario1 = loadImage("Images/Goku SSJ1.png");
  mario2 = loadImage("Images/Goku SSJ2.png");
  mario3 = loadImage("Images/Goku SSJ3.png");
  mario4 = loadImage("Images/Goku SSJ4.png");
  groundImage = loadImage("Images/ground2.png");
  obsImage = loadAnimation("Images/obstacle1.png", "Images/obstacle2.png", "Images/obstacle3.png", "Images/obstacle4.png");
  coinsImage = loadImage("Images/coinsImage.png");
  bonousImage = loadImage("Images/bonous.png");
  cloudsImage = loadImage("Images/cloudsImage.png");
  gameOverImage = loadImage("Images/gameOver.png");
  restartImage = loadImage("Images/restart.png");
  wallImage = loadImage("Images/ground2.png");
  bg = loadImage("Images/Background.png");
  collectSound = loadSound("collect.mp3");
}

function setup() {
  createCanvas(1000, 600);

  if (page === "home") {
    btn = createButton("Play");
  }

  if (page === "game") {
    mario = createSprite(100, 480, 40, 40);
    mario.addAnimation("mario", mario1);
    mario.addAnimation("mario2", mario2);
    mario.addAnimation("mario3", mario3);
    mario.addAnimation("mario4", mario4);

    mario.lives = 3;
    mario.scale = 0.2;

    ground = createSprite(500, 517, 1000, 20);
    ground.visible = false;

    wall = createSprite(500, 583, 1000, 20);
    wall.addImage(wallImage);
    wall.velocityX = -5;
    wall.scale = 2;
    wall.x = wall.width / 2;

    gameOver = createSprite(500, 400, 50, 50);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 1.5;
    gameOver.visible = false;

    restart = createSprite(500, 300, 50, 50);
    restart.addImage(restartImage);
    restart.scale = 1;
    restart.visible = false;

    obsGroup = new Group();
    coinsGroup = new Group();
    bonousGroup = new Group();
    cloudsGroup = new Group();
  }
}
function draw() {
  background("lightblue");

  if (page === "home") {
    homepage();
  }

  if (page === "game") {
    background(bg);

    textSize(25);
    text("Score : " + score, width - 150, 50);

    text("Lives : " + mario.lives, width - 150, 80);

    if (score >= 100) {
      mario.changeAnimation("mario2");
    }

    if(score >= 200)
    {
      mario.changeAnimation("mario3");
    }

    if(score >= 400)
    {
      mario.changeAnimation("mario4");
    }

    if (score > 0 && score % 100 === 0) {
      collectSound.play();
    }

    if (gameStates === "run") {
      //ground.velocityX = -(4 + 3*score/10);
      wall.velocityX = -(5 + 2 * score / 50);

      if (wall.x < 0) {
        wall.x = wall.width / 2;
      }

//      console.log(mario.y);
      if (keyDown("space") && mario.y > 455) {
        mario.velocityY = -20;
      }

      mario.velocityY = mario.velocityY + 0.8;

      if (mario.isTouching(coinsGroup)) {
        for (var i = 0; i < coinsGroup.length; i++) {
          if (mario.isTouching(coinsGroup[i])) {
            coinsGroup[i].destroy();
            score = score + 5;
          }
        }
      }

      if (mario.isTouching(bonousGroup)) {
        for (var b = 0; b < bonousGroup.length; b++) {
          if (mario.isTouching(bonousGroup[b])) {
            bonousGroup[b].destroy();
            score = score + 50;
          }
        }
      }

      if (mario.isTouching(obsGroup)) {
        for (x = 0; x < obsGroup.length; x++) {
          if (mario.isTouching(obsGroup[x])) {
            obsGroup[x].destroy();
            mario.lives--;
           // console.log(mario.lives);

            if (mario.lives <= 0) {
              gameStates = "over";
            }
          }
        }
      }

      spawnObstacle();
      spawnCoins();
      spawnBonous();
      //spawnClouds();
    } else if (gameStates === "over") {
      wall.velocityX = 0;
      cloudsGroup.setVelocityXEach(0);
      bonousGroup.setVelocityXEach(0);
      obsGroup.setVelocityXEach(0);
      coinsGroup.setVelocityXEach(0);

      coinsGroup.setLifetimeEach(-1);
      bonousGroup.setLifetimeEach(-1);
      obsGroup.setLifetimeEach(-1);
      coinsGroup.setLifetimeEach(-1);

      mario.velocityY = 0;

      gameOver.visible = true;
      restart.visible = true;

      if (mousePressedOver(restart)) {
        reload();
      }
    }

    mario.collide(ground);
  }
  drawSprites();
}

function homepage() {
  textSize(30);
  text("Welcome to Mario", 100, 100);
  fill("red");
  textSize(40);
  text("INSTRUCTIONS ", 150, 250);
  textSize(25);
  fill("blue");
  text("=> Press Space to jump", 120, 350);
  text("=> Beware Of Obstacles. You loose a life", 120, 450);

  btn.position(width / 2, height / 2);
  btn.mouseClicked(function () {
    page = "game";
    gameStates="run"
    btn.hide();
    setup();
  });
}

function spawnObstacle() {
  if (frameCount % 100 === 0) {
    var obs = createSprite(1000, 480, 10, 10);
    obs.addAnimation("obs", obsImage);
    obs.velocityX = -(5 + (3 * score) / 50);
    obs.scale = 1.2;
    obs.lifetime = width / 3;
    obsGroup.add(obs);
  }
}

function spawnCoins() {
  if (frameCount % 60 === 0) {
    var coins = createSprite(1000, random(300, 350), 10, 10);
    coins.addImage("coins", coinsImage);
    //coins.y = Math.round(random(300, 550));
    coins.velocityX = -(5 + (3 * score) / 50);
    coins.scale = 0.05;
    coins.lifetime = width / 3;
    coinsGroup.add(coins);
  }
}

function spawnBonous() {
  if (frameCount % 1000 === 0) {
    var bonous = createSprite(1000, 100, 40, 50);
    bonous.addImage("bonous", bonousImage);
    bonous.y = Math.round(random(200, 500));
    bonous.velocityX = -(5 + (3 * score) / 50);
    bonous.scale = 0.1;
    bonous.lifetime = width / 3;
    bonousGroup.add(bonous);
  }
}

function spawnClouds() {
  if (frameCount % 127 === 0) {
    var clouds = createSprite(width - 70, 100, 40, 50);
    clouds.addImage("clouds", cloudsImage);
    clouds.y = Math.round(random(100, 400));
    clouds.velocityX = -3;
    clouds.scale = 0.1;
    clouds.lifetime = width / 3;
    cloudsGroup.add(clouds);
  }
}

function reload() {
  gameStates = "run";

  gameOver.visible = false;
  restart.visible = false;

  score = 0;
  mario.lives = 3;
  mario.changeAnimation("mario");

  cloudsGroup.destroyEach();
  coinsGroup.destroyEach();
  bonousGroup.destroyEach();
  obsGroup.destroyEach();
}
