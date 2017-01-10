module.exports = function (keys, el, ground, worldHeight) {
  var ctx = el.getContext('2d');
  var i;

  this.height = worldHeight;
  this.ground = ground;
  this.keys = keys;

  this.entities = [];

  this.add = function (e) {
    this.entities.push(e);
  };

  this.remove = function (entity) {
    for (i=0; i<this.entities.length; i++) {
      if (this.entities[i] === entity) {
        this.entities.splice(i, 1);
      }
    }
  };

  this.update = function (dur) {
    el.width = window.innerWidth;
    el.height = window.innerHeight;

    for (i=0; i<this.entities.length; i++) {
      if (this.entities[i].x < 0
          || this.entities[i].x >= ground.length
          || this.entities[i].y < 0
          || this.entities[i].y > worldHeight)
      { 
        this.entities.splice(i, 1);
      } else {
        this.entities[i].update(dur);
      }
    }
  };

  this.depress = function (x, n) {
    x = Math.floor(x);
    var depth = Math.ceil(n/2);
    var start = x - Math.floor(n/2);
    var end = start + n - 1;
    for (var i=start; i<=end; i++) {
      if (this.ground[i]) {
        if (this.ground[i] > 0) {
          this.ground[i] += depth - (Math.abs(x - i));
          if (this.ground[i] > this.height) {
            this.ground[i] = this.height;
          }
        }
      }
    }
  };

  this.draw = function () {
    var i;
    var posX = Math.floor(this.entities[0].x);
    var posY = Math.floor(this.entities[0].y);
    var vw = el.width;
    var vh = el.height;
    var offsetX = posX - Math.floor(vw/2);
    var offsetY = posY - Math.floor(vh/2);
    
    ctx.fillStyle = '#584';
    ctx.strokeStyle = '#453';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.clearRect(0, 0, vw, vh);

    var started = false;
    var firstX;
    var lastX;
    
    for (i=-1; i<=vw; i++) {
      var groundX = i + offsetX;
      var groundY = this.ground[groundX];

      if (groundY) {
        var lineY = groundY - offsetY;

        if (!started) {
          started = true;
          firstX = i;
          ctx.moveTo(i, lineY);
        } else {
          ctx.lineTo(i, lineY);
        }
        lastX = i;
      }
    }

    ctx.lineTo(lastX, vh-1);
    ctx.lineTo(0, vh-1);
    ctx.lineTo(firstX, vh -1);
    ctx.stroke()
    ctx.fill();

    for (i=this.entities.length-1; i>=0; i--) {
      ctx.save();
      ctx.lineWidth = 2;
      ctx.translate(this.entities[i].x - offsetX, this.entities[i].y - offsetY);
      ctx.rotate(this.entities[i].r);
      this.entities[i].draw(ctx);
      ctx.restore();
    }

    ctx.save();
    ctx.fillStyle = '#444';
    ctx.fillText(
      Math.round(this.entities[0].x) + ',' + Math.round(this.entities[0].y),
      20,
      el.height-20
    );
    ctx.restore();
  };
};

