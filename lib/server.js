'use strict';

var sync = require('fh-wfm-sync/lib/server'),
  config = require('./config');


module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  // Add an id field required by the new simple store module to the workorder object that will be created
  mediator.subscribe('wfm:cloud:workorders:create', function(workorderToCreate, ts) {
    workorderToCreate.id = ts;
    mediator.publish('wfm:cloud:data:workorders:create', workorderToCreate);
  });

};
