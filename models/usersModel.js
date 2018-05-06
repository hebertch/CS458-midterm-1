'use strict';

var Datastore = require('nedb'),

  Word = new Datastore({
    paperName: String,
    name: String,
    count: Number
  }),

  Bigram = new Datastore({
    paperName: String,
    name: String,
    count: Number
  }),

  Paper = new Datastore({
    name: String,
    wordCount: Number
  });

module.exports.Word = Word;
module.exports.Bigram = Bigram;
module.exports.Paper = Bigram;
