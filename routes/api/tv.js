var express = require('express');
var router = express.Router();
var sickbeard = require('../../lib/sickbeard');
var tmdb = require('../../lib/tmdb');
var models = require('../../models');
var Promise = require('bluebird');
var _ = require('lodash');

var getShow = function(sickbeardShow) {


  return models.Show.findOne({
    tvdb_id: sickbeardShow.tvdb_id
  }).exec().then(function(show) {
    if (!show) {
      return models.Show.create({
        tvdb_id: sickbeardShow.tvdb_id,
        name: sickbeardShow.show_name
      })
    }

    return show;
  })
  .then(function(show) {
    if (!show.tmdb_id || !show.poster_path) {
      return tmdb.getShow(show.tvdb_id)
        .then(function(tmdbShow) {
          if (tmdbShow && tmdbShow.id) {
            show.tmdb_id = tmdbShow.id;
            show.poster_path = tmdbShow.poster_path;
          }
          return show.save()
        })
    }

    return show
  })

}

router.get('/shows', function(req, res, next) {

  Promise.resolve()
    .bind({})
    .then(function() {
      return sickbeard.getShows();
    })
    .map(function(sickbeardShow) {
      return getShow(sickbeardShow)
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