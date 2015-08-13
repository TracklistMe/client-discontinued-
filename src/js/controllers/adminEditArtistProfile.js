'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminEditArtistProfile',
  function($location, $scope, $state, $auth, $stateParams, $http, $modal,
    Account, FileUploader, CONFIG) {
    var artistId = $scope.artistId = $stateParams.id;
    $scope.serverURL = CONFIG.url;

    $scope.itemsByPage = 10;
    $scope.currentArtist = null;
    $scope.isSearching = false;
    $scope.editIsSearching = false;
    $scope.nameAvailable = false;
    $scope.editNameAvailable = false;

    $scope.nameTooShort = true;
    $scope.editNameTooShort = true;
    $scope.searchUserResults = [];

    var artistEndPoint = CONFIG.url + '/artists/';
    var profilePictureAPIEndPoint = artistEndPoint + $scope.artistId + '/profilePicture/1400/1400/';

    var uploader = $scope.uploader = new FileUploader({
      method: 'POST',
      url: CONFIG.url + '/artists/' + artistId + '/profilePicture/'
    });

    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      var file = fileItem;
      var filename = file._file.name;
      $http.post(
        CONFIG.url + '/artists/' + artistId + '/profilePicture/createFile/', {
          filename: filename,
        }).success(function(data, status, headers, config) {
        console.log("DONE")
        var formDataArray = [{
          "GoogleAccessId": data.GoogleAccessId,
          "signature": data.signature,
          "policy": data.policy,
          "key": data.key
        }]
        file.url = data.action;
        file.formData = formDataArray;
        file.upload();


      }).error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      //uploader.queue[0].upload();
      //uploader.queue.pop();
    };

    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
      $scope.getArtist();
    };

    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);

      $http.post(
          CONFIG.url +
          '/artists/' +
          artistId +
          '/profilePicture/confirmFile/', {})
        .success(function(data, status, headers, config) {
          $scope.getCompany();
        })
    };


    $scope.getArtist = function() {
      $http.get(CONFIG.url + '/artists/' + artistId)
        .success(function(data) {
          $scope.artist = data;
          $scope.artist.avatar =
            CONFIG.url + '/artists/' +
            artistId +
            '/profilePicture/small/' +
            '?d=' + Date.now();
          $scope.artist.largeAvatar =
            CONFIG.url + '/artists/' +
            artistId +
            '/profilePicture/large/' +
            '?d=' + Date.now();
        });
    }

    $scope.getArtist()
  });
