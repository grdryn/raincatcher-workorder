var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for removing workorders.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function removeWorkorderSubscriber(mediator) {

  var removeWorkorderTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.REMOVE
  });


  /**
   *
   * Handling the removal of a single workorder
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workorder to remove.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleRemoveWorkorder(parameters) {
    parameters = parameters || {};
    var workorderRemoveErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.REMOVE,
      topicUid: parameters.topicUid
    });

    var workorderRemoveDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.REMOVE,
      topicUid: parameters.topicUid
    });

    //If there is no ID, then we can't read the workorder.
    if (!parameters.id) {
      return mediator.publish(workorderRemoveErrorTopic, new Error("Expected An ID When Removing A Workorder"));
    }

    workorderClient(mediator).manager.delete({
      id: parameters.id
    })
    .then(function() {
      mediator.publish(workorderRemoveDoneTopic);
    }).catch(function(error) {
      mediator.publish(workorderRemoveErrorTopic, error);
    });
  }

  return mediator.subscribe(removeWorkorderTopic, handleRemoveWorkorder);
};