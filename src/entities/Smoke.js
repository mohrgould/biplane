module.exports = function Smoke (world, x, y, size, rgb) {
  this.r = 0;
  this.x = x;
  this.y = y;
  this.rgb = rgb || [ 224, 255, 255 ];

  this.collides = false;
  var that = this;

  var alpha = 0.3;

  this.update = function (dur) {
    alpha -= dur / 2000;
    if (alpha <= 0) {
      world.remove(this);
    }
  }

  this.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(' + this.rgb[0] + ',' + this.rgb[1] + ',' + this.rgb[2] + ',' + alpha + ')'; // 255,255,255,' + alpha + ')';
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
