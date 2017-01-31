var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');
var express = require('express');
var app = express();
var mockMbaasApi = {};
var mockSync = {
  init: sinon.spy()
};

var mediator = require('fh-wfm-mediator/lib/mediator.js');

/**
 * Set of unit tests for the sync topic subscribers
 */
describe('Workorder Sync', function() {
  var server = proxyquire('./server.js', {
    'fh-wfm-sync/lib/server': mockSync
  });

  //Create
  it('should publish to done create cloud topic when the request to create a workorder has been completed', function(done) {
    var data = {value: 'test-workorder-create'};
    var topicId = "testId";

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workorders:create", function(createdWorkorder) {
      //Publish to done create data topic to fake workorder creation by storage module
      mediator.publish("done:wfm:cloud:data:workorders:create:" + createdWorkorder.id, createdWorkorder);
    });

    mediator.request("wfm:cloud:workorders:create", [data, topicId], {uid: topicId}).then(function(createdWorkorder) {
      assert.equal(data.value, createdWorkorder.value, "Created Workorder should have the same value as initial data passed during request");
      assert(createdWorkorder.id, "Created workorder should have a generated id field");
      done();
    });

  });

  //List
  it('should publish to done list cloud topic when the request to list a workorder has been completed', function(done) {
    var listWorkorderArray = [{id: 'test-workorder-1', value:'test-workorder'},
      {id: 'test-workorder-2', value:'test-workorder'},
      {id: 'test-workorder-3', value:'test-workorder'}];

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workorders:list", function() {
      //Publish to done list data topic to fake getting the list of workorders by storage module
      mediator.publish("done:wfm:cloud:data:workorders:list", listWorkorderArray);
    });

    mediator.request("wfm:cloud:workorders:list").then(function(listWorkorder) {
      assert(listWorkorder, "Should return the list of workorders");
      assert.deepEqual(listWorkorder, listWorkorderArray, "List of workorders received should be the same as the list of workorders passed by the mock storage module");
      done();
    });

  });

  // Update
  it('should publish to done update cloud topic when the request to update a workorder has been completed', function(done) {
    var workorderToUpdate = {id:'testID', value: 'workorder-updated'};

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workorders:update", function(workorderToUpdate) {
      //Publish to done update data topic to fake getting the update of workorders by storage module
      mediator.publish("done:wfm:cloud:data:workorders:update:" + workorderToUpdate.id, workorderToUpdate);
    });

    mediator.request("wfm:cloud:workorders:update", workorderToUpdate, {uid: workorderToUpdate.id}).then(function(updatedWorkorder) {
      assert(updatedWorkorder, "Should return the updated workorder");
      assert.deepEqual(updatedWorkorder, workorderToUpdate, "The workorder updated should be the same as the workorder returned by the mock storage module");
      done();
    });
  });

  //Read
  it('should publish to done read cloud topic when the request to read a workorder has been completed', function(done) {
    var workorderRead = {id:'testID', value: 'workorder-read'};
    var uid = "testID";

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workorders:read", function(uid) {
      //Publish to done read data topic to fake the reading of workorders by storage module
      mediator.publish("done:wfm:cloud:data:workorders:read:" + uid, workorderRead);
    });

    mediator.request("wfm:cloud:workorders:read", uid).then(function(readWorkorder) {
      assert(readWorkorder, "Should return the workorder read");
      assert.equal(uid, readWorkorder.id, "Workorder Read should have the same id as the uid given in the request");
      done();
    });
  });

  //Delete
  it('should publish to done delete cloud topic when the request to delete a workorder has been completed', function(done) {
    var workorderToDelete = {id:'testID', value: 'workorder-deleted'};
    var uid = "testID";

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workorders:delete", function(uid) {
      //Publish to done delete data topic to fake the deleteing of workorders by storage module
      mediator.publish("done:wfm:cloud:data:workorders:delete:" + uid, workorderToDelete);
    });

    mediator.request("wfm:cloud:workorders:delete", uid).then(function(deletedWorkorder) {
      assert(deletedWorkorder, "Should return the deleted workorder");
      assert.equal(uid, deletedWorkorder.id, "Deleted workorder should have the same id as the uid given in the request");
      done();
    });
  });

});