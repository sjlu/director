var kue = require('kue');
var redis = require('redis');
var URI = require('URIjs');
var config = require('../config');

if (config.REDISCLOUD_URL) {
  var redisParts = URI(config.REDISCLOUD_URL);
  var hostname = redisParts.hostname();
  var port = redisParts.port();
  var password = redisParts.password();
}

var q = kue.createQueue({
  redis: {
    createClientFactory: function() {
      if (config.REDISCLOUD_URL) {
        return redis.createClient(port, hostname, {
          auth_pass: password
        });
      } else {
        return redis.createClient();
      }
    }
  }
});

module.exports = q;