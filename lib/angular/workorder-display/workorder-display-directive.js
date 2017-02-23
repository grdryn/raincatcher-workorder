var CONSTANTS = require('../../constants');

angular.module(CONSTANTS.WORKORDER_DIRECTIVE).directive('workorderDisplay', function($templateCache) {
  return {
    restrict: 'E'
    , template: $templateCache.get('wfm-template/workorder-display.tpl.html')
    , controller: 'WorkorderDisplayController'
    , controllerAs: 'ctrl'
  };
});