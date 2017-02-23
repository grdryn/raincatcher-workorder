var CONSTANTS = require('../../constants');
var shortid = require('shortid');
var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

function WorkorderMediatorService(mediator) {
  this.mediator = mediator;

  this.workordersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKORDER_ENTITY_NAME);
  this.usersTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.USERS_ENTITY_NAME);
  this.workflowsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOWS_ENTITY_NAME);
  this.resultsTopics = new MediatorTopicUtility(mediator).prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.RESULTS_ENTITY_NAME);
}

WorkorderMediatorService.prototype.listWorkorders = function listWorkorders() {
  var workorderListPromise = this.mediator.promise('done:wfm:workorders:list');

  this.mediator.publish('wfm:workorders:list');

  return workorderListPromise.then(function(workorders) {
    console.log("workorders", workorders);
    return workorders;
  });
};

WorkorderMediatorService.prototype.listWorkflows = function listWorkorders() {
  var workflowListPromise = this.mediator.promise('done:wfm:workflows:list');

  this.mediator.publish('wfm:workflows:list');

  return workflowListPromise.then(function(workflows) {
    console.log("workflows", workflows);
    return workflows;
  });
};

WorkorderMediatorService.prototype.readWorkflow = function readWorkflow(workflowId) {
  var workflowReadPromise = this.mediator.promise('done:wfm:workflows:read:' + workflowId);

  this.mediator.publish('wfm:workflows:read', {id: workflowId, topicUid: workflowId});

  return workflowReadPromise.then(function(workflow) {
    console.log("workflow", workflow);
    return workflow;
  });
};

WorkorderMediatorService.prototype.listResults = function listResults() {
  var resultListPromise = this.mediator.promise('done:wfm:results:list');

  this.mediator.publish('wfm:results:list');

  console.log("getting results", this.mediator);

  return resultListPromise.then(function(results) {
    console.log("got results", results);
    return results;
  });
};

WorkorderMediatorService.prototype.readWorkorder = function readWorkorder(workorderId) {
  var workorderReadPromise = this.mediator.promise("done:wfm:workorders:read:" + workorderId);

  this.mediator.publish("wfm:workorders:read", {id: workorderId, topicUid: workorderId});

  return workorderReadPromise;
};

WorkorderMediatorService.prototype.readUser = function readUser(userId) {
  var userReadPromise = this.mediator.promise("done:wfm:users:read:" + userId);

  this.mediator.publish("wfm:users:read", {id: userId, topicUid: userId});

  return userReadPromise;
};

WorkorderMediatorService.prototype.listUsers = function listUsers() {
  var userListPromise = this.mediator.promise("done:wfm:users:list");

  this.mediator.publish("wfm:users:list");

  return userListPromise;
};

WorkorderMediatorService.prototype.createWorkorder = function createWorkorder(workorderToCreate) {
  var topicUid = shortid.generate();

  var workorderCreatePromise = this.mediator.promise("done:wfm:workorders:create:" + topicUid);

  this.mediator.publish("wfm:workorders:create", {
    workorderToCreate: workorderToCreate,
    topicUid: topicUid
  });

  return workorderCreatePromise;
};

WorkorderMediatorService.prototype.updateWorkorder = function updateWorkorder(workorderToUpdate) {
  var workorderUpdatePromise = this.mediator.promise("done:wfm:workorders:update:" + workorderToUpdate.id);

  this.mediator.publish("wfm:workorders:update", {
    workorderToUpdate: workorderToUpdate,
    topicUid: workorderToUpdate.id
  });

  return workorderUpdatePromise;
};

WorkorderMediatorService.prototype.removeWorkorder = function removeWorkorder(workorderToRemove) {
  var workorderUpdatePromise = this.mediator.promise("done:wfm:workorders:remove:" + workorderToRemove.id);

  this.mediator.publish("wfm:workorders:remove", {
    id: workorderToRemove.id,
    topicUid: workorderToRemove.id
  });

  return workorderUpdatePromise;
};

WorkorderMediatorService.prototype.resultMap = function() {
  return this.listResults()
    .then(function(results) {
      console.log('Results', results);
      var map = {};
      results.forEach(function(result) {
        map[result.workorderId] = result;
      });
      return map;
    });
};

angular.module(CONSTANTS.WORKORDER_SERVICE, ['wfm.core.mediator']).service("workorderMediatorService", ['mediator', function(mediator) {
  return new WorkorderMediatorService(mediator);
}]);

module.exports = CONSTANTS.WORKORDER_SERVICE;