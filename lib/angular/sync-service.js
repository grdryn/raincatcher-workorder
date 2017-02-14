'use strict';

var config = require('../config')
  , _ = require('lodash');

module.exports = 'wfm.workorder.sync';

var workorderClient = require('../client/workorder-client');
var workorderMediatorSubscribers = require('../client/mediator-subscribers');
var topicGenerators = require('../topic-generators');
var CONSTANTS = require('../constants');
var subscribers = {};

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var workorder = {
        type: 'Job Order'
      , status: 'New'
      };
      deferred.resolve(workorder);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.workorder.sync', [])
.factory('workorderSync', function($q, $timeout, mediator) {
  var workorderSync = {};
  workorderSync.createManager = function(queryParams) {
    if (workorderSync.manager) {
      return $q.when(workorderSync.manager);
    } else {
      workorderSync.manager = wrapManager($q, $timeout, workorderClient(mediator));

      //Setting up subscribers to the workorder topics.
      _.each(CONSTANTS.TOPICS, function(topicName) {
        if (!workorderMediatorSubscribers[topicName]) {
          return;
        }
        var topic = topicGenerators.createTopic({topicName: topicName});

        subscribers[topic] = workorderMediatorSubscribers[topicName](mediator);
      });

      console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
      return workorderSync.manager;
    }
  };
  workorderSync.removeManager = function() {
    if (workorderSync.manager) {
      return workorderSync.manager.safeStop()
      .then(function() {

        //Removing any workorder subscribers
        _.each(subscribers, function(subscriber, topic) {
          mediator.remove(topic, subscriber.id);
        });
        delete workorderSync.manager;
      });
    }
  };
  return workorderSync;
});
