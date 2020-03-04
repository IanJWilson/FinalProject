(function(){

var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");


var map =
[
  [5,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [4,4,4,4,4,7,7,4,4,4,4,4,4,4,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,4,4,4,4,4,4,4,4],
  [7,7,7,4,4,4,4,4,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [4,4,4,4,4,4,4,4,7,7,4,4,4,4,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,4],
  [7,7,7,7,7,7,7,7,4,4,4,4,4,4,4,4],
  [7,4,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,4,4,7,7,7,4,7,7,7,7,7,7,7,7,7]
]



var gameObjects =
 [
  [0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [13,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,12,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
];

var EMPTY = 0;
var FROG = 1;
var VRGUY = 2;
var BOX = 4;
var DOOR = 5;
var KIWI = 11;
var APPLE = 12;
var BANANA = 13;

var SIZE = 64;

var frog = null;
var door = null;
var gameOverMessage = null;
var shieldMessage = null;

var ROWS = map.length;
var COLUMNS = map[0].length;

var tilesheetColumns = 4;

var sprites = [];
var vrGUYs = [];
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

var vrGUYsSquashed = 0;


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
            vrGUYs.push(vrGUY);
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

          case KIWI:
            kiwi = Object.create(spriteObject);
            kiwi.sourceX = tilesheetX;
            kiwi.sourceY = tilesheetY;
            kiwi.x = column * SIZE;
            kiwi.y = row * SIZE;
            sprites.push(kiwi);
            break;

            case APPLE:
              apple = Object.create(spriteObject);
              apple.sourceX = tilesheetX;
              apple.sourceY = tilesheetY;
              apple.x = column * SIZE;
              apple.y = row * SIZE;
              sprites.push(apple);
              break;

              case BANANA:
                banana = Object.create(spriteObject);
                banana.sourceX = tilesheetX;
                banana.sourceY = tilesheetY;
                banana.x = column * SIZE;
                banana.y = row * SIZE;
                sprites.push(banana);
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
  gameOverMessage.y = canvas.height / 2 - 50 ;
  gameOverMessage.font = "bold 40px Helvetica";
  gameOverMessage.fillStyle = "black";
  gameOverMessage.text = "";
  gameOverMessage.visible = false;
  messages.push(gameOverMessage);

  shieldMessage = Object.create(messageObject);
  shieldMessage.x = 10 ;
  shieldMessage.y = 140;
  shieldMessage.font = "bold 30px Helvetica";
  shieldMessage.fillStyle = "black";
  shieldMessage.text ="Banana Shield Active";
  shieldMessage.visible = false;
  messages.push(shieldMessage);

}

function playGame()
{


  if(jump && frog.isOnGround)
  {
    if(frog.hasKiwi)
    {
      frog.vy -= 7;
      frog.isOnGround = false;
    }
    else
    {
      frog.vy -= 5.2;
      frog.isOnGround = false;
    }

  }

  if(moveLeft && !moveRight)
  {
    if(frog.hasApple)
    {
      frog.vx -= 0.8;
    }
    else
    {
      frog.vx -= 0.5;
    }

  }

  if(moveRight && !moveLeft)
  {
    if(frog.hasApple)
    {
      frog.vx += 0.8;
    }
    else
    {
      frog.vx += 0.5;
    }

  }

  if(!moveLeft && !moveRight)
  {
    frog.vx = 0;
    frog.gravity = 0.3;
  }

  frog.x += frog.vx;
  frog.y += frog.vy;


  frog.vy += frog.gravity;


  if (frog.vx > frog.speedLimit && frog.hasApple == false)
  {
    frog.vx = frog.speedLimit;
  }
  else if (frog.vx > frog.speedWithApple && frog.hasApple)
  {
    frog.vx = frog.speedWithApple
  }
  if (frog.vx < -frog.speedLimit && frog.hasApple == false)
  {
    frog.vx = -frog.speedLimit;
  }
  else if (frog.vx < -frog.speedWithApple && frog.hasApple)
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


  for(var i = 0; i < vrGUYs.length; i++)
  {
    var vrGUY = vrGUYs[i];

    if(vrGUY.state === vrGUY.NORMAL)
    {
      vrGUY.x += vrGUY.vx;
      vrGUY.y += vrGUY.vy;
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

  for(var i = 0; i < vrGUYs.length; i++)
  {
    var vrGUY = vrGUYs[i];

    if(vrGUY.visible && hitTestCircle(frog, vrGUY)
    && vrGUY.state === vrGUY.NORMAL)
    {
      if(frog.vy > 0)
      {
        blockCircle(frog, vrGUY, true);
        vrGUYsSquashed++;
        squashVRGUY(vrGUY);
      }
      else if(frog.hasBanana == true)
      {
        squashVRGUY(vrGUY);
        frog.hasBanana = false;
        shieldMessage.visible = false;
      }
      else
      {
        gameState = OVER;
      }
    }
  }


  if(hitTestRectangle(frog, door))
  {
      frog.doorHit = true;
      gameState = OVER;

  }

  if(hitTestCircle(frog, kiwi))
  {
    frog.hasKiwi = true;
    kiwi.visible = false;
  }

  if(hitTestCircle(frog, apple))
  {
    frog.hasApple = true;
    apple.visible = false;
  }

  if(hitTestCircle(frog, banana))
  {
    frog.hasBanana = true;
    banana.visible = false;
    shieldMessage.visible = true;
    setTimeout(5000);
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




function endGame()
{
  gameOverMessage.visible = true;

  if(frog.doorHit == true)
  {
    gameOverMessage.text = "You Won!";
    setTimeout(returnToMenu, 3000);

  }
  else
  {
    gameOverMessage.text = "You Lost!";
    setTimeout(restartLevel, 3000);
  }

}


function returnToMenu()
{
  window.location.href = "EnemyLevel.html"
}

function restartLevel()
{
  window.location.href = "PowerUpLevel.html";
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
