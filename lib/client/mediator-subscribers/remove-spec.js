var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var expect = chai.expect;

describe("Workorder Remove Mediator Topic", function() {

  var mockWorkorder = {
    id: "workorderid",
    name: "This is a mock Work Order"
  };

  var removeTopic = "wfm:workorders:remove";
  var doneRemoveTopic = "done:wfm:workorders:remove:workorderid";
  var errorRemoveTopic = "error:wfm:workorders:remove";

  var syncRemoveTopic = "wfm:sync:remove:workorders";
  var doneSyncRemoveTopic = "done:wfm:sync:remove:workorders:workorderid";
  var errorSyncRemoveTopic = "error:wfm:sync:remove:workorders:workorderid";

  beforeEach(function() {
    this.subscribers = {};
    this.subscribers[removeTopic] = require('./remove')(mediator);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });
  });

  it('should use the sync topics to remove a workorder', function() {
    this.subscribers[syncRemoveTopic] = mediator.subscribe(syncRemoveTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');
      expect(parameters.topicUid).to.equal(mockWorkorder.id);

      mediator.publish(doneSyncRemoveTopic, mockWorkorder);
    });

    var donePromise = mediator.promise(doneRemoveTopic);

    mediator.publish(removeTopic, {id: mockWorkorder.id, topicUid: mockWorkorder.id});

    return donePromise;
  });

  it('should publish an error if there is no ID to remove', function() {
    var errorPromise = mediator.promise(errorRemoveTopic);

    mediator.publish(removeTopic);

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Expected An ID");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncRemoveTopic] = mediator.subscribe(syncRemoveTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');
      expect(parameters.topicUid).to.equal(mockWorkorder.id);

      mediator.publish(errorSyncRemoveTopic, expectedError);
    });

    var errorPromise = mediator.promise(errorRemoveTopic + ":" + mockWorkorder.id);

    mediator.publish(removeTopic, {id: mockWorkorder.id, topicUid: mockWorkorder.id});

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});