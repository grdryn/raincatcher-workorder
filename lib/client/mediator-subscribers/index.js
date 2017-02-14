var _ = require('lodash');
var topicHandlers = {
  create: require('./create'),
  update: require('./update'),
  remove: require('./remove'),
  list: require('./list'),
  read: require('./read')
};
var CONSTANTS = require('../../constants');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var workorderSubscribers;

module.exports = {
  /**
   * Initialisation of all the topics that this module is interested in.
   * @param mediator
   * @returns {Topics|exports|module.exports|*}
   */
  init: function(mediator) {

    //If there is already a set of subscribers set up, then don't subscribe again.
    if (workorderSubscribers) {
      return workorderSubscribers;
    }

    workorderSubscribers = new MediatorTopicUtility(mediator);
    workorderSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKORDER_ENTITY_NAME);

    //Setting up subscribers to the workorder topics.
    _.each(CONSTANTS.TOPICS, function(topicName) {
      if (topicHandlers[topicName]) {
        workorderSubscribers.on(topicName, topicHandlers[topicName](workorderSubscribers));
      }
    });

    return workorderSubscribers;
  },
  tearDown: function() {
    if (workorderSubscribers) {
      workorderSubscribers.unsubscribeAll();
    }
  }
};