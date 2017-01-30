'use strict';

var config = require('../config');
var _ = require('lodash');

module.exports = 'wfm.workorder.sync';

function wrapManager($q, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    return $q({
      type: 'Job Order',
      status: 'New'
    });
  };

  return wrappedManager;
}

angular.module('wfm.workorder.sync', [require('fh-wfm-sync')])
.factory('workorderSync', function($q, syncService) {
  syncService.init(config.syncOptions);
  var workorderSync = {};
  workorderSync.createManager = function(queryParams) {
    if (workorderSync.manager) {
      return $q.when(workorderSync.manager);
    } else {
      return workorderSync.managerPromise = syncService.manage(config.datasetId, null, queryParams)
      .then(function(manager) {
        workorderSync.manager = wrapManager($q, manager);
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
});
