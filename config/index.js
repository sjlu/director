var _ = require('lodash');
var dotenv = require('dotenv');

// load dotenv config vars if available
dotenv.load();

var config = {
  ENV: 'development',
  URL: 'http://localhost:3000',
  SICKBEARD_URL: '',
  SICKBEARD_API_KEY: ''
};
config = _.defaults(process.env, config);

// tell express what environment we're in
process.env.NODE_ENV = config.ENV;

module.exports = config;