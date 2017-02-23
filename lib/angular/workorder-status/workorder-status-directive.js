var CONSTANTS = require('../../constants');

var getStatusIcon = function(status) {
  var statusIcon;
  switch (status) {
  case 'In Progress':
    statusIcon = 'autorenew';
    break;
  case 'Complete':
    statusIcon = 'assignment_turned_in';
    break;
  case 'Aborted':
    statusIcon = 'assignment_late';
    break;
  case 'On Hold':
    statusIcon = 'pause';
    break;
  case 'Unassigned':
    statusIcon = 'assignment_ind';
    break;
  case 'New':
    statusIcon = 'new_releases';
    break;
  default:
    statusIcon = 'radio_button_unchecked';
  }
  return statusIcon;
};

angular.module(CONSTANTS.WORKORDER_DIRECTIVE).directive('workorderStatus', function() {
  return {
    restrict: 'E'
    , template: '<md-icon md-font-set="material-icons">{{statusIcon}}<md-tooltip>{{status}}</md-tooltip></md-icon>'
    , scope: {
      status : '=status'
    }
    , controller: function($scope) {
      $scope.statusIcon = getStatusIcon($scope.status);
    }
    , controllerAs: 'ctrl'
  };
});