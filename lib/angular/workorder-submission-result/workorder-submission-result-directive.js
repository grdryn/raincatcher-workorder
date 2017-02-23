var CONSTANTS = require('../../constants');


//TODO: This is a bit odd, might want to reonsider this....
angular.module(CONSTANTS.WORKORDER_DIRECTIVE).directive('workorderSubmissionResult', function($compile) {
  var render = function(scope, element) {
    if (!scope.result) {
      return;
    }
    var result = scope.result;
    var template = '';
    if (scope.step.formId) {
      var submission = result.submission;
      if (submission._submission) {
        template = '<appform-submission submission="result.submission._submission"></appform-submission>';
      } else if (submission.submissionId) {
        template = '<appform-submission submission-id="\''+submission.submissionId+'\'"></appform-submission>';
      } else if (submission.submissionLocalId) {
        template = '<appform-submission submission-local-id="\''+submission.submissionLocalId+'\'"></appform-submission>';
      }
    } else {
      template = scope.step.templates.view;
    }
    element.append(template);
    $compile(element.contents())(scope);
  };

  return {
    restrict: 'E'
    , scope: {
      result: '='
      , step: '='
    }
    , link: function(scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
});