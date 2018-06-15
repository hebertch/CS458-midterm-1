'use strict';
var fileUpload = require('../www/models/file-schema'),
express = require('express'),
  word = require('../models/usersModel.js'),

  router = express.Router();



  router.route('/uploadFile')
    .post(function (req, res) {
      if(req) {
        var newFile = new fileUpload();
        console.log(req.body)
        newFile.name = req.body.name;
        newFile.wordCount = req.body.count

        var sorted = req.body.array.sort();
        var prev = sorted[0].toLowerCase();
        var count = 1;

        for (let i = 0; i < sorted.length-1; i++) {
          for (let j = 0; j < prev.length-1; j++) {
            console.log(prev)
            // newFile.bigrams.push(prev[j] + prev[j+1])
          }
          if (sorted[i].toLowerCase() == prev) {
            count++;
          } else {
            if (prev != '') {
              newFile.words.push({word: prev, count: count});
            }
            
            count = 1;
          }
          ngrams.push(`${req.body.array[i]} ${req.body.array[i+1]}`)
          prev = sorted[i].toLowerCase()
          

          }
          // console.log(newFile.words);
          console.log(newFile.bigrams);
        }
      
    });



module.exports = router;