'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the tracklistmeApp
 */
angular.module('tracklistmeApp')
 .controller('ProfileCtrl', function($scope,$http, $timeout, $auth, $alert, Account, FileUploader,CONFIG) {
        $scope.labels = {}
        $scope.artists = {}
        $scope.companies = {}
        $scope.serverURL = CONFIG.url;
        
        var uploader = $scope.uploader = new FileUploader({
            url: CONFIG.url + '/upload/profilePicture/500/500',
            method: 'POST',
            headers: {'Authorization': 'Bearer '+$auth.getToken()},
            formData:[]
        });
        uploader.onBeforeUploadItem = function(item) {
        item.formData.push({resize:{width:500,height:500}});
        }
        

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            uploader.queue[0].upload();
            uploader.queue.pop();
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
         

        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
            $scope.getProfile();
        };

 
    /**
     * Get user's profile information.
     */
    $scope.getProfile = function() {

      Account.getProfile()
        .success(function(data) {
          $scope.user = data;
          $scope.user.avatar = CONFIG.url+"/images/"+data.avatar;
          console.log($scope.user)
        })
        .error(function(error) {
          $alert({
            content: error.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };


    /**
     * Update user's profile information.
     */
    $scope.updateProfile = function() {
      Account.updateProfile({
        displayName: $scope.user.displayName,
        email: $scope.user.email
      }).then(function() {
        $alert({
          content: 'Profile has been updated',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });
    };

    /**
     * Link third-party provider.
     */
    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          $alert({
            content: 'You have successfully linked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .then(function() {
          $scope.getProfile();
        })
        .catch(function(response) {
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

    /**
     * Unlink third-party provider.
     */
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $alert({
            content: 'You have successfully unlinked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .then(function() {
          $scope.getProfile();
        })
        .catch(function(response) {
          $alert({
            content: response.data ? response.data.message : 'Could not unlink ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

 
 	$scope.getCompanies = function(){
 		$http.get(CONFIG.url + '/me/companies/')
      		.success(function(data) {
          		$scope.companies = data
        	})
 	}
  $scope.getLabels = function(){
    $http.get(CONFIG.url + '/me/labels/')
          .success(function(data) {
              $scope.labels = data
          })
  }
  $scope.getArtists = function(){
    $http.get(CONFIG.url + '/me/artists/')
          .success(function(data) {
              $scope.artists = data
          })
  }

  $scope.getArtists();
  $scope.getProfile();
  $scope.getLabels();
 	$scope.getCompanies();


  });
