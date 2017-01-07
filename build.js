var browserify = require('browserify');
var fs = require('fs');
var path = require('path');


function bundle (infile, outfile) {
  var b = browserify();
  b.add(infile);
  b.bundle(function (err, buf) {
    if (err) {
      console.error(err);
    } else {
      var s = fs.createWriteStream(outfile);
      s.write(buf);
      console.log('Built ' + outfile);
    }
  });
}

module.exports = function build () {
  var buildDir = './build';
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }

  bundle(path.join('src', 'index.js'), path.join(buildDir, 'bundle.js'));
};
