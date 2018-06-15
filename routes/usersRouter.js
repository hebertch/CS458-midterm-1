'use strict';
var fileUpload = require('../www/models/file-schema'),
  express = require('express'),
  word = require('../models/usersModel.js'),

  router = express.Router();

router.get('/getFiles', (req,res) => {
  fileUpload.find({}, (err,docs) => {
    console.log(docs)
    res.json(docs);
  });
});

router.route('/uploadFile')
  .post(function (req, res) {
    if (req) {
      var newFile = new fileUpload();
      console.log(req.body)
      newFile.name = req.body.name;
      newFile.wordCount = req.body.count

      var sorted = req.body.array.sort();
      var file_words = req.body.array.map(function (word) {
        return word.toLowerCase();
      });
      var words = {};

      for (var i = 0; i < file_words.length; ++i) {
        var word = file_words[i];
        words[word] = words[word] ? words[word] + 1 : 1;
      }

      var bigrams = {};
      for (var word in words) {
        if (words.hasOwnProperty(word)) {
          for (var i = 0; i < word.length - 1; ++i) {
            var bigram = '' + word[i] + word[i + 1];
            var num_instances = words[word];
            bigrams[bigram] = bigrams[bigram] ? bigrams[bigram] + num_instances : num_instances;
          }
        }
      }
    
      for (let i = 0; i < Object.keys(words).length; i++) {
        newFile.words.push({
          word: Object.keys(words)[i],
          count: Object.values(words)[i]
        });
      }
      for (let j = 0; j < Object.keys(bigrams).length; j++) {
        newFile.bigrams.push({
          bigram: Object.keys(bigrams)[j],
          count: Object.values(bigrams)[j]
        });
      }
    console.log(newFile);
    newFile.save();
  
     
    }

  });



module.exports = router;