var request = require('request');
var Promise = require('bluebird');
var config = require('../config');
var _ = require('lodash');

var makeRequest = function(uri, data) {

  var opts = {
    url: "http://api.themoviedb.org/3" + uri,
    method: 'GET',
    json: true
  }

  opts.qs = _.defaults(data || {}, {
    api_key: config.TMDB_API_KEY
  });

  return new Promise(function(resolve, reject) {
    request(opts, function(err, response, body) {
      if (err) return reject(err);
      return resolve(body);
    })
  })

}

var find = module.exports.find = function(id, type) {

  return makeRequest('/find/' + id, {
    external_source: type
  })
  .then(function(data) {
    if (type === 'tvdb_id') {
      return _.first(data.tv_results);
    }
    return {}
  })

}

module.exports.getShow = function(id) {

  return find(id, 'tvdb_id')

}