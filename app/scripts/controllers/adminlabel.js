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
	  	$scope.dropZoneFiles = null
	  	$scope.releasesToProcess  = null

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

        catalogUploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        catalogUploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        catalogUploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        catalogUploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        catalogUploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        catalogUploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        catalogUploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        catalogUploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        catalogUploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        catalogUploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        catalogUploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            catalogUploader.clearQueue()
        };

        $scope.getLabel = function(){
 		$http.get('http://localhost:3000/labels/'+labelId)
      		.success(function(data) {
          		$scope.label = data
	        	})
	 	}

	 	$scope.getDropZoneFiles = function(){
 		$http.get('http://localhost:3000/labels/'+labelId+'/dropZoneFiles')
      		.success(function(data) {
          		$scope.dropZoneFiles = data
	        	})
	 	}
	 	$scope.getToProcessReleases = function(){
 		$http.get('http://localhost:3000/labels/'+labelId+'/processReleases/info')
      		.success(function(data) {
          		$scope.releasesToProcess = data
	        	})
	 	}
	 	$scope.getToProcessReleases();
	 	$scope.getDropZoneFiles();
	 	$scope.getLabel();
 
  	});

 