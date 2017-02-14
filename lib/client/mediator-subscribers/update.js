var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var _ = require('lodash');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for updating a workorder.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function updateWorkorderSubscriber(mediator) {

  var updateWorkorderTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.UPDATE
  });


  /**
   *
   * Handling the update of a workorder
   *
   * @param {object} parameters
   * @param {object} parameters.workorderToUpdate   - The workorder item to update
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleUpdateTopic(parameters) {
    parameters = parameters || {};
    var workorderUpdateErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.UPDATE,
      topicUid: parameters.topicUid
    });

    var workorderUpdateDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.UPDATE,
      topicUid: parameters.topicUid
    });

    var workorderToUpdate = parameters.workorderToUpdate;

    //If no workorder is passed, can't update one. Also require the ID of the workorde to update it.
    if (!_.isPlainObject(workorderToUpdate) || !workorderToUpdate.id) {
      return mediator.publish(workorderUpdateErrorTopic, new Error("Invalid Data To Update A Workorder."));
    }

    workorderClient(mediator).manager.update(workorderToUpdate)
    .then(function(updatedWorkorder) {
      mediator.publish(workorderUpdateDoneTopic, updatedWorkorder);
    }).catch(function(error) {
      mediator.publish(workorderUpdateErrorTopic, error);
    });
  }

  return mediator.subscribe(updateWorkorderTopic, handleUpdateTopic);
};