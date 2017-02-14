var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var expect = chai.expect;

describe("Workorder Update Mediator Topic", function() {

  var mockWorkorderToUpdate = {
    id: "workorderidtoupdate",
    name: "This is a mock Work Order"
  };

  var expectedUpdatedWorkorder =  _.defaults({name: "Updated Workorder"}, mockWorkorderToUpdate);

  var topicUid = 'testtopicuid1';

  var updateTopic = "wfm:workorders:update";
  var doneUpdateTopic = "done:wfm:workorders:update:testtopicuid1";
  var errorUpdateTopic = "error:wfm:workorders:update:testtopicuid1";

  var syncUpdateTopic = "wfm:sync:update:workorders";
  var doneSyncUpdateTopic = "done:wfm:sync:update:workorders";
  var errorSyncUpdateTopic = "error:wfm:sync:update:workorders";

  beforeEach(function() {
    this.subscribers = {};
    this.subscribers[updateTopic] = require('./update')(mediator);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });
  });

  it('should use the sync topics to update a workorder', function() {
    this.subscribers[syncUpdateTopic] = mediator.subscribe(syncUpdateTopic, function(parameters) {
      expect(parameters.itemToUpdate).to.deep.equal(mockWorkorderToUpdate);
      expect(parameters.topicUid).to.be.a('string');

      mediator.publish(doneSyncUpdateTopic + ":" + parameters.topicUid, expectedUpdatedWorkorder);
    });

    var donePromise = mediator.promise(doneUpdateTopic);

    mediator.publish(updateTopic, {
      workorderToUpdate: mockWorkorderToUpdate,
      topicUid: topicUid
    });

    return donePromise.then(function(updatedWorkorder) {
      expect(updatedWorkorder).to.deep.equal(expectedUpdatedWorkorder);
    });
  });

  it('should publish an error if there is no object to update', function() {
    var errorPromise = mediator.promise(errorUpdateTopic);

    mediator.publish(updateTopic, {
      topicUid: topicUid
    });

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should publish an error if there is no workorder id', function() {
    var errorPromise = mediator.promise(errorUpdateTopic);

    mediator.publish(updateTopic, {
      workorderToUpdate: {},
      topicUid: topicUid
    });

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");

    this.subscribers[syncUpdateTopic] = mediator.subscribe(syncUpdateTopic, function(parameters) {
      expect(parameters.itemToUpdate).to.deep.equal(mockWorkorderToUpdate);
      expect(parameters.topicUid).to.be.a('string');

      mediator.publish(errorSyncUpdateTopic + ":" + parameters.topicUid, expectedError);
    });

    var errorPromise = mediator.promise(errorUpdateTopic);

    mediator.publish(updateTopic, {
      workorderToUpdate: mockWorkorderToUpdate,
      topicUid: topicUid
    });

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});