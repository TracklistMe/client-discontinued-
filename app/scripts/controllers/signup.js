'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:SignupCtrl
 * @description
 * # SignupCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('SignupCtrl', function($scope, $alert, $auth) {
    $scope.signup = function() {
      $auth.signup({
        displayName: $scope.displayName,
        email: $scope.email,
        password: $scope.password
      }).catch(function(response) {
        $alert({
          content: response.data.message,
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });
    };
  });
