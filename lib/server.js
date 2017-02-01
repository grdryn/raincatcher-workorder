'use strict';

var sync = require('fh-wfm-sync/lib/server');
var config = require('./config');
var shortid = require('shortid');

var WorkorderTopics = require('fh-wfm-mediator/lib/topics');

module.exports = function(mediator, app, mbaasApi) {
  //Used for cloud data storage topics
  var workorderCloudDataTopics = new WorkorderTopics(mediator);
  workorderCloudDataTopics.prefix(config.cloudDataTopicPrefix).entity(config.datasetId);

  //Used for cloud topics
  var workorderCloudTopics = new WorkorderTopics(mediator);
  workorderCloudTopics.prefix(config.cloudTopicPrefix).entity(config.datasetId);

  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  /**
   * Subscribers to sync topics which publishes to a data storage topic, subscribed to by a storage module,
   * for CRUDL operations. Publishes the response received from the storage module back to sync
   */
  workorderCloudTopics.on('create', function(workorderToCreate, mediatorTopicIdentifier) {
    // Adds an id field required by the new simple store module to the workorder object that will be created
    workorderToCreate.id = shortid.generate();

    workorderCloudDataTopics.request('create', workorderToCreate, {uid: workorderToCreate.id})
      .then(function(createdworkorder) {
        mediator.publish(workorderCloudTopics.getTopic('create', 'done') + ':' + mediatorTopicIdentifier, createdworkorder);
      });
  });

  workorderCloudTopics.on('list', function() {
    return workorderCloudDataTopics.request('list');
  });

  workorderCloudTopics.on('update', function(workorderToUpdate) {
    return workorderCloudDataTopics.request('update', workorderToUpdate, {uid: workorderToUpdate.id});
  });

  workorderCloudTopics.on('read', function(uid) {
    return workorderCloudDataTopics.request('read', uid);
  });

  workorderCloudTopics.on('delete', function(uid) {
    return workorderCloudDataTopics.request('delete', uid);
  });
};