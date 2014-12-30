'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminlabelCtrl
 * @description
 * # AdminlabelCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdminlabelCtrl', function ($scope,$state, $auth, $stateParams,$http,Account, FileUploader) {
 		var labelId = $stateParams.id
	  	$scope.label = null

	  	var uploader = $scope.uploader = new FileUploader({
	        url: 'http://localhost:3000/labels/'+labelId+'/profilePicture/500/500/',
	        headers: {'Authorization': 'Bearer '+$auth.getToken()},
	        data: {user: $scope.user},
	    });

		
	  	 
 		uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            uploader.queue[0].upload();
            uploader.queue.pop();
        };
  		uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $scope.getLabel();
        };



        var catalogUploader = $scope.catalogUploader = new FileUploader({
	        url: 'http://localhost:3000/labels/'+labelId+'/dropzone/',
	        headers: {'Authorization': 'Bearer '+$auth.getToken()},
	    });	  	



        $scope.getLabel = function(){
 		$http.get('http://localhost:3000/labels/'+labelId)
      		.success(function(data) {
          		$scope.label = data
	        	})
	 	}

	 	$scope.getLabel();
 
  	});

 