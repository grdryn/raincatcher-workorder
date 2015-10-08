# FeedHenry WFM workorder

A workorder module for FeedHenry WFM.

## Dependencies
This module depends on the [fh-wfm-mediator](https://www.npmjs.com/package/fh-wfm-mediator) WFM module.

## Browserify usage in an angular.js client

### Setup
This module is packaged in a CommonJS format, exporting the name of the Angular namespace.  The module can be included in an angular.js as follows:

```javascript
angular.module('app', [
, require('fh-wfm-mediator')
, require('fh-wfm-workorder')
...
])
```

### Client side events
The module listens for, and responds with the following mediator events:

| Listens for | Responds with |
| ----------- | ------------- |
| `workorder:load` | `workorder:loaded` |
| `workorders:load` | `workorders:loaded` |
| `workorder:save` | `workorder:saved` |
| `workorder:save` | `workorder:saved` |
| `workorder:create` | `workorder:created` |
| `workorder:new` | `workorder:new:done` |
|  | `workorder:selected` |
|  | `workorder:edited` |
|  | `workorder:refreshed` |

### Integration

#### Angular controller
Events can be broadcast and listened for in angular controllers using the fh-wfm-mediator API.

Example:
```javascript
.controller('WorkorderFormController', function ($state, mediator, workorder) {
  var self = this;

  self.workorder = workorder;

  mediator.subscribe('workorder:edited', function(workorder) {
    mediator.publish('workorder:save', workorder);
    mediator.once('workorder:saved', function(workorder) {
      $state.go('app.workorder', {
        workorderId: workorder.id
      });
    })
  });
})
```

#### Ui-router integration
This module provides nice integration with the [ui-router](https://github.com/angular-ui/ui-router) project.

Listen to events to trigger navigation:

```javascript
.run(function($state, mediator) {
  mediator.subscribe('workorder:selected', function(workorder) {
    $state.go('app.workorder', {
      workorderId: workorder.id
    });
  });
})
```

Use the ui-router `resolve` API to pre-load data before rendering a page:
```javascript
.state('app.workorder', {
      url: '/workorder/:workorderId',
      templateUrl: '/app/workorder/workorder.tpl.html',
      controller: 'WorkorderController as ctrl',
      resolve: {
        workorder: function(mediator, $stateParams) {
          mediator.publish('workorder:load', $stateParams.workorderId);
          return mediator.promise('workorder:loaded');
        }
      }
    })
```

## Usage in an express backend

### Setup
The server-side component of this WFM module exports a function that takes express and mediator instances as parameters, as in:

```javascript
var express = require('express')
  , app = express()
  , mediator = require('fh-wfm-mediator/mediator')
  ;

// configure the express app
...

// setup the wfm routes
require('fh-wfm-workorder/router')(mediator, app);
require('fh-wfm-workflow/router')(mediator, app);
```

### Server side events
the module broadcasts, and listens for the following events

| Listens for | Responds with |
| ----------- | ------------- |
| `workorders:load` | `workorders:loaded` |
| `workorder:load` | `workorder:loaded` |
| `workorder:save` | `workorder:saved` |
| `workorder:create` | `workorder:created` |

### Integrating
The application will listen for the above events, and respond with the appropriate data attached to the corresponding response event.

Example:

```javascript
var _ = require('lodash');

var workorders = [
  { id: 1276001, type: 'Job Order', title: 'Footpath in disrepair', status: 'In Progress', address: '118 N Peoria @N Chicago, IL 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276231, type: 'Job Order', title: 'Road in disrepair', status: 'Complete', address: '2116 Sussex Dr. @Redmond, WA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1276712, type: 'Job Order', title: 'Driveway in disrepair', status: 'Aborted', address: '18 Curve Cr. @San Jose, CA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 1262134, type: 'Job Order', title: 'Door in disrepair', status: 'On Hold', address: '623 Ferry St. @Boise, ID 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, type: 'Job Order', title: 'Roof in disrepair', status: 'Unassigned', address: '5528 Closed loop @Boston, MA 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'},
  { id: 12623122, type: 'Job Order', title: 'House in disrepair', status: 'New', address: '364 Driver way @Portland, OR 60607', summary: 'Please remove damaged kerb and SUPPLY AND FIX 1X DROP KERB CENTRE BN 125 X 150 cart away from site outside number 3.'}
];

module.exports = function(mediator) {
  console.log('Subscribing to mediator topic: workorders:load');
  mediator.subscribe('workorders:load', function() {
    setTimeout(function() {
      mediator.publish('workorders:loaded', workorders);
    }, 0);
  });

  mediator.subscribe('workorder:load', function(id) {
    setTimeout(function() {
      var workorder = _.find(workorders, function(_workorder) {
        return _workorder.id == id;
      });
      mediator.publish('workorder:loaded:' + id, workorder);
    }, 0);
  });

  mediator.subscribe('workorder:save', function(workorder) {
    setTimeout(function() {
      var index = _.findIndex(workorders, function(_workorder) {
        return _workorder.id == workorder.id;
      });
      workorders[index] = workorder;
      console.log('Saved workorder:', workorder);
      mediator.publish('workorder:saved:' + workorder.id, workorder);
    }, 0);
  });

  mediator.subscribe('workorder:create', function(workorder) {
    setTimeout(function() {
      workorder.id = workorders.length;
      workorders.push(workorder);
      console.log('Created workorder:', workorder);
      mediator.publish('workorder:created:' + workorder.createdTs, workorder);
    }, 0);
  });
}
```
