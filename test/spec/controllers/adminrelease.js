'use strict';

describe('Controller: AdminreleaseCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var AdminreleaseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminreleaseCtrl = $controller('AdminreleaseCtrl', {
      $scope: scope
    });
  }));

  
});
