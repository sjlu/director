var express = require('express');
var router = express.Router();
var sickbeard = require('../../lib/sickbeard');
var tmdb = require('../../lib/tmdb');
var Promise = require('bluebird');
var _ = require('lodash');

router.get('/shows', function(req, res, next) {

  Promise.resolve()
    .bind({})
    .then(function() {
      return sickbeard.getShows();
    })
    .then(function(shows) {
      res.json(shows);
    })
    .catch(next)

})

router.get('/shows/:tvdb_id', function(req, res, next) {

  tmdb.find(req.params.tvdb_id, 'tvdb_id')
    .then(function(info) {
      res.json(info);
    })
    .catch(next);

})

router.get('/shows/:tvdb_id/episodes', function(req, res, next) {

  sickbeard.getEpisodes(req.params.tvdb_id)
    .then(function(episodes) {
      res.json(episodes)
    })
    .catch(next);

})

module.exports = router;