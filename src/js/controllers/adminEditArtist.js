'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:AdmincompaniesCtrl
 * @description
 * # AdmincompaniesCtrl
 * Controller of the tracklistmeApp
 */
app.controller('AdminEditArtist', function($location, $scope, $state, $auth,
  $stateParams, $http, $modal, Account, CONFIG) {

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
  $scope.artists = null;

  $scope.updateArtistList = function() {
    $http.get(CONFIG.url + '/me/artists/')
      .success(function(data) {
        $scope.artists = data;
      });
  };

  $scope.updateArtistList();

});
