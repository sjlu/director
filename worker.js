var kue = require('kue');
var jobs = require('./lib/kue');
var config = require('./config');
var winston = require('./lib/winston');
var Promise = require('bluebird');
var domain = require('domain');
var _ = require('lodash');

kue.app.listen(3000);
jobs.watchStuckJobs(Math.ceil(Math.random()*60000)+240000)

var timeout = 90000;

jobs.on('job complete', function(id) {
  kue.Job.get(id, function(err, job) {
    if (job) {
      job.remove(function(err) {});
    }
  });
});

function registerJob(processName, processFn){
  jobs.process(processName, 4, function(job, done) {
    Promise
      .resolve()
      .bind({})
      .then(function() {
        var ttl = Date.now() - job.created_at;
        winston.info('[worker] job started', {
          id: job.id,
          type: job.type,
          ttl: ttl + 'ms'
        })
      })
      .then(function() {
        this.start = Date.now();
        if (processFn.length !== 1) {
          return new Promise(function(resolve, reject) {
            var d = domain.create();
            d.on('error', function(err) {
              return reject(err);
            });
            d.run(function() {
              processFn(job, function(err) {
                if (err) return reject(err);
                return resolve();
              })
            })
          });
        } else {
          return processFn(job);
        }
      })
      .timeout(timeout)
      .then(function() {
        var duration = Date.now() - this.start;
        winston.info('[worker] job finished', {
          type: job.type,
          duration: duration + 'ms'
        })
      })
      .catch(function(err) {
        winston.error('[worker] job failed', {
          type: job.type,
          data: job.data,
          error: err.stack
        })
        return;
      })
      .finally(function() {
        done();
      })
  })
}

_.each(require('./jobs'), function(fn, name) {
  registerJob(name, fn);
})

process.on('message', function(message) {
  if (message === 'shutdown') {
    jobs.shutdown(function(err) {
      winston.info('Kue is shut down ', err || '');
      process.exit(0);
    }, timeout * 2);
  }
});