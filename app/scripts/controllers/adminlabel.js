'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminlabelCtrl
 * @description
 * # AdminlabelCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdminlabelCtrl', function ($location,$scope,$state, $auth, $stateParams,$http,Account, FileUploader) {
 		var labelId = $stateParams.id
	  	$scope.label = null
	  	$scope.dropZoneFiles = null
	  	$scope.releasesToProcess  = null
	  	$scope.catalog = null

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
            $scope.getDropZoneFiles();
        };
        catalogUploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            catalogUploader.clearQueue()
            $scope.getToProcessReleases();
			$scope.getDropZoneFiles();
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
	 	$scope.processReleases = function(){
	 		$http.post('http://localhost:3000/labels/'+labelId+'/processReleases/', {}).
			  success(function(data, status, headers, config) {
			  		console.log("DONE")
			  		$scope.getToProcessReleases();
				 	$scope.getDropZoneFiles();
				 	$scope.getCatalog();
			  }).
			  error(function(data, status, headers, config) {
			    // called asynchronously if an error occurs
			    // or server returns response with an error status.
			  });

	 	}

	 	$scope.getToProcessReleases = function(){
 		$http.get('http://localhost:3000/labels/'+labelId+'/processReleases/info')
      		.success(function(data) {
          		$scope.releasesToProcess = data
	        	})
	 	}

	 	$scope.adminRelease = function(id){
	 		console.log("adminRelease")
	 		$location.path('adminRelease/'+id);
	 	}
	 	$scope.getCatalog  = function(){
 		$http.get('http://localhost:3000/labels/'+labelId+'/catalog')
      		.success(function(data) {
          		$scope.catalog = data
          		console.log(data)
	        	})
	 	}
	 	$scope.getToProcessReleases();
	 	$scope.getDropZoneFiles();
	 	$scope.getCatalog();
	 	$scope.getLabel();
 
  	});

 