var ground = require('./src/map');

var width = 10000;
var height = 2000;

var container = document.createElement('div');
container.style.margin = 0;
container.style.padding = 0;
container.style.width = width + 'px';
container.style.display = 'block';

var canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
container.appendChild(canvas);

var rect = canvas.getBoundingClientRect();

editing = false;
var last;

function pos(e) {
  return {
    x: Math.floor(e.offsetX + rect.left),
    y: e.offsetY + rect.top
  };
}

function penDown(e) {
  editing = true;
  last = pos(e);
  if (e.target === canvas) {
    var p = pos(e);
    set(p);
    requestAnimationFrame(function () {
      draw(p.x, p.x);
    });
  }
}

function penUp() {
  editing = false;
  last = null
}

document.body.addEventListener('mousedown', penDown);
document.body.addEventListener('mouseup', penUp);
document.body.addEventListener('keydown', function (e) {
  if (e.keyCode === 32) penDown();
});
document.body.addEventListener('keyup', function (e) {
  if (e.keyCode === 32) penUp();
});


//var ground = new Array(width).fill(0.8*height);

function set (pos, last) {
  var begin, end, m, b;

  if (last && last.x !== pos.x) {
    var begin = pos.x < last.x ? pos : last;
    var end = pos.x >= last.x ? pos : last;
    var m = (end.y - begin.y) / (end.x - begin.x);
    var b = pos.y - m * pos.x;
  } else {
    var begin = end = pos;
    var m = 0;
    var b = pos.y;
  }

  console.log('setting ' + begin.x + ' to ' + end.x + ' from ' + JSON.stringify([pos, last]));
  for (var i=begin.x; i<=end.x; i++) {
    ground[i] = m*i + b;
    //console.log('set ' + i + ' to ' + ground[i]);
  }
}

canvas.addEventListener('mousemove', function (e) {
  if (editing) {
    var pos = {
      x: Math.floor(e.offsetX + rect.left),
      y: e.offsetY + rect.top
    };

    if (!last) last = pos;

    (function (x1, y1, x2, y2) {
      set({x:x1, y:y1}, {x:x2, y:y2});
      requestAnimationFrame(function () {
        draw(x1, x2);
      });
    })(pos.x, pos.y, last.x, last.y);
      
    last = pos;
  }


});

var ctx = canvas.getContext('2d');
ctx.fillStyle = '#444';
ctx.strokeStyle = '#444';
ctx.lineWidth = 1;

function drawAll () {
  ctx.save();
  ctx.clearRect(0,0,width,height)
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (var i=0; i<ground.length; i++) {
    ctx.lineTo(i, ground[i]);
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();
  ctx.moveTo(0,0);
  ctx.restore();
}

function draw (x1, x2) {
  var begin, end;
  if (x1 == x2) {
    begin = x1;
    end = x2;
  } else if (x1 < x2) {
    begin = x1;
    end = x2;
  } else {
    end = x1;
    begin = x2;
  }

  //console.log('draw ' + x1 + '-' + x2);

  ctx.save();
  ctx.clearRect(begin, 0, end-begin, height)
  ctx.beginPath();
  for (var i=begin; i<=end; i++) {
    ctx.fillRect(i, ground[i], 1, height)
  }
  ctx.restore();
}

var redraw = document.createElement('button');
redraw.innerHTML = 'Redraw';
redraw.onclick = function () {
  drawAll();
};
container.appendChild(redraw);

var button = document.createElement('button');
button.innerHTML = 'Dump';
button.onclick = function () {
  output.innerHTML = JSON.stringify(ground);
};
container.appendChild(button);

var output = document.createElement('div');
output.style.width = width + 'px';
output.style.display = 'block';
output.style.wordWrap = 'break-word';
container.appendChild(output);

document.body.appendChild(container);
drawAll();
