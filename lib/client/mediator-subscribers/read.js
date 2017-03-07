var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for reading workorders.
 *
 * @param {object} workorderEntityTopics
 *
 */
module.exports = function readWorkorderSubscriber(workorderEntityTopics) {


  /**
   *
   * Handling the reading of a single workorder
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workorder to read.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleReadWorkordersTopic(parameters) {
    var self = this;
    parameters = parameters || {};

    var workorderReadErrorTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workorderReadDoneTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    //If there is no ID, then we can't read the workorder.
    if (!parameters.id) {
      return self.mediator.publish(workorderReadErrorTopic, new Error("Expected An ID When Reading A Workorder"));
    }

    workorderClient(self.mediator).manager.read(parameters.id)
    .then(function(workorder) {
      self.mediator.publish(workorderReadDoneTopic, workorder);
    }).catch(function(error) {
      self.mediator.publish(workorderReadErrorTopic, error);
    });
  };

};