var express = require('express');
var router = express.Router();
var couchpotato = require('../../lib/couchpotato');
var models = require('../../models');
var Promise = require('bluebird');

var getMovie = function(couchpotatoMovie) {

  return Promise.resolve()
    .then(function() {
      return models.Movie.findOne({
        tmdb_id: couchpotatoMovie.tmdb_id
      }).exec()
    })
    .then(function(movie) {

      if (!movie) {
        return models.Movie.create({
          name: couchpotatoMovie.title,
          tmdb_id: couchpotatoMovie.tmdb_id,
          poster_path: couchpotatoMovie.poster_path
        })
      }

      return movie;
    })

}

router.get('/', function(req, res, next) {

  couchpotato.getMovies()
    .map(function(movie) {
      return getMovie(movie);
    })
    .then(function(movies) {
      res.json(movies);
    })
    .catch(next);

})

module.exports = router;