'use strict';

describe('Controller: AdminartistsCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var AdminartistsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminartistsCtrl = $controller('AdminartistsCtrl', {
      $scope: scope
    });
  }));

   
});
