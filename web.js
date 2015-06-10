var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var winston = require('./lib/winston');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes/api'))

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
app.use(function(err, req, res, next) {
  if (err.status !== 404) {
    winston.error(err);
  }
  res.status(err.status || 500);

  var accept = req.headers.accept || '';
  if (~accept.indexOf('html')) {
    res.render('error', {
      error: err
    });
  } else if (~accept.indexOf('json')) {
    res.setHeader('Content-Type', 'application/json');
    res.json({
      error: err.message
    })
  } else {
    res.send(err.message);
  }
});

module.exports = app;
