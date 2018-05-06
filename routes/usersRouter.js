'use strict';

var express = require('express'),
  word = require('../models/usersModel.js'),

  router = express.Router();


router.route('/graphs')
  .get(function (req, res) {
    graphs.find({}, (err, users) => {
      if (err) {
        res.send(err);
        return;
      }
      res.json(users);
    });
  })
  .post(function (req, res) {
    var postData = req.body;

    usersModel.insert(postData, function (err, newUser) {
      if (err) {
        res.send(err);

        return;
      }

      res.json(newUser);
    });
  });
  router.route('/graphs:id')
  .get(function (req, res) {
    usersModel.findOne({
      _id: req.params.id
    }, function (err, user) {
      if (err) {
        res.send(err);

        return;
      }

      if (user === null) {
        res.json({
          type: 'error',
          message: 'Did not find a user with "id" of "' + req.params.id + '".'
        });
        return;
      }
      res.json(user);
    });
   
  });
    router.route('/uploadFile')
      .post(function (req, res) {
        console.log(req.body);
                res.json(req.body);
      });



module.exports = router;