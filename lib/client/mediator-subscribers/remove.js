var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for removing workorders.
 *
 * @param {object} workorderEntityTopics
 *
 */
module.exports = function removeWorkorderSubscriber(workorderEntityTopics) {


  /**
   *
   * Handling the removal of a single workorder
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workorder to remove.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleRemoveWorkorder(parameters) {
    var self = this;
    parameters = parameters || {};
    var workorderRemoveErrorTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workorderRemoveDoneTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    //If there is no ID, then we can't read the workorder.
    if (!parameters.id) {
      return self.mediator.publish(workorderRemoveErrorTopic, new Error("Expected An ID When Removing A Workorder"));
    }

    workorderClient(self.mediator).manager.delete({
      id: parameters.id
    })
    .then(function() {
      self.mediator.publish(workorderRemoveDoneTopic);
    }).catch(function(error) {
      self.mediator.publish(workorderRemoveErrorTopic, error);
    });
  };
};