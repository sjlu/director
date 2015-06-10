var express = require('express');
var router = express.Router();
var couchpotato = require('../../lib/couchpotato');
var Promise = require('bluebird');
var tmdb = require('../../lib/tmdb');

router.get('/', function(req, res, next) {

  couchpotato.getMovies()
    .then(function(movies) {
      res.json(movies);
    })
    .catch(next);

})

router.post('/', function(req, res, next) {

  couchpotato.requestMovie(req.body.tmdb_id)
    .then(function() {
      res.send(200)
    })

});

router.get('/search', function(req, res, next) {

  tmdb.search(req.query.q)
    .then(function(r) {
      res.json(r);
    })
    .catch(next);

})

module.exports = router;