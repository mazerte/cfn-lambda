var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var mkdirp = require('mkdirp');

module.exports = function(outPath, callback) {
  var zip_parts = [];
  var archive = archiver('zip');

  mkdirp.sync( path.resolve(outPath, "..") );
  var output = fs.createWriteStream(outPath);
  output.on('close', callback);

  var options = { ignore: [
    path.relative(process.cwd(), outPath),
    "deploy/**"
  ] };
  try {
    var ignore = fs.readFileSync( path.join(process.cwd(), ".zipignore"), 'utf8' );
    options.ignore = _.compact( _.flatten([options.ignore, ignore.split('\n')]) );
  } catch (e) {}

  archive.pipe(output);
  archive.glob('**/*.*', options);

  archive.finalize();
}
