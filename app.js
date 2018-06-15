'use strict';

var config = require('./config.js');
var express = require('express');
var bodyParser = require('body-parser');
var usersRouter = require('./routes/usersRouter.js');
var mongoose = require('mongoose');
var app = express();

// Database setup and connection
mongoose.connect(config.MONGO_DATABASE_URL); 
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("We're connected");
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '50mb'
}));

app.use(function (req, res, next) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    url = req.url,
    method = req.method;

  console.log('[DEBUG] New request:');
  console.log('---> Client IP is: ', ip);
  console.log('---> Requested url is: ', url);
  console.log('---> Requested method is: ', method);
  console.log('');

  next();
});
require('./routes/usersRouter.js');
var dbFile = require('./www/models/file-schema');
app.use(express.static('www'));
app.use(usersRouter);

module.exports = app;
