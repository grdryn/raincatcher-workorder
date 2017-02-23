'use strict';
var CONSTANTS = require('../constants');

angular.module(CONSTANTS.WORKORDER_DIRECTIVE, ['wfm.core.mediator']);
module.exports = CONSTANTS.WORKORDER_DIRECTIVE;

require('../../dist');
require('./workorder-detail');
require('./workorder-form');
require('./workorder-list');
require('./workorder-status');
require('./workorder-submission-result');
require('./workorder-display');