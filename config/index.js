var _ = require('lodash');
var dotenv = require('dotenv');

// load dotenv config vars if available
dotenv.load();

var config = {
  ENV: 'development',
  URL: 'http://localhost:3000',
  SICKBEARD_URL: '',
  SICKBEARD_API_KEY: '',
  SICKBEARD_USER: '',
  SICKBEARD_PASSWORD: '',
  COUCHPOTATO_URL: '',
  COUCHPOTATO_API_KEY: '',
  COUCHPOTATO_USER: '',
  COUCHPOTATO_PASSWORD: '',
  TMDB_API_KEY: '0d05f82950e048f5950d3ebbce8463ce',
  MONGOLAB_URI: 'mongodb://localhost/director',
  REDISCLOUD_URL: 'redis://localhost:6379',
  TMDB_POSTER_URL: 'http://image.tmdb.org/t/p/w500'
};
config = _.defaults(process.env, config);

// tell express what environment we're in
process.env.NODE_ENV = config.ENV;

module.exports = config;