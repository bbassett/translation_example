var basename = require('path').basename;
var glob = require('glob').sync;
var langjs = require('lang-js-translate');

function map(obj, cb) {
  var acc = [];
  Object.keys(obj).forEach(function(k) {
    acc[k] = cb(k, obj[k]);
  });
  return acc;
}

module.exports = function (dir) {
  var translations = {};
  glob(dir + '/*.json').forEach(function(file) {
    translations[basename(file, '.json')] = require(file);
  });
  return compile(translations);
}

function compile(translations) {
  return map(translations, function(locale, prefixes) {
    var l = map(prefixes, function(prefix, names) {
      return map(names, function(name, conf) {
        var fn = langjs(conf, locale);
        return function (params) {
          return fn(params).join('')
        }
      })
    });

    l.number = {
      currency: langjs.number(locale, {style: 'currency'}),
      decimal: langjs.number(locale, {style: 'decimal'}),
      percent: langjs.number(locale, {style: 'percent'})
    };

    return l;
  });

}
