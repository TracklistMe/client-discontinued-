'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdmincompaniesCtrl', function ($scope,$http) {
    // add new company form
    var CHARACTER_BEFORE_SEARCH = 2;
    
    $scope.changed = function() {
      if($scope.userType.length > CHARACTER_BEFORE_SEARCH){
      	$http.get('http://localhost:3000/companies/search/'+$scope.userType)
      	.success(function(data) {
          console.log(data)
          $scope.user = data;
        })
      }
   	};


  });
