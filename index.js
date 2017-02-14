var express = require('express');
var requestLanguage = require('express-request-language');
var app = module.exports = express();
var translations = require('./lib/translations')(__dirname + '/locales');

app.use(requestLanguage({
  languages: Object.keys(translations),
  localizations: function(lang) {
    return translations[lang];
  },
  queryName: '_locale'
}));

app.get('/', function(req, res) {
  var t = req.localizations;
  var query = req.query;

  res.send({
    age: t.user.age({age: query.age || 20}),
    name: t.user.name({name: query.name || 'user'}),
    decimal: t.number.decimal(100000000),
    currency: t.number.currency(100000000, {unit: '$'}),
    percent: t.number.percent(100000000),
  });
});
