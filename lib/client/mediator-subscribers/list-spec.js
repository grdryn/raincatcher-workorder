var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var expect = chai.expect;

describe("Workorder List Mediator Topic", function() {

  var mockWorkorder = {
    id: "workorderid",
    name: "This is a mock Work Order"
  };

  var workorders = [_.clone(mockWorkorder), _.clone(mockWorkorder)];

  var listTopic = "wfm:workorders:list";
  var doneListTopic = "done:wfm:workorders:list";
  var errorListTopic = "error:wfm:workorders:list";

  var syncListTopic = "wfm:sync:list:workorders";
  var doneSyncListTopic = "done:wfm:sync:list:workorders";
  var errorSyncListTopic = "error:wfm:sync:list:workorders";

  beforeEach(function() {
    this.subscribers = {};
    this.subscribers[listTopic] = require('./list')(mediator);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });
  });

  it('should use the sync topics to list workorders', function() {
    this.subscribers[syncListTopic] = mediator.subscribe(syncListTopic, function() {
      mediator.publish(doneSyncListTopic, workorders);
    });

    var donePromise = mediator.promise(doneListTopic);

    mediator.publish(listTopic);

    return donePromise.then(function(arrayOfWorkorders) {
      expect(arrayOfWorkorders).to.deep.equal(workorders);
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncListTopic] = mediator.subscribe(syncListTopic, function() {
      mediator.publish(errorSyncListTopic, expectedError);
    });

    var errorPromise = mediator.promise(errorListTopic);

    mediator.publish(listTopic);

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});