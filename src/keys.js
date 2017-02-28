module.exports = function (document) {
  var codes = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    J: 74,
    B: 66,
    N: 78,
    V: 86,
    X: 88,
    Y: 89,
    Z: 90,
    COMMA: 188,
    PERIOD: 190,
    SLASH: 191,
    SPACE: 32,
  }

  var keys = {};

  document.body.addEventListener('keydown', function (e) {
    for (var i in codes) {
      if (e.keyCode === codes[i]) {
        keys[i] = true;
      }
    }
    if (e.keyCode === codes.Z) {
      addOnly = true;
    }
  });

  document.body.addEventListener('keyup', function (e) {
    //console.log('keyCode ' + e.keyCode);
    for (var i in codes) {
      if (e.keyCode === codes[i]) {
        keys[i] = false;
      }
    }
    if (e.keyCode === codes.Z) {
      addOnly = false;
    }
  });

  return {
    isDown: function (k) {
      return keys[k];
    },
  }
};
