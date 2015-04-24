var mongoose = require('../lib/mongoose');
var config = require('../config');

var Movie = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tmdb_id: {
    type: Number
  },
  poster_path: {
    type: String
  }
});

Movie.method('toJSON', function() {
  return this.toObject({virtuals: true});
});

Movie.virtual('poster_url').get(function() {
  return config.TMDB_POSTER_URL + this.poster_path;
});


module.exports = mongoose.model('Movie', Movie);