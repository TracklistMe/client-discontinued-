'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminreleaseCtrl
 * @description
 * # AdminreleaseCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdminreleaseCtrl', function ($scope,$state, $auth, $stateParams,$http,Account, FileUploader, CONFIG) {
  	$scope.release = null;
    $scope.serverURL = CONFIG.url
  	$scope.releaseId = $stateParams.id;
  	$scope.editedTrack = null
  	$scope.temporaryTrack = null
  	var CHARACTER_BEFORE_SEARCH = 3
  	$scope.isSearching = false
    $scope.nameAvailable = false
    $scope.nameTooShort = true
    $scope.searchArtistResults = null
      


    $scope.addArtist = function(){
    	$http.post(CONFIG.url + '/artists/', {displayName:$scope.searchArtistField}).
		  success(function(data, status, headers, config) {
		  	$scope.searchArtist();
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
    }

    $scope.addAsProducer = function(artist){
    	$scope.editedTrack.Producer.push(artist);

    }
    $scope.addAsRemixer = function(artist){
    	$scope.editedTrack.Remixer.push(artist);
    }

    $scope.deleteProducer = function(artist){
    	var index = -1;
    	for (var i = $scope.editedTrack.Producer.length - 1; i >= 0; i--) {
    		if($scope.editedTrack.Producer[i].id == artist.id){
    			index = i;
    		}	
    	};
    	$scope.editedTrack.Producer.splice(index, 1);
    }
    $scope.deleteRemixer = function(remixer){

    	var index = -1;
    	for (var i = $scope.editedTrack.Remixer.length - 1; i >= 0; i--) {
    		if($scope.editedTrack.Remixer[i].id == remixer.id){
    		  index = i;
    		}	
    	};
    	$scope.editedTrack.Remixer.splice(index, 1);
    	console.log($scope.editedTrack.Remixer)

    }

  	$scope.searchArtist = function() { 
      	if($scope.searchArtistField.length > CHARACTER_BEFORE_SEARCH){
      		$scope.isSearching = true;
      		$scope.nameTooShort = false;
      		$http.get(CONFIG.url + '/artists/search/'+$scope.searchArtistField)
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
 		$http.get(CONFIG.url + '/releases/'+$scope.releaseId)
      		.success(function(data) {
      			console.log(data)
          		$scope.release = data
        	})
 	}
 	$scope.getRelease();

  });
