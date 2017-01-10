var watch = require('node-watch');
var browserify = require('browserify');
var fs = require('fs');
var http = require('http');
var path = require('path');
var build = require('./build');

var LRPORT = 8909;

var lr = require('tiny-lr')();
lr.listen(LRPORT, function (err) {
  if (err) {
    console.warn(err);
  }
});

function changed (files) {
  setTimeout(function () {
    http.get({
      host: 'localhost',
      port: LRPORT,
      path: '/changed?files=' + files,
    });
    console.log(files + ' changed');
  }, 50);
}

watch(['ed.js'], function (file) {
  build();
});

watch('src', { recursive: true }, function (file)  {
  if (!file.match(/\.[^\/]+\.sw.$/)) {
    build();
  }
});

watch('build', { recursive: true }, function (file)  {
  changed(file);
});

watch(['./index.html', './ed.html'], function (file) {
  changed(file);
});
