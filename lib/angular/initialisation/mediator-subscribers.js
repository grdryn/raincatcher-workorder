var CONSTANTS = require('../../constants');

angular.module(CONSTANTS.WORKORDER_MODULE_ID).run(function($state, mediator) {
  mediator.subscribe('wfm:ui:workorder:selected', function(workorder) {
    $state.go(
      'app.workorder.detail',
      { workorderId: workorder.id || workorder._localuid },
      { reload: false }
    );
  });
  mediator.subscribe('wfm:ui:workorder:list', function() {
    $state.go('app.workorder', null, {reload: true});
  });
});