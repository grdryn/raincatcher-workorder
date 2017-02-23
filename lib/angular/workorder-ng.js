'use strict';
var CONSTANTS = require('../constants');


module.exports = function(config) {
  config = config || {};

  console.log("config", config);

  angular.module(CONSTANTS.WORKORDER_MODULE_ID, [
    require('angular-messages'),
    require('angular-ui-router'),
    require('fh-wfm-mediator'),
    require('./mediator-service'),
    require('./directive'),
    require('./sync-service')
  ]).constant("WORKORDER_CONFIG", config);

  require('./initialisation');

  return 'wfm.workorder';
};


