"use strict";

var keys = require('./keys')(document);
var entities = require('./entities');

var World = require('./World');

var viewWidth = 640;
var viewHeight = 480;

var worldHeight = 2000;
var worldWidth = 10000;

var container = document.createElement('div');
container.style.position = 'relative';

var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#bdf';

container.appendChild(canvas);

var ground = new Array(worldWidth);
for (var i=0; i<worldWidth; i++) {
  if (i < 1000) {
    ground[i] = 1 * (i - 500) + 1200;
  } else if (i < 1887) {
    ground[i] = 1700;
  } else {
    ground[i] = 1700 + 200 * Math.sin(i/200);
  }
}

var world = new World(keys, canvas, ground, worldHeight);

world.add(new entities.Plane(world, 1100, 1685));
world.add(new entities.Bunker(world, 2000));
world.add(new entities.Bunker(world, 3000));
world.add(new entities.Bunker(world, 4000));
world.add(new entities.Bunker(world, 4500));
world.add(new entities.Bunker(world, 5000));
world.add(new entities.Bunker(world, 5100));
world.add(new entities.Bunker(world, 5200));
world.add(new entities.Bunker(world, 5300));
world.add(new entities.Bunker(world, 5400));
world.add(new entities.Bunker(world, 5500));
world.add(new entities.Bunker(world, 5600));
world.add(new entities.Bunker(world, 5700));
world.add(new entities.Bunker(world, 5800));
world.add(new entities.Bunker(world, 5900));
world.add(new entities.Bunker(world, 6000));
world.add(new entities.Bunker(world, 6100));
world.add(new entities.Bunker(world, 6200));
world.add(new entities.Bunker(world, 6300));
world.add(new entities.Bunker(world, 6400));
world.add(new entities.Bunker(world, 6500));
world.add(new entities.Bunker(world, 6600));
world.add(new entities.Bunker(world, 6700));
world.add(new entities.Bunker(world, 6800));
world.add(new entities.Bunker(world, 6900));
world.add(new entities.Bunker(world, 7000));
world.add(new entities.Bunker(world, 7200));
world.add(new entities.Bunker(world, 7400));
world.add(new entities.Bunker(world, 7600));
world.add(new entities.Bunker(world, 7800));
world.add(new entities.Bunker(world, 8000));

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
