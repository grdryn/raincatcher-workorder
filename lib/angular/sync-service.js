'use strict';

var config = require('../config')
  , _ = require('lodash');

module.exports = 'wfm.workorder.sync';

var workorderClient = require('../client/workorder-client');
var workorderMediatorSubscribers = require('../client/mediator-subscribers');

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

      workorderMediatorSubscribers.init(mediator);
      console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
      return workorderSync.manager;
    }
  };
  workorderSync.removeManager = function() {
    if (workorderSync.manager) {
      return workorderSync.manager.safeStop()
      .then(function() {

        //Removing any workorder subscribers
        workorderMediatorSubscribers.tearDown();
        delete workorderSync.manager;
      });
    }
  };
  return workorderSync;
});
