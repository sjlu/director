var config = require('../config');
var Promise = require('bluebird');
var request = require('request');
var _ = require('lodash');

var makeRequest = function(method, uri, data) {

  var opts = {
    url: config.SICKBEARD_URL + '/api/' + config.SICKBEARD_API_KEY + uri,
    method: method || 'GET',
    auth: {
      user: config.SICKBEARD_USER,
      pass: config.SICKBEARD_PASSWORD
    },
    json: true,
    strictSSL: false
  }

  if (method === 'GET') {
    opts.qs = data;
  } else {
    opts.formData = data;
  }

  return new Promise(function(resolve, reject) {
    request(opts, function(err, response, body) {
      if (err) return reject(err);
      return resolve(body.data);
    })
  })

}

module.exports.getShows = function() {

  return makeRequest('GET', '/shows', {})
    .then(function(data) {
      return _.map(data, function(show) {
        return {
          show_name: show.show_name,
          tvdb_id: show.tvdbid,
          next: show.next_ep_airdate || null
        }
      })
    })

}

module.exports.getEpisodes = function(tvdb_id) {

  return makeRequest('GET', '/', {
    cmd: 'show.seasons',
    tvdbid: tvdb_id
  })

}