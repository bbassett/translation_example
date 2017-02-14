var language = 'pt';

module.exports = function(prefix, path, params, default_string) {
  var module = require('./' + prefix + '/' + language + '.json');
  var path_parts = path.split('.');

  var

  var string = module[path_parts[0]][path_parts[1]];

  var string_parts = string.split()
}