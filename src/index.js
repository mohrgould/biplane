"use strict";

var World = require('./World');

var keys = require('./keys')(document);
var entities = require('./entities');
var ground = require('./map');

var worldHeight = 2000;

var viewWidth = 640;
var viewHeight = 480;

var container = document.createElement('div');
container.style.position = 'relative';
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#bdf';
container.appendChild(canvas);

var world = new World(keys, canvas, ground, worldHeight);

var startX = 3700;
world.add(new entities.Plane(world, startX, ground[startX]-10));

var locs = [
  100,
  140,
  200,
  270,
  340,
  400,
  470,

  780,
  890,
  880,
  1040,
  1080,
  1150,
  1190,
  1270,
  1350,
  1380,
];

for (var i=0; i<locs.length; i++)  {
  world.add(new entities.Bunker(world, locs[i] * 6));
}

var guide = document.createElement('div');
guide.style.position = 'absolute';
guide.style.top = 0;
guide.style.right = '20px';
guide.style.color = '#444';
guide.innerHTML = '<h3>Controls</h3><dl>' +
  '<dt>X</dt><dd>Accelerate</dd>' +
  '<dt>Left</dt><dd>Nose up</dd>' +
  '<dt>Right</dt><dd>Nose down</dd>' +
  '<dt>Up</dt><dd>Invert</dd>' +
  '<dt>Space</dt><dd>Shoot</dd>' +
  '<dt>B</dt><dd>Bomb</dd>' +
  '<dt>J</dt><dd>Jet</dd>' +
  '</dl>';

var lastTs = null;
function step(ts) {
  if (!lastTs) lastTs = ts;
  var dur = ts - lastTs;

  world.update(dur);
  world.draw();
  lastTs = ts;

  setTimeout(function () {
    requestAnimationFrame(step);
  }, 1);
}

container.appendChild(guide);
document.body.appendChild(container);
requestAnimationFrame(step);
