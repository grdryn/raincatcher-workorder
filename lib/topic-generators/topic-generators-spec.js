var topicGenerators = require('./index');
var expect = require('chai').expect;

describe("Topic Generators", function() {

  describe("Workorders Topics", function() {

    describe("createTopic", function() {

      it("No Item ID", function() {
        var generatedTopic = topicGenerators.createTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("wfm:workorders:testtopicname");
      });

      it("Item ID", function() {
        var generatedTopic = topicGenerators.createTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("wfm:workorders:testtopicname:testdatasetitemid");
      });

    });

    describe("errorTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.errorTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("error:wfm:workorders:testtopicname");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.errorTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("error:wfm:workorders:testtopicname:testdatasetitemid");
      });

    });

    describe("doneTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.doneTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("done:wfm:workorders:testtopicname");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.doneTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("done:wfm:workorders:testtopicname:testdatasetitemid");
      });

    });

  });

  describe("Sync Topics", function() {

    describe("createTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("wfm:sync:testtopicname:workorders");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("wfm:sync:testtopicname:workorders:testdatasetitemid");
      });

    });

    describe("errorTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncErrorTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("error:wfm:sync:testtopicname:workorders");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncErrorTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("error:wfm:sync:testtopicname:workorders:testdatasetitemid");
      });

    });

    describe("doneTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncDoneTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("done:wfm:sync:testtopicname:workorders");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncDoneTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("done:wfm:sync:testtopicname:workorders:testdatasetitemid");
      });

    });

  });
});



