var topicGenerators = require('../../topic-generators');
var _ = require('lodash');
var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for creating a workorder.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function createWorkorderSubscriber(mediator) {

  var createWorkorderTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.CREATE
  });


  /**
   *
   * Handling the creation of a workorder
   *
   * @param {object} parameters
   * @param {object} parameters.workorderToCreate   - The workorder item to create
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleCreateWorkorderTopic(parameters) {
    parameters = parameters || {};
    var workorderCreateErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.CREATE,
      topicUid: parameters.topicUid
    });

    var workorderCreateDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.CREATE,
      topicUid: parameters.topicUid
    });

    var workorderToCreate = parameters.workorderToCreate;

    //If no workorder is passed, can't create one
    if (!_.isPlainObject(workorderToCreate)) {
      return mediator.publish(workorderCreateErrorTopic, new Error("Invalid Data To Create A Workorder."));
    }

    workorderClient(mediator).manager.create(workorderToCreate)
    .then(function(createdWorkorder) {
      mediator.publish(workorderCreateDoneTopic, createdWorkorder);
    }).catch(function(error) {
      mediator.publish(workorderCreateErrorTopic, error);
    });
  }

  return mediator.subscribe(createWorkorderTopic, handleCreateWorkorderTopic);
};