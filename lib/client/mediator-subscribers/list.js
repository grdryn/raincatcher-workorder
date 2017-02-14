var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var workorderClient = require('../workorder-client');

/**
 * Initialsing a subscriber for Listing workorders.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function listWorkorderSubscriber(mediator) {

  var listWorkordersTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.LIST
  });


  /**
   *
   * Handling the listing of workorders
   *
   * @param {object} parameters
   * @param {string/number} parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleListWorkordersTopic(parameters) {
    console.log("handleListWorkordersTopic", parameters);
    parameters = parameters || {};
    var workorderListErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.LIST,
      topicUid: parameters.topicUid
    });

    var workorderListDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.LIST,
      topicUid: parameters.topicUid
    });

    workorderClient(mediator).manager.list()
    .then(function(arrayOfWorkorders) {
      mediator.publish(workorderListDoneTopic, arrayOfWorkorders);
    }).catch(function(error) {
      mediator.publish(workorderListErrorTopic, error);
    });
  }

  return mediator.subscribe(listWorkordersTopic, handleListWorkordersTopic);
};