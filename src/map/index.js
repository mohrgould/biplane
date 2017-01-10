var raw = require('./data');

var scaled = [];
var pos;
var prev;
var i;
var m;
var b;

for (i=0; i<raw.length; i++) {
  var pos = { x: 3*i, y: 3*(199 - raw[i]) + 1000 };

  if (prev === undefined) {
    prev = pos;
    m = 0;
  } else {
    m = (pos.y - prev.y) / (pos.x - prev.x);
  }

  b = pos.y - m*pos.x;

  for (var x=prev.x; x<pos.x; x++) {
    var y = m * x + b;
    scaled.push(y);
  }
  prev = pos;
}

var smoothed = [];
var radius = 25;

for (i=0; i<scaled.length; i++) {
  var n = 0;
  var total = 0;

  for (var j=i-radius; j<=i+radius; j++) {
    if (scaled[j] !== undefined) {
      var weight = radius+1-Math.abs(i-j);
      n += weight;
      total += scaled[j] * weight;
    }
  }

  smoothed.push(1.4*total/n - 1000);
}

module.exports = smoothed;
