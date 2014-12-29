'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompanyCtrl
 * @description
 * # AdmincompanyCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdmincompanyCtrl', function ($scope,$state, $auth, $stateParams,$http,Account, FileUploader) {
  	var companyId = $stateParams.id
  	$scope.company = {}

  	var uploader = $scope.uploader = new FileUploader({
        url: 'http://localhost:3000/upload/',
        headers: {'Authorization': 'Bearer '+$auth.getToken()},
        data: {user: $scope.user},

    });

    $scope.getCompany = function(){
 		$http.get('http://localhost:3000/companies/'+companyId)
      		.success(function(data) {
          		$scope.company = data
        	})
 	}

 	$scope.getCompany();


  });
