'use strict';

/**
 * @ngdoc function
 * @name tracklistmeApp.controller:ArtistCtrl
 * @description
 * # ArtistCtrl
 * Controller of the tracklistmeApp
 */
app.controller('ArtistCtrl', function($location, $scope, $state,
  $auth, $stateParams, $http, CONFIG) {
  var artistId = $stateParams.id

  console.log("Artist PAGE")
  $scope.serverURL = CONFIG.url
  $scope.artist;
  $scope.allArtists = []

  $scope.getArtist = function() {
    $http.get(CONFIG.url + '/artists/' + artistId)
      .success(function(data) {
        $scope.artist = data

      })
  }
  $scope.getArtist()

});
