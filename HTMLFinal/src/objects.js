

var spriteObject =
{
  sourceX: 0,
  sourceY: 0,
  sourceWidth: 64,
  sourceHeight: 64,
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  height: 64,
  width: 64,
  visible: true,


  accelerationX: 0,
  accelerationY: 0,
  speedLimit: 5,
  speedWithApple: 7,
  bounce: -0.7,
  gravity: 0.3,

  isOnGround: undefined,
  doorHit: false,
  hasKiwi: false,
  hasApple: false,
  hasBanana: false,
  jumpedLeft: true,
  jumpedRight: undefined,
  gotRekt: undefined,


  centerX: function()
  {
    return this.x + (this.width / 2);
  },
  centerY: function()
  {
    return this.y + (this.height / 2);
  },
  halfWidth: function()
  {
    return this.width / 2;
  },
  halfHeight: function()
  {
    return this.height / 2;
  }
};




vrGUYObject = Object.create(spriteObject);


vrGUYObject.NORMAL = [1,0];
vrGUYObject.SQUASHED = [2,0];
vrGUYObject.state = vrGUYObject.NORMAL;

vrGUYObject.update = function()
{
  this.sourceX = this.state[0] * this.sourceWidth;
  this.sourceY = this.state[1] * this.sourceHeight;
};


vrGUYObject.speed = 1;




voDooObject = Object.create(spriteObject);


voDooObject.NORMAL = [1,0];
voDooObject.SQUASHED = [2,0];
voDooObject.state = voDooObject.NORMAL;

voDooObject.update = function()
{
  this.sourceX = this.state[0] * this.sourceWidth;
  this.sourceY = this.state[1] * this.sourceHeight;
}



pinkFinnObject = Object.create(spriteObject);


pinkFinnObject.NORMAL = [1,0];
pinkFinnObject.SQUASHED = [2,0];
pinkFinnObject.state = pinkFinnObject.NORMAL;

pinkFinnObject.update = function()
{
  this.sourceX = this.state[0] * this.sourceWidth;
  this.sourceY = this.state[1] * this.sourceHeight;
};

pinkFinnObject.speed = 0.3;
pinkFinnObject.jump = 1;


kiwiObject = Object.create(spriteObject);

kiwiObject.NORMAL = [1,0];
kiwiObject.SQUASHED = [2,0];
kiwiObject.state = kiwiObject.NORMAL;

kiwiObject.update = function()
{
  this.sourceX = this.state[0] * this.sourceWidth;
  this.sourceY = this.state[1] * this.sourceHeight;
};


appleObject = Object.create(spriteObject);


appleObject.NORMAL = [1,0];
appleObject.SQUASHED = [2,0];
appleObject.state = appleObject.NORMAL;

appleObject.update = function()
{
  this.sourceX = this.state[0] * this.sourceWidth;
  this.sourceY = this.state[1] * this.sourceHeight;
};


bananaObject = Object.create(spriteObject);


bananaObject.NORMAL = [1,0];
bananaObject.SQUASHED = [2,0];
bananaObject.state = bananaObject.NORMAL;

bananaObject.update = function()
{
  this.sourceX = this.state[0] * this.sourceWidth;
  this.sourceY = this.state[1] * this.sourceHeight;
};






var messageObject =
{
  x: 0,
  y: 0,
  visible: true,
  text: "Message",
  font: "normal bold 25px Helvetica",
  fillStyle: "red",
  textBaseline: "top"
};


var gameTimer =
{
  time: 0,
  interval: undefined,

  start: function()
  {
     var self = this;
	   this.interval = setInterval(function(){self.tick();}, 1000);
  },
  tick: function()
  {
    this.time--;
  },
  stop: function()
  {
    clearInterval(this.interval);
  },
  reset: function()
  {
    this.time = 0;
  }
};
