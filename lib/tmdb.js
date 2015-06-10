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

module.exports.search = function(q) {

  return makeRequest('/search/multi', {
    query: q
  })
  .then(function(r) {
    return _.chain(r.results).map(function(result) {
      if (result.media_type !== 'movie' && result.media_type !== 'tv') {
        return;
      }

      var r = {
        id: result.id,
        name: result.title || result.name,
        type: result.media_type,
        poster_path: result.poster_path,
        poster_url: config.TMDB_POSTER_URL + result.poster_path,
        date: result.release_date || result.first_air_date
      }

      if (!r.poster_path || !r.date) {
        return;
      }

      return r;
    }).compact().value();
  })

}

module.exports.getMovie = function(id) {

  return makeRequest('/movie/' + id)

}