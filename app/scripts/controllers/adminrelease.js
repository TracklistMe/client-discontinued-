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
  	$scope.release = null;
  	$scope.releaseId = $stateParams.id;
  	$scope.editedTrack = null
  	$scope.temporaryTrack = null
  	var CHARACTER_BEFORE_SEARCH = 3
  	$scope.isSearching = false
    $scope.nameAvailable = false
    $scope.nameTooShort = true
    $scope.searchArtistResults = null
     


  	$scope.searchArtist = function() { 
      	if($scope.searchArtistField.length > CHARACTER_BEFORE_SEARCH){
      		$scope.isSearching = true;
      		$scope.nameTooShort = false;
      		$http.get('http://localhost:3000/artists/search/'+$scope.searchArtistField)
      		.success(function(data) {
      			          		
          		$scope.isSearching = false
          		if(!data){
          			//!date --> the object is empty, there is no other company with this name, the name is available
          			$scope.nameAvailable = true
          		}else{
          			//date --> the object has something
          			$scope.searchArtistResults = data

          		}
        	})
      	} else {
      		$scope.nameTooShort = true;
      	}
   	};


  	$scope.editTrack = function(trackId){
  		for (var i = $scope.release.Tracks.length - 1; i >= 0; i--) {
  			if($scope.release.Tracks[i].id == trackId){
  				$scope.editedTrack = $scope.release.Tracks[i];
  			}	
  		};
  	 
  	}


    $scope.getRelease = function(){
 		$http.get('http://localhost:3000/releases/'+$scope.releaseId)
      		.success(function(data) {
      			console.log(data)
          		$scope.release = data
        	})
 	}
 	$scope.getRelease();

  });
