var express = require('express');
var router = express.Router();
var couchpotato = require('../../lib/couchpotato');

router.get('/', function(req, res, next) {

  couchpotato.getMovies()
    .then(function(movies) {
      res.json(movies);
    })
    .catch(next);

})

module.exports = router;