'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

module.exports = 'wfm.workorder.sync';

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


  // TODO: this should be removed in favour of the implementation on raincatcher-sync
  wrappedManager.subscribeToRemoteSyncErrors = function(mediator) {
    var self = this;
    this.remoteErrorStream = this.stream.filter(function(notification) {
      return notification.code === "remote_update_failed";
    });

    this.remoteErrorStream.forEach(function(notification) {
      mediator.publish("wfm:sync:" + self.datasetId + ":remote:failed", notification);
    });
  };

  wrappedManager.subscribeToRemoteSyncSuccess = function(mediator) {
    var self = this;
    self.remoteAppliedStream = self.stream.filter(function(updateFailedNotification) {
      return updateFailedNotification.code === "remote_update_applied";
    });
    self.remoteAppliedStream.forEach(function(updateAppliedNotification) {
      mediator.publish("wfm:sync:" + self.datasetId + ":remote:applied", updateAppliedNotification);
    });
  };

  wrappedManager.publishRemoteSyncTopics = function(mediator) {
    this.subscribeToRemoteSyncErrors(mediator);
    this.subscribeToRemoteSyncErrors(mediator);
  };

  return wrappedManager;
}

angular.module('wfm.workorder.sync', [require('fh-wfm-sync')])
.factory('workorderSync', function($q, $timeout, syncService) {
  syncService.init(config.syncOptions);
  var workorderSync = {};
  workorderSync.createManager = function(queryParams) {
    if (workorderSync.manager) {
      return $q.when(workorderSync.manager);
    } else {
      return workorderSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        workorderSync.manager = wrapManager($q, $timeout, manager);
        console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
        return workorderSync.manager;
      });
    }
  };
  workorderSync.removeManager = function() {
    if (workorderSync.manager) {
      return workorderSync.manager.safeStop()
      .then(function() {
        delete workorderSync.manager;
      });
    }
  };
  return workorderSync;
})
;
