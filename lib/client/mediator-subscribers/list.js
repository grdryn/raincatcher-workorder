var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for Listing workorders.
 *
 * @param {object} workorderEntityTopics
 *
 */
module.exports = function listWorkorderSubscriber(workorderEntityTopics) {

  /**
   *
   * Handling the listing of workorders
   *
   * @param {object} parameters
   * @param {string/number} parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleListWorkordersTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var workorderListErrorTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workorderListDoneTopic = workorderEntityTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    workorderClient(self.mediator).manager.list()
    .then(function(arrayOfWorkorders) {
      self.mediator.publish(workorderListDoneTopic, arrayOfWorkorders);
    }).catch(function(error) {
      self.mediator.publish(workorderListErrorTopic, error);
    });
  };
};