'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:NavbarCtrl
 * @description
 * # NavbarCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('NavbarCtrl', function ($scope, $auth,Account) {

  
  	
  	$scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
    $scope.showHideDropDown = function(){
    	$scope.showAccountDropDown = !$scope.showAccountDropDown
    }
    $scope.showAccountDropDown = true
    Account.getProfile()
        .success(function(data) {
          console.log(data)
          $scope.user = data;
        })
    

  
  });
