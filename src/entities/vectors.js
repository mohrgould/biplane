module.exports = {
  rotate: function rotate (vector, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var rotated = {
      x: vector.x * cos - vector.y * sin,
      y: vector.x * sin + vector.y * cos,
    }
    return rotated;
  },

  add: function add (v1, v2) {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  }
};
