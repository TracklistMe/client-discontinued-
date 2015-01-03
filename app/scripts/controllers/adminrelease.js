'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminreleaseCtrl
 * @description
 * # AdminreleaseCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdminreleaseCtrl', function ($scope,$state, $auth, $stateParams,$http,Account, FileUploader) {
  	$scope.release;
  	$scope.releaseId = $stateParams.id;








    $scope.getRelease = function(){
 		$http.get('http://localhost:3000/releases/'+$scope.releaseId)
      		.success(function(data) {
      			console.log(data)
          		$scope.release = data
        	})
 	}
 	$scope.getRelease();

  });
