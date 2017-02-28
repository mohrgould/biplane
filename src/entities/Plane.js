var Bomb = require('./Bomb');
var Bullet = require('./Bullet');
var Smoke = require('./Smoke');
var vectors = require('./vectors');

module.exports = function Plane (world, x, y) {
  var width = 50;
  var height = 20;

  var alive = true;
  var mayBomb = true;
  var mayShoot = true;
  var mayFlip = true;
  var maySmoke = true;
  var inverted = false;
  var crashed = false;

  this.reset = function () {
    this.x = x;
    this.y = y;
    this.r = 63*Math.PI/32;
    this.v = 0;
    this.collides = true;
    inverted = false;
  };

  this.reset();
  
  var that = this;

  var points = [
    {x: -width/2, y: -height/2},
    {x: width/2, y: -height/2},
    {x: width/2, y: height/2},
    {x: -width/2, y: 0},
    {x: -width/3, y: height/2}, // rear landing gear
    {x: width/2.2, y: height}, // front landing gear
  ];

  function localPoints () {
    return points.map(function (p) {
      if (inverted) {
        return vectors.rotate({x: p.x, y: -p.y}, that.r);
      } else {
        return vectors.rotate(p, that.r);
      }
    });
  }

  function globalPoints () {
    return localPoints().map(function (point) {
      return vectors.add({x: that.x, y: that.y}, point);
    });
  }

  this.draw = function (ctx) {
    if (inverted) ctx.scale(1, -1);

    ctx.lineWidth = 1.3;

    // gear linkage
    ctx.strokeStyle = '#99c';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width/3, height/1.4);
    ctx.lineTo(width/2.25, height/6);
    ctx.stroke();

    // wing linkage
    ctx.strokeStyle = '#99c';
    ctx.beginPath();
    ctx.moveTo(width/4.5, 0);
    ctx.lineTo(width/4.5, -height/2.5);
    ctx.moveTo(width/2.8, 0);
    ctx.lineTo(width/2.6, -height/2.5);
    ctx.stroke();

    // gear
    ctx.beginPath();
    ctx.arc(width/3, height/1.4, 4, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fillStyle = '#666';
    ctx.fill();

    ctx.fillStyle = '#ef333c';

    // wing
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(width/8, -height/2.8);
    ctx.lineTo(width/2.2, -height/2.5);
    ctx.lineTo(width/2.2, -height/1.6);
    ctx.lineTo(width/8, -height/2);
    ctx.closePath();
    ctx.fill();

    // fuselage
    ctx.lineWidth = 2;
    ctx.moveTo(width/8, -height/2.5);
    ctx.moveTo(0, height/2.5);
    ctx.lineTo(width/4, height/2.5);
    ctx.lineTo(width/2, height/3.0);
    ctx.lineTo(width/2, -height/5);
    ctx.lineTo(width/16, -height/5);
    ctx.lineTo(-width/4, -height/8);
    ctx.lineTo(-width/2.5, -height/2);
    ctx.lineTo(-width/2, -height/2.5);
    ctx.lineTo(-width/2.5, height/3);
    ctx.closePath();
    ctx.fill();
  };

  this.handleInput = function (dur) {
    if (world.keys.isDown('SPACE')) {
      if (mayShoot) {
        mayShoot = false;

        setTimeout(function () {
          var exit = vectors.add({x: that.x, y: that.y}, vectors.rotate({x: 3*width/4 + width * that.v, y: 0}, that.r));
          var bullet = new Bullet(world, exit.x, exit.y, 1.5, that.r);
          world.add(bullet);
          mayShoot = true;
        }, 125);
      }
    }

    if (world.keys.isDown('B')) {
      if (mayBomb) {
        mayBomb = false;
        var bombRelativePos = vectors.rotate({
          x: 0,
          y: 1.5 * height * (inverted ? -1 : 1)  + height * this.v
        }, this.r);

        var bombVec = vectors.rotate({x: this.v, y: 0}, this.r);
        var bombPos = vectors.add({x: this.x, y: this.y}, bombRelativePos);
        var bombAngle = Math.atan2(bombVec.y, bombVec.x);
        var bomb = new Bomb(world, bombPos.x, bombPos.y, this.v*0.9, bombAngle);
        world.add(bomb);
        setTimeout(function () {
          mayBomb = true;
        }, 200);
      }
    }

    if (world.keys.isDown('N')) {
      this.v = Math.min(this.v + (dur / 1000), 1);
      if (maySmoke) {
        maySmoke = false;
        world.add(new Smoke(world, this.x, this.y, 12, [255, 255, 255]));
        setTimeout(function () {
          maySmoke = true;
        }, 50);
      }
    } else if (world.keys.isDown('X')) {
      this.v += (dur / 3000);
    }

    // handle pitch up/down

    if (world.keys.isDown('LEFT')) {
      this.r -= Math.min(0.3, this.v) * dur / 80 * (inverted ? -1 : 1);
      if (this.r < 0) this.r += Math.PI * 2;
      this.r = this.r % (Math.PI * 2)
      this.v *= Math.pow(0.9998, dur);
    }

    if (world.keys.isDown('RIGHT')) {
      this.r += Math.min(0.3, this.v) * dur / 80 * (inverted ? -1 : 1);
      if (this.r < 0) this.r += Math.PI * 2;
      this.r = this.r % (Math.PI * 2)
      this.v *= Math.pow(0.9998, dur);
    }
    
    if (world.keys.isDown('UP') || world.keys.isDown('DOWN')) {
      if (mayFlip) {
        mayFlip = false;
        inverted = !inverted;
        setTimeout(function () {
          mayFlip = true;
        }, 250);
      }
    }
  };
    
  function noseDown(dur, gradualness) {
    if (that.r > Math.PI / 2 && that.r < 3 * Math.PI / 2) {
      that.r = ((gradualness * that.r) + (dur * Math.PI / 2)) / (gradualness + dur);
    } else if (that.r <= Math.PI / 2) {
      that.r = ((gradualness * that.r) + (dur * Math.PI / 2)) / (gradualness + dur);
    } else if (that.r >= 3 * Math.PI / 2) {
      that.r = ((gradualness * that.r) + (dur * 5 * Math.PI / 2)) / (gradualness + dur);
    }
    that.r = that.r % (2*Math.PI)
  }

  this.update = function (dur) {
    dur = Math.min(100, dur); // keep duration reasonable
      
    // air resistance

    this.v *= Math.pow(0.9996, dur);

    // gravity

    this.y += dur / 10;

    // lift

    this.y -= dur * this.v * Math.abs(Math.cos(this.r)) / 3;
    
    // apply user inputs

    if (alive) {
      this.handleInput(dur);
    } else {
      noseDown(dur, 500);
    }

    // speed up when the nose is down

    this.v = Math.max(0, this.v + Math.sin(this.r) * dur / 10000);

    // limit velocity unless the jet is firing

    if (!world.keys.isDown('N')) {
      this.v = Math.min(0.4, this.v);
    }

    // movement

    var vec = vectors.rotate({x: this.v * dur, y: 0}, this.r);
    this.x += vec.x;
    this.y += vec.y;
    
    // constrain to boundaries

    if (this.x < 0) {
      this.x = 0;
    }

    if (this.x >= world.ground.length) {
      this.x = world.ground.length - 1;
    }

    if (this.y < 0) {
      this.y = 0;
    }

    if (this.y >= world.height) {
      this.y = world.height - 1;
    }

    // ground collision

    var collisionOffset = 0;
    var i;
    var groundY;
    var p;

    var localPs = localPoints();
    var globalPs = globalPoints();

    for (i=0; i<localPs.length; i++) {
      var p = vectors.add({x: this.x, y: this.y}, localPs[i]);
      groundY = world.ground[Math.floor(p.x)];
      if (p.y > groundY) {
        collisionOffset = Math.min(collisionOffset, groundY - p.y + 2);
        if (i < 4 || !alive) { // don't crash on gear collision if the plane is still alive
          if (!crashed) {
            crashed = true;

            if (alive) {
              this.hit(50);
            } else {
              world.add(new Smoke(world, this.x, this.y, 40));
            }

            world.depress(p.x, 80);
            this.v = 0;

            setTimeout(function () {
              that.reset();
            }, 500);
          }
        }
      }
    }

    if (collisionOffset) {
      this.y += collisionOffset;
      if (!world.keys.isDown('X')) { // brakes
        this.v *= Math.pow(0.997, dur);
      }
    } else {
      // nose down when going too slow in the air
      if (this.v < 0.1) {
        noseDown(dur, 1000);
      }
    }

    // smoke when dead
    if (!alive) {
      if (maySmoke) {
        maySmoke = false;
        world.add(new Smoke(world, this.x, this.y, 12, [224, 224, 224]));
        setTimeout(function () {
          maySmoke = true;
        }, 100);
      }
    }

    // entity collisions

    for (i=0; i<world.entities.length; i++) {
      if (world.entities[i] !== this && world.entities[i].collides) {
        for (var j=0; j<globalPs.length; j++) {
          if (world.entities[i].contains(globalPs[j].x, globalPs[j].y)) {
            world.entities[i].hit(50);
            if (alive) this.hit(50);
            break;
          }
        }
      }
    }
  };

  this.reset = function () {
    this.x = x;
    this.y = y;
    this.r = 63*Math.PI/32;
    this.v = 0;
    inverted = false;
    alive = true;
    crashed = false;
  };
  
  this.contains = function (x, y) {
    var topLeft = vectors.rotate({x: this.x - width/2, y: this-height/2}, this.r);
    var bottomRight = vectors.rotate({x: this.x + width/2, y: this+height/2}, this.r);

    return x >= topLeft.x && x <= bottomRight.x &&
           y >= topLeft.y && y <= bottomRight.y;
  };

  this.hit = function (n) {
    world.add(new Smoke(world, this.x, this.y, n, [255, 224, 224]));
    alive = false;
  };
};
