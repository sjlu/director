var mongoose = require('mongoose');
var config = require('../config');
var winston = require('./winston');

// connect
var connect = function() {
  mongoose.connect(config.MONGOLAB_URI, {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  });
};
connect();

// catch all errs
mongoose.connection.on('error', function(err) {
  winston.error(err);
});

// reconnect if disconnected
var retry = 0;
mongoose.connection.on('disconnected', function() {
  if (retry < 3) {
    connect();
  } else {
    winston.error("mongodb connection failed")
  }
});

module.exports = mongoose;