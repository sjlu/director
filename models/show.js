var mongoose = require('../lib/mongoose');
var config = require('../config');

var Show = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tmdb_id: {
    type: Number
  },
  tvdb_id: {
    type: Number,
    required: true
  },
  poster_path: {
    type: String
  }
});

Show.method('toJSON', function() {
  return this.toObject({virtuals: true});
});

Show.virtual('poster_url').get(function() {
  return config.TMDB_POSTER_URL + this.poster_path;
});


module.exports = mongoose.model('Show', Show);