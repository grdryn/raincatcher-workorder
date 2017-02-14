var _ = require('lodash');
var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');


/**
 * Initialising a subscriber for creating a workorder.
 *
 * @param {object} workorderEntityTopics
 *
 */
module.exports = function createWorkorderSubscriber(workorderEntityTopics) {

  /**
   *
   * Handling the creation of a workorder
   *
   * @param {object} parameters
   * @param {object} parameters.workorderToCreate   - The workorder item to create
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleCreateWorkorderTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var workorderCreateErrorTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workorderToCreate = parameters.workorderToCreate;

    //If no workorder is passed, can't create one
    if (!_.isPlainObject(workorderToCreate)) {
      return self.mediator.publish(workorderCreateErrorTopic, new Error("Invalid Data To Create A Workorder."));
    }

    workorderClient(self.mediator).manager.create(workorderToCreate)
    .then(function(createdWorkorder) {
      self.mediator.publish(workorderEntityTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.DONE_PREFIX, parameters.topicUid), createdWorkorder);
    }).catch(function(error) {
      self.mediator.publish(workorderCreateErrorTopic, error);
    });
  };
};