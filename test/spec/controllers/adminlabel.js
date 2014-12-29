'use strict';

describe('Controller: AdminlabelCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var AdminlabelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminlabelCtrl = $controller('AdminlabelCtrl', {
      $scope: scope
    });
  }));

});
