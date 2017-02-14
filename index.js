
var express = require('express');
var app = module.exports = express();
// var translations = require('./src/translations');
var translate = require('lang-js-translate');

app.get('/', function(req, res) {
  // var result = require('./src/test.js');
  this.locales = req.headers["accept-language"];
  var result = require('./src/test2.js');
  res.send(result);
})

var translations = {
  'en': {
    'user': {
      'age': {
        one: 'you are a %{age} year old',
        two: 'you are %{age} years old',
        few: 'you are %{age} years old',
        many: 'you are %{age} years old',
        other: 'you are %{age} years old'
      },
      'name': '%{name} Welcome'
    }
  },
  'pt': {
    'user': {
      'age': {
        one: 'voce tem %{age} ano',
        two: 'voce tem %{age} anos',
        few: 'voce tem %{age} anos',
        many: 'voce tem %{age} anos',
        other: 'voce tem %{age} anos'
      },
      'name': 'bem vindo %{name}'
    }
  }
}

t = function(path, params, default_string) {
  var userLang = getUserLanguage();
  var translationObj = getTranslationObj(userLang, path);
  return translate(translationObj, userLang)(params).join('');
}

function getTranslationObj(userLang, path) {
  var userLang = getUserLanguage();
  var path_parts = path.split('.');
  return translations[userLang][path_parts[0]][path_parts[1]];
}

function getUserLanguage() {
  var defaultLocale = {rating: 0, value: 'br', isDefault: true};
  console.log(this.locales);
  var locales = this.locales.split(',');
  var localesArray = [];

  // TODO; reduce?
  for(var i=0; i<locales.length; i++){
    var l = locales[i];
    var locale = {};
    var l_parts = l.split(';');
    locale.rating = l_parts[1] ? getLocaleRating(l_parts[1]) : 1;
    locale.value = stripCountry(l_parts[0]);
    localesArray.push(locale);
  }
  localesArray.push(defaultLocale);

  var best = getBestLocale(localesArray);
  return best.value;
}

function getBestLocale(localesArray) {
  var best = {rating: 0};

  // TODO: reduce
  for(var i=0; i<localesArray.length; i++){
    var l = localesArray[i];
    if(l.rating > best.rating || l.isDefault) {
      var fileExists = languageFileExists(l.value);
      if(fileExists) best = l;
    }
  }
  return best;
}

function languageFileExists(value) {
  return translations.hasOwnProperty(value);
}

function stripCountry(value) {
  // TODO: this will break languages like
  //   en-US|en-GB and pt-BR|pt-PT
  //   and force them to just en || pt
  return value.split('-')[0];
}

function getLocaleRating(rating) {
  return Number(rating.split('=')[1]);
}
