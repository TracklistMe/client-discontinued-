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
  	var CHARACTER_BEFORE_SEARCH = 4;
  	var CHARACTER_BEFORE_SEARCH_USER = 3;
  	$scope.isSearching = false
    $scope.nameAvailable = false
    $scope.nameTooShort = true
    $scope.searchUserResults = null  
  	$scope.currentLabel = null
  	$scope.labelList = {}
  	

  	var uploader = $scope.uploader = new FileUploader({
        url: $rootScope.server.url + '/companies/'+companyId+'/profilePicture/500/500/',
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
            $scope.getCompany();
        };

  	$scope.addLabel = function(){
   		console.log("ADD Label")
   		// TODO STRING SANITIZING
   		$http.post($rootScope.server.url + '/labels/', {companyId:companyId, labelName: $scope.seachLabelField}).
		  success(function(data, status, headers, config) {
		  	$scope.updateLabelList();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}


    $scope.searchLabelAvailability = function() { 
      	if($scope.seachLabelField.length > CHARACTER_BEFORE_SEARCH){
      		$scope.isSearching = true;
      		$scope.nameTooShort = false;
      		$http.get($rootScope.server.url + '/labels/search/'+$scope.seachLabelField)
      		.success(function(data) {
          		
          		$scope.isSearching = false
          		if(!data){
          			//!date --> the object is empty, there is no other company with this name, the name is available
          			$scope.nameAvailable = true
          		}else{
          			//date --> the object has something
          			$scope.nameAvailable = false
          		}
        	})
      	} else {
      		$scope.nameTooShort = true;
      	}
   	};

   	$scope.addLabelManager = function(){
   		var newLabelManager = $scope.searchUserResults[0].id;
   		var labelId = $scope.currentLabel.id;
   	 
   	 
   		$http.post($rootScope.server.url + '/labels/'+labelId+"/labelManagers/", {newLabelManager:newLabelManager}).
		  success(function(data, status, headers, config) {
		  	$scope.editLabel(labelId)
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	$scope.removeLabelManager = function(userId){
   		var labelId = $scope.currentLabel.id;
   		$http.delete($rootScope.server.url + '/labels/'+labelId+"/labelManagers/"+userId).
		  success(function(data, status, headers, config) {
		  	$scope.editLabel(labelId)
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
   	}

   	$scope.selectFromMultipleUsers = function(user){
   		// create as an array to align to api return tyep 
   		$scope.searchUserResults = [user];
   		console.log($scope.searchUserResults)

   	}


   	$scope.searchUser = function() {
   		if($scope.searchUserField.length > CHARACTER_BEFORE_SEARCH_USER){
	   		$http.get($rootScope.server.url + '/users/search/'+$scope.searchUserField)
	      		.success(function(data) {
	          		$scope.searchUserResults = data
   					console.log($scope.searchUserResults)
	        	})
	    }
   	}



   	$scope.updateLabelList = function(){
   		$http.get($rootScope.server.url + '/companies/'+companyId+"/labels")  // ATTENTION ONLY THE LABEL THAT ARE PART OF THIS COMPANY 
      		.success(function(data) {
      				console.log(data)
          			$scope.labelList = data
          		
        	})
   	}

	$scope.editLabel = function(idLabel){
   		$http.get($rootScope.server.url + '/labels/'+idLabel)
      		.success(function(data) {
      				console.log(data)
          			$scope.currentLabel = data
          	})
   	}




    $scope.getCompany = function(){
 		$http.get($rootScope.server.url + '/companies/'+companyId)
      		.success(function(data) {
          		$scope.company = data
        	})
 	}

   	$scope.updateLabelList()
 	$scope.getCompany();


  });
