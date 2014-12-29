'use strict';

describe('Controller: AdmincompanyCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var AdmincompanyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdmincompanyCtrl = $controller('AdmincompanyCtrl', {
      $scope: scope
    });
  }));
 
});
