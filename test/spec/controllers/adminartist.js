'use strict';

describe('Controller: AdminartistCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var AdminartistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminartistCtrl = $controller('AdminartistCtrl', {
      $scope: scope
    });
  }));

   
});
