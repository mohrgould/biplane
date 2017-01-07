var vectors = require('./vectors');
var Smoke = require('./Smoke');

module.exports = function Bullet (world, x, y, v, r) {
  this.collides = true;
  this.x = x;
  this.y = y;
  this.r = r;

  var vec = vectors.rotate({x: v, y: 0}, r);
  var vx = vec.x;
  var vy = vec.y;
  
  this.draw = function (ctx) {
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.scale(2,1);
    ctx.arc(0, 0, 3, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  this.update = function (dur) {
    this.x += vx * dur;
    this.y += vy * dur;
    vy += 0.0001 * dur;

    for (var i=0; i<world.entities.length; i++) {
      if (world.entities[i] !== this && world.entities[i].collides && world.entities[i].contains(this.x, this.y)) {
        world.entities[i].hit(10);
        world.remove(this);
      }
    }

    if (world.ground[Math.floor(this.x)] < this.y) {
      world.depress(this.x, 10);
      world.remove(this);
    }
  };

  this.contains = function (x, y) {
    return Math.sqrt(Math.pow(this.x-x, 2) + Math.pow(this.y-y, 2)) < 5;
  };

  this.hit = function (n) {
    world.remove(this);
    world.add(new Smoke(world, this.x, this.y, 10));
  };
};
