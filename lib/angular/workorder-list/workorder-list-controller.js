var CONSTANTS = require('../../constants');

/**
 *
 * Controller for listing Workorders
 *
 * @param {object} $scope
 * @param {Mediator} mediator
 * @param {WorkorderMediatorService} workorderMediatorService
 * @param $q
 * @constructor
 */
function WorkorderListController($scope, mediator, workorderMediatorService, $q) {
  var self = this;
  var _workorders = [];

  self.workorders = [];
  self.resultMap = {};

  $q.all([workorderMediatorService.listWorkorders(), workorderMediatorService.resultMap()]).then(function(results) {
    console.log("Results", results);
    self.workorders = results[0];
    _workorders = results[0];
    self.resultMap = results[1];
  });

  self.selectWorkorder = function(event, workorder) {
    mediator.publish('wfm:ui:workorder:selected', workorder);
    event.preventDefault();
    event.stopPropagation();
  };
  self.isWorkorderShown = function(workorder) {
    return self.shownWorkorder === workorder;
  };

  self.applyFilter = function(term) {
    term = term.toLowerCase();
    self.workorders = _workorders.filter(function(workorder) {
      return String(workorder.id).indexOf(term) !== -1
        || String(workorder.title).toLowerCase().indexOf(term) !== -1;
    });
  };
}

angular.module(CONSTANTS.WORKORDER_DIRECTIVE).controller('WorkorderListController', ['$scope', 'mediator', 'workorderMediatorService', '$q', WorkorderListController]);