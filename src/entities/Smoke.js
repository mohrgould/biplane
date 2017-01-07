module.exports = function Smoke (world, x, y, size) {
  this.r = 0;
  this.x = x;
  this.y = y;
  this.collides = false;
  var that = this;

  var alpha = 0.4;

  this.update = function (dur) {
    alpha -= dur / 2000;
    if (alpha <= 0) {
      world.remove(this);
    }
  }

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255,255,255,' + alpha + ')';
    ctx.arc(0, 0, size, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();
  }
  
  this.contains = function (x, y) {
    return Math.sqrt(Math.pow(this.x-x, 2) + Math.pow(this.y-y, 2)) < size;
  };

  this.hit = function (n) {
  };
}
