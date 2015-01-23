'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdminartistCtrl
 * @description
 * # AdminartistCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
  .controller('AdminartistCtrl', function ($scope,$state, $auth, $http, $stateParams, FileUploader, CONFIG) {
    var artistId = $stateParams.id
    $scope.serverURL = CONFIG.url 

  	var uploader = $scope.uploader = new FileUploader({
        url: CONFIG.url + '/artists/'+artistId+'/profilePicture/1400/1400/',
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
            $scope.getArtist();
    };




    $scope.getArtist = function(){
 		$http.get( CONFIG.url + '/artists/'+artistId)
      		.success(function(data) {
          		$scope.artist = data
              $scope.artist.avatar = CONFIG.url+"/images/"+$scope.artist.avatar;
        	})
 	} 

 	$scope.getArtist();
  });
