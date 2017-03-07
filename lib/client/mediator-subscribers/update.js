var CONSTANTS = require('../../constants');
var _ = require('lodash');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for updating a workorder.
 *
 * @param {object} workorderEntityTopics
 *
 */
module.exports = function updateWorkorderSubscriber(workorderEntityTopics) {

  /**
   *
   * Handling the update of a workorder
   *
   * @param {object} parameters
   * @param {object} parameters.workorderToUpdate   - The workorder item to update
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleUpdateTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var workorderUpdateErrorTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.UPDATE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workorderUpdateDoneTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.UPDATE, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    var workorderToUpdate = parameters.workorderToUpdate;

    //If no workorder is passed, can't update one. Also require the ID of the workorde to update it.
    if (!_.isPlainObject(workorderToUpdate) || !workorderToUpdate.id) {
      return self.mediator.publish(workorderUpdateErrorTopic, new Error("Invalid Data To Update A Workorder."));
    }

    workorderClient(self.mediator).manager.update(workorderToUpdate)
    .then(function(updatedWorkorder) {
      self.mediator.publish(workorderUpdateDoneTopic, updatedWorkorder);
    }).catch(function(error) {
      self.mediator.publish(workorderUpdateErrorTopic, error);
    });
  };
};