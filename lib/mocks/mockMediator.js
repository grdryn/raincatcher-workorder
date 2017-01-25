var sinon = require('sinon');
require('sinon-as-promised');

var mockCreatedworkorder = {id: 'testId'},
  mockListworkorder = [],
  mockUpdatedworkorder = {id: 'testId'},
  mockReadworkorder = {id: 'testId', value: 'test-workorder-read'},
  mockDeletedworkorder = {id:'testId', value: 'test-workorder-delete'},
  mockTopicId = "testId",
  mockUID = "testId";

/**
 * Function which mocks the subscribe functionality of mediator.
 * @returns {stub}
 */
function subscribe() {
  var subscribeStub = sinon.stub();

  subscribeStub.withArgs("wfm:cloud:workorders:create", sinon.match.func)
    .callsArgWith(1, mockCreatedworkorder, mockTopicId);

  subscribeStub.withArgs("wfm:cloud:workorders:list", sinon.match.func)
    .callsArg(1);

  subscribeStub.withArgs("wfm:cloud:workorders:update", sinon.match.func)
    .callsArgWith(1, mockCreatedworkorder);

  subscribeStub.withArgs("wfm:cloud:workorders:read", sinon.match.func)
    .callsArgWith(1, mockUID);

  subscribeStub.withArgs("wfm:cloud:workorders:delete", sinon.match.func)
    .callsArgWith(1, mockUID);


  subscribeStub.throws("Invalid Argument");

  return subscribeStub;
}

/**
 * Function which mocks the request functionality of mediator.
 * @returns {stub}
 */
function request() {
  var requestStub = sinon.stub();

  requestStub.withArgs("wfm:cloud:data:workorders:create", sinon.match.object, sinon.match.object)
    .resolves(mockCreatedworkorder);

  requestStub.withArgs("wfm:cloud:data:workorders:list")
    .resolves(mockListworkorder);

  requestStub.withArgs("wfm:cloud:data:workorders:update", sinon.match.object, sinon.match.object)
    .resolves(mockUpdatedworkorder);

  requestStub.withArgs("wfm:cloud:data:workorders:read", sinon.match.string)
    .resolves(mockReadworkorder);

  requestStub.withArgs("wfm:cloud:data:workorders:delete", sinon.match.string)
    .resolves(mockDeletedworkorder);

  requestStub.throws("Invalid Argument");
  return requestStub;
}

/**
 * Function which mocks the publish functionality of mediator.
 * @returns {stub}
 */
function publish() {
  var publishStub = sinon.stub();
  var doneTopic = "done:wfm:cloud:workorders:";

  publishStub.withArgs(doneTopic + "create:" + mockTopicId, sinon.match.object);
  publishStub.withArgs(doneTopic + "list", sinon.match.object);
  publishStub.withArgs(doneTopic + "update:" + mockTopicId, sinon.match.object);
  publishStub.withArgs(doneTopic + "read:" + mockTopicId, sinon.match.object);
  publishStub.withArgs(doneTopic + "delete:" + mockTopicId, sinon.match.object);

  publishStub.throws("Invalid Argument");
  return publishStub;
}

module.exports = {
  subscribe: subscribe(),
  request: request(),
  publish: publish()
};
