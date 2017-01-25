'use strict';

var sync = require('fh-wfm-sync/lib/server'),
  config = require('./config'),
  shortid = require('shortid');

/**
 * Function to generate topic used by the mediator to request, subscribe and publish to.
 *
 * @param {string} topicPrefix Defines the topic name.
 * @param {string} action Defines which CRUDL action is to be used.
 * @param {string} prefix Prefix used to add to the start of the topic to determine if request was done.
 * @param {string} uid Unique identifier to identify unique topics.
 * @returns {string} topic Generated topic to be used by the mediator
 */
function generateTopic(topicPrefix, action, prefix, uid) {
  var topic = "";

  if (prefix) {
    topic = topic.concat(prefix, ':');
  }
  topic = topic.concat(topicPrefix, config.datasetId, ':', action);
  if (uid) {
    topic = topic.concat(':', uid);
  }

  return topic;
}

module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'create'), function(workorderToCreate, mediatorTopicIdentifier) {
    // Add an id field required by the new simple store module to the workorder object that will be created
    workorderToCreate.id = shortid.generate();

    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'create'), workorderToCreate, {uid: workorderToCreate.id})
      .then(function(createdWorkorder) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'create', 'done', mediatorTopicIdentifier), createdWorkorder);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'list'), function() {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'list'))
      .then(function(listOfWorkorder) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'list', 'done'), listOfWorkorder);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'update'), function(workorderToUpdate) {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'update'), workorderToUpdate, {uid: workorderToUpdate.id})
      .then(function(updatedWorkorder) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'update', 'done', updatedWorkorder.id), updatedWorkorder);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'read'), function(uid) {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'read'), uid)
      .then(function(workorder) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'read', 'done', uid), workorder);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'delete'), function(uid) {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'delete'), uid)
      .then(function(workorder) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'delete', 'done', uid), workorder);
      });
  });
};
