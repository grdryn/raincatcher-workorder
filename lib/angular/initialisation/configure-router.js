var CONSTANTS = require('../../constants');


//TODO: Move Somewhere Else..
function configureState($stateProvider, WORKORDER_CONFIG) {

  console.log("WORKORDER_CONFIG", WORKORDER_CONFIG);

  //TODO: May not want all of these states...This can be configured.
  $stateProvider.state('app.workorder', {
    url: '/workorders/list',
    views: {
      column2: {
        //TODO: The column2 bit should be configurable.
        template: '<workorder-list></workorder-list>'
      },
      content: {
        templateProvider: function($templateCache) {
          return $templateCache.get('wfm-template/empty.tpl.html');
        }
      }
    }
  })
    .state('app.workorder.detail', {
      url: '/workorder/:workorderId',
      views: {
        //TODO This should probably be configurable
        'content@app': {
          template: "<workorder-display></workorder-display>"
        }
      }
    })
    .state('app.workorder.edit', {
      url: '/workorder/:workorderId/edit',
      views: {
        //TODO: The content@app bit should be configurable.
        'content@app': {
          template: "<workorder-form></workorder-form>"
        }
      }
    })
    .state('app.workorder.new', {
      url: '/new',
      views: {
        'content@app': {
          template: "<workorder-form></workorder-form>"
        }
      }
    });
}

angular.module(CONSTANTS.WORKORDER_MODULE_ID).config(['$stateProvider', 'WORKORDER_CONFIG', configureState]);