var CONSTANTS = require('../../constants');

/**
 *
 * Controller for displaying workorder details to the user.
 * @param $scope
 * @param mediator
 * @constructor
 */
function WorkorderDetailController($scope, mediator) {
  var self = this;
  self.selectWorkorder = function(event, workorder) {
    if (workorder.id) {
      mediator.publish('wfm:workorder:selected', workorder);
    } else {
      mediator.publish('wfm:workorder:list');
    }

    event.preventDefault();
    event.stopPropagation();
  };
}


angular.module(CONSTANTS.WORKORDER_DIRECTIVE).controller('WorkorderDetailController', ["$scope", "mediator", WorkorderDetailController]);