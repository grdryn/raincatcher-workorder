'use strict';

var sync = require('fh-wfm-sync/lib/server'),
  config = require('./config'),
  shortid = require('shortid');


module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  mediator.subscribe(config.topicPrefix + config.datasetId + ':create', function(workorderToCreate, mediatorTopicIdentifier) {
    // Add an id field required by the new simple store module to the workorder object that will be created
    workorderToCreate.id = shortid.generate();

    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':create', workorderToCreate, {uid: workorderToCreate.id})
      .then(function(createdWorkorder) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':create:' + mediatorTopicIdentifier, createdWorkorder);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':list', function() {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':list')
      .then(function(listOfWorkorder) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':list', listOfWorkorder);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':update', function(workorderToUpdate) {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':update', workorderToUpdate, {uid: workorderToUpdate.id})
      .then(function(updatedWorkorder) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':update:' + updatedWorkorder.id, updatedWorkorder);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':read', function(uid) {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':read', uid)
      .then(function(workorder) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':read:' + uid, workorder);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':delete', function(uid) {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':delete', uid)
      .then(function(workorder) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':delete:' + uid, workorder);
      });
  });
};
