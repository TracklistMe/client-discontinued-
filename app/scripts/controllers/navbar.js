'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('NavbarCtrl', function ($scope, $auth) {
  	$scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

  
  });
