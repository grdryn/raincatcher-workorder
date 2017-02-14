var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for reading workorders.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function readWorkorderSubscriber(mediator) {

  var readWorkorderTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.READ
  });


  /**
   *
   * Handling the reading of a single workorder
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workorder to read.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleReadWorkordersTopic(parameters) {
    parameters = parameters || {};

    var workorderReadErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.READ,
      topicUid: parameters.topicUid
    });

    var workorderReadDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.READ,
      topicUid: parameters.topicUid
    });

    //If there is no ID, then we can't read the workorder.
    if (!parameters.id) {
      return mediator.publish(workorderReadErrorTopic, new Error("Expected An ID When Reading A Workorder"));
    }

    workorderClient(mediator).manager.read(parameters.id)
    .then(function(workorder) {
      mediator.publish(workorderReadDoneTopic, workorder);
    }).catch(function(error) {
      mediator.publish(workorderReadErrorTopic, error);
    });
  }

  return mediator.subscribe(readWorkorderTopic, handleReadWorkordersTopic);
};