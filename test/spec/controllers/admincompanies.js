'use strict';

describe('Controller: AdmincompaniesCtrl', function () {

  // load the controller's module
  beforeEach(module('tracklistmeApp'));

  var AdmincompaniesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdmincompaniesCtrl = $controller('AdmincompaniesCtrl', {
      $scope: scope
    });
  }));
 
});
