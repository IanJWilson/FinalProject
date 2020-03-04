(function(){


var canvas = document.querySelector("canvas");
var drawingSurface = canvas.getContext("2d");


var map =
[
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,5],
  [7,7,7,7,4,7,7,7,7,4,7,7,7,7,4,4],
  [7,7,7,7,7,7,7,7,7,7,7,7,4,4,7,7],
  [7,7,7,4,4,7,7,7,4,7,4,7,7,7,7,7],
  [7,7,4,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [4,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [4,4,4,4,4,4,4,4,7,7,4,4,4,4,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,4],
  [7,7,4,4,4,4,4,4,4,7,4,4,4,4,4,7],
  [4,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,7,7],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4]
]


var gameObjects =
 [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var EMPTY = 0;
var FROG = 1;
var BOX = 4;
var DOOR = 5;

var SIZE = 64;

var ROWS = map.length;
var COLUMNS = map[0].length;

var tilesheetColumns = 4;

var frog = null;
var door = null;
var timeDisplay = null;
var gameOverDisplay = null;
var gameOverMessage = null;
var timerMessage = null;


var sprites = [];
var hedgehogs = [];
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


gameTimer.time = 25;
gameTimer.start();


var LOADING = 0;
var BUILD_MAP = 1;
var PLAYING = 2;
var OVER = 3;
var gameState = LOADING;


update();

function update()
{

  requestAnimationFrame(update, canvas);

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
  gameOverMessage.font = "bold 30px Helvetica";
  gameOverMessage.fillStyle = "black";
  gameOverMessage.text = "";
  gameOverMessage.visible = false;
  messages.push(gameOverMessage);



  timerMessage = Object.create(messageObject);
  timerMessage.x = 450;
  timerMessage.y = 10;
  timerMessage.font = "bold 40px Helvetica";
  timerMessage.fillStyle = "white";
  timerMessage.text = "";
  messages.push(timerMessage);


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



  if(hitTestRectangle(frog, door))
  {
      gameState = OVER;
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


  timerMessage.text = gameTimer.time;

  if(gameTimer.time < 10)
  {
    timerMessage.text = "0" + gameTimer.time;
  }

  if(gameTimer.time === 0)
  {
    gameState = OVER;
  }


}


function endGame()
{
  gameTimer.stop();
  gameOverMessage.visible = true;

  if(gameTimer.time === 0)
  {
    gameOverMessage.text = "You Lost!";
    setTimeout(restartLevel, 3000);

  }
  else
  {
    gameOverMessage.text = "You Won!";
    setTimeout(nextLevel, 3000);

  }
}


function nextLevel()
{
  window.location.href = "index.html";
}

function restartLevel()
{
  window.location.href = "TimeLevel.html";
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
