'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('LoginCtrl', function($scope, $alert, $auth) {
    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
         
          $alert({
            content: 'You have successfully logged in',
            animation: 'fadeZoom',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
         
          $alert({
            content: response.data.message,
            animation: 'fadeZoom',
            type: 'material',
            duration: 3
          });
        });
    };
    $scope.authenticate = function(provider) {
      console.log("TENTATIVO DI AUTENTICAZIONE CON "+provider)
      $auth.authenticate(provider)
        .then(function() {
        	console.log("AUTENTICATO UFFICIALMENTE")
          $alert({
            content: 'You have successfully logged in',
            animation: 'fadeZoom',
            type: 'material',
            duration: 3
          });
        })
        .catch(function(response) {
        	console.log(response)
          $alert({
            content: response.data.message,
            animation: 'fadeZoom',
            type: 'material',
            duration: 3
          });
        });
    };
  });