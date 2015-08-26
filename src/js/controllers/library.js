'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 * Controller for the user library. Display all the tracks that the artist
 * bought.
 */
app.controller('LibraryCtrl', function($location, $scope, $state,
  $auth, $stateParams, $http, CONFIG, Account) {

  $scope.serverURL = CONFIG.url;
  $scope.artist = null;
  $scope.library = [];



  $scope.getLibrary = function() {
    Account.getProfile()
      .success(function(data) {
        $scope.user = data;
        $http.get(CONFIG.url + '/me/library/')
          .success(function(data) {
            console.log(data);
            $scope.library = data;
          });
      });



  };
  $scope.getLibrary();

});
