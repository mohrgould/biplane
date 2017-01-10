var Bullet = require('./Bullet');
var Smoke = require('./Smoke');
var vectors = require('./vectors');

module.exports = function Bunker (world, x) {
  this.collides = true;
  this.x = x;
  this.y = world.ground[x];
  this.r = 0;

  var w = 50;
  var h = 40;

  var alive = true;

  var mayShoot = true;

  this.update = function (dur) {
    var distx = world.entities[0].x - this.x;
    var disty = world.entities[0].y - this.y;
    var dist = Math.sqrt(Math.pow(distx, 2) + Math.pow(disty, 2))
    if (dist < 400) {
      if (mayShoot) {
        mayShoot = false;
        var deviation = Math.random() * Math.PI / 16 + Math.PI / 32;
        var angle = (Math.atan2(disty, distx) + deviation) % (Math.PI * 2);
        var exit = vectors.add({x: this.x, y: this.y}, vectors.rotate({x: w, y: 0}, angle));
        setTimeout(function () {
          if (alive) {
            world.add(new Bullet(world, exit.x, exit.y, 0.25, angle));
          }
        }, Math.random() * 2000);
        setTimeout(function () {
          mayShoot = true;
        }, 3000);
      }
    }
  };

  this.draw = function (ctx) {
    ctx.lineWidth = 2;
    ctx.fillStyle = '#666';
    ctx.strokeStyle = '#444';
    ctx.fillRect(-w/2, -h/2, w, h);
    ctx.strokeRect(-w/2, -h/2, w, h);
  };

  this.contains = function (x, y) {
    var contained = x >= this.x - w/2
        && x <= this.x + w/2
        && y >= this.y - h/2
        && y <= this.y + h/2;
    return contained;
  };

  this.hit = function (n) {
    alive = false;
    world.depress(this.x, 100);
    world.add(new Smoke(world, this.x, this.y, 60));
    world.remove(this);
  };
};
