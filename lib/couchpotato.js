var request = require('request');
var URI = require('URIjs');
var Promise = require('bluebird');
var config = require('../config');
var _ = require('lodash');
var path = require('path');

var makeUrl = function(method) {
  var url = new URI(config.COUCHPOTATO_URL);
  url.segment(url.segment().concat([
    'api',
    config.COUCHPOTATO_API_KEY,
    method
  ]));
  return url.toString();
}

var makeOpts = function() {
  var opts = {
    method: 'GET',
    strictSSL: false,
    auth: {
      user: config.COUCHPOTATO_USER,
      pass: config.COUCHPOTATO_PASSWORD,
      sendImmediately: false
    },
    json: true
  };

  return opts;
}

var makeRequest = function(uri, data) {
  var url = makeUrl(uri);
  var opts = makeOpts();

  return new Promise(function(resolve, reject) {
    request(url, opts, function(err, response, body) {
      if (err) return reject(err);
      return resolve(body);
    })
  })
}

module.exports.getMovies = function() {
  return makeRequest('media.list', {})
    .then(function(data) {
      return _.map(data.movies, function(movie) {
        return {
          tmdb_id: movie.info.tmdb_id,
          status: movie.status,
          title: movie.title,
          poster_path: "/" + path.basename(_.first(movie.info.images.poster_original))
        }
      })
    })
}

module.exports.requestMovie = function(imdb_id) {
  return makeRequest('movie.add', {
    identifier: imdb_id
  }).then(function(data) {
    return data.success;
  })
}