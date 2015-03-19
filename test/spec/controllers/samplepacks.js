'use strict';

describe('Controller: SamplepacksCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var SamplepacksCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SamplepacksCtrl = $controller('SamplepacksCtrl', {
      $scope: scope
    });
  }));

   
});
