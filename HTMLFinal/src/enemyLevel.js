(function(){


var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");



var map =
[
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [9,9,9,9,9,9,4,9,9,9,9,4,9,9,9,4],
  [4,4,4,4,4,4,4,9,9,9,9,9,9,4,9,9],
  [9,9,9,9,9,9,9,9,9,9,4,4,4,4,4,9],
  [9,9,9,9,9,9,9,4,9,9,9,9,9,9,9,9],
  [9,9,9,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,9,9,9,9,9,9,9,9,9,9,9,9,9,5,9],
  [4,4,9,9,9,4,4,4,4,4,4,4,4,4,4,4],
  [9,9,4,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [9,9,9,4,9,9,9,9,9,9,9,9,9,9,9,9],
  [9,9,9,9,4,9,9,9,9,9,9,9,9,9,9,9]
]


var gameObjects =
 [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15]
];


var EMPTY = 0;
var FROG = 1;
var VRGUY = 2;
var BOX = 4;
var DOOR = 5;
var PINKFINN = 14;
var VODOO = 15;

var SIZE = 64;

var frog = null;
var door = null;
var gameOverMessage = null;

var ROWS = map.length;
var COLUMNS = map[0].length;

var tilesheetColumns = 4;

var sprites = [];
var enemies = [];
var bullets = [];
var boxes = [];
var messages = [];

var assetsToLoad = [];
var assetsLoaded = 0;


var UP = 38;
var RIGHT = 39;
var LEFT = 37;

var jump = false;
var moveRight = false;
var moveLeft = false;

window.addEventListener("keydown", function(event)
{
  switch(event.keyCode)
  {
    case UP:
	    jump = true;
	    break;

	  case LEFT:
	    moveLeft = true;
	    break;

	  case RIGHT:
	    moveRight = true;
	    break;
  }
}, false);

window.addEventListener("keyup", function(event)
{
  switch(event.keyCode)
  {
    case UP:
	    jump = false;
	    break;

	  case LEFT:
	    moveLeft = false;
	    break;

	  case RIGHT:
	    moveRight = false;
	    break;
  }
}, false);


var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "../images/Final.png";
assetsToLoad.push(image);

var enemiesSquashed = 0;

var bulletTimer = 0;
var timeToFire = 100;

var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;

update();

function update()
{

  setTimeout(update, 16);

  switch(gameState)
  {
    case LOADING:
      console.log("loading...");
      break;

    case BUILD_MAP:
      buildMap(map);
      buildMap(gameObjects);
      createOtherObjects();
      gameState = PLAYING;
      break;

    case PLAYING:
      playGame();
      break;

    case OVER:
      endGame();
  }

  render();
}

function loadHandler()
{
  assetsLoaded++;
  if(assetsLoaded === assetsToLoad.length)
  {

    image.removeEventListener("load", loadHandler, false);

    gameState = BUILD_MAP;
  }
}

function buildMap(levelMap)
{
  for(var row = 0; row < ROWS; row++)
  {
    for(var column = 0; column < COLUMNS; column++)
    {
      var currentTile = levelMap[row][column];

      if(currentTile != EMPTY)
      {

        var tilesheetX = Math.floor((currentTile - 1) % tilesheetColumns) * SIZE;
        var tilesheetY = Math.floor((currentTile - 1) / tilesheetColumns) * SIZE;

        switch (currentTile)
        {
          case FROG:
            frog = Object.create(spriteObject);
            frog.sourceX = tilesheetX;
            frog.sourceY = tilesheetY;
            frog.x = column * SIZE;
            frog.y = row * SIZE;
            sprites.push(frog);
            break;

          case VRGUY:
            var vrGUY = Object.create(vrGUYObject);
            vrGUY.sourceX = tilesheetX;
            vrGUY.sourceY = tilesheetY;
            vrGUY.x = column * SIZE;
            vrGUY.y = row * SIZE;
            vrGUY.vx = vrGUY.speed;
            sprites.push(vrGUY);
            enemies.push(vrGUY);
            break;

          case BOX:
            var box = Object.create(spriteObject);
            box.sourceX = tilesheetX;
            box.sourceY = tilesheetY;
            box.x = column * SIZE;
            box.y = row * SIZE;
            sprites.push(box);
            boxes.push(box);
            break;

          case DOOR:
            door = Object.create(spriteObject);
            door.sourceX = tilesheetX;
            door.sourceY = tilesheetY;
            door.x = column * SIZE;
            door.y = row * SIZE;
            sprites.push(door);
            break;

          case PINKFINN:
            var pinkFinn = Object.create(pinkFinnObject);
            pinkFinn.sourceX = tilesheetX;
            pinkFinn.sourceY = tilesheetY;
            pinkFinn.x = column * SIZE;
            pinkFinn.y = row * SIZE;
            pinkFinn.vx = pinkFinn.speed;
            pinkFinn.vy = pinkFinn.jump;
            sprites.push(pinkFinn);
            enemies.push(pinkFinn);
            break;

          case VODOO:
            var voDoo = Object.create(voDooObject);
            voDoo.sourceX = tilesheetX;
            voDoo.sourceY = tilesheetY;
            voDoo.x = column * SIZE;
            voDoo.y = row * SIZE;
            sprites.push(voDoo);
            enemies.push(voDoo);
            break;


          default:
            var sprite = Object.create(spriteObject);
            sprite.sourceX = tilesheetX;
            sprite.sourceY = tilesheetY;
            sprite.x = column * SIZE;
            sprite.y = row * SIZE;
            sprites.push(sprite);
        }
      }
    }
  }
}

function createOtherObjects()
{

  gameOverMessage = Object.create(messageObject);
  gameOverMessage.x = canvas.width / 2 - 50 ;
  gameOverMessage.y = canvas.height / 2 + 90 ;
  gameOverMessage.font = "bold 30px Helvetica";
  gameOverMessage.fillStyle = "black";
  gameOverMessage.text = "";
  gameOverMessage.visible = false;
  messages.push(gameOverMessage);
}

function playGame()
{

  if(jump && frog.isOnGround)
  {
    frog.vy -= 5.2;
    frog.isOnGround = false;
  }


  if(moveLeft && !moveRight)
  {
    frog.vx -= 0.5;
  }

  if(moveRight && !moveLeft)
  {
    frog.vx += 0.5;
  }

  if(!moveLeft && !moveRight)
  {
    frog.vx = 0;
    frog.gravity = 0.3;
  }

  frog.x += frog.vx;
  frog.y += frog.vy;

  frog.vy += frog.gravity;

  if (frog.vx > frog.speedLimit)
  {
    frog.vx = frog.speedLimit;
  }
  if (frog.vx < -frog.speedLimit)
  {
    frog.vx = -frog.speedLimit;
  }
  if (frog.vy > frog.speedLimit * 2)
  {
    frog.vy = frog.speedLimit * 2;
  }

  frog.x += frog.vx;
  frog.y += frog.vy;


  for(var i = 0; i < boxes.length; i++)
  {
    var collisionSide = blockRectangle(frog, boxes[i], false);

    if(collisionSide === "bottom" && frog.vy >= 0)
    {

      frog.isOnGround = true;
      frog.vy = -frog.gravity;

    }
    else if(collisionSide === "top" && frog.vy <= 0)
    {
      frog.vy = 0;
    }
    else if(collisionSide === "right" && frog.vx >= 0)
    {
      frog.vx = 0;
    }
    else if(collisionSide === "left" && frog.vx <= 0)
    {
      frog.vx = 0;
    }
    if(collisionSide !== "bottom" && frog.vy > 0)
    {
      frog.isOnGround = false;
    }
  }

  if(frog.vy > 0)
  {
    frog.isOnGround = false;
  }

  for(var i = 0; i < enemies.length; i++)
  {
    var vrGUY = enemies[i];
    var pinkFinn = enemies[i];
    var voDoo = enemies[i];


    if(pinkFinn.state === pinkFinn.NORMAL)
    {
      pinkFinn.x += pinkFinn.vx;
      pinkFinn.y -= pinkFinn.vy;
    }

    if(pinkFinn.y <= 0 && pinkFinn.x < 612)
    {
      pinkFinn.y = 700;
      pinkFinn.x = 612;
      pinkFinn.vx = 0;
    }
    else if (pinkFinn.y <= 0 && pinkFinn.x === 612)
    {
      pinkFinn.y = 350;
      pinkFinn.x = 950;
      pinkFinn.vx = -0.3;
    }
    else if(pinkFinn.y <= 0 && pinkFinn.x > 612)
    {
      pinkFinn.x = 10
      pinkFinn.y = 125
      pinkFinn.vx = 0.3;
    }


    if(Math.floor(vrGUY.x) % SIZE === 0
    && Math.floor(vrGUY.y) % SIZE === 0)
    {


	  var vrGUYColumn = Math.floor(vrGUY.x / SIZE);
	  var vrGUYRow = Math.floor(vrGUY.y / SIZE);

      if(vrGUYRow < ROWS - 1)
      {
        var thingBelowLeft = map[vrGUYRow + 1][vrGUYColumn - 1];
        var thingBelowRight = map[vrGUYRow + 1][vrGUYColumn + 1];

        if(thingBelowLeft !== BOX || thingBelowRight !== BOX)
        {
          vrGUY.vx *= -1;
        }
      }

      if(vrGUYColumn > 0)
      {
        var thingToTheLeft = map[vrGUYRow][vrGUYColumn - 1];
        if(thingToTheLeft === BOX)
        {
          vrGUY.vx *= -1;
        }
      }

      if(vrGUYColumn < COLUMNS - 1)
      {
        var thingToTheRight = map[vrGUYRow][vrGUYColumn + 1];
        if(thingToTheRight === BOX)
        {
          vrGUY.vx *= -1;
        }
      }
    }


  }


  bulletTimer++;

  if(bulletTimer === timeToFire && voDoo.state === voDoo.NORMAL)
  {
    fireBullet();
    bulletTimer = 0;
  }


  for(var i = 0; i < bullets.length; i++)
  {

    var bullet = bullets[i];
    bullet.x -= 2;


    if(hitTestCircle(bullet, frog))
    {

      removeObject(bullet, bullets);
      removeObject(bullet, sprites);
      i--;
      gameState = OVER;
      frog.gotRekt = true;
      break;
    }

    if (bullet.centerY() < 0
    || bullet.centerX() < 0
    || bullet.centerX() > canvas.width
    || bullet.centerY() > canvas.height)
    {
      removeObject(bullet, bullets);

      removeObject(bullet, sprites);

      i--;
    }
  }


  for(var i = 0; i < enemies.length; i++)
  {
    var vrGUY = enemies[i];
    var pinkFinn = enemies[i];
    var voDoo = enemies[i];

    if(vrGUY.visible && hitTestCircle(frog, vrGUY)
    && vrGUY.state === vrGUY.NORMAL)
    {
      if(frog.vy > 0)
      {
        blockCircle(frog, vrGUY, true);
        enemiesSquashed++;
        squashVRGUY(vrGUY);
      }
      else
      {
        gameState = OVER;
      }
      if(pinkFinn.visible && hitTestCircle(frog, pinkFinn)
      && pinkFinn.state === pinkFinn.NORMAL)
      {
        if(frog.vy > 0)
        {
          blockCircle(frog, pinkFinn, true);
          enemiesSquashed++;
          squashPinkFinn(pinkFinn);
        }
        else
        {
          gameState = OVER;
        }
      }
      if(voDoo.visible && hitTestCircle(frog, voDoo)
      && voDoo.state === voDoo.NORMAL)
      {
        if(frog.vy > 0)
        {
          blockCircle(frog, voDoo, true);
          enemiesSquashed++;
          squashVodoo(voDoo);
        }
        else
        {
          gameState = OVER;
        }
      }
    }
    }


  if(hitTestRectangle(frog, door))
  {
    if(enemiesSquashed === 3)
    {
      gameState = OVER;
    }
  }


  if (frog.x < 0)
  {
    frog.vx = 0;
    frog.x = 0;
  }

  if (frog.y < 0)
  {
    frog.vy = 0;
    frog.y = 0;
  }

  if (frog.x + frog.width > canvas.width)
  {
    frog.vx = 0;
    frog.x = canvas.width - frog.width;
  }

  if (frog.y + frog.height > canvas.height)
  {
    frog.vy = 0;
    frog.y = canvas.height - frog.height;
    frog.isOnGround = true;
    frog.vy = -frog.gravity;
  }


}

function fireBullet()
{
  var bullet = Object.create(spriteObject);

  bullet.sourceWidth = 20;
  bullet.sourceHeight = 20;
  bullet.width = 20;
  bullet.height = 20;

  bullet.x = 980;
  bullet.y = 730;
  bullet.vx = 1;
  bullet.vy = 1;

  sprites.push(bullet);
  bullets.push(bullet);
}



function squashVRGUY(vrGUY)
{
  vrGUY.state = vrGUY.SQUASHED;
  vrGUY.update();

  setTimeout(removeVRGUY, 1000);

  function removeVRGUY()
  {
    vrGUY.visible = false;
  }
}

function removeObject(objectToRemove, array)
{
  var i = array.indexOf(objectToRemove);
  if (i !== -1)
  {
    array.splice(i, 1);
  }
}

function endGame()
{
  gameOverMessage.visible = true;

  if(enemiesSquashed === 3 && !frog.gotRekt)
  {
    gameOverMessage.text = "You Won!";
  }
  else
  {
    gameOverMessage.text = "You Lost!";
  }
  setTimeout(returnToMenu, 3000);
}


function returnToMenu()
{
  window.location.href = "menu.html";
}


function render()
{
  drawingSurface.clearRect(0, 0, canvas.width, canvas.height);


  if(sprites.length !== 0)
  {
    for(var i = 0; i < sprites.length; i++)
    {
      var sprite = sprites[i];
      if(sprite.visible)
      {
        drawingSurface.drawImage
        (
          image,
          sprite.sourceX, sprite.sourceY,
          sprite.sourceWidth, sprite.sourceHeight,
          Math.floor(sprite.x), Math.floor(sprite.y),
          sprite.width, sprite.height
        );
      }
    }
  }

  if(messages.length !== 0)
  {
    for(var i = 0; i < messages.length; i++)
    {
      var message = messages[i];
      if(message.visible)
      {
        drawingSurface.font = message.font;
        drawingSurface.fillStyle = message.fillStyle;
        drawingSurface.textBaseline = message.textBaseline;
        drawingSurface.fillText(message.text, message.x, message.y);
      }
    }
  }
}

}());
