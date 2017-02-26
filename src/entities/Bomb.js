var Smoke = require('./Smoke');
var vectors = require('./vectors');

module.exports = function Bomb (world, x, y, v, r) {
  this.collides = true;
  this.x = x;
  this.y = y;

  var vec = vectors.rotate({x: v, y: 0}, r);
  var vx = vec.x;
  var vy = vec.y;
  
  this.r = 0;

  this.draw = function (ctx) {
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  };

  this.update = function (dur) {
    this.x += vx * dur * 0.9;
    this.y += vy * dur * 0.9;
    vy += 0.0001 * dur;

    for (var i=0; i<world.entities.length; i++) {
      if (world.entities[i] !== this && world.entities[i].collides && world.entities[i].contains(this.x, this.y)) {
        world.entities[i].hit(50);
        world.remove(this);
      }
    }

    if (world.ground[Math.floor(this.x)] < this.y) {
      world.depress(this.x, 80);
      world.remove(this);
      world.add(new Smoke(world, this.x, this.y - 10, 30));
    }
  };

  this.contains = function (x, y) {
    return Math.sqrt(Math.pow(this.x-x, 2) + Math.pow(this.y-y, 2)) < 10;
  };

  this.hit = function (n) {
    world.remove(this);
    world.add(new Smoke(world, this.x, this.y, 30));
  };
};
