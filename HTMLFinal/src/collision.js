

function hitTestCircle(c1, c2)
{
  var vx = c1.centerX() - c2.centerX();
  var vy = c1.centerY() - c2.centerY();

  var magnitude = Math.sqrt(vx * vx + vy * vy);

  var totalRadii = c1.halfWidth() + c2.halfWidth();

  var hit = magnitude < totalRadii;

  return hit;
}

function blockCircle(c1, c2, bounce)
{

  if(typeof bounce === "undefined")
  {
    bounce = false;
  }

  var vx = c1.centerX() - c2.centerX();
  var vy = c1.centerY() - c2.centerY();

  var magnitude = Math.sqrt(vx * vx + vy * vy);


  var combinedHalfWidths = c1.halfWidth() + c2.halfWidth();

  if(magnitude < combinedHalfWidths)
  {

    var overlap = combinedHalfWidths - magnitude;


    dx = vx / magnitude;
    dy = vy / magnitude;

    c1.x += overlap * dx;
    c1.y += overlap * dy;

    if(bounce)
    {
      var s = {};
      s.vx = vy;
      s.vy = -vx;

      bounceOffSurface(c1, s);
    }
  }
}

function hitTestRectangle(r1, r2)
{

  var hit = false;

  var vx = r1.centerX() - r2.centerX();
  var vy = r1.centerY() - r2.centerY();


  var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();


  if(Math.abs(vx) < combinedHalfWidths)
  {

    if(Math.abs(vy) < combinedHalfHeights)
    {

      hit = true;
    }
    else
    {

      hit = false;
    }
  }
  else
  {

    hit = false;
  }

  return hit;
}

function blockRectangle(r1, r2, bounce)
{

  if(typeof bounce === "undefined")
  {
    bounce = false;
  }

  var collisionSide = "";

  var vx = r1.centerX() - r2.centerX();
  var vy = r1.centerY() - r2.centerY();

  var combinedHalfWidths = r1.halfWidth() + r2.halfWidth();
  var combinedHalfHeights = r1.halfHeight() + r2.halfHeight();

  if(Math.abs(vx) < combinedHalfWidths)
  {

    if(Math.abs(vy) < combinedHalfHeights)
    {

      var overlapX = combinedHalfWidths - Math.abs(vx);
      var overlapY = combinedHalfHeights - Math.abs(vy);

      if(overlapX >= overlapY)
      {
        if(vy > 0)
        {
          collisionSide = "top";

          r1.y = r1.y + overlapY;
        }
        else
        {
          collisionSide = "bottom";

          r1.y = r1.y - overlapY;
        }


        if(bounce)
        {
          r1.vy *= -1;

        }
      }
      else
      {

        if(vx > 0)
        {
          collisionSide = "left";

          r1.x = r1.x + overlapX;
        }
        else
        {
          collisionSide = "right";

          r1.x = r1.x - overlapX;
        }


        if(bounce)
        {
          r1.vx *= -1;

        }
      }
    }
    else
    {

      collisionSide = "none";
    }
  }
  else
  {

    collisionSide = "none";
  }

  return collisionSide;
}

function blockCircle(c1, c2, bounce)
{

  if(typeof bounce === "undefined")
  {
    bounce = false;
  }

  var vx = c1.centerX() - c2.centerX();
  var vy = c1.centerY() - c2.centerY();

  var magnitude = Math.sqrt(vx * vx + vy * vy);


  var combinedHalfWidths = c1.halfWidth() + c2.halfWidth();

  if(magnitude < combinedHalfWidths)
  {

    var overlap = combinedHalfWidths - magnitude;


    dx = vx / magnitude;
    dy = vy / magnitude;


    c1.x += overlap * dx;
    c1.y += overlap * dy;


    if(bounce)
    {

      var s = {};


      s.vx = vy;
      s.vy = -vx;

      bounceOffSurface(c1, s);
    }
  }
}


function bounceOffSurface(o, s)
{

  s.lx = s.vy;
  s.ly = -s.vx;

  s.magnitude = Math.sqrt(s.vx * s.vx + s.vy * s.vy);

  s.dx = s.vx / s.magnitude;
  s.dy = s.vy / s.magnitude;


  var dp1 = o.vx * s.dx + o.vy * s.dy;

  var p1Vx = dp1 * s.dx;
  var p1Vy = dp1 * s.dy;

  var dp2 = o.vx * (s.lx / s.magnitude) + o.vy * (s.ly / s.magnitude);


  var p2Vx = dp2 * (s.lx / s.magnitude);
  var p2Vy = dp2 * (s.ly / s.magnitude);


  p2Vx *= -1;
  p2Vy *= -1;


  var bounceVx = p1Vx + p2Vx;
  var bounceVy = p1Vy + p2Vy;

  o.vx = bounceVx;
  o.vy = bounceVy;
}
